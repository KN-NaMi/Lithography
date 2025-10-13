import net from 'net';

export function sendTcpCommand(ip: string, port: number, command: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const client = new net.Socket();
        client.connect(port, ip, () => {
            client.write(command);
        });
        client.on('data', (data) => {
            resolve(data.toString());
            client.destroy();
        });
        client.on('error', (err) => {
            reject(err);
        });
        client.on('close', () => { });
    });
}

