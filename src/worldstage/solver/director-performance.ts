/** Deterministic performance generation. No Canvas, images, video or UI dependencies. */
import {groundAt,groundProfile} from '../director/terrain-ground.js';
import {createTerrainPerformance} from './terrain-performance';
import {createHash} from 'node:crypto';
import {parseSettings,type Settings} from './director-settings';
export type MotionState={engineCommand?:number;enginePhase?:string;frame:number;time:number;x:number;footY:number;width:number;height:number;angle:number;altitude:number;power:number;braking:number;compression:number;vx:number;vz:number;ax:number;verticalThrust:number;supportForce:number;phase:string;perspective?:number;windAx?:number;windAz?:number;windTorque?:number;windSpeed?:number;windOffset?:number;controlAx?:number;referenceX?:number;groundY?:number;leftGroundY?:number;rightGroundY?:number;leftCompression?:number;rightCompression?:number;leftSupport?:number;rightSupport?:number;washStrength?:number;waterReaction?:number;impactPulse?:number;nozzleAngle?:number;thrustBalance?:number;thrustMagnitude?:number;thrustX?:number;thrustZ?:number;netForceX?:number;netForceZ?:number;angularAcceleration?:number;netTorque?:number};
export type Performance={flightResult?:{status:'landed'|'hard-landing'|'failed';reason:string;contactOccurred:boolean;settled:boolean;stopFrame:number};schema:'worldstage-performance-2';simulationVersion:string;fps:number;duration_seconds:number;contact_seconds:number;video_contact_seconds:number;directing_start_frame:number;settings:Settings;controls:Record<string,number>;physicsSummary:{contact_seconds:number;vertical_contact_speed_mps:number;peak_compression_m:number;final_compression_m:number;final_x_pixels:number;maximum_nose_up_degrees:number;framing_ship_width_pixels:number;previous_width_pixels:number;maximum_drift_pixels:number;landing_error_pixels:number;maximum_wind_acceleration:number;outcome:string};states:MotionState[];stateHash:string;fixedArrival:unknown;terrain?:{profile:Array<{x:number;y:number}>;targetX:number;left_contact_seconds:number;right_contact_seconds:number;final_left_compression_m:number;final_right_compression_m:number};departure?:{landingResult?:Performance['flightResult'];sourceMotionHash:string;sourceFrames:number;start_seconds:number;ignition_seconds:number;liftoff_seconds:number;hover_seconds:number;departure_seconds:number};provenance?:string};
const clamp=(v:number,a:number,b:number):number=>Math.max(a,Math.min(b,v));
const smooth=(v:number):number=>{const u=clamp(v,0,1);return u*u*(3-2*u);};
export const stateHash=(states:MotionState[]):string=>createHash('sha256').update(JSON.stringify(states)).digest('hex');
export function validatePerformance(input:unknown):Performance{
  if(!input||typeof input!=='object')throw new Error('Saved performance is missing.');
  const p=input as Performance;
  if(p.schema!=='worldstage-performance-2'||p.fps!==24||!Array.isArray(p.states)||p.states.length<(p.flightResult?.status==='failed'?109:408)||p.states.length>1000||p.directing_start_frame!==108)throw new Error('Unsupported saved performance.');
  if(p.states.some((s,i)=>s.frame!==i||Object.values(s).some(v=>typeof v==='number'&&!Number.isFinite(v))))throw new Error('Saved performance has invalid states.');
  if(stateHash(p.states)!==p.stateHash)throw new Error('Saved motion integrity check failed.');
  if(p.flightResult&&(!['landed','hard-landing','failed'].includes(p.flightResult.status)||typeof p.flightResult.reason!=='string'||typeof p.flightResult.contactOccurred!=='boolean'||typeof p.flightResult.settled!=='boolean'||p.flightResult.stopFrame!==p.states.length-1||p.flightResult.status==='failed'&&p.flightResult.settled))throw Error('Saved flight result is invalid.');
  if(p.terrain){
    if(JSON.stringify(p.terrain.profile)!==JSON.stringify(groundProfile(p.settings))||p.terrain.targetX!==p.settings.landingTarget||![p.terrain.left_contact_seconds,p.terrain.right_contact_seconds].every(Number.isFinite))throw new Error('Saved terrain integrity check failed.');
    if(p.states.slice(108).some(s=>!Number.isFinite(s.groundY)||Math.abs(s.groundY!-groundAt(p.settings,s.x))>1e-7||s.leftCompression===undefined||s.rightCompression===undefined))throw new Error('Saved ground contact is incomplete.');
  }
  if(p.departure){const d=p.departure;if(!Number.isInteger(d.sourceFrames)||d.sourceFrames<408||d.sourceFrames>=p.states.length||stateHash(p.states.slice(0,d.sourceFrames))!==d.sourceMotionHash||Math.abs(d.start_seconds-d.sourceFrames/24)>1e-8||![d.ignition_seconds,d.liftoff_seconds,d.hover_seconds,d.departure_seconds].every(Number.isFinite)||!(d.start_seconds<d.ignition_seconds&&d.ignition_seconds<d.liftoff_seconds&&d.liftoff_seconds<d.hover_seconds&&d.hover_seconds<d.departure_seconds))throw Error('Saved departure integrity check failed.');if(p.states.slice(d.sourceFrames).some(s=>s.nozzleAngle===undefined||s.thrustMagnitude===undefined||Math.abs(s.nozzleAngle)>Math.PI/10+1e-7))throw Error('Saved departure has incomplete thrust data.');}
  return p;
}
export function importLegacy(input:unknown,settings:Settings,source:string):Performance{
  const old=input as Omit<Performance,'schema'|'simulationVersion'|'stateHash'>;
  if(!Array.isArray(old.states)||old.states.length<408)throw new Error('This take has no complete captured motion.');
  return validatePerformance({...old,schema:'worldstage-performance-2',simulationVersion:'preserved-legacy',settings,stateHash:stateHash(old.states),provenance:source});
}
export function windField(settings:Settings):(time:number)=>{ax:number;az:number;torque:number;speed:number}{
  let seed=settings.seed>>>0;
  const random=():number=>{seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;return(seed>>>0)/4294967296;};
  // Hash the small human seed before drawing the weather profile.
  for(let i=0;i<12;i++)random();
  const severity=.18+random()*1.35,phase=random()*Math.PI*2,phase2=random()*Math.PI*2;
  const center=2+random()*5.2,span=.7+random()*1.1,polarity=random()<.5?-1:1;
  return t=>{
    if(t<0)return{ax:0,az:0,torque:0,speed:140};
    const envelope=smooth(t/1.2),pulse=Math.exp(-(((t-center)/span)**2));
    const gust=severity*settings.gustiness*(.55*Math.sin(t*1.9+phase)+.30*Math.sin(t*4.1+phase2)+polarity*1.4*pulse);
    // Artistic weather limits keep the fixed painted stage useful at slider extremes.
    const ax=clamp(settings.wind*envelope*(-.18+gust),-3.5,3.5);
    const az=clamp(settings.wind*envelope*severity*settings.gustiness*(.18*Math.sin(t*2.3+phase2)+polarity*.28*pulse),-.65,.65);
    // Painter subtracts offset: positive acceleration must advect particles right.
    // Fade out the fixed opening's leftward flow before handing it to this field.
    return{ax,az,torque:clamp(ax*.15+settings.wind*settings.gustiness*envelope*.06*Math.sin(t*3.7+phase),-.7,.7),speed:140*(1-envelope)-ax*140};
  };
}
export function createPerformance(input:unknown,arrival:MotionState[]):Performance{
  const settings=parseSettings(input);
  if(arrival.length!==108||arrival.some((s,i)=>s.frame!==i||s.time>=0))throw new Error('The approved fixed arrival is required.');
  return createTerrainPerformance(settings,arrival);
}
