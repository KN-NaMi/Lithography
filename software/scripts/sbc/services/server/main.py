import uvicorn
from utils.namiProtocole import NaMiDevice


def run():
    device = NaMiDevice()
    device.start()
    print("NaMiDevice started and listening for UDP discovery requests...")
    uvicorn.run("api.api:app", host="0.0.0.0", port=8000, reload=True)

if __name__ == "__main__":
    run()