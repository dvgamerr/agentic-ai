import globals from 'globals'
import pluginJs from '@eslint/js'

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: ['node_modules/**', 'public/**', 'src/assets/builds/**', 'dist/**', 'dist-electron/**', '**/*.svelte', '**/*.astro'],
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        Bun: false,
        $derived: false,
        $effect: false,
        $props: false,
        $state: false,
      },
    },
  },
  pluginJs.configs.recommended,
]
