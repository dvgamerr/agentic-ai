import { ipcRenderer, contextBridge } from 'electron'
// import { electronAPI } from '@electron-toolkit/preload'
import { domReady, createPreloading } from './dom'
import { sleep } from './lib/helper'

const playingAudio = new Set()

function waitForAudioEnded(audio) {
  return new Promise((resolve, reject) => {
    const cleanup = () => {
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('error', onError)
    }
    const onEnded = () => {
      cleanup()
      resolve()
    }
    const onError = () => {
      cleanup()
      reject(audio.error ?? new Error('TTS audio playback failed.'))
    }

    audio.addEventListener('ended', onEnded)
    audio.addEventListener('error', onError)
  })
}

async function playTtsAudio({ data, mimeType = 'audio/wav' } = {}) {
  if (!data) return

  const audio = new Audio(`data:${mimeType};base64,${data}`)
  playingAudio.add(audio)

  try {
    const ended = waitForAudioEnded(audio)
    await audio.play()
    await ended
  } finally {
    playingAudio.delete(audio)
  }
}

const api = {
  settings: {
    get: () => ipcRenderer.invoke('SETTINGS-GET'),
    set: (payload) => ipcRenderer.invoke('SETTINGS-SET', payload),
  },
  tts: {
    generate: (text, options) => ipcRenderer.invoke('TTS-GENERATE', text, options),
    play: (payload) => playTtsAudio(payload),
  },
  cache: {
    stats: () => ipcRenderer.invoke('CACHE-STATS'),
    clear: () => ipcRenderer.invoke('CACHE-CLEAR'),
  },
}

try {
  contextBridge.exposeInMainWorld('api', api)
} catch (err) {
  console.error('[preload] failed to expose api:', err)
}

Promise.all([
  domReady(),
  ipcRenderer.invoke('INIT-THEME'),
  ipcRenderer.invoke('RUN-STARTUP-TTS').catch((err) => {
    console.error('[tts] failed:', err)
    return null
  }),
]).then(async (res) => {
  const [, { theme }, startupAudio] = res
  const payload = createPreloading(theme)

  payload.init()
  await sleep()
  await playTtsAudio(startupAudio).catch((err) => {
    console.error('[tts] playback failed:', err)
  })
  payload.remove()
  console.log({ contextIsolated: process.contextIsolated })
  console.log('init preload.')
})
