// Deterministic procedural sound from captured performance. Shared by preview/export.
export const SOUND_VERSION='performance-sound-5';
export const SAMPLE_RATE=48000;
export const DEFAULT_MIX={enabled:true,engines:.85,engineDepth:.65,wind:.6,contact:1,master:.7};
export function validateMix(input=DEFAULT_MIX){
  if(!input||typeof input!=='object'||Array.isArray(input))throw Error('Choose valid sound mix settings.');
  const out={...DEFAULT_MIX,engineDepth:input.engineDepth??0};for(const [key,value]of Object.entries(input)){
    if(!Object.hasOwn(out,key))throw Error('Unknown sound setting.');
    if(key==='enabled'){if(typeof value!=='boolean')throw Error('Sound inclusion must be on or off.');}
    else if(typeof value!=='number'||!Number.isFinite(value)||value<0||value>(key==='master'||key==='engineDepth'?1:1.5))throw Error('Sound level is outside its supported range.');
    out[key]=value;
  }return out;
}
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export function synthesizePerformance(p,engineDepth=DEFAULT_MIX.engineDepth){
  const depth=validateMix({engineDepth}).engineDepth,bodyRatio=2**(-depth),rumbleRate=.019*bodyRatio;
  const count=p.states.length*SAMPLE_RATE/24,stems={engines:[new Float32Array(count),new Float32Array(count)],wind:[new Float32Array(count),new Float32Array(count)],contact:[new Float32Array(count),new Float32Array(count)]};
  let seed=((p.settings.seed??101)^0x6d2b79f5)>>>0;
  const noise=()=>{seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;return(seed>>>0)/2147483648-1;};
  let rumble=0,roar=0,windLow=0,windRight=0,gearLow=0,bodyRoar=0,bodyLow=0,bodyBass=0,phase=0,spool=0;
  const contact=p.video_contact_seconds<0?Infinity:p.video_contact_seconds,impact=clamp(p.physicsSummary.vertical_contact_speed_mps,.1,1);
  const samplesPerFrame=SAMPLE_RATE/24;
  for(let n=0;n<count;n++){
    const t=n/SAMPLE_RATE,f=n/samplesPerFrame,a=p.states[Math.floor(f)],b=p.states[Math.min(p.states.length-1,Math.floor(f)+1)],u=f-Math.floor(f);
    const lerp=key=>(a[key]??0)*(1-u)+(b[key]??0)*u;
    const power=p.controls?.engine_coast_entry===1&&t<p.settings.engineIgnition?0:clamp(lerp('power'),0,1.7),distance=clamp(lerp('width')/410,.15,1),pan=clamp((lerp('x')/1280-.5)*.75,-.4,.4);
    const left=Math.sqrt((1-pan)/2),right=Math.sqrt((1+pan)/2),r=noise(),r2=noise();
    bodyRoar+=.045*(r-bodyRoar);bodyLow+=.045*(bodyRoar-bodyLow);bodyBass+=.045*(bodyLow-bodyBass);rumble+=rumbleRate*(r-rumble);roar+=.17*(r-roar);windLow+=.012*(r-windLow);windRight+=.014*(r2-windRight);gearLow+=.10*(r2-gearLow);
    spool+=(power-spool)*.00025;phase+=2*Math.PI*(42+spool*24)*bodyRatio/SAMPLE_RATE;
    const level=Math.pow(power,1.1)*Math.pow(distance,1.25),flutter=.82+.10*Math.sin(t*73)+.08*Math.sin(t*117);
    const jet=level*(rumble*1.2*(1+depth*.8)+bodyBass*depth*2.4+roar*.34+(r-roar)*.085)*flutter+Math.sin(phase)*.048*(1+depth*.5)*spool*distance+Math.sin(phase*2.017)*.018*(1+depth*.3)*spool*distance+depth*spool*distance*(Math.sin(phase*3)*.055+Math.sin(phase*4)*.038+Math.sin(phase*6)*.022);
    const approachFade=Math.min(1,t/.04),windEnergy=clamp(Math.abs(lerp('windAx'))*.32+Math.abs(lerp('windSpeed'))/600,0,1.5),windGain=.17*clamp(p.settings.wind??1,0,2)+windEnergy*.24;
    stems.engines[0][n]=jet*left*approachFade;stems.engines[1][n]=jet*right*approachFade;
    stems.wind[0][n]=(windLow*2.4+(r-roar)*.06)*windGain*approachFade;stems.wind[1][n]=(windRight*2.4+(r2-gearLow)*.06)*windGain*approachFade;
    const age=t-contact;
    if(age>=0&&age<3.5){
      const secondAge=p.terrain?t-4.5-Math.max(p.terrain.left_contact_seconds,p.terrain.right_contact_seconds):-1;
      const secondHit=secondAge>=0?(Math.sin(secondAge*2*Math.PI*49)*.10+gearLow*.3)*Math.exp(-secondAge*12)*Math.sqrt(impact/.4):0;
      const hit=secondHit+(Math.sin(2*Math.PI*(61*age-7*age*age))*.24*Math.exp(-age*8)+gearLow*.9*Math.exp(-age*17))*Math.sqrt(impact/.4);
      const compressionSpeed=Math.max(Math.abs(b.compression-a.compression),Math.abs((b.leftCompression??0)-(a.leftCompression??0)),Math.abs((b.rightCompression??0)-(a.rightCompression??0)))*24/25;
      const creak=(Math.sin(t*2*Math.PI*173)*.04+gearLow*.16)*clamp(compressionSpeed*1.1,0,1)*Math.exp(-age*.6);
      const debris=gearLow*.12*Math.exp(-age*2.8)*(1+.3*Math.sin(age*91));
      stems.contact[0][n]=(hit+creak+debris)*left;stems.contact[1][n]=(hit+creak+debris)*right;
    }
  }
  return {sampleRate:SAMPLE_RATE,frames:p.states.length,samples:count,contactSeconds:contact,version:SOUND_VERSION,stems};
}
// Assemble continuous stems once, with a short outgoing ambience tail over cuts.
export function editSoundStems(sound,plan){
  const perFrame=SAMPLE_RATE/24,total=plan.shots.reduce((n,s)=>n+s.end-s.start,0)*perFrame,stems={},segments=[];
  for(const key of ['engines','wind','contact'])stems[key]=[new Float32Array(total),new Float32Array(total)];
  let offset=0;
  for(let index=0;index<plan.shots.length;index++){
    const shot=plan.shots[index],previous=plan.shots[index-1],start=shot.start*perFrame,length=(shot.end-shot.start)*perFrame;
    const blend=previous&&previous.end!==shot.start?Math.min(2880,length,(previous.end-previous.start)*perFrame):0;
    for(const key of ['engines','wind','contact'])for(let c=0;c<2;c++)for(let i=0;i<length;i++){
      let value=sound.stems[key][c][start+i];
      if(key!=='contact'&&i<blend){const u=i/(blend-1),tail=previous.end*perFrame+i,previousValue=tail<sound.samples?sound.stems[key][c][tail]:sound.stems[key][c][sound.samples-1]*Math.exp(-i/480);value=previousValue*Math.cos(u*Math.PI/2)+value*Math.sin(u*Math.PI/2);}
      // Fade only the outer film edges; never drop ambience to zero at a shot cut.
      const envelope=Math.min(1,(offset+i)/240,(total-1-offset-i)/240);
      stems[key][c][offset+i]=value*envelope;
    }
    segments.push({shot:shot.id??shot.name,sourceStartSample:start,sourceEndSample:start+length,outputStartSample:offset,outputEndSample:offset+length,edgeFadeSamples:240,ambienceBlendSamples:blend});offset+=length;
  }
  return {sampleRate:SAMPLE_RATE,samples:total,stems,segments};
}
export function renderEditedAudio(sound,plan,inputMix){
  const mix=validateMix(inputMix),edited=editSoundStems(sound,plan),left=new Float32Array(edited.samples),right=new Float32Array(edited.samples);
  for(let n=0;n<edited.samples;n++)for(let c=0;c<2;c++){let value=0;for(const key of ['engines','wind','contact'])value+=edited.stems[key][c][n]*mix[key];(c?right:left)[n]=mix.enabled?clamp(value*mix.master,-.98,.98):0;}
  return {sampleRate:SAMPLE_RATE,left,right,segments:edited.segments};
}
export function wavBytes(audio){
  const samples=audio.left.length,bytes=new Uint8Array(44+samples*4),view=new DataView(bytes.buffer),ascii=(at,text)=>{for(let i=0;i<text.length;i++)bytes[at+i]=text.charCodeAt(i);};
  ascii(0,'RIFF');view.setUint32(4,36+samples*4,true);ascii(8,'WAVE');ascii(12,'fmt ');view.setUint32(16,16,true);view.setUint16(20,1,true);view.setUint16(22,2,true);view.setUint32(24,SAMPLE_RATE,true);view.setUint32(28,SAMPLE_RATE*4,true);view.setUint16(32,4,true);view.setUint16(34,16,true);ascii(36,'data');view.setUint32(40,samples*4,true);
  for(let i=0;i<samples;i++){view.setInt16(44+i*4,Math.round(clamp(audio.left[i],-1,1)*32767),true);view.setInt16(46+i*4,Math.round(clamp(audio.right[i],-1,1)*32767),true);}return bytes;
}
