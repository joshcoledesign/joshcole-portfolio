import {projectCoverageState,coverageAnchor} from './coverage-projection.js';
// Shared camera math for the browser audition and exported film. No simulation.
export const FRAMINGS={wide:{label:'Wide · world',zoom:1},medium:{label:'Medium · ship',zoom:1.24},close:{label:'Close · landing',zoom:1.52}};
export function defaultPlan(performance){
  const end=performance.states.length,contact=Math.round(performance.video_contact_seconds*24);
  if(performance.flightResult?.status==='failed')return {schema:'worldstage-shot-plan-3',fps:24,shots:[{id:'arrival',name:'Arrival',start:0,end:Math.round(end*.45),framing:'wide',move:false},{id:'landing',name:'Landing',start:Math.round(end*.45),end:Math.round(end*.8),framing:'wide',move:false},{id:'aftermath',name:'Aftermath',start:Math.round(end*.8),end,framing:'wide',move:false}]};
  if(performance.departure)return {schema:'worldstage-shot-plan-3',fps:24,shots:[{id:'arrival',name:'Arrival',start:0,end:contact-60,framing:'wide',move:false},{id:'landing',name:'Landing',start:contact-60,end:Math.round((performance.departure.departure_seconds-.7)*24),framing:'wide',move:false},{id:'aftermath',name:'Departure',start:Math.round((performance.departure.departure_seconds-.7)*24),end,framing:'wide',move:false}]};
  return {schema:'worldstage-shot-plan-2',fps:24,shots:[
    {name:'Arrival',start:0,end:180,framing:'wide',move:false},
    {name:'Landing',start:180,end:Math.min(end-24,contact+34),framing:'close',move:true},
    {name:'Aftermath',start:Math.min(end-24,contact+34),end,framing:'medium',move:true}
  ]};
}
export function validatePlan(input,frames){
  if(!input||!['worldstage-shot-plan-1','worldstage-shot-plan-2','worldstage-shot-plan-3'].includes(input.schema)||input.fps!==24||!Array.isArray(input.shots)||input.shots.length!==3)throw new Error('Choose a three-shot sequence.');
  const legacy=input.schema==='worldstage-shot-plan-1',reorder=input.schema==='worldstage-shot-plan-3',ids=['arrival','landing','aftermath'];
  let next=0;const shots=input.shots.map((s,i)=>{
    if(!s||!Number.isInteger(s.start)||!Number.isInteger(s.end)||s.start<0||(!reorder&&s.start<next)||(legacy&&s.start!==next)||s.end-s.start<12||s.end>frames||!Object.hasOwn(FRAMINGS,s.framing)||typeof s.move!=='boolean'||(reorder&&!ids.includes(s.id)))throw new Error('Use valid source ranges, without overlap, and at least half a second per shot.');
    const identity=reorder?ids.indexOf(s.id):i;
    next=s.end;const shot={name:identity===2&&s.name==='Departure'?'Departure':['Arrival','Landing','Aftermath'][identity],start:s.start,end:s.end,framing:s.framing,move:s.framing==='wide'?false:s.move};if(reorder)shot.id=s.id;if(s.view!==undefined){if(!['wide','shoreline'].includes(s.view))throw Error('Choose an available coverage view');shot.view=s.view;}
    if(s.camera!==undefined){
      if(legacy||!s.camera||!['linear','smooth','ease-in','ease-out'].includes(s.camera.ease))throw new Error('Choose a supported camera easing.');
      const point=p=>{if(!p||![p.x,p.y,p.zoom].every(Number.isFinite)||p.x<0||p.x>1||p.y<0||p.y>1||p.zoom<1||p.zoom>2)throw new Error('Camera position must stay inside the source; zoom is 1–2×.');return constrainPoint(p);};
      shot.camera={from:point(s.camera.from),to:point(s.camera.to),ease:s.camera.ease};
    }
    return shot;
  });if(legacy&&next!==frames)throw new Error('The legacy sequence must include the complete performance.');
  if(reorder){if(new Set(shots.map(s=>s.id)).size!==3)throw Error('Each shot must appear once.');const ordered=[...shots].sort((a,b)=>a.start-b.start);if(ordered.some((s,i)=>i>0&&s.start<ordered[i-1].end))throw Error('Source ranges cannot overlap.');}
  return {schema:input.schema,fps:24,shots};
}
export function upgradePlan(plan,frames){const p=validatePlan(plan,frames);return {...p,schema:'worldstage-shot-plan-3',shots:p.shots.map((s,i)=>({...s,id:s.id??['arrival','landing','aftermath'][i]}))};}
export function trimBounds(plan,index,frames){const s=plan.shots[index],others=plan.shots.filter((_,i)=>i!==index);return {startMin:Math.max(0,...others.filter(o=>o.end<=s.start).map(o=>o.end)),startMax:s.end-12,endMin:s.start+12,endMax:Math.min(frames,...others.filter(o=>o.start>=s.end).map(o=>o.start))};}
export function constrainPoint(p){const halfX=.5/p.zoom,halfY=.5/p.zoom;return {x:Math.max(halfX,Math.min(1-halfX,p.x)),y:Math.max(halfY,Math.min(1-halfY,p.y)),zoom:p.zoom};}
export function editFrames(plan){return plan.shots.reduce((sum,s)=>sum+s.end-s.start,0);}
export function editAt(plan,frame){
  let offset=0;frame=Math.max(0,Math.min(editFrames(plan)-1,Math.floor(frame)));
  for(let i=0;i<plan.shots.length;i++){const s=plan.shots[i],length=s.end-s.start;if(frame<offset+length)return {shot:i,sourceFrame:s.start+frame-offset,outputFrame:frame,offset};offset+=length;}
}
export function sourceToEdit(plan,shot,frame){return plan.shots.slice(0,shot).reduce((n,s)=>n+s.end-s.start,0)+Math.max(0,Math.min(plan.shots[shot].end-plan.shots[shot].start-1,frame-plan.shots[shot].start));}
export function cameraAt(plan,states,frame){
  frame=Math.min(states.length-1,Math.max(0,Math.floor(frame)));
  const index=plan.shots.findIndex(s=>frame>=s.start&&frame<s.end);if(index<0)throw Error('This source frame is trimmed out.');
  const shot=plan.shots[index],project=s=>projectCoverageState(s,coverageAnchor(states),shot.view??'wide'),state=project(states[frame]);
  const u=(frame-shot.start)/Math.max(1,shot.end-shot.start-1);
  if(shot.camera){
    const ease=shot.camera.ease==='linear'?u:shot.camera.ease==='ease-in'?u*u:shot.camera.ease==='ease-out'?1-(1-u)**2:u*u*(3-2*u);
    const from=shot.camera.from,to=shot.camera.to,p=constrainPoint({x:from.x+(to.x-from.x)*ease,y:from.y+(to.y-from.y)*ease,zoom:from.zoom+(to.zoom-from.zoom)*ease});
    const w=1280/p.zoom,h=544/p.zoom;return {shot:index,x:p.x*1280-w/2,y:p.y*544-h/2,w,h,zoom:p.zoom};
  }
  const ease=u*u*(3-2*u);
  const zoom=FRAMINGS[shot.framing].zoom+(shot.move&&shot.framing!=='wide'?.07*ease:0);
  const w=1280/zoom,h=544/zoom,anchor=project(states[Math.floor((shot.start+shot.end-1)/2)]);
  const focus=shot.move?state:anchor;
  const cx=shot.framing==='wide'?640:focus.x,cy=shot.framing==='wide'?272:focus.footY-focus.height*.33;
  return {shot:index,x:Math.max(0,Math.min(1280-w,cx-w/2)),y:Math.max(0,Math.min(544-h,cy-h/2)),w,h,zoom};
}
export function cameraEndpoints(plan,states,index){const s=plan.shots[index];if(s.camera)return structuredClone(s.camera);const point=f=>{const c=cameraAt(plan,states,f);return {x:(c.x+c.w/2)/1280,y:(c.y+c.h/2)/544,zoom:c.zoom};};return {from:point(s.start),to:point(s.end-1),ease:'smooth'};}
