// build-demo.mjs — builds a static HTML demo page rendering an example Decision Card.
import { writeFileSync, mkdirSync, readFileSync, copyFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { renderDecisionCardHtml } from "./render.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = resolve(HERE, "../dist");
const card = JSON.parse(readFileSync(resolve(HERE, "../examples/defense-card.json"), "utf8"));

const fragment = renderDecisionCardHtml(card);

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Decision Card viewer — Kinetic Gain Protocol Suite</title>
  <meta name="description" content="Buyer-facing viewer for AI Procurement Decision Cards. Drop in a URL, see the procurement-review-friendly summary." />
  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'" />
  <meta name="referrer" content="strict-origin-when-cross-origin" />
  <link rel="stylesheet" href="./style.css" />
</head>
<body>
  <header class="topbar">
    <h1>Decision Card viewer</h1>
    <p class="topbar-sub">Demo: rendering an example DefenseTech vault contract</p>
  </header>
  <main>${fragment}</main>
  <footer>
    <p>Part of the <a href="https://suite.kineticgain.com">Kinetic Gain Protocol Suite</a></p>
  </footer>
</body>
</html>`;

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(resolve(OUT_DIR, "index.html"), html, "utf8");
copyFileSync(resolve(HERE, "../assets/style.css"), resolve(OUT_DIR, "style.css"));
console.log(`Wrote demo → ${OUT_DIR}/index.html`);
