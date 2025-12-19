<script>
  // const versions = window.Electron.process.versions
  let count = 0
  function incrementCount() {
    //incremtent
    count++
    console.log('count:', count)
  }
</script>

<div id="titlebar" class="select-none">
  <div class="bar flex items-center absolute gap-1 -ml-2 -mt-2 w-full">
    <button class="menu bg-transparent border-0 w-10 h-full ml-2.25 cursor-pointer hover:bg-white/12" on:click={incrementCount} aria-label="Menu">
      <div class="preload-ico idle ml-1.5 mt-0.5"></div>
    </button>
    <div class="logo flex items-center gap-1 flex-1 mt-2">
      <img src="/logo.png" height="22" width="22" alt="Hades App" />
      <span class="text text-xs font-bold" style="font-family: 'Mulish'">Hades</span>
    </div>
    <div class="empty flex w-30.5"></div>
  </div>
</div>

<!-- <ul class="versions">
  <li class="electron-version">Electron v{versions.electron}</li>
  <li class="chrome-version">Chromium v{versions.chrome}</li>
  <li class="node-version">Node v{versions.node}</li>
  <li class="v8-version">V8 v{versions.v8}</li>
</ul> -->

<style>
  #titlebar {
    grid-area: title;
  }

  #titlebar .bar {
    -webkit-app-region: drag;
    height: var(--system-titleBar-height);
  }

  #titlebar .bar button .preload-ico {
    transform: scale(0.16) translateX(9px) translateY(-35px);
  }

  #titlebar .bar button .idle,
  #titlebar .bar button .idle::before,
  #titlebar .bar button .idle::after {
    animation: none !important;
  }

  #titlebar .bar button *,
  #titlebar .bar button ::after,
  #titlebar .bar button ::before {
    animation-duration: 0.4s;
  }

  #titlebar .bar button.menu {
    -webkit-app-region: no-drag !important;
  }
</style>
