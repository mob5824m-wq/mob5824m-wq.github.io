# mob5824m-wq.github.io

Personal website, projects portfolio, and Discord bot legal compliance documentation. Plain HTML, CSS and vanilla JS — no build step, no npm, no framework. Push and it's live on GitHub Pages.

**<https://mob5824m-wq.github.io/>**

```
index.html                Home page & project showcase portfolio
terms.html                Terms of Service for Punishment Manager Discord bot
privacy.html              Privacy Policy for Punishment Manager Discord bot
na/                       North Active curated athletic wear storefront (/NA/ alias supported)
data/content.js           ← Portfolio content & project definitions
assets/css/style.css      Design tokens, portfolio styles, and legal documentation layouts
assets/js/main.js         Dynamic portfolio rendering, dark/light theme, dialog modals
assets/img/               Icons, social graph images (og.jpg), and screenshots
serve.py                  Local preview server (caching disabled)
.nojekyll                 Stops GitHub Pages running Jekyll
sitemap.xml               Search engine indexing sitemap
```

## Pages

- **`/` (`index.html`)**: Interactive project showcase portfolio with dark/light mode toggle, tag filtering, modal details, and links.
- **`/terms.html`**: Terms of Service for the **Punishment Manager** Discord bot (acceptable use, permissions, commands, liabilities).
- **`/privacy.html`**: Privacy Policy for the **Punishment Manager** Discord bot (data collection, SQLite persistence, retention, deletion rights).
- **`/na/`**: North Active curated activewear storefront catalog and cart handoff.

## Editing Portfolio Content

Portfolio projects and personal bio details live in **`data/content.js`**.
- `window.SITE`: Brand name, availability status, typewriter slogans, bio paragraphs, skills, timeline, and contact links.
- `window.PROJECTS`: Projects list with titles, blurbs, tags, years, highlights, screenshots, and URLs.

## Local Preview

```bash
python3 serve.py 8000
# Visit http://localhost:8000 in your browser
```

## Licence

[MIT](LICENSE).
