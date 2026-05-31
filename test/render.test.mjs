import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { renderDecisionCardHtml, escapeHtml } from "../src/render.mjs";

const defenseCard = JSON.parse(readFileSync(new URL("../examples/defense-card.json", import.meta.url), "utf8"));

test("renders contract_id in title", () => {
  const html = renderDecisionCardHtml(defenseCard);
  assert.ok(html.includes("STRATOS-VAULT-GUARDIANAI-2026Q4"));
});

test("renders all data vault targets in table", () => {
  const html = renderDecisionCardHtml(defenseCard);
  assert.ok(html.includes("vault-azgov-cui"));
  assert.ok(html.includes("vault-skyflow-tdp"));
});

test("renders retention envelope", () => {
  const html = renderDecisionCardHtml(defenseCard);
  assert.ok(html.includes("2555 days"));
  assert.ok(html.includes("nist-sp-800-88-purge"));
});

test("renders 3-axis badge for DefenseTech vault contracts", () => {
  const html = renderDecisionCardHtml(defenseCard);
  assert.ok(html.includes("dc-badge"));
  assert.ok(html.includes("DefenseTech 3-axis"));
});

test("renders cross-binding refs", () => {
  const html = renderDecisionCardHtml(defenseCard);
  assert.ok(html.includes("defense_decision_record_audit_stream_repo"));
  assert.ok(html.includes("https://github.com/mizcausevic-dev/cmmc-l2-l3-readiness-evidence-bundle"));
});

test("renders signature-present indicator", () => {
  const html = renderDecisionCardHtml(defenseCard);
  assert.ok(html.includes("dc-sig-ok"));
});

test("renders signature-missing indicator when no signature", () => {
  const card = JSON.parse(JSON.stringify(defenseCard));
  delete card.signature;
  const html = renderDecisionCardHtml(card);
  assert.ok(html.includes("dc-sig-missing"));
});

test("escapeHtml escapes special chars", () => {
  assert.equal(escapeHtml("<script>"), "&lt;script&gt;");
  assert.equal(escapeHtml("\"&<>'"), "&quot;&amp;&lt;&gt;&#39;");
});

test("empty card returns error fragment", () => {
  const html = renderDecisionCardHtml(null);
  assert.ok(html.includes("Empty or invalid"));
});
