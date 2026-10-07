# mob5824m-wq.github.io

Personal website, projects portfolio, and Discord bot legal compliance documentation. Plain HTML, CSS and vanilla JS — no build step, no npm, no framework. Push and it's live on GitHub Pages.

**<https://mob5824m-wq.github.io/>**

```
index.html                Home page & project showcase portfolio
terms.html                Terms of Service for Sentinel and Lofi Girl Discord bots
privacy.html              Privacy Policy for Sentinel and Lofi Girl Discord bots
na/                       North Active curated athletic wear storefront (/NA/ alias supported)
cubeclash/                Pixelated voxel sandbox game (vanilla JS + Canvas)
data/content.js           ← Portfolio content & project definitions
assets/css/style.css      Design tokens, portfolio styles, and legal documentation layouts
assets/js/main.js         Dynamic portfolio rendering, dark/light theme, dialog modals
assets/img/               Icons, social graph images (og.jpg), and screenshots
serve.py                  Local preview server (caching disabled)
.nojekyll                 Stops GitHub Pages running Jekyll
sitemap.xml               Search engine indexing sitemap
```

## Pages

- **`/` (`index.html`)**: Interactive project showcase portfolio with dark/light mode toggle, tag filtering, modal details, and links.
- **`/terms.html`**: Terms of Service for the **Sentinel** and **Lofi Girl** Discord bot projects (acceptable use, permissions, music rights, and service limits).
- **`/privacy.html`**: Privacy Policy for **Sentinel** and **Lofi Girl**, including self-hosted Sentinel data, retention, and data-request guidance.
- **`/na/`**: North Active curated activewear storefront catalog and cart handoff.
- **`/cubeclash`**: CubeClash, a self-contained pixelated first-person voxel sandbox with Survival and Creative modes, touch controls, local high scores, and no build step.

## CubeClash

The game is a standalone static page in `cubeclash/` and uses no runtime or build dependencies. Survival and Creative sessions both support block mining/placement, slime mobs, pause/restart, and device-local high scores.

- **Move/strafe:** `WASD`; mobile D-pad forward/back
- **Look:** click the world to lock the mouse, then move to look left/right/up/down (`Esc` unlocks and pauses); click-drag fallback, arrow keys, or mobile swipe
- **Inventory/gear:** press `I` or tap the backpack; select blocks, craft swords and leaf/bark armor, and equip a loadout
- **Fight:** press `Space`, click the sword button or a slime, or tap mobile `FIGHT`; move closer if out of reach
- **Mine:** click/tap what you’re facing or press `F`; mobile Mine button
- **Build:** right-click or press `E`; choose a block with `1`–`9` or the hotbar
- **Creative flight:** double-tap `Space` to toggle; hold `Space` to rise and `Shift` to descend
- **Pause:** `Esc` or `P`; scores are stored in browser `localStorage`

## Editing Portfolio Content

Portfolio projects and personal bio details live in **`data/content.js`**.
- `window.SITE`: Brand name, availability status, typewriter slogans, bio paragraphs, skills, timeline, and contact links.
- `window.PROJECTS`: Projects list with titles, blurbs, tags, years, highlights, screenshots, and URLs.

## Local Preview

```bash
python3 serve.py 8000
# Visit http://localhost:8000 in your browser
```

## Licence

[MIT](LICENSE).
