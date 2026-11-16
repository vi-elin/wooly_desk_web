#!/usr/bin/env python3
"""Build the Ukrainian site in uk/ from the English pages and i18n/uk.py.

    python3 scripts/layout.py    # first, if the header or footer changed
    python3 scripts/i18n.py      # writes uk/*.html

How it works
- The English page is the only source of layout and code. The script copies it, puts in the Ukrainian
  <head> block, header and footer (scripts/layout.py with lang="uk"), and then replaces every English phrase
  listed in i18n/uk.py with its Ukrainian translation.
- It stops with an error when an English phrase from i18n/uk.py is no longer on the page (the English text
  changed: update the translation), and it lists English words that are still on a Ukrainian page
  (new English text without a translation).
- Long text pages are translated as a whole: i18n/uk/<page> holds the Ukrainian page body (everything between
  <!--/HEADER--> and <!--FOOTER-->). Its first line stores a fingerprint of the English body it was translated
  from. When the English body changes, the script says so; update the translation, then run
      python3 scripts/i18n.py --stamp guide.html
  to save the new fingerprint.
- Links to pictures, site.css and site.js get "../" because the Ukrainian pages live one folder deeper.
"""
import hashlib, importlib.util, pathlib, re, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "scripts"))
import layout  # noqa: E402

spec = importlib.util.spec_from_file_location("uk", ROOT / "i18n" / "uk.py")
uk = importlib.util.module_from_spec(spec); spec.loader.exec_module(uk)

# Words that may stay in English on Ukrainian pages: names, Apple terms, and the app's own (English) interface.
ALLOWED = set(uk.KEEP_ENGLISH)


def visible_english(html: str) -> list[str]:
    """English words a visitor could read on the page (text, alt, aria-label, title, placeholder)."""
    html = re.sub(r'<meta name="viewport"[^>]*>', " ", html)
    attrs = " ".join(m.group(2) for m in re.finditer(r'\b(alt|aria-label|title|placeholder)="([^"]*)"', html))
    # the app's own English names: bold UI names, and the English shop name that starts each guide description
    html = re.sub(r"<b>.*?</b>", " ", html, flags=re.S)
    html = re.sub(r"<small>[A-Z][A-Za-z' -]+\. ", "<small>", html)
    html = re.sub(r"[\w.+-]+@[\w.-]+", " ", html)
    html = re.sub(r'<a [^>]*hreflang="en"[^>]*>.*?</a>', " ", html, flags=re.S)   # the "English" switch
    body = re.sub(r"<script\b.*?</script>|<style\b.*?</style>|<svg\b.*?</svg>|<code>.*?</code>|<kbd>.*?</kbd>", " ", html, flags=re.S)
    body = re.sub(r"<[^>]+>", " ", body)
    words = re.findall(r"[A-Za-z][A-Za-z'’-]{2,}", body + " " + attrs)
    return sorted({w for w in words if w not in ALLOWED and w.lower() not in ALLOWED})


BODY = re.compile(r"(<!--/HEADER-->)(.*?)(<!--FOOTER-->)", re.S)
STAMP = re.compile(r"^<!-- en-sha256: ([0-9a-f]{64}) -->\n")


def en_body(html: str) -> str:
    return BODY.search(html).group(2)


def fingerprint(text: str) -> str:
    return hashlib.sha256(text.encode()).hexdigest()


def sources(page: str) -> tuple[pathlib.Path, pathlib.Path]:
    """The English page and the file with its Ukrainian body. The private guide keeps both in the game repo."""
    if layout.is_private(page):
        return layout.PRIVATE / page, layout.PRIVATE / "uk-body.html"
    return ROOT / page, ROOT / "i18n" / "uk" / page


def build(page: str) -> tuple[str, list[str], list[str]]:
    src, body_file = sources(page)
    en = src.read_text()
    t = layout.apply(en, page, "uk")
    stale = []
    if body_file.exists():
        tr = body_file.read_text()
        m = STAMP.match(tr)
        if not m or m.group(1) != fingerprint(en_body(en)):
            stale.append(f"the English body of {page} changed since it was translated ({body_file.name})")
        uk_body = STAMP.sub("", tr, count=1)
        t = BODY.sub(lambda mm: mm.group(1) + uk_body + mm.group(3), t, count=1)
    assert '<html lang="en">' in t, f"{page}: missing <html lang=\"en\">"
    t = t.replace('<html lang="en">', '<html lang="uk">', 1)
    pairs = list(uk.COMMON) + list(uk.PAGES.get("private" if layout.is_private(page) else page, []))
    missing = list(stale)
    for src, dst in sorted(pairs, key=lambda p: -len(p[0])):
        n = t.count(src)
        if n == 0:
            if (src, dst) not in uk.COMMON:
                missing.append(src)
            continue
        t = t.replace(src, dst)
    # the Ukrainian pages are one folder deeper
    t = (t.replace('href="site.css', 'href="../site.css').replace('src="site.js', 'src="../site.js')
          .replace('src="assets/', 'src="../assets/').replace('srcset="assets/', 'srcset="../assets/').replace('data-src-m="assets/', 'data-src-m="../assets/').replace('url("assets/', 'url("../assets/')
          .replace("`assets/${n}.png`", "`../assets/${n}.png`"))
    assert 'src="assets/' not in t and 'url("assets/' not in t, f"{page}: a picture link was not moved"
    return t, missing, visible_english(t)


def stamp(page: str) -> None:
    """--stamp private stamps the private farmer's guide."""
    if page == "private":
        page = layout.private_pages()[0]
    src, f = sources(page)
    tr = STAMP.sub("", f.read_text(), count=1)
    f.write_text(f"<!-- en-sha256: {fingerprint(en_body(src.read_text()))} -->\n" + tr)
    print(f"stamped {f.name} for {page}")


def main() -> int:
    if len(sys.argv) > 2 and sys.argv[1] == "--stamp":
        for page in sys.argv[2:]:
            stamp(page)
        return 0
    out = ROOT / "uk"
    out.mkdir(exist_ok=True)
    problems = 0
    for page in layout.PAGES:
        t, missing, left = build(page)
        (out / page).write_text(t)
        print(f"uk/{page}: written")
        report(page, missing, left)
        problems += len(missing)
    for page in layout.private_pages():
        t, missing, left = build(page)
        (layout.PRIVATE / "uk").mkdir(exist_ok=True)
        (layout.PRIVATE / "uk" / page).write_text(t)
        print(f"uk/{page} (private): written")
        report(page, missing, left)
        problems += len(missing)
    if problems:
        print(f"\n{problems} translation(s) need an update in i18n/uk.py")
    return 1 if problems else 0


def report(page: str, missing: list[str], left: list[str]) -> None:
    for m in missing:
        print(f"  ✗ {m[:110]}" if m.startswith("the English body") else f"  ✗ English text not found (it changed?): {m[:90]!r}")
    if left:
        print(f"  ! English words left on the page: {', '.join(left)}")


if __name__ == "__main__":
    sys.exit(main())
