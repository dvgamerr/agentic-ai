import { screen } from 'electron'
import settings from '../lib/settings'
import { debounce } from '../lib/helper'

const setPosition = (mainWindow) => {
  const [winX, winY] = mainWindow.getPosition()
  const { width, height } = screen.getPrimaryDisplay().workAreaSize
  const [winWidth, winHeight] = mainWindow.getSize()
  const clampedX = Math.max(0, Math.min(winX, width - winWidth))
  const clampedY = Math.max(0, Math.min(winY, height - winHeight))
  const config = {
    maximized: mainWindow.isMaximized(),
    width: winWidth,
    height: winHeight,
    x: clampedX,
    y: clampedY,
  }

  settings.set(config.maximized ? 'position.maximized' : 'position', config.maximized ? config.maximized : config)
}

export const onWindowPosition = (mainWindow) => debounce(() => setPosition(mainWindow), 200)
