# Toolboxi.uz

Toolboxi.uz is a collection of browser-based calculators, generators and converters. The public
site is statically prerendered and deployed to GitHub Pages from `main`.

## Local development

```bash
pnpm install
pnpm dev
```

The development server runs at `http://localhost:8080`.

## Required checks

```bash
pnpm typecheck
pnpm lint
pnpm test
GITHUB_PAGES=true VITE_AUTH_ENABLED=false pnpm build:pages
```

`build:pages` prerenders public routes and generates `dist/client/sitemap.xml`. Pages marked with
`noindex` are omitted from the sitemap.

## Adding a tool

1. Add the implementation under `src/features`.
2. Register the tool in `src/lib/tools/catalog.ts`.
3. Connect the route in `src/routes/tools/$slug.tsx`.
4. Add Russian and English copy, shared icon styling, dark theme support and responsive layouts.
5. Verify the tool at desktop, tablet and mobile widths.
6. Run all required checks before merging to `main`.

## Deployment

`.github/workflows/deploy-pages.yml` builds and deploys `dist/client` through GitHub Actions.
Pushing to `main` replaces the current GitHub Pages artifact. The custom domain is configured in
the repository's Pages settings; DNS and HTTPS remain managed there.

