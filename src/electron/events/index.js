import { initilizeApp } from '../lib/config'
import { generateTtsAudio } from '../lib/google-tts'
import { getAppSettings, saveAppSettings, getCacheStats, clearCache } from './settings'

function runTts(_event, text, options) {
  return generateTtsAudio(text, options)
}

export default {
  'INIT-THEME': initilizeApp,
  'TTS-GENERATE': runTts,
  'SETTINGS-GET': getAppSettings,
  'SETTINGS-SET': saveAppSettings,
  'CACHE-STATS': getCacheStats,
  'CACHE-CLEAR': clearCache,
}
