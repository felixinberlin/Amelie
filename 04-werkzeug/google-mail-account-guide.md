# Creating & Connecting a Dedicated Google Mail Account for Amélie

*A pragmatic, unfiltered guide on creating a dedicated Google Mail account and connecting it so this app or its agents can read and send emails.*

---

## The Raw Truth First: What Works and What Doesn't

1. **No API or AI can create a `@gmail.com` account for you.**  
   Google requires interactive phone verification (SMS/call) and anti-abuse checks. A human must physically create the account in a browser.
2. **Never connect your personal daily Gmail (`FelixinBerlin@gmail.com`).**  
   If an agent or script sends cold outreach or tests broken loops, you risk having your primary Google identity flagged or rate-limited. Always create a dedicated throwaway or project inbox (e.g., `amelie.kula.berlin@gmail.com` or a custom Google Workspace domain like `post@deinedomain.de`).
3. **Google has daily sending limits:**
   - Free consumer `@gmail.com`: **500 emails per 24 hours** (and much lower if the account is new, to prevent spam flagging).
   - Google Workspace (paid): **2,000 emails per 24 hours**.
4. **Sending vs. Drafting:**  
   In this project's architecture (`04-werkzeug/gmail-mcp-setup.md`), we deliberately prefer **Drafting** (`gmail.compose`) over **Unattended Sending** (`gmail.send`). That way, the app/agent drafts the personalized cold email into your Gmail Drafts folder, and you click "Send" after a 5-second human check. However, direct programmatic sending is also documented below if you want full automation.

---

## Phase 1: Create the Dedicated Google Account (Manual, ~5 Minutes)

