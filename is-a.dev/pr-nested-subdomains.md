# PR — nested subdomains for `mob5824.is-a.dev`

Everything you need to open the second registration PR on
[`is-a-dev/register`](https://github.com/is-a-dev/register) yourself.

> **Why you submit this one:** `is-a-dev/register` does not accept AI-generated pull requests
> (see its `AGENTS.md` — maintainers close them automatically). Your first PR (#59999) was
> already opened and merged from your own fork, which is the correct way to do it.

---

## 1. Title

```
Add nested subdomains for mob5824.is-a.dev
```

---

## 2. Body

Copy everything between the lines below and paste it into the PR description.

<!-- ============================================================ -->
<!-- BEGIN PR BODY                                                    -->
<!-- ============================================================ -->

```
<!--
YOU MUST FILL OUT THIS ENTIRE TEMPLATE FOR YOUR PR TO BE APPROVED!

DO NOT MODIFY OR REMOVE THIS TEMPLATE (INCLUDING REMOVING COMMENTS) OR YOUR PR WILL FAIL VALIDATION!
-->

# Requirements
<!-- Your domain MUST pass ALL the requirements below, otherwise it WILL BE DENIED. -->
<!-- Change each checkbox to [x] (all lowercase, with no spaces between the brackets) to mark it as completed. -->
<!-- Do not modify anything in this section other than the checkboxes, or your PR will fail validation. -->

- [x] <!-- TOS --> I **agree** to the [Terms of Service](https://is-a.dev/terms). <!-- Your request MUST follow the TOS to be approved. -->
- [x] <!-- DOMAIN_STRUCTURE --> My file is following the [domain structure](https://docs.is-a.dev/domain-structure/). <!-- Your file is in the domains directory, the name is valid, it is JSON format, etc. -->
- [x] <!-- WEBSITE_REACHABLE --> My website is **reachable** and **completed**. <!-- We do not permit simple "Hello, world!" or simply copied template websites with minimal changes. -->
- [x] <!-- SOFTWARE_RELATED --> My website is **software development** related. <!-- We do not accept websites such as gaming, courses, AI agents/chatbots, etc. NOTE: Only your root subdomain needs to meet this requirement. -->
- [x] <!-- NON_COMMERCIAL --> My website is **not for commercial use**. <!-- Your website's purpose should not be to generate any form of revenue or profit. (e.g. a business) -->
- [x] <!-- CONTACT_INFO --> I have provided sufficient contact information in the `owner` key. <!-- Provide your email in the `email` field or another platform (e.g. Twitter or Discord) for contact. -->
- [x] <!-- WEBSITE_LINK --> I have provided a link to my website below. <!-- This step is required for your PR to be approved. -->

# Website Preview
<!-- Provide a LINK (not a screenshot) to your website below between the start/end markers. -->
<!-- This should be a LINK to the existing domain your website is on, NOT the is-a.dev domain you're applying for. (e.g. https://abc.vercel.app, https://abc.github.io) -->

<!-- WEBSITE_PREVIEW_START -->
https://mob5824m-wq.github.io/
<!-- WEBSITE_PREVIEW_END -->

# Website Purpose
<!-- Please tell us the purpose or motive behind your website in between the start/end markers. For example, it is a portfolio website, etc. -->

<!-- WEBSITE_PURPOSE_START -->
Personal open-source project portfolio. The root subdomain `mob5824.is-a.dev` already points to the
portfolio on GitHub Pages, and each subdomain in this PR redirects to the page for one of the
projects hosted there: classroom-library, soundtrail, sentinel, pixel-photo-nas, discord-lofi,
combat-master, soundtrail-bot, raspap-webone, kobo-arc-7-freedom, classroom-book-recs, city-search,
myinstants-clone and cubeclash. The site is non-commercial and is not used to generate revenue.
<!-- WEBSITE_PURPOSE_END -->
```

<!-- ============================================================ -->
<!-- END PR BODY                                                      -->
<!-- ============================================================ -->

---

## 3. Files to add

Add these **13** files to the `domains/` directory of your fork
([`mob5824m-wq/register`](https://github.com/mob5824m-wq/register)) — they are in
`is-a.dev/domains/` in this repo.

| File | Subdomain it registers | Redirects to |
| --- | --- | --- |
| `classroom-library.mob5824.json` | `classroom-library.mob5824.is-a.dev` | `https://mob5824.is-a.dev/classroom-library/` |
| `soundtrail.mob5824.json` | `soundtrail.mob5824.is-a.dev` | `https://mob5824.is-a.dev/soundtrail/` |
| `sentinel.mob5824.json` | `sentinel.mob5824.is-a.dev` | `https://mob5824.is-a.dev/sentinel/` |
| `pixel-photo-nas.mob5824.json` | `pixel-photo-nas.mob5824.is-a.dev` | `https://mob5824.is-a.dev/pixel-photo-nas/` |
| `discord-lofi.mob5824.json` | `discord-lofi.mob5824.is-a.dev` | `https://mob5824.is-a.dev/discord-lofi/` |
| `combat-master.mob5824.json` | `combat-master.mob5824.is-a.dev` | `https://mob5824.is-a.dev/combat-master/` |
| `soundtrail-bot.mob5824.json` | `soundtrail-bot.mob5824.is-a.dev` | `https://mob5824.is-a.dev/soundtrail-bot/` |
| `raspap-webone.mob5824.json` | `raspap-webone.mob5824.is-a.dev` | `https://mob5824.is-a.dev/raspap-webone/` |
| `kobo-arc-7-freedom.mob5824.json` | `kobo-arc-7-freedom.mob5824.is-a.dev` | `https://mob5824.is-a.dev/kobo-arc-7-freedom/` |
| `classroom-book-recs.mob5824.json` | `classroom-book-recs.mob5824.is-a.dev` | `https://mob5824.is-a.dev/classroom-book-recs/` |
| `city-search.mob5824.json` | `city-search.mob5824.is-a.dev` | `https://mob5824.is-a.dev/city-search/` |
| `myinstants-clone.mob5824.json` | `myinstants-clone.mob5824.is-a.dev` | `https://mob5824.is-a.dev/myinstants-clone/` |
| `cubeclash.mob5824.json` | `cubeclash.mob5824.is-a.dev` | `https://mob5824.is-a.dev/cubeclash/` |

Do **not** re-add `mob5824.json` — it is already merged upstream, and adding it again would
produce a confusing diff. (A copy is kept in `is-a.dev/domains/` for reference only.)

---

## 4. Steps

```bash
# 1. fork is-a-dev/register (if you have not already), then clone your fork
git clone https://github.com/mob5824m-wq/register.git
cd register
git remote add upstream https://github.com/is-a-dev/register.git
git fetch upstream && git checkout -b feature/nested-subdomains upstream/main

# 2. copy the 13 nested files into domains/
cp /path/to/mob5824m-wq.github.io/is-a.dev/domains/*.mob5824.json domains/

# 3. commit
git add domains/*.mob5824.json
git commit -m "Add nested subdomains for mob5824.is-a.dev"

# 4. push and open the PR from your fork
git push origin feature/nested-subdomains
```

Then open the PR against `is-a-dev/register:main` with the title and body from sections 1–2.

Because the parent `mob5824.is-a.dev` is already live, this PR can be submitted on its own —
there is no ordering constraint left.
