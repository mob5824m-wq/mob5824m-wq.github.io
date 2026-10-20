/* ============================================================
   CONTENT — the only file you need to edit.

   Project entries below were written from the READMEs of your
   actual GitHub repos. Lines marked TODO are guesses about YOU
   (not your code) — please correct them.

   Anything left as "" or [] is not rendered, so you can trim
   freely without breaking the layout.
   ============================================================ */

window.SITE = {
  /* --- Identity ------------------------------------------- */
  brand: "mob5824",
  name: "mob5824",
  role: "",                    // TODO: e.g. "Teacher who codes" / "Student developer"

  availability: "",            // e.g. "Open to collaboration" — "" hides the pill

  // Rotating words in the hero. One entry = no animation, [] = off.
  typewriter: ["tools for classrooms.", "things for Raspberry Pi.", "bots for Discord.", "software that gets used."],

  // TODO: rewrite in your own voice.
  tagline:
    "I build practical software — a classroom library system my students actually use, " +
    "a one-command image builder for Raspberry Pi hotspots, and a moderation bot for Discord.",

  /* --- Hero stats — [] hides the row ----------------------- */
  stats: [
    { value: "6",       label: "Projects" },
    { value: "Vanilla", label: "No frameworks" },
    { value: "MIT",     label: "Open source" }
  ],

  /* --- About -----------------------------------------------
     Drawn from the patterns in your projects. Reword freely
     — this is the part visitors read to decide who you are.
     --------------------------------------------------------- */
  about: [
    "I build software for people who aren't going to read the manual. A classroom " +
    "library that seventh-graders run themselves, a Raspberry Pi image you flash and " +
    "forget, a moderation bot an admin drives with one command.",

    "That shapes how I build. Everything ships with a way in for non-technical users " +
    "— a graphical window next to the CLI, a progress bar, defaults that already work " +
    "— and a way to configure it without touching code.",

    "I also spend most of my effort on what happens when things go wrong: checksum " +
    "verification, dry-run previews, resumable builds, validation that refuses bad " +
    "input up front, and encrypted credentials. Accessibility counts too — dark mode, " +
    "larger text and a dyslexia-friendly font are built in, not bolted on."
  ],

  skills: [
    "Python", "JavaScript", "Node.js", "Bash",
    "HTML", "CSS", "SQLite",
    "Linux", "Debian", "Raspberry Pi", "Git"
  ],

  // "Currently" list in the About sidebar — [] hides the card.
  // `done: true` (or a "Shipped" label) turns the dot, the label and the
  // first half of the connector green.
  timeline: [
    { when: "Shipped", what: "Classroom library — live, self-hosted, running on real shelves", done: true },
    { when: "Shipped", what: "RaspAP + WebOne — one script, one flashable Pi image", done: true },
    { when: "Now",     what: "Polishing this site and the library's kiosk" },
    { when: "Shipped", what: "Sentinel — Discord moderation, applications, and a self-hosted dashboard", done: true },
    { when: "Shipped", what: "Combat Master — staff announcements, tickets, polls, and events for Discord", done: true }
  ],

  /* --- Contact --------------------------------------------- */
  ctaHeading: "Get in touch",
  ctaText: "Questions about a project, or want to use one? Happy to hear from you.",

  // `href` makes a normal link; `copy` makes a copy-to-clipboard button
  // (for handles like Discord that have no public profile URL).
  links: [
    { label: "Email",   href: "mailto:mob5824@duck.com", primary: true },
    { label: "GitHub",  href: "https://github.com/mob5824m-wq" },
    { label: "Discord", copy: "mob5824m" }
  ]
};

/* ============================================================
   PROJECTS
   Only `title` is required; every other field is optional.
   ============================================================ */

window.PROJECTS = [
  {
    title: "Classroom Library",
    blurb:
      "A self-hosted library system for a Grade 7–8 classroom — checkout, holds, " +
      "barcode scanning and reading logs, in vanilla JS.",
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
    icon: "book",        // book | bot | antenna | terminal | code | spark | music
    shot: "assets/img/shots/classroom-library.jpg",
    shotPos: "center 12%",   // crop past the nav bar to the welcome panel
    highlights: [
      "Scannable EAN-13 barcodes drawn on canvas, with camera, keyboard and USB-scanner input",
      "Walk-up kiosk mode that checks books out to a student without anyone signing in",
      "Loan lengths vary by book type and shorten automatically for popular titles",
      "Fair hold queue — the front of the line claims the next returned copy",
      "Covers, descriptions and star ratings, with cover art pulled from Open Library",
      "Reading logs with streaks, book clubs and teacher-assigned reading groups",
      "Server-side security: hashed admin passwords, encrypted student credentials, and " +
        "students who can't wipe the catalog or promote themselves",
      "One-command self-hosting: HTTPS via Caddy, dynamic DNS and nightly backups",
      "Installable and offline-capable, with dark mode, larger text and a dyslexia-friendly font"
    ],
    links: [
      { label: "Project page", href: "classroom-library/" },
      { label: "Source & setup", href: "https://github.com/mob5824m-wq/classroomlib" }
    ]
  },
  /* ---------------------------------------------------------
     NOTE: server/role/channel IDs are deliberately NOT listed
     here — they belong in the bot's config file, not on a
     public page.
     --------------------------------------------------------- */
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
    links: [
      { label: "Project page", href: "sentinel/" },
      { label: "Latest release", href: "https://github.com/mob5824m-wq/Sentinel/releases/latest" },
      { label: "Source", href: "https://github.com/mob5824m-wq/Sentinel" },
      { label: "Terms of Service", href: "sentinel/terms.html" },
      { label: "Privacy Policy", href: "sentinel/privacy.html" }
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
      "host in SQLite, supports per-server settings, and can run on Windows, macOS, Linux, and ARM64. " +
      "You run the instance and choose its audio sources, hosting, and retention.",
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
      "data directory. It is an operations toolkit, not a moderation-punishment or applications bot.",
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
    links: [
      { label: "Project page", href: "combat-master/" },
      { label: "Source & setup", href: "https://github.com/mob5824m-wq/Combat-Master" },
      { label: "Terms of Service", href: "combat-master/terms.html" },
      { label: "Privacy Policy", href: "combat-master/privacy.html" }
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
    shotPos: "top",          // title and mode buttons sit at the very top
    highlights: [
      "A single ~2,200-line Bash script — no dependencies beyond the build tools it installs itself",
      "Builds an arm64 image from an x86_64 host using qemu and binfmt",
      "Graphical window or pure CLI — the launchers escalate to sudo for you",
      "Verifies downloads against GitHub release SHA-256 checksums",
      "Checkpointed and resumable: rerun the same command after a failed build",
      "Update mode remounts an existing image and checks GitHub for newer releases",
      "Four SSH modes (off, password, public key, both) plus configurable Wi-Fi country"
    ],
    links: [
      { label: "Project page", href: "raspap-webone/" },
      { label: "Source & setup", href: "https://github.com/mob5824m-wq/RaspAP-WebOne" }
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
    links: [
      { label: "Project page & play", href: "/cubeclash" }
    ]
  }
];
