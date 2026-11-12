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
  function branchGroups(id){
    const d=readSummary().drilldowns.find(x=>x.id===id), records=readSummary().records.filter(r=>d.paperIds.includes(r.id));
    const partition=(name,defs)=>({name,buckets:bins(records,defs.map(x=>({label:x.label,test:x.test}))) });
    const from=(name,key,defs)=>({name,buckets:defs.map(x=>({label:x.label,ids:d.charts[key].segments.filter(b=>x.keys.includes(b.id)).flatMap(b=>b.paperIds)}))});
    const locality=partition('Lighting locality',[{label:'Nearby lighting',test:r=>r.sourceValues.locality.includes('local')},{label:'Spatially varying',test:r=>r.sourceValues.locality.includes('spatial')},{label:'Global / environment',test:r=>r.sourceValues.locality.includes('environment')},{label:'Unassessed / other',test:()=>true}]);
    const technique=partition('Relighting technique',[{label:'Geometry / light transport',test:r=>['neural3d','inverse','transport','depth-shading'].includes(r.primaryMethod)},{label:'Diffusion + 3D / inverse',test:r=>['diffusion-3d','diffusion-inverse'].includes(r.primaryMethod)},{label:'Image / video diffusion',test:r=>['video-diffusion','image-diffusion'].includes(r.primaryMethod)},{label:'Other / unassessed',test:()=>true}]);
    const view=partition('Demonstrated output',[{label:'AR / MR / headset',test:r=>['ar','mr','headset'].some(x=>r.sourceValues.view.includes(x))},{label:'Video',test:r=>r.sourceValues.view.includes('video')},{label:'Single image',test:r=>r.sourceValues.view.includes('image')},{label:'3D / other',test:()=>true}]);
    const runtime=from('Runtime evidence','runtime',[{label:'Measured live',keys:['live']},{label:'Prepared / component',keys:['prepared','component','baked']},{label:'Offline / slow',keys:['offline','slow']},{label:'Mixed / unverified',keys:['claim','estimate','unknown','na','mixed']}]);
    return [id==='real-to-virtual'?locality:technique,view,runtime];
  }
  function paperPanel(ids,c,title){
    const preferred=['handlight','limo','lightlab','review-ref-85','genlit'];
    const all=[...new Set(ids)].map(id=>c.paper(id)).filter(Boolean);
    const ranked=all.sort((a,b)=>Number(Boolean(b.sourceFigure?.image||b.thumbnail))-Number(Boolean(a.sourceFigure?.image||a.thumbnail)) || (Number(b.year)||0)-(Number(a.year)||0) || (preferred.includes(a.id)?-1:0)-(preferred.includes(b.id)?-1:0));
    const illustrated=ranked.filter(p=>p.sourceFigure?.image||p.thumbnail);
    const shown=all.length&&all.every(p=>['agents','robotics'].includes(p.topic))&&illustrated.length?illustrated.slice(0,6):ranked.slice(0,6);
    return `<h2>${E(title)}</h2><div class="v3-paper-grid" style="--paper-rows:${Math.max(1,Math.ceil(shown.length/2))}">${shown.map(p=>`<button data-v3-paper="${E(p.id)}">${p.sourceFigure?.image||p.thumbnail?`<img src="${E(p.sourceFigure?.image||p.thumbnail)}" alt="Figure from ${E(p.title)}">`:'<div class="v3-no-figure">Paper</div>'}<span><b>${E(({'handlight':'HandLight','limo':'LiMo','lightlab':'LightLab','review-ref-85':'HybRelighter','genlit':'GenLit','stymo':'STyMo','walk-like-this':'Walk Like This'}[p.id])||p.shortTitle||p.title)}</b><small>${E(p.year||'Year unverified')} · ${E(p.venueLabel||p.venue||'Venue unverified')}</small></span></button>`).join('')||'<p>No source papers in this category.</p>'}</div><button class="v3-all-selected" data-v3-papers="${E(ids.join(','))}">All ${ids.length} sources ↗</button>`;
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
  function lightTaxonomy(s) {
    const reviewed = readSummary();
    const directions = reviewed.drilldowns.filter(d=>['real-to-virtual','virtual-to-captured'].includes(d.id));
    const ids = directions.find(d=>d.id===s.branchId).paperIds;
    const included = new Set(ids);
    const records = reviewed.records.filter(r=>included.has(r.id));
    const partition = (name, definitions)=>({name,buckets:bins(records,definitions)});
    const near = r=>r.sourceValues.locality.some(tag=>['local','spatial'].includes(tag));
    const environment = r=>r.sourceValues.locality.includes('environment');
    const shadow = r=>r.sourceValues.transport.includes('shadow');
    const groups = [
      {name:'Lighting direction',buckets:directions.map(d=>({
        label:d.id==='real-to-virtual'?'Real → virtual':'Virtual → real video',
        ids:d.paperIds
      }))},
      partition('Lighting locality',[
        {label:'Nearby / spatial only',test:r=>near(r)&&!environment(r)},
        {label:'Environment only',test:r=>environment(r)&&!near(r)},
        {label:'Both scales',test:r=>near(r)&&environment(r)},
        {label:'Unspecified',test:r=>!near(r)&&!environment(r)}
      ]),
      partition('Shadow evidence',[
        {label:'Shadows documented',test:shadow},
        {label:'Other effects documented',test:r=>!shadow(r)&&r.sourceValues.transport.some(tag=>['direct','specular','indirect'].includes(tag))},
        {label:'Unspecified',test:r=>!r.sourceValues.transport.some(tag=>['shadow','direct','specular','indirect'].includes(tag))}
      ]),
      partition('Primary approach',[
        {label:'Lighting estimation',test:r=>r.primaryMethod==='light-estimation'},
        {label:'Geometry / transport',test:r=>['depth-shading','inverse','neural3d','transport','projection-optics'].includes(r.primaryMethod)},
        {label:'Diffusion',test:r=>['diffusion-3d','diffusion-inverse','image-diffusion','video-diffusion'].includes(r.primaryMethod)},
        {label:'Unclassified',test:r=>r.primaryMethod==='unknown'}
      ])
    ];
    return {groups,ids,total:directions.reduce((sum,d)=>sum+d.paperIds.length,0),inventory:reviewed.records.length};
  }
  function chartGroups(s,c){
    if(s.kind==='v4-light-taxonomy')return lightTaxonomy(s).groups;
    if(s.kind==='v3-topic-chart'){const review=readSummary().topicReviews[s.reviewTopicId||s.topicId];return [review.main,...review.branches[s.reviewBranch].groups];}
    if(s.kind==='v3-direction-chart'&&s.topicId==='illumination'){
      const all=directions(c),r=all.filter(b=>/^Real light/.test(b.label)),v=all.filter(b=>/^Virtual light/.test(b.label)),both=all.filter(b=>/^Both directions/.test(b.label));
      const taken=new Set([...r,...v,...both].flatMap(b=>b.ids));
      const other=all.flatMap(b=>b.ids).filter(id=>!taken.has(id));
      const main = [{name:'Lighting direction',buckets:[{label:'Real light → virtual content',pieLines:['Real light','→ virtual'],ids:[...new Set(r.flatMap(b=>b.ids))]},{label:'Virtual light → real imagery',pieLines:['Virtual light','→ real view'],ids:[...new Set(v.flatMap(b=>b.ids))]},{label:'Both directions / composition',pieLines:['Both','directions'],ids:[...new Set(both.flatMap(b=>b.ids))]},{label:'Related studies and resources',pieLines:['Related','work'],ids:[...new Set(other)]}]}];
      return [...main,...branchGroups('real-to-virtual')];
    }
    if(s.kind==='v3-drilldown'&&s.branchId)return [chartGroups({kind:'v3-direction-chart',topicId:'illumination'},c)[0],...branchGroups(s.branchId)];
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
  function annotatedLightingScene(image) {
    return `<figure class="v4-scene-figure">
      <div class="v4-scene-frame">
        <div class="v4-scene">
          ${figure(image,'An XR wearer looks toward a real performer and sphere beside a virtual performer and cube. Callouts distinguish a nearby real spotlight, distant environment lighting captured in an HDR image, and a blue virtual spotlight.')}
          <svg viewBox="0 0 1672 941" class="v4-scene-overlay" aria-hidden="true">
            <path class="virtual" d="M1256 551 L1357 540 L1515 552 L1515 735 L1375 756 L1256 730Z"/>
            <ellipse class="physical" cx="719" cy="579" rx="115" ry="111"/>
            <path class="effect" d="M816 692 Q947 695 1000 735 Q958 769 826 746 L733 716Z"/>
            <g class="physical">
              <path d="M452 69 L346 91"/><rect x="452" y="39" width="340" height="61" rx="12"/><text x="472" y="80">Nearby real spotlight</text>
              <path d="M637 328 L721 320"/><rect x="348" y="298" width="289" height="61" rx="12"/><text x="368" y="339">Real performer</text><path d="M523 748 L615 640"/><rect x="274" y="748" width="294" height="61" rx="12"/><text x="294" y="789">Real sphere</text>
              <path d="M319 282 L251 355"/><rect x="298" y="221" width="315" height="61" rx="12"/><text x="318" y="262">XR headset wearer</text>
            </g>
            <g class="environment">
              <path d="M898 178 L898 215 M860 177 L843 211 M936 177 L953 211"/>
              <rect x="605" y="111" width="586" height="66" rx="12"/><text x="898" y="154" text-anchor="middle">Background light · HDR image (IBL)</text>
            </g>
            <g class="virtual">
              <path d="M1343 82 L1468 104"/><rect x="1024" y="42" width="320" height="61" rx="12"/><text x="1044" y="83">Virtual spotlight</text>
              <path d="M1353 411 L1209 355"/><rect x="1268" y="412" width="333" height="61" rx="12"/><text x="1288" y="453">Virtual performer</text>
              <path d="M1402 782 L1388 750"/><rect x="1301" y="783" width="270" height="61" rx="12"/><text x="1321" y="824">Virtual cube</text>
            </g>
            <g class="effect">
              <path d="M879 798 L895 748"/><rect x="699" y="799" width="468" height="61" rx="12"/><text x="719" y="840">Shadow in the displayed video</text>
            </g>
          </svg>
        </div>
      </div>
      <figcaption>
        <div><b>Real light → virtual content</b><span>Image-based lighting (IBL) uses an HDR view of the real surroundings to light the virtual cube, alongside nearby lamps and shadows from real objects.</span></div>
        <div><b>Virtual light → real video</b><span>The headset changes the captured sphere and tabletop to show blue illumination and a cast shadow.</span></div>
      </figcaption>
    </figure>`;
  }
  function plates(items,type){return `<div class="v3-plates ${type}">${items.map((p,i)=>`<article><div class="v3-plate-image">${figure(p.image,p.title)}</div><span class="v3-index">0${i+1}</span><h2>${E(p.title)}</h2><p>${E(p.limit||p.goal||p.text||p.question)}</p></article>`).join('')}</div>`;}
  function rows(items){return `<div class="v3-statements">${items.map((g,i)=>`<article><span>0${i+1}</span><div><h2>${E(g.title||g.label)}</h2><p>${E(g.text||g.question)}</p></div>${g.paperIds?.length?`<button class="v3-evidence-button" data-v3-papers="${E(g.paperIds.join(','))}">Sources ↗</button>`:''}</article>`).join('')}</div>`;}
  window.PresentationV3={
    render(s,c){
      switch(s.kind){
        case 'v4-light-space':
          return `<div class="v4-light-space"><div class="v4-light-controls"><button type="button" data-v4-stage-toggle aria-expanded="false">Explore the 3D stage</button><span data-v4-stage-status aria-live="polite"></span></div><div data-v4-static>${annotatedLightingScene(s.image)}</div><section class="v2m-hero" data-v4-stage hidden><div data-v2m-stage></div><label>Move the lights <input type="range" min="0" max="100" value="50" data-v2m-light-change></label><p>Drag to orbit. Scroll to zoom. This stage shows light placement and geometry.</p></section></div>`;
        case 'v4-control-space':
          return `<div class="v4-control-space"><div>${s.examples.map(x=>`<article><h2>${E(x.title)}</h2><p>${E(x.text)}</p></article>`).join('')}</div><figure>${figure(s.image,'Proposal figure showing direct, guided and automated control of agents and equipment')}<figcaption>Proposal figure · Character direction above, equipment control below</figcaption></figure></div>`;
        case 'v4-evidence-gaps':
          return `<div class="v4-gap-grid">${s.items.map(g=>`<article><h2>${E(g.title)}</h2><p>${E(g.text)}</p><div class="v4-gap-papers">${g.papers.map(example=>{
            const p=c.paper(example.id),image=p.sourceFigure?.image||p.thumbnail;
            return `<button type="button" data-v3-paper="${E(example.id)}">${figure(image,p.title)}<span><b>${E(example.label)}</b><small>${E(example.evidence)}</small></span></button>`;
          }).join('')}</div></article>`).join('')}</div>`;
        case 'v4-light-taxonomy':{
          const {groups,ids,total,inventory}=lightTaxonomy(s);
          return `<div class="v3-corpus-label v4-taxonomy-scope"><span>${ids.length} records in this direction · ${total} of ${inventory} reviewed records qualify for the two-direction comparison</span><button type="button" data-v3-papers="${E(ids.join(','))}">Inspect sources ↗</button></div><div class="v3-literature-dashboard v4-light-taxonomy"><div class="v3-pie-cluster"><section class="v3-primary-pie" data-direction="${E(s.branchId)}"><h2>Lighting direction</h2>${chart(groups[0].name,groups[0].buckets)}</section><div class="v3-runtime-pies">${groups.slice(1).map(g=>`<section><h3>${E(g.name)}</h3>${chart(g.name,g.buckets)}</section>`).join('')}</div></div><aside class="v3-recent-papers">${paperPanel(ids,c,'Representative papers')}</aside></div><div class="v3-source-drawer" hidden></div>`;
        }
        case 'v3-figure':return `<figure class="v3-full-figure">${figure(s.image,s.title)}<figcaption>${E(s.caption||'')}</figcaption></figure>`;
        case 'v3-opening':return plates(s.panels||[], 'v3-limits');
        case 'v3-directions':return plates(s.cards||s.directions||[], 'v3-goals');
        case 'v3-motivation':return `<div class="v3-motivation ${s.topicId!=='illumination'?'v3-proposal-motivation':''}"><div>${s.directionSummary?`<div class="v3-direction-summary">${s.directionSummary.map(x=>`<article><h3>${E(x.label)}</h3><p>${E(x.text)}</p></article>`).join('')}<p class="v3-shared-gap">${E(s.sharedGap||'')}</p></div>`:(s.bullets||s.points||[]).map((x,i)=>`<p><span>0${i+1}</span>${E(typeof x==='string'?x:x.text||x.label)}</p>`).join('')}<div class="v3-goal"><span>Research goal</span><h2>${E(s.goal||s.aim)}</h2></div></div>${figure(s.image,s.title)}</div>`;
        case 'v3-topic-chart':{
          const review=readSummary().topicReviews[s.reviewTopicId||s.topicId],branch=review.branches[s.reviewBranch],groups=chartGroups(s,c),index=Object.keys(review.branches).indexOf(s.reviewBranch),direction=['real-to-virtual','virtual-to-captured','both-directions'][index];
          return `<div class="v3-corpus-label"><span>${E(branch.label)}</span><b>${branch.paperIds.length} of ${review.corpusSize} reviewed records</b><button data-v3-papers="${E(branch.paperIds.join(','))}">Inspect sources ↗</button></div><div class="v3-literature-dashboard v3-topic-literature"><div class="v3-pie-cluster"><section class="v3-primary-pie" data-direction="${direction}"><h2>Research emphasis · ${review.corpusSize}</h2>${chart(groups[0].name,groups[0].buckets,undefined,true)}</section><div class="v3-runtime-pies">${groups.slice(1).map(g=>`<section><h3>${E(g.name)} · ${branch.paperIds.length}</h3>${chart(g.name,g.buckets)}</section>`).join('')}</div></div><aside class="v3-recent-papers">${paperPanel(branch.paperIds,c,branch.label+' · papers')}</aside></div><div class="v3-source-drawer" hidden></div>`;
        }
        case 'v3-direction-chart':case 'v3-drilldown':{
          const groups=chartGroups(s,c),n=groups[0]?.buckets.reduce((a,b)=>a+b.ids.length,0)||0;
          if(s.id==='v3-light-directions'||s.branchId){
            const overview=s.id==='v3-light-directions',branch=s.branchId||'real-to-virtual';
            const pool=readSummary().drilldowns.find(d=>d.id===branch).paperIds;
            const charts=groups.slice(1);
            return `<div class="v3-corpus-label"><span>${overview?'Full review · real → virtual detail':s.branchLabel}</span><b>${overview?101:pool.length} records</b><button data-v3-papers="${E(pool.join(','))}">Inspect sources ↗</button></div><div class="v3-literature-dashboard"><div class="v3-pie-cluster"><section class="v3-primary-pie" data-direction="${E(branch)}"><h2>Lighting direction · 101</h2>${chart(groups[0].name,groups[0].buckets,undefined,true)}</section><div class="v3-runtime-pies">${charts.map(g=>`<section><h3>${E(g.name)} · ${g.buckets.reduce((n,b)=>n+b.ids.length,0)}</h3>${chart(g.name,g.buckets)}</section>`).join('')}</div></div><aside class="v3-recent-papers">${paperPanel(pool,c,(s.branchLabel||'Real → virtual')+' · recent papers')}</aside></div><div class="v3-source-drawer" hidden></div>`;
          }
          return `<div class="v3-corpus-label"><span>${s.kind==='v3-drilldown'?'Virtual light → real imagery':'Reviewed corpus'}</span><b>${n} records</b><button data-v3-papers="${E([...new Set(groups.flatMap(g=>g.buckets.flatMap(b=>b.ids)))].join(','))}">Inspect sources ↗</button></div><div class="v3-chart-grid ${groups.length===1?'v3-single-chart':'v3-linked-charts'}">${groups.map(g=>`<section><h2>${E(g.name)}</h2>${chart(g.name,g.buckets,undefined,s.id==='v3-light-directions')}</section>`).join('')}${s.id==='v3-light-directions'?`<aside class="v3-related-breakdown"><h2>Related work · 33</h2>${[
        {label:'Supporting methods / resources',key:'support'},
        {label:'Perception studies',key:'perception'},
        {label:'Physical light projection',key:'virtual-to-physical'},
        {label:'Mixed estimation + relighting',key:'mixed-estimation-relighting'},
        {label:'Not yet classified',key:'unknown'}
      ].map(item=>{const group=readSummary().directionChart?.segments.find(g=>g.id===item.key);return group?`<button data-v3-papers="${E(group.paperIds.join(','))}"><span>${E(item.label)}</span><b>${group.count}</b></button>`:'';}).join('')}<button class="v3-arrow-button" data-v3-next>Explore virtual → real relighting →</button></aside>`:''}</div><div class="v3-source-drawer" hidden></div>`;
        }
        case 'v3-gap-list':return `<div class="${s.id==='v3-light-gaps'?'v3-xr-gaps':''}">${rows(s.gaps||s.items||[])}</div>`;
        case 'v3-subtopics':return rows(s.items||s.subtopics||[]);
        case 'v3-method-focus':if(s.paperExamples){return `<div class="v3-local-research ${s.topicId!=='illumination'?'v3-topic-focus':''}"><div class="v3-local-argument"><div><span class="v3-local-kicker">Research question</span><h2>${E(s.question)}</h2>${(s.resourceLinks||[]).map(r=>`<a class="v3-candidate-resource" href="${E(r.url)}" target="_blank" rel="noopener noreferrer">${E(r.label)} ↗</a>`).join('')}</div><div>${[{title:'What exists',text:s.existing},{title:'Gaps',text:s.gap},{title:'First test',text:s.firstTest}].map(x=>`<article><h3>${x.title}</h3>${x.title==='Gaps'&&s.gaps?.length?`<ul class="v3-explicit-gaps">${s.gaps.map(g=>`<li>${E(g)}</li>`).join('')}</ul>`:`<p>${E(x.text)}</p>`}</article>`).join('')}</div></div><section class="v3-paper-examples"><h3>Relevant starting points</h3><div>${s.paperExamples.map(x=>{const p=c.paper(x.id);return `<button data-v3-paper="${E(x.id)}"><img src="${E(p.sourceFigure?.image||p.thumbnail)}" alt="Source figure from ${E(p.title)}"><b>${E(x.name)}</b><small>${E(p.year)} · ${E(x.venue)}</small><span>${E(x.contribution)}</span></button>`;}).join('')}</div></section></div>`;}return `<div class="v3-focus"><div>${figure(s.image,s.title)}<p class="v3-question">${E(s.question||s.lead)}</p></div><div>${[{title:'What exists',text:s.existing},{title:'Gaps',text:s.gap},{title:'First test',text:s.firstTest}].map((x,i)=>`<article><span>0${i+1} / ${x.title}</span><p>${E(x.text)}</p></article>`).join('')}${s.paperIds?.length?`<button class="v3-evidence-button" data-v3-papers="${E(s.paperIds.join(','))}">Read the evidence ↗</button>`:''}</div></div><div class="v3-source-drawer" hidden></div>`;
        case 'v3-evaluation':if(s.rows)return `<div class="v3-eval-bars">${s.rows.map(r=>`<article><div><h2>${E(r.title)}</h2><b>${r.total}<span> / 600</span></b></div><div class="v3-eval-track"><i style="width:${r.total/6}%"></i></div></article>`).join('')}<p>${E(s.caption)} Six criteria, unchanged.</p><button class="v3-arrow-button" data-evaluation-workspace>Inspect criteria and rationale →</button></div>`;return `<div class="v3-decision"><h2>${E(s.question||'Which direction deserves the next experiment?')}</h2>${rows(s.items||s.questions?.map(q=>({title:q,text:''}))||[])}<button class="v3-arrow-button" data-evaluation-workspace>Open the versioned evaluation →</button></div>`;
        default:return rows(s.items||s.points||[]);
      }
    },
    mount(host,s,c){
      if(s.kind==='v4-light-space'){
        const button=host.querySelector('[data-v4-stage-toggle]');
        const stage=host.querySelector('[data-v4-stage]');
        const staticView=host.querySelector('[data-v4-static]');
        const status=host.querySelector('[data-v4-stage-status]');
        let disposeStage=()=>{},active=true;
        button.onclick=async()=>{
          if(!stage.hidden){
            disposeStage();
            stage.hidden=true;
            staticView.hidden=false;
            button.textContent='Explore the 3D stage';
            button.setAttribute('aria-expanded','false');
            return;
          }
          button.disabled=true;
          status.textContent='Loading the 3D stage…';
          stage.hidden=false;
          staticView.hidden=true;
          const dispose=await window.V2LightStage?.mount(host);
          if(!active){dispose?.();return;}
          disposeStage=dispose||(()=>{});
          button.disabled=false;
          if(stage.querySelector('[data-stage-state="ready"]')){
            status.textContent='';
            button.textContent='Show the annotated view';
            button.setAttribute('aria-expanded','true');
          }else{
            stage.hidden=true;
            staticView.hidden=false;
            status.textContent='3D is unavailable in this browser.';
          }
        };
        return()=>{active=false;disposeStage();button.onclick=null;};
      }
      const show = (ids,title) => {
        let drawer=host.querySelector('.v3-source-drawer');
        if(!drawer){drawer=document.createElement('div');drawer.className='v3-source-drawer';host.append(drawer);}
        const papers=[...new Set(ids)].map(id=>c.paper(id)).filter(Boolean);
        drawer.innerHTML=`<header><h2>${E(title)} · ${papers.length}</h2><button data-v3-dismiss aria-label="Close source list">Close ×</button></header><div>${papers.map(p=>`<button data-v3-paper="${E(p.id)}">${p.sourceFigure?.image||p.thumbnail?`<img src="${E(p.sourceFigure?.image||p.thumbnail)}" alt="Figure from ${E(p.title)}" loading="lazy">`:""}<b>${E(({'handlight':'HandLight','limo':'LiMo','lightlab':'LightLab','review-ref-85':'HybRelighter','genlit':'GenLit','stymo':'STyMo','walk-like-this':'Walk Like This'}[p.id])||p.shortTitle||p.title)}</b><span>${E(p.publicationLabel||`${p.year||'Year unverified'} · ${p.venueLabel||p.venue||'Venue unverified'}`)}</span></button>`).join('')||'<p>No assessed sources in this group.</p>'}</div>`;drawer.hidden=false;
      };
      const act=event=>{
        const el=event.target.closest('[data-v3-source],[data-v3-papers],[data-v3-dismiss],[data-v3-paper],[data-v3-next]');if(!el||!host.contains(el))return;
        if(el.hasAttribute('data-v3-paper')){c.onPaper(el.dataset.v3Paper);return;}
        if(el.hasAttribute('data-v3-dismiss')){host.querySelector('.v3-source-drawer').hidden=true;return;}
        if(el.hasAttribute('data-v3-next')){document.querySelector('#research-talk [data-talk-next]').click();return;}
        if(el.hasAttribute('data-v3-papers')){show(el.dataset.v3Papers.split(',').filter(Boolean),'Evidence');return;}
        const parts=el.dataset.v3Source.split(':'),g=chartGroups(s,c).find(g=>g.name===parts[0]);
        const active=g?.buckets.filter(b=>b.ids.length)||[],b=active[Number(parts[1])];if(b){const panel=host.querySelector('.v3-recent-papers');if(panel){panel.innerHTML=paperPanel(b.ids,c,b.label);host.querySelectorAll('[data-v3-source]').forEach(x=>x.classList.toggle('v3-chart-selected',x.dataset.v3Source===el.dataset.v3Source));}else show(b.ids,b.label);}
      };
      const key=e=>{if((e.key==='Enter'||e.key===' ')&&e.target.matches('[data-v3-source]')){e.preventDefault();act(e);}if(e.key==='Escape'){const drawer=host.querySelector('.v3-source-drawer');if(drawer&&!drawer.hidden){e.preventDefault();e.stopPropagation();drawer.hidden=true;}}};
      host.addEventListener('click',act);host.addEventListener('keydown',key);return()=>{host.removeEventListener('click',act);host.removeEventListener('keydown',key);};
    }
  };
})();
