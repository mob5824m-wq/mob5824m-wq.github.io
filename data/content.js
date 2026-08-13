/* ============================================================
   CONTENT — this is the only file you need to edit.
   Everything on the page is rendered from the two objects below.

   Anything left as "" or [] is simply not rendered, so you can
   fill this in a bit at a time without the layout breaking.
   ============================================================ */

window.SITE = {
  /* --- Identity ------------------------------------------- */
  brand: "mob5824m",          // small logo text in the header
  name: "Your Name",          // TODO: shown in the hero headline
  role: "",                   // TODO: e.g. "Software developer" — subtitle under the name

  availability: "",           // e.g. "Open to new projects" — "" hides the pill

  // Rotating words in the hero. Use one entry for no animation, [] to disable.
  typewriter: [],             // e.g. ["web apps.", "small tools."]

  tagline: "",                // TODO: one or two sentences under the headline

  /* --- Hero stats — [] hides the row ----------------------- */
  stats: [
    // { value: "12", label: "Projects shipped" },
  ],

  /* --- About ----------------------------------------------- */
  about: [
    // TODO: one string per paragraph.
    // "First paragraph about you.",
  ],

  skills: [
    // TODO: "JavaScript", "Python", "Figma", ...
  ],

  // "Currently" list in the About sidebar — [] hides the card.
  timeline: [
    // { when: "Now",  what: "What you're working on" },
  ],

  /* --- Contact --------------------------------------------- */
  ctaHeading: "Get in touch",
  ctaText: "",                // TODO: one line inviting people to reach out

  links: [
    // TODO: add your real links. `primary: true` styles the main button.
    // { label: "Email",  href: "mailto:you@example.com", primary: true },
    // { label: "GitHub", href: "https://github.com/mob5824m-wq" },
  ]
};

/* ============================================================
   PROJECTS

   Copy the template below for each project. Only `title` is
   required — every other field degrades gracefully if omitted.

   {
     title:       "Project name",              // required
     blurb:       "One line shown on the card.",
     description: "Longer text shown in the popup.",
     tags:        ["Web app", "Python"],       // these become the filter buttons
     year:        "2026",
     status:      "Live",                      // "Live" | "In progress" | "Archived"
     featured:    false,                       // true = card spans two columns
     emoji:       "🚀",                        // fallback when there's no image
     image:       "assets/img/project.png",    // optional thumbnail
     highlights:  ["Bullet in the popup"],
     links:       [{ label: "Source", href: "https://..." }]
   }

   While this array is empty the page shows a friendly placeholder
   card instead, so the site still looks intentional.
   ============================================================ */

window.PROJECTS = [
  // {
  //   title: "My first project",
  //   blurb: "A one-line description.",
  //   description: "A longer description shown when the card is clicked.",
  //   tags: ["Web app"],
  //   year: "2026",
  //   status: "Live",
  //   emoji: "🚀",
  //   links: [{ label: "Source", href: "https://github.com/mob5824m-wq" }]
  // },
];
