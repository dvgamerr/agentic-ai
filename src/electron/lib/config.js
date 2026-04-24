import { access, mkdir, readFile } from 'fs/promises'
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

function mergeTheme(base, overrides = {}) {
  return {
    ...base,
    ...overrides,
    titlebar: {
      ...base.titlebar,
      ...(overrides.titlebar ?? {}),
    },
  }
}

async function loadThemeConfig(configFile) {
  try {
    const source = await readFile(configFile, 'utf-8')
    const parsed = yaml.parse(source) ?? {}
    return mergeTheme(defaultTheme, parsed)
  } catch {
    return mergeTheme(defaultTheme)
  }
}

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

  const nextTheme = await loadThemeConfig(configfile)

  Object.assign(activeTheme, nextTheme)
  Object.assign(activeTheme.titlebar, nextTheme.titlebar)
  return { config, theme: activeTheme }
}
