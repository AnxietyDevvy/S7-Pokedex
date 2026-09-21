# S7 Pokedex

A private, owner-managed Pokemon catalog for the S7 server.

## Local use

```bash
npm install
npm run dev
```

Put sprite images in `sprites/Rare`, `sprites/Paradox`, or `sprites/Gmax`. Every PNG in those folders becomes a catalog entry automatically when the app is built.

Catalog changes such as notes and custom entries are saved in the current browser with local storage. Adding new sprite files requires rebuilding the site.

## Hosting

This is a static HTML site and can be opened directly in a browser or deployed to Netlify, Vercel, Cloudflare Pages, or GitHub Pages.

No build command is required. Upload the project files and open `index.html`.

The sprite folders are `sprites/Rare`, `sprites/Paradox`, and `sprites/Gmax`.

For a genuinely private owner editor with changes shared across devices, the next step is adding authentication and a hosted database such as Supabase. The current version keeps the public hosted catalog safe from visitor edits, but local browser changes do not update the deployed site for other visitors.
