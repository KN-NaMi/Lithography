"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Home, RefreshCw, Zap, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
import { fetchDevices, startSession, sendUserCommand, type DeviceResponse } from "../../../../../lib/motionLogic"

function MotionSection(): React.JSX.Element {
    const [selectedDeviceIp, setSelectedDeviceIp] = useState<string | null>(null)
    const [sessionId, setSessionId] = useState<string>("")
    const [userCommand, setUserCommand] = useState<string>("")
    const [response, setResponse] = useState<string>("")
    const [devices, setDevices] = useState<DeviceResponse[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [stepValue, setStepValue] = useState<number>(10)

    const BigButtonClass =
        "aspect-square bg-slate-700 border-2 border-slate-500 rounded-full hover:bg-slate-600 hover:border-slate-400 transition-all duration-200 flex items-center justify-center shadow-lg group active:scale-95"
    const standardSizeClass = `${BigButtonClass} w-[80%]`
    const smallerSizeClass = `${BigButtonClass} w-[60%]`
    const homeButtonClass =
        "aspect-square bg-blue-600 border-2 border-blue-400 rounded-full hover:bg-blue-500 transition-all duration-200 flex items-center justify-center shadow-lg group active:scale-95 w-full"

    const sendMotionCommand = async (command: string) => {
        if (!selectedDeviceIp || !sessionId) {
            alert("Wybierz urządzenie i rozpocznij sesję!")
            return
        }
        try {
            const res = await sendUserCommand(selectedDeviceIp, sessionId, command)
            console.log(`Motion Command Response: ${JSON.stringify(res)}`)
        } catch (error: any) {
            alert(`Error sending motion command: ${error.message || error}`)
        }
    }

    const handleMove = (axis: "X" | "Y", distance: number) => {
        const deviceAddress = axis === "X" ? "1" : "3"
        sendMotionCommand(`${deviceAddress}PR${distance}`)
    }

    const handleHome = () => {
        sendMotionCommand("1PA50")
        sendMotionCommand("3PA40")
    }

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
            alert("Wybierz urządzenie!")
            return
        }
        try {
            const newSessionId = await startSession(selectedDeviceIp)
            setSessionId(newSessionId)
            alert("Sesja rozpoczęta! sessionId: " + newSessionId)
        } catch (error: any) {
            alert(`Error starting session: ${error.message || error}`)
            setSessionId("")
        }
    }

    const doSendUserCommand = async () => {
        if (!sessionId) {
            alert("Brak aktywnej sesji!")
            return
        }
        if (!userCommand.trim()) {
            alert("Wpisz komendę!")
            return
        }
        try {
            const data = await sendUserCommand(selectedDeviceIp!, sessionId, userCommand.trim())
            setResponse(JSON.stringify(data, null, 2))
        } catch (error: any) {
            setResponse(`Error: ${error.message || error}`)
        }
    }

    useEffect(() => {
        doFetchDevices()
    }, [])

    return (
        <div className="grid grid-cols-4 flex-1 h-full ">
            <div className="col-span-3 flex items-center justify-start min-w-0 overflow-hidden">
                <div
                    className="relative w-2/3 grid grid-cols-5 grid-rows-5 gap-0 p-[0.5vh]"
                    style={{ maxWidth: "35vh" }}
                >
                    <div className="w-full h-full flex items-center justify-center col-start-3 row-start-1">
                        <button
                            className={smallerSizeClass}
                            aria-label="Move Y Up Large"
                            onClick={() => handleMove("Y", stepValue)}
                        >
                            <ChevronUp className="w-3/4 h-3/4 text-slate-200 group-hover:text-white" strokeWidth={3} />
                        </button>
                    </div>
                    <div className="w-full h-full flex items-center justify-center col-start-3 row-start-2">
                        <button
                            className={standardSizeClass}
                            aria-label="Move Y Up Small"
                            onClick={() => handleMove("Y", stepValue / 10)}
                        >
                            <ChevronUp className="w-3/4 h-3/4 text-slate-200 group-hover:text-white" strokeWidth={2.5} />
                        </button>
                    </div>
                    <div className="w-full h-full flex items-center justify-center col-start-1 row-start-3">
                        <button
                            className={smallerSizeClass}
                            aria-label="Move X Left Large"
                            onClick={() => handleMove("X", -stepValue)}
                        >
                            <ChevronLeft className="w-3/4 h-3/4 text-slate-200 group-hover:text-white" strokeWidth={3} />
                        </button>
                    </div>
                    <div className="w-full h-full flex items-center justify-center col-start-2 row-start-3">
                        <button
                            className={standardSizeClass}
                            aria-label="Move X Left Small"
                            onClick={() => handleMove("X", -stepValue / 10)}
                        >
                            <ChevronLeft className="w-3/4 h-3/4 text-slate-200 group-hover:text-white" strokeWidth={2.5} />
                        </button>
                    </div>
                    <div className="w-full h-full flex items-center justify-center col-start-3 row-start-3">
                        <button className={homeButtonClass} aria-label="Home Position" onClick={handleHome}>
                            <Home className="w-1/2 h-1/2 text-white" strokeWidth="2.5" />
                        </button>
                    </div>
                    <div className="w-full h-full flex items-center justify-center col-start-4 row-start-3">
                        <button
                            className={standardSizeClass}
                            aria-label="Move X Right Small"
                            onClick={() => handleMove("X", stepValue / 10)}
                        >
                            <ChevronRight className="w-3/4 h-3/4 text-slate-200 group-hover:text-white" strokeWidth={2.5} />
                        </button>
                    </div>
                    <div className="w-full h-full flex items-center justify-center col-start-5 row-start-3">
                        <button
                            className={smallerSizeClass}
                            aria-label="Move X Right Large"
                            onClick={() => handleMove("X", stepValue)}
                        >
                            <ChevronRight className="w-3/4 h-3/4 text-slate-200 group-hover:text-white" strokeWidth={3} />
                        </button>
                    </div>
                    <div className="w-full h-full flex items-center justify-center col-start-3 row-start-4">
                        <button
                            className={standardSizeClass}
                            aria-label="Move Y Down Small"
                            onClick={() => handleMove("Y", -stepValue / 10)}
                        >
                            <ChevronDown className="w-3/4 h-3/4 text-slate-200 group-hover:text-white" strokeWidth={2.5} />
                        </button>
                    </div>
                    <div className="w-full h-full flex items-center justify-center col-start-3 row-start-5">
                        <button
                            className={smallerSizeClass}
                            aria-label="Move Y Down Large"
                            onClick={() => handleMove("Y", -stepValue)}
                        >
                            <ChevronDown className="w-3/4 h-3/4 text-slate-200 group-hover:text-white" strokeWidth={3} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="col-span-1 flex flex-col gap-[1.5vh] min-w-0 mr-[1vh]">
                <div
                    className="aspect-square bg-slate-800 border border-slate-600 rounded-lg shadow-sm"
                    style={{ padding: "1vh" }}
                >
                    <div className="flex flex-col h-full justify-around items-center">
                        <span
                            className="font-medium text-slate-200 whitespace-nowrap"
                            style={{ fontSize: "clamp(0.65rem, 1.2vh, 0.875rem)" }}
                        >
                            Step
                        </span>
                        <input
                            type="number"
                            value={stepValue}
                            onChange={(e) => setStepValue(Number.parseFloat(e.target.value))}
                            step="0.1"
                            min="0.1"
                            className="w-full border border-slate-500 rounded text-center text-slate-100 focus:outline-none focus:border-blue-400"
                            style={{
                                padding: "0.5vh 1vh",
                                fontSize: "clamp(0.65rem, 1.2vh, 0.875rem)",
                                backgroundColor: "rgb(51 65 85)",
                            }}
                        />

                        <div className="flex flex-col h-full justify-around items-center">
                            <div className="flex flex-wrap items-center justify-center w-full" style={{ gap: "0.5vh" }}>
                                <button
                                    onClick={doFetchDevices}
                                    className="text-slate-400 hover:text-slate-200 transition-colors"
                                    style={{ padding: "0.75vh" }}
                                    title="Odśwież"
                                >
                                    <RefreshCw style={{ width: "2vh", height: "2vh" }} />
                                </button>
                                <select
                                    value={selectedDeviceIp || ""}
                                    onChange={(e) => setSelectedDeviceIp(e.target.value)}
                                    className="flex-1 border border-slate-500 rounded text-slate-100 focus:outline-none focus:border-blue-400"
                                    style={{
                                        minWidth: "3rem",
                                        padding: "0.5vh 0.75vh",
                                        fontSize: "clamp(0.65rem, 1.2vh, 0.875rem)",
                                        backgroundColor: "rgb(51 65 85)",
                                    }}
                                    title="Wybierz urządzenie"
                                >
                                    <option value="" disabled>
                                        –
                                    </option>
                                    {devices.map((d, i) => (
                                        <option key={i} value={d.addr.split(":")[0]}>
                                            {JSON.parse(d.data).device_id}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    onClick={doStartSession}
                                    className="text-green-400 hover:text-green-300 transition-colors"
                                    style={{ padding: "0.75vh" }}
                                    title="INIT"
                                >
                                    <Zap style={{ width: "2vh", height: "2vh" }} />
                                </button>
                            </div>

                            <div className="flex flex-col w-full" style={{ gap: "1vh", marginTop: "1vh" }}>
                                <div className="flex flex-row items-center w-full" style={{ gap: "1vh" }}>
                                    <input
                                        value={userCommand}
                                        onChange={(e) => setUserCommand(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && doSendUserCommand()}
                                        placeholder="G01 X10"
                                        className="w-full border border-slate-500 rounded font-mono text-center text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-blue-400 relative z-10 pointer-events-auto"
                                        style={{
                                            padding: "0.5vh 0.75vh",
                                            fontSize: "clamp(0.65rem, 1.2vh, 0.875rem)",
                                            backgroundColor: "rgb(51 65 85)",
                                        }}
                                        aria-label="Enter G-code command"
                                    />
                                </div>
                            </div>
                            <button
                                onClick={doSendUserCommand}
                                className="bg-blue-600 hover:bg-blue-500 text-white font-medium rounded transition-colors whitespace-nowrap"
                                style={{
                                    padding: "0.5vh 1vh",
                                    fontSize: "clamp(0.65rem, 1.2vh, 0.875rem)",
                                }}
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default MotionSection
