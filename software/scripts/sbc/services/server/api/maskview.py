import asyncio
import av
from aiortc import VideoStreamTrack
from fractions import Fraction

class rtsp_track(VideoStreamTrack):
    def __init__(self, rtsp_url):
        super().__init__()
        self.container = av.open(rtsp_url)
        self.stream = self.container.streams.video[0]

    async def recv(self):
        for packet in self.container.demux(self.stream):
            for frame in packet.decode():
                frame.pts = None
                return frame
        await asyncio.sleep(0.01)

