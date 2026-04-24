<script>
  import { Layers, MessageSquare, Moon, Sparkles, Zap, Brain, Lock, Compass, Search, Settings2, FileText, Code2, Calendar } from '@lucide/svelte'

  let active = $state('models')

  const nav = [
    { id: 'models', label: 'Models', icon: Layers },
    { id: 'memory', label: 'Memory', icon: MessageSquare },
    { id: 'dream', label: 'Dream Cycle', icon: Moon },
    { id: 'skills', label: 'Skills', icon: Sparkles },
  ]

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

<div class="dashboard grid h-full gap-4 p-4" style="grid-template-columns: 200px 1fr;">
  <!-- Sidebar -->
  <aside class="rounded-xl border border-border/60 bg-card/40 p-3 flex flex-col gap-1">
    <div class="flex items-center gap-2 px-2 py-3">
      <img src="/logo.png" width="20" height="20" alt="logo" />
      <span class="font-semibold text-sm" style="font-family: 'Mulish'">Hades</span>
    </div>
    <nav class="flex flex-col gap-0.5 mt-2">
      {#each nav as item (item.id)}
        {@const Icon = item.icon}
        <button
          type="button"
          onclick={() => (active = item.id)}
          class="flex items-center gap-2.5 px-3 py-2 rounded-md text-xs text-left transition-colors
                 {active === item.id ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:bg-accent hover:text-foreground'}"
        >
          <Icon size={15} />
          <span>{item.label}</span>
        </button>
      {/each}
    </nav>
  </aside>

  <!-- Main -->
  <main class="flex flex-col gap-5 overflow-auto pr-1">
    <h1 class="text-lg font-semibold tracking-tight">Personal AI Stack</h1>

    <!-- Models grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
      {#each models as m (m.name)}
        {@const Icon = m.icon}
        <div class="rounded-xl border border-border/60 bg-card/40 p-4 flex flex-col gap-3">
          <div class="flex items-start justify-between gap-3">
            <div class="flex flex-col gap-0.5 min-w-0">
              <div class="flex items-center gap-2">
                <span class="size-2 rounded-full {m.dot}"></span>
                <span class="text-sm font-semibold truncate">{m.name}</span>
              </div>
              <span class="text-[11px] text-muted-foreground">{m.role}</span>
            </div>
            <div class="size-8 rounded-md flex items-center justify-center {m.iconBg}">
              <Icon size={15} />
            </div>
          </div>
          <div class="flex items-center gap-3 text-[10.5px] text-muted-foreground border-t border-border/50 pt-2.5">
            {#each m.stats as [k, v]}
              <span class="flex gap-1">
                <span>{k}:</span>
                <span class="text-foreground font-medium">{v}</span>
              </span>
            {/each}
          </div>
        </div>
      {/each}
    </div>

    <!-- Dream Cycle -->
    <section class="rounded-xl border border-border/60 bg-card/40 p-4">
      <header class="flex items-center justify-between mb-3">
        <h2 class="text-sm font-semibold">Dream Cycle</h2>
        <Moon size={14} class="text-muted-foreground" />
      </header>
      <div class="grid grid-cols-3 gap-2">
        {#each dreamPhases as p (p.id)}
          {@const isActive = activePhase === p.id}
          <button
            type="button"
            onclick={() => (activePhase = p.id)}
            class="relative rounded-full px-4 py-2.5 text-xs flex items-center justify-between overflow-hidden border transition-colors
                   {isActive ? 'bg-gradient-to-r from-sky-500/30 to-indigo-500/30 border-sky-400/50 text-foreground' : 'bg-muted/40 border-border/60 text-muted-foreground hover:text-foreground'}"
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
      <div class="grid grid-cols-3 gap-2 mt-2 text-[10.5px] text-muted-foreground">
        {#each dreamPhases as p (p.id)}
          <span class="px-1">{p.label} ({p.pct}%)</span>
        {/each}
      </div>
    </section>

    <!-- GBRAIN Memory -->
    <section class="rounded-xl border border-border/60 bg-card/40 p-4">
      <h2 class="text-sm font-semibold mb-3">GBRAIN Memory</h2>
      <div class="relative mb-3">
        <Search size={13} class="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          bind:value={search}
          placeholder="Search memory entries..."
          class="w-full bg-background/60 border border-border/60 rounded-md pl-8 pr-3 py-1.5 text-xs outline-none focus:border-primary/60 transition-colors"
        />
      </div>
      <ul class="flex flex-col">
        {#each memories.filter((m) => !search || m.title.toLowerCase().includes(search.toLowerCase())) as m, i (m.title)}
          {@const Icon = m.icon}
          <li class="flex items-center gap-3 py-2.5 text-xs {i > 0 ? 'border-t border-border/40' : ''}">
            <span class="size-7 rounded-md bg-muted/60 flex items-center justify-center text-muted-foreground shrink-0">
              <Icon size={13} />
            </span>
            <div class="flex-1 min-w-0 flex items-baseline gap-1.5 flex-wrap">
              <span class="text-muted-foreground text-[11px]">{m.kind}:</span>
              <span class="font-medium truncate">{m.title}</span>
              <span class="text-muted-foreground text-[11px]">({m.meta})</span>
              <span class="text-muted-foreground text-[11px]">- {m.desc}</span>
            </div>
          </li>
        {/each}
      </ul>
    </section>
  </main>
</div>
