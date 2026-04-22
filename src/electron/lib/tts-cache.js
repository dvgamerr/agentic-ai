import { createHash } from 'crypto'
import { mkdir, readFile, writeFile, readdir, unlink, stat } from 'fs/promises'
import { join } from 'path'
import { app } from 'electron'

export const CACHE_DIR_NAME = 'tts-cache'

function getCacheRoot() {
  return join(app.getPath('home'), '.hades', CACHE_DIR_NAME)
}

async function ensureCacheDir() {
  const dir = getCacheRoot()
  await mkdir(dir, { recursive: true })
  return dir
}

export function hashTtsKey(text, voice, model) {
  return createHash('sha256').update(`${text}|${voice}|${model}`).digest('hex')
}

export async function readCachedWav(hash) {
  try {
    const dir = await ensureCacheDir()
    const file = join(dir, `${hash}.wav`)
    const buf = await readFile(file)
    return { data: buf.toString('base64'), mimeType: 'audio/wav', cached: true, file }
  } catch (err) {
    if (err.code === 'ENOENT') return null
    throw err
  }
}

export async function writeCachedWav(hash, base64Data) {
  const dir = await ensureCacheDir()
  const file = join(dir, `${hash}.wav`)
  await writeFile(file, Buffer.from(base64Data, 'base64'))
  return file
}

export async function clearTtsCache() {
  const dir = await ensureCacheDir()
  const entries = await readdir(dir)
  let removed = 0
  let bytes = 0
  for (const name of entries) {
    if (!name.endsWith('.wav')) continue
    const file = join(dir, name)
    try {
      const s = await stat(file)
      bytes += s.size
      await unlink(file)
      removed++
    } catch {
      // ignore individual file failures
    }
  }
  return { removed, bytes, dir }
}

export async function getTtsCacheStats() {
  const dir = await ensureCacheDir()
  const entries = await readdir(dir)
  let count = 0
  let bytes = 0
  for (const name of entries) {
    if (!name.endsWith('.wav')) continue
    try {
      const s = await stat(join(dir, name))
      bytes += s.size
      count++
    } catch {
      // ignore
    }
  }
  return { count, bytes, dir }
}
