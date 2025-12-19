import electron from 'electron'
import path from 'path'
import YAML from 'yaml'
import { readFile, writeFile, mkdir, rename, access } from 'fs/promises'

const defaultConfig = {
  atomicSave: true,
  fileName: 'settings.yaml',
}

let config = { ...defaultConfig }

function getElectron() {
  return config.electron ?? electron
}

function getElectronApp() {
  const e = getElectron()
  const app = e.app ?? e.remote.app
  return app
}

function getSettingsDirPath() {
  return config.dir ?? getElectronApp().getPath('userData')
}

function getSettingsFilePath() {
  const dir = getSettingsDirPath()
  return path.join(dir, config.fileName)
}

async function ensureSettingsFile() {
  const filePath = getSettingsFilePath()
  try {
    await access(filePath)
  } catch (err) {
    if (err.code === 'ENOENT') {
      await saveSettings({})
    } else {
      throw err
    }
  }
}

async function ensureSettingsDir() {
  const dirPath = getSettingsDirPath()
  try {
    await mkdir(dirPath, { recursive: true })
  } catch (err) {
    if (err.code !== 'EEXIST') {
      throw new Error(`Failed to create directory: ${dirPath}`)
    }
  }
}

async function loadSettings() {
  await ensureSettingsFile()
  const filePath = getSettingsFilePath()
  try {
    const text = await readFile(filePath, 'utf-8')
    return YAML.parse(text || '{}') || {}
  } catch {
    return {}
  }
}

async function saveSettings(obj) {
  await ensureSettingsDir()
  const filePath = getSettingsFilePath()
  const data = YAML.stringify(obj)

  if (config.atomicSave) {
    const tempPath = filePath + '.tmp'
    await writeFile(tempPath, data, 'utf-8')
    await rename(tempPath, filePath)
  } else {
    await writeFile(filePath, data, 'utf-8')
  }
}

function _get(obj, keyPath, defaultValue) {
  if (!keyPath) return obj
  const path = Array.isArray(keyPath) ? keyPath : keyPath.toString().split('.')
  let result = obj
  for (let key of path) {
    const arrayMatch = key.match(/^(.+)\[(\d+)\]$/)
    if (arrayMatch) {
      result = result?.[arrayMatch[1]]?.[parseInt(arrayMatch[2])]
    } else {
      result = result?.[key]
    }
    if (result === undefined) return defaultValue
  }
  return result
}

function _has(obj, keyPath) {
  if (!keyPath) return false
  const path = Array.isArray(keyPath) ? keyPath : keyPath.toString().split('.')
  let current = obj
  for (let key of path) {
    const arrayMatch = key.match(/^(.+)\[(\d+)\]$/)
    if (arrayMatch) {
      if (!current?.[arrayMatch[1]] || !(parseInt(arrayMatch[2]) in current[arrayMatch[1]])) {
        return false
      }
      current = current[arrayMatch[1]][parseInt(arrayMatch[2])]
    } else {
      if (!(key in current)) return false
      current = current[key]
    }
  }
  return true
}

function _set(obj, keyPath, value) {
  const path = Array.isArray(keyPath) ? keyPath : keyPath.toString().split('.')
  const lastKey = path[path.length - 1]
  let current = obj
  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i]
    const arrayMatch = key.match(/^(.+)\[(\d+)\]$/)
    if (arrayMatch) {
      const prop = arrayMatch[1]
      const index = parseInt(arrayMatch[2])
      if (!current[prop]) current[prop] = []
      if (!current[prop][index]) current[prop][index] = {}
      current = current[prop][index]
    } else {
      if (!current[key]) current[key] = {}
      current = current[key]
    }
  }
  const arrayMatch = lastKey.match(/^(.+)\[(\d+)\]$/)
  if (arrayMatch) {
    const prop = arrayMatch[1]
    const index = parseInt(arrayMatch[2])
    if (!current[prop]) current[prop] = []
    current[prop][index] = value
  } else {
    current[lastKey] = value
  }
  return obj
}

function _unset(obj, keyPath) {
  const path = Array.isArray(keyPath) ? keyPath : keyPath.toString().split('.')
  const lastKey = path[path.length - 1]
  let current = obj
  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i]
    const arrayMatch = key.match(/^(.+)\[(\d+)\]$/)
    if (arrayMatch) {
      const prop = arrayMatch[1]
      const index = parseInt(arrayMatch[2])
      current = current[prop]?.[index]
    } else {
      current = current[key]
    }
    if (current === undefined) return obj
  }
  const arrayMatch = lastKey.match(/^(.+)\[(\d+)\]$/)
  if (arrayMatch) {
    const prop = arrayMatch[1]
    const index = parseInt(arrayMatch[2])
    if (current[prop]) current[prop][index] = null
  } else {
    delete current[lastKey]
  }
  return obj
}

function file() {
  return getSettingsFilePath()
}

function configure(customConfig) {
  config = { ...config, ...customConfig }
}

function reset() {
  config = { ...defaultConfig }
}

async function has(keyPath) {
  const obj = await loadSettings()
  return _has(obj, keyPath)
}

async function get(keyPath) {
  const obj = await loadSettings()
  if (keyPath) {
    return _get(obj, keyPath)
  } else {
    return obj
  }
}

async function set(...args) {
  if (args.length === 1) {
    const [value] = args
    return saveSettings(value)
  } else {
    const [keyPath, value] = args
    const obj = await loadSettings()
    _set(obj, keyPath, value)
    return saveSettings(obj)
  }
}

async function unset(keyPath) {
  if (keyPath) {
    const obj = await loadSettings()
    _unset(obj, keyPath)
    return saveSettings(obj)
  } else {
    return saveSettings({})
  }
}

export default {
  file,
  configure,
  reset,
  has,
  get,
  set,
  unset,
}
