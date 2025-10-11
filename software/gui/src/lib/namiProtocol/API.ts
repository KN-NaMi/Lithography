import net from 'net';

export async function sendInit(ip: string, port: number, client: string, purpose: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const clientSocket = new net.Socket();
        clientSocket.connect(port, ip, () => {
            const msg = JSON.stringify({ cmd: "INIT", client, purpose });
            clientSocket.write(msg);
        });
        clientSocket.on('data', (data) => {
            const response = JSON.parse(data.toString());
            clientSocket.destroy();
            if (response.status === "OK") {
                resolve(response.session_id);
            } else {
                reject(response);
            }
        });
        clientSocket.on('error', (err) => reject(err));
    });
}

export async function sendGcode(sessionId: string, command: string) {
    const res = await fetch("http://<ip_jetsona>:8000/gcode", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "session_id": sessionId
        },
        body: JSON.stringify({ command })
    });
    return await res.json();
}