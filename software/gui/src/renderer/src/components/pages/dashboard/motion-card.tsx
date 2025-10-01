import React, { useState, useEffect } from 'react'
import { Home, RefreshCw, Zap } from 'lucide-react'
import {
    fetchDevices,
    startSession,
    sendUserCommand,
    type DeviceResponse,
} from '../../../../../lib/motionLogic'
function MotionSection(): React.JSX.Element {
    const [selectedDeviceIp, setSelectedDeviceIp] = useState<string | null>(null)
    const [sessionId, setSessionId] = useState<string>('')
    const [userCommand, setUserCommand] = useState<string>('')
    const [response, setResponse] = useState<string>('')
    const [devices, setDevices] = useState<DeviceResponse[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [stepValue, setStepValue] = useState<number>(10)

    const BigButtonClass =
        'aspect-square bg-white border-2 border-gray-800 rounded-full hover:bg-gray-50 hover:border-gray-900 transition-all duration-200 flex items-center justify-center shadow-lg group active:scale-95'
    const standardSizeClass = `${BigButtonClass} w-[80%]`
    const smallerSizeClass = `${BigButtonClass} w-[60%]`
    const homeButtonClass =
        'aspect-square bg-gray-800 border-2 border-white rounded-full hover:bg-gray-800 transition-all duration-200 flex items-center justify-center shadow-lg group active:scale-95 w-full'

    // Handles sending motion commands for D-pad buttons
    const sendMotionCommand = async (command: string) => {
        if (!selectedDeviceIp || !sessionId) {
            alert('Wybierz urządzenie i rozpocznij sesję!')
            return
        }
        try {
            const res = await sendUserCommand(selectedDeviceIp, sessionId, command)
            console.log(`Motion Command Response: ${JSON.stringify(res)}`)
        } catch (error: any) {
            alert(`Error sending motion command: ${error.message || error}`)
        }
    }

    // Generates and sends move commands
    const handleMove = (axis: 'X' | 'Y', distance: number) => {
        const deviceAddress = axis === 'X' ? '1' : '3'
        sendMotionCommand(`${deviceAddress}PR${distance}`)
    }

    // Handles homing command
    const handleHome = () => {
        sendMotionCommand('1PA0') // Home X
        sendMotionCommand('3PA0') // Home Y
    }

    // Panel Functions
    const doFetchDevices = async () => {
        setLoading(true)
        try {
            const fetchedDevices = await fetchDevices()
            setDevices(fetchedDevices)
        } catch (error: any) {
            alert(`Error fetching devices: ${error.message || error}`)
        } finally {
            setLoading(false)
        }
    }

    const doStartSession = async () => {
        if (!selectedDeviceIp) {
            alert('Wybierz urządzenie!')
            return
        }
        try {
            const newSessionId = await startSession(selectedDeviceIp)
            setSessionId(newSessionId)
            alert('Sesja rozpoczęta! sessionId: ' + newSessionId)
        } catch (error: any) {
            alert(`Error starting session: ${error.message || error}`)
            setSessionId('')
        }
    }

    const doSendUserCommand = async () => {
        if (!sessionId) {
            alert('Brak aktywnej sesji!')
            return
        }
        if (!userCommand.trim()) {
            alert('Wpisz komendę!')
            return
        }
        try {
            const data = await sendUserCommand(
                selectedDeviceIp!,
                sessionId,
                userCommand.trim(),
            )
            setResponse(JSON.stringify(data, null, 2))
        } catch (error: any) {
            setResponse(`Error: ${error.message || error}`)
        }
    }

    // Runs when component is mounted (equivalent to Svelte's onMount)
    useEffect(() => {
        doFetchDevices()
    }, [])

    return (
        <div className="h-full w-full flex flex-col relative min-h-0">
            <div className="flex-1 flex flex-col lg:flex-row gap-3 min-h-0">
                {/* Motion D-Pad */}
                <div className="flex-[3] flex items-center justify-center min-w-0 overflow-hidden">
                    <div className="relative aspect-square w-2/3 max-w-2xl grid grid-cols-5 grid-rows-5 p-2">
                        {/* Y+ Large */}
                        <div className="w-full h-full flex items-center justify-center col-start-3 row-start-1">
                            <button
                                className={smallerSizeClass}
                                aria-label="Move Y Up Large"
                                onClick={() => handleMove('Y', stepValue)}
                            >
                                <svg className="w-1/2 h-1/2" viewBox="0 0 24 24" fill="none">
                                    <path
                                        d="M12 4 L20 18 L4 18 Z"
                                        fill="currentColor"
                                        stroke="currentColor"
                                        strokeWidth="1"
                                        className="text-gray-800 group-hover:text-gray-900"
                                    />
                                </svg>
                            </button>
                        </div>
                        {/* Y+ Small */}
                        <div className="w-full h-full flex items-center justify-center col-start-3 row-start-2">
                            <button
                                className={standardSizeClass}
                                aria-label="Move Y Up Small"
                                onClick={() => handleMove('Y', stepValue / 10)}
                            >
                                <svg className="w-1/2 h-1/2" viewBox="0 0 24 24" fill="none">
                                    <path
                                        d="M12 4 L20 18 L4 18 Z"
                                        fill="currentColor"
                                        stroke="currentColor"
                                        strokeWidth="1"
                                        className="text-gray-800 group-hover:text-gray-900"
                                    />
                                </svg>
                            </button>
                        </div>
                        {/* X- Large */}
                        <div className="w-full h-full flex items-center justify-center col-start-1 row-start-3">
                            <button
                                className={smallerSizeClass}
                                aria-label="Move X Left Large"
                                onClick={() => handleMove('X', -stepValue)}
                            >
                                <svg className="w-1/2 h-1/2" viewBox="0 0 24 24" fill="none">
                                    <path
                                        d="M4 12 L18 4 L18 20 Z"
                                        fill="currentColor"
                                        stroke="currentColor"
                                        strokeWidth="1"
                                        className="text-gray-800 group-hover:text-gray-900"
                                    />
                                </svg>
                            </button>
                        </div>
                        {/* X- Small */}
                        <div className="w-full h-full flex items-center justify-center col-start-2 row-start-3">
                            <button
                                className={standardSizeClass}
                                aria-label="Move X Left Small"
                                onClick={() => handleMove('X', -stepValue / 10)}
                            >
                                <svg className="w-1/2 h-1/2" viewBox="0 0 24 24" fill="none">
                                    <path
                                        d="M4 12 L18 4 L18 20 Z"
                                        fill="currentColor"
                                        stroke="currentColor"
                                        strokeWidth="1"
                                        className="text-gray-800 group-hover:text-gray-900"
                                    />
                                </svg>
                            </button>
                        </div>
                        {/* Home */}
                        <div className="w-full h-full flex items-center justify-center col-start-3 row-start-3">
                            <button
                                className={homeButtonClass}
                                aria-label="Home Position"
                                onClick={handleHome}
                            >
                                <Home className="w-1/2 h-1/2 text-white" strokeWidth="2.5" />
                            </button>
                        </div>
                        {/* X+ Small */}
                        <div className="w-full h-full flex items-center justify-center col-start-4 row-start-3">
                            <button
                                className={standardSizeClass}
                                aria-label="Move X Right Small"
                                onClick={() => handleMove('X', stepValue / 10)}
                            >
                                <svg className="w-1/2 h-1/2" viewBox="0 0 24 24" fill="none">
                                    <path
                                        d="M20 12 L6 20 L6 4 Z"
                                        fill="currentColor"
                                        stroke="currentColor"
                                        strokeWidth="1"
                                        className="text-gray-800 group-hover:text-gray-900"
                                    />
                                </svg>
                            </button>
                        </div>
                        {/* X+ Large */}
                        <div className="w-full h-full flex items-center justify-center col-start-5 row-start-3">
                            <button
                                className={smallerSizeClass}
                                aria-label="Move X Right Large"
                                onClick={() => handleMove('X', stepValue)}
                            >
                                <svg className="w-1/2 h-1/2" viewBox="0 0 24 24" fill="none">
                                    <path
                                        d="M20 12 L6 20 L6 4 Z"
                                        fill="currentColor"
                                        stroke="currentColor"
                                        strokeWidth="1"
                                        className="text-gray-800 group-hover:text-gray-900"
                                    />
                                </svg>
                            </button>
                        </div>
                        {/* Y- Small */}
                        <div className="w-full h-full flex items-center justify-center col-start-3 row-start-4">
                            <button
                                className={standardSizeClass}
                                aria-label="Move Y Down Small"
                                onClick={() => handleMove('Y', -stepValue / 10)}
                            >
                                <svg className="w-1/2 h-1/2" viewBox="0 0 24 24" fill="none">
                                    <path
                                        d="M12 20 L4 6 L20 6 Z"
                                        fill="currentColor"
                                        stroke="currentColor"
                                        strokeWidth="1"
                                        className="text-gray-800 group-hover:text-gray-900"
                                    />
                                </svg>
                            </button>
                        </div>
                        {/* Y- Large */}
                        <div className="w-full h-full flex items-center justify-center col-start-3 row-start-5">
                            <button
                                className={smallerSizeClass}
                                aria-label="Move Y Down Large"
                                onClick={() => handleMove('Y', -stepValue)}
                            >
                                <svg className="w-1/2 h-1/2" viewBox="0 0 24 24" fill="none">
                                    <path
                                        d="M12 20 L4 6 L20 6 Z"
                                        fill="currentColor"
                                        stroke="currentColor"
                                        strokeWidth="1"
                                        className="text-gray-800 group-hover:text-gray-900"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Panel: Settings and Controls */}
                <div className="flex-1 flex flex-col gap-3 min-w-[185px] max-w-[25%] lg:max-w-[15rem] flex-shrink-0 mr-2">
                    <div className="aspect-square bg-white border border-gray-800 rounded-lg p-3 shadow-sm">
                        <div className="flex flex-col h-full justify-around items-center">
                            <span className="text-xs font-medium text-gray-800 whitespace-nowrap">
                                Step
                            </span>
                            <input
                                type="number"
                                value={stepValue}
                                onChange={(e) => setStepValue(parseFloat(e.target.value))}
                                step="0.1"
                                min="0.1"
                                className="w-full px-2 py-1 text-xs border border-gray-800 rounded text-center focus:outline-none focus:border-blue-500"
                            />

                            <div className="flex flex-col h-full justify-around items-center">
                                <div className="flex flex-wrap items-center justify-center gap-1 w-full">
                                    <button
                                        onClick={doFetchDevices}
                                        className="p-1.5 text-gray-600 hover:text-gray-800 transition-colors"
                                        title="Odśwież"
                                    >
                                        <RefreshCw className="w-5 h-5" />
                                    </button>
                                    <select
                                        value={selectedDeviceIp || ''}
                                        onChange={(e) => setSelectedDeviceIp(e.target.value)}
                                        className="flex-1 min-w-[4rem] px-2 py-1.5 text-sm border border-gray-800 rounded focus:outline-none focus:border-blue-500"
                                        title="Wybierz urządzenie"
                                    >
                                        <option value="" disabled>
                                            –
                                        </option>
                                        {devices.map((d, i) => (
                                            <option key={i} value={d.addr.split(':')[0]}>
                                                {JSON.parse(d.data).device_id}
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        onClick={doStartSession}
                                        className="p-1.5 text-green-600 hover:text-green-800 transition-colors"
                                        title="INIT"
                                    >
                                        <Zap className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="flex flex-col gap-2 w-full mt-2">
                                    <div className="flex flex-row items-center gap-2 w-full">
                                        <input
                                            value={userCommand}
                                            onChange={(e) => setUserCommand(e.target.value)}
                                            onKeyDown={(e) =>
                                                e.key === 'Enter' && doSendUserCommand()
                                            }
                                            placeholder="G01 X10"
                                            className="w-full px-2 py-1.5 text-sm border border-gray-800 rounded font-mono text-center focus:outline-none focus:border-blue-500 relative z-10 pointer-events-auto"
                                            aria-label="Enter G-code command"
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={doSendUserCommand}
                                    className="px-3 py-1.5 bg-gray-800 hover:bg-blue-700 text-white text-sm font-medium rounded transition-colors whitespace-nowrap"
                                >
                                    Send
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MotionSection