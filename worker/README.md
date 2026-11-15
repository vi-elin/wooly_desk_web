# Windows waitlist Worker

The "Ask for a Windows version" dialog on woollydesk.com sends `{ email, lang, source }` here.
The Worker adds one row to the Notion database **Windows waitlist** (Side projects / Woolly Desk).

- The Notion key is a Worker secret. It is never in this repo or on the site.
- Only pages from woollydesk.com (and the local test server) may call it.
- At most 5 sign-ups a minute from one address. A hidden "website" field catches simple bots.
- The same email is stored only once.

## Set up

1. Notion → Settings → Connections → Develop or manage integrations → New integration (internal), with "Insert content" and "Read content".
   Copy the key. Open the **Windows waitlist** database → ··· → Connections → add the integration.
2. `npx wrangler@3 login`
3. `npx wrangler@3 secret put NOTION_TOKEN` and paste the key.
4. `npx wrangler@3 deploy` prints the address. Put it in `WAITLIST_URL` in `site.js`.
   Now: https://woolly-waitlist.woollydesk.workers.dev

`npx wrangler@3 tail` shows the Worker's log.
