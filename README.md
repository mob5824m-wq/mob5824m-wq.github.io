# Project portfolio — scaffold

The backbone for a projects site on GitHub Pages. Structure, styling and
interactions are done; the content is yours to fill in.

No build step, no npm, no framework — plain HTML, CSS and vanilla JS.

```
index.html              page structure (rarely needs editing)
data/content.js         ← YOU EDIT THIS
assets/css/style.css    design tokens at the top, then components
assets/js/main.js       rendering + interactions
assets/img/             favicon.svg, og.jpg (replace with your own)
.nojekyll               stops GitHub Pages running Jekyll
```

## Filling it in

Everything lives in **`data/content.js`**, which ships as a commented template.

- `window.SITE` — name, role, tagline, about paragraphs, skills, stats, links
- `window.PROJECTS` — one object per project card

**Empty fields hide themselves.** Leave `about` empty and the About section
disappears, along with its nav link. No links, no Contact section. Fewer than
two tags and the filter bar doesn't render. So you can fill this in gradually
and the page never looks broken or half-built.

### Adding a project

Only `title` is required; everything else is optional.

```js
window.PROJECTS = [
  {
    title: "My Project",
    blurb: "One line shown on the card.",
    description: "Longer text shown in the popup.",
    tags: ["Web app", "TypeScript"],   // these become the filter buttons
    year: "2026",
    status: "Live",                    // "Live" | "In progress" | "Archived"
    featured: false,                   // true = card spans two columns
    emoji: "🚀",                       // fallback when no image is set
    image: "assets/img/shot.png",      // optional thumbnail
    highlights: ["Bullet in the popup"],
    links: [{ label: "Source", href: "https://..." }]
  }
];
```

Save and refresh. Filter buttons, tag chips and the detail dialog all wire
themselves up. While the array is empty a dashed placeholder card marks the spot.

## Restyling

The top of `assets/css/style.css` is design tokens. Change `--accent` and
`--accent-2` and the whole site follows — buttons, glow, links, timeline dots.
Dark and light palettes are defined separately just below.

## What's already wired

- Dark/light theme toggle — remembers the choice, respects `prefers-color-scheme`
- Tag filtering, project detail dialogs, optional typewriter hero, scroll reveals
- Responsive layout with a mobile nav
- Accessible: skip link, focus rings, ARIA states, full `prefers-reduced-motion` support
- Zero dependencies (only network request is Google Fonts)

## Local preview

```bash
python3 serve.py 8000
# http://localhost:8000
```

`serve.py` disables caching so edits show up on a normal refresh.
Plain `python3 -m http.server` will serve stale CSS/JS while you work.

## Deploying

Served from the repo root, so pushing the default branch is enough.
**Settings → Pages** → *Deploy from a branch* → `main` → `/ (root)`.

## Before you publish

- [ ] Fill in `SITE.name`, `role`, `tagline` in `data/content.js`
- [ ] Add your real links (email, GitHub, …)
- [ ] Add at least one project
- [ ] Replace `assets/img/og.jpg` (1200×630 social preview)
- [ ] Update the `<title>` and `<meta name="description">` in `index.html`
