# AGENTS.md — Staffinity.ai

> AI-agent-friendly reference for the Staffinity.ai codebase. Read this before touching any files.

---

## Overview

**Staffinity.ai** is a static marketing site for a German IT staffing company. Built with **Astro 7**, deployed to **Cloudflare Pages**, with **Decap CMS** for content management. Originally a Jekyll project — fully migrated to Astro as of July 2026.

- **Site URL**: `https://staffinity.ai`
- **Language**: English (with German legal pages: `datenschutz`, `impressum`)
- **Content model**: Markdown-driven (no CMS database)
- **Build output**: Static HTML, CSS, JS — zero client-side framework

---

## Tech Stack

| Layer | Technology | Version | Notes |
|-------|-----------|---------|-------|
| Framework | Astro | ^7.0.2 | Static site generation |
| Styles | SCSS (Sass) | ^1.101.0 | `@import`-based partials in `src/styles/` |
| Command runner | mise | - | All tasks via `mise run <task>` — see `mise.toml` for available tasks |
| Node runtime | Node.js | 26.3.1 (local) / 22 (Cloudflare) | Managed by mise locally |
| Deployment | Cloudflare Pages | v3 build system | Auto-detects `package-lock.json`, zero extra config |
| CMS | Decap CMS | 3.x | Served at `/admin`, GitHub backend |
| Plugins | @astrojs/sitemap | ^3.7.3 | Auto-generated sitemap |

> **No npm-based runners**: All development commands go through `mise`. The `npm run` scripts in `package.json` are wrappers called by mise tasks — use `mise run` directly.

---

## Directory Structure

