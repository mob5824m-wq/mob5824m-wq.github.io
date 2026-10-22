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
    "bots for Discord.",
    "things for Raspberry Pi.",
    "software that gets used."
  ],

  tagline:
    "I build practical software — classroom tools my students actually use, " +
    "location-based Android apps, self-hosted Discord bots, Raspberry Pi images, and open-source civic utilities.",

  /* --- Hero stats ------------------------------------------ */
  stats: [
    { value: "13",      label: "Projects" },
    { value: "Vanilla", label: "No frameworks" },
    { value: "MIT",     label: "Open source" }
  ],

  /* --- About ----------------------------------------------- */
  about: [
    "I build software for people who aren't going to read the manual. A classroom " +
    "library that seventh-graders run themselves, a Raspberry Pi image you flash and " +
    "forget, a moderation bot an admin drives with one command, and Android apps that " +
    "respect battery, storage, and privacy.",

    "That shapes how I build. Everything ships with a way in for non-technical users " +
    "— a graphical window next to the CLI, a progress bar, defaults that already work " +
    "— and a way to configure it without touching code.",

    "I also spend most of my effort on what happens when things go wrong: checksum " +
    "verification, dry-run previews, resumable builds, validation that refuses bad " +
    "input up front, and encrypted credentials. Accessibility counts too — dark mode, " +
    "larger text, and clean interfaces are built in, not bolted on."
  ],

  skills: [
    "Python", "JavaScript", "Node.js", "Kotlin", "Android",
    "Bash", "HTML", "CSS", "SQLite",
    "Linux", "Debian", "Raspberry Pi", "Git"
  ],

  timeline: [
    { when: "Shipped", what: "Soundtrail — location-based music pins, mood mixes, and Android Auto", done: true },
    { when: "Shipped", what: "Classroom library — live, self-hosted, running on real shelves", done: true },
    { when: "Shipped", what: "Pixel Photo NAS — closet Pixel photo/video server with Samba household app", done: true },
    { when: "Shipped", what: "Kobo Arc 7 Freedom — anti-brick root and OTA suite for Arc 7 & 7HD", done: true },
    { when: "Shipped", what: "Sentinel — Discord moderation, applications, and self-hosted dashboard", done: true },
    { when: "Shipped", what: "Combat Master — staff announcements, tickets, polls, and events for Discord", done: true },
    { when: "Shipped", what: "RaspAP + WebOne — one script, one flashable Pi image", done: true },
    { when: "Shipped", what: "Classroom Book Recs — personalized recommendation engine for students", done: true },
    { when: "Now",     what: "Polishing project documentation and installation guides", done: false }
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
      { step: "Standalone Python / Termux server", command: "git clone https://github.com/mob5824m-wq/Photo-Convert-Aindroid.git && cd Photo-Convert-Aindroid && pip install -r requirements.txt && python3 -m server.main" }
    ],
    usage: [
      { step: "Start NAS daemon on Pixel", note: "Open Pixel Photo NAS, grant 'All Files Access', and start the daemon (shares \\\\<pixel-ip>\\PixelNAS on port 4445)." },
      { step: "Configure Google Photos Backup", note: "In Google Photos on the Pixel device, enable backup for the PixelNAS folder under Collections -> On this device." },
      { step: "Connect Family Phones", note: "Open the Household app, tap 'Scan Wi-Fi for Samba NAS', choose your member folder, and enable auto-sync or widget." }
    ],
    links: [
      { label: "Project page", href: "pixel-photo-nas/" },
      { label: "Latest release", href: "https://github.com/mob5824m-wq/Photo-Convert-Aindroid/releases" },
      { label: "Source", href: "https://github.com/mob5824m-wq/Photo-Convert-Aindroid" }
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
