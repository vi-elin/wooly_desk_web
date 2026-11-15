#!/usr/bin/env python3
"""Write the shared header, footer and <head> boot block into every English page.

Each page has the markers <!--BOOT--> … <!--/BOOT-->, <!--HEADER--> … <!--/HEADER--> and
<!--FOOTER--> … <!--/FOOTER-->. Edit them here, then run:

    python3 scripts/layout.py      # English pages
    python3 scripts/i18n.py        # Ukrainian pages in uk/ (uses the same functions with lang="uk")
"""
import hashlib, pathlib, re

ROOT = pathlib.Path(__file__).resolve().parent.parent
SITE = "https://woollydesk.com"
PAGES = ["index.html", "guide.html", "faq.html", "support.html", "privacy.html"]
LANGS = ["en", "uk"]

T = {
    "en": {
        "sections": {"#watch": "Watch", "#flock": "The flock", "#seasons": "Seasons", "#tidy": "Tidy up",
                     "#village": "Build", "#holidays": "Holidays"},
        "pages": {"index.html": "Home", "guide.html": "Guide", "faq.html": "FAQ", "support.html": "Support"},
        "get": "Get it for Mac", "on_page": "On this page", "pages_label": "Pages", "menu": "Menu", "main": "Main",
        "home_label": "Woolly Desk home", "switch": "УКР", "switch_label": "Українською", "lang": "Language",
        "about": "A cozy, hand-painted sheep farm that lives on your Mac desktop, behind every window.",
        "learn": "Learn", "help": "Help", "legal": "Legal", "shop": "The shop", "settings": "Settings",
        "privacy": "Privacy policy", "copy": "© 2026 Woolly Desk · hand-painted, sheep-approved",
        "pictures": "Every picture on this site comes from the game.",
    },
    "uk": {
        "sections": {"#watch": "Наживо", "#flock": "Отара", "#seasons": "Сезони", "#tidy": "Прибирання",
                     "#village": "Будівлі", "#holidays": "Свята"},
        "pages": {"index.html": "Головна", "guide.html": "Посібник", "faq.html": "Питання", "support.html": "Підтримка"},
        "get": "Отримати для Mac", "on_page": "На цій сторінці", "pages_label": "Сторінки", "menu": "Меню", "main": "Головне меню",
        "home_label": "Woolly Desk, головна", "switch": "EN", "switch_label": "English", "lang": "Мова",
        "about": "Затишна ферма з намальованими вручну вівцями, яка живе на робочому столі вашого Mac, за всіма вікнами.",
        "learn": "Дізнатися", "help": "Допомога", "legal": "Правове", "shop": "Магазин", "settings": "Налаштування",
        "privacy": "Політика конфіденційності", "copy": "© 2026 Woolly Desk · намальовано вручну, схвалено вівцями",
        "pictures": "Усі зображення на сайті взяті з гри.",
    },
}

SECTION_ICONS = {"#watch": "cloud_0", "#flock": "sheep_cream_idle", "#seasons": "decor_tree_autumn",
                 "#tidy": "broom", "#village": "house_pinkCottage_summer", "#holidays": "holiday_christmasTree"}
PAGES_NAV = ["guide.html", "faq.html", "support.html"]
SHEET_ICONS = {"index.html": "sheep_white_happy", "guide.html": "house_barn_summer",
               "faq.html": "sheep_lamb_happy", "support.html": "house_whiteCottage_summer"}

LANG_NAMES = {"en": "English", "uk": "Українська"}
GLOBE = ('<svg class="globe" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/>'
         '<path d="M3 12h18M12 3c2.6 2.6 3.8 5.6 3.8 9s-1.2 6.4-3.8 9c-2.6-2.6-3.8-5.6-3.8-9s1.2-6.4 3.8-9Z" fill="none" stroke="currentColor" stroke-width="2"/></svg>')
CARET = '<svg class="caret" viewBox="0 0 12 8" aria-hidden="true"><path d="M1.5 1.5 6 6l4.5-4.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
CHECK = '<svg class="check" viewBox="0 0 16 12" aria-hidden="true"><path d="M1.5 6.5 6 10.5 14.5 1.5" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>'


