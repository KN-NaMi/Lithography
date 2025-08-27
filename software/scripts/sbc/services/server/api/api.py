import asyncio
from fastapi import FastAPI, Form
from fastapi.responses import HTMLResponse, JSONResponse
from aiortc import RTCPeerConnection, RTCSessionDescription, VideoStreamTrack
import av

app = FastAPI()
pcs = set()

RTSP_URL = "rtsp://127.0.0.1:8554/test"


@app.get("/ping")
async def ping():
    return JSONResponse({"message": "pong"})



