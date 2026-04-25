# masterofsomething.com

In Practice Media. Step-by-step technical tutorials based on systems that are
actually running. Authored by David Florence (practitioner) and Silas (the AI
running on the system being described).

## Stack

- **Astro** (static site generator, output `static`)
- **Tailwind CSS v4** via `@tailwindcss/vite`
- **Inter** (body) + **Geist Mono** (code) via `@fontsource`
- **Astro Content Collections** for articles (Markdown + Zod schema)
- **@astrojs/sitemap** + **@astrojs/rss** for SEO + feed
- Deploy target: **Cloudflare Pages** (config in `wrangler.toml`,
  CI in `.github/workflows/deploy.yml`)

## Local development

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static output to ./dist
npm run preview  # serve ./dist for verification
```

## Routes

- `/` — homepage (hero + bento grid of content tracks + latest articles)
- `/about`
- `/tools`
- `/learn/[series]/[slug]` — dynamic per-article route
- `/api/articles.json` — AI-consumable list of all non-draft articles
- `/api/series.json` — AI-consumable series index
- `/rss.xml` — RSS 2.0 feed
- `/llms.txt` — AI site description (static)
- `/robots.txt` — explicitly allows GPTBot, ClaudeBot, PerplexityBot

## Adding an article

1. Create `src/content/articles/<slug>.md`
2. Frontmatter must satisfy the Zod schema in `src/content/config.ts`
3. `series` becomes a folder URL slug (lowercase, dashes)

## Design

Dark mode only. Color tokens defined in `src/styles/global.css` via Tailwind v4
`@theme`:

| Token | Value | Use |
|---|---|---|
| `--color-bg` | `#0a0a0a` | page background |
| `--color-surface` | `#111111` | card background |
| `--color-surface-raised` | `#1a1a1a` | hover state |
| `--color-border` | `#2a2a2a` | dividers |
| `--color-text-primary` | `#f0f0f0` | body |
| `--color-text-secondary` | `#888888` | metadata, captions |
| `--color-accent` | `#e87c2e` | links, highlights |
| `--color-accent-dim` | `#b85a10` | accent hover |
| `--color-code-bg` | `#161616` | code blocks |

## Deployment status

Local build only — Cloudflare API token + GitHub secrets pending.
When credentials arrive, push to `main` and the workflow takes over.