1. Open an **Incognito / Private browser window** (to avoid mixing sessions with your personal account).
2. Go to [https://accounts.google.com/signup](https://accounts.google.com/signup).
3. Fill in the profile details:
   - **First / Last Name**: e.g., `Félix` / `Amélie Project` (or your real name, as recipient cold outreach requires credibility).
   - **Username**: choose a clean, transparent address, e.g. `amelie.geschenke@gmail.com` or `felix.amelie.berlin@gmail.com`.
4. Provide your mobile number for SMS verification.
5. Set up **2-Step Verification (2FA)** immediately in [Google Account Security](https://myaccount.google.com/security):
   - You **must** have 2FA enabled if you ever want to generate an App Password (SMTP) or register developer credentials.

---

## Phase 2: Choose How the App Connects

You have three realistic technical paths depending on how you run the app:

| Method | Best For | Security | Reading | Sending | Setup Effort |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Option A: Google Cloud OAuth 2.0** *(Recommended)* | Web apps, AI Studio preview, client/server | High (Token based, revocable) | Yes (`gmail.readonly`) | Yes (`gmail.send` or `gmail.compose`) | 10 mins in Google Cloud Console |
| **Option B: App Password (SMTP/IMAP)** | Direct Node.js / script backend | Medium (16-char static key) | Yes (via IMAP) | Yes (via Nodemailer / SMTP) | 2 mins in Account settings |
| **Option C: Google Workspace + Service Account** | Organizations with custom domain | Enterprise | Yes | Yes (Domain-wide delegation) | Requires paid Workspace Admin |

---

## Detailed Walkthrough: Option A — Google Cloud OAuth 2.0 (Standard Web App)

This is the official Google-supported method for web applications.

### Step 1: Create a Project in Google Cloud Console
1. While logged in as your dedicated Gmail account, go to [Google Cloud Console](https://console.cloud.google.com/).
2. Click the project dropdown at the top → **New Project**.
3. Name it `amelie-mailer` and click **Create**.

### Step 2: Enable the Gmail API
1. In the Cloud Console, go to **APIs & Services → Library**.
2. Search for **Gmail API**.
3. Click **Enable**.

### Step 3: Configure the OAuth Consent Screen
1. Go to **APIs & Services → OAuth consent screen**.
2. Select **External** (unless you are on Google Workspace, where Internal is available) and click **Create**.
3. Enter App information:
   - **App name**: `Amélie Tin Dispatcher`
   - **User support email**: Your dedicated Gmail address.
   - **Developer contact information**: Your email address.
4. Click **Save and Continue**.
5. **Scopes**: Click **Add or Remove Scopes**:
   - For reading: `https://www.googleapis.com/auth/gmail.readonly`
   - For drafting safely (no direct send): `https://www.googleapis.com/auth/gmail.compose`
   - For automated sending: `https://www.googleapis.com/auth/gmail.send`
6. **Test Users**:
   - Because your app is in "Testing" mode, Google requires you to explicitly whitelist who can sign in.
   - Click **Add Users** and add your dedicated Gmail address (and your personal address if testing).
7. Save and finish.

### Step 4: Create OAuth Credentials
1. Go to **APIs & Services → Credentials** → Click **+ Create Credentials** → **OAuth client ID**.
2. Application type: **Web application**.
3. Name: `Amélie Web Client`.
4. Under **Authorized JavaScript origins**:
   - Add your local dev URL: `http://localhost:3000`
   - Add your Cloud Run / AI Studio preview domain (e.g. `https://ais-dev-...run.app`).
5. Under **Authorized redirect URIs**:
   - Add `http://localhost:3000` (or your callback endpoint).
6. Click **Create**. Copy the **Client ID** (and Client Secret if doing server-side exchange).

### Step 5: How the App Uses It
In the client, using Google Identity Services (GIS):
```ts
// Client-side token acquisition
const tokenClient = google.accounts.oauth2.initTokenClient({
  client_id: YOUR_CLIENT_ID,
  scope: 'https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/gmail.readonly',
  callback: async (tokenResponse) => {
    if (tokenResponse.access_token) {
      // Send message via Gmail REST API
      await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokenResponse.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          raw: btoa(
            "To: recipient@org.de\r\n" +
            "Subject: Geschenk: Ideenskizze\r\n\r\n" +
            "Hallo..."
          ).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
        })
      });
    }
  },
});

// Trigger Google sign-in popup
tokenClient.requestAccessToken();
```

---

## Detailed Walkthrough: Option B — App Password (Direct SMTP / Node.js)

If you have a backend Node script or want quick, zero-popup sending via standard SMTP (`nodemailer`):

1. On your dedicated Google Account:
   - Go to [https://myaccount.google.com/security](https://myaccount.google.com/security).
   - Ensure **2-Step Verification** is turned ON.
2. Go to **App Passwords**:
   - Direct link: [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords).
   - Enter an app name: `Amelie Mailer`.
   - Click **Create**.
   - Google displays a 16-character code like `abcd efgh ijkl mnop`.
3. Store this in your server environment:
   ```env
   GMAIL_USER="amelie.geschenke@gmail.com"
   GMAIL_APP_PASSWORD="abcdefghijklmnop"
   ```
4. Send emails with `nodemailer` on your Node backend:
   ```ts
   import nodemailer from 'nodemailer';

   const transporter = nodemailer.createTransport({
     service: 'gmail',
     auth: {
       user: process.env.GMAIL_USER,
       pass: process.env.GMAIL_APP_PASSWORD,
     },
   });

   await transporter.sendMail({
     from: '"Félix (Amélie)" <amelie.geschenke@gmail.com>',
     to: 'kontakt@thuenen.de',
     subject: 'Amélie-Geschenk: Open-Source-Skizze für MonViA',
     text: emailBodyText,
   });
   ```
5. **Reading incoming emails via App Password**:
   - Connect via IMAP using host `imap.gmail.com`, port `993`, SSL enabled, using your Gmail address and the same 16-character App Password.

---

## Amélie Cold Delivery Safety Checklist (Crucial)

To prevent your dedicated Gmail account from landing in spam filters or getting suspended:

1. **Warm up the account**: Do not send 30 cold emails on day 1. Send 1-2 real emails back and forth with your own personal address to establish positive sender reputation.
2. **Custom Domain SPF/DKIM (If on Google Workspace)**: If using a custom domain (`@yourdomain.de`), configure SPF (`v=spf1 include:_spf.google.com ~all`) and DKIM in your DNS. Standard `@gmail.com` addresses already have Google's SPF/DKIM configured automatically.
3. **Respect Rule #3 of the Amélie Manifesto**:
   > *"Einmal zustellen, dann weg. Kein Nachfassen."* (Deliver once, then let go. Never follow up).
   Spam algorithms specifically track repeated unsolicited emails to the same domain. One crisp, well-researched gift with an explicit pledge ("you owe me nothing, not even a reply") has high deliverability and zero spam complaints.
4. **Draft-First Default**:
   Keeping the app configured to create drafts allows you to review the exact recipient email, subject, and formatting in your actual Gmail inbox before hitting send.
