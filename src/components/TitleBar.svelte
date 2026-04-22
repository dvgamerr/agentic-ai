<script>
  import { Settings, Home, ChevronRight } from '@lucide/svelte'
  import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuLabel } from '$lib/components/ui/dropdown-menu/index.js'

  const menuItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Settings', href: '/settings', icon: Settings },
  ]

  let currentPath = $state('/')

  $effect(() => {
    if (typeof window !== 'undefined') currentPath = window.location.pathname
  })

  function navigate(href) {
    if (typeof window !== 'undefined') window.location.href = href
  }
</script>

<div id="titlebar" class="select-none">
  <div class="bar flex items-center gap-1 px-2 w-full">
    <DropdownMenu>
      <DropdownMenuTrigger class="menu-btn" aria-label="Menu">
        <div class="preload-ico idle"></div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" sideOffset={4} class="w-44">
        {#each menuItems as item}
          <DropdownMenuItem class="gap-2 cursor-pointer" onclick={() => navigate(item.href)}>
            <item.icon size={14} strokeWidth={1.75} />
            <span>{item.label}</span>
            {#if currentPath === item.href}
              <ChevronRight size={12} class="ml-auto opacity-60" />
            {/if}
          </DropdownMenuItem>
        {/each}
      </DropdownMenuContent>
    </DropdownMenu>

    <div class="logo flex items-center gap-1.5 ml-1">
      <img src="/logo.png" height="18" width="18" alt="Hades App" />
      <span class="text-xs font-bold tracking-wide" style="font-family: 'Mulish'">Hades</span>
    </div>

    <div class="flex-1"></div>
    <div class="empty w-30.5 shrink-0"></div>
  </div>
</div>

<style>
  #titlebar {
    grid-area: title;
  }

  #titlebar .bar {
    -webkit-app-region: drag;
    height: var(--system-titleBar-height);
  }

  :global(#titlebar .menu-btn),
  :global(#titlebar .icon-btn) {
    -webkit-app-region: no-drag;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    border-radius: 6px;
    color: color-mix(in srgb, currentColor 60%, transparent);
    cursor: pointer;
    flex-shrink: 0;
    text-decoration: none;
    transition:
      background 0.15s,
      color 0.15s;
  }

  :global(#titlebar .menu-btn) {
    width: 2rem;
    height: 1.75rem;
  }

  :global(#titlebar .icon-btn) {
    width: 1.75rem;
    height: 1.75rem;
  }

  :global(#titlebar .menu-btn:hover),
  :global(#titlebar .icon-btn:hover) {
    background: color-mix(in srgb, currentColor 12%, transparent);
    color: inherit;
  }

  :global(#titlebar .menu-btn:active),
  :global(#titlebar .icon-btn:active) {
    background: color-mix(in srgb, currentColor 18%, transparent);
  }

  :global(#titlebar .menu-btn .preload-ico) {
    transform: scale(0.18);
  }

  :global(#titlebar .menu-btn .idle),
  :global(#titlebar .menu-btn .idle::before),
  :global(#titlebar .menu-btn .idle::after) {
    animation: none !important;
  }
</style>
