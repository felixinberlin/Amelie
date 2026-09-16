# Email for the Secretary — quick how-to

The long version with explanations is `gmail-mcp-setup.md`. This is the short version: eight
steps, do them once.

1. **Create a fresh Gmail account** for the project (not a personal inbox). You have to do
   this yourself — Google requires phone verification.
2. **Check your Claude plan** supports custom MCP connectors (Enterprise, Pro, Max, or Team).
3. In [Google Cloud Console](https://console.cloud.google.com/), signed in as that Gmail
   account: create a project, enable **Gmail API** + **Gmail MCP API**.
4. Configure the **OAuth consent screen** (External, add the project's Gmail as a test user).
5. Add exactly two scopes — **`gmail.readonly`** and **`gmail.compose`**. Nothing else. This
   is what makes the connection send-incapable, not a prompt telling it to behave.
6. Create an **OAuth 2.0 Web application** client, note the client ID + secret, then:
   ```
   claude mcp add --transport http \
     --client-id <your-client-id> --client-secret --callback-port 8080 \
     gmail https://gmailmcp.googleapis.com/mcp/v1
   ```
7. Authenticate once, interactively (headless sessions can't do OAuth themselves):
   ```
   claude mcp login gmail
   ```
8. Verify: `claude -p "List the gmail MCP server's tools."` — you should see `create_draft`,
   `list_drafts`, `search_threads`, `get_thread`, label tools. **No send tool.** That's correct.

Done. `./scripts/wake-up-team.sh --only secretary` will use it from here on: it drafts emails
into the Gmail account and checks for replies, but every send is a human clicking send in Gmail.

Rotate or revoke access any time with `claude mcp remove gmail` and repeating from step 6/7.
