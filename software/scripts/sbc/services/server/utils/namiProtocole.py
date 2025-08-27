import socket
import threading
import json
import uuid

class NaMiDevice:
    def __init__(self, device_id="nami_device", device_type="generic", tcp_port=6000, udp_port=5005, lock_timeout=60):
        self.device_id = device_id
        self.device_type = device_type
        self.tcp_port = tcp_port
        self.udp_port = udp_port
        self.lock_timeout = lock_timeout

        self.master_session = None
        self.master_socket = None
        self.lock_expires = None
        self.lock = threading.Lock()

    def start(self):
        self.start_udp_discovery()

    def start_udp_discovery(self):
        def run():
            sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            sock.setsockopt(socket.SOL_SOCKET, socket.SO_BROADCAST, 1)
            sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
            sock.bind(("", self.udp_port))

            print(f"[UDP] Listening on port {self.udp_port}...")
            while True:
                try:
                    data, addr = sock.recvfrom(1024)
                    if data.decode() == "DISCOVER_NAMI_DEVICES":
                        response = json.dumps({
                            "device_id": self.device_id,
                            "device_type": self.device_type,
                            "protocols": ["TCP", "REST"],
                            "version": "1.0",
                        }).encode()
                        sock.sendto(response, addr)
                        print(f"[UDP] Sent discovery response to {addr}")
                except Exception as e:
                    print(f"[UDP ERROR] {e}")
        threading.Thread(target=run, daemon=True).start()