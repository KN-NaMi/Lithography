import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  openNewWindow: () => ipcRenderer.send("open-new-window"),
  listSerialPorts: () => ipcRenderer.invoke('list-serial-ports'),
  connectSerial: (path: string, baudRate: number) => ipcRenderer.invoke('connect-serial', path, baudRate),
  disconnectSerial: () => ipcRenderer.send('disconnect-serial'), // ipcRenderer.send doesn't return a Promise
  sendGcode: (command: string) => ipcRenderer.invoke('send-gcode', command),
  onSerialData: (callback: (data: string) => void) => {
    ipcRenderer.on('serial-data', (_event, value) => {
      callback(value);
    });
    return () => {
      ipcRenderer.removeListener('serial-data', (_event, value) => callback(value));
    };

  },
  discoverDevices: () => ipcRenderer.invoke('discover-devices'),
  sendTcpCommand: (ip: string, port: number, command: string) =>
    ipcRenderer.invoke('send-tcp-command', ip, port, command),
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}

console.log('Preload script: Exposed electronAPI with keys:', Object.keys(api)); 
