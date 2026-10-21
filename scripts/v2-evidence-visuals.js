/* Source-figure synthesis and descriptive evidence matrix for Version 2. */
(() => {+'use strict';
const fallbackEsc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function helpers(context={}){
 const esc=context.esc||fallbackEsc;
 const all=context.data?.papers||window.RESEARCH_DATA?.papers||[];
 const find=id=>typeof context.paper==='function'?context.paper(id):Array.isArray(context.paper)?context.paper.find(p=>p.id===id):all.find(p=>p.id===id);
 const pub=p=>p.publicationLabel||`${p.year??'Year unverified'} · ${p.venueLabel||p.venue||'Venue unverified'}`;
 const title=p=>p.shortTitle||p.title||p.id;
 const image=p=>p.sourceFigure?.image||p.thumbnail;
 const ref=id=>{const p=find(id);return p?`<button type="button" data-talk-paper="${esc(id)}" class="v2ev-ref">${esc(title(p))}<small>${esc(pub(p))}</small></button>`:`<span>${esc(id)} · source pending</span>`;};
 const figure=(id,large=false)=>{const p=find(id);if(!p)return '';const src=image(p);return `<figure class="v2ev-figure ${large?'v2ev-figure-large':''}"><button type="button" data-talk-paper="${esc(id)}" aria-label="Open original source: ${esc(title(p))}">${src?`<img src="${esc(src)}" alt="Original paper figure: ${esc(title(p))}" loading="eager">`:'<span class="v2ev-missing">Original source figure pending</span>'}</button><figcaption><strong>${esc(title(p))}</strong><span>${esc(pub(p))}</span>${large?`<small>${esc(p.sourceFigure?.attribution||p.thumbnailAttribution||'Figure belongs to the original authors')} · ${esc(p.sourceFigure?.locator||'Source figure; inspect linked paper')}</small>`:''}</figcaption></figure>`;};
 return {esc,find,pub,title,ref,figure};
}
function taxonomy(s,c){return c.taxonomy||c.evidenceMaps?.[s.topicId]||c.data?.evidenceMaps?.[s.topicId]||window.RESEARCH_STORY_V2?.evidenceMaps?.[s.topicId];}
function synthesis(s,c){const h=helpers(c),{esc}=h;const groups=s.groups||[];
 return `<div class="v2ev-synthesis" data-v2ev-root><div class="v2ev-strands">${groups.map((g,i)=>`<section class="v2ev-strand"><button type="button" class="v2ev-strand-select" data-v2ev-group="${i}" aria-pressed="${i===0}"><span>0${i+1}</span><h3>${esc(g.label)}</h3></button><div class="v2ev-filmstrip">${(g.ids||[]).map(id=>h.figure(id)).join('')}</div><p>${esc(g.finding)}</p><div class="v2ev-strand-boundary"><small>What this does not establish</small>${esc(g.boundary)}</div></section>`).join('')}</div><div class="v2ev-convergence" aria-hidden="true"><i></i><span>Evidence across the groups → the remaining bridge</span><i></i></div><div class="v2ev-gap"><span>WORKING GAP</span><strong>${esc(s.bridge||s.gap||'Which production requirement remains untested across these results?')}</strong></div><div class="v2ev-inspector" data-v2ev-inspector aria-live="polite">${inspector(groups[0],h)}</div></div>`;
}
function inspector(group,h){if(!group)return '';return `<div class="v2ev-inspector-figures">${(group.ids||[]).map(id=>h.figure(id,true)).join('')}</div><div class="v2ev-inspector-text"><small>Selected evidence strand</small><h4>${h.esc(group.label)}</h4><p>${h.esc(group.finding)}</p><p><b>Boundary:</b> ${h.esc(group.boundary)}</p><small>Click a figure for its paper, reading scope and original source.</small></div>`;}
function matrix(s,c){const h=helpers(c),{esc}=h,t=taxonomy(s,c);if(!t)return '<p class="v2ev-no-data">The selected evidence map has not been supplied.</p>';
 const groups=s.groups||c.groups||[],rows=t.papers||[],cols=t.columns||[];
 return `<div class="v2ev-matrix" data-v2ev-root><div class="v2ev-matrix-tools"><span>${rows.length} selected cited papers · descriptive evidence types</span><div role="group" aria-label="Evidence strand"><button type="button" data-v2ev-filter="all" aria-pressed="true">All evidence</button>${groups.map((g,i)=>`<button type="button" data-v2ev-filter="${i}" aria-pressed="false">${esc(g.label)}</button>`).join('')}</div></div><div class="v2ev-matrix-scroll"><table><thead><tr><th scope="col">Primary source · year / venue</th>${cols.map(col=>`<th scope="col" title="${esc(col.rationale)}">${esc(col.label)}</th>`).join('')}</tr></thead><tbody>${rows.map(row=>{const p=h.find(row.id);return `<tr data-v2ev-row="${esc(row.id)}"><th scope="row">${p?`<button type="button" data-talk-paper="${esc(row.id)}">${h.figure(row.id).includes('<img')?`<img src="${esc(p.sourceFigure?.image||p.thumbnail)}" alt="">`:''}<span>${esc(h.title(p))}<small>${esc(h.pub(p))}</small></span></button>`:esc(row.id)}</th>${cols.map(col=>{const values=row.values?.[col.id]||['unknown'];return `<td><button type="button" data-v2ev-cell="${esc(row.id)}" data-v2ev-axis="${esc(col.id)}" aria-label="Inspect ${esc(col.label)} evidence for ${esc(p?h.title(p):row.id)}">${values.map(id=>`<span class="v2ev-evidence-type ${id==='unknown'?'v2ev-unknown':''}">${esc(col.categories?.find(v=>v.id===id)?.label||id)}</span>`).join('')}</button></td>`;}).join('')}</tr>`;}).join('')}</tbody></table></div><div class="v2ev-matrix-detail" data-v2ev-detail aria-live="polite"><strong>Inspect an evidence cell</strong><span>Each cell states a reported scope or a source boundary; these are not capability scores.</span></div><p class="v2ev-matrix-note">Selected-source view; unknown ≠ absent. Multiple tags describe different demonstrations. Categories and paper counts do not establish novelty or end-to-end performance.</p></div>`;
}
window.V2Evidence={
 render(s,context={}){return s.kind==='v2-synthesis'?synthesis(s,context):s.kind==='v2-evidence-matrix'?matrix(s,context):'';},
 mount(host,s,context={}){
  const h=helpers(context);let dead=false;
  function click(event){if(dead)return;const source=event.target.closest('[data-talk-paper]');if(source&&host.contains(source)&&typeof context.onPaper==='function'){event.stopPropagation();context.onPaper(source.dataset.talkPaper);return;}const group=event.target.closest('[data-v2ev-group]');if(group&&host.contains(group)){
   const selected=(s.groups||[])[Number(group.dataset.v2evGroup)];host.querySelectorAll('[data-v2ev-group]').forEach(el=>el.setAttribute('aria-pressed',String(el===group)));const panel=host.querySelector('[data-v2ev-inspector]');if(panel)panel.innerHTML=inspector(selected,h);return;
  }
  const filter=event.target.closest('[data-v2ev-filter]');if(filter&&host.contains(filter)){
   const groups=s.groups||context.groups||[],key=filter.dataset.v2evFilter,ids=key==='all'?null:new Set(groups[Number(key)]?.ids||[]);host.querySelectorAll('[data-v2ev-filter]').forEach(el=>el.setAttribute('aria-pressed',String(el===filter)));host.querySelectorAll('[data-v2ev-row]').forEach(el=>{el.classList.toggle('v2ev-row-muted',!!ids&&!ids.has(el.dataset.v2evRow));el.classList.toggle('v2ev-row-matched',!!ids&&ids.has(el.dataset.v2evRow));});return;
  }
  const cell=event.target.closest('[data-v2ev-cell]');if(cell&&host.contains(cell)){
   const t=taxonomy(s,context),row=t?.papers.find(p=>p.id===cell.dataset.v2evCell),col=t?.columns.find(p=>p.id===cell.dataset.v2evAxis),p=h.find(row?.id);if(!row||!col)return;const ev=row.fieldEvidence?.[col.id],reason=ev?.rationale||row.mappingNotes?.[col.id]||'Specific classification rationale has not been recorded; inspect the primary source before relying on this tag.';
   host.querySelectorAll('[data-v2ev-row]').forEach(el=>el.classList.toggle('v2ev-row-active',el.dataset.v2evRow===row.id));host.querySelectorAll('[data-v2ev-cell]').forEach(el=>el.classList.toggle('v2ev-cell-active',el===cell));
   const panel=host.querySelector('[data-v2ev-detail]');if(panel)panel.innerHTML=`<strong>${h.esc(p?h.title(p):row.id)} · ${h.esc(col.label)}</strong><span>${h.esc(reason)}</span><small>${h.esc(row.readStatus||'Reading scope unverified')}</small>`;
  }
 }
 host.addEventListener('click',click);return()=>{dead=true;host.removeEventListener('click',click);};
 }
};
})();
