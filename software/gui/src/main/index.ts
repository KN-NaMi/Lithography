import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { SerialPort } from 'serialport';
import { discoverDevices } from '../lib/namiProtocol/UDP';
import { sendTcpCommand } from '../lib/namiProtocol/TCP';
import icon from '../../resources/icon.png?asset'

app.disableHardwareAcceleration()

let port: SerialPort | null = null;
let mainWindow: BrowserWindow;

function createWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

ipcMain.handle('list-serial-ports', async () => {
  try {
    const ports = await SerialPort.list();
    console.log('Main process: Listed serial ports:', ports); // Log do terminala głównego procesu
    return ports;
  } catch (error: any) { // Dodano typ 'any' dla error
    console.error('Error listing serial ports:', error.message);
    return [];
  }
});

ipcMain.handle('connect-serial', async (_event, path: string, baudRate: number) => {
  // Jeśli port już istnieje i jest otwarty, zamknij go przed ponownym połączeniem
  if (port && port.isOpen) {
    await port.close();
    console.log('Closed existing serial port before connecting to a new one.');
  }

  return new Promise((resolve, reject) => {
    port = new SerialPort({ path, baudRate: parseInt(baudRate.toString()), autoOpen: false });

    // Upewnij się, że 'port' jest teraz przypisany i nie jest null przed dodaniem listenerów
    if (!port) { // W rzadkich przypadkach, jeśli przypisanie nie powiedzie się od razu
      console.error("Failed to initialize SerialPort instance.");
      return reject("Failed to initialize SerialPort instance.");
    }

    port.open((err) => {
      if (err) {
        console.error('Error opening port:', err.message);
        // Ważne: Ustawienie portu na null w przypadku błędu otwarcia, aby oznaczyć go jako nieaktywny
        port = null;
        return reject(err.message);
      }
      console.log(`Serial port opened: ${path} at ${baudRate} baud.`); // Log do terminala głównego procesu

      // Listener dla przychodzących danych z portu szeregowego
      // Używamy 'port!' w callbackach, bo wiemy, że w momencie ich wywołania, port powinien istnieć
      // i być otwarty, chyba że błąd wystąpił wcześniej.
      port!.on('data', (data) => {
        console.log('Data from SM100CC:', data.toString());
        // Wyślij dane do procesu renderera
        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.webContents.send('serial-data', data.toString());
        } else {
          // Jeśli główne okno jest null lub zniszczone, spróbuj wysłać dane do wszystkich otwartych okien
          BrowserWindow.getAllWindows().forEach(win => {
            if (!win.isDestroyed()) {
              win.webContents.send('serial-data', data.toString());
            }
          });
        }
      });

      // Listener dla błędów portu szeregowego
      port!.on('error', (err) => {
        console.error('Serial port error:', err.message);
        // W przypadku błędu, zamknij port i ustaw go na null
        if (port && port.isOpen) { // Sprawdzenie, czy port jest nadal referencją i jest otwarty
          port.close(() => {
            console.log('Serial port closed due to error.');
            port = null; // Ustaw port na null po zamknięciu
          });
        } else {
          port = null; // Ustaw port na null, jeśli już nie był otwarty
        }
      });

      // Listener dla zdarzenia zamknięcia portu (np. odłączenie kabla, zamknięcie przez aplikację)
      port!.on('close', () => {
        console.log('Serial port unexpectedly closed.');
        port = null; // Ustaw port na null po zamknięciu
      });

      resolve(true);
    });
  });
});

ipcMain.handle('discover-devices', async () => {
  console.log('discover-devices handler called!');
  const devices = await discoverDevices('192.168.0.255', 5005);
  console.log(devices)
  return devices;

});

ipcMain.handle('send-tcp-command', async (_event, ip: string, port: number, command: string) => {
  return await sendTcpCommand(ip, port, command);
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
