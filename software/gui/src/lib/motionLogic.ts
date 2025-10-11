// src/lib/motionLogic.ts


export interface DeviceResponse {
    addr: string
    data: string
}

const tcpPort = 6000

export async function fetchDevices(): Promise<DeviceResponse[]> {

    const devices = await window.api.discoverDevices()

    // Ta część jest OK
    return devices.filter((device) => {
        try {
            const parsed = JSON.parse(device.data)
            return typeof parsed.device_id === 'string' && parsed.device_id.startsWith('lithography')
        } catch {
            return false
        }
    })
}

export async function startSession(
    ip: string,
    client = 'kierownik',
    purpose = 'lithography'
): Promise<string> {
    const initMsg = { cmd: 'INIT', client, purpose }
    // Poprawka: Używamy 'window.api'.
    const resp = await window.api.sendTcpCommand(
        ip,
        tcpPort,
        JSON.stringify(initMsg)
    )
    const parsed = typeof resp === 'string' ? JSON.parse(resp) : resp
    if (parsed && parsed.session_id) {
        return parsed.session_id
    } else {
        throw new Error('Failed to get session_id from INIT response')
    }
}

// Ta funkcja jest w porządku, bo nie używa IPC.
export async function sendUserCommand(
    ip: string,
    sessionId: string,
    command: string
): Promise<any> {
    // Zamiast fetch, używamy teraz naszego nowego, bezpiecznego mostu IPC
    return await window.api.sendGcodeCommand(ip, sessionId, command);
}