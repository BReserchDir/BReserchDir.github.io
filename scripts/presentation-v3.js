(() => {
  'use strict';
  const E = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const tones = ['#2458c6', '#e98932', '#8250b5', '#a8b2c1', '#40a7b8', '#b64755'];
  const labelColor = hex => {
    const rgb=hex.slice(1).match(/../g).map(x=>parseInt(x,16)/255).map(v=>v<=0.04045?v/12.92:((v+0.055)/1.055)**2.4);
    return rgb[0]*0.2126+rgb[1]*0.7152+rgb[2]*0.0722>0.179?'#111111':'#ffffff';
  };
  let summary = null;
  const topicLabel = id => ({illumination:'Illumination',agents:'Virtual agents',robotics:'XR robotics'}[id] || id);
  function readSummary() { return summary || window.RESEARCH_LITERATURE_V3 || {}; }
  function chart(name, buckets, total, inlineLabels = false) {
    const active = buckets.filter(x => x.ids.length), n = total ?? active.reduce((a,b) => a+b.ids.length,0);
    if (!n) return '<p class="v3-empty">No assessed records in this group.</p>';
    let a = -Math.PI/2, smallLabel = 0;
    const callouts = inlineLabels === "callouts";
    const arcs = active.map((b,i) => {
      const size = b.ids.length/n*Math.PI*2, end = a+size;
      const x = angle => 200+143*Math.cos(angle), y = angle => 187+143*Math.sin(angle);
      const d = size >= Math.PI*2-0.001 ? 'M200 44 A143 143 0 1 1 199.99 44 Z' : `M200 187 L${x(a)} ${y(a)} A143 143 0 ${size>Math.PI?1:0} 1 ${x(end)} ${y(end)} Z`;
      const mid = a+size/2, tx=200+(callouts?78:91)*Math.cos(mid), ty=187+(callouts?78:91)*Math.sin(mid);
      a=end;
      const calloutY=12+30*smallLabel; if(callouts&&b.ids.length<4)smallLabel++;
      const shortLabels={'Single image':['Single','image'],'Video':['Video'],'3D / XR evidence':['3D / XR'],'Diffusion + 3D / inverse':['Diffusion','+ 3D / inverse'],'Image / video diffusion':['Image / video','diffusion'],'Geometry / light transport':['Geometry /','light transport'],'Other / unassessed':['Other /','unassessed'],'Offline / slow updates':['Offline /','slow updates'],'Claimed / unverified':['Claimed /','unverified']};
      const words = b.pieLines || shortLabels[b.label] || [b.label];
      const labels = inlineLabels && (!callouts || b.ids.length>=4) ? words.map((line,j)=>`<text class="v3-pie-label" x="${tx}" y="${ty+7+j*22}" text-anchor="middle" fill="${labelColor(tones[i%tones.length])}">${E(line)}</text>`).join('') : '';
      return `<g class="v3-pie-sector" role="button" tabindex="0" data-v3-source="${E(name)}:${i}" aria-label="${E(b.label)}, ${b.ids.length} ${b.ids.length===1?'record':'records'}"><path d="${d}" fill="${tones[i%tones.length]}" stroke="white" stroke-width="3"/><text class="${inlineLabels?'v3-pie-count':''}" x="${tx}" y="${ty-(inlineLabels&&(!callouts||b.ids.length>=4)?20:0)}" text-anchor="middle" fill="${labelColor(tones[i%tones.length])}">${b.ids.length}</text>${labels}${callouts&&b.ids.length<4?`<path d="M${200+147*Math.cos(mid)} ${187+147*Math.sin(mid)} L${Math.cos(mid)>0?330:70} ${calloutY}" fill="none" stroke="${tones[i%tones.length]}" stroke-width="2"/><text class="v3-callout-label" x="200" y="${calloutY}" text-anchor="middle" fill="#111">${E(b.label)}</text>`:''}</g>`;
    }).join('');
    return `<svg class="v3-pie${inlineLabels?' v3-inline-pie':''}${callouts?' v3-callout-pie':''}" viewBox="0 0 400 ${callouts?370:360}" role="group" aria-label="${E(name)}: ${n} reviewed records">${arcs}</svg>${inlineLabels?'':`<div class="v3-chart-labels">${active.map((b,i)=>`<button data-v3-source="${E(name)}:${i}" style="--tone:${tones[i%tones.length]}"><i></i><span>${E(b.label)}</span><b>${b.ids.length}</b></button>`).join('')}</div>`}`;
  }
  function topicPapers(c,id){return c.data.papers.filter(p=>p.topic===id);}
  function field(p, key){return p.reviewDimensions?.[key] || p.reviewRecord?.[key] || '';}
  function bins(papers, definitions) {
    const result=definitions.map(x=>({label:x.label,ids:[]}));
    for(const p of papers){let k=definitions.findIndex(x=>x.test(p));if(k<0)k=definitions.length-1;result[k].ids.push(p.id);}
    return result;
  }
  function directions(c){
    const t=c.data.reviews?.illumination?.taxonomy || c.data.reviews?.illumination?.problemSpace || {};
    const rows = readSummary().directionChart?.segments;
    if(rows) return rows.map(b=>({label:b.label,ids:b.paperIds||b.ids||[]}));
    const papers=topicPapers(c,'illumination');
    return bins(papers,[{label:'Real light → virtual content',test:p=>/estimat|real light to virtual/i.test(field(p,'decisionRole')+' '+field(p,'sourceGroup'))},{label:'Virtual light → real imagery',test:p=>/relight|real.view|virtual.*real/i.test(field(p,'decisionRole')+' '+field(p,'sourceGroup'))},{label:'Other / mixed / unassessed',test:()=>true}]);
  }
  function runtimeBuckets(papers){return bins(papers,[{label:'Measured live updates',test:p=>p.runtime?.classification==='real-time'},{label:'Interactive / component timing',test:p=>/interactive|near/i.test(p.runtime?.classification||'')},{label:'Offline or timing unverified',test:()=>true}]);}
  function groupPapers(s,c){
    return s.paperIds?.length?s.paperIds.map(id=>c.paper(id)).filter(Boolean):topicPapers(c,s.topicId);
  }
  function chartGroups(s,c){
    if(s.kind==='v3-direction-chart'&&s.topicId==='illumination'){
      const all=directions(c),r=all.filter(b=>/^Real light/.test(b.label)),v=all.filter(b=>/^Virtual light/.test(b.label)),both=all.filter(b=>/^Both directions/.test(b.label));
      const taken=new Set([...r,...v,...both].flatMap(b=>b.ids));
      const other=all.flatMap(b=>b.ids).filter(id=>!taken.has(id));
      return [{name:'Lighting direction',buckets:[{label:'Real light → virtual content',pieLines:['Real light','→ virtual'],ids:[...new Set(r.flatMap(b=>b.ids))]},{label:'Virtual light → real imagery',pieLines:['Virtual light','→ real view'],ids:[...new Set(v.flatMap(b=>b.ids))]},{label:'Both directions / composition',pieLines:['Both','directions'],ids:[...new Set(both.flatMap(b=>b.ids))]},{label:'Related studies and resources',pieLines:['Related','work'],ids:[...new Set(other)]}]}];
    }
    if(s.kind==='v3-drilldown'){
      const source=readSummary().drilldowns?.find(d=>d.id==='virtual-to-captured');
      if(source){
        const combine=(name,key,definitions)=>({name,buckets:definitions.map(def=>({label:def.label,ids:source.charts[key].segments.filter(x=>def.keys.includes(x.id)).flatMap(x=>x.paperIds)}))});
        return [
          combine('Output','view',[{label:'Single image',keys:['image']},{label:'Video',keys:['video']},{label:'3D / XR evidence',keys:['3d','mr-ar','headset']},{label:'Other / unassessed',keys:['unknown','other','na']}]),
          combine('Technique','method',[{label:'Diffusion + 3D / inverse',keys:['diffusion-3d','diffusion-inverse']},{label:'Image / video diffusion',keys:['video-diffusion','image-diffusion']},{label:'Geometry / light transport',keys:['neural3d','inverse','transport','depth-shading']},{label:'Other / unassessed',keys:['projection-optics','unknown']}]),
          combine('Runtime evidence','runtime',[{label:'Measured live update',keys:['live']},{label:'After fitting / component',keys:['prepared','component']},{label:'Offline / slow updates',keys:['offline','slow']},{label:'Claimed / unverified',keys:['claim','estimate','unknown']}])
        ];
      }
      const pool=chartGroups({kind:'v3-direction-chart',topicId:'illumination'},c)[0].buckets[1].ids.map(id=>c.paper(id)).filter(Boolean);
      return [
        {name:'Output',buckets:bins(pool,[{label:'Image',test:p=>/^image$/i.test(p.modality)},{label:'Video',test:p=>/video/i.test(p.modality)},{label:'3D / XR / other',test:()=>true}])},
        {name:'Technique',buckets:bins(pool,[{label:'Diffusion / generative',test:p=>/diffusion|generative|gan/i.test(p.approach+' '+p.method)},{label:'Geometry / rendering',test:p=>/render|depth|mesh|tracing|geometry|3dgs|nerf/i.test(p.approach+' '+p.method)},{label:'Other / hybrid',test:()=>true}])},
        {name:'Runtime evidence',buckets:runtimeBuckets(pool)}
      ];
    }
    const papers=topicPapers(c,s.topicId);
    return [{name:s.chart?.title||'Reviewed capabilities',buckets:bins(papers,s.topicId==='agents'?[
      {label:'Motion / performance',test:p=>/motion|generat|style|synthesis/i.test(p.approach+' '+field(p,'decisionRole'))},
      {label:'Physical execution / interaction',test:p=>/physics|physical|contact|interaction|rl/i.test(p.approach+' '+p.method)},
      {label:'Planning / interfaces / other',test:()=>true}
    ]:[
      {label:'XR interaction / feedback',test:p=>/xr|mixed|augmented|proxy|haptic|visual/i.test(p.approach+' '+p.title)},
      {label:'Robot control / planning',test:p=>/robot|control|plan|camera/i.test(p.title+' '+p.approach)},
      {label:'Supporting work / other',test:()=>true}
    ])}];
  }
  function figure(image,title){return image?`<img src="${E(image)}" alt="${E(title)}" loading="eager">`:'';}
  function plates(items,type){return `<div class="v3-plates ${type}">${items.map((p,i)=>`<article><div class="v3-plate-image">${figure(p.image,p.title)}</div><span class="v3-index">0${i+1}</span><h2>${E(p.title)}</h2><p>${E(p.limit||p.goal||p.text||p.question)}</p></article>`).join('')}</div>`;}
  function rows(items){return `<div class="v3-statements">${items.map((g,i)=>`<article><span>0${i+1}</span><div><h2>${E(g.title||g.label)}</h2><p>${E(g.text||g.question)}</p></div>${g.paperIds?.length?`<button class="v3-evidence-button" data-v3-papers="${E(g.paperIds.join(','))}">Sources ↗</button>`:''}</article>`).join('')}</div>`;}
  window.PresentationV3={
    render(s,c){
      switch(s.kind){
        case 'v3-opening':return plates(s.panels||[], 'v3-limits');
        case 'v3-directions':return plates(s.cards||s.directions||[], 'v3-goals');
        case 'v3-motivation':return `<div class="v3-motivation"><div>${s.directionSummary?`<div class="v3-direction-summary">${s.directionSummary.map(x=>`<article><h3>${E(x.label)}</h3><p>${E(x.text)}</p></article>`).join('')}<p class="v3-shared-gap">${E(s.sharedGap||'')}</p></div>`:(s.bullets||s.points||[]).map((x,i)=>`<p><span>0${i+1}</span>${E(typeof x==='string'?x:x.text||x.label)}</p>`).join('')}<div class="v3-goal"><span>Research goal</span><h2>${E(s.goal||s.aim)}</h2></div></div>${figure(s.image,s.title)}</div>`;
        case 'v3-direction-chart':case 'v3-drilldown':{
          const groups=chartGroups(s,c),n=groups[0]?.buckets.reduce((a,b)=>a+b.ids.length,0)||0;
          return `<div class="v3-corpus-label"><span>${s.kind==='v3-drilldown'?'Virtual light → real imagery':'Reviewed corpus'}</span><b>${n} records</b><button data-v3-papers="${E([...new Set(groups.flatMap(g=>g.buckets.flatMap(b=>b.ids)))].join(','))}">Inspect sources ↗</button></div><div class="v3-chart-grid ${groups.length===1?'v3-single-chart':'v3-linked-charts'}">${groups.map(g=>`<section><h2>${E(g.name)}</h2>${chart(g.name,g.buckets,undefined,s.id==='v3-light-directions')}</section>`).join('')}${s.id==='v3-light-directions'?`<aside class="v3-related-breakdown"><h2>Related work · 33</h2>${[
        {label:'Supporting methods / resources',key:'support'},
        {label:'Perception studies',key:'perception'},
        {label:'Physical light projection',key:'virtual-to-physical'},
        {label:'Mixed estimation + relighting',key:'mixed-estimation-relighting'},
        {label:'Not yet classified',key:'unknown'}
      ].map(item=>{const group=readSummary().directionChart?.segments.find(g=>g.id===item.key);return group?`<button data-v3-papers="${E(group.paperIds.join(','))}"><span>${E(item.label)}</span><b>${group.count}</b></button>`:'';}).join('')}<button class="v3-arrow-button" data-v3-next>Explore virtual → real relighting →</button></aside>`:''}</div><div class="v3-source-drawer" hidden></div>`;
        }
        case 'v3-gap-list':return rows(s.gaps||s.items||[]);
        case 'v3-subtopics':return rows(s.items||s.subtopics||[]);
        case 'v3-method-focus':return `<div class="v3-focus"><div>${figure(s.image,s.title)}<p class="v3-question">${E(s.question||s.lead)}</p></div><div>${[{title:'What exists',text:s.existing},{title:'What remains',text:s.gap},{title:'First test',text:s.firstTest}].map((x,i)=>`<article><span>0${i+1} / ${x.title}</span><p>${E(x.text)}</p></article>`).join('')}${s.paperIds?.length?`<button class="v3-evidence-button" data-v3-papers="${E(s.paperIds.join(','))}">Read the evidence ↗</button>`:''}</div></div><div class="v3-source-drawer" hidden></div>`;
        case 'v3-evaluation':if(s.rows)return `<div class="v3-eval-bars">${s.rows.map(r=>`<article><div><h2>${E(r.title)}</h2><b>${r.total}<span> / 600</span></b></div><div class="v3-eval-track"><i style="width:${r.total/6}%"></i></div></article>`).join('')}<p>${E(s.caption)} Six criteria, unchanged.</p><button class="v3-arrow-button" data-evaluation-workspace>Inspect criteria and rationale →</button></div>`;return `<div class="v3-decision"><h2>${E(s.question||'Which direction deserves the next experiment?')}</h2>${rows(s.items||s.questions?.map(q=>({title:q,text:''}))||[])}<button class="v3-arrow-button" data-evaluation-workspace>Open the versioned evaluation →</button></div>`;
        default:return rows(s.items||s.points||[]);
      }
    },
    mount(host,s,c){
      const show = (ids,title) => {
        let drawer=host.querySelector('.v3-source-drawer');
        if(!drawer){drawer=document.createElement('div');drawer.className='v3-source-drawer';host.append(drawer);}
        const papers=[...new Set(ids)].map(id=>c.paper(id)).filter(Boolean);
        drawer.innerHTML=`<header><h2>${E(title)} · ${papers.length}</h2><button data-v3-dismiss aria-label="Close source list">Close ×</button></header><div>${papers.map(p=>`<button data-v3-paper="${E(p.id)}">${p.sourceFigure?.image||p.thumbnail?`<img src="${E(p.sourceFigure?.image||p.thumbnail)}" alt="Figure from ${E(p.title)}" loading="lazy">`:""}<b>${E(p.shortTitle||p.title)}</b><span>${E(p.publicationLabel||`${p.year||'Year unverified'} · ${p.venueLabel||p.venue||'Venue unverified'}`)}</span></button>`).join('')||'<p>No assessed sources in this group.</p>'}</div>`;drawer.hidden=false;
      };
      const act=event=>{
        const el=event.target.closest('[data-v3-source],[data-v3-papers],[data-v3-dismiss],[data-v3-paper],[data-v3-next]');if(!el||!host.contains(el))return;
        if(el.hasAttribute('data-v3-paper')){c.onPaper(el.dataset.v3Paper);return;}
        if(el.hasAttribute('data-v3-dismiss')){host.querySelector('.v3-source-drawer').hidden=true;return;}
        if(el.hasAttribute('data-v3-next')){document.querySelector('#research-talk [data-talk-next]').click();return;}
        if(el.hasAttribute('data-v3-papers')){show(el.dataset.v3Papers.split(',').filter(Boolean),'Evidence');return;}
        const parts=el.dataset.v3Source.split(':'),g=chartGroups(s,c).find(g=>g.name===parts[0]);
        const active=g?.buckets.filter(b=>b.ids.length)||[],b=active[Number(parts[1])];if(b)show(b.ids,b.label);
      };
      const key=e=>{if((e.key==='Enter'||e.key===' ')&&e.target.matches('[data-v3-source]')){e.preventDefault();act(e);}if(e.key==='Escape'){const drawer=host.querySelector('.v3-source-drawer');if(drawer&&!drawer.hidden){e.preventDefault();e.stopPropagation();drawer.hidden=true;}}};
      host.addEventListener('click',act);host.addEventListener('keydown',key);return()=>{host.removeEventListener('click',act);host.removeEventListener('keydown',key);};
    }
  };
})();
