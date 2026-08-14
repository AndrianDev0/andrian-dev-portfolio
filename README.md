# Andrian.Dev Portfolio

A responsive portfolio and conversion landing page for a freelance developer building websites, Telegram bots, web apps, automation, and integrations.

## Run locally

Requirements: Node.js 22.13 or newer and pnpm.

```bash
pnpm install
pnpm dev
```

Open the local URL printed by the development server.

## Production build

```bash
pnpm typecheck
pnpm build
```

## Content and settings

- Contact details, brand name, budgets, navigation, and metrics: `site.ts`
- Project data: `projects.ts`
- Services, benefits, process, and technologies: `content.ts`
- Contact form email adapter: `submit.ts`

The portfolio currently features the real Nebo Bistro Telegram Bot + Mini App case.

## Add a project

Add a new object to the `projects` array in `projects.ts`. Each project needs a unique `slug`; its detail page is generated automatically at `/projects/[slug]`.

Project fields:

- `id`, `slug`, `title`, `category`
- `description`, `technologies`, `kind`, `accent`
- `challenge`, `solution`, `result`
- `liveUrl` and `previewUrl`

## Screenshots and assets

Place future screenshots in `public/projects/` and supporting imagery in `public/images/`. Use Next/Image for raster assets added to the interface.

## Change text

Section copy lives in `i18n.tsx`, `content.ts`, and the corresponding components. Primary site metadata is in `site.ts`.

## Contact form

The form prepares a prefilled email to the address in `submit.ts`. Replace it with a server endpoint when direct background delivery is needed.

```ts
{
  name,
  contact,
  projectDescription,
  budget
}
```

Keep secrets on the server and out of client-side code.
