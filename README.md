# Mystery Lens — GitHub Pages frontend

A simple, responsive frontend for **https://mysterylens.blogspot.com/**. No React, build tools, server, database, or paid hosting required.

## Features

- Dark editorial homepage with mobile navigation, story grid, category filters, search, and fallback illustrations.
- Displays up to **100 most recent Blogger posts** using Blogger's public JSONP feed (no API key). Content is populated automatically when the feed is accessible.
- If the public feed is disabled, blocked, or times out, the site shows five verified article links instead of a broken page.
- Article titles, thumbnails and "Read" links navigate **directly to each canonical Blogger post in the same tab**: no splash page, popup, or extra redirect. The visitor's address bar will show the Blogger domain after clicking; GitHub Pages cannot conceal that change.
- All files use relative paths and work from either `username.github.io` or `username.github.io/repository-name`.

## Deploy on GitHub Pages

1. Create a new public GitHub repository, for example `mystery-lens` (or choose the special name `YOUR_USERNAME.github.io` to serve from your account root).
2. Upload **the contents of this folder** to the repository's root: `index.html`, `styles.css`, `script.js`, `README.md`, and the `assets` folder. Do not upload only the ZIP.
3. In the repository, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**, select **main** and **/(root)**, then **Save**.
5. Your site will be available at `https://YOUR_USERNAME.github.io/mystery-lens/`, or `https://YOUR_USERNAME.github.io/` if the repository is named `YOUR_USERNAME.github.io`.

## Quick local preview

You can open `index.html` directly in a browser. For a reliable local test, use `python -m http.server 8000` from this folder, then visit `http://localhost:8000/`.

## How the Blogger integration works

Blogger exposes a public feed at:

`https://mysterylens.blogspot.com/feeds/posts/default?alt=json-in-script&max-results=100&callback=mysteryLensFeedCallback`

The site requests the feed with a script tag, extracts post title, summary, publication date, thumbnail and canonical link, and sorts results by date. All post destinations are restricted in the code to `https://mysterylens.blogspot.com/` or `https://www.mysterylens.blogspot.com/`.

If Blogger has disabled feeds, enable sharing in **Blogger → Settings → Site feed → Allow blog feed**. Feed rendering depends on Blogger's feed availability and browser restrictions. JSONP executes code from the trusted Blogger host, so only use it with a blog you control/trust.

## Customize

- Change the blog URL in `script.js` (`BLOG_URL` and the validated hostnames if moving domains).
- Change fonts, colors and spacing in `styles.css`.
- Edit copy and navigation in `index.html`.
- Update the hardcoded `FALLBACK_POSTS` in `script.js` if the blog feed isn't used.

## Limitations

GitHub Pages hosts static sites; this is a **frontend and article directory**, not an invisible reverse proxy for Blogger. Clicking a story changes the browser URL to the canonical Blogger article. To truly serve article pages under a custom domain, you would need a different architecture (for example, publishing Blogger directly on your domain). No redirect cloaking or misleading address-bar behavior is implemented.
