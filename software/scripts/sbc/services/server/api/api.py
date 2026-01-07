import asyncio
from fastapi import FastAPI, Form
from fastapi.responses import HTMLResponse, JSONResponse
from aiortc import RTCPeerConnection, RTCSessionDescription, VideoStreamTrack
import av
from aiortc import VideoStreamTrack
from fractions import Fraction

app = FastAPI()
pcs = set()

RTSP_URL = "rtsp://127.0.0.1:8554/test"
MASKS_PATH = "/etc/lithography/masks"
ACTIVE_MASK_PATH = "/etc/lithography/active-mask"

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
async def mask_view():
    return FileResponse(path=ACTIVE_MASK_PATH);

@app.get("/mask/view")
async def mask_view():
    return FileResponse(path="maskview.html", media_type="text/html");

@app.post("/mask/rcv")
async def rcv_mask(mask: UploadFile = File(...)):
    file_path = os.path.join(MASKS_PATH, mask.filename);

    buffer = open(file_path, "wb");
    shutil.copyfileobj(mask.file, buffer);
    os.symlink(file_path, ACTIVE_MASK_PATH);

    ++mask_cid;

    return JSONResponse({"status":"ok","filename":mask.filename});

@app.get("/mask/upload")
async def mask_upload():
    return FileResponse(path="maskupload.html", media_type="text/html");

