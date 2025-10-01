import dgram from 'dgram';


export interface DeviceResponse {
    addr: string;
    data: string;
}

export interface Data {
    device_id: string;
    type: string;
    protocols: string[];
    version: number;
    software_version: number;
}

export async function discoverDevices(
    broadcastIp: string,
    port: number,
    timeout = 3000
): Promise<DeviceResponse[]> {
    return new Promise((resolve) => {
        const sock = dgram.createSocket('udp4');
        const responses: DeviceResponse[] = [];

        sock.bind(() => {
            sock.setBroadcast(true);
            sock.setRecvBufferSize(1024);

            const message = Buffer.from('Hej');
            sock.send(message, 0, message.length, port, broadcastIp, (err) => {
                if (err) {
                    sock.close();
                    resolve(responses);
                }
            });
        });

        sock.on('message', (msg, rinfo) => {
            let dataStr = msg.toString();
            responses.push({ addr: `${rinfo.address}:${rinfo.port}`, data: dataStr });
        });

        setTimeout(() => {
            sock.close();
            resolve(responses);
        }, timeout);
    });
}