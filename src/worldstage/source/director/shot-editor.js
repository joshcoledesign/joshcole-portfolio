import {defaultPlan,upgradePlan,validatePlan,cameraAt,cameraEndpoints,constrainPoint,editFrames,editAt,sourceToEdit,trimBounds} from './shot-plan.js';
import {createHistory} from './edit-history.js';
import {DEFAULT_MIX,validateMix} from './performance-audio.js';
import {createSoundPreview} from './sound-preview.js';
const $=s=>document.querySelector(s),source=$('#sequence-source'),canvas=$('#sequence-canvas'),ctx=canvas.getContext('2d');
let performance,plan,takeId='',playing=false,exporting=false,loadRevision=0,selected=0,endpoint='from',editTime=0,segment=0,composing=true,drag,playAnchor=0,playStarted=0;
let history,gesture=null,timelineDrag=null,coverage={allowed:false},loadedShore='';
const shoreSource=document.createElement('video');shoreSource.id='sequence-shore-source';shoreSource.muted=true;shoreSource.playsInline=true;shoreSource.preload='auto';shoreSource.hidden=true;source.after(shoreSource);
const videoForShot=i=>plan?.shots[i]?.view==='shoreline'?shoreSource:source;
function coverageControls(){const ready=coverage.shoreline?.status==='ready';$('#shot-view').value=plan?.shots[selected]?.view??'wide';$('#shot-view option[value=shoreline]').disabled=!ready;$('#render-coverage').hidden=ready||!coverage.allowed;$('#render-coverage').disabled=exporting||!coverage.allowed||ready||['queued','rendering'].includes(coverage.shoreline?.status);$('#coverage-status').textContent=ready?'Two views ready. Shot cuts preserve the saved event.':coverage.allowed?'Render the low view once, then choose it for a shot.':'Choose a saved rendered take for alternate coverage.';}
async function loadCoverage(id=takeId){const info=await api('/api/coverage/'+id);if(id!==takeId)return;coverage=info;if(info.shoreline?.status==='ready'&&loadedShore!==info.shoreline.id){await new Promise((resolve,reject)=>{const timer=setTimeout(()=>finish(Error('Shoreline film did not load.')),15000);function finish(error){clearTimeout(timer);shoreSource.removeEventListener('loadeddata',ready);shoreSource.removeEventListener('error',failed);error?reject(error):resolve();}const ready=()=>finish(),failed=()=>finish(Error('Shoreline film did not load.'));shoreSource.addEventListener('loadeddata',ready);shoreSource.addEventListener('error',failed);shoreSource.src=info.shoreline.url;shoreSource.load();});if(id===takeId)loadedShore=info.shoreline.id;}coverageControls();}
const sound=createSoundPreview();let mix={...DEFAULT_MIX};
const time=t=>`${String(Math.floor(t/60)).padStart(2,'0')}:${(t%60).toFixed(2).padStart(5,'0')}`;
async function api(path,body){const response=await fetch(path,body===undefined?undefined:{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});const data=await response.json();if(!response.ok)throw Error(data.error||'The sequence could not be loaded.');return data;}
const status=text=>{$('#sequence-status').textContent=text;};
const handle=f=>(...args)=>Promise.resolve().then(()=>f(...args)).catch(e=>status(e.message));
function pause(){playing=false;source.pause();shoreSource.pause();sound.stop();$('#sequence-play').textContent='▶';$('#sequence-play').setAttribute('aria-label','Play sequence');}
function draw(){
  if(!plan)return;const map=editAt(plan,Math.floor(editTime*24+1e-6)),video=videoForShot(map.shot);if(video.readyState<2||video.seeking||(plan.shots[map.shot].view==='shoreline'&&coverage.shoreline?.status!=='ready')||Math.abs(video.currentTime-map.sourceFrame/24)>.085)return;
  const crop=cameraAt(plan,performance.states,map.sourceFrame);canvas.dataset.sourceFrame=String(map.sourceFrame);canvas.dataset.view=plan.shots[map.shot].view??'wide';ctx.drawImage(video,crop.x,crop.y,crop.w,crop.h,0,0,1280,544);
  if(composing&&!playing){ctx.strokeStyle='#edf2f04d';ctx.lineWidth=1;ctx.beginPath();for(const u of [1/3,2/3]){ctx.moveTo(1280*u,0);ctx.lineTo(1280*u,544);ctx.moveTo(0,544*u);ctx.lineTo(1280,544*u);}ctx.stroke();}
  $('#sequence-time').textContent=time(editTime);$('#sequence-source-time').textContent=`SOURCE ${time(map.sourceFrame/24)} · ${performance.duration_seconds.toFixed(2)}s original`;
  $('#sequence-timeline').value=String(editTime);$('#sequence-shot-name').textContent=plan.shots[map.shot].name.toUpperCase()+(plan.shots[map.shot].view==='shoreline'?' · SHORELINE':'')+(composing&&!playing?' · '+(endpoint==='from'?'START':'END')+' FRAME':'');
  document.querySelectorAll('#shot-strip .shot-select').forEach((b,i)=>{b.setAttribute('aria-current',String(map.shot===i));b.setAttribute('aria-pressed',String(selected===i));});
  if(playing)sound.sync(editTime,editFrames(plan)/24,true,plan);
}
function seek(frame,stop=true){if(stop)pause();const map=editAt(plan,frame);editTime=map.outputFrame/24;segment=map.shot;videoForShot(map.shot).currentTime=map.sourceFrame/24;draw();}
function seekEndpoint(){const s=plan.shots[selected];composing=true;seek(sourceToEdit(plan,selected,endpoint==='from'?s.start:s.end-1));}
function historyButtons(){$('#edit-undo').disabled=exporting||!history?.canUndo;$('#edit-redo').disabled=exporting||!history?.canRedo;$('#shot-earlier').disabled=exporting||selected===0;$('#shot-later').disabled=exporting||!plan||selected===plan.shots.length-1;}
function saveDraft(){if(history&&!gesture)history.record(plan);try{localStorage.setItem('worldstage-shots-v3-'+takeId,JSON.stringify(plan));}catch{}$('#sequence-links').hidden=true;historyButtons();status('Preview updated. Export to save this edit; the source performance stays locked.');}
function beginGesture(){if(!gesture)gesture={before:structuredClone(plan)};}
function endGesture(cancel=false){if(!gesture)return;const before=gesture.before;gesture=null;if(cancel){plan=before;saveDraft();refreshStrip();refreshInspector();seekEndpoint();}else{history.record(plan);historyButtons();}}
function restoreHistory(direction){if(!plan||exporting)return;pause();if(gesture){endGesture(true);return;}const id=plan.shots[selected].id,next=history[direction]();if(!next)return;plan=next;selected=Math.max(0,plan.shots.findIndex(s=>s.id===id));saveDraft();refreshStrip();refreshInspector();seekEndpoint();status(direction==='undo'?'Edit undone.':'Edit redone.');}
function moveShot(from,to){if(exporting||from===to||to<0||to>=plan.shots.length)return;pause();const next=structuredClone(plan),[shot]=next.shots.splice(from,1);next.shots.splice(to,0,shot);plan=validatePlan(next,performance.states.length);selected=to;saveDraft();refreshStrip();refreshInspector();seekEndpoint();status(shot.name+' moved to position '+(to+1)+'.');}
function refreshStrip(){
  const strip=$('#shot-strip');let offset=0;
  for(const [i,s]of plan.shots.entries()){
    let block=[...strip.children].find(b=>b.dataset.shot===s.id);
    if(!block){
      block=document.createElement('div');block.className='shot-block';block.dataset.shot=s.id;
      const b=document.createElement('button');b.className='shot-segment shot-select';b.append(document.createElement('strong'),document.createElement('small'));b.addEventListener('click',()=>{selected=plan.shots.findIndex(s=>s.id===block.dataset.shot);endpoint='from';refreshInspector();seekEndpoint();});block.append(b);
      for(const [edge,key]of [['In','start'],['Out','end']]){const handle=document.createElement('button');handle.className='timeline-handle handle-'+key;handle.setAttribute('role','slider');handle.dataset.edge=key;handle.setAttribute('aria-label','Trim '+s.name+' '+edge);handle.title='Drag to trim '+edge.toLowerCase()+'; arrow keys adjust one frame.';handle.addEventListener('pointerdown',e=>startTimelineDrag(e,block.dataset.shot,key));handle.addEventListener('pointermove',timelinePointerMove);handle.addEventListener('pointerup',finishTimelineDrag);handle.addEventListener('pointercancel',e=>finishTimelineDrag(e,true));handle.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();selected=plan.shots.findIndex(s=>s.id===block.dataset.shot);const bounds=trimBounds(plan,selected,performance.states.length),min=bounds[key==='start'?'startMin':'endMin'],max=bounds[key==='start'?'startMax':'endMax'];trim(key,e.key==='Home'?min:e.key==='End'?max:Math.max(min,Math.min(max,plan.shots[selected][key]+(e.key==='ArrowRight'?1:-1)*(e.shiftKey?6:1))));});block.append(handle);}
      const grip=document.createElement('button');grip.className='shot-grip';grip.textContent='⠿';grip.setAttribute('aria-label','Reorder '+s.name);grip.title='Drag to reorder; left/right arrows move the shot.';grip.addEventListener('pointerdown',e=>startTimelineDrag(e,block.dataset.shot,'order'));grip.addEventListener('pointermove',timelinePointerMove);grip.addEventListener('pointerup',finishTimelineDrag);grip.addEventListener('pointercancel',e=>finishTimelineDrag(e,true));grip.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight'].includes(e.key))return;e.preventDefault();const i=plan.shots.findIndex(s=>s.id===block.dataset.shot);moveShot(i,i+(e.key==='ArrowLeft'?-1:1));});block.append(grip);
    }
    if(strip.children[i]!==block)strip.insertBefore(block,strip.children[i]??null);
    block.style.flex=String(s.end-s.start);const b=block.querySelector('.shot-select');b.setAttribute('aria-label','Edit '+s.name+' shot');b.querySelector('strong').textContent=s.name;b.querySelector('small').textContent=`${(offset/24).toFixed(2)}–${((offset+s.end-s.start)/24).toFixed(2)}s`;offset+=s.end-s.start;
    const bounds=trimBounds(plan,i,performance.states.length);for(const handle of block.querySelectorAll('.timeline-handle')){const key=handle.dataset.edge;handle.setAttribute('aria-valuemin',String(bounds[key==='start'?'startMin':'endMin']/24));handle.setAttribute('aria-valuemax',String(bounds[key==='start'?'startMax':'endMax']/24));handle.setAttribute('aria-valuenow',String(s[key]/24));handle.setAttribute('aria-valuetext',(s[key]/24).toFixed(3)+' source seconds');}
  }
  const total=editFrames(plan);$('#sequence-timeline').max=String((total-1)/24);$('#sequence-duration').textContent=time(total/24);historyButtons();draw();
}
function refreshInspector(){
  coverageControls();
  const s=plan.shots[selected],camera=cameraEndpoints(plan,performance.states,selected),p=camera[endpoint];
  $('#selected-shot-name').textContent=`0${selected+1} · ${s.name}`;$('#shot-length').textContent=((s.end-s.start)/24).toFixed(2)+'s kept';
  const bounds=trimBounds(plan,selected,performance.states.length);
  for(const [key,id]of [['start','in'],['end','out']]){const min=bounds[key==='start'?'startMin':'endMin'],max=bounds[key==='start'?'startMax':'endMax'];const range=$('#shot-'+id+'-range'),number=$('#shot-'+id);range.min=String(min);range.max=String(max);range.value=String(s[key]);number.min=String(min/24);number.max=String(max/24);number.value=String(s[key]/24);}
  historyButtons();$('#shot-preset').value=s.camera?'custom':s.framing;$('#camera-from').setAttribute('aria-pressed',String(endpoint==='from'));$('#camera-to').setAttribute('aria-pressed',String(endpoint==='to'));
  $('#camera-zoom').value=String(p.zoom);$('#camera-x').value=String(p.x*100);$('#camera-y').value=String(p.y*100);$('#camera-zoom-value').textContent=p.zoom.toFixed(2)+'×';$('#camera-x-value').textContent=(p.x*100).toFixed(1)+'%';$('#camera-y-value').textContent=(p.y*100).toFixed(1)+'%';$('#camera-ease').value=camera.ease;
}
function customCamera(){const s=plan.shots[selected];s.camera??=cameraEndpoints(plan,performance.states,selected);return s.camera;}
function startTimelineDrag(e,id,key){
  if(exporting||!plan)return;e.preventDefault();pause();selected=plan.shots.findIndex(s=>s.id===id);beginGesture();refreshInspector();
  const rect=$('#shot-strip').getBoundingClientRect();timelineDrag={pointer:e.pointerId,id,key,x:e.clientX,start:plan.shots[selected].start,end:plan.shots[selected].end,scale:editFrames(plan)/rect.width,target:selected,element:e.currentTarget};
  e.currentTarget.setPointerCapture(e.pointerId);e.currentTarget.focus();if(key==='order')e.currentTarget.closest('.shot-block').classList.add('ordering');
}
function timelinePointerMove(e){
  if(!timelineDrag||timelineDrag.pointer!==e.pointerId)return;const d=timelineDrag;
  if(d.key==='order'){let closest=Infinity;document.querySelectorAll('#shot-strip .shot-block').forEach((b,i)=>{const r=b.getBoundingClientRect(),distance=Math.abs(e.clientX-r.x-r.width/2);if(distance<closest){closest=distance;d.target=i;}});document.querySelectorAll('#shot-strip .shot-block').forEach((b,i)=>b.classList.toggle('drop-target',i===d.target));return;}
  selected=plan.shots.findIndex(s=>s.id===d.id);const bounds=trimBounds(plan,selected,performance.states.length),min=bounds[d.key==='start'?'startMin':'endMin'],max=bounds[d.key==='start'?'startMax':'endMax'];
  trim(d.key,Math.max(min,Math.min(max,d[d.key]+Math.round((e.clientX-d.x)*d.scale))));
}
function finishTimelineDrag(e,cancel=false){if(!timelineDrag||e.pointerId!==timelineDrag.pointer)return;const d=timelineDrag;timelineDrag=null;document.querySelectorAll('#shot-strip .shot-block').forEach(b=>b.classList.remove('ordering','drop-target'));if(!cancel&&d.key==='order')moveShot(plan.shots.findIndex(s=>s.id===d.id),d.target);endGesture(cancel);}
function updatePoint(p,shouldSeek=true){const c=customCamera();c[endpoint]=constrainPoint(p);saveDraft();refreshInspector();if(shouldSeek)seekEndpoint();else draw();}
function trim(key,frame){
  try{const next=structuredClone(plan);next.shots[selected][key]=frame;plan=validatePlan(next,performance.states.length);saveDraft();refreshStrip();refreshInspector();endpoint=key==='start'?'from':'to';refreshInspector();seekEndpoint();}catch(e){status(e.message);refreshInspector();}
}
function setDisabled(value){exporting=value;for(const el of document.querySelectorAll('.sequence-settings input,.sequence-settings select,.sequence-settings button,#sequence-library button,#shot-strip button,#sound-export'))el.disabled=value;historyButtons();coverageControls();}
function updateMix(){for(const key of ['engines','engineDepth','wind','contact','master']){$('#mix-'+key).value=String(mix[key]);$('#mix-'+key+'-value').textContent=Math.round(mix[key]*100)+'%';}$('#sound-export').checked=mix.enabled;sound.setMix(mix);}
function saveMix(){try{localStorage.setItem('worldstage-audio-mix-'+takeId,JSON.stringify(mix));}catch{}updateMix();$('#sequence-links').hidden=true;status('Mix updated. Export to save these sound levels.');}
async function loadTake(id,savedPlan,savedMix){
  const revision=++loadRevision;pause();status('Loading saved performance…');const p=await api('/api/performance/'+id);if(revision!==loadRevision)return;takeId=id;coverage={allowed:false};loadedShore='';performance=p;let draft;
  try{draft=JSON.parse(localStorage.getItem('worldstage-shots-v3-'+id)??localStorage.getItem('worldstage-shots-v2-'+id)??localStorage.getItem('worldstage-shots-'+id));}catch{}
  try{plan=validatePlan(upgradePlan(savedPlan??draft??defaultPlan(p),p.states.length),p.states.length);}catch{plan=validatePlan(upgradePlan(defaultPlan(p),p.states.length),p.states.length);}
  history=createHistory(plan);gesture=null;timelineDrag=null;
  let storedMix;try{storedMix=JSON.parse(localStorage.getItem('worldstage-audio-mix-'+id));}catch{}
  try{mix=validateMix(savedMix??storedMix??DEFAULT_MIX);}catch{mix={...DEFAULT_MIX};}sound.setPerformance(p);updateMix();
  selected=0;endpoint='from';editTime=0;segment=0;composing=true;$('#sequence-take').value=id;$('#sequence-source-note').textContent=`SEED ${p.settings.seed} · MOTION LOCKED`;$('#sequence-links').hidden=true;refreshStrip();refreshInspector();
  await new Promise((resolve,reject)=>{const clean=()=>{clearTimeout(timer);source.removeEventListener('loadeddata',ready);source.removeEventListener('error',failed);};const ready=()=>{clean();resolve();},failed=()=>{clean();reject(Error('The source film could not load. Choose another rendered take.'));};const timer=setTimeout(failed,15000);source.addEventListener('loadeddata',ready);source.addEventListener('error',failed);source.src=`/media/${id}/film`;source.load();});
  if(revision!==loadRevision)return;await loadCoverage(id);if(revision!==loadRevision)return;seekEndpoint();status('Ready. Choose a shot, trim its source range, then compose its start and end frames.');
}
async function refreshLibrary(){const list=$('#sequence-library'),sequences=await api('/api/sequences');list.replaceChildren();for(const s of sequences.filter(s=>s.status==='ready')){const row=document.createElement('div');row.className='saved-sequence';const b=document.createElement('button');b.className='quiet';b.textContent=s.name+' · Load shot plan';b.disabled=exporting;b.addEventListener('click',handle(async()=>{await loadTake(s.sourceTakeId,s.plan,s.mix??{...DEFAULT_MIX,enabled:false});$('#sequence-name').value=s.name;showExport(s);status('Saved sequence loaded. Trimming or composing it creates a new export.');}));const a=document.createElement('a');a.className='quiet';a.textContent='↓ MP4';a.href=`/sequence-media/${s.id}/film?download`;a.download='';row.append(b,a);list.append(row);}}
function showExport(job){$('#sequence-links').hidden=false;$('#sequence-mp4').href=`/sequence-media/${job.id}/film?download`;$('#sequence-json').href=`/sequence-media/${job.id}/plan?download`;}
async function exportSequence(){pause();setDisabled(true);$('#sequence-links').hidden=true;try{let job=await api('/api/sequences',{sourceTakeId:takeId,plan,mix,name:$('#sequence-name').value});while(job.status==='queued'||job.status==='rendering'){status(`${job.message} · ${job.progress}%`);await new Promise(r=>setTimeout(r,500));job=await api('/api/sequences/'+job.id);}if(job.status!=='ready')throw Error(job.message);showExport(job);await refreshLibrary();status('Sequence saved. Trims and camera moves are baked in; original motion is unchanged.');}finally{setDisabled(false);}}
function startClock(){sound.preparePlan(plan);playAnchor=editTime;playStarted=globalThis.performance.now();sound.sync(editTime,editFrames(plan)/24,true,plan);}
$('#sequence-play').addEventListener('click',handle(async()=>{if(playing){pause();return;}composing=false;if($('#sequence-loop').checked&&editAt(plan,Math.round(editTime*24)).shot!==selected)seek(sourceToEdit(plan,selected,plan.shots[selected].start));if(editTime>=(editFrames(plan)-1)/24)seek(0);await videoForShot(editAt(plan,Math.floor(editTime*24+1e-6)).shot).play();playing=true;startClock();$('#sequence-play').textContent='Ⅱ';$('#sequence-play').setAttribute('aria-label','Pause sequence');}));
function tick(){
  if(playing){
    let next=playAnchor+(globalThis.performance.now()-playStarted)/1000;
    const loop=$('#sequence-loop').checked,loopEnd=loop?(sourceToEdit(plan,selected,plan.shots[selected].start)+plan.shots[selected].end-plan.shots[selected].start)/24:editFrames(plan)/24;
    if(next>=loopEnd){if(loop){editTime=sourceToEdit(plan,selected,plan.shots[selected].start)/24;sound.stop();startClock();next=editTime;}else{pause();seek(editFrames(plan)-1);requestAnimationFrame(tick);return;}}
    editTime=next;const map=editAt(plan,Math.floor(editTime*24+1e-6)),target=map.sourceFrame/24;
    const video=videoForShot(map.shot),other=video===source?shoreSource:source;other.pause();if(!video.seeking&&(segment!==map.shot||Math.abs(video.currentTime-target)>.12)){segment=map.shot;if(Math.abs(video.currentTime-target)>1/48)video.currentTime=target;video.play().catch(e=>{pause();status(e.message);});}
    // Prepare a different incoming source while it is paused. Never display its stale frame.
    const shot=plan.shots[map.shot],remaining=(shot.end-map.sourceFrame)/24,nextShot=plan.shots[map.shot+1];
    if(!loop&&nextShot&&remaining<.3){const incoming=videoForShot(map.shot+1);if(incoming!==video&&!incoming.seeking&&Math.abs(incoming.currentTime-nextShot.start/24)>1/48){incoming.pause();incoming.currentTime=nextShot.start/24;}}

    draw();
  }requestAnimationFrame(tick);
}requestAnimationFrame(tick);
shoreSource.addEventListener('seeked',draw);shoreSource.addEventListener('loadeddata',draw);source.addEventListener('seeked',draw);source.addEventListener('loadeddata',draw);source.addEventListener('error',()=>{if(source.getAttribute('src'))status('The source film could not load. Choose another rendered take.');});
$('#sequence-timeline').addEventListener('input',()=>{composing=false;seek(Math.round(Number($('#sequence-timeline').value)*24));});
for(const [id,key]of [['in','start'],['out','end']]){$('#shot-'+id).addEventListener('change',()=>trim(key,Math.round(Number($('#shot-'+id).value)*24)));$('#shot-'+id+'-range').addEventListener('input',()=>trim(key,Number($('#shot-'+id+'-range').value)));}
for(const [id,key]of [['camera-from','from'],['camera-to','to']])$('#'+id).addEventListener('click',()=>{endpoint=key;refreshInspector();seekEndpoint();});
for(const [id,key]of [['camera-zoom','zoom'],['camera-x','x'],['camera-y','y']])$('#'+id).addEventListener('input',()=>{const p=cameraEndpoints(plan,performance.states,selected)[endpoint];p[key]=Number($('#'+id).value)/(key==='zoom'?1:100);updatePoint(p);});
$('#camera-ease').addEventListener('change',()=>{customCamera().ease=$('#camera-ease').value;saveDraft();seekEndpoint();});
$('#camera-match').addEventListener('click',()=>{const c=customCamera();c.to={...c.from};saveDraft();refreshInspector();seekEndpoint();});
$('#camera-reset').addEventListener('click',()=>{delete plan.shots[selected].camera;saveDraft();refreshInspector();seekEndpoint();});
$('#shot-preset').addEventListener('change',()=>{const s=plan.shots[selected];s.framing=$('#shot-preset').value;s.move=s.framing!=='wide';delete s.camera;saveDraft();refreshInspector();seekEndpoint();});
canvas.addEventListener('pointerdown',e=>{if(!plan||exporting)return;pause();beginGesture();if(!composing){selected=editAt(plan,Math.round(editTime*24)).shot;endpoint='from';refreshInspector();seekEndpoint();}const p=cameraEndpoints(plan,performance.states,selected)[endpoint];drag={id:e.pointerId,x:e.clientX,y:e.clientY,p};canvas.setPointerCapture(e.pointerId);canvas.classList.add('dragging');});
canvas.addEventListener('pointermove',e=>{if(!drag||e.pointerId!==drag.id)return;const r=canvas.getBoundingClientRect();updatePoint({x:drag.p.x-(e.clientX-drag.x)/r.width/drag.p.zoom,y:drag.p.y-(e.clientY-drag.y)/r.height/drag.p.zoom,zoom:drag.p.zoom},false);});
for(const type of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(type,()=>{if(drag)endGesture(type==='pointercancel');drag=null;canvas.classList.remove('dragging');});
for(const element of document.querySelectorAll('.sequence-settings input[type=range]:not(.sound-level)'))element.addEventListener('pointerdown',()=>{if(plan&&!exporting)beginGesture();});
document.addEventListener('pointerup',()=>{if(gesture&&!drag&&!timelineDrag)endGesture();});
document.addEventListener('pointercancel',()=>{if(gesture&&!drag&&!timelineDrag)endGesture(true);});
$('#edit-undo').addEventListener('click',()=>restoreHistory('undo'));$('#edit-redo').addEventListener('click',()=>restoreHistory('redo'));
$('#shot-earlier').addEventListener('click',()=>moveShot(selected,selected-1));$('#shot-later').addEventListener('click',()=>moveShot(selected,selected+1));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&gesture){e.preventDefault();drag=null;timelineDrag=null;canvas.classList.remove('dragging');document.querySelectorAll('#shot-strip .shot-block').forEach(b=>b.classList.remove('ordering','drop-target'));endGesture(true);return;}if(!plan||e.target.closest('input,textarea,select,[contenteditable=true]')||!(e.ctrlKey||e.metaKey))return;if(e.key.toLowerCase()==='z'){e.preventDefault();restoreHistory(e.shiftKey?'redo':'undo');}else if(e.key.toLowerCase()==='y'){e.preventDefault();restoreHistory('redo');}});
$('#sequence-take').addEventListener('change',handle(()=>loadTake($('#sequence-take').value)));$('#sequence-export').addEventListener('click',handle(exportSequence));
for(const key of ['engines','engineDepth','wind','contact','master'])$('#mix-'+key).addEventListener('input',()=>{mix[key]=Number($('#mix-'+key).value);saveMix();});
$('#sound-export').addEventListener('change',()=>{mix.enabled=$('#sound-export').checked;saveMix();});
$('#sound-preview').addEventListener('click',handle(async()=>{const enabled=await sound.toggle();$('#sound-preview').textContent=enabled?'Sound on':'Enable sound';$('#sound-preview').setAttribute('aria-pressed',String(enabled));if(enabled&&playing)sound.sync(editTime,editFrames(plan)/24,true,plan);status(enabled?'Sound enabled. Play the sequence to hear the performance.':'Preview sound off. Export sound follows its checkbox.');}));
document.addEventListener('worldstage:takes',handle(async event=>{const takes=event.detail.filter(t=>t.kind==='film'&&!t.cameraView),select=$('#sequence-take'),previous=takeId;select.replaceChildren();for(const t of takes){const o=document.createElement('option');o.value=t.id;o.textContent=t.name;select.append(o);}if(previous&&takes.some(t=>t.id===previous)){select.value=previous;return;}const keeper=takes.find(t=>t.keeper&&t.settings.seed===1&&t.id!=='benchmark')??takes[0];if(keeper){await loadTake(keeper.id);await refreshLibrary();}}));

$('#shot-view').addEventListener('change',()=>{pause();plan.shots[selected].view=$('#shot-view').value;plan.shots[selected].framing='wide';plan.shots[selected].move=false;delete plan.shots[selected].camera;saveDraft();refreshStrip();refreshInspector();seekEndpoint();});
$('#render-coverage').addEventListener('click',handle(async()=>{const id=takeId;let job=await api('/api/coverage',{sourceTakeId:id});coverage.shoreline={status:job.status};coverageControls();while(['queued','rendering'].includes(job.status)){if(id===takeId)$('#coverage-status').textContent=job.message+' · '+job.progress+'%';await new Promise(r=>setTimeout(r,800));job=await api('/api/jobs/'+job.id);}if(job.status!=='ready')throw Error(job.message);if(id===takeId){await loadCoverage(id);status('Shoreline coverage ready. Choose its view for a shot.');}}));
