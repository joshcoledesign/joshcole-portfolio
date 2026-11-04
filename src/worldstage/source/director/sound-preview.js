import {synthesizePerformance,editSoundStems,DEFAULT_MIX,validateMix,SAMPLE_RATE} from './performance-audio.js';
export function createSoundPreview(){
  let ctx,sound,buffers,active=[],stamp=null,enabled=false,p,mix={...DEFAULT_MIX},master,levels,planKey=null;
  function stop(){for(const {node,envelope} of active){try{const now=ctx.currentTime;envelope.gain.cancelScheduledValues(now);envelope.gain.setTargetAtTime(0,now,.002);node.stop(now+.008);}catch{}}active=[];stamp=null;}
  function gains(){if(!ctx)return;for(const key of ['engines','wind','contact'])levels[key].gain.setTargetAtTime(mix[key],ctx.currentTime,.02);master.gain.setTargetAtTime(mix.master,ctx.currentTime,.02);}
  function prepare(plan){
    const key=plan?JSON.stringify(plan.shots.map(s=>[s.id,s.start,s.end])):null;if(key!==planKey){stop();buffers=null;planKey=key;}
    if(buffers)return;sound=synthesizePerformance(p,mix.engineDepth);if(plan)sound=editSoundStems(sound,plan);buffers={};for(const key of ['engines','wind','contact']){const buffer=ctx.createBuffer(2,sound.samples,SAMPLE_RATE);buffer.copyToChannel(sound.stems[key][0],0);buffer.copyToChannel(sound.stems[key][1],1);buffers[key]=buffer;}
  }
  return {
    setPerformance(value){stop();p=value;sound=null;buffers=null;},
    setMix(value){const next=validateMix(value);if(next.engineDepth!==mix.engineDepth){stop();sound=null;buffers=null;}mix=next;gains();},
    stop,
    async toggle(){if(enabled){enabled=false;stop();return false;}if(!p)throw Error('Load a saved performance first.');if(!ctx){ctx=new AudioContext({sampleRate:SAMPLE_RATE});master=ctx.createGain();levels={};const limiter=ctx.createWaveShaper(),curve=new Float32Array(65537);for(let i=0;i<curve.length;i++)curve[i]=Math.max(-.98,Math.min(.98,i/(curve.length-1)*2-1));limiter.curve=curve;master.connect(limiter);limiter.connect(ctx.destination);for(const key of ['engines','wind','contact']){levels[key]=ctx.createGain();levels[key].connect(master);}}
      await ctx.resume();prepare();gains();enabled=true;return true;
    },
    preparePlan(plan){if(ctx)prepare(plan);},
    sync(seconds,end,playing,plan){
      if(!playing||!enabled){if(stamp)stop();return;}prepare(plan);
      if(stamp&&stamp.end===end&&Math.abs(seconds-(stamp.source+ctx.currentTime-stamp.clock))<.12)return;
      stop();const remaining=Math.min(end,sound.samples/SAMPLE_RATE)-seconds;if(remaining<=0)return;const now=ctx.currentTime,fade=Math.min(.005,remaining/2);
      for(const key of ['engines','wind','contact']){const node=ctx.createBufferSource(),envelope=ctx.createGain();node.buffer=buffers[key];node.connect(envelope);envelope.connect(levels[key]);envelope.gain.setValueAtTime(0,now);envelope.gain.linearRampToValueAtTime(1,now+fade);envelope.gain.setValueAtTime(1,now+remaining-fade);envelope.gain.linearRampToValueAtTime(0,now+remaining);node.start(now,seconds,remaining);node.onended=()=>{node.disconnect();envelope.disconnect();};active.push({node,envelope});}stamp={source:seconds,end,clock:now};
    },
    get enabled(){return enabled;}
  };
}
