# Creating a Dedicated Google Mail Account for Amélie

*A pragmatic guide to creating the throwaway Gmail account the Secretary uses. Stops at
account creation on purpose — for connecting it, see `gmail-mcp-setup.md`.*

---

## The Raw Truth First

1. **No API or AI can create a `@gmail.com` account for you.**
   Google requires interactive phone verification (SMS/call) and anti-abuse checks. A human
   must physically create the account in a browser.
2. **Never connect your personal daily Gmail.**
   If an agent or script drafts or reads cold-outreach mail, keep it off your primary Google
   identity. Always create a dedicated project inbox (e.g. `amelie.zuverschenken@gmail.com`).
3. **This project never enables `gmail.send`, and there is no supported path around that.**
   `gmail-mcp-setup.md` grants only `gmail.readonly` + `gmail.compose` at the OAuth scope
   level — not by convention, by what the app is allowed to ask for. The Secretary drafts,
   a human clicks Send in the actual Gmail UI. There is no "faster" OAuth client, App
   Password/SMTP script, or Workspace service account that this project should ever be
   pointed at instead — any of those would just be a different way to reintroduce
   `gmail.send`, silently defeating the one-human-review step Amélie's rules depend on
   (`amelie-manifest.md` Regel 3: einmal zustellen, dann weg). If you ever find a doc, script,
   or agent proposing one, that's a bug in the setup, not a shortcut to take.
4. **Google has daily sending limits**, for when a human sends manually from the account:
   free consumer `@gmail.com` is roughly 500/24h (lower while the account is new); Google
   Workspace is 2,000/24h. Amélie sends a handful of mails per quarter, so this is background
   information, not a constraint that should shape anything here.

---

## Creating the Account (Manual, ~5 Minutes)

1. Open an **Incognito/private browser window**, separate from your personal session.
2. Go to [accounts.google.com/signup](https://accounts.google.com/signup).
3. Fill in the profile details:
   - **Name**: your real name, or the project's — cold outreach reads better signed by a
     person (see `amelie-manifest.md` Regel 2), so don't make this anonymous.
   - **Username**: a clean, transparent address, e.g. `amelie.geschenke@gmail.com` or
     `felix.amelie.berlin@gmail.com`.
4. Provide a mobile number for SMS verification.
5. Enable **2-Step Verification** in [Google Account Security](https://myaccount.google.com/security)
   right away — the MCP OAuth connection in `gmail-mcp-setup.md` needs it.

---

## Next Step

Connect the account with the read/draft-only Gmail MCP server: see `gmail-mcp-setup.md`.
That document is the only place this project's Gmail scopes and connection method are
defined — nothing here should duplicate or override it.

---

## Deliverability Notes, for When You Click Send

These matter for the human sending step, not for anything the Secretary does:

1. **Warm up the account.** Don't send a batch of cold emails on day one from a brand-new
   address — exchange a couple of real emails with your own personal address first to build
   sender reputation.
2. **Custom domain (optional).** If you ever move this to a custom domain instead of
   `@gmail.com`, configure SPF/DKIM in DNS. A plain `@gmail.com` address already has Google's
   SPF/DKIM handled for you.
3. **Respect Rule 3 of the manifest:** *"Einmal zustellen, dann weg. Kein Nachfassen."* One
   well-researched gift with an explicit "you owe me nothing, not even a reply" has good
   deliverability and no spam complaints — repeated follow-ups are what gets an account
   flagged.
