// render.mjs — pure functions that take a Decision Card and produce HTML fragments.
// No DOM dependency; same code runs in Node (for SSG demos + tests) and in the browser.

export function escapeHtml(s) {
  return String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function renderDecisionCardHtml(card) {
  if (!card || typeof card !== "object") return `<p class="err">Empty or invalid Decision Card.</p>`;

  const parts = [];
  parts.push(`<article class="dc">`);
  parts.push(`<h1 class="dc-title">${escapeHtml(card.decision_id ?? card.contract_id ?? "Decision Card")}</h1>`);

  if (card.ai_system) {
    parts.push(renderAiSystem(card.ai_system));
  }

  if (card.data_vault_targets?.length) {
    parts.push(renderDataVaultTargets(card.data_vault_targets));
  }

  if (card.retention_envelope) {
    parts.push(renderRetention(card.retention_envelope));
  }

  if (card.axis_policies) {
    parts.push(renderAxisPolicies(card.axis_policies));
  }

  if (card.cross_binding_refs) {
    parts.push(renderCrossBindingRefs(card.cross_binding_refs));
  }

  parts.push(renderSignatureStatus(card));
  parts.push(`</article>`);
  return parts.join("\n");
}

function renderAiSystem(s) {
  return `
    <section class="dc-section dc-ai-system">
      <h2>AI system</h2>
      <dl>
        <dt>Name</dt><dd>${escapeHtml(s.name)}</dd>
        <dt>Version</dt><dd>${escapeHtml(s.version)}</dd>
        ${s.ai_tool_card_url ? `<dt>AI Tool Card</dt><dd><a href="${escapeHtml(s.ai_tool_card_url)}" rel="noopener">${escapeHtml(s.ai_tool_card_url)}</a></dd>` : ""}
      </dl>
    </section>`;
}

function renderDataVaultTargets(targets) {
  const rows = targets.map((t) => `
    <tr>
      <td><code>${escapeHtml(t.target_id)}</code></td>
      <td>${escapeHtml(t.vault_provider)}</td>
      <td>${escapeHtml(t.vault_tier)}</td>
      <td>${t.fips_140_validated ? "✓" : "—"}</td>
      <td>${t.fedramp_authorized ? "✓" : "—"}</td>
      <td>${(t.fields_tokenized_or_held ?? []).length}</td>
    </tr>`).join("");
  return `
    <section class="dc-section dc-vault">
      <h2>Data vault targets (${targets.length})</h2>
      <table>
        <thead><tr><th>Target</th><th>Provider</th><th>Tier</th><th>FIPS 140</th><th>FedRAMP</th><th>Fields</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </section>`;
}

function renderRetention(env) {
  return `
    <section class="dc-section dc-retention">
      <h2>Retention envelope</h2>
      <dl>
        <dt>Default retention</dt><dd>${env.default_retention_days ?? "—"} days</dd>
        <dt>Legal hold supported</dt><dd>${env.legal_hold_supported ? "✓" : "—"}</dd>
        <dt>Destruction method</dt><dd>${escapeHtml(env.destruction_method ?? "—")}</dd>
      </dl>
    </section>`;
}

function renderAxisPolicies(axes) {
  const axisNames = Object.keys(axes);
  const items = axisNames.map((name) => `<li><code>${escapeHtml(name)}</code> (${Object.keys(axes[name]).length} tiers)</li>`).join("");
  return `
    <section class="dc-section dc-axes">
      <h2>3-axis policy contract</h2>
      <p>This Decision Card uses an N-axis vault contract with <strong>${axisNames.length} orthogonal axes</strong>:</p>
      <ul>${items}</ul>
      ${axisNames.length >= 3 ? `<p class="dc-badge">DefenseTech 3-axis</p>` : ""}
    </section>`;
}

function renderCrossBindingRefs(refs) {
  const rows = Object.entries(refs).map(([k, v]) => `<tr><td><code>${escapeHtml(k)}</code></td><td><a href="${escapeHtml(v)}" rel="noopener">${escapeHtml(v)}</a></td></tr>`).join("");
  return `
    <section class="dc-section dc-cross-binding">
      <h2>Cross-binding refs</h2>
      <table><tbody>${rows}</tbody></table>
    </section>`;
}

function renderSignatureStatus(card) {
  const hasSignature = Boolean(card.signature ?? card.ed25519_signature);
  return `
    <section class="dc-section dc-signature">
      <h2>Signature</h2>
      <p>${hasSignature ? `<strong class="dc-sig-ok">✓ ed25519 signature present</strong>` : `<strong class="dc-sig-missing">No signature attached</strong>`}</p>
    </section>`;
}
