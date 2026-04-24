<script>
  import { Trash2, Save, Loader2, Settings2, Brain, AudioWaveform, DatabaseBackup, ShieldCheck } from '@lucide/svelte'
  import { Input } from '$lib/components/ui/input/index.js'
  import { Button } from '$lib/components/ui/button/index.js'
  import { Label } from '$lib/components/ui/label/index.js'
  import settingsStore, { loadSettings } from '../stores/settings.svelte.js'

  let saving = $state(false)
  let clearing = $state(false)
  let message = $state('')

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

  async function save() {
    if (!window.api) return
    saving = true
    message = ''
    try {
      await window.api.settings.set($state.snapshot(settingsStore.form))
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
      settingsStore.stats = (await window.api.cache.stats()) ?? settingsStore.stats
      message = `Cleared ${res?.removed ?? 0} file(s).`
    } catch (err) {
      message = `Clear failed: ${err?.message ?? err}`
    } finally {
      clearing = false
      setTimeout(() => (message = ''), 1800)
    }
  }

  $effect(() => {
    loadSettings()
  })
</script>

<div class="settings-page flex max-w-4xl flex-col gap-4 px-1 py-1 pr-2 select-text">
  <section class="scroll-mt-8">
    <div class="flex items-start justify-between gap-4">
      <div class="flex min-w-0 items-start gap-3">
        <div class="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/12 text-primary">
          <Settings2 size={16} />
        </div>
        <div class="min-w-0">
          <h1 class="pt-1 text-lg font-semibold tracking-tight">System Settings</h1>
          <p class="mt-0.5 text-xs text-muted-foreground">Manage local model access, voice generation, and cache behavior in one place.</p>
        </div>
      </div>
      <div class="hidden items-center gap-2 md:flex">
        <span class="rounded-full border border-border/60 bg-muted/30 px-2.5 py-1 text-[10.5px] text-muted-foreground">Configurable</span>
        <span class="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[10.5px] text-emerald-400">Local First</span>
      </div>
    </div>
  </section>

  {#if !settingsStore.loaded}
    <div class="flex items-center gap-2 rounded -xl border border-border/60 bg-card/40 p-4 text-sm text-muted-foreground">
      <Loader2 size={14} class="animate-spin" /> Loading…
    </div>
  {:else}
    <section class="grid gap-4 md:grid-cols-3">
      <div class="rounded-xl border border-border/60 bg-card/40 p-5">
        <div class="mb-4 flex items-center gap-2.5">
          <span class="flex size-8 items-center justify-center rounded-md bg-sky-500/15 text-sky-400">
            <Brain size={15} />
          </span>
          <div>
            <h2 class="text-sm font-semibold">Ollama</h2>
            <p class="text-[11px] text-muted-foreground">Local LLM endpoint</p>
          </div>
        </div>
        <div class="space-y-4">
          <div class="space-y-2">
            <Label for="ollama-url" class="text-[11px] text-muted-foreground">OLLAMA_BASE_URL</Label>
            <Input id="ollama-url" type="text" bind:value={settingsStore.form.ollama.baseUrl} placeholder="http://10.203.1.91:11434" class="border-border/60 bg-background/60 font-mono text-xs" />
          </div>
          <div class="space-y-2">
            <Label for="ollama-model" class="text-[11px] text-muted-foreground">OLLAMA_DEFAULT_MODEL</Label>
            <Input id="ollama-model" type="text" bind:value={settingsStore.form.ollama.defaultModel} placeholder="gpt-oss:20b" class="border-border/60 bg-background/60 font-mono text-xs" />
          </div>
        </div>
      </div>

      <div class="rounded-xl border border-border/60 bg-card/40 p-5">
        <div class="mb-4 flex items-center gap-2.5">
          <span class="flex size-8 items-center justify-center rounded-md bg-violet-500/15 text-violet-400">
            <AudioWaveform size={15} />
          </span>
          <div>
            <h2 class="text-sm font-semibold">Google Gemini TTS</h2>
            <p class="text-[11px] text-muted-foreground">Speech synthesis defaults</p>
          </div>
        </div>
        <div class="space-y-4">
          <div class="space-y-2">
            <Label for="tts-key" class="text-[11px] text-muted-foreground">GEMINI_API_KEY</Label>
            <Input id="tts-key" type="password" autocomplete="off" bind:value={settingsStore.form.tts.apiKey} placeholder="AIza…" class="border-border/60 bg-background/60 font-mono text-xs" />
          </div>
          <div class="space-y-2">
            <Label for="tts-model" class="text-[11px] text-muted-foreground">GOOGLE_TTS_MODEL</Label>
            <Input id="tts-model" type="text" bind:value={settingsStore.form.tts.model} placeholder="gemini-3.1-flash-tts-preview" class="border-border/60 bg-background/60 font-mono text-xs" />
          </div>
          <div class="space-y-2">
            <Label for="tts-voice" class="text-[11px] text-muted-foreground">GOOGLE_TTS_VOICE</Label>
            <Input id="tts-voice" type="text" bind:value={settingsStore.form.tts.voice} placeholder="Despina" class="border-border/60 bg-background/60 font-mono text-xs" />
          </div>
        </div>
      </div>

      <div class="rounded-xl border border-border/60 bg-card/40 p-5">
        <div class="mb-4 flex items-center gap-2.5">
          <span class="flex size-8 items-center justify-center rounded-md bg-orange-500/15 text-orange-400">
            <DatabaseBackup size={15} />
          </span>
          <div>
            <h2 class="text-sm font-semibold">TTS Cache</h2>
            <p class="text-[11px] text-muted-foreground">Manage generated audio</p>
          </div>
        </div>
        <div class="space-y-4">
          <div class="rounded-lg border border-border/50 bg-background/40 p-3">
            <div class="flex items-baseline justify-between gap-3">
              <p class="text-[11px] text-muted-foreground">Stored Files</p>
              <p class="text-sm font-semibold">{settingsStore.stats.count}</p>
            </div>
            <p class="mt-1 text-[11px] text-muted-foreground">{formatBytes(settingsStore.stats.bytes)} in cache</p>
          </div>
          {#if settingsStore.stats.dir}
            <div class="rounded-lg border border-border/50 bg-background/40 p-3">
              <p class="mb-1 text-[11px] text-muted-foreground">Directory</p>
              <p class="truncate font-mono text-[10.5px] text-foreground/85" title={settingsStore.stats.dir}>{settingsStore.stats.dir}</p>
            </div>
          {/if}
          <Button variant="destructive" size="sm" disabled={clearing || settingsStore.stats.count === 0} onclick={clearCache} class="w-full gap-1.5">
            {#if clearing}<Loader2 size={13} class="animate-spin" />{:else}<Trash2 size={13} />{/if}
            Clear cache
          </Button>
        </div>
      </div>
    </section>

    <section class="rounded-xl border border-border/60 bg-card/40 p-5">
      <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div class="flex items-start gap-3">
          <span class="flex size-8 shrink-0 items-center justify-center rounded-md bg-emerald-500/15 text-emerald-400">
            <ShieldCheck size={15} />
          </span>
          <div>
            <h2 class="text-sm font-semibold">Apply Changes</h2>
            <p class="mt-0.5 min-h-[1em] text-xs text-muted-foreground">{message || 'Settings are saved into your local application profile.'}</p>
          </div>
        </div>
        <Button size="sm" disabled={saving} onclick={save} class="gap-1.5 self-start md:self-auto">
          {#if saving}<Loader2 size={13} class="animate-spin" />{:else}<Save size={13} />{/if}
          Save settings
        </Button>
      </div>
    </section>
  {/if}
</div>
