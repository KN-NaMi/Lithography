import cv2
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from app.utils.camera import mjpeg_stream, get_current_frame


router = APIRouter(prefix="/camera", tags=["camera"])


@router.get("/preview")
async def camera_preview():
    return StreamingResponse(
        mjpeg_stream(), media_type="multipart/x-mixed-replace; boundary=frame"
    )

@router.get("/image")
async def camera_image():
    frame = get_current_frame()
    _, buffer = cv2.imencode(".jpg", frame)
    return StreamingResponse(
        iter([buffer.tobytes()]), media_type="image/jpeg"
    )