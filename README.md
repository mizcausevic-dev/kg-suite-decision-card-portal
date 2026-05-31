# kg-suite-decision-card-portal

> **Buyer-facing static HTML viewer for AI Procurement Decision Cards.** Drop in a Decision Card URL (or local JSON), renders a procurement-review-friendly summary: AI system · data vault targets · retention envelope · 3-axis posture (when DefenseTech) · cross-binding refs · signature-verified status. Replaces "read raw JSON" for non-engineer reviewers.

Part of the [Kinetic Gain Protocol Suite](https://suite.kineticgain.com).

> Status: v0.1 with a working SSG demo. Pure-functional `renderDecisionCardHtml(card)` runs in Node + browser. Hostable at `decisions.kineticgain.com`.

## What it shows

For each section the viewer renders the answer a procurement reviewer is actually asking:

| Section | Reviewer question |
| --- | --- |
| **AI system** | What tool is this? What version? Where's the AI Tool Card? |
| **Data vault targets** | What vaults hold what kinds of data? FIPS 140 / FedRAMP status? How many fields are tokenized vs. held? |
| **Retention envelope** | How long is data kept? Legal hold supported? Destruction method (NIST SP 800-88)? |
| **N-axis policy contract** | How many orthogonal regulatory axes? **(DefenseTech 3-axis badge displays when applicable)** |
| **Cross-binding refs** | What other Suite repos does this contract reference? (audit-stream, evidence-bundle, incident-card) |
| **Signature** | ed25519 signature present + valid? |

## Usage

```bash
# As an SSG: build a static demo from the example DefenseTech Decision Card
npm install
npm run demo
# Wrote demo → dist/index.html  +  dist/style.css

# Open dist/index.html in your browser
```

```js
// As a library: pure-functional rendering (Node or browser)
import { renderDecisionCardHtml } from "kg-suite-decision-card-portal/src/render.mjs";

const card = await fetch("https://stratos-aerospace.example/.well-known/decisions/STRATOS-DEC-2026-DEF-0084.json").then((r) => r.json());
const fragment = renderDecisionCardHtml(card);
document.getElementById("dc-mount").innerHTML = fragment;
```

## Design

- **No framework.** Pure HTML strings produced by pure functions. Runs in Node for SSG, runs in the browser for live-fetch viewers.
- **Strict CSP.** `default-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; frame-ancestors 'none'; ...`. No third-party scripts, no analytics, no embedded fonts.
- **Dark-themed**, slate-indigo palette matching the rest of the Suite.
- **Escape everything.** `escapeHtml()` runs on every interpolated string. No raw HTML injection from the Decision Card JSON.

## Hosting at `decisions.kineticgain.com`

```bash
npm run demo
# Upload dist/ to your CDN of choice. Add to apex .htaccess:
#   Redirect 301 /decisions https://decisions.kineticgain.com/
```

Subdomain follows the same security-headers pattern as other Suite subdomains (HSTS, COEP, self-hosted fonts, kg-header-audit A/90 target).

## Composes with

- All 10 verticals' vault contract profiles ([phi](https://github.com/mizcausevic-dev/phi-vault-contract-profile) · [pii-student](https://github.com/mizcausevic-dev/pii-student-vault-contract-profile) · [mls-data-access](https://github.com/mizcausevic-dev/mls-data-access-vault-contract-profile) · [policyholder](https://github.com/mizcausevic-dev/policyholder-data-vault-contract-profile) · [candidate](https://github.com/mizcausevic-dev/candidate-data-vault-contract-profile) · [financial-customer](https://github.com/mizcausevic-dev/financial-customer-data-vault-contract-profile) · [citizen](https://github.com/mizcausevic-dev/citizen-data-vault-contract-profile) · [attorney-client](https://github.com/mizcausevic-dev/attorney-client-data-vault-contract-profile) · [grid-asset](https://github.com/mizcausevic-dev/grid-asset-data-vault-contract-profile) · [cui-data](https://github.com/mizcausevic-dev/cui-data-vault-contract-profile))
- [`kg-suite-vault-contract-resolver`](https://github.com/mizcausevic-dev/kg-suite-vault-contract-resolver) — for the N-axis intersection logic
- [`kg-suite-conformance-runner-pro`](https://github.com/mizcausevic-dev/kg-suite-conformance-runner-pro) — pre-flight bundle verification before publishing
- [Kinetic Gain Protocol Suite](https://suite.kineticgain.com) — umbrella

## Limits (v0.1)

- **SSG / library only.** No live-fetch landing page yet — that's the next step for the `decisions.kineticgain.com` hosting.
- **No signature verification.** v0.1 shows "signature present / absent." Future versions can verify the ed25519 signature against the KG signing key at `kineticgain.com/.well-known/pulse-signing.json`.
- **English-only.** Future: i18n for the section labels (the Decision Card JSON itself is structured + locale-neutral).

## License

MIT.
