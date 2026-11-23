/* ============================================================
   CONTENT — Portfolio data, identity, and projects.
   ============================================================ */

window.SITE = {
  /* --- Identity ------------------------------------------- */
  brand: "mob5824",
  name: "mob5824",
  role: "",

  availability: "",

  // Rotating words in the hero
  typewriter: [
    "tools for classrooms.",
    "apps for Android.",
    "extensions for the browser.",
    "games and music tools.",
    "software people can run themselves."
  ],

  tagline:
    "I build useful software across web, Android, and desktop: classroom tools, " +
    "browser extensions, self-hosted services, games, music projects, and hardware experiments.",

  /* --- Hero stats ------------------------------------------ */
  stats: [
    { value: "25", label: "Projects" },
    { value: "3",  label: "Web · mobile · desktop" },
    { value: "Public", label: "Source & docs" }
  ],

  /* --- About ----------------------------------------------- */
  about: [
    "My projects span classroom and reading tools, Android apps, browser extensions, " +
    "self-hosted services, desktop software, games, hardware, and civic utilities. " +
    "Some solve a small daily annoyance; others are experiments in bringing old " +
    "devices, music libraries, or public data back to life.",

    "The platforms vary, but the goal is similar: make the useful path easy to find. " +
    "That might mean a student-run library kiosk, an offline swim-practice builder, " +
    "a browser game with no install, or a native app with clear controls and setup steps.",

    "I try to document what each tool can and cannot do. The project pages explain " +
    "requirements, setup, data handling, and important limitations so people can decide " +
    "whether a project fits their needs before they install or self-host it."
  ],

  skills: [
    "Python", "JavaScript", "TypeScript", "Node.js", "Kotlin", "Dart", "Flutter",
    "C++", "Qt", "Bash", "HTML", "CSS", "SQLite", "Android", "Chrome extensions",
    "Linux", "Debian", "Raspberry Pi", "ESP32", "NFC", "WireGuard", "Git"
  ],

  timeline: [
    { when: "Recent", what: "OpenTag — ESP32-S3 NFC handheld, firmware, hardware files, and Android app", done: true },
    { when: "Recent", what: "SwimSet — offline practice builder and native poolside timer", done: true },
    { when: "Recent", what: "OpenPath VPN — native clients and a self-hosted networking service", done: true },
    { when: "Recent", what: "FocusFrost and Negativity Now — focus sessions, prompts, and reminders", done: true },
    { when: "Building", what: "Soniq — early-stage public app and base repositories", done: false }
  ],

  /* --- Contact --------------------------------------------- */
  ctaHeading: "Get in touch",
  ctaText: "Questions about a project, or want to use one? Happy to hear from you.",

  links: [
    { label: "Email",   href: "mailto:mob5824@duck.com", primary: true },
    { label: "GitHub",  href: "https://github.com/mob5824m-wq" },
    { label: "Discord", copy: "mob5824m" }
  ]
};

/* ============================================================
   PROJECTS
   ============================================================ */

