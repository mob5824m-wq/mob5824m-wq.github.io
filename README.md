# mob5824m-wq.github.io

Personal website and portfolio with dedicated pages for all six showcased projects. Sentinel, Lofi, and Combat Master also have project-specific legal documents. Plain HTML, CSS, and vanilla JS—no build step, npm, or framework. Push and it is live on GitHub Pages.

**<https://mob5824m-wq.github.io/>**

```
index.html                 Home page & project showcase portfolio
sentinel/                   Sentinel landing page, Terms, and Privacy Policy
discord-lofi/               Lofi (Discord-lofi) landing page, Terms, and Privacy Policy
combat-master/               Combat Master landing page, Terms, and Privacy Policy
classroom-library/           Classroom Library project page
raspap-webone/               RaspAP + WebOne image-builder project page
terms.html                  Directory to the project-specific Terms of Service
privacy.html                Directory to the project-specific Privacy Policies
na/                         North Active curated athletic wear storefront (/NA/ alias supported)
cubeclash/                  CubeClash project page and playable voxel sandbox game
data/content.js             ← Portfolio content & project definitions
assets/css/style.css        Design tokens and portfolio styles
assets/css/project-pages.css Shared styles for project landing and legal pages
assets/js/main.js           Dynamic portfolio rendering, theme, filters, and project modals
assets/js/project-pages.js  Theme, navigation, and legal-page interactions
assets/img/                 Icons, social graph image (og.jpg), and screenshots
serve.py                    Local preview server (caching disabled)
.nojekyll                   Stops GitHub Pages running Jekyll
sitemap.xml                 Search engine indexing sitemap
```

## Pages

- **`/` (`index.html`)**: Interactive project portfolio with dark/light mode, tag filtering, modal project details, and direct links to project pages.
- **`/sentinel/`**: Sentinel, a cross-platform, self-hosted Discord bot for moderation, warnings, applications, and a staff dashboard. See its [Terms of Service](sentinel/terms.html) and [Privacy Policy](sentinel/privacy.html).
- **`/discord-lofi/`**: Lofi (Discord-lofi), a self-hosted Discord music bot with network stations, local audio, generated music, and a dashboard. See its [Terms of Service](discord-lofi/terms.html) and [Privacy Policy](discord-lofi/privacy.html).
- **`/combat-master/`**: Combat Master, a self-hosted Discord staff bot for announcements, polls, events, tickets, roles, and a browser dashboard. Its privacy page explains button-poll voter records, ticket transcripts, local storage, and retention. See its [Terms of Service](combat-master/terms.html) and [Privacy Policy](combat-master/privacy.html).
- **`/classroom-library/`**: Classroom Library, a self-hosted Grade 7–8 library with a shared catalog, student checkout, holds, barcode scanning, reading tools, and teacher controls.
- **`/raspap-webone/`**: RaspAP + WebOne image builder, a GUI/CLI Bash tool that produces a flashable 64-bit Raspberry Pi hotspot image with WebOne.
- **`/cubeclash/`**: CubeClash’s dedicated project page doubles as the playable, standalone voxel sandbox game, with Survival and Creative modes, touch controls, and local high scores.
- **`/terms.html`** and **`/privacy.html`**: Directories linking to each project's separate legal documents.
- **`/na/`**: North Active curated activewear storefront catalog and cart handoff.

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
- `window.SITE`: Brand name, availability, typewriter slogans, bio, skills, timeline, and contact links.
- `window.PROJECTS`: Project names, descriptions, tags, highlights, screenshots, and links.

## Local Preview

```bash
python3 serve.py 8000
# Visit http://localhost:8000 in your browser
```

## Licence

[MIT](LICENSE).
