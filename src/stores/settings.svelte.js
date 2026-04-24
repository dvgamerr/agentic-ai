const state = $state({
  loaded: false,
  form: {
    ollama: { baseUrl: '', defaultModel: '' },
    tts: { apiKey: '', model: '', voice: '' },
  },
  stats: { count: 0, bytes: 0, dir: '' },
})

export default state

export async function loadSettings() {
  const api = window.api
  if (!api || state.loaded) return
  const [s, c] = await Promise.all([api.settings.get(), api.cache.stats()])
  state.form = {
    ollama: { baseUrl: s?.ollama?.baseUrl ?? '', defaultModel: s?.ollama?.defaultModel ?? '' },
    tts: { apiKey: s?.tts?.apiKey ?? '', model: s?.tts?.model ?? '', voice: s?.tts?.voice ?? '' },
  }
  state.stats = c ?? state.stats
  state.loaded = true
}

export function invalidateSettings() {
  state.loaded = false
}