```
staffinity-ai-site/
├── astro.config.mjs          # Astro config: site URL, sitemap, SCSS loadPaths
├── package.json              # Dependencies + build scripts (wrappers for mise)
├── package-lock.json         # npm lockfile (auto-generated)
├── mise.toml                 # Task runner — defines `deps`, `dev`, `build`, `preview`
├── tsconfig.json             # Extends astro/tsconfigs/strict
├── wrangler.jsonc            # Cloudflare Workers config (assets: ./dist)
│
├── public/                   # Static assets served at root (copied as-is to dist/)
│   ├── admin/                # Decap CMS (/admin)
│   │   ├── config.yml        # CMS backend + collection config (production)
│   │   └── config.dev.yml    # CMS config for local dev (points to clone repo)
│   ├── assets/               # Fonts, images, videos, SCSS entry
│   │   ├── images/           # Favicon variants, tech logos, collab images
│   │   │   └── authors/      # Author headshots (e.g. brad.png)
│   │   └── og-default.svg    # Default Open Graph image
│   └── manifest.json
│
├── functions/                # Cloudflare Functions (serverless)
│   └── api/
│       ├── auth.js           # GitHub OAuth login redirect
│       └── callback.js       # GitHub OAuth callback + token exchange + repo access check
│
├── src/                      # Astro source (all pages, components, styles)
│   ├── consts.ts             # Global constants (SITE object)
│   ├── content.config.ts     # Content collection schemas (authors, solutions, stories)
│   │
│   ├── components/           # Reusable Astro components
│   │   ├── Button.astro
│   │   ├── Card.astro
│   │   ├── Console.astro
│   │   ├── CTA.astro
│   │   ├── Footer.astro
│   │   ├── Header.astro
│   │   ├── MetaTags.astro    # Open Graph + Twitter Card meta tags
│   │   ├── SectionDivider.astro
│   │   ├── icons/            # 20+ inline SVG icon components
│   │   │   ├── index.ts      # Barrel export
│   │   │   └── sectors/      # Sector-specific icons (Automotive, Healthcare, etc.)
│   │   │       └── index.ts
│   │   ├── sections/         # Full-width page sections
│   │   │   ├── About.astro
│   │   │   ├── Areas.astro
│   │   │   ├── Cooperation.astro
│   │   │   ├── Expertise.astro
│   │   │   ├── Hero.astro
│   │   │   └── Technologies.astro
│   │   └── structured-data/  # JSON-LD SEO components
│   │       ├── Webpage.astro
│   │       └── Website.astro
│   │
│   ├── content/              # Markdown content collections
│   │   ├── authors/
│   │   │   └── Bradley_Wessels.md
│   │   ├── solutions/
│   │   │   ├── app_dev.md    # Mobile App Development (Flutter, React-Native)
│   │   │   ├── backend.md   # Backend & Architecture (TypeScript, Rust, etc.)
│   │   │   ├── devops.md    # DevOps & Cloud (Kubernetes, AWS, GCP)
│   │   │   ├── machine.md   # Machine Learning & AI (Python, LLMs, GenAI)
│   │   │   ├── webapps.md   # Web Apps Full-Stack (React, SSR, Astro, Next.js)
│   │   │   └── z_other.md   # Other Candidates
│   │   └── stories/          # Story content (single story.md file)
│   │
│   ├── data/                 # TypeScript data modules
│   │   ├── nav.ts            # Navigation links
│   │   ├── sectors.ts        # Business sectors
│   │   └── social.ts         # Social media links
│   │
│   ├── layouts/              # Page wrapper layouts
│   │   ├── BaseLayout.astro       # Root HTML shell (<head>, fonts, scramble script)
│   │   ├── PageLayout.astro       # Base + MetaTags + CTA + structured data
│   │   ├── LayoutedPageLayout.astro
│   │   ├── SolutionLayout.astro   # PageLayout + Cooperation + Expertise sections
│   │   └── RedirectLayout.astro   # Meta-refresh redirect wrapper
│   │
│   ├── pages/                # Route pages (file-based routing)
│   │   ├── index.astro       # "/" — Homepage
│   │   ├── about.astro       # "/about"
│   │   ├── work.astro        # "/work" — Principles
│   │   ├── tech.astro        # "/tech" — Technologies
│   │   ├── meet.astro        # "/meet" — Contact (Cal.com embed)
│   │   ├── story.astro       # "/story" — Story (parsed from stories/story.md)
│   │   ├── admin.astro       # "/admin" — Decap CMS SPA entry
│   │   ├── card_092024.astro # "/card_092024"
│   │   ├── flyer_092024.astro# "/flyer_092024"
│   │   ├── datenschutz.astro # "/datenschutz" — Privacy (German)
│   │   ├── impressum.astro   # "/impressum" — Imprint (German)
│   │   ├── linkedin_bradley.astro  # Redirect to Bradley's LinkedIn
│   │   ├── linkedin_jan.astro      # Redirect to Jan's LinkedIn
│   │   ├── 404.astro         # "/404" — Error page
│   │   └── loesungen/
│   │       └── [slug].astro  # Dynamic solution routes (/loesungen/[slug])
│   │
│   └── styles/               # SCSS (imported via global.scss → index.scss)
│       ├── global.scss       # Entry point: @imports all partials
│       ├── index.scss        # Vendor/normalize imports + all partial @imports
│       ├── _variables.scss   # $turquoise, $beige, $green, breakpoints, etc.
│       ├── _typography.scss  # @font-face declarations
│       ├── _base.scss        # Reset, body, links
│       ├── _breakpoints.scss # Media query mixins
│       ├── _button.scss
│       ├── _card.scss
│       ├── _carousel.scss
│       ├── _cta.scss
│       ├── _footer.scss
│       ├── _grid.scss
│       ├── _header.scss
│       ├── _section.scss
│       ├── _story.scss
│       └── _svg.scss
```

---

## Content Collections

Defined in `src/content.config.ts`. All use glob loaders (file-based, no CMS database).

### `authors`

