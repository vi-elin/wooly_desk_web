#!/usr/bin/env python3
"""Write the shared header and footer into every page.

Each page has the markers <!--HEADER--> … <!--/HEADER--> and <!--FOOTER--> … <!--/FOOTER-->
(or only the opening marker the first time). Edit the header or footer here, then run:

    python3 scripts/layout.py
"""
import pathlib, re

ROOT = pathlib.Path(__file__).resolve().parent.parent
PAGES = ["index.html", "guide.html", "faq.html", "support.html", "privacy.html"]

HOME_SECTIONS = [("#watch", "Watch"), ("#flock", "The flock"), ("#seasons", "Seasons"),
                 ("#tidy", "Tidy up"), ("#village", "Build")]
SECTION_ICONS = {"#watch": "cloud_0", "#flock": "sheep_cream_idle", "#seasons": "decor_tree_autumn",
                 "#tidy": "broom", "#village": "house_pinkCottage_summer"}
PAGES_NAV = [("guide.html", "Guide"), ("faq.html", "FAQ"), ("support.html", "Support")]
SHEET_ICONS = {"index.html": "sheep_white_happy", "guide.html": "house_barn_summer",
               "faq.html": "sheep_lamb_happy", "support.html": "house_whiteCottage_summer"}

CLOUD = ('<svg viewBox="0 0 30 24" aria-hidden="true"><circle cx="9" cy="8" r="4.6" fill="#F6CF6A" stroke="#3A2F2A" stroke-width="1.8"/>'
         '<path d="M8 20.5h15a4.3 4.3 0 0 0 .4-8.6 6 6 0 0 0-11.5 1.2A3.7 3.7 0 0 0 8 20.5Z" fill="#FBF8F1" stroke="#3A2F2A" stroke-width="1.8"/></svg>')


def header(page: str) -> str:
    home = page == "index.html"
    links = []
    if home:
        links += [f'<a href="{h}">{t}</a>' for h, t in HOME_SECTIONS]
    else:
        links.append('<a href="index.html">Home</a>')
    links.append('<span class="sep" aria-hidden="true"></span>')
    for h, t in PAGES_NAV:
        cur = ' aria-current="page"' if h == page else ""
        links.append(f'<a href="{h}"{cur}>{t}</a>')

    sheet = []
    if home:
        sheet += [f'<a href="{h}"><img src="assets/{SECTION_ICONS[h]}.png" alt="">{t}</a>' for h, t in HOME_SECTIONS]
    else:
        sheet.append(f'<a href="index.html"><img src="assets/{SHEET_ICONS["index.html"]}.png" alt="">Home</a>')
    for h, t in PAGES_NAV:
        cur = ' aria-current="page"' if h == page else ""
        sheet.append(f'<a href="{h}"{cur}><img src="assets/{SHEET_ICONS[h]}.png" alt="">{t}</a>')
    get = "#get" if home else "index.html#get"
    brand = "#top" if home else "index.html"
    return f"""<!--HEADER-->
<header class="topbar" id="topbar">
  <div class="bar-inner">
    <a class="brand" href="{brand}" aria-label="Woolly Desk home"><img src="assets/sheep_white_happy.png" alt="">Woolly Desk</a>
    <nav class="nav-links" aria-label="Main">
      <span class="nav-blob" aria-hidden="true"></span>
      {"".join(links)}
    </nav>
    <a class="btn bar-cta" href="{get}">Get it for Mac</a>
    <button class="menu-btn" type="button" aria-expanded="false" aria-controls="menuSheet" aria-label="Menu">{CLOUD}</button>
    <div class="trail" aria-hidden="true"><span class="trail-sheep"><img src="assets/sheep_white_graze0.png" alt=""></span></div>
  </div>
  <nav class="menu-sheet" id="menuSheet" aria-label="Menu">
    {"".join(sheet)}
    <a class="btn" href="{get}">Get it for Mac</a>
  </nav>
</header>
<!--/HEADER-->"""


def footer(page: str) -> str:
    hill = "" if page == "index.html" else " hill"
    return f"""<!--FOOTER-->
<footer class="site-foot{hill}">
  <div class="foot-stars" aria-hidden="true"></div>
  <div class="wrap" style="position:relative">
    <div class="foot-grid">
      <div class="foot-brand">
        <a class="name" href="index.html"><img src="assets/sheep_white_sleep.png" alt="">Woolly Desk</a>
        <p>A cozy, hand-painted sheep farm that lives on your Mac desktop, behind every window.</p>
      </div>
      <div>
        <h4>Learn</h4>
        <ul><li><a href="guide.html">Guide</a></li><li><a href="guide.html#shop">Shop and prices</a></li><li><a href="guide.html#settings">Settings</a></li><li><a href="faq.html">FAQ</a></li></ul>
      </div>
      <div>
        <h4>Help</h4>
        <ul><li><a href="support.html">Support</a></li><li><a href="mailto:vielindevelopment@gmail.com">vielindevelopment@gmail.com</a></li></ul>
      </div>
      <div>
        <h4>Legal</h4>
        <ul><li><a href="privacy.html">Privacy policy</a></li></ul>
      </div>
    </div>
    <div class="foot-base"><span>© 2026 Woolly Desk · hand-painted, sheep-approved</span><span>Every picture on this site comes from the game.</span></div>
  </div>
</footer>
<!--/FOOTER-->"""


def fill(text: str, name: str, block: str) -> str:
    full = re.compile(rf"<!--{name}-->.*?<!--/{name}-->", re.S)
    if full.search(text):
        return full.sub(lambda _: block, text, count=1)
    assert f"<!--{name}-->" in text, f"missing <!--{name}--> marker"
    return text.replace(f"<!--{name}-->", block, 1)


for p in PAGES:
    path = ROOT / p
    t = path.read_text()
    t = fill(t, "HEADER", header(p))
    t = fill(t, "FOOTER", footer(p))
    path.write_text(t)
    print("updated", p)
