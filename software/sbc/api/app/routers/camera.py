from fastapi import APIRouter

router = APIRouter(prefix="/camera", tags=["camera"])

@router.get("/status")
async def camera_status():
    """Endpoint for checking the status of the camera."""
    return {"status": "Camera is operational"}