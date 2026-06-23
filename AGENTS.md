# AGENTS.md

## Quick Commands

```bash
npm run dev          # Frontend dev server (port 8000)
npm run server       # Mock server (port 3000)
npm run build        # Production build
npm run build:strict # Type-check + production build
npm run lint         # ESLint check
npm run lint:fix     # ESLint auto-fix
npm run seed         # Seed mock database
```

**No typecheck script exists** — use `vue-tsc -b` directly for type checking.

## Architecture

- **Vue 3 + Vite 8 + TypeScript 5.9 + UnoCSS**
- **Element Plus** for UI, **@whhx/ui** for custom components
- **Pinia** for state, **Vue Router 4** with dynamic module routes
- **Fastify 5 + sql.js** mock server in `server/` (auto-scans `routes/modules/` and `db/modules/`)
- **No auto-import** — AutoImport/Components plugins are commented out in vite.config.ts

## Module System (Critical)

Business modules live in `src/modules/<module-name>/`. Each module is self-contained:

```
src/modules/<module>/
├── index.ts          # Module entry (exports routes, api, menu)
├── layout.vue        # Module layout
├── menu.config.ts    # Menu config
├── api/              # Module API
├── router/           # Module routes
└── views/            # Module pages
```

**Key rules:**
- Pages go in `src/modules/<module>/views/` — never in `src/views/modules/`
- Modules cannot import from each other; shared code goes in `src/composables/`, `src/utils/`, `src/components/`, or `src/types/`
- New modules: copy `src/modules/_templates/`, then add routes to `src/router/index.ts`

## Path Aliases

- `@/` → `src/`
- `~/` → `src/assets/`

## Dev Server

- Frontend: `http://localhost:8000` (Vite)
- Mock API: `http://localhost:3000` (Fastify)
- API prefix: `/wzsys` (configured in `public/config.js` as `SYS_CONFIG.API_PREFIX`)
- Proxy: `/wzsys` routes forward to `VITE_API_TARGET` (default `http://localhost:3000`)

## Code Style

- **Prettier**: tabs, no semicolons, double quotes, printWidth 120, trailing commas off
- **ESLint**: flat config in `eslint.config.ts`, ignores `server/`, `.clinerules/`, `public/`, `*.d.ts`
- Vue files: `<script setup lang="ts">`, multi-word component names required
- SFC order: `<template>` → `<script setup>` → `<style scoped>`
- SCSS: use `@use` not `@import`, max 4 nesting levels

## Testing & Build

- Build output: `dist/` with auto-generated zip in `dist-zip/`
- Build chunks: `vendor` (vue/router/pinia), `elementPlus` (element-plus)
- `build:strict` runs `vue-tsc -b` before vite build — use this before merging

## Common Gotchas

- `node >= 20` required
- `unplugin-auto-import` and `unplugin-vue-components` are **disabled** (commented out in vite.config.ts) — import everything explicitly
- ESLint ignores some JSX-heavy Vue directories: `modules/zddxgk/views/rygk/`, `modules/zddxgk/views/ryst/`
- The mock server auto-discovers route/db modules by directory name — directory name becomes the API prefix
- `public/config.js` is loaded at runtime (not built) — contains `SYS_CONFIG` with API URLs
