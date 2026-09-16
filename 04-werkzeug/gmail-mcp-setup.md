# Setting up Gmail for the Secretary

The Secretary drafts delivery emails from `amelie-vorlagen.md` and reads replies, using the
**official Google Gmail MCP server**. It is technically unable to send email: the setup below
grants only `gmail.readonly` + `gmail.compose`, never `gmail.send`, and the server's tool list
has no send operation. Drafts land in the Gmail account's Drafts folder; a human sends them.

This is a deliberate match to Amélie's own rules — one email, one recipient, no do-overs, so a
human reads it once more before it goes out.

---

## 0. Prerequisites

- A Claude plan that supports custom MCP connectors (Enterprise, Pro, Max, or Team).
- A Google account for the project. **Don't reuse a personal inbox** — create a fresh one, e.g.
  `amelie.zuverschenken@gmail.com` or similar. You (a human) have to do this part: Google
  requires phone verification and there's no way for an agent to do it for you.

## 1. Create the Gmail account

Sign up at accounts.google.com the normal way, from the project's own name/identity if you
want the "From" address to look intentional (e.g. `Amélie <amelie.zuverschenken@gmail.com>`).

## 2. Create a Google Cloud project and enable the APIs

In the [Google Cloud Console](https://console.cloud.google.com/), signed in as the project's
Gmail account:

1. Create a new project (e.g. "amelie-mcp").
2. Enable two APIs: **Gmail API** and **Gmail MCP API**.
3. Configure the **OAuth consent screen**: app name "Gmail MCP Server" (or similar), user type
   External, add the project's own Gmail address as a test user while the app is unverified.
4. Add exactly these two scopes and no others:
   - `https://www.googleapis.com/auth/gmail.readonly`
   - `https://www.googleapis.com/auth/gmail.compose`

   Do **not** add `gmail.send` or `gmail.modify` — that's what keeps this draft-only at the
   account level, not just by convention.
5. Create an **OAuth 2.0 Web application** client ID. Note the client ID and client secret —
   you'll need them once for `claude mcp add`.

## 3. Register the connector with Claude Code

From a terminal, in this repo (or anywhere — MCP servers can be added globally or per-project):

```bash
claude mcp add --transport http \
  --client-id <your-client-id> --client-secret --callback-port 8080 \
  gmail https://gmailmcp.googleapis.com/mcp/v1
```

`--client-secret` prompts for masked input rather than taking it as a plain argument.

## 4. Authenticate (once, interactively)

Headless/background sessions (which is how `scripts/wake-up-team.sh` runs the Secretary)
**cannot** complete an OAuth browser flow themselves. Do this once, interactively:

```bash
claude mcp login gmail
```

This opens a browser for the Google OAuth consent flow — sign in as the project's Gmail
account, not your personal one. If there's no local browser (e.g. over SSH), use
`claude mcp login gmail --no-browser` and paste the redirect URL back at the prompt.

The resulting token is cached and reused by later headless sessions until it expires or is
revoked (check with `claude mcp list`, remove with `claude mcp remove gmail` if you ever need
to rotate it).

## 5. Verify

```bash
claude -p "List the tools on the gmail MCP server and confirm there is no send-email tool."
```

You should see something like `create_draft`, `list_drafts`, `search_threads`, `get_thread`,
`label_message`, `label_thread`, `unlabel_message`, `unlabel_thread`, `list_labels` — and
nothing named send/dispatch/deliver.

## 6. What the Secretary actually does with it

See `scripts/wake-up-team.sh`. In short: for every tin in `amelie-matrix.md` marked `packed`
with no draft yet, it composes the email from the templates in this file's section 2–4, creates
a Gmail draft via `create_draft`, and notes in the matrix that a draft is waiting — it never
marks anything `delivered` itself, because only a human hitting send in Gmail makes that true.
It also periodically checks `search_threads`/`get_thread` for replies to already-sent tins and
flags them so the matrix status can move to `response`.

## If you'd rather not use Gmail

`scripts/wake-up-team.sh` reads the connector name from `$AMELIE_MAIL_MCP_SERVER` (default
`gmail`). Any MCP server exposing similarly-named draft/search/read tools works if you'd rather
point this at a different inbox — just re-point the Secretary's prompt at the real tool names,
since they won't match a Gmail server's.
