# Waitlist Worker

The waitlist dialogs on woollydesk.com send `{ email, list, lang, source }` here.
The Worker adds one row to a Notion database (Side projects / Woolly Desk):

- `list: "mac"` (the "Join the waitlist" buttons) → **Mac waitlist**, ID in `NOTION_DB_MAC`. One email on release day.
- `list: "windows"` ("Ask for a Windows version") → **Windows waitlist**, ID in `NOTION_DB`.

- The Notion key is a Worker secret. It is never in this repo or on the site.
- Only pages from woollydesk.com (and the local test server) may call it.
- At most 5 sign-ups a minute from one address. A hidden "website" field catches simple bots.
- The same email is stored only once.

## Set up

1. Notion → Settings → Connections → Develop or manage integrations → New integration (internal), with "Insert content" and "Read content".
   Copy the key. Open the **Windows waitlist** database → ··· → Connections → add the integration.
   Do the same for the **Mac waitlist** database. It needs the same properties: `Email` (title), `Language` (select), `Source` (select).
   Copy its ID from its link (the 32 characters before `?v=`) into `NOTION_DB_MAC` in `wrangler.toml`.
2. `npx wrangler@3 login`
3. `npx wrangler@3 secret put NOTION_TOKEN` and paste the key.
4. `npx wrangler@3 deploy` prints the address. Put it in `WAITLIST_URL` in `site.js`.
   Now: https://woolly-waitlist.woollydesk.workers.dev

`npx wrangler@3 tail` shows the Worker's log.
