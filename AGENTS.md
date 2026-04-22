# AGENTS.md — Project Memory

> **Purpose**: This file is durable memory for AI agents working on this repo.
> Record only **conventions, gotchas, and decisions** that must be respected on
> every future task. **Do not** record per-task work logs, change summaries, or
> generated artifacts here.

---

## Stack

- **Astro 6** + **Svelte 5 (runes mode)** + **Tailwind v4** (`@import 'tailwindcss'`, no `tailwind.config.js`)
- **Electron 41** wrapped via `astro-electron` (entry `src/electron/main.js`, preload `src/electron/preload.js`)
- **Bun** is the package manager / runner. Scripts use `bun x --bun astro ...`.
- **YAML** is the on-disk settings format (custom wrapper in `src/electron/lib/settings.js`, **not** the `electron-settings` npm package).
- **@google/genai** (`gemini-3.1-flash-tts-preview`) for TTS.

## Commands

- Dev: `bun run dev` (Astro + Electron via `astro-electron`)
- Build dist: `bun run build:dist`
- Build app: `bun run build:win` / `build:mac` / `build:linux`
- Lint/format runs through `lint-staged` + `husky` on commit. Do **not** add `--no-verify`.

## Filesystem layout

- App config dir: `~/.hades/` (set in `src/electron/lib/config.js`).
- Settings file: `~/.hades/settings.yaml` (managed by `lib/settings.js`).
- Theme/config file: `~/.hades/config.yaml`.
- TTS cache dir: `~/.hades/tts-cache/` (one `.wav` per text+voice+model hash).
- Renderer source: `src/pages/`, `src/components/`, `src/layouts/`.
- Main/preload source: `src/electron/` (`main.js`, `preload.js`, `events/`, `lib/`).

## Electron IPC pattern

- Main registers handlers from `src/electron/events/index.js` — every exported key becomes an `ipcMain.handle` channel.
  Add new channels by exporting `'CHANNEL-NAME': handler(event, ...args)` from that file.
- Channel naming: `UPPER-KEBAB` (e.g. `INIT-THEME`, `RUN-STARTUP-TTS`).
- Preload exposes a single `window.api` object via `contextBridge.exposeInMainWorld`. Do not expose `ipcRenderer` directly.
- `contextIsolation: true`, `sandbox: true`, `nodeIntegration: false`. Renderer can only use what preload exposes.

## Settings module (`src/electron/lib/settings.js`)

- API: `settings.get(keyPath?)`, `settings.set(keyPath, value)` or `settings.set(obj)`, `settings.has`, `settings.unset`, `settings.file()`.
- `keyPath` is dot-notation, supports `arr[0]` syntax. Persists as YAML.
- Already configured with `dir = ~/.hades`, `fileName = settings.yaml` in `lib/config.js`.

## Svelte conventions

- **Svelte 5 runes**: use `$state`, `$derived`, `$effect`, `$props`. Avoid the legacy `export let`, reactive `$:` blocks, and stores unless necessary.
- Interactive Svelte components inside `.astro` need a `client:*` directive (prefer `client:load` for chrome like nav/modals).
- Icons come from **`@lucide/svelte`** — never hand-roll SVGs that already exist there.

## Styling

- Tailwind v4 with `@theme` block in `src/styles/global.css`. Add design tokens there, not in component files.
- Layout uses CSS grid areas `title` / `panel`. Title bar height is `--system-titleBar-height`.
- Frameless window: drag region requires `-webkit-app-region: drag`; interactive elements need `-webkit-app-region: no-drag`.

## TTS

- Prefer the cache: hash key = `sha256(text + '|' + voice + '|' + model)`.
- On request: read cached `.wav` if present, else call Gemini, persist to `~/.hades/tts-cache/<hash>.wav`, then return.
- Resolve credentials/model/voice in this order: explicit options → `settings.yaml` → `process.env` → built-in default.
- "Clear cache" must only delete files inside `~/.hades/tts-cache/` — never the parent `.hades` dir.

## Don't

- Don't add `tailwind.config.js` (v4 is config-less here).
- Don't introduce `npm`/`pnpm` lockfiles — Bun only.
- Don't create markdown changelogs/summary files for tasks unless explicitly asked.
- Don't bypass `husky`/`lint-staged`.
- Don't expose raw `ipcRenderer` to the renderer.
