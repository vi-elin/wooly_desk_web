// Woolly Desk — shared behaviour for every page.
(() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const UK = document.documentElement.lang === "uk";
  // pictures live next to this script, also for the pages in uk/
  const AS = new URL("assets/", (document.currentScript || {}).src || location.href).href;
  // texts the script writes into the page, in the page's language
  const L = UK ? {
    top: "Нагору",
    names: { "index.html": "головна", "": "головна", "guide.html": "посібник", "faq.html": "питання", "support.html": "підтримка", "privacy.html": "конфіденційність" },
    langName: { uk: "українська", en: "English" },
    off: n => `вирушаємо: ${n}…`, hello: n => `вітаємо: ${n}!`,
  } : {
    top: "Back to the top",
    names: { "index.html": "home", "": "home", "guide.html": "the guide", "faq.html": "the FAQ", "support.html": "support", "privacy.html": "privacy" },
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
    let lastY = scrollY, frame = 0, stepAcc = 0, idleTimer = 0;
    const onScroll = () => {
      const y = scrollY;
      bar.classList.toggle("scrolled", y > 30);
      const max = document.documentElement.scrollHeight - innerHeight;
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
  const jump = document.querySelector(".toc-jump select");
  jump && jump.addEventListener("change", () => { location.hash = jump.value; });

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
    const d = document.querySelector(location.hash);
    if (d && d.tagName === "DETAILS") d.open = true;
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
  let leaving = false;
  const leave = (href, name) => {
    if (leaving) return; leaving = true;
    const c = makeCurtain(L.off(name));
    const sheet = c.querySelector(".sheet"), runner = c.querySelector(".runner"), img = runner.querySelector("img");
    const t = cycle(img, 90);
    sheet.animate([{ transform: "translateY(105%)" }, { transform: "translateY(0)" }], { duration: 430, easing: "cubic-bezier(.6,0,.3,1)", fill: "forwards" });
    const run = runner.animate([{ transform: "translateX(-60vw)" }, { transform: "translateX(0)" }], { duration: 560, easing: "cubic-bezier(.2,.7,.3,1)", fill: "forwards" });
    const go = () => { clearInterval(t); try { sessionStorage.setItem("wd-curtain", name); } catch {} location.href = href; };
    run.finished.then(go, go);
    setTimeout(go, 1200);
  };
  if (!reduce) document.addEventListener("click", e => {
    const a = e.target.closest("a[href]");
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (a.target || a.hasAttribute("download")) return;
    const url = new URL(a.href, location.href);
    if (a.hasAttribute("hreflang") && !url.hash && location.hash) url.hash = location.hash;   // keep the section
    if (url.origin !== location.origin) return;
    const file = url.pathname.split("/").pop();
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

  /* ── support: copy the address ── */
  document.querySelectorAll("[data-copy]").forEach(b => b.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(b.dataset.copy); } catch { return; }
    const note = b.parentElement.querySelector(".copied");
    if (note) { note.classList.add("on"); setTimeout(() => note.classList.remove("on"), 1800); }
  }));
})();
