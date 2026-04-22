<script>
  import { Trash2, Save, Loader2 } from '@lucide/svelte'
  import { Input } from '$lib/components/ui/input/index.js'
  import { Button } from '$lib/components/ui/button/index.js'
  import { Label } from '$lib/components/ui/label/index.js'
  import { Separator } from '$lib/components/ui/separator/index.js'

  let loaded = $state(false)
  let saving = $state(false)
  let clearing = $state(false)
  let message = $state('')

  let form = $state({
    ollama: { baseUrl: '', defaultModel: '' },
    tts: { apiKey: '', model: '', voice: '' },
  })
  let stats = $state({ count: 0, bytes: 0, dir: '' })

  function formatBytes(n) {
    if (!n) return '0 B'
    const u = ['B', 'KB', 'MB', 'GB']
    let i = 0
    let v = n
    while (v >= 1024 && i < u.length - 1) {
      v /= 1024
      i++
    }
    return `${v.toFixed(v < 10 ? 2 : 1)} ${u[i]}`
  }

  async function load() {
    const api = window.api
    if (!api) return
    const [s, c] = await Promise.all([api.settings.get(), api.cache.stats()])
    form = {
      ollama: { baseUrl: s?.ollama?.baseUrl ?? '', defaultModel: s?.ollama?.defaultModel ?? '' },
      tts: { apiKey: s?.tts?.apiKey ?? '', model: s?.tts?.model ?? '', voice: s?.tts?.voice ?? '' },
    }
    stats = c ?? stats
    loaded = true
  }

  async function save() {
    if (!window.api) return
    saving = true
    message = ''
    try {
      await window.api.settings.set($state.snapshot(form))
      message = 'Saved.'
    } catch (err) {
      message = `Save failed: ${err?.message ?? err}`
    } finally {
      saving = false
      setTimeout(() => (message = ''), 1800)
    }
  }

  async function clearCache() {
    if (!window.api) return
    clearing = true
    try {
      const res = await window.api.cache.clear()
      stats = await window.api.cache.stats()
      message = `Cleared ${res?.removed ?? 0} file(s).`
    } catch (err) {
      message = `Clear failed: ${err?.message ?? err}`
    } finally {
      clearing = false
      setTimeout(() => (message = ''), 1800)
    }
  }

  $effect(() => {
    load()
  })
</script>

<div class="settings-page max-w-2xl mx-auto px-8 py-8 space-y-8 select-text">
  <header class="space-y-1">
    <h1 class="text-xl font-semibold tracking-tight">Settings</h1>
    <p class="text-sm text-muted-foreground">Manage your application preferences and integrations.</p>
  </header>
  {#if !loaded}
    <div class="flex items-center gap-2 text-muted-foreground text-sm">
      <Loader2 size={14} class="animate-spin" /> Loading…
    </div>
  {:else}
    <!-- Ollama -->
    <section class="space-y-4">
      <div>
        <h2 class="text-sm font-semibold">Ollama</h2>
        <p class="text-xs text-muted-foreground mt-0.5">Local LLM connection settings</p>
      </div>
      <Separator />
      <div class="grid gap-4">
        <div class="space-y-1.5">
          <Label for="ollama-url" class="text-xs">OLLAMA_BASE_URL</Label>
          <Input id="ollama-url" type="text" bind:value={form.ollama.baseUrl} placeholder="http://10.203.1.91:11434" class="font-mono text-xs" />
        </div>
        <div class="space-y-1.5">
          <Label for="ollama-model" class="text-xs">OLLAMA_DEFAULT_MODEL</Label>
          <Input id="ollama-model" type="text" bind:value={form.ollama.defaultModel} placeholder="gpt-oss:20b" class="font-mono text-xs" />
        </div>
      </div>
    </section>

    <!-- Google Gemini TTS -->
    <section class="space-y-4">
      <div>
        <h2 class="text-sm font-semibold">Google Gemini TTS</h2>
        <p class="text-xs text-muted-foreground mt-0.5">Text-to-speech configuration</p>
      </div>
      <Separator />
      <div class="grid gap-4">
        <div class="space-y-1.5">
          <Label for="tts-key" class="text-xs">GEMINI_API_KEY</Label>
          <Input id="tts-key" type="password" autocomplete="off" bind:value={form.tts.apiKey} placeholder="AIza…" class="font-mono text-xs" />
        </div>
        <div class="space-y-1.5">
          <Label for="tts-model" class="text-xs">GOOGLE_TTS_MODEL</Label>
          <Input id="tts-model" type="text" bind:value={form.tts.model} placeholder="gemini-3.1-flash-tts-preview" class="font-mono text-xs" />
        </div>
        <div class="space-y-1.5">
          <Label for="tts-voice" class="text-xs">GOOGLE_TTS_VOICE</Label>
          <Input id="tts-voice" type="text" bind:value={form.tts.voice} placeholder="Despina" class="font-mono text-xs" />
        </div>
      </div>
    </section>

    <!-- TTS Cache -->
    <section class="space-y-4">
      <div>
        <h2 class="text-sm font-semibold">TTS Cache</h2>
        <p class="text-xs text-muted-foreground mt-0.5">Manage cached audio files</p>
      </div>
      <Separator />
      <div class="flex items-center justify-between">
        <div class="space-y-0.5">
          <p class="text-xs">{stats.count} file(s) · {formatBytes(stats.bytes)}</p>
          {#if stats.dir}
            <p class="text-[10px] text-muted-foreground truncate max-w-xs" title={stats.dir}>{stats.dir}</p>
          {/if}
        </div>
        <Button variant="destructive" size="sm" disabled={clearing || stats.count === 0} onclick={clearCache} class="gap-1.5">
          {#if clearing}<Loader2 size={13} class="animate-spin" />{:else}<Trash2 size={13} />{/if}
          Clear cache
        </Button>
      </div>
    </section>

    <!-- Footer actions -->
    <div class="flex items-center justify-between pt-2">
      <span class="text-xs text-muted-foreground min-h-[1em]">{message}</span>
      <Button size="sm" disabled={saving} onclick={save} class="gap-1.5">
        {#if saving}<Loader2 size={13} class="animate-spin" />{:else}<Save size={13} />{/if}
        Save
      </Button>
    </div>
  {/if}
</div>
