import serial
import time
import threading


class StageController:
    def __init__(self, port: str, baudrate: int = 57600, delay: float = 0.01, timeout: float = 1):
        self.serial_port = serial.Serial(port, baudrate, timeout=timeout)
        self.delay = delay
        self.lock = threading.Lock()

        self.addresses = {
            "x": 1,
            "y": 3,
        }

    def _send_command(self, command: bytes):
        time.sleep(self.delay)
        print(f"Sending command: {command}")
        self.serial_port.write(command)

    def _query(self, command: bytes) -> str:
        with self.lock:
            self._send_command(command)
            response = self.serial_port.readline().decode().strip()
            print(f"Response: {response}")
            return response

    def check_status(self, axis: str):
        if axis not in self.addresses:
            raise ValueError(f"Invalid axis: {axis}")

        address = self.addresses[axis]
        command = f"{address}TS?\r\n".encode()

        return self._query(command)

    def home(self, axis: str):
        if axis not in self.addresses:
            raise ValueError(f"Invalid axis: {axis}")

        address = self.addresses[axis]
        command = f"{address}OR\r\n".encode()

        with self.lock:
            self._send_command(command)

    def move(self, axis: str, distance: float):
        if axis not in self.addresses:
            raise ValueError(f"Invalid axis: {axis}")

        address = self.addresses[axis]
        command = f"{address}PR{distance:.2f}\r\n".encode()

        with self.lock:
            self._send_command(command)

    def set_position(self, axis: str, position: float):
        if axis not in self.addresses:
            raise ValueError(f"Invalid axis: {axis}")

        address = self.addresses[axis]
        command = f"{address}PA{position:.2f}\r\n".encode()

        with self.lock:
            self._send_command(command)

    def get_position(self, axis: str):
        if axis not in self.addresses:
            raise ValueError(f"Invalid axis: {axis}")

        address = self.addresses[axis]
        command = f"{address}TP?\r\n".encode()

        try:
            response = self._query(command)

            if not response:
                return -1, None, "Empty response"

            if "TP" in response:
                value_str = response.split("TP")[-1]
            else:
                value_str = response

            position = float(value_str)

            return 0, position, ""

        except Exception as e:
            return -1, None, str(e)

    def close(self):
        self.serial_port.close()


def init_stage(port: str):
    global stage_controller
    stage_controller = StageController(port)

    stage_controller.check_status("x")
    stage_controller.home("x")

    stage_controller.check_status("y")
    stage_controller.home("y")