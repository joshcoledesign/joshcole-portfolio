(()=>{
 const root=document.getElementById('culture-case-studies'),reduced=matchMedia('(prefers-reduced-motion:reduce)'),fullImages={"/portfolio/case-assets/vrc-pre-story-flow.webp":"/portfolio/case-assets/vrc-pre-story-flow-full.webp","/portfolio/case-assets/vrc-vr-flow-1.webp":"/portfolio/case-assets/vrc-vr-flow-1-full.webp","/portfolio/case-assets/vrc-container-details.webp":"/portfolio/case-assets/vrc-container-details-full.webp","/portfolio/case-assets/novensia-nemo-intake.webp":"/portfolio/case-assets/novensia-nemo-intake-full.webp","/portfolio/case-assets/novensia-miller-logo.webp":"/portfolio/case-assets/novensia-miller-logo-full.webp","/portfolio/case-assets/novensia-rory-miller-voice.webp":"/portfolio/case-assets/novensia-rory-miller-voice-full.webp","/portfolio/case-assets/novensia-chapter-01.webp":"/portfolio/case-assets/novensia-chapter-01-full.webp","/portfolio/case-assets/novensia-nemo-sl1-7.webp":"/portfolio/case-assets/novensia-nemo-sl1-7-full.webp","/portfolio/case-assets/union-station-ush-type.webp":"/portfolio/case-assets/union-station-ush-type-full.webp","/portfolio/case-assets/union-station-logo-lockup.webp":"/portfolio/case-assets/union-station-logo-lockup-full.webp","/portfolio/case-assets/nemo-nemo-scrip.webp":"/portfolio/case-assets/nemo-nemo-scrip-full.webp","/portfolio/case-assets/emergence-system-sections.webp":"/portfolio/case-assets/emergence-system-sections-full.webp","/portfolio/case-assets/ouya-e3-event.webp":"/portfolio/case-assets/ouya-e3-event-full.webp","/portfolio/case-assets/willow-willow-box.webp":"/portfolio/case-assets/willow-willow-box-full.webp","/portfolio/case-assets/willow-willow-mark.webp":"/portfolio/case-assets/willow-willow-mark-full.webp","/portfolio/case-assets/willow-willow-sketches.webp":"/portfolio/case-assets/willow-willow-sketches-full.webp","/portfolio/case-assets/willow-willow-pattern.webp":"/portfolio/case-assets/willow-willow-pattern-full.webp","/portfolio/case-assets/willow-willow-stationery.webp":"/portfolio/case-assets/willow-willow-stationery-full.webp","/portfolio/case-assets/emergence-emergence-01.webp":"/portfolio/case-assets/emergence-emergence-01-full.webp"};
 const make=(tag,className,text)=>{const node=document.createElement(tag);if(className)node.className=className;if(text)node.textContent=text;return node;};
 function createContact(container,proof,choices,data){
  const sequence=make('div','cw-sequence cw-contact');sequence.dataset.cwSequence='';
  const nav=make('div','cw-sequence-nav'),label=make('span',null,'EXPLORE THE WORK / '),position=make('output');position.dataset.cwPosition='';label.append(position);
  const controls=make('div');for(const[step,title]of [[-1,'Previous image'],[1,'Next image']]){const b=make('button',null,step<0?'←':'→');b.type='button';b.dataset.cwStep=String(step);b.setAttribute('aria-label',title);controls.append(b);}nav.append(label,controls);
  const rail=make('div','cw-rail');rail.tabIndex=0;rail.setAttribute('aria-label','Project images; scroll sideways');
  const entries=Object.entries(data);
  for(const[id,item]of entries){
   const tile=make('div','cw-tile');tile.dataset.cwChoice=id;tile.style.setProperty('--cw-ratio',String(item.width/item.height));if(item.height>item.width)tile.dataset.cwPortrait='';
   const button=make('button','cw-art');button.type='button';button.dataset.cwOpen=item.src;button.dataset.cwCaption=item.title+' — '+item.caption;button.setAttribute('aria-label','View '+item.title+' full width');
   const image=make('img');image.src=item.src;image.width=item.width;image.height=item.height;image.alt=item.caption;image.loading='lazy';button.append(image);
   const caption=make('span','cw-tile-label',item.title);caption.append(make('span',null,'↗'));tile.append(button,caption);rail.append(tile);
  }
  sequence.append(nav,rail);proof.before(sequence);proof.hidden=true;proof.classList.add('cw-gallery-original');
  for(const button of choices){button.addEventListener('click',()=>{
   const id=button.dataset.acChoice||button.dataset.xcProduct||button.dataset.xcBrand,tile=[...rail.children].find(n=>n.dataset.cwChoice===id);
   if(tile)rail.scrollTo({left:tile.offsetLeft-rail.offsetLeft,behavior:reduced.matches?'instant':'smooth'});
  });}
  sequence.addEventListener('cw:panel',event=>{const id=event.detail.tile.dataset.cwChoice;for(const b of choices)b.setAttribute('aria-pressed',String((b.dataset.acChoice||b.dataset.xcProduct||b.dataset.xcBrand)===id));});
 }
 // Retain source-specific Andculture walkthrough; replace the other fitted gallery boxes.
 for(const gallery of root.querySelectorAll('[data-ac-gallery]:not([data-ac-gallery="andculture"])')){
  const data=JSON.parse(gallery.querySelector('[data-ac-gallery-data]').textContent);createContact(gallery,gallery.querySelector('.ac-gallery-art'),gallery.querySelectorAll('[data-ac-choice]'),data);
 }
 for(const[kind,selector,proofSelector,choicesSelector]of [['product','[data-xc-products]','.xc-product-proof','[data-xc-product]'],['brand','[data-xc-brands]','.xc-brand-art','[data-xc-brand]']]){
  for(const json of root.querySelectorAll(selector)){const section=json.closest('.xc-case');createContact(section,section.querySelector(proofSelector),section.querySelectorAll(choicesSelector),JSON.parse(json.textContent));}
 }
 const willow=root.querySelector('.xc-willow .ns-evidence');if(willow){const figures=[...willow.children].filter(n=>n.matches('figure'));const grid=make('div','cw-willow-editorial');figures[0].before(grid);for(const f of figures)grid.append(f);}
 for(const sequence of root.querySelectorAll('[data-cw-sequence]')){
  const rail=sequence.querySelector('.cw-rail'),tiles=[...rail.children],position=sequence.querySelector('[data-cw-position]');let active=0,pending=false;
  for(const tile of tiles){const img=tile.querySelector('img');if(img&&!tile.style.getPropertyValue('--cw-ratio'))tile.style.setProperty('--cw-ratio',String(Number(img.getAttribute('width'))/Number(img.getAttribute('height'))));}
  const update=()=>{pending=false;const edge=rail.getBoundingClientRect().left;let nearest=0,distance=Infinity;tiles.forEach((tile,i)=>{const d=Math.abs(tile.getBoundingClientRect().left-edge);if(d<distance){distance=d;nearest=i;}});active=nearest;position.textContent=String(active+1).padStart(2,'0')+' / '+String(tiles.length).padStart(2,'0');for(const b of sequence.querySelectorAll('[data-cw-step]'))b.disabled=Number(b.dataset.cwStep)<0?active===0:active===tiles.length-1;sequence.dispatchEvent(new CustomEvent('cw:panel',{detail:{tile:tiles[active]}}));};
  for(const button of sequence.querySelectorAll('[data-cw-step]'))button.addEventListener('click',()=>{const index=Math.max(0,Math.min(tiles.length-1,active+Number(button.dataset.cwStep)));rail.scrollTo({left:tiles[index].offsetLeft-rail.offsetLeft,behavior:reduced.matches?'instant':'smooth'});});
  rail.addEventListener('scroll',()=>{if(!pending){pending=true;requestAnimationFrame(update);}},{passive:true});update();
  // Padding permits the final narrow panel to reach the same reading position.
  const resize=()=>{rail.style.setProperty('--cw-tail',Math.max(0,rail.clientWidth-tiles.at(-1).getBoundingClientRect().width-26)+'px');};new ResizeObserver(resize).observe(rail);resize();
 }
 for(const diagram of root.querySelectorAll('[data-cw-diagram]'))for(const button of diagram.querySelectorAll('[data-cw-pan]'))button.addEventListener('click',()=>{const pan=diagram.querySelector('.cw-diagram-pan');pan.scrollBy({left:pan.clientWidth*.75*Number(button.dataset.cwPan),behavior:reduced.matches?'instant':'smooth'});});
 const viewer=make('dialog','cw-viewer');viewer.setAttribute('aria-label','Full-width project image viewer');viewer.innerHTML='<div class="cw-viewer-header"><div><span class="cw-viewer-count" data-cw-count></span><p class="cw-viewer-caption" data-cw-title></p></div><button type="button" data-cw-prev aria-label="Previous image">← Previous</button><button type="button" data-cw-next aria-label="Next image">Next →</button><button type="button" data-cw-close>Close ✕</button></div><div class="cw-viewer-options"><button type="button" data-cw-fit="width" aria-pressed="true">Full width</button><button type="button" data-cw-fit="image" aria-pressed="false">Whole image</button><label>Zoom <output data-cw-zoom-label>100%</output><input type="range" min="100" max="220" step="10" value="100" data-cw-zoom aria-label="Image zoom"></label></div><div class="cw-viewer-pan"><img class="cw-viewer-image" alt=""></div>';
 document.body.append(viewer);
 const image=viewer.querySelector('.cw-viewer-image'),pan=viewer.querySelector('.cw-viewer-pan'),zoom=viewer.querySelector('[data-cw-zoom]');let collection=[],current=0,returnTarget=null,overflow='';
 const caption=figure=>figure.querySelector('figcaption [data-extended-source],figcaption [data-einstein-source],figcaption [data-source-id],figcaption>span')?.textContent.trim()||figure.querySelector('img')?.alt||'Project image';
 const sourceFor=figure=>{const src=figure.dataset.cwOriginal||figure.querySelector('img')?.getAttribute('src');return src?{src,caption:caption(figure)}:null;};
 const setFit=fit=>{viewer.dataset.fit=fit;for(const b of viewer.querySelectorAll('[data-cw-fit]'))b.setAttribute('aria-pressed',String(b.dataset.cwFit===fit));zoom.disabled=fit!=='width';};
 const render=()=>{const item=collection[current];image.src=fullImages[item.src]||item.src;image.alt=item.caption;viewer.querySelector('[data-cw-title]').textContent=item.caption;viewer.querySelector('[data-cw-title]').title=item.caption;viewer.querySelector('[data-cw-count]').textContent=String(current+1).padStart(2,'0')+' / '+String(collection.length).padStart(2,'0');for(const key of ['prev','next'])viewer.querySelector('[data-cw-'+key+']').disabled=collection.length<2;zoom.value='100';image.style.width='100%';viewer.querySelector('[data-cw-zoom-label]').textContent='100%';setFit('width');pan.scrollTo(0,0);};
 function open(item,target){
  returnTarget=target;const rail=target.closest('.cw-rail'),section=target.closest('.xc-case,#einstein-case-study,#gprs-below-the-surface');
  collection=rail?[...rail.querySelectorAll('[data-cw-open]')].map(b=>({src:b.dataset.cwOpen,caption:b.dataset.cwCaption})):section?[...section.querySelectorAll('figure')].filter(f=>!f.closest('[hidden]')&&!f.classList.contains('ns-em-bloom')).map(sourceFor).filter(Boolean):[];
  const unique=new Set();collection=collection.filter(i=>{if(unique.has(i.src))return false;unique.add(i.src);return true;});current=collection.findIndex(i=>i.src===item.src);if(current<0){collection.unshift(item);current=0;}else collection[current]=item;
  if(section){const style=getComputedStyle(section);viewer.style.setProperty('--cw-accent',style.getPropertyValue('--xc-ink')||style.getPropertyValue('--sx-ink')||style.getPropertyValue('--eb-ink')||'#e0a33e');}
  render();overflow=document.body.style.overflow;document.body.style.overflow='hidden';viewer.showModal();viewer.querySelector('[data-cw-close]').focus({preventScroll:true});
 }
 const advance=delta=>{current=(current+delta+collection.length)%collection.length;render();};
 viewer.querySelector('[data-cw-close]').addEventListener('click',()=>viewer.close());
 viewer.querySelector('[data-cw-prev]').addEventListener('click',()=>advance(-1));viewer.querySelector('[data-cw-next]').addEventListener('click',()=>advance(1));
 for(const b of viewer.querySelectorAll('[data-cw-fit]'))b.addEventListener('click',()=>setFit(b.dataset.cwFit));
 zoom.addEventListener('input',()=>{image.style.width=zoom.value+'%';viewer.querySelector('[data-cw-zoom-label]').textContent=zoom.value+'%';});
 viewer.addEventListener('keydown',event=>{if(event.target.matches('input'))return;if(event.key==='ArrowRight'){event.preventDefault();advance(1);}if(event.key==='ArrowLeft'){event.preventDefault();advance(-1);}});
 viewer.addEventListener('close',()=>{document.body.style.overflow=overflow;returnTarget?.focus({preventScroll:true});image.removeAttribute('src');});
 root.addEventListener('portfolio:case-enter',()=>{if(viewer.open)viewer.close();},true);window.addEventListener('popstate',()=>{if(viewer.open)viewer.close();});
 for(const figure of root.querySelectorAll('.xc-case figure,#einstein-case-study figure,#gprs-below-the-surface figure')){
  if(figure.closest('dialog,.sx-inspector')||figure.matches('.ns-em-bloom,.ac-hotel-cover'))continue;
  const img=figure.querySelector('img');if(!img)continue;
  if(!figure.querySelector('figcaption button')){let cap=figure.querySelector('figcaption');if(!cap){cap=make('figcaption');figure.append(cap);}const button=make('button','cw-view-link','View complete image ↗');button.type='button';button.addEventListener('click',()=>open(sourceFor(figure),button));cap.append(button);}
  if(img.closest('.cw-rail,.cw-art'))continue;
  img.dataset.cwClickable='';img.style.cursor='zoom-in';img.tabIndex=0;img.setAttribute('role','button');img.setAttribute('aria-label','View '+(img.alt||'project image')+' full width');
  img.addEventListener('click',()=>open(sourceFor(figure),img));img.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();open(sourceFor(figure),img);}});
 }
 new MutationObserver(records=>{for(const record of records){const img=record.target;if(img.matches('img[data-cw-clickable]'))img.setAttribute('aria-label','View '+(img.alt||'project image')+' full width');}}).observe(root,{subtree:true,attributes:true,attributeFilter:['alt']});
 // Capture existing inspect actions so every case uses the same full-window viewer.
 root.addEventListener('click',event=>{
  const button=event.target.closest('[data-cw-open],[data-xc-inspect],[data-ac-inspect],[data-xc-product-inspect],[data-xc-brand-inspect],[data-inspect]');if(!button)return;
  let item;if(button.dataset.cwOpen)item={src:button.dataset.cwOpen,caption:button.dataset.cwCaption};
  else if(button.dataset.xcInspect)item={src:button.dataset.xcInspect,caption:button.dataset.xcCaption};
  else if(button.dataset.inspect){const section=button.closest('#gprs-below-the-surface'),data=JSON.parse(section.querySelector('[data-case-assets]').textContent),asset=data[button.dataset.inspect];if(asset)item={src:asset.src,caption:asset.alt};}
  else {const f=button.closest('figure');if(f)item={src:f.querySelector('img').getAttribute('src'),caption:caption(f)};}
  if(item?.src){event.preventDefault();event.stopImmediatePropagation();open(item,button);}
 },true);
})();
