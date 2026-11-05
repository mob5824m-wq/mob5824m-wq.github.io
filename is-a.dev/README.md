# is-a.dev registration kit

Everything needed to register `mob5824.is-a.dev` and its project subdomains on
[is-a.dev](https://is-a.dev).

```
is-a.dev/
├── domains/                     ← copy these into your fork's domains/ folder
│   ├── mob5824.json                 (parent — already live upstream)
│   └── <project>.mob5824.json ×13   (nested subdomains)
├── pr-nested-subdomains.md       ← title + body for the next registration PR
└── README.md
```

## Current status

| | |
| --- | --- |
| Parent `mob5824.is-a.dev` | ✅ **Live.** Merged upstream via [is-a-dev/register#59999](https://github.com/is-a-dev/register/pull/59999) on 2026-11-05. DNS resolves to GitHub Pages (`185.199.110.153`) and the TLS cert verifies. |
| `CNAME` in this repo | ✅ `mob5824.is-a.dev` (was `mob5824.is-a-.dev` — typo fixed) |
| GitHub Pages | ✅ Custom domain `mob5824.is-a.dev` already set on `main` |
| 13 nested subdomains | ⏳ **Not yet submitted.** Files are ready in `domains/`. |

Because the parent is already live, the nested PR can be submitted on its own — there is
no ordering constraint left.

## What lives where

`mob5824.is-a.dev` is a GitHub Pages site with a folder per project
(`/sentinel/`, `/soundtrail/`, …). GitHub Pages allows only **one** custom domain per
repository, so each project subdomain is registered as a **URL redirect** to its folder on
the main site rather than as a CNAME:

```json
"records": { "URL": "https://mob5824.is-a.dev/sentinel/" }
```

`"redirect_config": { "redirect_paths": true }` means paths are preserved, so
`sentinel.mob5824.is-a.dev/terms.html` → `mob5824.is-a.dev/sentinel/terms.html`.

## The 13 subdomains

`classroom-library` · `soundtrail` · `sentinel` · `pixel-photo-nas` · `discord-lofi` ·
`combat-master` · `soundtrail-bot` · `raspap-webone` · `kobo-arc-7-freedom` ·
`classroom-book-recs` · `city-search` · `myinstants-clone` · `cubeclash`

Each has a matching folder with an `index.html` in this repo — the redirect target exists.

`NA/` and `na/` are deliberately excluded: they are case-variant duplicates of the same
storefront, not separate showcased projects.

## Submitting the nested PR

See [`pr-nested-subdomains.md`](pr-nested-subdomains.md) for the title, the fully filled PR
body, the file list, and the copy-paste commands.

> **You submit that one yourself.** `is-a-dev/register` does not accept AI-generated pull
> requests — maintainers close them automatically (see the repo's `AGENTS.md`). Your first PR
> (#59999) was opened from your own account and merged, which is the way to do it.

## Notes

- `owner.username` must be `mob5824m-wq` — the register CI checks that each changed file's
  owner matches the PR author. The nested files also carry `owner.email`
  (`mob5824@duck.com`), which satisfies the PR template's contact-info requirement; it is
  the same address already published on the live site's contact links.
- `domains/mob5824.json` is kept **byte-identical to the copy already merged upstream**, so
  copying the whole folder never produces a stray edit to the live parent file.
- No `proxied` flag — `URL` records are proxied automatically by the register's `dnsconfig.js`.
- Files use 2-space indentation and a trailing newline, matching the repo's Prettier config.
