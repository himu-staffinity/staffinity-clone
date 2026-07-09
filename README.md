# Staffinity.ai

Static site built with [Astro](https://astro.build) and deployed to Cloudflare Pages.

## Prerequisites

- **Node.js** >= 22.12.0 (version managed by [mise](https://mise.jdx.dev))
- [mise](https://mise.jdx.dev) — run `mise install` to install the project Node.js version

## Getting Started

```bash
# Install Node.js version from mise.toml
mise install

# Install dependencies
mise r deps

# Start dev server
mise r dev

# Build for production
mise r build

# Preview production build, runs along with the build command
mise r preview
```

## Project Structure

```
src/
├── components/     # UI components, icons, sections, structured-data
├── content/        # Markdown content collections (authors, solutions, posts)
├── data/           # TypeScript data files (nav, sectors, social)
├── layouts/        # Page layouts
├── pages/          # Route pages (file-based routing)
└── styles/         # SCSS stylesheets
public/             # Static assets (images, fonts, videos, CMS admin)
functions/          # Cloudflare Functions (CMS OAuth)
```

## CMS

Decap CMS admin panel at `/admin`. Configuration in `public/admin/config.yml`.
GitHub OAuth flow handled by Cloudflare Functions in `functions/api/`.

**Development**

Two config files exist in `public/admin/`:
- `config.yml` — production (points to live GitHub repo, `staffinity.ai`)
- `config.dev.yml` — dev (points to a fork, `localhost:8788`)

To test the CMS locally, uncomment the `<link>` override in `src/pages/admin.astro:8`:
```html
<!-- Uncomment the following to activate dev environment -->
<link href="/admin/config.dev.yml" type="text/yaml" rel="cms-config-url">
```
Then run `mise r preview` and visit `http://localhost:8788/admin/`.
**Re-comment the `<link>` when done — never commit this change.** See `AGENTS.md` for full details.

## Deployment

Cloudflare Pages with `astro build`. Functions are copied to `dist/functions/` during build.

Some changes to be made
