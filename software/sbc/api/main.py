import os
import uvicorn
from app.utils.camera import init_camera
from app.utils.stage import init_stage

if __name__ == "__main__":
    init_camera()
    init_stage("/dev/ttyUSB0")
    uvicorn.run(
        "app.app:app",
        host=os.getenv("HOST", "0.0.0.0"),
        port=int(os.getenv("PORT", 8000)), reload=False
    )
