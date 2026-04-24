import { access, mkdir } from 'fs/promises'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import electron from 'electron'
import settings from './settings'
import yaml from 'yaml'

const { app } = electron

export const defaultTheme = {
  textColor: '#e8e8e8',
  backgroundColor: '#1c1c1f',
  titlebar: {
    activeBackground: '#1c1c1f',
    activeForeground: '#004fe9',
    inactiveBackground: '#18181a',
    inactiveForeground: '#8f8f8f',
  },
}

export const activeTheme = { ...defaultTheme, titlebar: { ...defaultTheme.titlebar } }

const config = {
  config: join(app.getPath('home'), '.hades'),
  width: 1160,
  height: 725,
}

settings.configure({
  dir: config.config,
  fileName: 'settings.yaml',
  numSpaces: 2,
})

export const initilizeApp = async () => {
  const configfile = join(config.config, 'config.yaml')
  console.log({ configfile })
  try {
    await access(config.config)
  } catch {
    await mkdir(config.config, { recursive: true })
  }

  try {
    await access(configfile)
  } catch {
    await writeFile(configfile, yaml.stringify(defaultTheme))
  }
  Object.assign(activeTheme, defaultTheme)
  Object.assign(activeTheme.titlebar, defaultTheme.titlebar)
  return { config, theme: activeTheme }
}
