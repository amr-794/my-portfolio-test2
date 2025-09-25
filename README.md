# Advanced Portfolio (React + TypeScript + Vite)

Features:
- Animated background and scroll reveals
- Audio page with lists and tracks
- Admin dashboard stored in localStorage (no backend). Admin can:
  - Create lists, add tracks (local upload or embed external URL), remove items
  - Add embed sources (e.g., direct mp3 links from archive.org)
  - Change logos for main page and audio page
  - Publish a list to the global player (fixed bottom)

Notes about embeds:
- When adding an embed, provide a **direct audio file URL** (e.g. https://archive.org/download/XYZ/track.mp3).
- Do NOT paste an iframe. Use the direct file URL so the player can stream it.

Deploy:
- `npm install`
- `npm run build`
- Deploy `dist` to Netlify (netlify.toml included)

Limitations:
- This project is a static frontend; all data is kept in browser localStorage. If you need a multi-user backend, we can wire an API later.
