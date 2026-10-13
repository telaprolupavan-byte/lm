# LIKITHA — THE SERIES

A cinematic, streaming-inspired portfolio for **Likitha Magham**, Data Analyst.
Every section is an episode, every project is an Original, and the whole site plays like a series.

> A personal portfolio with a fictional streaming-platform look. It is not affiliated with Netflix or any other streaming service and uses none of their logos.

## Run it locally

Requires **Node.js 18+**.

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually http://localhost:5173).

Production build:

```bash
npm run build
npm run preview
```

The static site is written to `dist/` and can be deployed as-is to Vercel, Netlify, GitHub Pages or any static host. On Vercel or Netlify, import the repo; they detect Vite, so the build command is `npm run build` and the output directory is `dist`.

## Updating the content

**All content lives in one file: [`src/data/portfolio.ts`](src/data/portfolio.ts).** It was generated from the resume, and every component reads from it.

| To change… | Edit |
| --- | --- |
| Name, intro, location, core toolkit | `profile` |
| Email, phone, LinkedIn, GitHub | `profile.email`, `profile.phone`, `profile.links` (empty values are hidden) |
| Work history | `experience` |
| A project, or a new one | `projects` (add an object; it appears in Originals, the overlay and the counts) |
| Impact highlight cards | `achievements` |
| Certifications | `certifications` (empty today; add entries and the "Certified" row appears) |
| Skills and their "where it's used" notes | `skillCategories`, `skillEvidence` |
| Seasons and episodes (My Journey) | `seasons` |
| Top 10 row | `topPicks` |
| ▶ Play Intro highlight reel | `introSlides` |
| Profile order (Recruiter / Data Team / Creative) | `viewerProfiles` |
| Opening studio card text | `profile.originalLabel` |

### Still to fill in

1. **LinkedIn:** set `profile.links.linkedin` (and `github` if wanted). The buttons appear automatically.
2. **Photo (optional):** see below. Until then, a data-art key visual (KPI ring, rising bars and trend line) stands in wherever the portrait appears.

**Resume:** `public/assets/Likitha_Magham_Resume.pdf` was exported from the Word resume. To update it, replace that file (keep the name, or change `profile.resumePdf`).

### Photo

Add `pic1.jpeg` (high-res photo) and `pic.png` (background-removed cutout with the same framing) to the project root, then run:

```bash
npm run images
```

This builds the responsive WebP portraits and the social share image in `public/assets/`. Then point the site at them in `src/data/portfolio.ts`:

```ts
portrait: {
  src: '/assets/portrait-720.webp',
  srcSet: '/assets/portrait-420.webp 420w, /assets/portrait-720.webp 720w, /assets/portrait-1100.webp 1100w',
  alt: 'Portrait of Likitha Magham',
},
```

Without photos, `npm run images` still rebuilds the share image (`og-image.jpg`) using the bar-chart art.

## What's inside

```
src/
  data/portfolio.ts        ← single source of truth (from the resume)
  App.tsx                  ← stages: opening → profile select → home; overlays
  components/
    OpeningSequence        ← black → studio card → LIKITHA → THE SERIES → portrait → ▶ PLAY
    ProfileSelector        ← "Who's watching?" (changes section order only)
    Navbar                 ← hide-on-scroll nav, profile switcher, mobile menu
    Hero                   ← billboard: parallax portrait, particles, light streaks, floating chips
    Portrait               ← the photo, or the data-art key visual until one is added
    PlayIntro              ← ▶ Play Intro: zoom into portrait → highlight reel (pause, ← →, tap zones)
    ContinueWatching       ← cards with real "watched" progress bars
    About                  ← The Pilot
    Seasons / EpisodeCard  ← My Journey as seasons and episodes
    Originals / ProjectCard← pinned horizontal sequence on desktop, swipe rail on touch
    ProjectModal           ← full-screen project overlay with a shared-element transition
    TopPicks               ← Top 10-style row
    Skills                 ← skill genres; each card shows where the skill appears
    Achievements           ← impact "award" cards (+ certification rail when there are any)
    ResumeViewer/ResumeModal ← designed resume sheet, PDF viewer, download
    FinalCTA               ← TO BE CONTINUED… + contact links
    CustomCursor, fx.tsx   ← cursor states, magnetic buttons, 3D tilt, text reveals, particles
  hooks/                   ← Lenis smooth scroll + scroll lock, media queries, watch progress
scripts/build-images.mjs   ← portrait/share-image pipeline (sharp)
```

**Stack:** React 18, TypeScript, Vite 6, Tailwind CSS 4, Framer Motion 11, Lenis.

## Accessibility and performance

- `prefers-reduced-motion` is respected: smooth scroll, the custom cursor, tilt, particles, grain, the key-visual animation and the pinned horizontal scroll turn off, and the opening jumps straight to its final frame.
- Hover effects only run on devices with a precise pointer. Touch devices get tap interactions and native swipe rails.
- The custom cursor appears only with a mouse or trackpad.
- Overlays close with Esc, and the highlight reel supports Space and the ← → keys.
- Overlays are code-split, and particles pause when they're off screen.

## Keyboard shortcuts

- **Opening:** Enter or Esc skips it.
- **Play Intro:** Space pauses, ← and → change slides, Esc closes.
- **Project and resume overlays:** Esc closes.
