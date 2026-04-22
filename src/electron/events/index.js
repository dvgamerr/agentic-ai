import { initilizeApp } from '../lib/config'
import { generateTtsAudio } from '../lib/google-tts'
import { getAppSettings, saveAppSettings, getCacheStats, clearCache } from './settings'

const TTS_STARTUP = `Synthesize speech for the following Thai transcript.
Tone: soft, cute.

### TRANSCRIPT
[fastly] Agentic AI is a ready`

function runStartupTts(_event, text = TTS_STARTUP) {
  return generateTtsAudio(text)
}

function runTts(_event, text, options) {
  return generateTtsAudio(text, options)
}

export default {
  'INIT-THEME': initilizeApp,
  'RUN-STARTUP-TTS': runStartupTts,
  'TTS-GENERATE': runTts,
  'SETTINGS-GET': getAppSettings,
  'SETTINGS-SET': saveAppSettings,
  'CACHE-STATS': getCacheStats,
  'CACHE-CLEAR': clearCache,
}
