import {SETTING_SPEC,DEFAULT_SETTINGS,PILOT_STYLES} from './studio-config.js';
import {createPainter} from './painter.js';
import {validatePlan,cameraAt,editFrames,editAt} from './shot-plan.js';
import {DEFAULT_MIX,validateMix,synthesizePerformance,renderEditedAudio} from './performance-audio.js';

const records=new Map(), urls=new Map(), extensions=new Map();
export const mediaExtension=url=>extensions.get(url)??"json";
const database=new Promise((resolve,reject)=>{
  const request=indexedDB.open('worldstage-studio-v1',1);
  request.onupgradeneeded=()=>request.result.createObjectStore('takes',{keyPath:'id'});
  request.onsuccess=()=>resolve(request.result);
  request.onerror=()=>reject(Error('Browser storage is unavailable. Allow site storage to save takes.'));
});
async function save(record){
  const db=await database;
  await new Promise((resolve,reject)=>{
    const tx=db.transaction('takes','readwrite');tx.objectStore('takes').put(record);
    tx.oncomplete=resolve;tx.onerror=()=>reject(Error('This browser could not save the take. Download existing films to keep a copy and free site storage.'));
  });
  records.set(record.id,record);
}
const ready=(async()=>{
  const response=await fetch('./benchmark.json');if(!response.ok)throw Error('The preserved performance could not load.');
  const performance=await response.json();
  records.set('benchmark',{id:'benchmark',performance,job:jobFor('benchmark',performance,'Approved cinematic landing','film'),static:true});
  const db=await database, saved=await new Promise((resolve,reject)=>{
    const request=db.transaction('takes').objectStore('takes').getAll();request.onsuccess=()=>resolve(request.result);request.onerror=reject;
  });
  for(const record of saved){if(['queued','rendering'].includes(record.job.status)){record.job.status='failed';record.job.message='Painting was interrupted. The saved source motion is preserved; render it again.';}records.set(record.id,record);}
})();
function metrics(p){return {contact_seconds:p.contact_seconds,video_contact_seconds:p.video_contact_seconds,duration_seconds:p.duration_seconds,physicsSummary:p.physicsSummary,flightResult:p.flightResult};}
function jobFor(id,p,name,kind='motion'){return {id,performanceId:id,name,kind,settings:p.settings,frame:108,createdAt:new Date().toISOString(),status:'ready',progress:100,message:'Motion saved in this browser',metrics:metrics(p),motionHash:p.stateHash,keeper:id==='benchmark'};}
const copy=value=>structuredClone(value);
function recordFor(id){const record=records.get(id);if(!record)throw Error('This take is not saved in this browser.');return record;}
function jsonBlob(data){return new Blob([JSON.stringify(data,null,2)],{type:'application/json'});}
export function mediaUrl(id,kind,sequence=false){
  if(id==='benchmark'&&kind==='film')return '/portfolio/open-projects/worldstage/wide.mp4';
  if(id==='benchmark'&&kind==='poster')return '/portfolio/open-projects/worldstage/wide.webp';
  const key=id+':'+kind;if(urls.has(key))return urls.get(key);
  const record=recordFor(id);
  if(kind==='film'&&record.job.kind==='motion')return '#'; // The editor keeps this download hidden until a film exists.
  const blob=kind==='performance'?jsonBlob(record.performance):kind==='plan'?jsonBlob({sourceTakeId:record.job.sourceTakeId,motionHash:record.performance.stateHash,plan:record.plan,mix:record.mix}):record.blobs?.[kind];
  if(!blob)throw Error(sequence?'Export the edit before downloading it.':'Render this take before downloading its film.');
  const url=URL.createObjectURL(blob);urls.set(key,url);extensions.set(url,blob.type==='video/mp4'?'mp4':blob.type==='video/webm'?'webm':blob.type==='image/png'?'png':'json');return url;
}
async function simulate(settings,performance){
  const response=await fetch('/api/worldstage/performance',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(performance?{action:'departure',performance}:{action:'audition',settings})});
  const result=await response.json();if(!response.ok)throw Error(result.error);return result;
}
async function motion(settings,name,performance){const p=performance??await simulate(settings),id=crypto.randomUUID(),record={id,performance:p,job:jobFor(id,p,name?.trim().slice(0,60)||'Wind study')};await save(record);return copy(record.job);}
const wait=()=>new Promise(resolve=>setTimeout(resolve,0));
const blobFromCanvas=canvas=>new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(Error('The preview could not be saved.')),'image/png'));
let painting=Promise.resolve();
async function renderRecord(record){
  try{
    const job=record.job,p=record.performance;job.status='rendering';job.progress=2;job.message='Loading scene artwork';
    const painter=await createPainter(p,job.cameraView??'wide');
    if(job.kind==='preview'){painter.draw(job.frame);record.blobs={preview:await blobFromCanvas(painter.canvas)};}
    else{
      const {Output,Mp4OutputFormat,WebMOutputFormat,BufferTarget,CanvasSource,AudioBufferSource,QUALITY_HIGH,getFirstEncodableVideoCodec,getFirstEncodableAudioCodec}=await import('./mediabunny.mjs');
      let codec=await getFirstEncodableVideoCodec(['avc'],{width:1280,height:544,frameRate:24,quality:QUALITY_HIGH});
      const audioCodec=record.mix?.enabled?await getFirstEncodableAudioCodec(['aac'],{sampleRate:48000,numberOfChannels:2}):null;
      let mp4=!!codec, soundCodec=audioCodec;
      if(!codec||(record.mix?.enabled&&!audioCodec)){codec=await getFirstEncodableVideoCodec(['vp9','vp8'],{width:1280,height:544,frameRate:24});soundCodec=record.mix?.enabled?await getFirstEncodableAudioCodec(['opus'],{sampleRate:48000,numberOfChannels:2}):null;mp4=false;}
      if(!codec||(record.mix?.enabled&&!soundCodec))throw Error('Film encoding is unavailable in this browser. Your saved performance is safe. Try a current desktop Chrome, Edge or Safari for export.');
      const target=new BufferTarget(),output=new Output({format:mp4?new Mp4OutputFormat({fastStart:'in-memory'}):new WebMOutputFormat(),target});
      const canvas=document.createElement('canvas');canvas.width=1280;canvas.height=544;const ctx=canvas.getContext('2d');
      const video=new CanvasSource(canvas,{codec,quality:QUALITY_HIGH});output.addVideoTrack(video,{frameRate:24});
      let audio;if(record.mix?.enabled){audio=new AudioBufferSource({codec:soundCodec,quality:QUALITY_HIGH});output.addAudioTrack(audio);}
      await output.start();
      const plan=record.plan,total=plan?editFrames(plan):p.states.length,painters={wide:painter};
      if(plan?.shots.some(shot=>shot.view==='shoreline'))painters.shoreline=await createPainter(p,'shoreline');
      if(audio){job.message='Synthesizing performance sound';await wait();const sound=renderEditedAudio(synthesizePerformance(p,record.mix.engineDepth),plan,record.mix),buffer=new AudioBuffer({numberOfChannels:2,length:sound.left.length,sampleRate:sound.sampleRate});buffer.copyToChannel(sound.left,0);buffer.copyToChannel(sound.right,1);await audio.add(buffer);audio.close();}
      for(let frame=0;frame<total;frame++){
        const mapping=plan?editAt(plan,frame):null,sourceFrame=mapping?.sourceFrame??frame,shot=plan?.shots[mapping.shot],view=shot?.view??job.cameraView??'wide',scene=painters[view]??painter;
        scene.draw(sourceFrame);
        if(plan){const crop=cameraAt(plan,p.states,sourceFrame);ctx.drawImage(scene.canvas,crop.x,crop.y,crop.w,crop.h,0,0,1280,544);}else ctx.drawImage(scene.canvas,0,0);
        await video.add(frame/24,1/24);job.progress=5+Math.floor((frame+1)/total*90);job.message=`Painting frame ${frame+1} of ${total}`;
        if(frame%2===0)await wait();
      }
      video.close();job.message='Finishing the film';await output.finalize();
      record.blobs={film:new Blob([target.buffer],{type:mp4?'video/mp4':'video/webm'}),poster:await blobFromCanvas(canvas)};job.extension=mp4?'mp4':'webm';
    }
    record.job.status='ready';record.job.progress=100;record.job.message='Saved in this browser';await save(record);
  }catch(error){record.job.status='failed';record.job.message=error.message;}
}
async function queueRender(source,kind,input={}){
  const id=crypto.randomUUID(),p=source.performance,record={id,performance:p,job:{...jobFor(id,p,source.job.name,kind),status:'queued',progress:0,message:'Waiting for the painter',performanceId:source.job.performanceId??source.id,frame:Math.max(0,Math.min(p.states.length-1,Math.floor(input.frame??108)))}};
  if(input.cameraView){record.job.cameraView=input.cameraView;record.job.coverageOf=source.id;record.job.name+=' · Shoreline';}
  await save(record);painting=painting.then(()=>renderRecord(record));return copy(record.job);
}
export async function studioApi(path,input){
  await ready;
  if(path==='/api/studio')return {version:21,pilotStyles:PILOT_STYLES,spec:SETTING_SPEC,defaults:DEFAULT_SETTINGS,arrivalSeconds:4.5,duration:17};
  if(path==='/api/takes')return copy([...records.values()].filter(r=>!r.plan&&r.job.kind!=='preview'&&r.job.status==='ready').map(r=>r.job).sort((a,b)=>b.createdAt.localeCompare(a.createdAt)));
  if(path.startsWith('/api/performance/'))return copy(recordFor(path.split('/').at(-1)).performance);
  if(path==='/api/audition')return simulate(input.settings);
  if(path==='/api/motion')return motion(input.settings,input.name);
  if(path==='/api/departure'){const p=await simulate(null,recordFor(input.sourceTakeId).performance);return motion(p.settings,input.name,p);}
  if(path==='/api/explore'){const takes=[];for(let i=0;i<6;i++)takes.push(await motion({...input.settings,seed:1+((input.settings.seed-1+i*19)%9999999)},(input.name||'Wind study')+' · '+(i+1)));return {takes};}
  if(path.startsWith('/api/keep/')){const record=recordFor(path.split('/').at(-1));record.job.keeper=!!input.keeper;await save(record);return copy(record.job);}
  if(path.startsWith('/api/jobs/')||path.startsWith('/api/sequences/'))return copy(recordFor(path.split('/').at(-1)).job);
  if(path==='/api/preview'||path==='/api/render')return queueRender(recordFor(input.performanceId),path==='/api/preview'?'preview':'film',input);
  if(path==='/api/coverage')return queueRender(recordFor(input.sourceTakeId),'film',{cameraView:'shoreline'});
  if(path.startsWith('/api/coverage/')){const source=recordFor(path.split('/').at(-1)),companion=[...records.values()].find(r=>r.job.coverageOf===source.id&&r.job.status==='ready');return {allowed:source.job.kind==='film'&&!source.job.cameraView,shoreline:companion?{id:companion.id,status:'ready',url:mediaUrl(companion.id,'film'),motionHash:companion.performance.stateHash}:null};}
  if(path==='/api/sequences'&&!input)return copy([...records.values()].filter(r=>r.plan).map(r=>r.job));
  if(path==='/api/sequences'){
    const source=recordFor(input.sourceTakeId),id=crypto.randomUUID(),p=source.performance,plan=validatePlan(input.plan,p.states.length),mix=validateMix(input.mix??DEFAULT_MIX),record={id,performance:p,plan,mix,job:{...jobFor(id,p,input.name||'Edited landing','sequence'),sourceTakeId:source.id,plan,mix,status:'queued',progress:0,message:'Waiting for the edit painter'}};
    await save(record);painting=painting.then(()=>renderRecord(record));return copy(record.job);
  }
  throw Error('That studio operation is unavailable.');
}
