// Waitlists: takes { email, list, lang, source } from woollydesk.com and adds one row to that list's Notion database.
// list "mac" = the first release (env.NOTION_DB_MAC), list "windows" = the Windows version (env.NOTION_DB).
// Only the site's own pages may call it; the Notion key stays in the Worker (env.NOTION_TOKEN).

const ORIGINS = ["https://woollydesk.com", "https://www.woollydesk.com", "https://vi-elin.github.io", "http://localhost:8791"];
const LANGS = ["en", "uk"];
const SOURCES = ["hero", "final", "menu", "faq", "header"];
const EMAIL = /^[^\s@<>()",;:]+@[^\s@<>()",;:]+\.[a-z]{2,}$/i;

const reply = (status, data, cors) =>
  new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json", ...cors } });

async function notion(env, path, body) {
  const r = await fetch(`https://api.notion.com/v1/${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.NOTION_TOKEN}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error(`Notion ${r.status}: ${(await r.text()).slice(0, 300)}`);
  return r.json();
}

export default {
  async fetch(req, env) {
    const origin = req.headers.get("Origin") || "";
    const allowed = ORIGINS.includes(origin);
    const cors = {
      "Access-Control-Allow-Origin": allowed ? origin : ORIGINS[0],
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      Vary: "Origin",
    };
    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    if (req.method !== "POST" || !allowed) return reply(403, { ok: false, error: "forbidden" }, cors);

    if (env.LIMITER) {
      const ip = req.headers.get("CF-Connecting-IP") || "unknown";
      const { success } = await env.LIMITER.limit({ key: ip });
      if (!success) return reply(429, { ok: false, error: "slow-down" }, cors);
    }

    let body;
    try { body = await req.json(); } catch { return reply(400, { ok: false, error: "bad-request" }, cors); }

    // a hidden field that people never fill: a bot did it, so say "ok" and store nothing
    if (body.website) return reply(200, { ok: true }, cors);

    const email = String(body.email || "").trim().toLowerCase();
    if (email.length > 254 || !EMAIL.test(email)) return reply(400, { ok: false, error: "email" }, cors);
    const lang = LANGS.includes(body.lang) ? body.lang : "en";
    const source = SOURCES.includes(body.source) ? body.source : null;
    const db = body.list === "mac" ? env.NOTION_DB_MAC : env.NOTION_DB;
    if (!db) return reply(503, { ok: false, error: "store" }, cors);

    try {
      // one row for each email
      const found = await notion(env, `databases/${db}/query`, {
        filter: { property: "Email", title: { equals: email } }, page_size: 1,
      });
      if (found.results && found.results.length) return reply(200, { ok: true, already: true }, cors);

      const properties = {
        Email: { title: [{ text: { content: email } }] },
        Language: { select: { name: lang } },
      };
      if (source) properties.Source = { select: { name: source } };
      await notion(env, "pages", { parent: { database_id: db }, properties });
      return reply(200, { ok: true }, cors);
    } catch (e) {
      console.error(e.message);
      return reply(502, { ok: false, error: "store" }, cors);
    }
  },
};
