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
    { value: "3",       label: "Projects" },
    { value: "Vanilla", label: "No frameworks" },
    { value: "MIT",     label: "Open source" }
  ],

  /* --- About -----------------------------------------------
     Drawn from the patterns in your three repos. Reword freely
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
    { when: "Shipped", what: "RaspAP + WebOne — one script, one flashable Pi image", done: true },
    { when: "Now",     what: "Building the classroom library system" },
    { when: "Next",    what: "Writing Punishment Manager, a Discord moderation bot" }
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
    icon: "book",        // book | bot | antenna | terminal | code | spark
    shot: "assets/img/shots/classroom-library.jpg",
    shotPos: "center 12%",   // crop past the nav bar to the welcome panel
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
     NOTE: server/role/channel IDs are deliberately NOT listed
     here — they belong in the bot's config file, not on a
     public page.
     --------------------------------------------------------- */
  {
    title: "Punishment Manager",
    blurb:
      "A moderation bot for Discord: temporarily strips a member's roles, " +
      "then restores them automatically when the timer runs out.",
    description:
      "Built with discord.py. An admin picks a member, a duration and a reason. The bot " +
      "removes their roles, " +
      "applies a Punishment role, and DMs them a private explanation in the punishment " +
      "channel. When the time is up it swaps the role for 'Punishment over' and puts the " +
      "original roles back. Every case is written to a log channel and a local database, " +
      "and all server, role and channel IDs live in a config file so other servers can " +
      "run it without touching the code.",
    tags: ["Discord", "Bot", "Python", "Moderation"],
    year: "2026",
    status: "Next",
    icon: "bot",
    highlights: [
      "Timed punishments that restore the member's original roles automatically",
      "Dry-run mode previews which roles would be removed before anything changes",
      "Protected and exempt lists so staff roles can't be stripped by accident",
      "Case history with lookup, extend, edit-reason and manual removal commands",
      "Startup validation checks every configured role, channel and permission",
      "Alerts the mod log if a role can't be restored, plus periodic database backups"
    ],
    links: [
      { label: "Source", href: "https://github.com/mob5824m-wq/Punishment-Manager" }
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
      { label: "Source", href: "https://github.com/mob5824m-wq/RaspAP-WebOne" }
    ]
  }
];
