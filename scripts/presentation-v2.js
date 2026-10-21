(() => {
  'use strict';
  const supported = new Set(['v2-opening', 'v2-chain', 'v2-synthesis', 'v2-tracks', 'v2-first-piece']);
  window.renderPresentationV2 = function (s, {esc, sourceButtons, topic} = {}) {
    if (!supported.has(s.kind)) return null;
    const e = esc || (v => String(v == null ? '' : v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])));
    const refs = ids => ids && ids.length && sourceButtons ? `<div class="v2-sources">${sourceButtons(ids)}</div>` : '';
    const card = (b, i) => `<article class="v2-block"><span class="v2-step">${String(i + 1).padStart(2, '0')}</span><h3>${e(b.label)}</h3><p>${e(b.text)}</p></article>`;
    const actions = () => `${s.feedback ? `<p class="v2-feedback"><strong>Discuss</strong><span>${e(s.feedback)}</span></p>` : ''}${s.mapButtons ? `<div class="v2-actions">${['illumination', 'agents', 'robotics'].map(id => {const t = topic ? topic(id) : null; return `<button type="button" data-v2-map="${id}">${e(t && (t.short || t.title) || id)} evidence map ↗</button>`;}).join('')}</div>` : ''}${s.revisionButton ? '<div class="v2-actions"><button type="button" data-evaluation-revisions>Open versioned evaluation ↗</button></div>' : ''}`;
    if (s.kind === 'v2-chain') return `<div class="v2-chain">${(s.chain || []).map(card).join('')}</div>${actions()}`;
    if (s.kind === 'v2-synthesis') return `<div class="v2-synthesis">${(s.groups || []).map((g, i) => `<article><div class="v2-group-title"><span class="v2-step">${String(i + 1).padStart(2, '0')}</span><h3>${e(g.label)}</h3>${refs(g.ids)}</div><div><small>Shared finding</small><p>${e(g.finding)}</p></div><div class="v2-group-boundary"><small>Remaining bridge</small><p>${e(g.boundary)}</p></div></article>`).join('')}</div>${s.bridge ? `<p class="v2-bridge"><strong>Working gap</strong><span>${e(s.bridge)}</span></p>` : ''}${actions()}`;
    if (s.kind === 'v2-tracks') return `<div class="v2-tracks">${(s.tracks || []).map((t, i) => `<article><span class="v2-step">${String(i + 1).padStart(2, '0')}</span><h3>${e(t.label)}</h3><div><small>Current state</small><p>${e(t.known)}</p></div><div class="v2-track-gap"><small>Gap</small><p>${e(t.gap)}</p></div><div><small>Question to test</small><p>${e(t.question)}</p></div>${refs(t.ids)}</article>`).join('')}</div>${actions()}`;
    return `<div class="v2-blocks">${(s.blocks || []).map(card).join('')}</div>${actions()}`;
  };
})();
