# mob5824m — project portfolio

A fast, dependency-free portfolio site hosted on GitHub Pages.
No build step, no npm, no framework — just HTML, CSS and vanilla JS.

**Live:** https://mob5824m-wq.github.io

## Editing the site

Everything you'd normally want to change lives in **one file**: [`data/projects.js`](data/projects.js).

- `window.SITE` — your name, tagline, bio, skills, stats, "Currently" list and contact links.
- `window.PROJECTS` — the array of project cards.

### Adding a project

Append an object to `window.PROJECTS`:

```js
{
  title: "My Project",
  blurb: "One line that shows on the card.",
  description: "Longer text shown in the popup.",
  tags: ["Web app", "TypeScript"],   // tags automatically become filter buttons
  year: "2026",
  status: "Live",                    // "Live" | "In progress" | "Archived"
  featured: false,                   // true makes the card span two columns
  emoji: "🚀",                       // shown when no image is set
  image: "assets/img/my-project.png",// optional, overrides the emoji
  highlights: ["Bullet one", "Bullet two"],
  links: [{ label: "Live demo", href: "https://..." }]
}
```

Save, refresh — that's it. The filter bar, tag chips and modal all update themselves.

## Features

- Light / dark theme that remembers your choice and respects `prefers-color-scheme`
- Tag filtering, project detail dialogs, typewriter hero, scroll reveals, cursor spotlight on cards
- Responsive down to small phones, with a mobile nav
- Accessible: skip link, focus styles, ARIA states, full `prefers-reduced-motion` support
- Zero dependencies (the only network request is Google Fonts)

## Local preview

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploying

The site is served from the repository root, so pushing to the default branch is enough.
In **Settings → Pages**, set the source to *Deploy from a branch* → `main` → `/ (root)`.
`.nojekyll` is included so Jekyll doesn't interfere with the `assets/` folder.
