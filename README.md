# mob5824 — projects portfolio

Personal portfolio and project directory for **<https://mob5824m-wq.github.io/>**. It brings together 25 first-party projects across web, Android, desktop, browser extensions, games, hardware, and self-hosted services. Cards open detailed setup/usage notes, and projects have their own landing pages where available. The static site uses plain HTML, CSS, and JavaScript—no build step, package manager, or framework required.

The inventory is based on the public repositories in `mob5824m-wq`. Related Soniq-App and Soniq-Base repositories are grouped as one early-stage project; upstream forks are not presented as original projects.

## Site map

```
index.html                         Main portfolio, filters, project detail dialogs
classroom-library/                 Classroom Library landing page
soundtrail/                        Soundtrail Android app landing page
soundtrail-server/                 SoundTrail ServerSide landing page
pixel-photo-nas/                   Pixel Photo NAS landing page
sentinel/                          Sentinel landing page, Terms, and Privacy
discord-lofi/                      Lofi Discord music bot landing page, Terms, Privacy
combat-master/                     Combat Master landing page, Terms, and Privacy
soundtrail-bot/                    Soundtrail Support Bot landing page, Terms, Privacy
raspap-webone/                     RaspAP + WebOne image-builder landing page
kobo-arc-7-freedom/                Kobo Arc 7 Freedom landing page
classroom-book-recs/               Classroom Book Recommendations landing page
city-search/                       Ledger KW civic search landing page
myinstants-clone/                  MyInstants Clone landing page
cubeclash/                         Playable CubeClash voxel game
opentag/                           OpenTag NFC handheld landing page
swimset/                           SwimSet native swim-practice app landing page
patchpilot/                        PatchPilot Android app landing page
openpath-vpn/                      OpenPath VPN landing page
focusfrost/                        FocusFrost browser extension landing page
negativity-now/                    Negativity Now Android app landing page
arena-ai-helper/                   Arena.ai Helper browser extension landing page
dropzone/                          Dropzone local battle-royale landing page
youtube-music-to-jellyfin/         ytm2j local web app and CLI landing page
soniq/                             Soniq early-stage project status page
NA/ and na/                        North Active storefront and lowercase product routes
NA/products/ and na/<product>/     Generated product pages and case-compatibility aliases
terms.html                         Directory to project-specific Terms of Service
privacy.html                       Directory to project-specific Privacy Policies
data/content.js                    Portfolio identity and shared project content
assets/css/style.css               Portfolio design tokens and card styles
assets/css/project-pages.css       Shared landing-page styles
assets/css/project-details.css     Shared styles for recent project landing pages
assets/js/main.js                  Portfolio rendering, filters, theme, and dialogs
assets/js/project-pages.js         Theme, navigation, and legal-page interactions
assets/js/project-detail.js        Shared renderer for project detail pages
scripts/build_na_catalog.py        North Active catalog and product-page generator
serve.py                           Local preview server with caching disabled
sitemap.xml                        Search engine URL list
```

## Projects

- **Classroom Library** (`/classroom-library/`) — self-hosted classroom library with student checkout, holds, barcode scanning, reading logs, and teacher controls.
- **Soundtrail** (`/soundtrail/`) — Android music companion with location pins, on-device mood mixes, and Android Auto.
- **SoundTrail ServerSide** (`/soundtrail-server/`) — optional self-hosted sync and audio API for Soundtrail, with encrypted sync payloads and managed backups.
- **Sentinel** (`/sentinel/`) — self-hosted Discord moderation, applications, and staff dashboard.
- **Pixel Photo NAS** (`/pixel-photo-nas/`) — Google Pixel photo/video NAS with Samba and a household Android client.
- **Lofi (Discord-lofi)** (`/discord-lofi/`) — Discord music bot for radio streams, local audio, and generated lofi.
- **Combat Master** (`/combat-master/`) — Discord staff operations bot for announcements, schedules, polls, events, tickets, and roles.
- **Soundtrail Support Bot** (`/soundtrail-bot/`) — Discord help desk with tickets, transcripts, polls, and staff tooling.
- **RaspAP + WebOne** (`/raspap-webone/`) — GUI/CLI builder for a flashable Raspberry Pi hotspot image with a retro-web proxy.
- **Kobo Arc 7 Freedom** (`/kobo-arc-7-freedom/`) — root, OTA, App Bar, app store, USB networking, and ARMv7 tools for Kobo Arc 7 tablets.
- **Classroom Book Recommendations** (`/classroom-book-recs/`) — student-code reading recommendations with teacher tools and Open Library integration.
- **Ledger KW** (`/city-search/`) — Kitchener and Waterloo public property and building-permit search using open data.
- **MyInstants Clone** (`/myinstants-clone/`) — browser soundboard with streaming clips, favorites, and custom uploads.
- **CubeClash** (`/cubeclash/`) — playable first-person voxel sandbox with Survival and Creative modes.
- **North Active** (`/na/`) — activewear storefront experiment with a hosted catalog and an external checkout handoff to the retailer.
- **OpenTag** (`/opentag/`) — ESP32-S3 NFC handheld with firmware, hardware files, and an Android companion app. Tag data is user-supplied; see its safety notes.
- **SwimSet** (`/swimset/`) — offline swim-practice builder and poolside timer for Android, Chromebooks, and Debian Linux.
- **PatchPilot** (`/patchpilot/`) — Android tool for finding and verifying APK versions supported by a user's Morphe patch bundles.
- **OpenPath VPN** (`/openpath-vpn/`) — native WireGuard clients and self-hosted services. Read its security notes before deployment; demo endpoints are not production-safe.
- **FocusFrost** (`/focusfrost/`) — Chromium extension for site interventions, focus caps, and cooldowns.
- **Negativity Now** (`/negativity-now/`) — Android reminder scheduler with configurable windows, snoozes, prompts, and a home-screen widget.
- **Arena.ai Helper** (`/arena-ai-helper/`) — Chromium extension for queueing prompts and pausing automation on verification challenges.
- **Dropzone** (`/dropzone/`) — single-file Canvas battle royale with bots, loot, building, and a shrinking storm.
- **ytm2j — YouTube Music to Jellyfin** (`/youtube-music-to-jellyfin/`) — local web app and CLI for organizing playlists into Jellyfin-ready folders.
- **Soniq** (`/soniq/`) — early-stage project represented by the public Soniq-App and Soniq-Base starter repositories; feature details are not published yet.

The portfolio's project descriptions and setup links live in **`data/content.js`**. The home-page project count is derived from the project list, and the recent project detail pages read their content from the same data source.

## CubeClash controls

CubeClash is a standalone static page in `cubeclash/`; it has no runtime or build dependencies. Survival and Creative sessions support mining, building, slimes, pause/restart, and device-local high scores.

- **Move:** `WASD`; mobile D-pad
- **Look:** click the world to lock the mouse, then move it to look around; `Esc` unlocks and pauses
- **Inventory and gear:** press `I`; choose blocks, craft equipment, and equip a loadout
- **Fight:** `Space`, the sword button, or tap a slime
- **Mine:** click/tap the block you face or press `F`
- **Build:** right-click or press `E`; choose blocks with `1`–`9`
- **Creative flight:** double-tap `Space` to toggle; hold `Space` to rise and `Shift` to descend
- **Pause:** `Esc` or `P`; scores stay in browser `localStorage`

## Local preview

```bash
python3 serve.py 8000
# Open http://localhost:8000/
```

## License

The portfolio site is released under the [MIT License](LICENSE). Individual projects may use their own license; check the source repository before reuse.
