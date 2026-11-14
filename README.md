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

- `index.html` — the whole page (HTML, CSS and JS in one file).
- `assets/` — not in git. The deploy workflow copies `landing/assets` from the private repo `vi-elin/woolly_desk`.
- `.github/workflows/pages.yml` — builds the page with the pictures and publishes it to GitHub Pages.

## Store link

Set `STORE_URL` near the top of the script in `index.html` when the store page exists.
