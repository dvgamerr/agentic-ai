import settings from '../lib/settings'
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
  return deepMerge(SETTINGS_DEFAULTS, next)
}

export async function getCacheStats() {
  return getTtsCacheStats()
}

export async function clearCache() {
  return clearTtsCache()
}
