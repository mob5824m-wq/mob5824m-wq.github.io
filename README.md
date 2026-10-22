# mob5824m-wq.github.io

Personal website and portfolio showcasing all open-source projects by mob5824. Every project features comprehensive step-by-step installation guides and usage instructions, with dedicated landing pages and legal documents where applicable. Plain HTML, CSS, and vanilla JS—no build step, npm, or framework. Push and it is live on GitHub Pages.

**<https://mob5824m-wq.github.io/>**

```
index.html                 Home page & project showcase portfolio
classroom-library/         Classroom Library project page
soundtrail/                Soundtrail location-based music companion project page
pixel-photo-nas/           Pixel Photo NAS & Household Samba client project page
sentinel/                  Sentinel landing page, Terms, and Privacy Policy
discord-lofi/              Lofi (Discord-lofi) landing page, Terms, and Privacy Policy
combat-master/             Combat Master landing page, Terms, and Privacy Policy
soundtrail-bot/            Soundtrail Support Bot landing page, Terms, and Privacy Policy
raspap-webone/             RaspAP + WebOne image-builder project page
kobo-arc-7-freedom/        Kobo Arc 7 Freedom root, OTA & Linux suite project page
classroom-book-recs/       Classroom Book Recommendations project page
city-search/               Ledger KW Kitchener & Waterloo property search page
myinstants-clone/          MyInstants Clone real MP3 soundboard project page
cubeclash/                 CubeClash playable voxel sandbox game
terms.html                 Directory to the project-specific Terms of Service
privacy.html               Directory to the project-specific Privacy Policies
data/content.js            ← Portfolio content & project definitions
assets/css/style.css       Design tokens and portfolio styles
assets/css/project-pages.css Shared styles for project landing and legal pages
assets/js/main.js          Dynamic portfolio rendering, theme, filters, and project modals
assets/js/project-pages.js Theme, navigation, and legal-page interactions
assets/img/                Icons, social graph image (og.jpg), and screenshots
serve.py                   Local preview server (caching disabled)
.nojekyll                  Stops GitHub Pages running Jekyll
sitemap.xml                Search engine indexing sitemap
```

## Showcased Projects

- **`/` (`index.html`)**: Interactive project portfolio with dark/light mode, tag filtering, modal dialogs displaying full Installation and Usage instructions with copyable code snippets.
- **`/classroom-library/`**: Classroom Library, a self-hosted Grade 7–8 library with a shared catalog, student checkout, holds, barcode scanning, reading logs, and teacher controls.
- **`/soundtrail/`**: Soundtrail, a location-based music companion Android app integrating Spotify, YouTube Music, SoundCloud, and Jellyfin with on-device mood mixes and Android Auto.
- **`/pixel-photo-nas/`**: Pixel Photo NAS, turning older Google Pixel 1–5 phones into a 24/7 home Samba NAS with automated photo/video compression for Google Photos unlimited backup and a dedicated Household client app.
- **`/sentinel/`**: Sentinel, a cross-platform, self-hosted Discord bot for role-based moderation, warnings, applications, and a staff dashboard.
- **`/discord-lofi/`**: Lofi (Discord-lofi), a self-hosted Discord music bot with network radio streams, local audio playback, offline Studio Lofi beats, and a web dashboard.
- **`/combat-master/`**: Combat Master, a self-hosted Discord staff bot for scheduled announcements, button polls, events, tickets, roles, and a browser operations dashboard.
- **`/soundtrail-bot/`**: Soundtrail Support Bot, a community help desk bot featuring private support tickets, message transcripts saved before deletion, FAQ replies, and an audit trail.
- **`/raspap-webone/`**: RaspAP + WebOne image builder, a GUI/CLI Bash tool producing a flashable 64-bit Raspberry Pi hotspot image with retro-web proxy baked in.
- **`/kobo-arc-7-freedom/`**: Kobo Arc 7 Freedom, an anti-brick root engine, OTA web installer, Aurora Store, F-Droid with TLS 1.3 bridge, 60fps animations, and native ARMv7 Linux toolchain.
- **`/classroom-book-recs/`**: Classroom Book Recommendations, a personalized recommendation system using unique student codes, reading preference quizzes, and Open Library integration.
- **`/city-search/`**: Ledger KW, an open-data GIS tool querying Kitchener & Waterloo corporate property portfolios, building permit histories, and keyless vector maps.
- **`/myinstants-clone/`**: MyInstants Clone, a responsive soundboard web app featuring 60+ buttons with real MP3 audio streaming, Web Audio synth fallback, and custom uploads.
- **`/cubeclash/`**: CubeClash, a first-person voxel sandbox game built with vanilla JS and Canvas, featuring Survival and Creative modes, slime combat, crafting, and local high scores.
- **`/terms.html`** and **`/privacy.html`**: Directories linking to project-specific legal documents.

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
