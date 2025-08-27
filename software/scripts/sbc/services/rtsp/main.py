#!/usr/bin/env python3
import gi

gi.require_version('Gst', '1.0')
gi.require_version('GstRtspServer', '1.0')
from gi.repository import Gst, GstRtspServer, GLib

Gst.init(None)

server = GstRtspServer.RTSPServer()
factory = GstRtspServer.RTSPMediaFactory()
factory.set_launch(
    "( nvarguscamerasrc ! video/x-raw(memory:NVMM),width=1920,height=1080,framerate=30/1 ! nvv4l2h264enc bitrate=4000000 ! rtph264pay name=pay0 pt=96 )"
)
factory.set_shared(True)
server.get_mount_points().add_factory("/test", factory)
server.attach(None)

print("RTSP server started at rtsp://<Jetson_IP>:8554/test")
loop = GLib.MainLoop()
loop.run()