// src/renderer/components/pages/dashboard/motion-card.tsx

'use client'

import type React from 'react'
import { Home, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { sendUserCommand } from './../../../../../../src/lib/motionLogic'

// Define props for the component
interface MotionCardProps {
    isConnected: boolean
    selectedDeviceIp: string | null
    sessionId: string
}

function MotionCard({ isConnected, selectedDeviceIp, sessionId }: MotionCardProps): React.JSX.Element {
    const stepValue = 10 // The step value is now a constant

    const BigButtonClass =
        'aspect-square bg-slate-700 border-2 border-slate-500 rounded-full hover:bg-slate-600 hover:border-slate-400 transition-all duration-200 flex items-center justify-center shadow-lg group active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed'
    const standardSizeClass = `${BigButtonClass} w-[80%]`
    const smallerSizeClass = `${BigButtonClass} w-[60%]`
    const homeButtonClass =
        'aspect-square bg-blue-600 border-2 border-blue-400 rounded-full hover:bg-blue-500 transition-all duration-200 flex items-center justify-center shadow-lg group active:scale-95 w-full disabled:opacity-50 disabled:bg-blue-800 disabled:cursor-not-allowed'

    const sendMotionCommand = async (command: string) => {
        if (!isConnected || !selectedDeviceIp || !sessionId) {
            console.error('Cannot send command: not connected.')
            return
        }
        try {
            const res = await sendUserCommand(selectedDeviceIp, sessionId, command)
            console.log(`Motion Command Response: ${JSON.stringify(res)}`)
        } catch (error: any) {
            alert(`Error sending motion command: ${error.message || error}`)
        }
    }

    const handleMove = (axis: 'X' | 'Y', distance: number) => {
        const deviceAddress = axis === 'X' ? '1' : '3'
        sendMotionCommand(`${deviceAddress}PR${distance}`)
    }

    const handleHome = () => {
        sendMotionCommand('1PA50')
        sendMotionCommand('3PA40')
    }

    return (
        // Layout simplified as the right-side panel was removed
        <div className="flex items-center justify-center h-full">
            <div
                className="relative grid grid-cols-5 grid-rows-5 gap-0 p-[0.5vh]"
                style={{ height: '35vh', width: '35vh' }}
            >
                <div className="w-full h-full flex items-center justify-center col-start-3 row-start-1">
                    <button
                        className={smallerSizeClass}
                        aria-label="Move Y Up Large"
                        onClick={() => handleMove('Y', stepValue)}
                        disabled={!isConnected}
                    >
                        <ChevronUp className="w-3/4 h-3/4 text-slate-200 group-hover:text-white" strokeWidth={3} />
                    </button>
                </div>
                <div className="w-full h-full flex items-center justify-center col-start-3 row-start-2">
                    <button
                        className={standardSizeClass}
                        aria-label="Move Y Up Small"
                        onClick={() => handleMove('Y', stepValue / 10)}
                        disabled={!isConnected}
                    >
                        <ChevronUp className="w-3/4 h-3/4 text-slate-200 group-hover:text-white" strokeWidth={2.5} />
                    </button>
                </div>
                <div className="w-full h-full flex items-center justify-center col-start-1 row-start-3">
                    <button
                        className={smallerSizeClass}
                        aria-label="Move X Left Large"
                        onClick={() => handleMove('X', -stepValue)}
                        disabled={!isConnected}
                    >
                        <ChevronLeft className="w-3/4 h-3/4 text-slate-200 group-hover:text-white" strokeWidth={3} />
                    </button>
                </div>
                <div className="w-full h-full flex items-center justify-center col-start-2 row-start-3">
                    <button
                        className={standardSizeClass}
                        aria-label="Move X Left Small"
                        onClick={() => handleMove('X', -stepValue / 10)}
                        disabled={!isConnected}
                    >
                        <ChevronLeft className="w-3/4 h-3/4 text-slate-200 group-hover:text-white" strokeWidth={2.5} />
                    </button>
                </div>
                <div className="w-full h-full flex items-center justify-center col-start-3 row-start-3">
                    <button
                        className={homeButtonClass}
                        aria-label="Home Position"
                        onClick={handleHome}
                        disabled={!isConnected}
                    >
                        <Home className="w-1/2 h-1/2 text-white" strokeWidth="2.5" />
                    </button>
                </div>
                <div className="w-full h-full flex items-center justify-center col-start-4 row-start-3">
                    <button
                        className={standardSizeClass}
                        aria-label="Move X Right Small"
                        onClick={() => handleMove('X', stepValue / 10)}
                        disabled={!isConnected}
                    >
                        <ChevronRight
                            className="w-3/4 h-3/4 text-slate-200 group-hover:text-white"
                            strokeWidth={2.5}
                        />
                    </button>
                </div>
                <div className="w-full h-full flex items-center justify-center col-start-5 row-start-3">
                    <button
                        className={smallerSizeClass}
                        aria-label="Move X Right Large"
                        onClick={() => handleMove('X', stepValue)}
                        disabled={!isConnected}
                    >
                        <ChevronRight className="w-3/4 h-3/4 text-slate-200 group-hover:text-white" strokeWidth={3} />
                    </button>
                </div>
                <div className="w-full h-full flex items-center justify-center col-start-3 row-start-4">
                    <button
                        className={standardSizeClass}
                        aria-label="Move Y Down Small"
                        onClick={() => handleMove('Y', -stepValue / 10)}
                        disabled={!isConnected}
                    >
                        <ChevronDown
                            className="w-3/4 h-3/4 text-slate-200 group-hover:text-white"
                            strokeWidth={2.5}
                        />
                    </button>
                </div>
                <div className="w-full h-full flex items-center justify-center col-start-3 row-start-5">
                    <button
                        className={smallerSizeClass}
                        aria-label="Move Y Down Large"
                        onClick={() => handleMove('Y', -stepValue)}
                        disabled={!isConnected}
                    >
                        <ChevronDown className="w-3/4 h-3/4 text-slate-200 group-hover:text-white" strokeWidth={3} />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default MotionCard