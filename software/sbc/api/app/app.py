from fastapi import FastAPI
from .routers import camera, mask

app = FastAPI()

app.include_router(camera.router)
app.include_router(mask.router)


@app.get("/ping")
async def root():
    """Endpoint for testing if the server is running."""
    return {"message": "zagrasz w ping pong"}
