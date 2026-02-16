import asyncio
import os
import shutil
from fastapi import APIRouter, File, UploadFile, WebSocket, HTTPException
from fastapi.responses import FileResponse, JSONResponse

router = APIRouter(prefix="/mask", tags=["mask"])

ACTIVE_MASK_PATH = os.getenv("ACTIVE_MASK_PATH", ".masks/active-mask")
MASKS_DIR = os.getenv("MASKS_DIR", ".masks/uploads")
os.makedirs(MASKS_DIR, exist_ok=True)
os.makedirs(os.path.dirname(ACTIVE_MASK_PATH), exist_ok=True)

mask_ch_cond = asyncio.Condition()

@router.websocket("/changed")
async def mask_changed(ws: WebSocket):
    """WebSocket endpoint to notify clients when the mask has been changed."""
    await ws.accept()
    try:
        async with mask_ch_cond:
            while True:
                await mask_ch_cond.wait()
                await ws.send_text("Mask has been changed.")
    except Exception:
        await ws.close()

@router.get("")
async def get_mask():
    """Endpoint to retrieve the current active mask file."""
    if not os.path.exists(ACTIVE_MASK_PATH):
        raise HTTPException(status_code=404, detail="No active mask file found.")
    return FileResponse(path=ACTIVE_MASK_PATH)

@router.get("/view")
async def mask_view():
    """Endpoint to serve the mask view HTML page."""
    return FileResponse(path="static/maskview.html", media_type="text/html")

@router.post("/upload")
async def upload_mask(mask: UploadFile = File(...)):
    """Endpoint to upload a new mask file."""
    if mask.content_type not in ["image/png", "image/jpeg"]:
        return HTTPException(status_code=400, detail="Invalid file type. Only PNG and JPEG are allowed.")
    
    mask.file.seek(0, os.SEEK_END)
    size = mask.file.tell()
    if size > 64 * 1024 * 1024: # 64 MB limit
        return HTTPException(status_code=400, detail="File size exceeds the 64 MB limit.")
    mask.file.seek(0)

    name, ext = os.path.splitext(mask.filename)
    file_path = os.path.join(MASKS_DIR, f"{name}_{int(asyncio.get_event_loop().time())}{ext}")

    with open(file_path, "wb") as f:
        shutil.copyfileobj(mask.file, f)
    if os.path.lexists(ACTIVE_MASK_PATH):
        os.unlink(ACTIVE_MASK_PATH)
    os.symlink(os.path.abspath(file_path), ACTIVE_MASK_PATH)

    async with mask_ch_cond:
        mask_ch_cond.notify_all()
    
    return JSONResponse(content={"message": "Mask uploaded successfully."})