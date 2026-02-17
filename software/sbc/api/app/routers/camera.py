from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from app.utils.camera import mjpeg_stream


router = APIRouter(prefix="/camera", tags=["camera"])


@router.get("/preview")
async def camera_preview():
    return StreamingResponse(
        mjpeg_stream(), media_type="multipart/x-mixed-replace; boundary=frame"
    )
