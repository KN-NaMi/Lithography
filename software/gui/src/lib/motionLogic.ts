// src/lib/motionLogic.ts

export interface DeviceResponse {
    addr: string
    data: string
}

const tcpPort = 6000

export async function fetchDevices(): Promise<DeviceResponse[]> {
    // @ts-ignore
    const devices = await window.electronAPI.discoverDevices()
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
    // @ts-ignore
    const resp = await window.electronAPI.sendTcpCommand(
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

export async function sendUserCommand(
    ip: string,
    sessionId: string,
    command: string
): Promise<any> {
    const res = await fetch(`http://${ip}:8000/gcode`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'session-id': sessionId
        },
        body: JSON.stringify({ command })
    })
    if (!res.ok) {
        const errorData = await res.json()
        throw new Error(`HTTP error ${res.status}: ${errorData.detail || JSON.stringify(errorData)}`)
    }
    return await res.json()
}