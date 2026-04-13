# UI Playground

A collection of interactive front end experiments demonstrating advanced browser capabilities, animation techniques, and creative UI engineering.

**Live:** [ui-playground.vercel.app](https://ui-playground.vercel.app)  
**Portfolio:** [alessandrosestili.dev](https://alessandrosestili.dev)

---

## Stack

- **[Astro](https://astro.build)** — island architecture, zero-JS by default
- **[React](https://react.dev)** — interactive components via `client:load`
- **[Tailwind CSS v4](https://tailwindcss.com)** — utility-first styling
- **[Framer Motion](https://www.framer.com/motion/)** — declarative animations
- **[Three.js](https://threejs.org) / [React Three Fiber](https://r3f.docs.pmnd.rs)** — 3D WebGL scenes
- **TypeScript** — strict mode throughout

---

## Experiments

### 01 — Magnetic Cursor
Custom cursor that magnetically attracts interactive elements on hover.

**Techniques:** Custom cursor overlay with `requestAnimationFrame` interpolation. Per-frame distance check between cursor and `[data-magnetic]` elements; `translate()` applied proportional to proximity. `mix-blend-mode: difference` on the dot cursor.

**Tech:** React, CSS custom properties, `mousemove` events, `rAF`

---

### 02 — Scroll Reveal
Elements enter with cinematic timing triggered by scroll position.

**Techniques:** `useInView` from Framer Motion with `margin: -60px` threshold. Four reveal directions (up, left, right, scale, blur). Word-by-word animation with 3D X-axis rotation using `perspective`. Stagger grid with index-based delay.

**Tech:** Framer Motion, Intersection Observer API

---

### 03 — Page Transition
Neon color mask that covers and reveals the screen during navigation.

**Techniques:** Two-phase animation — `scaleX: 0→1` (cover) then `scaleX: 1→0` (reveal) using `[0.76, 0, 0.24, 1]` cubic bezier. Page content swaps mid-transition when fully covered. `AnimatePresence` manages mount/unmount.

**Tech:** Framer Motion, React state machine

---

### 04 — Interactive Form
Contact form where every field has its own animation identity.

**Techniques:** Floating label using `position: absolute` + CSS `transform: translateY + scale`. Animated bottom border via `scaleX` transition. Validation state machine (`idle → focused → filled → error`). Shimmer loading button with `scan-move` keyframe.

**Tech:** React, CSS animations, form state management

---

### 05 — 3D Scene
WebGL geometry that responds to mouse position in three dimensions.

**Techniques:** `useRef` passed to `useFrame` hook avoids React re-renders on every `mousemove`. `MeshDistortMaterial` adds vertex shader noise. Orbiting spheres use trigonometric phase offsets. `Float` component adds ambient motion layer.

**Tech:** Three.js, React Three Fiber, `@react-three/drei`

---

### 06 — CSS Magic
Five complex visual effects built entirely in pure CSS — zero JavaScript.

**Effects:**
1. **Neon orbit rings** — four `border-*-color` rings spinning at different speeds/directions
2. **Gradient text wave** — `--i` CSS custom property drives `animation-delay` per character
3. **Conic gradient loaders** — `conic-gradient()` + inner mask circle
4. **Holographic card** — CSS-only hover tilt via `:hover` + `perspective` + rotating conic shine
5. **Glitch text** — `::before`/`::after` pseudo-elements with `clip-path` slice offsets and `skewX`

**Tech:** CSS `@keyframes`, `conic-gradient()`, `clip-path`, custom properties, `animation-delay`, pseudo-elements

---

## Project Structure

```
src/
├── components/           # React island components
│   ├── MagneticCursor.tsx
│   ├── ScrollReveal.tsx
│   ├── PageTransitionDemo.tsx
│   ├── InteractiveForm.tsx
│   └── Scene3D.tsx
├── layouts/
│   ├── Layout.astro          # Base HTML shell
│   └── ExperimentLayout.astro # Per-experiment wrapper with nav + header
├── pages/
│   ├── index.astro           # Homepage grid
│   └── experiments/
│       ├── magnetic-cursor.astro
│       ├── scroll-reveal.astro
│       ├── page-transition.astro
│       ├── interactive-form.astro
│       ├── 3d-scene.astro
│       └── css-magic.astro
└── styles/
    └── global.css            # Design tokens, utilities, animations
```

---

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:4321](http://localhost:4321)

## Build

```bash
npm run build
npm run preview
```

---

## Design System

| Token | Value | Usage |
|-------|-------|-------|
| `--bg` | `#050510` | Background |
| `--violet` | `#7C3AED` | Primary accent |
| `--cyan` | `#06B6D4` | Secondary accent |
| `--amber` | `#F59E0B` | Tertiary accent |
| Font | Space Grotesk | UI text |
| Font mono | Space Mono | Labels, code, metadata |

---

Made by [Alessandro Sestili](https://alessandrosestili.dev)
