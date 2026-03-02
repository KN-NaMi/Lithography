import os
import serial
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/movement", tags=["movement"])

PORT = os.getenv("SMC100_PORT", "/dev/ttyUSB0")
BAUD = int(os.getenv("SMC100_BAUD", "57600"))

class MoveRequest(BaseModel):
    distance: float
    axis: int = 1

@router.post("/move")
async def move_axis(req: MoveRequest):
    try:
        with serial.Serial(PORT, BAUD, timeout=0.5) as ser:
            cmd = f"{req.axis}PR{req.distance}\r\n"
            ser.write(cmd.encode())
            return {"message": "Command sent", "command": cmd.strip()}
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Serial error: {e}")