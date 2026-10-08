# Lemon Squeezy Zero-Friction Setup Guide for Felix

Follow these steps to start accepting payments in under 15 minutes.

---

## 1. Why Lemon Squeezy (Over Stripe Direct or Gumroad)?
- **Merchant of Record (MoR):** They calculate, collect, and remit all EU VAT (European digital tax) and US sales tax automatically. You don't have to deal with European VAT MOSS filings or international invoices.
- **Developer-Friendly:** Supports clean, branded checkouts and instant digital delivery.
- **Native GitHub Repository Access:** Can automatically invite buyers to your private GitHub repo when they purchase!

---

## 2. 15-Minute Setup Walkthrough

### Step 1: Account Creation
1. Go to [lemonsqueezy.com](https://www.lemonsqueezy.com) and create a free account.
2. Choose **Store Name**: e.g., `Zero-Drift Labs` or `Felix in Berlin`.
3. Connect your payout bank account (IBAN in Germany/EU).

### Step 2: Create the Product
1. In your dashboard, click **Products** -> **New Product**.
2. **Name:** `Zero-Drift Swarm Kit for Claude Code & Cursor`
3. **Description:** Copy & paste the markdown from `LANDING_PAGE_COPY.md`.
4. **Pricing Model:** Single payment.
   - Recommended Default Tier: **$149** (Pro Swarm License).
   - Optional: Add variants for **$79** (Starter) and **$299** (Team/Commercial).

### Step 3: Configure Fulfillment (How the Buyer gets the code)
Choose one of two methods (or both):

#### Option A: Direct Zip File Download (Fastest)
1. Run `./scripts/bundle-kit.sh` in the terminal to generate `zero-drift-swarm-kit.zip`.
2. In Lemon Squeezy under **Files**, drag and drop `zero-drift-swarm-kit.zip`.
3. When the buyer checks out, they receive an instant download link on screen and via email.

#### Option B: Automated GitHub Repository Invite (Best for updates)
1. Push `zero-drift-swarm-kit` to a private GitHub repo (e.g., `github.com/felixinberlin/zero-drift-swarm-kit`).
2. In Lemon Squeezy, go to **Settings** -> **Integrations** -> **GitHub**.
3. Authorize Lemon Squeezy to access the repo.
4. On the Product page under **Fulfillment**, select **Grant GitHub Access** and select your private repo.
5. Buyers simply enter their GitHub username at checkout and get invited automatically!

---

## 3. Your Checkout URL & First Sale
- Lemon Squeezy gives you a direct link: `https://[your-store].lemonsqueezy.com/buy/[product-id]`
- Embed this link in your Reddit replies, X thread, or personal site.
- Each sale nets you ~$140 directly into your payout account = **tens of millions of AI credits immediately funded per sale.**