```
src/content/authors/*.md
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `name` | string | ✅ | Display name |
| `job` | string | ✅ | Job title |
| `description` | string | ✅ | Bio text |
| `avatar` | string | ✅ | Path to headshot (e.g. `/assets/images/authors/brad.png`) |
| `linkedin` | string | ❌ | LinkedIn profile URL |

### `solutions`

```
src/content/solutions/*.md
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `title` | string | ✅ | Solution title (e.g. "Machine Learning & AI") |
| `subtitle` | string[] | ✅ | Array of tech stack bullet points |
| `icon` | string | ✅ | Icon slug — resolves to a `<IconComponent>` from `src/components/icons/` |
| `summary` | string | ❌ | Rendered by `Expertise.astro` section |
| `primary_question` | string | ❌ | FAQ primary question heading |
| `primary_answer` | string | ❌ | FAQ primary answer text |
| `details` | array | ❌ | FAQ items with `question` + `answer` (array of `{ name, description }` pairs) |
| `layout` | string | ❌ | Layout identifier (usually `"solution"`) |
| `permalink` | string | ❌ | Custom URL override |

**Icon mapping**: The `icon` field maps to an Astro component via `toPascalCase()`. Example: `icon: machine_learning` → `<MachineLearning />` from `src/components/icons/index.ts`. The component is passed to `Cooperation.astro` directly — no longer resolved via image path.

### `stories`

```
src/content/stories/*.md
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `title` | string | ✅ | Story title |

**Note**: The `/story` page imports the markdown directly via Astro's `import` syntax (not content collections API). It parses sections dynamically from `##` headings.

---

## Route Map

| URL | File | Layout | Key Components | Data Sources |
|-----|------|--------|---------------|-------------|
| `/` | `pages/index.astro` | PageLayout | Hero, Expertise, Technologies, Areas, Cooperation, About | `consts.ts`, `sectors.ts`, solutions collection, authors collection |
| `/about/` | `pages/about.astro` | PageLayout | About | authors collection |
| `/work/` | `pages/work.astro` | PageLayout | Cooperation | — |
| `/tech/` | `pages/tech.astro` | PageLayout | Technologies | solutions collection |
| `/meet/` | `pages/meet.astro` | PageLayout | Cal.com embed | `consts.ts` |
| `/story/` | `pages/story.astro` | PageLayout | (story content) | `stories/story.md` (direct import) |
| `/admin/` | `pages/admin.astro` | (raw) | Decap CMS SPA | — |
| `/card_092024/` | `pages/card_092024.astro` | (raw) | Card | — |
| `/flyer_092024/` | `pages/flyer_092024.astro` | (raw) | — | — |
| `/datenschutz/` | `pages/datenschutz.astro` | PageLayout | — | — |
| `/impressum/` | `pages/impressum.astro` | PageLayout | — | — |
| `/linkedin_bradley/` | `pages/linkedin_bradley.astro` | RedirectLayout | — | — |
| `/linkedin_jan/` | `pages/linkedin_jan.astro` | RedirectLayout | — | — |
| `/404` | `pages/404.astro` | BaseLayout | — | — |
| `/loesungen/[slug]/` | `pages/loesungen/[slug].astro` | SolutionLayout | Cooperation, Expertise | solutions collection |

### Dynamic route: `/loesungen/[slug]/`

The `[slug].astro` page:
1. Loads all solutions via `getCollection("solutions")`
2. Generates static paths from all solution entries (no filtering — solution markdown files control routing via `layout` and `permalink`)
3. Passes `data` fields (`title`, `icon`, `summary`, `primary_question`, `primary_answer`, `details`) and raw `body` to `SolutionLayout`
4. The raw markdown body (if any) is rendered in a `<section>` below the Expertise component

**Layout chain**: `SolutionLayout` → `PageLayout` → `BaseLayout`

---

## Component Architecture

### Layout chain

```
BaseLayout (root HTML shell, fonts, <head>, scramble text script)
  ├── Header (nav from data/nav.ts)
  ├── <slot /> (page content)
  └── Footer (nav + social from data/social.ts)

PageLayout (wraps BaseLayout)
  ├── MetaTags (OG + Twitter Card meta)
  ├── <slot /> (page content)
  ├── CTA section
  └── Webpage + Website structured data

SolutionLayout (wraps PageLayout)
  ├── Cooperation section (title + FAQ + icon component)
  ├── Expertise section (summary text + CTA button)
  └── <slot /> (raw markdown body from solution)
```

### Section components

These are full-width page building blocks, each self-contained with their own SCSS:

| Component | Purpose | Props |
|-----------|---------|-------|
| `Hero` | Homepage hero with animated scramble text | — |
| `Expertise` | Solutions summary with CTA button | `text`, `button_text`, `button_url` |
| `Technologies` | Tech logo grid (from solution icons) | — |
| `Areas` | Business sector cards (from sectors.ts) | — |
| `Cooperation` | Solution detail with FAQ accordion + icon | `maintitle`, `faq`, `image_src`, `image_alt`, `primary_question`, `primary_answer`, `iconComponent` |
| `About` | Author profiles (from authors collection) | — |

### Icon components

All icons are **inline SVG Astro components** in `src/components/icons/`. They accept no props — colors are hardcoded or SCSS-controlled. The barrel export `index.ts` re-exports all icons individually, plus all sector icons via `export * from './sectors'`.

**Solution icons**: `AppDev`, `Backend`, `DevopsCloud`, `MachineLearning`, `Webapps`, `Person`
**Key UI icons**: `Logo`, `Divider`, `DividerButton`, `DividerShadow`, `Menu`, `Mail`, `Mobile`, `Next`, `Previous`, `Linkedin`, `Facebook`, `Instagram`, `Twitter`, `ExpertiseLogo`, `CtaLinkedin`, `CardIcon`, `ButtonBeige`
**Sector icons**: `Automotive`, `Healthcare`, `Midsize`, `Startups`, `Yours`

**Icon resolution in SolutionLayout**: The `icon` field from solution markdown is converted to PascalCase and looked up in the icons barrel export. E.g., `icon: app_dev` → `<AppDev />`.

---

## Styling System

### Architecture
- **Entry point**: `src/styles/global.scss` → `@import "index.scss"`
- **`index.scss`** imports all `_*.scss` partials in order
- SCSS `loadPaths` configured to `["src/styles"]` in `astro.config.mjs`

### Design tokens (in `_variables.scss`)
```scss
$turquoise: #46A19E;   // Primary accent
$beige:     #E6CFA1;   // Secondary accent
$green:     #4CAF50;   // Tertiary
```

These are used across `_button`, `_card`, `_cta`, `_footer`, `_header`, `_story`, `_svg` partials.

### Fonts
10 TTF files loaded via `@font-face` in `_typography.scss`:
- **SpaceGrotesk** (Light, Regular)
- **SpaceMono** (Regular, Italic, Bold, BoldItalic)
- **Ubuntu** (Regular, Italic)
- **UbuntuMono** (Regular, Bold)

Preloaded in `BaseLayout.astro` for performance.

### Responsive
Breakpoints defined in `_breakpoints.scss`. Components use mobile-first approach.

### Known SCSS issues
- All partials use deprecated `@import` instead of `@use`/`@forward` — Sass 3.0 will break this
- `darken()` and `lighten()` are deprecated — use `color.adjust()` or `color.scale()`

---

## Build & Deploy

### Local development

```bash
mise run deps       # Install dependencies (runs npm install)
mise run dev        # Start dev server → http://localhost:4321
mise run build      # Production build → dist/
mise run preview    # Build + serve via wrangler → http://localhost:8788
```

### Mise tasks (from `mise.toml`)

| Task | Command | Description |
|------|---------|-------------|
| `deps` | `npm install` | Installs dependencies |
| `dev` | `npm run dev` | Starts Astro dev server |
| `build` | `npm run build` | Builds site + copies Cloudflare Functions |
| `preview` | `npm run build && wrangler pages dev .` | Full preview with Functions |

### Production build

The `npm run build` script (called by `mise run build`):
```json
"build": "astro build && cp -R functions dist/functions 2>/dev/null; true"
```
1. Astro builds static site to `dist/`
2. Cloudflare Functions are copied from `functions/` → `dist/functions/`

### Cloudflare Pages configuration

Set this in the Cloudflare Pages dashboard:

| Variable | Value | Purpose |
|----------|-------|---------|
| `NODE_VERSION` | `22` | Node.js version for build |

**Build command** (in Cloudflare dashboard):
```
npm run build
```

**Build output directory**: `dist/`

Cloudflare Pages auto-detects `package-lock.json` and runs `npm ci` automatically — no manual install chaining needed.

**Note**: Cloudflare Pages build runs `npm run build` directly (not mise). The `mise` tasks are for local development only.

### CMS OAuth flow

The OAuth flow uses two Cloudflare Functions (`functions/api/auth.js` and `functions/api/callback.js`) and the Decap CMS SPA at `/admin`.

1. **User visits `/admin/`** → Decap CMS SPA loads from `pages/admin.astro` (loads `decap-cms.js` from unpkg)
2. **User clicks "Login with GitHub"** → Decap CMS redirects to `/api/auth`
3. **`/api/auth` (Cloudflare Function)**:
   - Generates a CSRF token (`oauth_state`) with a random UUID and the target repo from `GITHUB_REPO` env var
   - Sets the state as a cookie (10-minute expiry, `SameSite=Lax`, `Secure` on HTTPS)
   - Redirects the user to `https://github.com/login/oauth/authorize` with `client_id`, `redirect_uri`, `scope: repo user`, and the state parameter
4. **GitHub authorization page** → User authorizes the OAuth app
5. **GitHub redirects to `/api/callback?code=...&state=...`** (Cloudflare Function):
   - Validates state parameter against the `oauth_state` cookie (CSRF protection)
   - Exchanges the `code` for an access token via `https://github.com/login/oauth/access_token`
   - Verifies the user has **push access** to the target repo by calling `GET /repos/{repo}` and checking `permissions.push`
   - On success, returns an HTML page that:
     - Sets a `decap_cms_token` cookie (24-hour expiry)
     - Posts a message via `window.opener.postMessage` to the CMS opener window
     - Closes the popup window
   - On failure, returns a plain-text error (CSRF mismatch, missing creds, no push access)
6. **Decap CMS receives the token** → Completes authentication, enables editing

**Required env vars** (set in Cloudflare Pages dashboard):

| Variable | Purpose |
|----------|---------|
| `GITHUB_CLIENT_ID` | GitHub OAuth App client ID |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth App client secret |
| `GITHUB_REPO` | Target repo (e.g. `StaffinityAI/staffinity-ai`) |
| `BASE_URL` | Site base URL (e.g. `https://staffinity.ai`) |

### Decap CMS debugging workflow

There are **two Decap CMS config files** in `public/admin/`:

| File | Target Repo | Domain | Purpose |
|------|-------------|--------|---------|
| `config.yml` | `StaffinityAI/staffinity-ai` | `https://staffinity.ai` | Production (always what's committed to git) |
| `config.dev.yml` | `himu-staffinity/staffinity-clone` | `http://localhost:8788` | Local dev / debugging |

Decap CMS loads `config.yml` by default at `/admin/config.yml`. The `admin.astro` page uses Astro's `import.meta.env.DEV` to swap configs automatically:

- **`astro dev`** → loads `/admin/config.dev.yml`
- **`astro build`** → loads `/admin/config.yml`

No manual commenting/uncommenting needed. The `<link>` tag in the `<head>` is always populated with the correct path.

#### Wrangler parallel

The same pattern works for `wrangler.jsonc` or any config that differs locally vs. deployed: create a `.dev` variant and toggle the active file. Currently `wrangler.jsonc` is minimal enough that this isn't needed — just the `"name"` placeholder, local preview works fine.

---

## Common Tasks

### Adding a new solution page
1. Create `src/content/solutions/my-solution.md` with frontmatter:
   ```yaml
   ---
   title: My Solution
   icon: my_icon_slug       # must match a component in src/components/icons/
   subtitle:
     - Tech 1
     - Tech 2
   layout: solution          # required for /loesungen/ routing
   primary_question: What is this?
   primary_answer: Description here
   details:
     - question: Key Features
       answer:
         - name: Feature 1
           description: Description here
   summary: Brief summary for Expertise section
   ---
   ```
2. Create `src/components/icons/MyIcon.astro` with inline SVG and add to barrel export in `src/components/icons/index.ts`
3. Add a matching PNG to `public/assets/images/` if referenced elsewhere (legacy fallback)
4. Page auto-routes to `/loesungen/my-solution/`

### Adding a story
1. Edit `src/content/stories/story.md` — the `/story` page parses `##` headings dynamically
2. To add a new story file, update `content.config.ts` (schema only requires `title`) and adjust `story.astro` import path

### Updating navigation
Edit `src/data/nav.ts` — array of `{ name, url }` objects. Header and Footer both consume this.

### Updating site metadata
Edit `src/consts.ts` — the `SITE` object controls title, description, social links, phone, etc.

### Adding a new icon
1. Create `src/components/icons/MyIcon.astro` with inline SVG
2. Export from `src/components/icons/index.ts`
3. Use as `<MyIcon />` in any `.astro` file

### Working with SCSS
- New partials: create `src/styles/_my-component.scss`, add `@import "my-component";` to `index.scss`
- Variables: add to `_variables.scss`
- All paths are relative to `src/styles/` (configured as loadPath)

### Local CMS setup
1. Fork/clone the repo to a separate GitHub account
2. Update `public/admin/config.dev.yml` with your fork's repo name
3. Run `mise run dev` (or `mise run preview` for full Functions) — the config path is handled automatically via `import.meta.env.DEV`
4. Visit `http://localhost:4321/admin/` (dev) or `http://localhost:8788/admin/` (preview)

---

## Constraints & Gotchas

1. **No client-side framework**: This is pure static HTML/CSS/JS. No React, Vue, Svelte, or hydration islands. All interactivity is vanilla JS (e.g., the scramble text animation in `BaseLayout.astro`).

2. **Solution icon resolution**: The `icon` field in solution markdown maps to an Astro component via `toPascalCase()` lookup in `src/components/icons/index.ts`. `SolutionLayout.astro:26` does the lookup. The icon is passed directly as a component to `Cooperation.astro` — image path resolution is no longer used.

3. **`primary_question` and `primary_answer` fields**: Solution markdown supports top-level FAQ items via `primary_question`/`primary_answer` (rendered above the `details` array in `Cooperation.astro`). Both are optional.

4. **Subtitle is an array**: The `subtitle` field is `z.array(z.string())`, not a plain string. The CMS expects a list widget.

5. **Layout field still gates routing**: `[slug].astro` generates static paths from all solution entries without filtering. The `layout` and `permalink` fields in solution frontmatter control whether a page appears at `/loesungen/` or a custom URL.

6. **Stories not in content collections API**: The `/story` page uses `import { frontmatter, rawContent } from "../content/stories/story.md"` — a direct Astro markdown import, not `getCollection()`. The `stories` collection exists in `content.config.ts` for Decap CMS but is not used by the page.

7. **Functions are duplicated**: `functions/` at repo root is the source of truth. The build script copies them to `dist/functions/`. `public/functions/` is gitignored (was a legacy Netlify artifact).

8. **SCSS deprecation warnings**: The build shows ~15 deprecation warnings about `@import` and `darken()`/`lighten()`. These are cosmetic and don't affect the build. Plan to migrate to `@use` and `color.adjust()` in a future cleanup.

9. **No RSS feed**: `BaseLayout.astro` links to `/rss.xml` but no RSS generation is configured.

10. **Font weight**: TTF files total ~1.2MB. 10 font files are preloaded. Consider WOFF2 conversion for performance.

11. **German pages**: `datenschutz.astro` and `impressum.astro` are German-language legal pages. They use `PageLayout` (not `BaseLayout` directly) with hardcoded German content. Changes must preserve legal accuracy.

12. **CMS OAuth CSRF protection**: The `/api/auth` function sets an `oauth_state` cookie validated in `/api/callback`. If the state doesn't match, the callback returns 403. The cookie has a 10-minute expiry.

13. **CMS repo access check**: The `/api/callback` function verifies the authenticated user has `push` access to the target repo before returning a token. This prevents viewer-only users from using the CMS.

---

