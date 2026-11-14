# Woolly Desk — website

The landing page for **Woolly Desk**, a cozy sheep farm that lives on your Mac desktop.

## Run locally

The pictures live in the private game repo, not here. Copy them first:

```bash
./scripts/sync-assets.sh
python3 -m http.server 8791
```

Then open http://localhost:8791.

## Files

- `index.html` — the home page (its own CSS and JS are inside the file).
- `guide.html`, `faq.html`, `support.html`, `privacy.html` — the other pages.
- `site.css`, `site.js` — shared styles and behaviour: the floating header, the footer, the guide contents, the FAQ search.
- `scripts/layout.py` — writes the shared header and footer into every page. Edit the header or footer there, then run `python3 scripts/layout.py`.
- `assets/` — not in git. The deploy workflow copies `landing/assets` from the private repo `vi-elin/woolly_desk`.
- `.github/workflows/pages.yml` — builds the page with the pictures and publishes it to GitHub Pages.

## Store link

Set `STORE_URL` near the top of the script in `index.html` when the store page exists.
