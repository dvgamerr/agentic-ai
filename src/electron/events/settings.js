import { BrowserWindow } from 'electron'
import settings from '../lib/settings'
import { activeTheme } from '../lib/config'
import { clearTtsCache, getTtsCacheStats } from '../lib/tts-cache'

const SETTINGS_DEFAULTS = {
  ollama: {
    baseUrl: 'http://10.203.1.91:11434',
    defaultModel: 'gpt-oss:20b',
  },
  tts: {
    apiKey: '',
    model: 'gemini-3.1-flash-tts-preview',
    voice: 'Despina',
  },
  titlebar: {
    activeBackground: '#1c1c1f',
    activeForeground: '#004fe9',
    inactiveBackground: '#18181a',
    inactiveForeground: '#8f8f8f',
  },
}

function deepMerge(base, overrides) {
  if (!overrides || typeof overrides !== 'object') return { ...base }
  const out = { ...base }
  for (const key of Object.keys(overrides)) {
    const v = overrides[key]
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      out[key] = deepMerge(base?.[key] ?? {}, v)
    } else if (v !== undefined) {
      out[key] = v
    }
  }
  return out
}

export async function getAppSettings() {
  const stored = (await settings.get()) ?? {}
  return deepMerge(SETTINGS_DEFAULTS, stored)
}

export async function saveAppSettings(_event, payload = {}) {
  const current = (await settings.get()) ?? {}
  const next = deepMerge(current, payload)
  await settings.set(next)
  const result = deepMerge(SETTINGS_DEFAULTS, next)

  if (result.titlebar) {
    Object.assign(activeTheme.titlebar, result.titlebar)
    const win = BrowserWindow.getAllWindows()[0]
    if (win && !win.isDestroyed()) {
      const focused = win.isFocused()
      win.setTitleBarOverlay({
        color: focused ? activeTheme.titlebar.activeBackground : activeTheme.titlebar.inactiveBackground,
        symbolColor: focused ? activeTheme.titlebar.activeForeground : activeTheme.titlebar.inactiveForeground,
      })
      const fg = focused ? activeTheme.titlebar.activeForeground : activeTheme.titlebar.inactiveForeground
      const bg = focused ? activeTheme.titlebar.activeBackground : activeTheme.titlebar.inactiveBackground
      win.webContents
        .executeJavaScript(`document.documentElement.style.setProperty('--user-titlebar-foreground','${fg}'); document.documentElement.style.setProperty('--user-titlebar-background','${bg}');`)
        .catch(() => {})
    }
  }

  return result
}

export async function getCacheStats() {
  return getTtsCacheStats()
}

export async function clearCache() {
  return clearTtsCache()
}
