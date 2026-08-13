/* ============================================================
   EDIT THIS FILE — it is the only file you need to touch to
   change the content of the site. No build step, no npm.
   ============================================================ */

window.SITE = {
  brand: "mob5824m",
  name: "mob5824m",
  availability: "Open to new projects",

  // Words that type themselves out in the hero headline.
  typewriter: ["useful things.", "small sharp tools.", "web apps.", "side projects."],

  tagline:
    "A collection of things I've designed, built and shipped — side projects, " +
    "experiments, and tools that solve problems I actually had.",

  // Little numbers under the hero. Keep to 3 or 4.
  stats: [
    { value: "12+", label: "Projects shipped" },
    { value: "5",   label: "Years building" },
    { value: "∞",   label: "Cups of coffee" }
  ],

  bio1:
    "I'm a builder who likes small, sharp tools and interfaces that get out of the way. " +
    "Most of what's here started as a weekend itch and grew into something I use every day.",
  bio2:
    "I care about performance, clean typography and code that the next person can read. " +
    "When I'm not shipping, I'm usually reading changelogs or breaking something on purpose.",

  skills: [
    "JavaScript", "TypeScript", "Python", "React", "Node.js",
    "CSS / Tailwind", "PostgreSQL", "Docker", "Git", "Figma"
  ],

  // "Currently" list in the About sidebar.
  timeline: [
    { when: "Now",  what: "Building side projects and open-source tools" },
    { when: "2025", what: "Learning systems programming and Rust" },
    { when: "2024", what: "Shipped my first product to real users" }
  ],

  ctaText: "Have an idea, a role, or just want to say hello? My inbox is open.",

  // Buttons in the contact card + footer. Remove any you don't use.
  links: [
    { label: "Email",    href: "mailto:you@example.com",            primary: true },
    { label: "GitHub",   href: "https://github.com/mob5824m-wq" },
    { label: "LinkedIn", href: "https://linkedin.com/in/your-handle" },
    { label: "X",        href: "https://x.com/your-handle" }
  ]
};

/* ------------------------------------------------------------
   PROJECTS
   Each project supports:
     title       — required
     blurb       — one line shown on the card
     description — longer text shown in the popup (optional)
     tags        — array of strings, also used for the filters
     year        — shown on the card
     status      — "Live" | "In progress" | "Archived" (optional)
     featured    — true makes the card span two columns
     emoji       — shown if no image is provided
     image       — e.g. "assets/img/my-project.png" (optional)
     highlights  — bullet points in the popup (optional)
     links       — [{ label, href }]
   ------------------------------------------------------------ */

window.PROJECTS = [
  {
    title: "Orbit",
    blurb: "A keyboard-first dashboard that pulls all my services into one view.",
    description:
      "Orbit started because I was tired of keeping eight tabs open just to know if anything was on fire. " +
      "It aggregates deploys, uptime, issues and analytics into a single keyboard-driven surface that loads in under a second.",
    tags: ["Web app", "TypeScript", "React"],
    year: "2025",
    status: "Live",
    featured: true,
    emoji: "🛰️",
    highlights: [
      "Sub-second cold load on a 3G connection",
      "Fully keyboard navigable — no mouse required",
      "Pluggable data sources via a tiny adapter API"
    ],
    links: [
      { label: "Live demo", href: "#" },
      { label: "Source", href: "#" }
    ]
  },
  {
    title: "Inkwell",
    blurb: "Markdown notes app with local-first sync and zero accounts.",
    description:
      "A note-taking app that stores everything on your device first and syncs opportunistically. " +
      "No sign-up, no server round-trip to read your own writing.",
    tags: ["Web app", "Offline", "TypeScript"],
    year: "2025",
    status: "In progress",
    emoji: "🖋️",
    highlights: [
      "CRDT-based merge so edits never conflict",
      "Works completely offline as a PWA"
    ],
    links: [{ label: "Source", href: "#" }]
  },
  {
    title: "Palette CLI",
    blurb: "Generates accessible colour scales from a single brand colour.",
    description:
      "Feed it one hex value and it returns a full 11-step scale with contrast ratios checked against WCAG AA and AAA, " +
      "ready to paste into Tailwind or CSS custom properties.",
    tags: ["CLI", "Design", "Node.js"],
    year: "2024",
    status: "Live",
    emoji: "🎨",
    highlights: [
      "Perceptually uniform steps using OKLCH",
      "Exports to CSS, Tailwind, JSON and Figma tokens"
    ],
    links: [{ label: "Source", href: "#" }]
  },
  {
    title: "Ledgerlite",
    blurb: "Dead-simple personal finance tracking in a single HTML file.",
    description:
      "One file, no dependencies, no cloud. Open it in a browser, track your spending, and your data never leaves the tab.",
    tags: ["Tool", "JavaScript"],
    year: "2024",
    status: "Live",
    emoji: "📒",
    links: [{ label: "Source", href: "#" }]
  },
  {
    title: "Signal Garden",
    blurb: "Scrapes and visualises air-quality sensors across my city.",
    description:
      "A data pipeline plus map front-end that collects readings from public sensors every fifteen minutes " +
      "and renders a year of history you can scrub through.",
    tags: ["Data", "Python", "Visualisation"],
    year: "2024",
    status: "Archived",
    emoji: "🌱",
    highlights: [
      "Ingests ~40k readings a day",
      "Static output — hosted for free"
    ],
    links: [{ label: "Write-up", href: "#" }]
  },
  {
    title: "Tinygrep",
    blurb: "A regex engine written from scratch to understand how they work.",
    description:
      "Backtracking regex engine built in about 600 lines, with a step-through visualiser that shows the matcher's state machine as it runs.",
    tags: ["Learning", "Python"],
    year: "2023",
    status: "Archived",
    emoji: "🔎",
    links: [{ label: "Source", href: "#" }]
  }
];
