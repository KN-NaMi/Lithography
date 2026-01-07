import asyncio
import os
import shutil
import time
from fastapi import FastAPI, Form, UploadFile, File, WebSocket, WebSocket, WebSocketDisconnect
from fastapi.responses import HTMLResponse, JSONResponse, FileResponse
import av

app = FastAPI()

RTSP_URL = "rtsp://127.0.0.1:8554/test"
MASKS_PATH = "/etc/lithography/masks"
ACTIVE_MASK_PATH = "/etc/lithography/active-mask"

os.makedirs(MASKS_PATH, exist_ok=True)

mask_cid = 0;

@app.get("/ping")
async def ping():
    return JSONResponse({"message": "pong"})

@app.websocket("/mask/changed")
async def notify_changes(ws: WebSocket):
    await ws.accept();
    last_mask = mask_cid;
    while 1:
        try:
            if mask_cid != last_mask:
                last_mask = mask_cid;
                await ws.send_text("/mask/view");
            await asyncio.sleep(1);
        except WebSocketDisconnect:
            return;

@app.get("/mask/realtime")
async def mask_realtime():
    return FileResponse(path=ACTIVE_MASK_PATH);

@app.get("/mask/view")
async def mask_view():
    return FileResponse(path="files/maskview.html", media_type="text/html");

@app.post("/mask/rcv")
async def rcv_mask(mask: UploadFile = File(...)):
    global mask_cid;
    time_str = f"{time.time()}";
    file_path = time_str + mask.filename;
    file_path = os.path.join(MASKS_PATH, file_path);

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(mask.file, buffer);
    if os.path.exists(ACTIVE_MASK_PATH):
        os.unlink(ACTIVE_MASK_PATH);
    os.symlink(file_path, ACTIVE_MASK_PATH);

    mask_cid += 1;

    return JSONResponse({"status":"ok","filename":mask.filename});

@app.get("/mask/upload")
async def mask_upload():
    return FileResponse(path="files/maskupload.html", media_type="text/html");

