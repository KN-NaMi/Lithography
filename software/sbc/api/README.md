# How to Run the API on Jetson

## Install Dependencies

Install the project dependencies using `pip`:

```shell
pip install -e .
```

## Run the API

This project uses OpenCV to access the camera. On NVIDIA Jetson devices, the standard opencv-python package from PyPI often does not work correctly with the Jetson camera stack.

Run the application using:

```shell
python main.py
```

This ensures the camera pipeline works correctly with the Jetson environment.
