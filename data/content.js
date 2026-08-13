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
  typewriter: ["tools for classrooms.", "things for Raspberry Pi.", "software that gets used."],

  // TODO: rewrite in your own voice.
  tagline:
    "I build practical software — a classroom library system my students actually use, " +
    "and a one-command image builder for Raspberry Pi hotspots.",

  /* --- Hero stats — [] hides the row ----------------------- */
  stats: [
    { value: "3",       label: "Projects" },
    { value: "Vanilla", label: "No frameworks" },
    { value: "MIT",     label: "Open source" }
  ],

  /* --- About ----------------------------------------------- */
  // TODO: this is a reasonable guess from your repos — make it yours.
  about: [
    "I build software to solve problems in front of me. Everything here started " +
    "as something I needed and couldn't buy off the shelf.",
    "I like plain HTML, CSS and JavaScript with no build step, shell scripts that are " +
    "verbose about what they're doing, and tools that a non-technical person can actually run."
  ],

  skills: [
    "JavaScript", "Node.js", "HTML", "CSS", "Bash",
    "Raspberry Pi", "Debian", "Linux", "Git"
  ],

  // "Currently" list in the About sidebar — [] hides the card.
  timeline: [
    { when: "Now",  what: "Building the Room 204 classroom library" },
    { when: "2026", what: "Raspberry Pi image builder for RaspAP + WebOne" }
  ],

  /* --- Contact --------------------------------------------- */
  ctaHeading: "Get in touch",
  ctaText: "Questions about a project, or want to use one? Happy to hear from you.",

  links: [
    { label: "GitHub", href: "https://github.com/mob5824m-wq", primary: true }
    // TODO: add an email if you want to be reachable:
    // { label: "Email", href: "mailto:you@example.com" }
  ]
};

/* ============================================================
   PROJECTS
   Only `title` is required; every other field is optional.
   ============================================================ */

window.PROJECTS = [
  {
    title: "Room 204 Classroom Library",
    blurb:
      "A full library system for a Grade 7–8 classroom — checkout, holds, barcodes " +
      "and reading logs, in vanilla JS.",
    description:
      "A complete classroom library that students run themselves. Books are checked out, " +
      "returned, renewed and placed on hold without a librarian. It's built in plain HTML, " +
      "CSS and vanilla JavaScript with no framework and no build step, backed by a small " +
      "Node server that keeps one shared library so every tablet and laptop sees the same data.",
    tags: ["Web app", "JavaScript", "Node.js", "Education"],
    year: "2026",
    status: "In progress",
    featured: true,
    emoji: "📚",
    highlights: [
      "Scannable EAN-13 barcodes drawn on canvas, with camera, keyboard and USB-scanner input",
      "Loan lengths vary by book type and shorten automatically for popular titles",
      "Fair hold queue — the front of the line claims the next returned copy",
      "Covers and descriptions pulled automatically from Open Library",
      "Admin passwords hashed, student passwords encrypted at rest, 6-hour auto sign-out",
      "Dark mode, larger text and a dyslexia-friendly font toggle"
    ],
    links: [
      { label: "Source", href: "https://github.com/mob5824m-wq/classroomlib" }
    ]
  },
  /* ---------------------------------------------------------
     NOTE: no repo link yet — add one when it's published.
     Server/role/channel IDs are deliberately NOT listed here;
     they belong in the bot's config file, not on a public page.
     --------------------------------------------------------- */
  {
    title: "Punishment Bot",                 // TODO: rename if it has a real name
    blurb:
      "A moderation bot for Discord: temporarily strips a member's roles, " +
      "then restores them automatically when the timer runs out.",
    description:
      "An admin picks a member, a duration and a reason. The bot removes their roles, " +
      "applies a Punishment role, and DMs them a private explanation in the punishment " +
      "channel. When the time is up it swaps the role for 'Punishment over' and puts the " +
      "original roles back. Every case is written to a log channel and a local database, " +
      "and all server, role and channel IDs live in a config file so other servers can " +
      "run it without touching the code.",
    tags: ["Discord", "Bot", "Moderation"],  // TODO: add the language once settled
    year: "2026",
    status: "In progress",
    emoji: "🤖",
    highlights: [
      "Timed punishments that restore the member's original roles automatically",
      "Dry-run mode previews which roles would be removed before anything changes",
      "Protected and exempt lists so staff roles can't be stripped by accident",
      "Case history with lookup, extend, edit-reason and manual removal commands",
      "Startup validation checks every configured role, channel and permission",
      "Alerts the mod log if a role can't be restored, plus periodic database backups"
    ],
    links: []                                // TODO: { label: "Source", href: "https://..." }
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
      "for getting vintage machines onto the modern web.",
    tags: ["CLI", "Bash", "Raspberry Pi", "Linux"],
    year: "2026",
    status: "In progress",
    emoji: "📡",
    highlights: [
      "Builds an arm64 image from an x86_64 host using qemu and binfmt",
      "Graphical window or pure CLI — the GUI escalates to sudo for you",
      "Checkpointed and resumable: rerun the same command after a failed build",
      "Update mode remounts an existing image and checks GitHub for newer releases",
      "Bakes in hostname, user, SSID and an optional SSH public key"
    ],
    links: [
      { label: "Source", href: "https://github.com/mob5824m-wq/RaspAP-WebOne" }
    ]
  }
];
