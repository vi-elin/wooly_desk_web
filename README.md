# WoollyDesk — website

The landing page for **WoollyDesk**, a cozy sheep farm that lives on your Mac desktop.

## Run locally

The pictures live in the private game repo, not here. Copy them first:

```bash
./scripts/sync-assets.sh
python3 -m http.server 8791
```

Then open http://localhost:8791.

## Files

- `index.html` — the home page (its own CSS and JS are inside the file).
- `guide.html`, `questions.html`, `support.html`, `privacy.html` — the other pages.
- `site.css`, `site.js` — shared styles and behaviour: the floating header, the footer, the guide contents, the FAQ search.
- `sound.js`, `sounds/` — farm sounds on the home page (rain, crickets, wind, birds, sheep) and the sound switch in the header. The sheep voice is a CC0 recording (`sounds/CREDITS.txt`); the other sounds are made in the browser, with the same formulas as the game.
- `scripts/layout.py` — writes the shared header and footer into every page. Edit the header or footer there, then run `python3 scripts/layout.py`.
- `brand/` — the logo: `logo.svg` (header and footer), `favicon.svg`, `favicon-32.png` and `apple-touch-icon.png`. The deploy copies this folder as it is.
- `assets/` — not in git. The deploy workflow copies `landing/assets` from the private repo `vi-elin/woolly_desk`.
- `.github/workflows/pages.yml` — builds the page with the pictures and publishes it to GitHub Pages.

## Store link

Before the release, the Mac buttons (`data-mac-wait`) open the Mac waitlist dialog (`site.js`, `worker/`).
On release day, change them back to store links: remove `data-mac-wait`, change the button text in `index.html`, `scripts/layout.py` and `i18n/uk.py`, and set `STORE_URL` near the top of the script in `index.html`.

## Ukrainian version

The Ukrainian site is in `uk/` (https://woollydesk.com/uk/). Do not edit `uk/*.html` by hand: it is built.

- `i18n/uk.py` — phrase pairs (English → Ukrainian) for the home page and the page titles.
- `i18n/uk/*.html` — whole Ukrainian bodies of the guide, FAQ, support and privacy pages.
- `scripts/i18n.py` — builds `uk/` from the English pages and the translations.

After you change an English page:

```bash
python3 scripts/layout.py   # if the header or footer changed
python3 scripts/i18n.py     # rebuilds uk/ and lists what needs a new translation
```

If the script says that the English body of a page changed, update `i18n/uk/<page>`, then save the new fingerprint:

```bash
python3 scripts/i18n.py --stamp guide.html
```

The app's own menu, button and setting names stay in English on the Ukrainian pages, because the app is in English.
