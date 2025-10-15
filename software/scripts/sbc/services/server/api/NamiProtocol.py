#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import threading
import socket
from fastapi import FastAPI, HTTPException, Header, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import uuid
import json
import serial
from datetime import datetime
from pydantic import BaseModel  
import base64
import os 
import platform
import time

# --- FastAPI + CORS ---
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Model Pydantic do body JSON ---
class CommandRequest(BaseModel):
    command: str


def gcode_to_smc(command: str) -> str:
    import re
    
    match = re.match(r"[Gg]0[1|10]\s+([XYxy])(-?\d+\.?\d*)", command, re.IGNORECASE)
    if match:
        axis = match.group(1).upper()  
        value = match.group(2)
        address = "1" if axis == "X" else "3"
        return f"{address}PR{value}"
    return command

# --- Globalna zmienna na sesję ---
active_session_id = None
ser = serial.Serial('/dev/ttyUSB0', 57600, timeout=1)


# --- UDP Server ---
def udp_server():
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    sock.bind(('0.0.0.0', 5005))
    print("UDP server listening on 5005")
    while True:
        data, addr = sock.recvfrom(1024)
        print(f"UDP: {data} from {addr}")
        response = {
            "device_id": "lithography_001",
            "type": "lithography",
            "protocols": ["tcp_binary", "uart"],
            "version": "1.0",
            "software_version": "1.0"
        }
        response_json = json.dumps(response)
        sock.sendto(response_json.encode(), addr)

# --- TCP Server (INIT) ---
def tcp_server():
    global active_session_id
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.bind(('0.0.0.0', 6000))
    sock.listen()
    print("TCP server listening on 6000")
    while True:
        conn, addr = sock.accept()
        with conn:
            data = conn.recv(1024)
            print(f"TCP: {data} from {addr}")
            try:
                msg = json.loads(data.decode())
                if msg.get("cmd") == "INIT":
                    active_session_id = f"dac_001_{uuid.uuid4().hex[:8]}"
                    response_to_client = {
                        "status": "OK",
                        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                        "session_id": active_session_id
                    }
                    conn.sendall(json.dumps(response_to_client).encode())
                    print("Session started:", active_session_id)

                    # ---Send post-init SMC commands ---
                    if ser and ser.isOpen():
                        try:
                            # 1. 1TS? (status osi 1)
                            cmd_1ts = "1TS?"
                            ser.write((cmd_1ts + '\r\n').encode())
                            res_1ts = ser.readline().decode().strip()
                            print(f"Post-INIT: Sent '{cmd_1ts}', Response: '{res_1ts}'")
                            time.sleep(1)
                            # 2. 1OR (homing osi 1)
                            cmd_1or = "1OR"
                            ser.write((cmd_1or + '\r\n').encode())
                            res_1or = ser.readline().decode().strip()
                            print(f"Post-INIT: Sent '{cmd_1or}', Response: '{res_1or}'")

                            # 3. 3OR (homing osi 3 - Y)
                            cmd_3or = "3OR"
                            ser.write((cmd_3or + '\r\n').encode())
                            res_3or = ser.readline().decode().strip()
                            print(f"Post-INIT: Sent '{cmd_3or}', Response: '{res_3or}'")

                        except serial.SerialException as se:
                            print(f"Post-INIT Serial Communication Error: {se}")
                        except Exception as general_e:
                            print(f"Post-INIT General Error: {general_e}")
                    else:
                        print("WARNING: Serial port not open for Post-INIT commands.")

                else:
                    conn.sendall(b'{"status":"ERR","reason":"Not INIT"}')
            except json.JSONDecodeError:
                print("TCP INIT error: Invalid JSON received.")
                conn.sendall(b'{"status":"ERR","reason":"Invalid JSON"}')
            except Exception as e:
                print(f"TCP INIT processing error: {e}")
                conn.sendall(b'{"status":"ERR","reason":"Internal Server Error"}')

# --- FastAPI HTTP Server ---
@app.get("/status")
def status(session_id: str = Header(None)):
    if session_id != active_session_id:
        raise HTTPException(status_code=403, detail="Invalid or missing session_id")
    return {
        "status": "OK",
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "session_id": active_session_id
    }

@app.post("/gcode")
def gcode(
    req: CommandRequest,  
    session_id: str = Header(None)
):
    if session_id != active_session_id:
        raise HTTPException(status_code=403, detail="Invalid or missing session_id")
    try:
        smc_command = gcode_to_smc(req.command)
        ser.write((smc_command + '\r\n').encode())
        response = ser.readline().decode().strip()
        print("GCODE sent:", req.command, "Response:", response)
        return {"result": "sent", "command": req.command, "response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Serial error: {e}")
    
@app.post("/uploadimage")
async def upload_image(image: UploadFile = File(...)):
    try:
        # Get the path to the user's desktop
        desktop_path = os.path.join(os.path.expanduser("~"), "Desktop")
        file_location = os.path.join(desktop_path, "display.png")  # Stała nazwa pliku

        # Save the uploaded file locally on the desktop
        with open(file_location, "wb") as f:
            f.write(await image.read())
        
        print(f"Image saved at {file_location}")

        return {"status": "OK", "filename": image.filename}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image: {e}")



def start_fastapi():
    uvicorn.run(app, host="0.0.0.0", port=8000)

# --- Start all servers in threads ---
if __name__ == "__main__":
    threading.Thread(target=udp_server, daemon=True).start()
    threading.Thread(target=tcp_server, daemon=True).start()
    start_fastapi()