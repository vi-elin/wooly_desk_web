// Woolly Desk — shared behaviour for every page.
(() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const bar = document.querySelector(".topbar");

  /* ── header: turns into a floating menu bar after a little scroll ── */
  if (bar) {
    const inner = bar.querySelector(".bar-inner");
    const sheep = bar.querySelector(".trail-sheep");
    const sheepImg = sheep && sheep.querySelector("img");
    const frames = ["walk0", "walk1", "walk2", "walk3"].map(f => {
      const i = new Image(); i.src = `assets/sheep_white_${f}.png`; return i.src;
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
          idleTimer = setTimeout(() => { sheepImg.src = p > .995 ? "assets/sheep_white_happy.png" : "assets/sheep_white_graze0.png"; }, 260);
        }
      }
      lastY = y;
    };
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    if (sheep) {
      sheep.style.pointerEvents = "auto"; sheep.style.cursor = "pointer";
      sheep.title = "Back to the top";
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
          if (!reduce) { img.src = "assets/sheep_white_jump.png"; clearTimeout(tsheep._t); tsheep._t = setTimeout(() => img.src = "assets/sheep_white_idle.png", 420); }
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

  /* ── support: copy the address ── */
  document.querySelectorAll("[data-copy]").forEach(b => b.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(b.dataset.copy); } catch { return; }
    const note = b.parentElement.querySelector(".copied");
    if (note) { note.classList.add("on"); setTimeout(() => note.classList.remove("on"), 1800); }
  }));
})();