def lang_items(page: str, lang: str, cls: str) -> str:
    """The two languages: the current one is marked, the other one links to the same page."""
    out = []
    for code in ("en", "uk"):
        name = LANG_NAMES[code]
        if code == lang:
            out.append(f'<span class="{cls} on" role="menuitemradio" aria-checked="true" lang="{code}">{CHECK}{name}</span>')
        else:
            out.append(f'<a class="{cls}" role="menuitemradio" aria-checked="false" href="{other(page, lang)}" hreflang="{code}" lang="{code}">{CHECK}{name}</a>')
    return "".join(out)


CLOUD = ('<svg viewBox="0 0 30 24" aria-hidden="true"><circle cx="9" cy="8" r="4.6" fill="#F6CF6A" stroke="#3A2F2A" stroke-width="1.8"/>'
         '<path d="M8 20.5h15a4.3 4.3 0 0 0 .4-8.6 6 6 0 0 0-11.5 1.2A3.7 3.7 0 0 0 8 20.5Z" fill="#FBF8F1" stroke="#3A2F2A" stroke-width="1.8"/></svg>')


def url(page: str, lang: str) -> str:
    """Public address of a page in a language."""
    path = "" if page == "index.html" else page
    return f"{SITE}/{path}" if lang == "en" else f"{SITE}/uk/{path}"


def other(page: str, lang: str) -> str:
    """Relative link from a page to the same page in the other language."""
    return f"uk/{page}" if lang == "en" else f"../{page}"


def header(page: str, lang: str = "en") -> str:
    t = T[lang]
    home = page == "index.html"
    links = []
    if home:
        links += [f'<a href="{h}">{n}</a>' for h, n in t["sections"].items()]
    else:
        links.append(f'<a href="index.html">{t["pages"]["index.html"]}</a>')
    links.append('<span class="sep" aria-hidden="true"></span>')
    for h in PAGES_NAV:
        cur = ' aria-current="page"' if h == page else ""
        links.append(f'<a href="{h}"{cur}>{t["pages"][h]}</a>')

    sheet = []
    if home:
        sheet.append(f'<span class="sheet-label">{t["on_page"]}</span>')
        sheet += [f'<a href="{h}"><img src="assets/{SECTION_ICONS[h]}.png" alt="">{n}</a>' for h, n in t["sections"].items()]
        sheet.append(f'<span class="sheet-label">{t["pages_label"]}</span>')
    else:
        sheet.append(f'<span class="sheet-label">{t["pages_label"]}</span>')
        sheet.append(f'<a href="index.html"><img src="assets/{SHEET_ICONS["index.html"]}.png" alt="">{t["pages"]["index.html"]}</a>')
    for h in PAGES_NAV:
        cur = ' aria-current="page"' if h == page else ""
        sheet.append(f'<a href="{h}"{cur}><img src="assets/{SHEET_ICONS[h]}.png" alt="">{t["pages"][h]}</a>')
    to = "uk" if lang == "en" else "en"
    switch = (f'<div class="lang-menu"><button class="lang-switch" type="button" aria-haspopup="true" aria-expanded="false" '
              f'aria-controls="langList" title="{t["lang"]}: {LANG_NAMES[lang]}">{GLOBE}<span class="lang-word">{t["lang"]}</span>{CARET}</button>'
              f'<div class="lang-list" id="langList" role="menu" aria-label="{t["lang"]}">{lang_items(page, lang, "lang-item")}</div></div>')
    sheet_switch = (f'<div class="sheet-langs" role="group" aria-label="{t["lang"]}"><span class="sheet-label">{GLOBE}{t["lang"]}</span>'
                    f'<div class="lang-seg">{lang_items(page, lang, "seg-item")}</div></div>')
    get = "#get" if home else "index.html#get"
    brand = "#top" if home else "index.html"
    return f"""<!--HEADER-->
<header class="topbar" id="topbar">
  <div class="bar-inner">
    <a class="brand" href="{brand}" aria-label="{t["home_label"]}"><img src="assets/sheep_white_happy.png" alt="">Woolly Desk</a>
    <nav class="nav-links" aria-label="{t["main"]}">
      <span class="nav-blob" aria-hidden="true"></span>
      {"".join(links)}
    </nav>
    {switch}
    <a class="btn bar-cta" href="{get}" data-umami-event="get-mac-header">{t["get"]}</a>
    <button class="menu-btn" type="button" aria-expanded="false" aria-controls="menuSheet" aria-label="{t["menu"]}">{CLOUD}</button>
    <div class="trail" aria-hidden="true"><span class="trail-sheep"><img src="assets/sheep_white_graze0.png" alt=""></span></div>
  </div>
  <nav class="menu-sheet" id="menuSheet" aria-label="{t["menu"]}">
    {"".join(sheet)}
    {sheet_switch}
    <a class="btn sheet-cta" href="{get}" data-umami-event="get-mac-menu">{t["get"]}</a>
  </nav>
</header>
<!--/HEADER-->"""


