FROM nvcr.io/nvidia/l4t-base:r32.7.1

RUN apt-get update && apt-get install -y \
    python3-gi \
    python3-gst-1.0 \
    libgstrtspserver-1.0-0 \
    libgirepository-1.0-1 \
    gir1.2-gst-rtsp-server-1.0 \
    gstreamer1.0-tools \
    gstreamer1.0-plugins-base \
    gstreamer1.0-plugins-good \
    gstreamer1.0-plugins-bad \
    gstreamer1.0-plugins-ugly \
    gstreamer1.0-libav \
    libgstreamer1.0-dev \
    v4l-utils \
    libx264-dev \
    && apt-get clean

COPY main.py /main.py

CMD ["python3", "/main.py"]