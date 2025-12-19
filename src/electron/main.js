import * as url from 'url'
import { release } from 'os'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { app, BrowserWindow, shell, ipcMain } from 'electron'
import icon from '../../public/favicon.png?asset'

import settings from './lib/settings'
import { initilizeApp } from './lib/config'
import ipcEvent from './events'
import { onWindowPosition } from './events/window'

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

async function createWindow() {
  const { config, theme } = await initilizeApp()
  const lasted = await settings.get('position')

  const win = new BrowserWindow({
    title: 'Main window',
    show: true,
    movable: true,
    resizable: true,
    frame: false,
    alwaysOnTop: false,
    titleBarStyle: 'hidden',
    backgroundColor: theme.titlebar.activeBackground,
    titleBarOverlay: {
      color: theme.titlebar.activeBackground,
      symbolColor: theme.titlebar.activeForeground,
    },
    autoHideMenuBar: true,
    minWidth: config.width,
    minHeight: config.height,
    width: lasted.width || config.width,
    height: lasted.height || config.height,
    x: lasted.x,
    y: lasted.y,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: url.fileURLToPath(new URL('preload.mjs', import.meta.url)),
      sandbox: false,
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  if (lasted.maximized) win.maximize()

  for (const eventName in ipcEvent) {
    ipcMain.handle(eventName, async (e, ...args) => {
      // ipcLog.verbose(eventName, args)
      const result = await ipcEvent[eventName](e, ...args)
      // ipcLog.verbose({ eventName, args, result })
      return result
    })
  }

  win.on('focus', () => {
    win.setTitleBarOverlay({
      color: theme.titlebar.activeBackground,
      symbolColor: theme.titlebar.activeForeground,
    })
    win.webContents.executeJavaScript(`document.body.classList.remove('inactive')`)
  })
  win.on('blur', () => {
    win.setTitleBarOverlay({
      color: theme.titlebar.inactiveBackground,
      symbolColor: theme.titlebar.inactiveForeground,
    })
    win.webContents.executeJavaScript(`document.body.classList.add('inactive')`)
  })

  win.on('unmaximize', onWindowPosition(win))
  win.on('maximize', onWindowPosition(win))
  win.on('moved', onWindowPosition(win))

  win.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // You can use `process.env.VITE_DEV_SERVER_URL` when the vite command is called `serve`
  if (process.env.VITE_DEV_SERVER_URL) {
    await win.loadURL(process.env.VITE_DEV_SERVER_URL)
    win.webContents.openDevTools()
  } else {
    // Load your file
    await win.loadFile('dist/index.html')
  }
}

app.whenReady().then(async () => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  await createWindow()

  app.on('activate', async function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) await createWindow()
  })
})
