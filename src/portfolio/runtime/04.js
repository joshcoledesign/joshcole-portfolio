(()=>{
 const root=document.getElementById('culture-case-studies'),reduced=matchMedia('(prefers-reduced-motion:reduce)');
 const pipelines={
  'voice-engine':[
   ['AI analysis / structured JSON','A reusable voice profile','Client material becomes a typed voice profile: cadence, conviction, emotional range, verbal habits and boundaries. The engine learns techniques rather than copying phrases.'],
   ['AI strategy / human review','A content brief before a draft','The strategy stage plans the piece against the voice profile. A human reviews the length recommendation before the writer runs.'],
   ['AI writing / validated contract','A draft with a defined job','The writer receives the voice profile and the approved brief. Each stage returns a typed JSON contract so a malformed result cannot silently pass to the next stage.'],
   ['A separate evaluator / revision','A score you can trace','A different model evaluates the original draft, then returns feedback and a revision. The score belongs to the original draft; the revision is not independently rescored.']
  ],
  'identity-pipeline':[
   ['Client input','Start with the actual material','The intake preserves the client’s own language, context and intent. It becomes the evidence for the next stage.'],
   ['AI analysis','Make the foundation explicit','Analysis turns the material into a strategic foundation that can be reviewed and carried into visual exploration. This visual workflow still uses manual handoffs.'],
   ['Human art direction','Choose what the brand should become','Josh steers the visual direction, reference selection, typography, symbols and edits. The identity is a sequence of human judgments supported by tools.'],
   ['Compiled artifact','Carry the decisions forward','The selected direction becomes a deck of guidelines and assets. Artifact handoffs make the reasoning inspectable; automating this visual pipeline is future work.']
  ]
 };
 function animate(image){if(reduced.matches)return;for(const a of image.getAnimations())a.cancel();image.decode().catch(()=>{}).then(()=>{if(!reduced.matches)image.animate([{opacity:.45,translate:'0 18px',scale:'.985'},{opacity:1,translate:'0 0',scale:'1'}],{duration:620,easing:'cubic-bezier(.2,.75,.2,1)'});});}
 for(const section of root.querySelectorAll('.xc-case')){
  const dialog=section.querySelector('.xc-inspector'),inspected=dialog.querySelector('[data-xc-inspector-image]'),zoom=dialog.querySelector('[data-xc-zoom]');
  function inspect(src,caption){inspected.src=src;inspected.alt=caption;dialog.querySelector('[data-xc-inspector-caption]').textContent=caption;zoom.value='100';inspected.style.width='100%';dialog.querySelector('[data-xc-zoom-label]').textContent='100%';dialog.showModal();dialog.querySelector('.xc-inspector-pan').scrollTo(0,0);}
  dialog.querySelector('[data-xc-inspector-close]').addEventListener('click',()=>dialog.close());
  zoom.addEventListener('input',()=>{inspected.style.width=zoom.value+'%';dialog.querySelector('[data-xc-zoom-label]').textContent=zoom.value+'%';});
  for(const button of section.querySelectorAll('[data-xc-inspect]'))button.addEventListener('click',()=>inspect(button.dataset.xcInspect,button.dataset.xcCaption));
  const productJson=section.querySelector('[data-xc-products]'),brandJson=section.querySelector('[data-xc-brands]');
  for(const [kind,json]of [['product',productJson],['brand',brandJson]]){if(!json)continue;const data=JSON.parse(json.textContent),image=section.querySelector('[data-xc-'+kind+'-image]'),caption=section.querySelector('[data-xc-'+kind+'-caption]'),buttons=[...section.querySelectorAll('[data-xc-'+kind+']')];let selected=Object.keys(data)[0];
   function select(id,motion=true){selected=id;const item=data[id];for(const button of buttons)button.setAttribute('aria-pressed',String(button.dataset[kind==='product'?'xcProduct':'xcBrand']===id));image.src=item.src;image.width=item.width;image.height=item.height;image.alt=item.title+' — '+item.caption;caption.textContent=item.caption;if(kind==='brand')section.querySelector('[data-xc-brand-surface]').dataset.xcBrandSurface=id;if(motion)animate(image);}
   for(const button of buttons)button.addEventListener('click',()=>select(button.dataset[kind==='product'?'xcProduct':'xcBrand']));
   section.querySelector('[data-xc-'+kind+'-inspect]').addEventListener('click',()=>inspect(data[selected].src,data[selected].title+' — '+data[selected].caption));select(selected,false);
  }
  for(const pipeline of section.querySelectorAll('[data-xc-pipeline]')){const data=pipelines[pipeline.dataset.xcPipeline],buttons=[...pipeline.querySelectorAll('[data-pipeline-stage]')],detail=pipeline.querySelector('.xc-pipeline-detail');function select(index,motion=true){buttons.forEach((button,i)=>button.setAttribute('aria-pressed',String(i===index)));const [method,artifact,description]=data[index];pipeline.querySelector('[data-pipeline-method]').textContent=method;pipeline.querySelector('[data-pipeline-artifact]').textContent=artifact;pipeline.querySelector('[data-pipeline-description]').textContent=description;if(motion&&!reduced.matches)detail.animate([{opacity:.2,translate:'0 12px'},{opacity:1,translate:'0 0'}],{duration:400,easing:'ease-out'});}buttons.forEach((button,i)=>button.addEventListener('click',()=>select(i)));select(0,false);}
  for(const link of section.querySelectorAll('[data-xc-chapter-link]'))link.addEventListener('click',event=>{const target=section.querySelector(link.getAttribute('href'));if(target){event.preventDefault();target.scrollIntoView({block:'start',behavior:reduced.matches?'instant':'smooth'});}});
 }
 reduced.addEventListener('change',()=>{if(reduced.matches)for(const element of root.querySelectorAll('.xc-case img,.xc-pipeline-detail'))for(const animation of element.getAnimations())animation.cancel();});
})();