window.PROJECTS = [
  {
    title: "Classroom Library",
    blurb:
      "A self-hosted library system for a Grade 7–8 classroom — checkout, holds, " +
      "barcode scanning, reading logs, and kiosk mode in vanilla JS.",
    description:
      "A complete classroom library that students run themselves. Books are checked out, " +
      "returned, renewed and placed on hold without a librarian, and a no-login kiosk handles " +
      "checkout at the classroom door. It's built in plain HTML, CSS and vanilla JavaScript " +
      "with no framework and no build step, backed by a small Node server that keeps one " +
      "shared library so every tablet and laptop sees the same data. It installs as an " +
      "offline-capable app, and ships with scripts to self-host it from a laptop at home " +
      "over HTTPS so it works from school.",
    tags: ["Web app", "JavaScript", "Node.js", "Education", "Self-hosted"],
    year: "2026",
    status: "Live",
    featured: true,
    icon: "book",
    shot: "assets/img/shots/classroom-library.jpg",
    shotPos: "center 12%",
    highlights: [
      "Scannable EAN-13 barcodes drawn on canvas, with camera, keyboard and USB-scanner input",
      "Walk-up kiosk mode that checks books out to a student without anyone signing in",
      "Loan lengths vary by book type and shorten automatically for popular titles",
      "Fair hold queue — the front of the line claims the next returned copy",
      "Covers, descriptions and star ratings, with cover art pulled from Open Library",
      "Reading logs with streaks, book clubs and teacher-assigned reading groups",
      "Server-side security: hashed admin passwords, encrypted student credentials, and role guards",
      "One-command self-hosting: HTTPS via Caddy, dynamic DNS, and automated backups",
      "Installable and offline-capable, with dark mode, larger text and a dyslexia-friendly font"
    ],
    install: [
      { step: "Clone the repository", command: "git clone https://github.com/mob5824m-wq/classroomlib.git && cd classroomlib" },
      { step: "Start the server", command: "node server.js", note: "Requires Node.js 16+. Zero external npm packages or database install needed." }
    ],
    usage: [
      { step: "Access the application", note: "Navigate to http://localhost:8080 (or your LAN IP http://<lan-ip>:8080 from classroom Chromebooks and tablets)." },
      { step: "Sign in as Admin", note: "Use default credentials (admin / admin123) to configure your room number, import books, set loan lengths, and manage student accounts." },
      { step: "Student Kiosk Mode", note: "Open /kiosk for walk-up student checkouts with camera barcode scanning, USB handheld scanners, or student code entry." }
    ],
    links: [
      { label: "Project page", href: "classroom-library/" },
      { label: "Source & setup", href: "https://github.com/mob5824m-wq/classroomlib" }
    ]
  },

  {
    title: "Soundtrail",
    blurb:
      "A location-based music companion Android app integrating Spotify, YouTube Music, " +
      "SoundCloud, and Jellyfin with on-device mood mixes and Android Auto.",
    description:
      "Soundtrail saves your favorite songs from Spotify, YouTube Music, SoundCloud, or your " +
      "own Jellyfin server as private, location-based pins on an interactive map. Features an " +
      "explainable on-device mood engine that scores your own library against natural language " +
      "descriptions, offline audio caching, full Android Auto in-car playback, Keystore-encrypted " +
      "OAuth tokens, and automated debounced backups.",
    tags: ["Android", "Mobile", "Music", "Maps", "Kotlin"],
    year: "2026",
    status: "Live",
    featured: true,
    icon: "mobile",
    shot: "assets/img/shots/soundtrail-art.png",
    shotPos: "center",
    highlights: [
      "Pin songs from Spotify, YouTube Music, SoundCloud, or your Jellyfin server to real-world locations",
      "On-device mood engine ranks and queues your songs based on natural language feeling descriptions",
      "Android Auto media integration browses pins, playlists, and playback from your vehicle display",
      "Token security via hardware-backed Android Keystore with PKCE OAuth 2.1 authentication",
      "Offline playback for Jellyfin tracks and local audio with on-device SQLite and managed snapshots",
      "Voice queries ('Ask' tab) find music and queue tracks without saving or uploading voice data"
    ],
    install: [
      { step: "Clone the repository", command: "git clone https://github.com/mob5824m-wq/SoundTrail.git && cd SoundTrail" },
      { step: "Compile Debug APK with Gradle", command: "./gradlew :app:assembleDebug", note: "Requires JDK 17 and Android SDK Platform 35." },
      { step: "Install on Android device or emulator", command: "adb install app/build/outputs/apk/debug/app-debug.apk", note: "Requires Android 8.0 (API 26) or higher." }
    ],
    usage: [
      { step: "Connect music services", note: "In Connect tab, enter your Spotify Client ID (PKCE), SoundCloud credentials, or your personal Jellyfin server URL." },
      { step: "Drop location pins", note: "Open the Map tab to drop pins at favorite places and attach songs from your connected libraries." },
      { step: "Generate mood mixes", note: "Go to Mood tab, enter how you feel (e.g. 'rainy evening drive'), and let the on-device AI rank and play a matching mix." },
      { step: "Android Auto & Car Play", note: "Plug into your vehicle to browse and stream your location pins and playlists hands-free." }
    ],
    links: [
      { label: "Project page", href: "soundtrail/" },
      { label: "Source", href: "https://github.com/mob5824m-wq/SoundTrail" }
    ]
  },

  {
    title: "Sentinel",
    blurb:
      "A cross-platform, self-hosted Discord bot for role-based moderation, " +
      "warnings, member applications, and an authenticated staff dashboard.",
    description:
      "Sentinel is a self-hosted Python Discord bot for server staff. Its /manage command group handles " +
      "timed role punishments and pardons, warnings and member history, plus application forms and staff " +
      "review. An authenticated dashboard manages connected servers, moderation, applications, settings, " +
      "and history. The instance stores records locally in SQLite on the host you choose; you control " +
      "its access, backups, and retention.",
    tags: ["Discord", "Bot", "Python", "Moderation", "Self-hosted"],
    year: "2026",
    status: "Live",
    icon: "bot",
    highlights: [
      "Timed role punishments, pardons, warnings, and member history",
      "Role and permission safeguards before moderation actions are applied",
      "Create application forms, collect answers, and review decisions with staff",
      "Authenticated dashboard for connected servers, moderation, applications, settings, and history",
      "Local SQLite records keep active punishment timers across restarts",
      "Installers for Windows, macOS, and Linux, including ARM64 builds"
    ],
    install: [
      { step: "Clone the repository", command: "git clone https://github.com/mob5824m-wq/Sentinel.git && cd Sentinel" },
      { step: "Install Python dependencies", command: "python3 -m pip install -r requirements.txt", note: "Requires Python 3.9+." },
      { step: "Configure Discord Bot Token", command: "export DISCORD_TOKEN=\"your-bot-token\"", note: "Or configure data/config.json directly." },
      { step: "Run Sentinel", command: "python3 bot.py", note: "Launch helpers: scripts/run_linux.sh or scripts\\run_windows.bat." }
    ],
    usage: [
      { step: "Discord Developer Portal", note: "Under Bot settings, enable Server Members and Message Content privileged gateway intents." },
      { step: "Server Setup in Discord", note: "Run /manage setup staff_role:@Staff log_channel:#staff-log timezone:America/Toronto" },
      { step: "Moderation Commands", note: "Run /manage punish user:@User role:@Muted duration:2h reason:Spam, or /manage warn." },
      { step: "Applications & Dashboard", note: "Create applicant panels with /manage applications panel. Open http://localhost:8000 for the staff web dashboard." }
    ],
    links: [
      { label: "Project page", href: "sentinel/" },
      { label: "Latest release", href: "https://github.com/mob5824m-wq/Sentinel/releases/latest" },
      { label: "Source", href: "https://github.com/mob5824m-wq/Sentinel" },
      { label: "Terms of Service", href: "sentinel/terms.html" },
      { label: "Privacy Policy", href: "sentinel/privacy.html" }
    ]
  },

  {
    title: "Pixel Photo NAS",
    blurb:
      "Turn any Google Pixel 1–5 into a 24/7 Samba photo & video NAS with automated compression " +
      "and a dedicated Household Android app.",
    description:
      "Turn older Google Pixel phones into a self-hosted Wi-Fi photo and video NAS. Serves native " +
      "Samba/SMB2/SMB3 file shares, WebDAV, FTP, and a browser UI. Automatically resizes >16MP photos " +
      "to 16MP and 4K videos to 1080p with 100% EXIF preservation, routing them to Google Photos for " +
      "free unlimited cloud backup. Includes a dedicated household Android app for family phones with " +
      "1-tap Wi-Fi discovery and home screen upload widgets.",
    tags: ["Android", "Python", "Samba", "NAS", "Backup"],
    year: "2026",
    status: "Live",
    icon: "server",
    shot: "assets/img/shots/pixelnas-logo.png",
    shotPos: "center",
    highlights: [
      "Converts Google Pixel 1–5 phones into a 24/7 Samba (SMB2/SMB3) home photo server",
      "Automated Storage Saver conversion (≤16 MP JPEGs, 1080p MP4s) with 100% EXIF and GPS retention",
      "Integrates with Google Photos on Pixel for free unlimited cloud storage backups",
      "Dedicated Household Android client app with 1-tap Wi-Fi discovery and home-screen upload widget",
      "Multi-protocol file server: Samba, WebDAV, FTP, and responsive browser Web UI on port 8080",
      "Standalone Python server mode for running on Linux or Termux"
    ],
    install: [
      { step: "Install Server APK on Pixel 1–5", note: "Install PixelPhotoNAS-v1.0.0-Pixel1to5-Signed.apk on your closet Google Pixel." },
      { step: "Install Household Client on family phones", note: "Install PixelPhotoNAS-Household-v1.0.0-SambaClient-Signed.apk on family Android phones." },
      { step: "Standalone Python / Termux server", command: "git clone https://github.com/mob5824m-wq/Photo-Convert-Android.git && cd Photo-Convert-Android && pip install -r requirements.txt && python3 -m server.main" }
    ],
    usage: [
      { step: "Start NAS daemon on Pixel", note: "Open Pixel Photo NAS, grant 'All Files Access', and start the daemon (shares \\\\<pixel-ip>\\PixelNAS on port 4445)." },
      { step: "Configure Google Photos Backup", note: "In Google Photos on the Pixel device, enable backup for the PixelNAS folder under Collections -> On this device." },
      { step: "Connect Family Phones", note: "Open the Household app, tap 'Scan Wi-Fi for Samba NAS', choose your member folder, and enable auto-sync or widget." }
    ],
    links: [
      { label: "Project page", href: "pixel-photo-nas/" },
      { label: "Latest release", href: "https://github.com/mob5824m-wq/Photo-Convert-Android/releases" },
      { label: "Source", href: "https://github.com/mob5824m-wq/Photo-Convert-Android" }
    ]
  },

  {
    title: "Lofi (Discord-lofi)",
    blurb:
      "A self-hosted Discord voice bot for continuous lofi: radio streams, your music library, " +
      "or beats generated on the machine running it.",
    description:
      "Lofi is a self-hosted Discord music bot with a token-authenticated dashboard. Choose network " +
      "stations such as YouTube broadcasts and SomaFM streams, shuffle audio from a local music folder, " +
      "or generate original Studio Lofi tracks offline. It keeps playback history and activity on the " +
      "host in SQLite, supports per-server settings, and can run on Windows, macOS, Linux, and ARM64.",
    tags: ["Discord", "Music", "Python", "Audio", "Self-hosted"],
    year: "2026",
    status: "Open source",
    icon: "music",
    highlights: [
      "Choose from YouTube broadcasts, SomaFM streams, a local music library, or locally generated Studio Lofi",
      "Continuous playback with idle disconnect, queueing, playback controls, and per-server settings",
      "Authenticated dashboard with playback controls, station management, and listening history",
      "SQLite stores playback sessions, track plays, listener counts, and activity events on the host",
      "No privileged Discord intents are required; the bot uses slash commands",
      "Native installers and portable builds for Windows, macOS, Linux, and ARM64"
    ],
    install: [
      { step: "Clone the repository", command: "git clone https://github.com/mob5824m-wq/Discord-lofi.git && cd Discord-lofi" },
      { step: "Install dependencies & verify audio", command: "pip install -r requirements.txt && python3 bot.py --check", note: "Requires FFmpeg installed on system." },
      { step: "Configure Bot Token", command: "export DISCORD_TOKEN=\"your-bot-token\"" }
    ],
    usage: [
      { step: "Launch the bot", command: "python3 bot.py", note: "Or run 'python3 bot.py --demo' to test the web dashboard without a bot token." },
      { step: "Voice channel playback", note: "Join a voice channel and use /play station:SomaFM, /play stream:<url>, or /play local to shuffle local files." },
      { step: "Web Dashboard", note: "Visit http://localhost:8080 with your dashboard auth token to control playback, manage stations, and view history." }
    ],
    links: [
      { label: "Project page", href: "discord-lofi/" },
      { label: "Latest release", href: "https://github.com/mob5824m-wq/Discord-lofi/releases/latest" },
      { label: "Source", href: "https://github.com/mob5824m-wq/Discord-lofi" },
      { label: "Terms of Service", href: "discord-lofi/terms.html" },
      { label: "Privacy Policy", href: "discord-lofi/privacy.html" }
    ]
  },

  {
    title: "Combat Master",
    blurb:
      "A self-hosted Discord staff bot for announcements, schedules, polls, events, tickets, and roles, " +
      "with a browser dashboard.",
    description:
      "Combat Master is a self-hosted discord.py staff-operations bot organized under the /manage command group. " +
      "Staff can publish and schedule announcements, create polls and events, open private support tickets, " +
      "manage reaction roles and role menus, configure welcome messages, and review an audit log. A browser " +
      "dashboard runs in the same process; configuration, SQLite records, and logs stay in the operator's " +
      "data directory.",
    tags: ["Discord", "Bot", "Python", "Staff tools", "Self-hosted"],
    year: "2026",
    status: "Open source",
    icon: "terminal",
    highlights: [
      "Post announcements now, later, or repeatedly, with templates, approval, quiet hours, and scheduled pins",
      "Run button polls and events with RSVP reactions and reminders",
      "Create private support tickets and save staff transcripts before ticket channels are deleted",
      "Manage reaction roles, dropdown role menus, and new-member welcome messages",
      "Review staff actions in an audit log and operate through the shared browser dashboard",
      "Self-hosted Python bot with SQLite, a local data directory, and Windows/Linux launch scripts"
    ],
    install: [
      { step: "Clone the repository", command: "git clone https://github.com/mob5824m-wq/Combat-Master.git && cd Combat-Master" },
      { step: "Install dependencies", command: "python3 -m pip install -r requirements.txt", note: "Requires Python 3.9+." },
      { step: "Configure Token", command: "export DISCORD_TOKEN=\"your-bot-token\"", note: "Or configure data/config.json." }
    ],
    usage: [
      { step: "Start Combat Master", command: "python3 bot.py", note: "Or run scripts/run_linux.sh or scripts\\run_windows.bat." },
      { step: "Configure Server", note: "Run /manage setup staff_role:@Staff announcement_channel:#announcements staff_channel:#staff-log" },
      { step: "Announcements & Polls", note: "Run /manage announce to post embeds now, /manage schedule delay:2h for later, or /manage poll create for button polls." },
      { step: "Support Tickets & Roles", note: "Run /manage ticket panel for private member tickets, or /manage rolemenu new for dropdown role menus." }
    ],
    links: [
      { label: "Project page", href: "combat-master/" },
      { label: "Source & setup", href: "https://github.com/mob5824m-wq/Combat-Master" },
      { label: "Terms of Service", href: "combat-master/terms.html" },
      { label: "Privacy Policy", href: "combat-master/privacy.html" }
    ]
  },

  {
    title: "Soundtrail Support Bot",
    blurb:
      "A discord.py support bot with private tickets, transcripts, announcements, " +
      "polls, and an operations dashboard for the Soundtrail community.",
    description:
      "A dedicated support and operations Discord bot built for the Soundtrail community. Members " +
      "open tickets from an interactive panel, converse privately with staff, and receive automated " +
      "closure transcripts. Staff can claim tickets, set priority, schedule announcements, manage polls, " +
      "and review audit logs via slash commands or the web dashboard.",
    tags: ["Discord", "Bot", "Python", "Support", "Self-hosted"],
    year: "2026",
    status: "Open source",
    icon: "bot",
    highlights: [
      "Interactive ticket panel with Technical, Account, and General inquiry workflows",
      "Private staff channels with message transcripts saved before channel deletion",
      "Ticket priority requests, staff assignment, FAQ canned replies, and satisfaction feedback",
      "Scheduled and repeating announcements with quiet hours and approval queues",
      "Button polls with live vote tallying and event RSVP tracking",
      "Authenticated staff dashboard for managing tickets, transcripts, and logs"
    ],
    install: [
      { step: "Clone the repository", command: "git clone https://github.com/mob5824m-wq/Soundtrail-Bot.git && cd Soundtrail-Bot" },
      { step: "Install Python dependencies", command: "python3 -m pip install -r requirements.txt", note: "Requires Python 3.9+." },
      { step: "Configure Token", command: "export DISCORD_TOKEN=\"your-bot-token\"", note: "Or configure data/config.json." },
      { step: "Launch the Bot", command: "python3 bot.py", note: "Launch helpers: scripts/run_linux.sh or scripts\\run_windows.bat." }
    ],
    usage: [
      { step: "Discord Developer Portal", note: "Under Bot settings, enable Server Members and Message Content privileged gateway intents." },
      { step: "Initial Server Setup", note: "Run /manage setup staff_role:@Support ticket_category:Support staff_channel:#support-log timezone:America/Toronto" },
      { step: "Post Support Panel", note: "Run /manage ticket panel in your public support channel for member ticket workflows." },
      { step: "Staff Operations & Web UI", note: "Use /manage ticket claim and /manage ticket close. Access transcripts at http://localhost:8000." }
    ],
    links: [
      { label: "Project page", href: "soundtrail-bot/" },
      { label: "Source & setup", href: "https://github.com/mob5824m-wq/Soundtrail-Bot" },
      { label: "Terms of Service", href: "soundtrail-bot/terms.html" },
      { label: "Privacy Policy", href: "soundtrail-bot/privacy.html" }
    ]
  },

  {
    title: "RaspAP + WebOne image builder",
    blurb:
      "One Debian script that builds a flashable 64-bit Raspberry Pi image: " +
      "a Wi-Fi hotspot with a retro-web proxy baked in.",
    description:
      "Downloads the official RaspAP Lite image, grows it, customises it via loop mount and " +
      "qemu, and writes a single .img you flash with Raspberry Pi Imager. The result is a " +
      "Raspberry Pi hotspot running RaspAP with the WebOne proxy already configured — useful " +
      "for getting vintage machines onto the modern web. Runs from a text menu or a Tk window, " +
      "and is checkpointed so an interrupted build picks up where it left off.",
    tags: ["CLI", "Bash", "Raspberry Pi", "Linux"],
    year: "2026",
    status: "Live",
    icon: "antenna",
    shot: "assets/img/shots/raspap-gui.png",
    shotPos: "top",
    highlights: [
      "A single ~2,200-line Bash script — no dependencies beyond the build tools it installs itself",
      "Builds an arm64 image from an x86_64 host using qemu and binfmt",
      "Graphical window or pure CLI — the launchers escalate to sudo for you",
      "Verifies downloads against GitHub release SHA-256 checksums",
      "Checkpointed and resumable: rerun the same command after a failed build",
      "Update mode remounts an existing image and checks GitHub for newer releases",
      "Four SSH modes (off, password, public key, both) plus configurable Wi-Fi country"
    ],
    install: [
      { step: "Clone on Debian/Ubuntu/macOS (Docker)", command: "git clone https://github.com/mob5824m-wq/RaspAP-WebOne.git && cd RaspAP-WebOne" },
      { step: "Make scripts executable", command: "chmod +x build.sh launch-gui.sh launch-cli.sh" }
    ],
    usage: [
      { step: "Build via GUI Wizard", command: "./launch-gui.sh", note: "Launches the Tkinter visual image builder and escalates with sudo." },
      { step: "Build via Terminal CLI", command: "sudo ./build.sh", note: "Runs headless build, downloads official RaspAP Lite, and injects arm64 WebOne." },
      { step: "Flash Image", note: "Use Raspberry Pi Imager to flash the generated .img file from the output/ folder to an SD card." },
      { step: "Connect Hotspot & Proxy", note: "Power on the Pi, connect to the RaspAP hotspot (10.3.141.1), and configure vintage devices to HTTP proxy port 8080." }
    ],
    links: [
      { label: "Project page", href: "raspap-webone/" },
      { label: "Source & setup", href: "https://github.com/mob5824m-wq/RaspAP-WebOne" }
    ]
  },

  {
    title: "Kobo Arc 7 Freedom",
    blurb:
      "Anti-brick root, customizable App Bar launcher, VLC, 2-way Chromebook USB internet, " +
      "Aurora Store, F-Droid, and native ARMv7 Linux toolchain for Kobo Arc 7 & 7HD.",
    description:
      "A complete revival suite for Kobo Arc 7 (MT8125) and 7HD (Tegra 3) Android tablets. " +
      "Provides an anti-brick root engine, a customizable multi-edge App Bar launcher with 5 OS skins, " +
      "two-way wired USB internet with Chromebook/Linux, pre-bundled VLC media player, Calendar with home widget, " +
      "Notes with sketchpad, 20 Archive.org alarm chimes, patched Aurora Store and F-Droid with TLS 1.3 bridge, " +
      "and native ARMv7 python3 and apt toolchains.",
    tags: ["Android", "Root", "OTA", "Toolchain", "Linux"],
    year: "2026",
    status: "Live",
    icon: "mobile",
    shot: "assets/img/shots/kobo-banner.png",
    shotPos: "center",
    highlights: [
      "Anti-brick verified root with 1-tap OTA upgrade (Upgrade-My-Kobo-To-v2.1.0.apk)",
      "Customizable App Bar launcher: pin 0–12 apps, 5 positions (Bottom, Top, Left/Right rails, Hidden), and 5 OS skins",
      "Two-way wired USB internet bridge for Chromebooks and Linux (Start-Chromebook-Wired-Internet.sh)",
      "Pre-bundled ARMv7 VLC Media Player, Arc7 Calendar with widget, Notes, Camera, and Photos studio",
      "Pre-bundled Aurora Store and patched F-Droid Classic with TLS 1.3 gateway and updated 2026 SSL certs",
      "Zero-SSL home Wi-Fi rooting servers for Windows (.bat) and macOS/Linux (.sh) to bypass expired factory certs",
      "Native ARMv7 python3, pip, and apt Linux toolchain in /system/xbin/"
    ],
    install: [
      {
        step: "Method 1: Local Wi-Fi Rooting Server (Recommended for unrooted tablets)",
        command: "Windows: Start-Kobo-WiFi-Server.bat\nmacOS/Linux: ./Start-Kobo-WiFi-Server.sh",
        note: "Factory tablets have expired 2013 SSL certs. This runs a local zero-SSL server so the tablet browser downloads Upgrade-My-Kobo-To-v2.1.0.apk from http://<pc-ip>:8000 without SSL handshake errors."
      },
      {
        step: "Method 2: USB / ADB Sideload",
        command: "adb install Upgrade-My-Kobo-To-v2.1.0.apk",
        note: "Enable USB Debugging in Developer Options on the tablet and sideload directly over USB."
      },
      {
        step: "Method 3: Direct Download / MicroSD Transfer",
        command: "https://github.com/mob5824m-wq/Kobo-Arc-7-freedom/releases/latest",
        note: "Download Upgrade-My-Kobo-To-v2.1.0.apk from GitHub Releases and transfer to the tablet via MicroSD card or USB storage."
      }
    ],
    usage: [
      {
        step: "1-Tap Root & Full Upgrade",
        note: "Launch Upgrade-My-Kobo-To-v2.1.0.apk on the tablet and tap '1-Tap Root & Upgrade'. It applies anti-brick root, cleans bloatware, installs 120 modern 2026 SSL certs, TLS 1.3, Aurora Store, and F-Droid."
      },
      {
        step: "Customizable App Bar & OS Skins",
        note: "Long-press any icon on the Home App Bar or tap 'App Bar' to configure 0–12 slots, dock position (Bottom, Top, Left/Right side rail, or Hidden), and choose from 5 OS skins."
      },
      {
        step: "Chromebook / Linux USB Internet Bridge",
        command: "./Start-Chromebook-Wired-Internet.sh",
        note: "Plug Kobo into a Chromebook or Linux machine to share high-speed wired internet over USB without Wi-Fi."
      },
      {
        step: "Native ARMv7 Linux Toolchain",
        command: "python3 --version && apt --help",
        note: "Open terminal on the tablet to run native ARMv7 python3, pip, curl, and apt package management."
      }
    ],
    links: [
      { label: "Project page", href: "kobo-arc-7-freedom/" },
      { label: "Latest release (v2.1.0)", href: "https://github.com/mob5824m-wq/Kobo-Arc-7-freedom/releases/latest" },
      { label: "Source", href: "https://github.com/mob5824m-wq/Kobo-Arc-7-freedom" }
    ]
  },

  {
    title: "Classroom Book Recommendations",
    blurb:
      "A personalized book recommendation system for classrooms with unique student code logins, " +
      "questionnaires, and Open Library integration.",
    description:
      "A personalized book recommendation system tailored for elementary and middle school classrooms. " +
      "Teachers curate shelf inventory, star Teacher Picks, and generate anonymous student codes. " +
      "Students answer an engaging reading preferences questionnaire and receive personalized recommendations " +
      "drawn from both classroom shelves and live Open Library titles.",
    tags: ["Web app", "JavaScript", "Node.js", "Education", "Recommender"],
    year: "2026",
    status: "Live",
    icon: "book",
    highlights: [
      "Unique student code logins (e.g. READ-7X2K) with zero name-based tracking",
      "Reading preference questionnaire (genres, reading level, mood, themes, book length)",
      "Dual recommendation lists: class shelf inventory and live suggestions from Open Library",
      "Teacher dashboard for catalog management, student codes, and recommendation insights",
      "Zero dependencies: vanilla HTML, CSS, JavaScript with lightweight Node.js server",
      "Automatic LAN IP detection for immediate sharing with classroom tablets and Chromebooks"
    ],
    install: [
      { step: "Clone the repository", command: "git clone https://github.com/mob5824m-wq/Classroom-book-recs.git && cd Classroom-book-recs" },
      { step: "Start Node server", command: "node server.js", note: "Requires Node.js 16+. Zero external npm packages or database install." }
    ],
    usage: [
      { step: "Open application", note: "Navigate to http://localhost:8080 (or the LAN IP printed in terminal for classroom student devices)." },
      { step: "Teacher Setup", note: "Sign in as Admin (admin / admin123) to add books, set Teacher Picks, and generate student codes." },
      { step: "Student Questionnaire", note: "Students sign in with their code, complete the preference quiz, and explore personalized book matches." }
    ],
    links: [
      { label: "Project page", href: "classroom-book-recs/" },
      { label: "Source & setup", href: "https://github.com/mob5824m-wq/Classroom-book-recs" }
    ]
  },

  {
    title: "Ledger KW",
    blurb:
      "Search public property and building records in Kitchener and Waterloo by owner name or " +
      "address directly from the browser.",
    description:
      "A dependency-free civic web application that queries public open-data GIS services in Kitchener " +
      "and Waterloo. Search corporate, institutional, or government property portfolios, look up civic " +
      "addresses to review building permit histories, and explore a self-contained SVG map that operates " +
      "without external API keys.",
    tags: ["Web app", "JavaScript", "GIS", "Open Data", "Property"],
    year: "2026",
    status: "Live",
    icon: "search",
    highlights: [
      "Search corporate and institutional property portfolios across Kitchener and Waterloo",
      "Civic address lookup with building permit histories, construction values, and ward data",
      "Direct client-side queries to municipal ArcGIS FeatureServer endpoints with zero backend or API keys",
      "Self-contained keyless SVG map with pan, zoom, scale bar, and drafting grid fallback",
      "Export property records directly to CSV or print-optimized reports",
      "Privacy-respecting: complies with MFIPPA open data regulations"
    ],
    install: [
      { step: "Clone the repository", command: "git clone https://github.com/mob5824m-wq/City-Search.git && cd City-Search" },
      { step: "Start static web server", command: "python3 server.py", note: "Or run 'python3 -m http.server 8000' or 'npm start'. Zero build step required." }
    ],
    usage: [
      { step: "Open in browser", note: "Visit http://localhost:8000 to launch Ledger KW." },
      { step: "Search Owner Portfolios", note: "Type a business, university, or municipal name to view all linked properties, units, and interactive map locations." },
      { step: "Search Address Permits", note: "Enter an address to view construction permits, application status, and municipal details." },
      { step: "Export & Print", note: "Click Export CSV to save portfolio data or use browser print for clean property dossiers." }
    ],
    links: [
      { label: "Project page", href: "city-search/" },
      { label: "Source", href: "https://github.com/mob5824m-wq/City-Search" }
    ]
  },

  {
    title: "MyInstants Clone",
    blurb:
      "A responsive soundboard web app with 60+ buttons, real MP3 audio streaming, " +
      "Web Audio synth fallback, and custom sound uploads.",
    description:
      "A pixel-perfect clone of myinstants.com built in pure HTML, CSS, and JavaScript. Features " +
      "60+ responsive 3D sound buttons playing real audio clips streamed directly from CDN with an " +
      "automatic Web Audio synthesizer fallback, categorized sound search, local favorites, and " +
      "custom MP3/WAV uploads.",
    tags: ["Web app", "JavaScript", "Audio", "Soundboard"],
    year: "2026",
    status: "Live",
    icon: "audio",
    highlights: [
      "60+ responsive 3D sound buttons with click animations, ripples, and glow effects",
      "Real MP3 audio streaming with graceful fallback to synthesized Web Audio oscillators",
      "Category filters (Memes, Gaming, Movies, Music, Anime, Reactions) and instant search",
      "Persistent favorites stored in browser localStorage with shareable deep links",
      "Custom sound uploader: drag and drop audio files to create local instant sound buttons",
      "Completely client-side: runs instantly from any static web server"
    ],
    install: [
      { step: "Clone the repository", command: "git clone https://github.com/mob5824m-wq/Myinstantsclone.git && cd Myinstantsclone" },
      { step: "Start web server", command: "python3 -m http.server 8000", note: "Zero dependencies, zero build tools needed." }
    ],
    usage: [
      { step: "Open soundboard", note: "Navigate to http://localhost:8000 in your web browser." },
      { step: "Play instant sounds", note: "Click or tap any button to trigger sound playback. Toggle overlapping playback or master volume." },
      { step: "Search & favorite", note: "Use the search bar or category chips to find sounds, and click the heart icon to save favorites." },
      { step: "Upload sounds", note: "Use the upload panel to load your own MP3 or WAV clips as playable instant buttons." }
    ],
    links: [
      { label: "Project page", href: "myinstants-clone/" },
      { label: "Source", href: "https://github.com/mob5824m-wq/Myinstantsclone" }
    ]
  },

  {
    title: "CubeClash",
    blurb:
      "A pixelated first-person voxel sandbox: mine blocks, build a world, and take on " +
      "the slime rush in Survival or Creative mode.",
    description:
      "A self-contained browser game built with vanilla JavaScript and Canvas. Explore a procedurally " +
      "generated voxel island, chop trees, crack ore, place nine kinds of blocks, and fight animated " +
      "slimes. Craft swords, equip protective leaf-and-bark armor, and manage your loadout from the " +
      "inventory. Survival adds hearts, hostile mobs and a score chase; Creative gives you unlimited " +
      "blocks, a safe space to build, and Creative flight toggled by double-tapping Space. Keyboard, " +
      "mouse and touch controls, pause/restart states, pixel effects and a local high-score table " +
      "are all built in — no account, install or framework needed.",
    tags: ["Game", "JavaScript", "Canvas", "Pixel art", "Sandbox"],
    year: "2026",
    status: "Live",
    icon: "spark",
    highlights: [
      "Two modes: fight back in Survival or build freely in Creative",
      "Double-tap Space to fly in Creative; hold Space to rise and Shift to descend",
      "Mine and place nine block types, then craft weapons and equip protective armor",
      "Open a full inventory/loadout screen; mouse look works up, down, and all around",
      "Animated slimes, health, score multipliers, particles and screen shake",
      "Keyboard and mouse controls, plus a responsive mobile touch pad",
      "Pause, instant restart and a persistent local high-score table"
    ],
    install: [
      { step: "Run locally from repository", command: "python3 serve.py 8000", note: "Or run 'python3 -m http.server 8000' inside the mob5824m-wq.github.io directory." },
      { step: "Play online instantly", note: "Visit https://mob5824m-wq.github.io/cubeclash directly in any modern desktop or mobile browser." }
    ],
    usage: [
      { step: "Movement & Camera", note: "Use WASD or arrow keys to move. Click canvas to lock pointer and look with mouse. Touch joystick on mobile." },
      { step: "Mining & Combat", note: "Left-click (or tap screen) to mine blocks or strike attacking slimes." },
      { step: "Building & Blocks", note: "Press E (or tap build button) to place the currently selected block from your hotbar (keys 1–9)." },
      { step: "Inventory & Creative Flight", note: "Press I to open the crafting and armor menu. In Creative mode, double-tap Space to toggle flight." }
    ],
    links: [
      { label: "Project page & play", href: "/cubeclash" }
    ]
  }
];

