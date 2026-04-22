import { GoogleGenAI } from '@google/genai'
import settings from './settings'
import { hashTtsKey, readCachedWav, writeCachedWav } from './tts-cache'

export const GOOGLE_TTS_MODEL = 'gemini-3.1-flash-tts-preview'
export const GOOGLE_TTS_VOICE = 'Despina'

async function getTtsConfig(options = {}) {
  const stored = (await settings.get('tts')) ?? {}
  return {
    apiKey: options.apiKey || stored.apiKey || process.env.GEMINI_API_KEY,
    model: options.model || stored.model || GOOGLE_TTS_MODEL,
    voiceName: options.voiceName || stored.voice || GOOGLE_TTS_VOICE,
  }
}

function getSampleRate(mimeType) {
  const match = mimeType?.match(/rate=(\d+)/)
  return match ? Number(match[1]) : 24000
}

function toWavBuffer(pcmData, { channels = 1, sampleRate = 24000, bitsPerSample = 16 } = {}) {
  const header = Buffer.alloc(44)
  const bytesPerSample = bitsPerSample / 8
  const blockAlign = channels * bytesPerSample
  const byteRate = sampleRate * blockAlign

  header.write('RIFF', 0)
  header.writeUInt32LE(36 + pcmData.length, 4)
  header.write('WAVE', 8)
  header.write('fmt ', 12)
  header.writeUInt32LE(16, 16)
  header.writeUInt16LE(1, 20)
  header.writeUInt16LE(channels, 22)
  header.writeUInt32LE(sampleRate, 24)
  header.writeUInt32LE(byteRate, 28)
  header.writeUInt16LE(blockAlign, 32)
  header.writeUInt16LE(bitsPerSample, 34)
  header.write('data', 36)
  header.writeUInt32LE(pcmData.length, 40)

  return Buffer.concat([header, pcmData])
}

function getAudioInlineData(response) {
  const parts = response.candidates?.[0]?.content?.parts ?? []
  const audioPart = parts.find((part) => part.inlineData?.data ?? part.inline_data?.data)
  return audioPart?.inlineData ?? audioPart?.inline_data
}

export async function generateTtsAudio(text, options = {}) {
  const { apiKey, model, voiceName } = await getTtsConfig(options)
  if (typeof text !== 'string' || !text.trim()) {
    throw new TypeError('TTS text must be a non-empty string.')
  }

  const hash = hashTtsKey(text, voiceName, model)
  const cached = await readCachedWav(hash)
  if (cached) {
    console.log(`[tts] cache hit ${hash.slice(0, 8)}`)
    return { ...cached, model }
  }

  if (!apiKey) {
    console.warn('[tts] skipped: set GEMINI_API_KEY in settings or env to enable Gemini TTS.')
    return { skipped: true, reason: 'missing-api-key' }
  }

  const ai = new GoogleGenAI({ apiKey })
  const response = await ai.models.generateContent({
    model,
    contents: [{ parts: [{ text }] }],
    config: {
      responseModalities: ['AUDIO'],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName },
        },
      },
    },
  })

  const inlineData = getAudioInlineData(response)
  if (!inlineData?.data) {
    throw new Error('Gemini TTS response did not include audio data.')
  }

  const pcmData = typeof inlineData.data === 'string' ? Buffer.from(inlineData.data, 'base64') : Buffer.from(inlineData.data)
  const wavData = toWavBuffer(pcmData, {
    sampleRate: getSampleRate(inlineData.mimeType ?? inlineData.mime_type),
  })

  const base64 = wavData.toString('base64')
  const file = await writeCachedWav(hash, base64)
  console.log(`[tts] generated audio with ${model} -> ${file}`)

  return {
    data: base64,
    mimeType: 'audio/wav',
    model,
    cached: false,
    file,
  }
}
