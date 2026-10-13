# Likitha Magham — Data Analyst Portfolio

Portfolio site for **Likitha Magham**, Data Analyst: experience, an interactive career dashboard, project case studies, skills, measured impact and a resume, in a dark, cinematic look.

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
| A project, or a new one | `projects` (add an object; it appears in Projects, the case-study overlay and the counts). `brief`, `pipeline` and `metrics` (or `outcomes` when there are no numbers) drive the case study |
| The Dashboard (career report) | `careerKpis`, `impactByRole`, `timeline`, `toolRows`, `toolColumns` |
| Experience tabs and highlight cards | `chapters` |
| Impact cards | `achievements` |
| Certifications | `certifications` (empty today; add entries and the "Certified" row appears) |
| Skills and their "where it's used" notes | `skillCategories`, `skillEvidence` |
| ▶ Quick Tour slides | `introSlides` |
| Section order per view (Full portfolio / Recruiter / Data team) | `views` |
| Intro query result rows | `ROWS` in `src/components/IntroSequence.tsx` |

**Share previews:** set `VITE_SITE_URL` (see `.env.example`) to the deployed address so link previews get absolute URLs.

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
  App.tsx                  ← intro → portfolio; overlays with browser history (Back closes them)
  components/
    IntroSequence          ← SQL query types out → result rows → name reveal (skippable, ~5s)
    Navbar                 ← hide-on-scroll nav, view switcher, mobile menu
    Hero                   ← name, role, key art, Quick Tour / View Resume, email
    QuickNav               ← "Explore" cards with real reading-progress bars
    About                  ← summary + key facts
    CareerReport           ← Dashboard: KPI tiles, career timeline, impact bars, tools × roles heatmap with evidence
    Experience / HighlightCard ← roles, education and projects as tabs with highlight cards
    Projects / ProjectCard ← pinned horizontal row on desktop, swipe rail on touch
    ProjectModal           ← case study: brief, pipeline, results/outcome, contribution, stack
    Skills                 ← every category visible; tap a marked skill to see where it was used
    Achievements           ← Impact: measured results
    ResumeViewer/ResumeModal ← designed resume sheet, PDF viewer, download
    FinalCTA               ← contact: email, resume download, copyable address
    QuickTour              ← six-slide summary (pause, ← →, tap zones)
    Portrait               ← photo slot; the data-art key visual until a photo is added
    Artwork                ← generated card art and the logo mark
    CustomCursor, fx.tsx   ← cursor states, magnetic buttons, tilt, text reveals, particles
  hooks/                   ← dialog focus, section jumps + scroll lock, media queries, reading progress
scripts/build-images.mjs   ← portrait + share-image pipeline (sharp; Bebas Neue bundled under scripts/fonts, OFL)
```

**Stack:** React 18, TypeScript, Vite 6, Tailwind CSS 4, Framer Motion 11.

## The Dashboard

The career report is computed from the data file, so it stays in sync with the resume:

- **KPI tiles** count up when they scroll into view; sums (14 dashboards, 65 stakeholders) are totals across roles.
- **Tools in action** counts the resume bullets that mention each tool, per role and project (`toolRows` holds the match patterns). Selecting a cell lists those bullets with the match highlighted. It's a real `<table>`, so screen readers get every value.
- Colors were checked with a colorblind-safety validator against the dark surface: work is crimson, education is blue, and the heatmap uses a single-hue crimson ramp.

## Accessibility and performance

**Scrolling is native.** No smooth-scroll library, so the page follows the wheel, trackpad and touch exactly. To keep it fast, effects follow a few rules. Please keep them when editing:

- Nothing animates `filter: blur()` or `backdrop-filter` while the page scrolls; blur is only used in overlays and the intro.
- Sections fade in once as they arrive, instead of recomputing on every scroll frame.
- Looping motion (floating chips, grain) is pure CSS `transform`/`opacity`, which the GPU handles without repainting.
- The data-art key visual carries its own fade and no CSS filter, so it's never re-rendered while scrolling.

- `prefers-reduced-motion` is respected: smooth section jumps, the custom cursor, tilt, particles, grain, the key-visual animation and the pinned horizontal scroll turn off, and the intro shows its final frame.
- Hover effects only run on devices with a precise pointer. Touch devices get tap interactions and native swipe rails.
- The custom cursor appears only with a mouse or trackpad.
- Overlays trap focus while open, close with Esc or the browser's Back, and return focus to where it was. The Quick Tour supports Space and the ← → keys.
- Overlays are code-split, and particles pause when they're off screen.

## Keyboard shortcuts

- **Intro:** Enter or Esc skips it.
- **Quick Tour:** Space pauses, ← and → change slides, Esc closes.
- **Case study and resume overlays:** Esc closes.
- **Dashboard heatmap:** arrow keys move between cells.
