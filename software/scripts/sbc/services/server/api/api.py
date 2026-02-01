import os
import shutil
import time
from fastapi import FastAPI, UploadFile, File, WebSocket, WebSocketDisconnect
from fastapi.responses import HTMLResponse, JSONResponse, FileResponse
import asyncio

app = FastAPI()

RTSP_URL = "rtsp://127.0.0.1:8554/test"
MASKS_PATH = "/etc/lithography/masks"
ACTIVE_MASK_PATH = "/etc/lithography/active-mask"
MASK_TYPES = {"image/png", "image/jpeg"}
MASK_MAX_SIZE = 64 * 1024 * 1024                   # 64mib

os.makedirs(MASKS_PATH, exist_ok=True)

mask_ch_cond = asyncio.Condition()

@app.get("/ping")
async def ping():
    return JSONResponse({"message": "pong"})

@app.websocket("/mask/changed")
async def notify_changes(ws: WebSocket):
    await ws.accept()
    try:
        while True:
            await mask_ch_cond.wait()

            await ws.send_text("/mask/view")
    except WebSocketDisconnect:
        return

@app.get("/mask/realtime")
async def mask_realtime():
    return FileResponse(path=ACTIVE_MASK_PATH)

@app.get("/mask/view")
async def mask_view():
    return FileResponse(path="files/maskview.html", media_type="text/html")

@app.post("/mask/rcv")
async def rcv_mask(mask: UploadFile = File(...)):
    # no need for magic byte checking, MIME type is enough
    if mask.content_type not in MASK_TYPES:
        raise HTTPException(status_code=400, detail="file type not in MASK_TYPES")

    mask.file.seek(0, os.SEEK_END)
    size = mask.file.tell()
    if size > MASK_MAX_SIZE:
        raise HTTPException(status_code=400, detail="file size too large")
    mask.file.seek(0)
    
    time_str = f"{time.time()}"
    file_path = time_str + mask.filename
    file_path = os.path.join(MASKS_PATH, file_path)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(mask.file, buffer)
    if os.path.exists(ACTIVE_MASK_PATH):
        os.unlink(ACTIVE_MASK_PATH)
    os.symlink(file_path, ACTIVE_MASK_PATH)

    mask_ch_cond.notify_all()

    return JSONResponse({"status":"ok","filename":mask.filename})

@app.get("/mask/upload")
async def mask_upload():
    return FileResponse(path="files/maskupload.html", media_type="text/html")

