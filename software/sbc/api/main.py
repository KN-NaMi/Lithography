import os
import uvicorn
from app.utils.camera import init_camera


if __name__ == "__main__":
    init_camera()
    uvicorn.run(
        "app.app:app",
        host=os.getenv("HOST", "0.0.0.0"),
        port=int(os.getenv("PORT", 8000)),
        reload=True,
    )
