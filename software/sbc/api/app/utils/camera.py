import cv2

PIPELINE = (
    "nvarguscamerasrc ! "
    "video/x-raw(memory:NVMM), width=1280, height=720, format=NV12, framerate=30/1 ! "
    "nvvidconv flip-method=2 ! "
    "video/x-raw, width=1280, height=720, format=BGRx ! "
    "videoconvert ! "
    "video/x-raw, format=BGR ! "
    "appsink"
)

camera = None

def init_camera():
    global camera
    camera = cv2.VideoCapture(PIPELINE, cv2.CAP_GSTREAMER)
    if not camera.isOpened():
        raise RuntimeError("Could not open camera.")


def mjpeg_stream():
    while True:
        ret, frame = camera.read()
        if not ret:
            continue

        _, buffer = cv2.imencode(".jpg", frame)
        yield (
            b"--frame\r\nContent-Type: image/jpeg\r\n\r\n" + buffer.tobytes() + b"\r\n"
        )
