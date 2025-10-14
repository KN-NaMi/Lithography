// src/renderer/components/pages/dashboard/dashboard-page.tsx

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@renderer/components/ui/card'
import CameraCard from './camera-card'
import MotionCard from './motion-card'
import MasksCard from './masks-card'
import ProjectorCard from './projector-card'
import { fetchDevices, startSession, type DeviceResponse } from './../../../../../../src/lib/motionLogic'
import { RefreshCw, Zap } from 'lucide-react'


function DashboardPage(): React.JSX.Element {
  // State for connection logic is now managed here
  const [devices, setDevices] = useState<DeviceResponse[]>([])
  const [selectedDeviceIp, setSelectedDeviceIp] = useState<string | null>(null)
  const [sessionId, setSessionId] = useState<string>('')
  const [isConnected, setIsConnected] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // Fetch devices when the component mounts
  useEffect(() => {
    handleFetchDevices()
  }, [])

  const handleFetchDevices = async () => {
    setIsLoading(true)
    try {
      const fetchedDevices = await fetchDevices()
      setDevices(fetchedDevices)
    } catch (error: any) {
      alert(`Error fetching devices: ${error.message || error}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleStartSession = async () => {
    if (!selectedDeviceIp) {
      alert('Please select a device!')
      return
    }
    setIsLoading(true)
    try {
      const newSessionId = await startSession(selectedDeviceIp)
      setSessionId(newSessionId)
      setIsConnected(true)
      // Dispatch a custom event to notify other components (like the sidebar)
      window.dispatchEvent(
        new CustomEvent('connectionStateChange', { detail: { isConnected: true } })
      )
      console.log('Session started! SessionId:', newSessionId)
    } catch (error: any) {
      alert(`Error starting session: ${error.message || error}`)
      setSessionId('')
      setIsConnected(false)
      window.dispatchEvent(
        new CustomEvent('connectionStateChange', { detail: { isConnected: false } })
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    // Added 'relative' to contain the absolute-positioned overlay
    <div className="p-6 h-full relative">
      {!isConnected && (
        // This is the new overlay
        <div className="absolute inset-0 bg-gray-900/70 backdrop-blur-sm z-10 flex items-center justify-center">
          <div className="bg-slate-800 p-8 rounded-lg shadow-2xl border border-slate-600 flex flex-col gap-6 w-full max-w-sm">
            <h2 className="text-xl font-bold text-white text-center">Connect to a Device</h2>
            <div className="flex items-center gap-3">
              <select
                value={selectedDeviceIp || ''}
                onChange={(e) => setSelectedDeviceIp(e.target.value)}
                className="flex-grow bg-slate-700 border border-slate-500 rounded p-2 text-white focus:outline-none focus:border-blue-400"
                disabled={isLoading}
              >
                <option value="" disabled>
                  Select a device...
                </option>
                {devices.map((d, i) => (
                  <option key={i} value={d.addr.split(':')[0]}>
                    {JSON.parse(d.data).device_id}
                  </option>
                ))}
              </select>
              <button
                onClick={handleFetchDevices}
                className="p-2 text-slate-400 hover:text-white transition-colors"
                title="Refresh Devices"
                disabled={isLoading}
              >
                <RefreshCw className={isLoading ? 'animate-spin' : ''} />
              </button>
            </div>
            <button
              onClick={handleStartSession}
              disabled={!selectedDeviceIp || isLoading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold p-3 rounded-lg transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed"
            >
              <Zap size={20} />
              {isLoading ? 'Scanning...' : 'Connect'}
            </button>
          </div>
        </div>
      )}

      <h1 className="text-2xl font-semibold text-white mb-6">Dashboard</h1>
      <div className="grid h-[calc(100vh-140px)] grid-cols-1 md:grid-cols-2 auto-rows-fr gap-6">
        <Card>
          <CardContent>
            <CameraCard />
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            {/* Pass connection state down to the MotionCard */}
            <MotionCard
              isConnected={isConnected}
              selectedDeviceIp={selectedDeviceIp}
              sessionId={sessionId}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <MasksCard />
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <ProjectorCard
              isConnected={isConnected}
              selectedDeviceIp={selectedDeviceIp}
              sessionId={sessionId} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default DashboardPage