def footer(page: str, lang: str = "en") -> str:
    t = T[lang]
    hill = "" if page == "index.html" else " hill"
    return f"""<!--FOOTER-->
<footer class="site-foot{hill}">
  <div class="foot-stars" aria-hidden="true"></div>
  <div class="wrap" style="position:relative">
    <div class="foot-grid">
      <div class="foot-brand">
        <a class="name" href="index.html"><img src="assets/sheep_white_sleep.png" alt="">Woolly Desk</a>
        <p>{t["about"]}</p>
      </div>
      <div>
        <h4>{t["learn"]}</h4>
        <ul><li><a href="guide.html">{t["pages"]["guide.html"]}</a></li><li><a href="guide.html#shop">{t["shop"]}</a></li><li><a href="guide.html#settings">{t["settings"]}</a></li><li><a href="faq.html">{t["pages"]["faq.html"]}</a></li></ul>
      </div>
      <div>
        <h4>{t["help"]}</h4>
        <ul><li><a href="support.html">{t["pages"]["support.html"]}</a></li><li><a href="mailto:vielindevelopment@gmail.com">vielindevelopment@gmail.com</a></li></ul>
      </div>
      <div>
        <h4>{t["legal"]}</h4>
        <ul><li><a href="privacy.html">{t["privacy"]}</a></li><li><a class="foot-lang" href="{other(page, lang)}" hreflang="{"uk" if lang == "en" else "en"}">{t["switch_label"]}</a></li></ul>
      </div>
    </div>
    <div class="foot-base"><span>{t["copy"]}</span><span>{t["pictures"]}</span></div>
  </div>
</footer>
<!--/FOOTER-->"""


def boot(page: str, lang: str = "en") -> str:
    return f"""<!--BOOT-->
<link rel="canonical" href="{url(page, lang)}">
<link rel="alternate" hreflang="en" href="{url(page, "en")}">
<link rel="alternate" hreflang="uk" href="{url(page, "uk")}">
<link rel="alternate" hreflang="x-default" href="{url(page, "en")}">
<script>try{{var q=new URLSearchParams(location.search);if(q.has("notrack"))localStorage.setItem("umami.disabled","1");else if(q.has("track"))localStorage.removeItem("umami.disabled")}}catch(e){{}}</script>
<script defer src="https://cloud.umami.is/script.js" data-website-id="c4cd17dc-7bdd-45ed-8f7d-eefc8e028185" data-domains="woollydesk.com"></script>
<script>try{{if(sessionStorage.getItem("wd-curtain")&&!matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.classList.add("wd-enter")}}catch(e){{}}</script>
<!--/BOOT-->"""


def fill(text: str, name: str, block: str) -> str:
    full = re.compile(rf"<!--{name}-->.*?<!--/{name}-->", re.S)
    if full.search(text):
        return full.sub(lambda _: block, text, count=1)
    assert f"<!--{name}-->" in text, f"missing <!--{name}--> marker"
    return text.replace(f"<!--{name}-->", block, 1)


def version(name: str) -> str:
    """Short hash of a shared file. A new hash after each change makes browsers load the new file at once."""
    return hashlib.sha256((ROOT / name).read_bytes()).hexdigest()[:10]


def stamp(text: str) -> str:
    """Add ?v=<hash> to the links to site.css and site.js."""
    for name, attr in (("site.css", "href"), ("site.js", "src")):
        text = re.sub(rf'{attr}="((?:\.\./)?){re.escape(name)}(?:\?v=\w+)?"', rf'{attr}="\g<1>{name}?v={version(name)}"', text)
    return text


def apply(text: str, page: str, lang: str = "en") -> str:
    text = stamp(text)
    text = fill(text, "BOOT", boot(page, lang))
    text = fill(text, "HEADER", header(page, lang))
    return fill(text, "FOOTER", footer(page, lang))


if __name__ == "__main__":
    for p in PAGES:
        path = ROOT / p
        path.write_text(apply(path.read_text(), p, "en"))
        print("updated", p)