/* Recent projects. Kept together here so the portfolio and project pages share
   the same descriptions, setup notes, and source links. */
window.PROJECTS = [
  {
    slug: "opentag",
    page: "opentag/",
    title: "OpenTag",
    blurb: "An open-source ESP32-S3 NFC handheld with firmware, a native Android companion app, and a screenless Mini variant.",
    description: "OpenTag is an independent NFC handheld project: ESP32-S3 firmware, carrier-board and enclosure files, a browser interface, and a small Android companion app. It can inspect tags, manage user-supplied backups, emulate NDEF notes, and work with NFC dumps that the owner supplies. It is not affiliated with Nintendo or any tag manufacturer, and it does not bundle or distribute amiibo tag data.",
    tags: ["Hardware", "ESP32-S3", "NFC", "Android", "Firmware"],
    year: "2026",
    status: "Live",
    icon: "server",
    highlights: [
      "NFC inspection: identify supported tag types and read NDEF text or URLs without writing",
      "BLE companion app: transfer the user's own backups and browse the device library from Android",
      "NDEF notes: write a text or URL to a physical tag and verify the result by reading it back",
      "OpenTag Mini: a screenless, pocket-size variant operated through the web interface or Android app",
      "Hardware files: firmware, PCB, enclosure CAD, wiring guide, and parts list live in the repository",
      "Safety: no tag dumps are bundled; use only data and tags you own or are authorized to use"
    ],
    install: [
      { step: "Review the hardware and firmware setup", note: "Use the repository's setup guide for the ESP32-S3 board, wiring, and PlatformIO firmware build. The exact steps depend on the hardware variant." },
      { step: "Install the Android companion app", note: "Download the latest app APK from the OpenTag Releases page and sideload it on an Android 6.0+ device." },
      { step: "Update firmware", command: "python tools/update_opentag.py", note: "Install esptool first; the updater flashes only the app partition and preserves device settings and library data." }
    ],
    usage: [
      { step: "Pair over Bluetooth", note: "Open the companion app or web sync page and pair with your OpenTag. The handheld displays a confirmation code for first-time pairing." },
      { step: "Use your own backups", note: "Transfer tag backups that you own to the device, then browse or emulate those user-supplied files." },
      { step: "Inspect safely", note: "Use the tag inspector to identify a tag and read its NDEF payload; inspection does not write to the tag." }
    ],
    links: [
      { label: "Project page", href: "opentag/" },
      { label: "Latest Android release", href: "https://github.com/mob5824m-wq/OpenTag/releases/latest" },
      { label: "Source & hardware files", href: "https://github.com/mob5824m-wq/OpenTag" }
    ]
  },
  {
    slug: "swimset",
    page: "swimset/",
    title: "SwimSet",
    blurb: "Build swim practices, calculate send-offs, print deck sheets, and run a poolside timer with offline native apps.",
    description: "SwimSet is a native swim-practice maker for Android, Chromebooks, and Debian Linux. Build a practice set by set, calculate pace-based send-offs, print a deck sheet, and run a rep-by-rep poolside timer. The Flutter/Dart apps work offline and do not require accounts or network access.",
    tags: ["Android", "Desktop", "Swimming", "Flutter", "Offline"],
    year: "2026",
    status: "Live",
    icon: "mobile",
    featured: true,
    highlights: [
      "Practice builder: create twelve kinds of swim sets with pace, rest, equipment, notes, and course lengths",
      "Automatic send-offs: calculate target swim time plus rest, with per-heat paces and start offsets",
      "Poolside runner: large touch controls, rep timer, countdown beeps, and a screen-on Android service",
      "Deck sheets: print or export practices with clear set and heat send-offs",
      "Offline library: save, search, duplicate, import, and export practices locally on the device",
      "Native installs: universal Android APK and Debian package, built and tested by CI"
    ],
    install: [
      { step: "Install the Android or Chromebook app", note: "Download swimset-2.2.0-universal.apk from the latest release and open it on Android 6.0+; use adb install if preferred." },
      { step: "Install the Debian package", command: "sudo apt install ./swimset_2.2.0_amd64.deb", note: "Download the .deb from the latest release. The package is also suitable for supported Chromebook Linux environments." },
      { step: "Build from source", command: "make apk", note: "Requires Flutter 3.24+ and the Android SDK; see the repository for Linux desktop build prerequisites." }
    ],
    usage: [
      { step: "Create a practice", note: "Set a base pace, add sets, choose course and stroke, and let SwimSet calculate each send-off." },
      { step: "Print a deck sheet", note: "Export or print a practice for the pool deck, including the set structure and per-heat timing." },
      { step: "Run the poolside timer", note: "Start the runner for rep-by-rep timing; on Android its ongoing notification can keep the clock active with the screen off." }
    ],
    links: [
      { label: "Project page", href: "swimset/" },
      { label: "Latest release", href: "https://github.com/mob5824m-wq/SwimSet/releases/latest" },
      { label: "Source & setup", href: "https://github.com/mob5824m-wq/SwimSet" }
    ]
  },
  {
    slug: "patchpilot",
    page: "patchpilot/",
    title: "PatchPilot",
    blurb: "An Android companion for finding, checking, and filing the exact APK version supported by your Morphe patch bundles.",
    description: "PatchPilot reads the Morphe patch bundles already loaded on your device, finds compatible app versions, and downloads a matching APK from supported sources. Before saving, it checks the package, version, file type, and signing certificate. It is an Android app, not a web service; it needs no root and no account.",
    tags: ["Android", "Morphe", "Verification", "Mobile", "Tools"],
    year: "2026",
    status: "Live",
    icon: "mobile",
    highlights: [
      "Bundle-aware catalog: only suggests apps supported by patch bundles you have loaded",
      "Version matching: recommends a stable compatible version and handles numeric version ordering",
      "APK verification: checks package, version, file type, and signing certificate before keeping a download",
      "Download queue: fetch several apps in sequence while showing progress and per-job status",
      "Local filing: saves verified APKs to Downloads/PatchPilot for selection in Morphe Manager",
      "No root or account: all catalog and verification work happens on the Android device"
    ],
    install: [
      { step: "Download PatchPilot", note: "Get patchpilot-android-<version>.apk from the latest release and install it on Android 8.0+ (API 26+)." },
      { step: "Open the app", note: "PatchPilot does not need root, an account, or broad storage permission. Android may ask you to allow installs from your chosen file manager once." }
    ],
    usage: [
      { step: "Load your Morphe bundles", note: "PatchPilot reads the bundles available to your local Morphe setup; the catalog starts empty if no supported bundles are present." },
      { step: "Choose a compatible app version", note: "Review the supported versions and select the suggested stable target." },
      { step: "Verify and use the APK", note: "Download the build, let PatchPilot verify it, then select the saved APK from Morphe Manager's APK picker." }
    ],
    links: [
      { label: "Project page", href: "patchpilot/" },
      { label: "Latest release", href: "https://github.com/mob5824m-wq/PatchPilot/releases/latest" },
      { label: "Source & documentation", href: "https://github.com/mob5824m-wq/PatchPilot" }
    ]
  },
  {
    slug: "openpath-vpn",
    page: "openpath-vpn/",
    title: "OpenPath VPN",
    blurb: "Native desktop and Android clients for operator-configured WireGuard tunnels, plus a separate self-hosted web-session tool.",
    description: "OpenPath is a multi-platform WireGuard client and self-hosted networking project with native desktop apps for Linux, Windows, and macOS, an Android app, a server, and a web preview. Device-wide VPN connections use a WireGuard profile supplied by the operator. Its separate WebSocket session can fetch individual GET or HEAD URLs; it does not route other apps or browser tabs. Review the repository's security notes before deploying a server: the demo PSK and unauthenticated provisioning endpoints are not production-safe.",
    tags: ["Desktop", "Android", "VPN", "WireGuard", "Self-hosted"],
    year: "2026",
    status: "Live",
    icon: "server",
    highlights: [
      "Native clients: Qt desktop apps for Linux, Windows, and macOS, plus a native Android app",
      "Device VPN: operate a WireGuard tunnel using a profile supplied by the server operator",
      "Optional Stealth transport: encapsulate WireGuard in a WebSocket-over-TLS connection to a separately configured relay",
      "Separate web session: request individual HTTP URLs through the server without routing other apps or browser tabs",
      "Local settings: profile and server configuration use platform-specific credential storage where supported",
      "Security limits are documented: no general kill switch, and the demo provisioning endpoints must not be exposed as-is"
    ],
    install: [
      { step: "Check what the release includes", note: "At review, the latest v1.2 release contains server and web bundles plus an example profile, but no desktop installer or Android APK. Follow the repository's platform-specific source/build instructions for the client; any future release may add installers." },
      { step: "Run the desktop app from source (Linux/macOS)", command: "python3 -m venv .venv && . .venv/bin/activate && python -m pip install -r client/native/requirements.txt && python client/native/entry.py", note: "Requires Python 3.10–3.13; Windows has separate PowerShell instructions in the repository README." },
      { step: "Configure a WireGuard server", note: "An operator must provision a WireGuard server and a dedicated peer profile; OpenPath does not provide a VPN server automatically." }
    ],
    usage: [
      { step: "Import an operator-provided profile", note: "Use the Home page to import a supported WireGuard configuration and approve the operating system's VPN/admin prompt." },
      { step: "Choose the connection mode", note: "Connect directly over UDP, or configure the optional Stealth relay and its WSS credentials first." },
      { step: "Read the safety notes", note: "The device VPN and WebSocket URL-fetch session are separate features. Verify routes and peer connectivity yourself; the project does not promise a kill switch or bypass guarantees." }
    ],
    links: [
      { label: "Project page", href: "openpath-vpn/" },
      { label: "Latest server/web release", href: "https://github.com/mob5824m-wq/OpenPath-VPN/releases/latest" },
      { label: "Source & security notes", href: "https://github.com/mob5824m-wq/OpenPath-VPN" }
    ]
  },
  {
    slug: "focusfrost",
    page: "focusfrost/",
    title: "FocusFrost",
    blurb: "A Chrome extension that adds an intentional pause, a focused visit budget, and a real cooldown before distracting sites reopen.",
    description: "FocusFrost is a Manifest V3 browser extension that makes opening a distracting site a deliberate choice. It can present breathing, reflection, or intention prompts before a visit, limit how long that visit stays open, and enforce a cooldown after you leave. Settings include a grace window, focus hours, pause limits, and an optional mid-visit scrolling intervention.",
    tags: ["Browser extension", "Chrome", "Productivity", "JavaScript", "Focus"],
    year: "2026",
    status: "Live",
    icon: "spark",
    featured: true,
    highlights: [
      "Intervention gate: choose a breath, reflection, intention, or phrase prompt before tracked sites open",
      "Focused visit cap: count time only while the tab is visible and focused, then close the visit when its budget ends",
      "Hard cooldowns: lockouts survive tab closures and navigation rather than resetting with a browser session",
      "Grace window: leave and return quickly without a penalty for accidental clicks or typos",
      "Rationed pauses: a deliberate hold or breathing exercise uses a limited daily pause allowance",
      "Optional doomscroll brake: bring the intervention back after a configurable amount of focused scrolling"
    ],
    install: [
      { step: "Download or clone FocusFrost", command: "git clone https://github.com/mob5824m-wq/FocusFrost.git && cd FocusFrost" },
      { step: "Load the extension", note: "Open chrome://extensions, enable Developer mode, choose Load unpacked, and select the extension/ folder. Supported browsers need Manifest V3; Chrome 110+ is documented." },
      { step: "Configure your first site", note: "Use the settings page to add domains and choose the intervention, visit cap, and cooldown that suit you." }
    ],
    usage: [
      { step: "Pick an intervention", note: "Choose a brief breathing prompt, reflection, typed phrase, or intention statement before a tracked site opens." },
      { step: "Set time limits", note: "Configure each site's grace period, focused visit cap, cooldown, focus hours, and optional pause allowance." },
      { step: "Review your habits", note: "Use the local dashboard and intention history to see how you are spending time; settings stay in the browser." }
    ],
    links: [
      { label: "Project page", href: "focusfrost/" },
      { label: "Latest release", href: "https://github.com/mob5824m-wq/FocusFrost/releases/latest" },
      { label: "Source & setup", href: "https://github.com/mob5824m-wq/FocusFrost" }
    ]
  },
  {
    slug: "negativity-now",
    page: "negativity-now/",
    title: "Negativity Now",
    blurb: "A native Android reminder app for scheduling direct, no-excuses prompts during chosen days and time windows.",
    description: "Negativity Now is a lightweight Android app for setting a reminder window, choosing the days it runs, and receiving a rotating prompt every 15–180 minutes. It supports snooze actions, custom comments, an at-a-glance home-screen widget, and rescheduling after reboot or clock/time-zone changes. English, Spanish, and French resources are included.",
    tags: ["Android", "Kotlin", "Productivity", "Notifications", "Offline"],
    year: "2026",
    status: "Live",
    icon: "mobile",
    highlights: [
      "Flexible schedule: choose days and a daily window, including overnight and all-day schedules",
      "Adjustable interval: receive a rotating prompt every 15 to 180 minutes while the schedule is active",
      "Snooze controls: defer a reminder for 10 minutes, 30 minutes, or one hour",
      "Custom prompts: enable, edit, add, or remove comments and shuffle without immediate repeats",
      "Home-screen widget: see the current prompt and next reminder or snooze time",
      "Reliable scheduling: restore active reminders after reboot, time changes, and time-zone changes"
    ],
    install: [
      { step: "Install the latest APK", note: "Download the installable APK from the latest GitHub release and sideload it on Android 4.0 or newer. Android 13+ asks for notification permission." },
      { step: "Build with Android Studio", note: "Alternatively open the repository in Android Studio, allow Gradle sync, then install the app configuration on a device or emulator." }
    ],
    usage: [
      { step: "Choose a schedule", note: "Set the start and end times, choose weekdays, and select a reminder interval. Matching start and end times means all day." },
      { step: "Edit the prompts", note: "Enable or disable preset comments, add your own, and send a test notification from the app." },
      { step: "Arm reminders", note: "Tap ARM REMINDERS to start the schedule. Snooze from a notification or use the widget to check what comes next." }
    ],
    links: [
      { label: "Project page", href: "negativity-now/" },
      { label: "Latest release", href: "https://github.com/mob5824m-wq/Negativity-Now/releases/latest" },
      { label: "Source & quality checks", href: "https://github.com/mob5824m-wq/Negativity-Now" }
    ]
  },
  {
    slug: "arena-ai-helper",
    page: "arena-ai-helper/",
    title: "Arena.ai Helper",
    blurb: "A Chrome extension for queuing prompts, auto-scrolling, and handling long Arena Agent Mode conversations with safety stops.",
    description: "Arena.ai Helper is a Manifest V3 browser extension that adds queueable prompts and convenience controls to Arena Agent Mode. It can send queued prompts, continue long responses, auto-scroll to the latest output, and pause automation when it detects a captcha or rate-limit challenge. Settings and activity history stay local to the extension.",
    tags: ["Browser extension", "Chrome", "JavaScript", "Productivity", "AI tools"],
    year: "2026",
    status: "Live",
    icon: "bot",
    highlights: [
      "Prompt queue: send a sequence of prompts one at a time and edit or reorder pending work",
      "Captcha pause: stop auto-send and auto-continue when a verification challenge or rate limit appears",
      "Auto-scroll and auto-continue: follow responses and optionally continue long generations with a configurable cap",
      "Quick prompts: insert reusable commands and templates with date, time, selected-text, or clipboard values",
      "Keyboard shortcuts: control auto-send, auto-scroll, clear, and stop-after-this-response",
      "Local controls: review recent activity and export or import settings and prompt templates"
    ],
    install: [
      { step: "Download or clone the repository", command: "git clone https://github.com/mob5824m-wq/Arena.ai-Helper.git && cd Arena.ai-Helper" },
      { step: "Load the unpacked extension", note: "Open chrome://extensions in Chrome or a Chromium browser, enable Developer mode, choose Load unpacked, and select this repository folder." },
      { step: "Pin and configure", note: "Pin the extension, open Arena in a supported browser tab, and review the automation and challenge-pause settings before enabling them." }
    ],
    usage: [
      { step: "Queue prompts", note: "Separate prompts with the configured delimiter (--- by default) and submit once; the extension sends the next item after each response finishes." },
      { step: "Set guardrails", note: "Choose a queue limit, send delay, and auto-continue cap. Use the stop-after-this-response shortcut when you want the chain to end." },
      { step: "Solve challenges yourself", note: "When a captcha or rate-limit challenge appears, automation pauses; complete the challenge in Arena before resuming." }
    ],
    links: [
      { label: "Project page", href: "arena-ai-helper/" },
      { label: "Latest release", href: "https://github.com/mob5824m-wq/Arena.ai-Helper/releases/latest" },
      { label: "Source & setup", href: "https://github.com/mob5824m-wq/Arena.ai-Helper" }
    ]
  },
  {
    slug: "dropzone",
    page: "dropzone/",
    title: "Dropzone",
    blurb: "A single-file, browser-based battle royale: fight bots, loot supplies, build cover, and stay ahead of the storm.",
    description: "Dropzone is a local battle-royale game built with HTML5 Canvas and vanilla JavaScript. Fight bots, gather weapons and materials, build walls and ramps for cover, and keep inside the shrinking safe zone. It has no build step or runtime dependencies and runs locally in a modern browser.",
    tags: ["Game", "JavaScript", "Canvas", "Browser", "Sandbox"],
    year: "2026",
    status: "Open source",
    icon: "spark",
    highlights: [
      "Four bots: opponents search for targets and can fight one another as well as the player",
      "Storm circle: move with the safe zone or take damage as it closes in",
      "Build mode: place walls, floors, and ramps using wood, brick, or metal materials",
      "Loot crates: collect ammo, materials, shields, and health from the map",
      "Weapon choice: switch between rifle, shotgun, and pickaxe",
      "No setup stack: one HTML file, no framework, no build step, and no external dependency"
    ],
    install: [
      { step: "Clone the repository", command: "git clone https://github.com/mob5824m-wq/Dropzone.git && cd Dropzone" },
      { step: "Open or serve the game", command: "python3 -m http.server 8080", note: "Open http://localhost:8080 in a modern browser. The README also documents opening index.html directly." }
    ],
    usage: [
      { step: "Move and aim", note: "Use W, A, S, D to move, Shift to sprint, and the mouse to aim. Click to shoot or swing." },
      { step: "Choose tools", note: "Keys 1–3 select rifle, shotgun, and pickaxe. Walk over loot crates to pick up supplies." },
      { step: "Build and survive", note: "Press 4 to enter build mode, choose a piece, and press F to place it. Stay inside the storm circle and eliminate the bots." }
    ],
    links: [
      { label: "Project page", href: "dropzone/" },
      { label: "Source & controls", href: "https://github.com/mob5824m-wq/Dropzone" }
    ]
  },
  {
    slug: "soundtrail-server",
    page: "soundtrail-server/",
    title: "SoundTrail ServerSide",
    blurb: "A self-hosted sync and audio API for Soundtrail, with encrypted data sync, managed backups, and an optional audio endpoint.",
    description: "SoundTrail ServerSide is a separate Python service for the Soundtrail Android app. It provides account sessions, end-to-end-encrypted sync storage, database backups, and an optional YouTube audio-extraction endpoint. Sync payloads such as pins and coordinates are encrypted on the device, but the service still handles account and request metadata. The audio endpoint is not end-to-end encrypted; deploy behind HTTPS and use it only for audio you own or have permission to download.",
    tags: ["Python", "Self-hosted", "Backend", "API", "Music"],
    year: "2026",
    status: "Open source",
    icon: "server",
    highlights: [
      "Soundtrail sync API: stores encrypted event logs and checkpoints from the Android client",
      "Client-side encryption: the server cannot decrypt location pins, coordinates, or playlist details in sync payloads",
      "Managed backups: create, verify, list, and restore integrity-checked SQLite snapshots",
      "Optional audio endpoint: serves temporary audio-only extraction for supported Soundtrail requests",
      "No Docker requirement: Python service runs on Linux, macOS, Windows, and BSD",
      "Operational safeguards: rate limits, upload caps, and detailed reverse-proxy guidance are documented"
    ],
    install: [
      { step: "Clone and prepare the service", command: "git clone https://github.com/mob5824m-wq/SoundTrail-ServerSide.git && cd SoundTrail-ServerSide" },
      { step: "Run the setup helper", command: "python3 run.py", note: "Requires Python 3.10+. The first run creates a private virtual environment and installs pinned dependencies." },
      { step: "Deploy behind TLS", note: "Put a reverse proxy with TLS in front of the service. Keep its API bound to loopback; do not expose port 8080 directly." }
    ],
    usage: [
      { step: "Connect the Soundtrail client", note: "Configure the Android app to use your server URL for optional account sync." },
      { step: "Protect server data", note: "Secure the host, database, backups, logs, reverse proxy, and temporary storage. The server sees account email addresses and request metadata even though sync content is encrypted." },
      { step: "Use audio extraction responsibly", note: "The optional endpoint processes a video ID and temporary audio on the server; only request audio you own or are authorized to use." }
    ],
    links: [
      { label: "Project page", href: "soundtrail-server/" },
      { label: "Source & deployment guide", href: "https://github.com/mob5824m-wq/SoundTrail-ServerSide" },
      { label: "Soundtrail Android app", href: "https://github.com/mob5824m-wq/SoundTrail" }
    ]
  },
  {
    slug: "youtube-music-to-jellyfin",
    page: "youtube-music-to-jellyfin/",
    title: "ytm2j — YouTube Music to Jellyfin",
    blurb: "A local web app and CLI that organizes YouTube Music playlists into Jellyfin-ready folders with cover art and metadata.",
    description: "ytm2j connects to your YouTube Music library, discovers playlists, and downloads selected audio into one folder per playlist. It provides both a browser interface and a command-line tool, with resume/deduplication support and metadata tagging. Playlist discovery can use the YouTube Data API with Google OAuth; private downloads may need browser cookies. Only download content you own or are explicitly authorized to use.",
    tags: ["Python", "CLI", "Music", "Jellyfin", "Self-hosted"],
    year: "2026",
    status: "Open source",
    icon: "music",
    highlights: [
      "Playlist discovery: browse playlists and library items using YouTube Data API OAuth or supported fallback methods",
      "Jellyfin-ready files: organize tracks into playlist folders and embed cover art and metadata",
      "Web UI and CLI: use a local browser interface or run scripted downloads from the command line",
      "Resume and deduplicate: skip files already in the download archive and re-queue interrupted jobs",
      "Cross-platform: launchers and packaging support Windows, macOS, Linux, and headless servers",
      "Privacy-aware setup: OAuth is used for account discovery; private downloads may require a local cookie source"
    ],
    install: [
      { step: "Clone and launch on Linux/macOS", command: "git clone https://github.com/mob5824m-wq/YoutubeMusic-To-Jellyfin.git && cd YoutubeMusic-To-Jellyfin && ./scripts/run.sh", note: "The launcher creates an environment and installs the project requirements. Windows uses scripts\\run.bat." },
      { step: "Open the local interface", note: "Visit http://localhost:8765 after the service starts. A CLI-only install is also available through the package instructions in the repository." },
      { step: "Review account access options", note: "Google OAuth is recommended for discovery; private playlist downloads may require browser cookies. Keep credentials and cookies private." }
    ],
    usage: [
      { step: "Connect your account", note: "Set up the documented OAuth client or choose a supported cookie source for private playlists." },
      { step: "Select playlists", note: "Discover your library, select playlists to download, and watch progress in the web UI or CLI." },
      { step: "Keep downloads authorized", note: "Only download audio you own or have explicit permission to download, and follow applicable platform terms and local law." }
    ],
    links: [
      { label: "Project page", href: "youtube-music-to-jellyfin/" },
      { label: "Source & setup", href: "https://github.com/mob5824m-wq/YoutubeMusic-To-Jellyfin" }
    ]
  },
  {
    slug: "soniq",
    page: "soniq/",
    title: "Soniq (in progress)",
    blurb: "An early-stage project with separate public Soniq-App and Soniq-Base repositories; product details are not published yet.",
    description: "Soniq is at the public repository setup stage. The Soniq-App and Soniq-Base repositories currently contain starter documentation only, so feature, platform, and installation details will be added when they are published.",
    tags: ["In progress", "Project scaffold"],
    year: "2026",
    status: "In progress",
    icon: "spark",
    highlights: [],
    install: [
      { step: "Project status", note: "The public Soniq-App and Soniq-Base repositories are starter repositories without feature or setup documentation yet." }
    ],
    usage: [
      { step: "Follow development", note: "Check the two repositories for new source code, platform details, and setup instructions as the project takes shape." }
    ],
    links: [
      { label: "Project page", href: "soniq/" },
      { label: "Soniq-App repository", href: "https://github.com/mob5824m-wq/Soniq-App" },
      { label: "Soniq-Base repository", href: "https://github.com/mob5824m-wq/Soniq-Base" }
    ]
  }
].concat(window.PROJECTS);
