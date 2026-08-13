# mob5824m-wq.github.io

My projects site. Plain HTML, CSS and vanilla JS — no build step, no npm, no
framework. Push and it's live.

**<https://mob5824m-wq.github.io/>**

```
index.html                page structure (rarely needs editing)
data/content.js           ← ALL CONTENT LIVES HERE
assets/css/style.css      design tokens at the top, then components
assets/js/main.js         rendering + interactions
assets/img/               icons, og.jpg
assets/img/shots/         project screenshots
404.html                  themed not-found page
serve.py                  local preview server (not deployed)
.nojekyll                 stops GitHub Pages running Jekyll
```

## Editing content

Everything is in **`data/content.js`**. Two objects: `window.SITE` (name,
tagline, about, skills, stats, timeline, contact links) and `window.PROJECTS`
(one entry per card). Save, refresh, done — nothing to rebuild.

**Empty fields hide themselves.** Clear `about` and the About section and its
nav link disappear. No links, no Contact section. Fewer than two tags and the
filter bar doesn't render. Nothing ever looks half-built.

### Adding a project

Only `title` is required.

```js
{
  title: "My Project",
  blurb: "One line shown on the card.",
  description: "Longer text shown in the popup.",
  tags: ["Web app", "Python"],          // these become the filter buttons
  year: "2026",
  status: "Live",                       // "Live" | "In progress" | "Archived"
  featured: false,                      // true = card spans two columns
  icon: "book",                         // book|bot|antenna|terminal|code|spark
  shot: "assets/img/shots/thing.png",   // optional screenshot banner
  shotPos: "top",                       // where to anchor the 16:9 crop
  highlights: ["Bullet in the popup"],
  links: [{ label: "Source", href: "https://..." }]
}
```

A card with a `shot` shows it as a banner and hides its icon; if the file 404s
the icon comes back automatically. `shotPos` takes any CSS `object-position`
(`top`, `center 12%`, …). See `assets/img/shots/README.md` — short version is
**PNG for UI screenshots, JPEG for photos**, since JPEG fringes small text.

### Timeline states

`SITE.timeline` colour-codes itself from the label:

| Label     | Dot    | Effect                                           |
| --------- | ------ | ------------------------------------------------ |
| `Shipped` | green  | green label, connector runs green then hands off |
| `Next`    | orange | orange label                                     |
| anything  | accent | the default                                      |

Set `done: true` or `next: true` to force a state regardless of the wording.

## Restyling

The top of `assets/css/style.css` is design tokens. Change `--accent` and
`--accent-2` and the whole site follows — buttons, glow, links, dots. Dark and
light palettes are defined separately just below, along with `--ship` and
`--next` for the timeline.

## What's wired up

- Dark/light toggle — remembers the choice, respects `prefers-color-scheme`
- Tag filtering, project dialogs with ←/→ navigation and deep links (`#slug`)
- Scrollspy nav, scroll reveals, optional typewriter hero
- Accessible: skip link, focus rings and restore, ARIA states, full
  `prefers-reduced-motion` support, works without JS
- SEO: canonical URL, OpenGraph/Twitter cards, JSON-LD, sitemap, robots.txt
- Installable — `site.webmanifest` plus a full icon set
- Zero dependencies (the only network request is Google Fonts)

## Local preview

```bash
python3 serve.py 8000
# http://localhost:8000
```

`serve.py` disables caching so edits show up on a normal refresh — plain
`python3 -m http.server` serves stale CSS/JS and will waste your time.

Asset URLs in `index.html` carry a `?v=` string. **Bump it when you change
`style.css` or `main.js`**, otherwise returning visitors keep the old copy.

## Deploying

Served from the repo root, so pushing the default branch is enough.
**Settings → Pages** → *Deploy from a branch* → `main` → `/ (root)`.

## Licence

[MIT](LICENSE).
