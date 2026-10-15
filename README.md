# S7 Pokedex

A private, owner-managed Pokemon catalog for the S7 server.

## Local use

```bash
npm install
npm run dev
```

Put sprite images in `sprites/Rare`, `sprites/Paradox`, `sprites/Gmax`, or `sprites/Regional`. Register each sprite filename (without `.png`) in the matching category's list in `src/main.js` to show it in the catalog.

Catalog changes such as notes and custom entries are saved in the current browser with local storage. Adding new sprite files requires rebuilding the site.

The **Packs** view includes a dynamic **Rare Pack** containing every Rare entry except Okidogi, Fezandipiti, and Munkidori, and a **Regional Pack** containing Regional entries with sprites. New Rare entries join the Rare Pack automatically; new Regional entries join the Regional Pack when they have a sprite.

## Hosting

This is a static HTML site and can be opened directly in a browser or deployed to Netlify, Vercel, Cloudflare Pages, or GitHub Pages.

No build command is required. Upload the project files and open `index.html`.

The sprite folders are `sprites/Rare`, `sprites/Paradox`, `sprites/Gmax`, and `sprites/Regional`.

For a genuinely private owner editor with changes shared across devices, the next step is adding authentication and a hosted database such as Supabase. The current version keeps the public hosted catalog safe from visitor edits, but local browser changes do not update the deployed site for other visitors.
