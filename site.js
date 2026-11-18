// WoollyDesk — shared behaviour for every page.
(() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const UK = document.documentElement.lang === "uk";
  // pictures live next to this script, also for the pages in uk/
  const AS = new URL("assets/", (document.currentScript || {}).src || location.href).href;
  // texts the script writes into the page, in the page's language
  const L = UK ? {
    top: "Нагору",
    names: { "index": "головна", "": "головна", "guide": "посібник", "questions": "питання", "faq": "питання", "support": "підтримка", "privacy": "конфіденційність" },
    langName: { uk: "українська", en: "English" },
    off: n => `вирушаємо: ${n}…`, hello: n => `вітаємо: ${n}!`,
  } : {
    top: "Back to the top",
    names: { "index": "home", "": "home", "guide": "the guide", "questions": "the FAQ", "faq": "the FAQ", "support": "support", "privacy": "privacy" },
    langName: { uk: "українська", en: "English" },
    off: n => `off to ${n}…`, hello: n => `welcome to ${n}!`,
  };
  const bar = document.querySelector(".topbar");

  /* ── header: turns into a floating menu bar after a little scroll ── */
  if (bar) {
    const inner = bar.querySelector(".bar-inner");
    const sheep = bar.querySelector(".trail-sheep");
    const sheepImg = sheep && sheep.querySelector("img");
    const frames = ["walk0", "walk1", "walk2", "walk3"].map(f => {
      const i = new Image(); i.src = `${AS}sheep_white_${f}.png`; return i.src;
    });
    let lastY = scrollY, frame = 0, stepAcc = 0, idleTimer = 0, travel = 0, hideTimer = 0;
    /* The header is a normal page header: it scrolls away with the page.
       Only a real scroll up in the middle of the page brings it back as a floating bar ("pinned");
       a scroll down sends it away again. Near the bottom of the page it never comes
       (a trackpad bounce at the end is a small scroll up). */
    const busy = () => bar.querySelector(".menu-sheet.open, .lang-list.open, :focus-visible");   // a menu is open or the keyboard is in the header
    const pin = () => {
      clearTimeout(hideTimer);
      bar.classList.remove("away");
      bar.classList.add("pinned");
    };
    const unpin = () => {
      if (!bar.classList.contains("pinned") || bar.classList.contains("away")) return;
      bar.classList.add("away");
      hideTimer = setTimeout(() => bar.classList.remove("pinned", "away"), reduce ? 0 : 360);
    };
    const onScroll = () => {
      const y = scrollY;
      const max = document.documentElement.scrollHeight - innerHeight;
      const d = y - lastY;
      travel = Math.sign(d) === Math.sign(travel) ? travel + d : d;
      if (y <= 0) { clearTimeout(hideTimer); bar.classList.remove("pinned", "away"); }
      else if (busy()) { /* leave it as it is while a menu is open */ }
      else if (travel < -40 && y > 120 && y < max - 80) pin();
      else if (travel > 12) unpin();
      bar.classList.toggle("scrolled", y > 30 && bar.classList.contains("pinned"));
      const p = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
      if (sheep) {
        sheep.style.setProperty("--p", p.toFixed(4));
        const dy = y - lastY;
        if (dy !== 0) {
          sheep.classList.toggle("left", dy < 0);
          stepAcc += Math.abs(dy);
          if (stepAcc > 26 && !reduce) { stepAcc = 0; frame = (frame + 1) % 4; sheepImg.src = frames[frame]; }
          clearTimeout(idleTimer);
          idleTimer = setTimeout(() => { sheepImg.src = p > .995 ? AS + "sheep_white_happy.png" : AS + "sheep_white_graze0.png"; }, 260);
        }
      }
      lastY = y;
    };
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    if (sheep) {
      sheep.style.pointerEvents = "auto"; sheep.style.cursor = "pointer";
      sheep.title = L.top;
      sheep.addEventListener("click", () => scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }));
    }

    /* the lamp blob slides to the active link */
    const links = [...bar.querySelectorAll(".nav-links a")];
    const blob = bar.querySelector(".nav-blob");
    const nav = bar.querySelector(".nav-links");
    const place = a => {
      if (!blob) return;
      if (!a) { blob.classList.remove("on"); return; }
      const nr = nav.getBoundingClientRect(), r = a.getBoundingClientRect();
      blob.style.setProperty("--x", (r.left - nr.left) + "px");
      blob.style.width = r.width + "px";
      blob.classList.add("on");
    };
    let current = links.find(a => a.getAttribute("aria-current") === "page") || null;
    const sectionLinks = links.filter(a => a.hash && a.getAttribute("href").startsWith("#"));
    if (sectionLinks.length) {
      const map = new Map(sectionLinks.map(a => [document.querySelector(a.hash), a]).filter(([s]) => s));
      const seen = new Map();
      const io = new IntersectionObserver(es => {
        es.forEach(e => seen.set(e.target, e.isIntersecting ? e.intersectionRatio : 0));
        let best = null, bestR = 0;
        seen.forEach((r, s) => { if (r > bestR) { bestR = r; best = s; } });
        current = best ? map.get(best) : null;
        place(current);
      }, { rootMargin: "-35% 0px -50% 0px", threshold: [0, .01, .25, .5, 1] });
      map.forEach((_, s) => io.observe(s));
    }
    links.forEach(a => {
      a.addEventListener("mouseenter", () => place(a));
      a.addEventListener("focus", () => place(a));
    });
    nav && nav.addEventListener("mouseleave", () => place(current));
    addEventListener("resize", () => place(current));
    document.fonts && document.fonts.ready.then(() => place(current));
    place(current);

    /* menu sheet on small screens */
    const btn = bar.querySelector(".menu-btn");
    const sheet = bar.querySelector(".menu-sheet");
    if (btn && sheet) {
      [...sheet.querySelectorAll("a")].forEach((a, i) => a.style.setProperty("--i", i));
      const set = open => {
        btn.setAttribute("aria-expanded", open);
        sheet.classList.toggle("open", open);
      };
      btn.addEventListener("click", e => { e.stopPropagation(); set(btn.getAttribute("aria-expanded") !== "true"); });
      sheet.addEventListener("click", e => { if (e.target.closest("a")) set(false); });
      document.addEventListener("click", e => { if (!sheet.contains(e.target)) set(false); });
      document.addEventListener("keydown", e => { if (e.key === "Escape") set(false); });
    }
    inner && inner.addEventListener("dblclick", e => { if (!e.target.closest("a, button")) scrollTo({ top: 0, behavior: "smooth" }); });
  }

  /* ── footer stars ── */
  document.querySelectorAll(".foot-stars").forEach(box => {
    for (let i = 0; i < 40; i++) {
      const s = document.createElement("i");
      s.style.left = Math.random() * 100 + "%";
      s.style.top = Math.random() * 70 + "%";
      s.style.animationDelay = (-Math.random() * 4) + "s";
      box.appendChild(s);
    }
  });

  /* ── reveal on scroll (inner pages; the home page has its own) ── */
  const rev = document.querySelectorAll("[data-reveal]");
  if (rev.length) {
    if (reduce || !("IntersectionObserver" in window)) rev.forEach(e => e.classList.add("in"));
    else {
      rev.forEach(e => e.classList.add("reveal"));
      const io = new IntersectionObserver(es => es.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      }), { rootMargin: "0px 0px -8% 0px" });
      rev.forEach(e => io.observe(e));
    }
  }

  /* ── guide: contents follow the reading position, a sheep hops along ── */
  const toc = document.querySelector(".toc");
  if (toc) {
    const tlinks = [...toc.querySelectorAll("a")];
    const tsheep = toc.querySelector(".toc-sheep");
    const secs = tlinks.map(a => document.querySelector(a.hash)).filter(Boolean);
    const mark = () => {
      const line = innerHeight * .3;
      let idx = 0;
      secs.forEach((s, i) => { if (s.getBoundingClientRect().top < line) idx = i; });
      if (innerHeight + scrollY >= document.documentElement.scrollHeight - 4) idx = secs.length - 1;
      tlinks.forEach((a, i) => a.classList.toggle("on", i === idx));
      const a = tlinks[idx];
      if (tsheep && a) {
        const y = a.offsetTop + a.offsetHeight / 2 - 13;
        if (tsheep.dataset.y !== String(y)) {
          tsheep.dataset.y = y;
          tsheep.style.setProperty("--y", y + "px");
          const img = tsheep.querySelector("img");
          if (!reduce) { img.src = AS + "sheep_white_jump.png"; clearTimeout(tsheep._t); tsheep._t = setTimeout(() => img.src = AS + "sheep_white_idle.png", 420); }
        }
      }
    };
    addEventListener("scroll", mark, { passive: true });
    addEventListener("resize", mark);
    mark();
  }
  /* ── guide on smaller screens: a rail of section icons; the name shows next to it when the section changes ── */
  if (toc) {
    const items = [...toc.querySelectorAll("a")].map(a => {
      const sec = document.querySelector(a.hash);
      const icon = sec && sec.querySelector("h2 img");
      return sec && icon ? { a, sec, icon: icon.getAttribute("src"), name: a.textContent.trim() } : null;
    }).filter(Boolean);
    const rail = document.createElement("nav");
    rail.className = "toc-rail";
    rail.setAttribute("aria-label", toc.getAttribute("aria-label") || "Contents");
    rail.innerHTML = items.map(it => `<a href="#${it.sec.id}" title="${it.name}" aria-label="${it.name}"><img src="${it.icon}" alt=""></a>`).join("");
    const tip = document.createElement("div");
    tip.className = "rail-tip"; tip.setAttribute("aria-hidden", "true");
    document.body.append(rail, tip);
    const links = [...rail.querySelectorAll("a")];
    const article = document.querySelector(".doc-layout article");
    let current = -1, tipTimer = 0;
    const showTip = i => {
      const r = links[i].getBoundingClientRect();
      tip.textContent = items[i].name;
      tip.style.top = (r.top + r.height / 2) + "px";
      tip.classList.add("show");
      clearTimeout(tipTimer); tipTimer = setTimeout(() => tip.classList.remove("show"), 1300);
    };
    const update = () => {
      // the rail shows while the reader is inside the guide text
      const ar = article.getBoundingClientRect();
      const inside = ar.top < innerHeight * .35 && ar.bottom > innerHeight * .5;
      rail.classList.toggle("show", inside);
      if (!inside) { tip.classList.remove("show"); return; }
      const line = innerHeight * .3;
      let idx = 0;
      items.forEach((it, i) => { if (it.sec.getBoundingClientRect().top < line) idx = i; });
      if (innerHeight + scrollY >= document.documentElement.scrollHeight - 4) idx = items.length - 1;
      if (idx !== current) {
        links.forEach((l, i) => { l.classList.toggle("on", i === idx); if (i === idx) l.setAttribute("aria-current", "true"); else l.removeAttribute("aria-current"); });
        if (current !== -1 && getComputedStyle(rail).display !== "none") showTip(idx);
        current = idx;
        // keep the active icon visible inside the rail (only the rail scrolls, never the page)
        const l = links[idx];
        if (l.offsetTop < rail.scrollTop) rail.scrollTop = l.offsetTop - 5;
        else if (l.offsetTop + l.offsetHeight > rail.scrollTop + rail.clientHeight) rail.scrollTop = l.offsetTop + l.offsetHeight - rail.clientHeight + 5;
      }
    };
    links.forEach((l, i) => {
      l.addEventListener("pointerenter", () => showTip(i));
      l.addEventListener("focus", () => showTip(i));
    });
    addEventListener("scroll", update, { passive: true });
    addEventListener("resize", update);
    update();
  }
  const jump = document.querySelector(".toc-jump select");
  jump && jump.addEventListener("change", () => {
    const el = document.querySelector(jump.value);
    if (el) el.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  });

  /* ── links inside the page scroll there, but the address stays clean, so a reload does not jump back to #get ── */
  document.addEventListener("click", e => {
    const a = e.target.closest("a[href*='#']");
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin || url.pathname !== location.pathname || !url.hash) return;
    const el = document.getElementById(decodeURIComponent(url.hash.slice(1)));
    if (!el) return;
    e.preventDefault();
    if (el.tagName === "DETAILS") el.open = true;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
    if (location.hash) history.replaceState(null, "", location.pathname + location.search);
  });
  /* the section at the top of the screen now (a language switch opens the same section) */
  function currentSection() {
    let id = "";
    for (const s of document.querySelectorAll("main section[id], main .doc-sec[id]")) {
      if (s.getBoundingClientRect().top <= 140) id = s.id; else break;
    }
    return scrollY < 200 ? "" : id;
  }

  /* ── header: use the cloud menu when the links do not fit in one row ── */
  {
    const bar = document.querySelector(".topbar"), inner = bar && bar.querySelector(".bar-inner");
    const nav = inner && inner.querySelector(".nav-links");
    if (nav) {
      const px = v => parseFloat(getComputedStyle(document.documentElement).getPropertyValue(v)) || 1e9;
      // measure against the narrower header (after scrolling), so the menu does not change while you scroll
      const fits = () => {
        const ir = inner.getBoundingClientRect(), cs = getComputedStyle(inner);
        const shown = [...inner.children].filter(k => !k.classList.contains("trail") && getComputedStyle(k).display !== "none");
        // the items' own widths (an auto margin only fills the free space, so it does not count)
        const need = shown.reduce((sum, k) => sum + k.getBoundingClientRect().width, 0) + parseFloat(cs.columnGap || 0) * (shown.length - 1)
          + parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight) + parseFloat(cs.borderLeftWidth) + parseFloat(cs.borderRightWidth);
        return need <= Math.min(ir.width, px("--bar-max-s")) + 0.5 && nav.scrollWidth <= nav.clientWidth + 1;
      };
      const fit = () => {
        bar.classList.remove("tight", "squeeze");
        if (getComputedStyle(nav).display === "none") return;   // a media query already shows the cloud menu
        if (fits()) return;
        bar.classList.add("tight");
        if (fits()) return;
        bar.classList.add("squeeze");
      };
      let raf = 0;
      const later = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(fit); };
      fit();
      addEventListener("resize", later);
      if (document.fonts) document.fonts.ready.then(fit);
      if ("ResizeObserver" in window) new ResizeObserver(later).observe(inner);
    }
  }

  /* ── language menu ── */
  document.querySelectorAll(".lang-menu").forEach(menu => {
    const btn = menu.querySelector(".lang-switch"), list = menu.querySelector(".lang-list");
    const set = open => {
      btn.setAttribute("aria-expanded", open);
      list.classList.toggle("open", open);
      if (open) (list.querySelector("a") || list.firstElementChild).focus({ preventScroll: true });
    };
    btn.addEventListener("click", e => {
      e.stopPropagation();
      const open = btn.getAttribute("aria-expanded") !== "true";
      const cloud = document.querySelector(".menu-btn[aria-expanded='true']");
      if (open && cloud) cloud.click();   // one menu at a time
      set(open);
    });
    const cloudBtn = document.querySelector(".menu-btn");
    cloudBtn && cloudBtn.addEventListener("click", () => set(false));
    list.querySelector(".on").addEventListener("click", () => { set(false); btn.focus(); });
    document.addEventListener("click", e => { if (!menu.contains(e.target)) set(false); });
    document.addEventListener("keydown", e => { if (e.key === "Escape" && list.classList.contains("open")) { set(false); btn.focus(); } });
  });

  /* ── FAQ: search and deep links ── */
  const q = document.getElementById("faqSearch");
  if (q) {
    const items = [...document.querySelectorAll("details.qa")];
    const groups = [...document.querySelectorAll(".faq-group")];
    const empty = document.getElementById("faqEmpty");
    q.addEventListener("input", () => {
      const t = q.value.trim().toLowerCase();
      items.forEach(d => {
        const hit = !t || d.textContent.toLowerCase().includes(t);
        d.hidden = !hit;
        if (t && hit) d.open = true;
      });
      groups.forEach(g => g.hidden = !g.querySelector("details.qa:not([hidden])"));
      empty.hidden = groups.some(g => !g.hidden);
    });
  }
  if (location.hash) {
    let d = null;
    try { d = document.querySelector(location.hash); } catch {}
    if (d) {
      if (d.tagName === "DETAILS") d.open = true;
      // jump at once (no smooth scroll), and again after pictures and fonts change the page height,
      // so a phone lands on the section; stop when the reader starts to scroll
      let moved = false;
      const stop = () => { moved = true; };
      ["wheel", "touchstart", "keydown"].forEach(ev => addEventListener(ev, stop, { once: true, passive: true }));
      const land = () => {
        if (moved) return;
        const html = document.documentElement, was = html.style.scrollBehavior;
        html.style.scrollBehavior = "auto";
        d.scrollIntoView({ block: "start" });
        html.style.scrollBehavior = was;
      };
      land();
      if (document.fonts) document.fonts.ready.then(land);
      addEventListener("load", () => { land(); setTimeout(land, 500); }, { once: true });
    }
    // remove the #part, so a reload stays where the reader is
    addEventListener("load", () => setTimeout(() => history.replaceState(null, "", location.pathname + location.search), 600), { once: true });
  }

  /* ── page transition: a meadow curtain rises, a sheep runs across, the next page opens ── */
  const NAMES = L.names;
  const WALK = ["walk0", "walk1", "walk2", "walk3"].map(f => `${AS}sheep_white_${f}.png`);
  WALK.forEach(src => { const i = new Image(); i.src = src; });
  const makeCurtain = text => {
    const c = document.createElement("div");
    c.className = "wd-curtain";
    c.setAttribute("aria-hidden", "true");
    c.innerHTML = `<div class="sheet"><div class="grass"></div><div class="runner"><img alt="" src="${WALK[0]}"><p></p></div></div>`;
    c.querySelector("p").textContent = text;
    document.body.appendChild(c);
    return c;
  };
  const cycle = (img, ms) => { let f = 0; return setInterval(() => { f = (f + 1) % 4; img.src = WALK[f]; }, ms); };
  let leaving = false, goTimer = 0;
  const leave = (href, name) => {
    if (leaving) return; leaving = true;
    const c = makeCurtain(L.off(name));
    const sheet = c.querySelector(".sheet"), runner = c.querySelector(".runner"), img = runner.querySelector("img");
    const t = cycle(img, 90);
    sheet.animate([{ transform: "translateY(105%)" }, { transform: "translateY(0)" }], { duration: 430, easing: "cubic-bezier(.6,0,.3,1)", fill: "forwards" });
    const run = runner.animate([{ transform: "translateX(-60vw)" }, { transform: "translateX(0)" }], { duration: 560, easing: "cubic-bezier(.2,.7,.3,1)", fill: "forwards" });
    // open the next page once: the animation end or the safety timer, whichever comes first.
    // A phone keeps this page in memory; without this, a waiting timer opened the next page again after "Back".
    let went = false;
    const go = () => {
      if (went) return; went = true;
      clearTimeout(goTimer); clearInterval(t);
      try { sessionStorage.setItem("wd-curtain", name); } catch {}
      location.href = href;
    };
    run.finished.then(go, go);
    goTimer = setTimeout(go, 1200);
  };
  if (!reduce) document.addEventListener("click", e => {
    const a = e.target.closest("a[href]");
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (a.target || a.hasAttribute("download")) return;
    const url = new URL(a.href, location.href);
    if (a.hasAttribute("hreflang") && !url.hash) { const id = currentSection(); if (id) url.hash = id; }   // keep the section
    if (url.origin !== location.origin) return;
    const file = url.pathname.split("/").pop().replace(/\.html$/, "");   // links have no ".html"; old ones may
    if (!(file in NAMES)) return;
    if (url.pathname === location.pathname) return;   // same page: plain anchor scroll
    e.preventDefault();
    const to = a.getAttribute("hreflang");
    if (to) { try { localStorage.setItem("wd-lang", to); } catch {} }
    leave(url.href, to ? L.langName[to] : NAMES[file]);
  });
  const root = document.documentElement;
  if (root.classList.contains("wd-enter")) {
    let name = "";
    try { name = sessionStorage.getItem("wd-curtain") || ""; sessionStorage.removeItem("wd-curtain"); } catch {}
    const c = makeCurtain(L.hello(name));
    root.classList.add("wd-lift");
    const sheet = c.querySelector(".sheet"), runner = c.querySelector(".runner"), img = runner.querySelector("img");
    img.src = AS + "sheep_white_jump.png";
    runner.animate([{ transform: "translateY(0)" }, { transform: "translateY(-40px)" }, { transform: "translateY(0)" }], { duration: 380, easing: "ease-out" });
    setTimeout(() => {
      img.src = AS + "sheep_white_happy.png";
      const up = sheet.animate([{ transform: "translateY(0)" }, { transform: "translateY(-110%)" }], { duration: 620, easing: "cubic-bezier(.6,0,.25,1)", fill: "forwards" });
      up.finished.then(() => c.remove(), () => c.remove());
    }, 260);
    setTimeout(() => c.remove(), 1600);   // safety: never leave the curtain up
  }
  addEventListener("pageshow", e => {
    if (!e.persisted) return;
    clearTimeout(goTimer);
    leaving = false;
    document.querySelectorAll(".wd-curtain").forEach(c => c.remove());
    root.classList.add("wd-lift");
  });

  /* ── inner page heroes: words rise, clouds drift, sheep wander ── */
  const hero = document.querySelector(".page-hero");
  if (hero) {
    const h1 = hero.querySelector("h1");
    if (h1 && !reduce) {
      const words = h1.textContent.trim().split(/\s+/);
      h1.setAttribute("aria-label", h1.textContent.trim());
      h1.innerHTML = words.map((w, i) => `<span class="w" aria-hidden="true" style="--i:${i}">${w}</span>`).join(" ");
    }
    hero.querySelectorAll(".art > img").forEach((img, i) => img.style.setProperty("--i", i));
    if (!reduce) [["cloud_0", "6%", "17%", 85, -20], ["cloud_2", "26%", "10%", 120, -75]].forEach(([n, top, w, dur, delay]) => {
      const c = document.createElement("img");
      c.src = `${AS}${n}.png`; c.alt = ""; c.className = "hero-cloud";
      c.style.cssText = `top:${top}; width:${w}; min-width:110px; animation-duration:${dur}s; animation-delay:${delay}s`;
      hero.prepend(c);
    });
    hero.querySelectorAll(".art > img[data-walk]").forEach(img => {
      const look = img.dataset.walk;
      const frames = ["walk0", "walk1", "walk2", "walk3"].map(f => `${AS}sheep_${look}_${f}.png`);
      const graze = ["graze0", "graze1"].map(f => `${AS}sheep_${look}_${f}.png`);
      [...frames, ...graze, `${AS}sheep_${look}_happy.png`].forEach(src => { const p = new Image(); p.src = src; });
      const still = img.getAttribute("src");
      const min = parseFloat(img.dataset.min ?? 0), max = parseFloat(img.dataset.max ?? 80);
      let x = parseFloat(img.style.left) || min, dir = Math.random() < .5 ? 1 : -1;
      let mode = "idle", until = performance.now() + 900 + Math.random() * 900, ft = 0, f = 0, last = performance.now();
      const pick = now => {
        const r = Math.random();
        mode = r < .55 ? "walk" : r < .8 ? "graze" : "idle";
        if (mode === "walk" && Math.random() < .4) dir = -dir;
        until = now + (mode === "walk" ? 1800 + Math.random() * 2600 : 1500 + Math.random() * 2000);
        if (mode === "idle") img.src = still;
      };
      const tick = now => {
        const dt = Math.min(60, now - last); last = now;
        if (!reduce && !img.classList.contains("hop")) {
          if (now > until) pick(now);
          if (mode === "walk") {
            x += dir * dt * .0045;
            if (x < min) { x = min; dir = 1; } if (x > max) { x = max; dir = -1; }
            img.style.left = x + "%";
            ft += dt; if (ft > 110) { ft = 0; f = (f + 1) % 4; img.src = frames[f]; }
          } else if (mode === "graze") {
            ft += dt; if (ft > 420) { ft = 0; f = (f + 1) % 2; img.src = graze[f]; }
          }
          img.style.scale = dir < 0 ? "-1 1" : "1 1";
        }
        requestAnimationFrame(tick);
      };
      setTimeout(() => requestAnimationFrame(tick), 1400);
      img.addEventListener("click", () => {
        img.classList.remove("hop"); void img.offsetWidth; img.classList.add("hop");
        img.src = `${AS}sheep_${look}_happy.png`;
        const h = document.createElement("img");
        h.src = AS + "heart.png"; h.alt = ""; h.className = "wd-heart";
        h.style.left = (img.offsetLeft + img.offsetWidth / 2) + "px"; h.style.top = (img.offsetTop - 6) + "px";
        img.parentElement.appendChild(h);
        setTimeout(() => h.remove(), 1300);
        setTimeout(() => { img.classList.remove("hop"); mode = "idle"; until = performance.now() + 900; }, 700);
      });
    });
  }

  /* ── tables: label each cell, so phones can show rows as small cards ── */
  document.querySelectorAll(".win-card table").forEach(t => {
    const head = [...t.querySelectorAll("tr")].find(r => r.querySelectorAll("th").length > 1);
    if (!head) return;
    head.classList.add("head");
    const labels = [...head.children].map(th => th.textContent.trim());
    if (labels.length >= 3 || head.querySelector("th.num")) t.classList.add("cols3");
    t.querySelectorAll("tr").forEach(r => [...r.children].forEach((c, i) => { if (c.tagName === "TD" && labels[i]) c.dataset.label = labels[i]; }));
  });

  /* ── stagger: cards, rows and answers come in one after another ── */
  document.querySelectorAll("[data-reveal]").forEach(box => {
    const groups = [box.querySelectorAll(".mini"), box.querySelectorAll("tr"), box.querySelectorAll("details.qa"), box.querySelectorAll(".stage-row figure")];
    groups.forEach(list => list.forEach((el, i) => el.style.setProperty("--i", Math.min(i, 14))));
  });

  /* ── FAQ answers open and close smoothly ── */
  if (!reduce) document.querySelectorAll("details.qa").forEach(d => {
    const sum = d.querySelector("summary"), body = d.querySelector(".a");
    if (!sum || !body) return;
    sum.addEventListener("click", e => {
      e.preventDefault();
      if (d.dataset.busy) return;
      d.dataset.busy = 1;
      if (!d.open) {
        d.open = true;
        const h = body.scrollHeight;
        body.animate([{ height: "0px", opacity: 0 }, { height: h + "px", opacity: 1 }], { duration: 320, easing: "cubic-bezier(.3,.8,.3,1)" });
        setTimeout(() => delete d.dataset.busy, 330);
      } else {
        const h = body.scrollHeight;
        const anim = body.animate([{ height: h + "px", opacity: 1 }, { height: "0px", opacity: 0 }], { duration: 240, easing: "ease-in", fill: "forwards" });
        setTimeout(() => { d.open = false; anim.cancel(); delete d.dataset.busy; }, 250);
      }
    });
  });

  /* ── guide: app window pictures; the shop tabs (on the picture, or buttons on phones) switch the list ── */
  document.querySelectorAll("[data-app-win]").forEach(win => {
    const scroller = win.querySelector(".scroller"), head = win.querySelector(".head"), shot = win.querySelector(".shot");
    const source = win.querySelector("picture source");
    const tabs = win.querySelectorAll("[data-tab]");
    head.style.setProperty("--src", `url("${shot.src}")`);
    const show = btn => {
      if (btn.getAttribute("aria-selected") === "true") return;
      const key = btn.dataset.tab;
      tabs.forEach(t => t.setAttribute("aria-selected", t.dataset.tab === key ? "true" : "false"));
      shot.classList.add("swap");
      setTimeout(() => {
        if (source && btn.dataset.srcM) source.srcset = btn.dataset.srcM;
        shot.alt = btn.dataset.alt || shot.alt;
        shot.src = btn.dataset.src;
        shot.decode().catch(() => {}).then(() => {
          head.style.setProperty("--src", `url("${shot.src}")`);
          scroller.scrollTop = 0;
          shot.classList.remove("swap");
        });
      }, 150);
      if (btn.closest(".mtabs")) btn.scrollIntoView({ block: "nearest", inline: "center", behavior: reduce ? "auto" : "smooth" });
    };
    tabs.forEach(b => b.addEventListener("click", () => show(b)));
  });
  /* ── analytics: ?notrack turns Umami off in this browser, ?track turns it on again (the head script stores it) ── */
  {
    const q = new URLSearchParams(location.search);
    const flag = q.has("notrack") ? "off" : q.has("track") ? "on" : "";
    if (flag) {
      q.delete("notrack"); q.delete("track");
      history.replaceState(null, "", location.pathname + (q.size ? "?" + q : "") + location.hash);
      const uk = document.documentElement.lang === "uk";
      const note = document.createElement("div");
      note.className = "track-note";
      note.setAttribute("role", "status");
      note.textContent = flag === "off"
        ? (uk ? "Аналітику вимкнено в цьому браузері." : "Analytics is off in this browser.")
        : (uk ? "Аналітику знову ввімкнено." : "Analytics is on again.");
      document.body.append(note);
      setTimeout(() => note.remove(), 3500);
    }
  }

  /* ── analytics: how far people read (Umami, no cookies). One event at 50 % and one at 100 % of each page. ── */
  {
    const sent = new Set();
    const check = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      const seen = max <= 0 ? 1 : scrollY / max;
      for (const [mark, name] of [[0.5, "scroll-50"], [0.97, "scroll-100"]]) {
        if (seen >= mark && !sent.has(name) && window.umami) { sent.add(name); umami.track(name); }
      }
      if (sent.size === 2) removeEventListener("scroll", onScroll);
    };
    let tick = 0;
    const onScroll = () => { if (!tick) tick = requestAnimationFrame(() => { tick = 0; check(); }); };
    addEventListener("scroll", onScroll, { passive: true });
  }

  /* ── areas that scroll sideways: show that they scroll ── */
  {
    const ARROW = '<svg viewBox="0 0 24 14" aria-hidden="true"><path d="M2 7h18M14 2l6 5-6 5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    const setups = [[".holiday-yard", true], [".app-win .mtabs", false]];
    setups.forEach(([sel, pill]) => document.querySelectorAll(sel).forEach(box => {
      let hint = null;
      if (pill) {
        const wrap = document.createElement("div");
        wrap.className = "swipe-box";
        box.parentNode.insertBefore(wrap, box); wrap.append(box);
        hint = document.createElement("div");
        hint.className = "swipe-hint gone"; hint.setAttribute("aria-hidden", "true");
        hint.innerHTML = `${UK ? "гортайте" : "swipe"} ${ARROW}`;
        wrap.append(hint);
      } else box.classList.add("swipe-fade");
      let used = false, peeked = false, peeking = false;
      const scrollable = () => box.scrollWidth > box.clientWidth + 4;
      const sync = () => {
        const can = scrollable();
        box.classList.toggle("at-end", !can || box.scrollLeft + box.clientWidth >= box.scrollWidth - 4);
        if (hint) hint.classList.toggle("gone", !can || used);
      };
      box.addEventListener("scroll", () => { if (!peeking && box.scrollLeft > 20) used = true; sync(); }, { passive: true });
      addEventListener("resize", sync);
      sync();
      // a short peek when the area first comes into view: it moves a little to the side and back
      if (!reduce && "IntersectionObserver" in window) {
        const io = new IntersectionObserver(es => es.forEach(e => {
          if (!e.isIntersecting || peeked || !scrollable()) return;
          peeked = true; io.disconnect();
          setTimeout(() => {
            if (used || box.scrollLeft > 4) return;
            peeking = true;
            box.scrollTo({ left: 70, behavior: "smooth" });
            setTimeout(() => { box.scrollTo({ left: 0, behavior: "smooth" }); }, 650);
            setTimeout(() => { peeking = false; }, 1500);
          }, 500);
        }), { threshold: .6 });
        io.observe(box);
      }
    }));
  }

  /* ── waitlists (Notion, via a Cloudflare Worker: worker/README.md). Two lists:
        "mac":     the "Join the waitlist" buttons ([data-mac-wait]) — one email on the day of the first release;
        "windows": "ask for a Windows version" ([data-win-ask]) — counts one request per browser (Umami, no personal data),
                   then the dialog explains the plan and can take an email for the Windows waitlist ── */
  {
    const WAITLIST_URL = "https://woolly-waitlist.woollydesk.workers.dev/";   // the Worker address; without it the email form is hidden
    const COMMON = UK ? {
      button: "Повідомити мене", sending: "Надсилаємо…", privacy: "Політика конфіденційності",
      bad: "Перевірте адресу пошти.", fail: "Не вдалося надіслати. Спробуйте ще раз або напишіть на vielindevelopment@gmail.com.", close: "Закрити",
    } : {
      button: "Notify me", sending: "Sending…", privacy: "Privacy policy",
      bad: "Please check the email address.", fail: "Something went wrong. Please try again, or write to vielindevelopment@gmail.com.", close: "Close",
    };
    const LISTS = {
      mac: {
        joined: "wd-mac-joined", event: "mac-waitlist",
        icon: `<img src="${AS}sheep_white_happy.png" alt="">`,
        ...(UK ? {
          title: "WoollyDesk майже готовий",
          body: "Перша версія для Mac скоро вийде. Залиште свою пошту, і в день релізу ми надішлемо вам лист.",
          label: "Ваша пошта", fine: "Лише один лист, у день релізу. Без спаму. Ви можете будь-коли попросити видалити адресу.",
          thanks: "Дякуємо! Ми напишемо вам, щойно WoollyDesk вийде.",
        } : {
          title: "WoollyDesk is almost ready",
          body: "The first version for Mac comes out soon. Leave your email, and we will write to you on release day.",
          label: "Your email", fine: "Only one email, on release day. No spam. You can ask us to delete your address at any time.",
          thanks: "Thank you! We will write to you when WoollyDesk is out.",
        }),
      },
      windows: {
        joined: "wd-windows-joined", event: "windows-waitlist",
        icon: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M2 4.2 8.6 3.3v6.2H2Zm7.6-1 8.4-1.2v7.5H9.6ZM2 10.5h6.6v6.2L2 15.8Zm7.6 0H18V18l-8.4-1.2Z" fill="currentColor"/></svg>',
        ...(UK ? {
          title: "WoollyDesk для Windows", counted: "Ваш запит враховано.",
          body: "Поки що WoollyDesk є лише для Mac. Якщо запитів буде достатньо, ми зробимо версію для Windows і повідомимо про це.",
          label: "Хочете дізнатися, коли вона вийде? Залиште свою пошту.",
          fine: "Лише один лист, коли вийде версія для Windows. Без спаму. Ви можете будь-коли попросити видалити адресу.",
          thanks: "Дякуємо! Ми напишемо вам, коли WoollyDesk для Windows буде готовий.",
        } : {
          title: "WoollyDesk for Windows", counted: "Your request is counted.",
          body: "WoollyDesk is only for Mac for now. If enough people ask, we will make a Windows version and announce it.",
          label: "Want to know when it is ready? Leave your email.",
          fine: "Only one email, when the Windows version is out. No spam. You can ask us to delete your address at any time.",
          thanks: "Thank you! We will write to you when WoollyDesk for Windows is ready.",
        }),
      },
    };
    const ASKED = "wd-windows-asked";
    const get = k => { try { return localStorage.getItem(k) === "1"; } catch { return false; } };
    const set = k => { try { localStorage.setItem(k, "1"); } catch {} };
    const dialogs = {};
    let source = "";

    const build = list => {
      const T = { ...COMMON, ...LISTS[list] };
      const dlg = document.createElement("dialog");
      dlg.className = `win-dialog wd-${list}`;
      dlg.setAttribute("aria-labelledby", `wdTitle-${list}`);
      dlg.innerHTML = `
        <button class="wd-x" type="button" aria-label="${T.close}">×</button>
        <div class="wd-head">${T.icon}<h2 id="wdTitle-${list}">${T.title}</h2></div>
        ${T.counted ? `<p class="wd-counted"><svg viewBox="0 0 16 12" aria-hidden="true"><path d="M1.5 6.5 6 10.5 14.5 1.5" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>${T.counted}</p>` : ""}
        <p class="wd-body">${T.body}</p>
        <form class="wd-form" novalidate>
          <label for="wdEmail-${list}">${T.label}</label>
          <div class="wd-row">
            <input id="wdEmail-${list}" name="email" type="email" inputmode="email" autocomplete="email" required maxlength="254" placeholder="name@example.com">
            <button class="btn" type="submit">${T.button}</button>
          </div>
          <input class="wd-hp" name="website" type="text" tabindex="-1" autocomplete="off" aria-hidden="true">
          <p class="wd-msg" role="status" aria-live="polite"></p>
          <p class="wd-fine">${T.fine} <a href="privacy#waitlist">${T.privacy}</a></p>
        </form>
        <p class="wd-thanks" hidden>${T.thanks}</p>`;
      document.body.append(dlg);
      const form = dlg.querySelector(".wd-form"), input = form.querySelector("input[type=email]"), msg = form.querySelector(".wd-msg"), btn = form.querySelector("button[type=submit]");
      if (!WAITLIST_URL) form.hidden = true;
      dlg.showThanks = () => { form.hidden = true; dlg.querySelector(".wd-thanks").hidden = false; };
      dlg.input = input;
      dlg.querySelector(".wd-x").addEventListener("click", () => dlg.close());
      dlg.addEventListener("click", e => { if (e.target === dlg) dlg.close(); });   // a click on the dark backdrop
      form.addEventListener("submit", async e => {
        e.preventDefault();
        const email = input.value.trim();
        msg.textContent = ""; msg.classList.remove("err");
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { msg.textContent = T.bad; msg.classList.add("err"); input.focus(); return; }
        btn.disabled = true; const label = btn.textContent; btn.textContent = T.sending;
        try {
          const r = await fetch(WAITLIST_URL, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, list, lang: UK ? "uk" : "en", source, website: form.website.value }),
          });
          const data = await r.json().catch(() => ({}));
          if (r.ok && data.ok) {
            set(T.joined);
            if (window.umami) umami.track(T.event, { source });
            dlg.showThanks();
          } else { msg.textContent = data.error === "email" ? T.bad : T.fail; msg.classList.add("err"); }
        } catch { msg.textContent = T.fail; msg.classList.add("err"); }
        btn.disabled = false; btn.textContent = label;
      });
      return dlg;
    };

    const open = (list, src) => {
      source = src || "";
      const dlg = dialogs[list] ||= build(list);
      const joined = get(LISTS[list].joined);
      if (joined) dlg.showThanks();
      document.querySelector(".menu-btn[aria-expanded='true']")?.click();   // close the cloud menu
      dlg.showModal();
      if (!joined && WAITLIST_URL) setTimeout(() => dlg.input.focus(), 50);
    };

    // the Mac release waitlist: the buttons are links to #get, so they still work without this script
    document.querySelectorAll("[data-mac-wait]").forEach(b => b.addEventListener("click", e => {
      e.preventDefault();
      open("mac", b.dataset.waitSrc);
    }));

    // the Windows version: the first click counts the request, then the dialog opens
    let asked = get(ASKED);
    const markAsked = b => {
      b.classList.add("done");
      const span = b.querySelector("[data-label]") || b.querySelector("span");
      if (span && b.dataset.done) span.textContent = b.dataset.done;
    };
    document.querySelectorAll("[data-win-ask]").forEach(b => {
      if (asked) markAsked(b);
      b.addEventListener("click", () => {
        if (!asked) {
          asked = true; set(ASKED);
          if (window.umami) umami.track("request-windows");
          document.querySelectorAll("[data-win-ask]").forEach(markAsked);
        }
        open("windows", b.dataset.winSrc);
      });
    });
  }

  /* ── support: copy the address ── */
  document.querySelectorAll("[data-copy]").forEach(b => b.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(b.dataset.copy); } catch { return; }
    const note = b.parentElement.querySelector(".copied");
    if (note) { note.classList.add("on"); setTimeout(() => note.classList.remove("on"), 1800); }
  }));
})();
