---
status: Available
delivery_method: E-Mail
target_maker: Tacheles e.V. (Wuppertal), verify contact person before sending
review_score: 26/35
architecture_tier: Tier 1
source_type: Type A
---
# Start-up Navigator

*(German: Gründungsnavigator)*

**One sentence:** A free web app that prepares people on basic income support who want to become self-employed for the **conversation** with the job centre (Jobcenter). It shows what to say, what the other side may answer, which statute applies (quoted verbatim and linked) and which deadline is running. Everything stays in the browser.

**As of:** 11 October 2026 · **Recheck by:** October 2027 and after every SGB II amendment
**Recipient:** **Tacheles e.V.** (Wuppertal; welfare advice, SGB II material collection) for expert review of the statute texts and inclusion in their collection. Secondarily **Sozialrat Deutschland e.V.** (relaunching its AI tools, nothing on self-employment yet). **No contact person verified; check on the association's website before sending. No verification, no mail. No mail drafted.**
**Verdict:** 🎁 **gift**. The prototype runs and the kernel is tested.
**Review:** 26/35 (gate 24) · V8 fun 2 · Tier 1 · Type A (statute text) · details: `06-suche/amelie-classification-log.md`, "Gründungsnavigator — Reviewer 11.10.2026"

**Live demo (works on phones):** [Conversation navigator](https://felixinberlin.github.io/Amelie/gruendungsnavigator/) · [Case map](https://felixinberlin.github.io/Amelie/gruendungsnavigator/fall-landkarte.html) · Tin: https://felixinberlin.github.io/Amelie/#dose=gruendungsnavigator

---

## The problem

Anyone who wants to start a business while on basic income support (Grundsicherungsgeld) needs the job centre. But the **start-up grant (section 16b SGB II) and subsidies for equipment (section 16c SGB II) are discretionary**, so a conversation decides the money.

- **The order matters, and people don't know it.** Benefits under SGB II "are not provided for periods before the application" (section 37(2) SGB II). Start first and ask later, and the funding is lost.
- **The conversation is unequal.** The caseworker knows the rules. The founder is nervous, agrees to things on the phone, or avoids the call.
- **It has been stricter since 1 July 2026** (13th SGB II amendment act of 16 April 2026, BGBl. I No. 107):
  - Self-employment is reviewed after one year of benefits at the latest (section 10(2) no. 5).
  - Evidence submitted after the objection decision no longer counts (section 41a(3)).
  - Repeated missed appointments cost 30 % for one month (section 32).
- **AI help is unreliable today.** Job centres and social courts report AI-written letters with wrong sections and invented rulings (Higher Social Court NRW annual press conference 2026, reported by LTO 24 Apr 2026; gegen-hartz.de 9 Aug 2026: 501,667 objections in 2025).

**Who suffers:** People on benefits who want to start a business, especially those without a companion or legal knowledge. Also advice centres, which answer the same questions by hand every time.

## Why now

1. **The new law is settled and its text is online.** A tool can quote it instead of guessing. On 11 Oct 2026 every verbatim quote in the prototype was **machine-checked against gesetze-im-internet.de**. Four deviations turned up (e.g. "selbständig" vs "selbstständig" in section 10, the old spelling "daß" in section 16 SGB I) and are now corrected.
2. **A browser is enough:** single HTML files, no server, no account, no tracking, inputs only in `localStorage`. The pages are built for phones (bottom tab bar, large touch targets, no horizontal scrolling at 375 px), so they work in the job centre waiting area, **even without a connection**: a service worker keeps both pages available, and they can be added to the home screen like an app.
3. **Deterministic first:** deadlines, allowance and statute references come from a tested kernel (Vitest), not from a language model.

## Sketch

**Conversation navigator** (`public/gruendungsnavigator/index.html`):
- **Preparation:** personal details stay in the browser; ground rules; a checklist of what to bring.
- **Phone call:** a decision tree with 7 questions and 23 possible answers. Each answer has wording, background and the quoted statute, plus a progress bar and a live log.
- **Appointment:** 42 likely questions with editable sample answers, evidence and statute; practice progress and a print version.
- **Rights cards:** 30 typical replies from the other side ("We don't fund that", "Sign here"). One tap shows the request, the statute text and the formal next step. Four groups to filter by; 9 cards alone against being brushed off: "That's not my department", "You have to go to the employment agency", "I can't accept that like this", "Call the hotline", "Your caseworker is away", "I'll pass it on" and more, each with the duty to forward (section 16(2) SGB I) or to accept (section 20(3) SGB X) quoted verbatim.
- **Presentation mode:** the other side sees only the cooperative version; tactics stay hidden.
- **Summary mail:** built from the clicks, with correct statute references.

**Case map** (`fall-landkarte.html`):
- 9 stations from application to exit.
- 29 questions with 107 answers, each with reaction, next step, deadline and statute text.
- A deadline timeline.
- 37 statutes linked to gesetze-im-internet.de and dejure.org. Verbatim text is quoted; paraphrase is marked "Kurzfassung" (summary).

**Kernel** (`src/engine/gruendungsnavigator/`):
- Month deadlines per sections 187 and 188 BGB, shifted to the next working day (section 64(3) SGG). Holidays come from the Easter formula; state holidays can be added.
- Objection (1 month; 1 year without instructions on remedies), court action, failure to act (6 and 3 months).
- Trade and tax-office registration, maximum duration of the start-up grant, the annual review under section 10(2) no. 5, and the deemed-final rule of section 41a(5).
- An order checker for application vs. business start (section 37(2)). If a date is missing, the result is "unknown".
- The allowance under section 11b(2),(3).
- A structural check of the phone tree and a language guard: "guaranteed", "entitlement exists" and "inadmissible" never appear.
- A currency guard: if the last check is older than 12 months, the texts must be re-read.
- Drift guards that read the data directly from the demo pages.

**In the Amélie frontend:** the simulator "Start-up Navigator & Deadline Calculator", with links to both pages, the embedded demo, the deadline calculator and the allowance.

**Not included:** no legal advice on individual cases, no language model in the kernel, no server, nothing sent to the job centre, no rating of caseworkers.

## First step

**Ticket 01: turn the page into a template.** Move all sample content (trade, amounts, sample answers of the fictional web-developer case) from `index.html` into a sector pack (JSON), next to an empty pack. The statute register and phone tree become data that the tested kernel loads.

**Done when:**
1. "Web development" and an empty pack validate against the same schema, and the kernel holds no sample amounts.
2. Every register entry carries statute, version, URL and the verbatim/summary flag, and the quotation check against gesetze-im-internet.de is green.
3. The phone-tree graph test (no dead nodes, all statute references resolve) and the deadline table tests are green. These tests already exist.
4. No output text says "guaranteed", "entitlement exists", "inadmissible" or "unlawful".
5. A second person without programming skills produces their own version in 30 minutes.
6. Both pages are usable at 360 px width without horizontal scrolling. This already holds today.

## Where it breaks

**Legal services and keeping the texts current.**
- General information is allowed; decisions on individual cases are not (Legal Services Act, RDG). The phone tree contains wording suggestions by a non-lawyer.
- Every SGB II amendment makes texts wrong (the law was rebuilt in 2023 and 2026).

**Remedy, the reviewer's scope ("GN-B", 29/35 there):**
- Only the statute register, the deadline and order checkers and the rights cards with verbatim text belong in the tested kernel.
- Tactical wording stays a swappable sample pack.
- Keep the currency guard and the machine quotation check, and have a lawyer check the RDG boundary before sending.

**Tone:** A tool that reads like a threat does harm. Presentation mode enforces the cooperative version.

**Trust (first feedback, 13 Oct 2026):** On r/Grundsicherung the first reactions were "AI slop" and: "Please stop trusting an AI on legal questions … if you trust the result blindly, it often turns into rubbish." The objection is fair. A tool for people affected must say what has been checked and what has not. Remedy since then: a transparency box (written with AI assistance, no AI at runtime, quotations checked against the official source, wording not checked by lawyers, see a welfare advice service first), a check note on every quotation, "not verbatim" on every summary, and a link to the audit file.

**Disclosed:**
- The need rests on secondary sources only (gegen-hartz.de, LTO); the IAB study has not been read.
- The recipient's contact person is not verified.
- The score is only 2 points above the gate.
- Fun is low (2): a calm rehearsal on a stressful topic.

## Who has already tried this

Research on 11 Oct 2026 (check protocol G1–G4, the reviewer's counter-searches, Lab intake). Verdict: **narrowed**. Neighbours cover parts; none covers the conversation.

- **jobcenter.guru** (GuruSense UG, Mannheim): letters by photo, objections, in-app purchases up to €9.99. That covers letters, not the conversation.
- **BürgerChat** (github.com/jeannineshiu/buergerchat, MIT): RAG over about 6,100 official documents, nothing on self-employment. A possible docking point (G3 `besetzt`).
- **Sozialrat Deutschland e.V.:** letter and objection generators; pilot paused.
- **Munich start-up office (Münchner Gründungsbüro):** a guide on basic income support, no tool.
- **Gründerplattform:** a business-plan tool for the application, not for the conversation.
- **Grave `paragraphen-dolmetscher`** (explaining a notice from a photo): a different function, not a revenant.
- **Lab job-centre cluster** (10 Oct 2026, batches 13–15, 35–37, 70–71): citizen-rights copilot, civic companion network, phone-photo converter, caseworker copilot, once-only gateway and others. All stayed Needs Research (13–19/35): reform ideas without a mandate, figures without primary sources. The navigator is the one deliverable kernel among them.
- **Reviewer counter-searches** (4, snippets): no conversation-preparation tool found, only advice articles and the official BA app.

**Remaining gap:** the conversation rather than the letter, for founders, with checked statute texts and a view you can show the other side.

## Funding bridge (hint only)

Who could fund Ticket 01: **Prototype Fund** (whether CC0 fits its licence requirement is open) or **Civic Coding**. Evidence is snippets only. Before mentioning either, check deadline and eligibility on the primary page. No mail with funding tips without approval.

## Prior art

- Prototype: `public/gruendungsnavigator/` (chapter `07-demos/gruendungsnavigator/README.md`); concept `02-recherche/gruendungsnavigator-konzept-2026-10-11.md`; handover `06-suche/scout-an-bibliothekar-2026-10-11-gruendungsnavigator.md`.
- Kernel and tests: `src/engine/gruendungsnavigator/` (Vitest, including drift, number and offline guards over both HTML pages).
- Statute texts: SGB II as amended on 16 Apr 2026 (BGBl. I No. 107), in force 1 Jul 2026; sections 14, 16, 17, 39, 60 SGB I; 9, 13, 25, 33, 35, 44 SGB X; 66, 84, 87, 88, 183 SGG; 14 GewO; 138 AO; 19 UStG. Read on dejure.org and gesetze-im-internet.de (11 Oct 2026).
- Sources in the register: LSG NRW / LTO, gegen-hartz.de, BürgerChat, Sozialrat, Münchner Gründungsbüro, Gründerplattform, jobcenter.guru, dejure.org (`06-suche/amelie-quellen.md`).
- Side finding **section checker** (Paragrafen-Prüfer, G2, `verengt`): the statute register with version and quotation check is its core.

---

This idea belongs to no one. Take it, build it, sell it — you owe me nothing, not even a reply. If one day you have an idea you won't build, give it to someone who will.

CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin
