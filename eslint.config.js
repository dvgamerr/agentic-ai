import globals from 'globals'
import pluginJs from '@eslint/js'

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: ['node_modules/**', 'public/**', 'src/assets/builds/**', 'dist/**', '**/*.svelte', '**/*.astro'],
  },
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node, Bun: false },
    },
  },
  pluginJs.configs.recommended,
]
