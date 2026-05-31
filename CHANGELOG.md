# Changelog

## [0.1] — 2026-05-31

### Added

- `renderDecisionCardHtml(card)` pure function producing an HTML fragment. Runs in Node (for SSG) + browser (for live-fetch). No framework dependency.
- Sections rendered: AI system · data vault targets · retention envelope · N-axis policy contract (with DefenseTech 3-axis badge) · cross-binding refs · signature status.
- `escapeHtml()` runs on every interpolated string — no raw HTML injection from Decision Card JSON.
- SSG demo (`npm run demo`) builds a static `dist/index.html` rendering the example DefenseTech Decision Card.
- Strict CSP-compliant HTML (no third-party scripts, no analytics, no remote fonts).
- Dark-themed slate-indigo palette consistent with other Suite surfaces.
- 9 unit tests covering: title rendering, vault target table, retention block, 3-axis badge logic, cross-binding refs, signature present/absent, XSS escape, empty-card fallback.

### Not yet

- Live-fetch landing page (today the SSG renders local JSON; live-fetch UI is the natural next step).
- ed25519 signature verification against KG's public key.
- i18n for section labels.
- Per-vertical color theming (today all verticals share the slate-indigo theme).
- Print stylesheet for "save as PDF" by procurement reviewers.
