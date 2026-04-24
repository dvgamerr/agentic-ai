<script>
  import { Moon, Zap, Brain, Lock, Compass, Search, Settings2, FileText, Code2, Calendar, Sparkles } from '@lucide/svelte'

  const models = [
    {
      name: 'Gemini Flash',
      role: 'Background Tasks',
      dot: 'bg-emerald-500',
      icon: Zap,
      iconBg: 'bg-emerald-500/15 text-emerald-400',
      stats: [
        ['Accuracy', '95%'],
        ['Speed', '5ms'],
        ['Latency', '10ms'],
      ],
    },
    {
      name: 'Gemini Pro',
      role: 'Quality Tasks',
      dot: 'bg-sky-500',
      icon: Brain,
      iconBg: 'bg-sky-500/15 text-sky-400',
      stats: [
        ['Accuracy', '95%'],
        ['Latency', '10ms'],
        ['Cost', 'Low'],
      ],
    },
    {
      name: 'Qwen 14B',
      role: 'Local/Private',
      dot: 'bg-violet-500',
      icon: Lock,
      iconBg: 'bg-violet-500/15 text-violet-400',
      stats: [
        ['Accuracy', '95%'],
        ['Privacy', 'High'],
        ['Cost', 'Low'],
      ],
    },
    {
      name: 'Claude',
      role: 'Deep Reasoning',
      dot: 'bg-orange-500',
      icon: Compass,
      iconBg: 'bg-orange-500/15 text-orange-400',
      stats: [
        ['Accuracy', '95%'],
        ['Privacy', 'High'],
        ['Cost', 'Low'],
      ],
    },
  ]

  const dreamPhases = [
    { id: 'light', label: 'Light Sleep', pct: 40 },
    { id: 'rem', label: 'REM Sleep', pct: 40 },
    { id: 'deep', label: 'Deep Sleep', pct: 20 },
  ]
  let activePhase = $state('rem')

  const memories = [
    { kind: 'Recent', icon: Settings2, title: 'User Preference Update', meta: '10 min ago', desc: 'Adjusted model priorities' },
    { kind: 'Recent', icon: FileText, title: 'Project X Analysis', meta: '2 hours ago', desc: 'Summarized key findings' },
    { kind: 'Recent', icon: Code2, title: 'Code Review Session', meta: 'Yesterday', desc: 'Identified potential bugs and optimizations' },
    { kind: 'Recent', icon: Calendar, title: 'Daily Standup', meta: '2 days ago', desc: 'Logged progress and blockers' },
  ]

  let search = $state('')
</script>

<div class="flex flex-col gap-5">
  <section id="models" class="scroll-mt-8">
    <h1 class="pt-1 text-lg font-semibold tracking-tight">Personal AI Stack</h1>
  </section>

  <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
    {#each models as m (m.name)}
      {@const Icon = m.icon}
      <div class="flex flex-col gap-3 rounded-xl border border-border/60 bg-card/40 p-4">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0 flex flex-col gap-0.5">
            <div class="flex items-center gap-2">
              <span class="size-2 rounded-full {m.dot}"></span>
              <span class="truncate text-sm font-semibold">{m.name}</span>
            </div>
            <span class="text-[11px] text-muted-foreground">{m.role}</span>
          </div>
          <div class="flex size-8 items-center justify-center rounded-md {m.iconBg}">
            <Icon size={15} />
          </div>
        </div>
        <div class="border-t border-border/50 pt-2.5 text-[10.5px] text-muted-foreground">
          <div class="flex items-center gap-3">
            {#each m.stats as [k, v]}
              <span class="flex gap-1">
                <span>{k}:</span>
                <span class="font-medium text-foreground">{v}</span>
              </span>
            {/each}
          </div>
        </div>
      </div>
    {/each}
  </div>

  <section id="dream" class="rounded-xl border border-border/60 bg-card/40 p-4 scroll-mt-8">
    <header class="mb-3 flex items-center justify-between">
      <h2 class="text-sm font-semibold">Dream Cycle</h2>
      <Moon size={14} class="text-muted-foreground" />
    </header>
    <div class="grid grid-cols-3 gap-2">
      {#each dreamPhases as p (p.id)}
        {@const isActive = activePhase === p.id}
        <button
          type="button"
          onclick={() => (activePhase = p.id)}
          class="relative flex items-center justify-between overflow-hidden rounded-full border px-4 py-2.5 text-xs transition-colors
                 {isActive ? 'border-sky-400/50 bg-gradient-to-r from-sky-500/30 to-indigo-500/30 text-foreground' : 'border-border/60 bg-muted/40 text-muted-foreground hover:text-foreground'}"
        >
          <span class="font-medium">{p.label}</span>
          {#if isActive}
            <svg viewBox="0 0 80 16" class="h-3 w-12 text-sky-300/80" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M0 8 Q 10 0 20 8 T 40 8 T 60 8 T 80 8" />
            </svg>
          {:else}
            <Moon size={12} />
          {/if}
        </button>
      {/each}
    </div>
    <div class="mt-2 grid grid-cols-3 gap-2 text-[10.5px] text-muted-foreground">
      {#each dreamPhases as p (p.id)}
        <span class="px-1">{p.label} ({p.pct}%)</span>
      {/each}
    </div>
  </section>

  <section id="memory" class="rounded-xl border border-border/60 bg-card/40 p-4 scroll-mt-8">
    <h2 class="mb-3 text-sm font-semibold">GBRAIN Memory</h2>
    <div class="relative mb-3">
      <Search size={13} class="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
      <input
        type="text"
        bind:value={search}
        placeholder="Search memory entries..."
        class="w-full rounded-md border border-border/60 bg-background/60 py-1.5 pr-3 pl-8 text-xs outline-none transition-colors focus:border-primary/60"
      />
    </div>
    <ul class="flex flex-col">
      {#each memories.filter((m) => !search || m.title.toLowerCase().includes(search.toLowerCase())) as m, i (m.title)}
        {@const Icon = m.icon}
        <li class="flex items-center gap-3 py-2.5 text-xs {i > 0 ? 'border-t border-border/40' : ''}">
          <span class="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted/60 text-muted-foreground">
            <Icon size={13} />
          </span>
          <div class="flex min-w-0 flex-1 flex-wrap items-baseline gap-1.5">
            <span class="text-[11px] text-muted-foreground">{m.kind}:</span>
            <span class="truncate font-medium">{m.title}</span>
            <span class="text-[11px] text-muted-foreground">({m.meta})</span>
            <span class="text-[11px] text-muted-foreground">- {m.desc}</span>
          </div>
        </li>
      {/each}
    </ul>
  </section>

  <section id="skills" class="rounded-xl border border-dashed border-border/60 bg-card/20 p-4 scroll-mt-8">
    <div class="mb-2 flex items-center gap-2 text-sm font-semibold">
      <Sparkles size={14} class="text-muted-foreground" />
      <h2>Skills</h2>
    </div>
    <p class="text-xs text-muted-foreground">Skills overview section is reserved for future content.</p>
  </section>
</div>
