from fastapi import FastAPI
from .routers import camera, mask, stage
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


app.include_router(camera.router)
app.include_router(mask.router)
app.include_router(stage.router)

@app.get("/ping")
async def root():
    """Endpoint for testing if the server is running."""
    return {"message": "zagrasz w ping pong"}
