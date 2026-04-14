# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev     # Node ≥22.12.0 required
npm run build
npm run preview
```

## Stack Notes

- **Tailwind 4** — Vite plugin, CSS-first config. No `tailwind.config.js`, no PostCSS. Utility classes configured via CSS `@theme` block.
- **React Three Fiber + Drei** — 3D scenes. Use `<Canvas>` from `@react-three/fiber`, helpers from `@react-three/drei`.
- **Framer Motion** — animation. Use `motion.*` components and `useAnimation` / `useScroll` hooks.
- Astro 6 with React islands (`client:load` / `client:visible`).
