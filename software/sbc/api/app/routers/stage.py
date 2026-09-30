from fastapi import APIRouter, HTTPException
from app.utils.stage import stage_controller

router = APIRouter(prefix="/stage", tags=["stage"])

@router.post("/move/{axis}/{distance}")
def move_stage(axis: str, distance: float):
    """Move the stage along the specified axis by the given distance."""
    try:
        stage_controller.move(axis, distance)
        return {"message": f"Stage moved {distance} units along {axis} axis."}
    except ValueError as e:
        return {"error": str(e)}


@router.post("/position/{axis}/{position}")
def set_position(axis: str, position: float):
    """Set the position of the stage along the specified axis."""
    try:
        stage_controller.set_position(axis, position)
        return {"message": f"Stage positioned at {position} units along {axis} axis."}
    except ValueError as e:
        return {"error": str(e)}


@router.post("/home/{axis}")
def home_stage(axis: str):
    """Home the stage along the specified axis."""
    try:
        stage_controller.home(axis)
        return {"message": f"Stage homed along {axis} axis."}
    except ValueError as e:
        return {"error": str(e)}

@router.get("/position/{axis}")
def get_position(axis: str):
    """Get the current position of the stage along the specified axis."""
    try:
        status, pos, err = stage_controller.get_position(axis)

        if status != 0:
            raise HTTPException(status_code=500, detail=err)

        return {
            "axis": axis,
            "position": pos
        }

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))