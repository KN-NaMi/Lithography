// src/renderer/components/pages/dashboard/ActionsCard.tsx

'use client'

import React, { useState, useRef, useEffect } from 'react'
import { sendUserCommand } from '../../../../../lib/motionLogic'
import { Move3d, Play, Square } from 'lucide-react'

interface ActionsCardProps {
    isConnected: boolean
    selectedDeviceIp: string | null
    sessionId: string
}

const delay = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms))

function ProjectorCard({ isConnected, selectedDeviceIp, sessionId }: ActionsCardProps): React.JSX.Element {
    const [isBusy, setIsBusy] = useState(false)
    const isBusyRef = useRef(isBusy)
    useEffect(() => {
        isBusyRef.current = isBusy
    }, [isBusy])

    // --- Style (bez zmian) ---
    const iconButtonBaseClass =
        'aspect-square w-24 h-24 rounded-full shadow-lg border-2 flex items-center justify-center transform transition-all duration-200 active:scale-90'
    const disabledClass = 'disabled:opacity-40 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:border-slate-500'
    const iconClass = 'w-1/2 h-1/2'

    // --- Funkcja do wysyłania komend (bez zmian) ---
    const sendMotionCommand = async (command: string): Promise<void> => {
        if (!isConnected || !selectedDeviceIp || !sessionId) {
            console.error('Cannot send command: not connected.')
            return
        }
        try {
            await sendUserCommand(selectedDeviceIp, sessionId, command)
            console.log(`Command sent: ${command}`)
        } catch (error: any) {
            alert(`Error sending command: ${error.message || error}`)
        }
    }

    // --- Logika przycisków (zaktualizowana) ---

    const handleStop = async (): Promise<void> => {
        console.log('STOP sequence initiated.')
        // Ustaw flagę ręcznie ORAZ przez stan
        isBusyRef.current = false
        setIsBusy(false)

        await sendMotionCommand('1ST')
        await sendMotionCommand('3ST')
        await delay(100)
        await sendMotionCommand('1PA50')
        await sendMotionCommand('3PA40')
        console.log('Returned to HOME.')
    }

    const handleRunSequence = async (): Promise<void> => {
        // *** POPRAWKA: Ręcznie zaktualizuj refa NATYCHMIAST ***
        isBusyRef.current = true
        setIsBusy(true)
        console.log('RUN sequence initiated.')

        try {
            const sequence = [
                [-20, -5], [-25, -5], [-30, -5],
                [-20, -10], [-25, -10], [-30, -10],
                [-20, -15], [-25, -15], [-30, -15],
            ]
            for (const [x, y] of sequence) {
                if (!isBusyRef.current) { console.log('RUN interrupted.'); return }
                await sendMotionCommand(`1PA${x}`)

                if (!isBusyRef.current) { console.log('RUN interrupted.'); return }
                await sendMotionCommand(`3PA${y}`)

                if (!isBusyRef.current) { console.log('RUN interrupted.'); return }
                await delay(800)
            }

            if (isBusyRef.current) {
                await sendMotionCommand('1PA50')
                await sendMotionCommand('3PA40')
                console.log('RUN sequence finished.')
            }
        } finally {
            isBusyRef.current = false
            setIsBusy(false)
        }
    }

    const handleTraceSquare = async (): Promise<void> => {
        // *** POPRAWKA: Ręcznie zaktualizuj refa NATYCHMIAST ***
        isBusyRef.current = true
        setIsBusy(true)
        console.log('MOTION (square trace) sequence initiated.')

        try {
            const corners = { topLeft: [-50, -50], topRight: [50, -50], bottomRight: [50, 50], bottomLeft: [-50, 50] }

            // Krok 1
            if (!isBusyRef.current) { console.log('MOTION interrupted.'); return }
            await sendMotionCommand(`3PA${corners.bottomLeft[1]}`)
            if (!isBusyRef.current) { console.log('MOTION interrupted.'); return }
            await sendMotionCommand(`1PA${corners.bottomLeft[0]}`)
            if (!isBusyRef.current) { console.log('MOTION interrupted.'); return }
            await delay(2000)

            // Krok 2
            if (!isBusyRef.current) { console.log('MOTION interrupted.'); return }
            await sendMotionCommand(`1PA${corners.topLeft[0]}`)
            if (!isBusyRef.current) { console.log('MOTION interrupted.'); return }
            await sendMotionCommand(`3PA${corners.topLeft[1]}`)
            if (!isBusyRef.current) { console.log('MOTION interrupted.'); return }
            await delay(2000)

            // Krok 3
            if (!isBusyRef.current) { console.log('MOTION interrupted.'); return }
            await sendMotionCommand(`1PA${corners.topRight[0]}`)
            if (!isBusyRef.current) { console.log('MOTION interrupted.'); return }
            await sendMotionCommand(`3PA${corners.topRight[1]}`)
            if (!isBusyRef.current) { console.log('MOTION interrupted.'); return }
            await delay(2000)

            // Krok 4
            if (!isBusyRef.current) { console.log('MOTION interrupted.'); return }
            await sendMotionCommand(`1PA${corners.bottomRight[0]}`)
            if (!isBusyRef.current) { console.log('MOTION interrupted.'); return }
            await sendMotionCommand(`3PA${corners.bottomRight[1]}`)
            if (!isBusyRef.current) { console.log('MOTION interrupted.'); return }
            await delay(2000)

            // Krok 5
            if (!isBusyRef.current) { console.log('MOTION interrupted.'); return }
            await sendMotionCommand(`1PA${corners.topLeft[0]}`)
            if (!isBusyRef.current) { console.log('MOTION interrupted.'); return }
            await sendMotionCommand(`3PA${corners.topLeft[1]}`)
            if (!isBusyRef.current) { console.log('MOTION interrupted.'); return }
            await delay(2000)

            if (isBusyRef.current) {
                await sendMotionCommand('1PA50')
                await sendMotionCommand('3PA40')
                console.log('MOTION sequence finished.')
            }
        } finally {
            isBusyRef.current = false
            setIsBusy(false)
        }
    }

    return (
        <div className="flex h-full items-center justify-around translate-y-30">
            <button
                onClick={handleTraceSquare}
                disabled={!isConnected || isBusy}
                className={`${iconButtonBaseClass} bg-blue-600 border-blue-400 hover:bg-blue-500 text-white ${disabledClass}`}
                aria-label="Trace Square Motion"
            >
                <Move3d className={iconClass} />
            </button>
            <button
                onClick={handleRunSequence}
                disabled={!isConnected || isBusy}
                className={`${iconButtonBaseClass} bg-green-600 border-green-400 hover:bg-green-500 text-white ${disabledClass}`}
                aria-label="Run Sequence"
            >
                <Play className={iconClass} />
            </button>
            <button
                onClick={handleStop}
                disabled={!isConnected || !isBusy}
                className={`${iconButtonBaseClass} bg-red-600 border-red-400 hover:bg-red-500 text-white ${disabledClass}`}
                aria-label="Stop and Home"
            >
                <Square className={iconClass} />
            </button>
        </div>
    )
}

export default ProjectorCard