<script>
  import { Settings, ChevronRight } from '@lucide/svelte'
  import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '$lib/components/ui/dropdown-menu/index.js'

  const menuItems = [
    { label: 'Home', href: '/' },
    { label: 'Settings', href: '/settings', icon: Settings },
  ]

  let currentPath = $state('/')

  $effect(() => {
    if (typeof window === 'undefined') return
    currentPath = window.location.pathname

    const onPageLoad = () => {
      currentPath = window.location.pathname
    }
    document.addEventListener('astro:page-load', onPageLoad)
    return () => document.removeEventListener('astro:page-load', onPageLoad)
  })
</script>

<div id="titlebar" class="select-none">
  <div class="bar flex items-center gap-1 px-2 w-full">
    <DropdownMenu>
      <DropdownMenuTrigger class="menu-btn" aria-label="Menu">
        <div class="preload-ico idle"></div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" sideOffset={4} class="w-44">
        {#each menuItems as item}
          <DropdownMenuItem href={item.href} class="gap-2 cursor-pointer">
            {#if item.icon}
              <item.icon size={14} strokeWidth={1.75} />
            {/if}
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
  :global {
    #titlebar {
      grid-area: title;
    }

    #titlebar .bar {
      -webkit-app-region: drag;
      height: var(--system-titleBar-height);
    }

    #titlebar .menu-btn,
    #titlebar .icon-btn {
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

    #titlebar .menu-btn {
      width: 2rem;
      height: 1.75rem;
    }

    #titlebar .icon-btn {
      width: 1.75rem;
      height: 1.75rem;
    }

    #titlebar .menu-btn:hover,
    #titlebar .icon-btn:hover {
      background: color-mix(in srgb, currentColor 12%, transparent);
      color: inherit;
    }

    #titlebar .menu-btn:active,
    #titlebar .icon-btn:active {
      background: color-mix(in srgb, currentColor 18%, transparent);
    }

    #titlebar .menu-btn .preload-ico {
      transform: scale(0.18);
    }

    #titlebar .menu-btn .idle,
    #titlebar .menu-btn .idle::before,
    #titlebar .menu-btn .idle::after {
      animation: none !important;
    }
  }
</style>
