/** Two spring/damper supports over sampled ground, with independent world-space contact. */
import {groundAt,groundProfile} from '../director/terrain-ground.js';
import {stateHash,validatePerformance,windField,type Performance,type MotionState} from './director-performance';
import type {Settings} from './director-settings';
import {pilotStyle} from './pilot-styles';
const clamp=(v:number,a:number,b:number)=>Math.max(a,Math.min(b,v));
export function createTerrainPerformance(settings:Settings,arrival:MotionState[]):Performance{
  const directed=settings.engineDirecting===1;
  const states=arrival.map(s=>directed?{...s,power:0,verticalThrust:0,engineCommand:0,enginePhase:'waiting ignition',thrustMagnitude:0,thrustX:0,thrustZ:0}:{...s}),weather=windField(settings),dt=1/120,m=18000,g=3.8,ppm=25,arm=5.3;
  const k=m*g/(.22*settings.gear),damping=2*.44*Math.sqrt(k*m),inertia=m*arm*arm/3;
  const pilot=pilotStyle(settings.pilotStyle),cued=settings.cueEnabled===1,delay=cued?settings.cueBrake-4.5:pilot.brakeDelay;
  const v0=3.5*settings.carry,brake=.61*settings.braking*pilot.brakeGain,T=delay+v0/brake,baseEnd=390/ppm+v0*delay+v0*v0/(2*brake),delta=settings.landingTarget/ppm-baseEnd;
  let x=390/ppm,h=4,vx=3.5,vz=-.18,angle=0,omega=0,gimbal=0,thrust=directed?0:m*g*.92,offset=0;
  let contact:number|undefined,leftTime:number|undefined,rightTime:number|undefined,impact=0,peak=0,maxDrift=0,maxWind=0;
  let finalLeft=0,finalRight=0;
  let hoverStart:number|undefined;
  let failureReason='';
  for(let step=0;step<28*120;step++){
    const t=step*dt,w=weather(t),b=clamp(t-delay,0,v0/brake),u=clamp(t/T,0,1),blend=u*u*(3-2*u);
    let targetX=390/ppm+v0*Math.min(t,delay)+v0*b-.5*brake*b*b+delta*blend;
    let targetV=(t<delay?v0:Math.max(0,v0-brake*b))+(t<T?delta*6*u*(1-u)/T:0);
    let feed=(t>=delay&&b<v0/brake?-brake:0)+(t<T?delta*6*(1-2*u)/(T*T):0);
    if(cued){const duration=settings.cueHover-4.5-delay,q=clamp((t-delay)/duration,0,1),a=390/ppm+v0*delay,z=settings.landingTarget/ppm;
      if(t<delay){targetX=390/ppm+v0*t;targetV=v0;feed=0;}
      else{targetX=(2*q**3-3*q*q+1)*a+(q**3-2*q*q+q)*duration*v0+(-2*q**3+3*q*q)*z;targetV=t<settings.cueHover-4.5?((6*q*q-6*q)*a+(3*q*q-4*q+1)*duration*v0+(-6*q*q+6*q)*z)/duration:0;feed=t<settings.cueHover-4.5?((12*q-6)*a+(6*q-4)*duration*v0+(-12*q+6)*z)/duration**2*settings.braking:0;}}
    const grounded=contact!==undefined;
    const command=grounded?0:clamp(feed+.75*settings.correction*(targetX-x)+1.8*Math.sqrt(settings.correction)*(targetV-vx)-w.ax,-2.8*settings.thrust,2.8*settings.thrust);
    const centerGround=(386-groundAt(settings,x*ppm))/ppm,clearance=h-centerGround;
    if(!cued&&pilot.hoverSeconds&&hoverStart===undefined&&t>T&&clearance<1.3&&Math.abs(vx)<.4&&Math.abs(x-settings.landingTarget/ppm)<.6)hoverStart=t;
    const hovering=cued?t>=settings.cueHover-4.5&&t<settings.cueLand-4.5:pilot.hoverSeconds>0&&(hoverStart===undefined?clearance<1.3:t<hoverStart+pilot.hoverSeconds);
    let desiredVz=t<pilot.descentStart?-.14:(clearance>.65?-pilot.descentRate*settings.descent:-pilot.cushionRate*Math.sqrt(settings.descent));
    if(hovering)desiredVz=clamp((1.1-clearance)*1.5,-.3,.3);
    if(cued&&t<settings.cueLand-4.5){const duration=settings.cueHover-4.5,q=clamp(t/duration,0,1),initial=4-(386-groundAt(settings,390))/ppm,target=initial+(settings.cueHeight-initial)*q*q*(3-2*q),velocity=t<duration?(settings.cueHeight-initial)*6*q*(1-q)/duration:0;desiredVz=clamp(velocity+1.5*(target-clearance),-1.4,.6);}
    const verticalGoal=clamp(g+3.2*settings.correction*(desiredVz-vz)-w.az,.3,g*1.8*settings.thrust);
    // Guidance asks for a vector. The actuators, not a horizontal shortcut, deliver it.
    const shutdown=directed?(t+4.5>=settings.engineIgnition&&t+4.5<settings.engineShutdown?1:0):grounded?Math.exp(-(t-contact!)/.18):1;
    const desiredGimbal=clamp(Math.atan2(command,verticalGoal)-angle,-Math.PI/10,Math.PI/10);
    gimbal+=clamp(((grounded?0:desiredGimbal)-gimbal)*dt/.18,-.44*dt,.44*dt);
    const targetThrust=m*Math.min(Math.hypot(command,verticalGoal),g*1.8*settings.thrust,...(directed?[g*settings.engineCeiling]:[]))*shutdown;
    thrust+=(targetThrust-thrust)*dt/((targetThrust<thrust?pilot.fall:pilot.rise)*settings.engineLag);
    const theta=angle+gimbal,fx=thrust*Math.sin(theta),fz=thrust*Math.cos(theta),controlAx=fx/m;
    const foot=(side:number)=>{
      const px=(x+side*arm*Math.cos(angle))*ppm,groundY=groundAt(settings,px),gap=h-side*arm*Math.sin(angle)-(386-groundY)/ppm;
      const compression=Math.max(0,-gap),speed=vz-side*arm*Math.cos(angle)*omega;
      return{px,groundY,gap,compression,force:gap<=0?Math.max(0,k*.5*compression-damping*.5*speed):0};
    };
    const left=foot(-1),right=foot(1),support=left.force+right.force;
    if(left.gap<=0&&leftTime===undefined)leftTime=t;if(right.gap<=0&&rightTime===undefined)rightTime=t;
    if((left.gap<=0||right.gap<=0)&&contact===undefined){contact=t;impact=Math.abs(vz);}
    const compression=(left.compression+right.compression)/2;
    peak=Math.max(peak,left.compression,right.compression);maxWind=Math.max(maxWind,Math.abs(w.ax));if(!grounded)maxDrift=Math.max(maxDrift,Math.abs(x-targetX)*ppm);
    const free=Math.abs(vx)<.01&&Math.abs(fx+m*w.ax)<=.7*support;
    const friction=free?-(fx+m*w.ax):-Math.sign(vx||fx+m*w.ax)*Math.min(.7*support,m*Math.abs(vx)/dt);
    const netX=fx+m*w.ax+friction,netZ=fz+support-m*g+m*(support>m*g*.5?0:w.az),ax=netX/m;
    // Braking raises the nose (negative screen angle); differential engine force
    // creates its torque. Gear reactions take over as engines spool down.
    const desiredAngle=clamp(command*pilot.pitchGain,-.25,.17)*clamp(clearance/.9,0,1);
    const requestedTorque=inertia*(12.5*settings.correction*(desiredAngle-angle)-5.7*omega);
    const balance=clamp((requestedTorque+2*fx)/(arm*Math.max(1,fz)),-.35,.35);
    const torque=arm*fz*balance-2*fx+arm*(left.force-right.force)+inertia*w.torque*.4*(support>m*g*.5?0:1),angular=torque/inertia;
    offset+=w.speed*dt;
    if(step%5===0){
      const proximity=clamp(1-clearance/3,0,1),wash=clamp(thrust/(m*g)*proximity,0,2),waterProximity=clamp((850-x*ppm)/230,0,1);
      states.push({frame:108+step/5,time:t,x:x*ppm,footY:386-(h+compression)*ppm,width:410,height:410*795/1761*1.08,angle,altitude:Math.max(0,clearance)*ppm,power:thrust/(m*g),braking:clamp(-controlAx/brake,0,1),compression:compression*ppm,vx,vz,ax,verticalThrust:fz,supportForce:support,phase:contact!==undefined?(t-contact>2?'settled':left.force===0||right.force===0?'uneven gear contact':'weight transfer'):(cued?(t<delay?'cue approach':t<settings.cueHover-4.5?'cue braking':hovering?'cue hover':'cue final descent'):hovering?'precision hover':Math.abs(w.ax)>.7?'gust correction':clearance>.9?'vector braking':'final cushion'),windAx:w.ax,windAz:w.az,windTorque:w.torque,windSpeed:w.speed,windOffset:offset,controlAx,referenceX:targetX*ppm,groundY:groundAt(settings,x*ppm),leftGroundY:left.groundY,rightGroundY:right.groundY,leftCompression:left.compression*ppm,rightCompression:right.compression*ppm,leftSupport:left.force,rightSupport:right.force,washStrength:wash,waterReaction:wash*waterProximity,impactPulse:contact===undefined?0:impact*Math.exp(-(t-contact)*3),nozzleAngle:gimbal,thrustBalance:balance,...(directed?{engineCommand:targetThrust/(m*g),enginePhase:t+4.5<settings.engineIgnition?'waiting ignition':t+4.5>=settings.engineShutdown?'shutdown':'landing burn'}:{}),thrustMagnitude:thrust,thrustX:fx,thrustZ:fz,netForceX:netX,netForceZ:netZ,angularAcceleration:angular,netTorque:torque});
      finalLeft=left.compression;finalRight=right.compression;
      if(directed){if(contact!==undefined&&impact>1.6)failureReason='Impact limit';else if(peak>.8)failureReason='Gear travel limit';else if(Math.abs(angle)>.6)failureReason='Attitude limit';else if(x*ppm<100||x*ppm>1180)failureReason='Outside landing stage';if(failureReason)break;}
      if(step>=12.5*120&&contact!==undefined&&t-contact>3&&Math.abs(vx)<.01&&Math.abs(vz)<.015&&Math.abs(omega)<.002&&(!directed||thrust/(m*g)<.02))break;
    }
    omega+=angular*dt;angle+=omega*dt;
    vx+=ax*dt;x+=vx*dt;
    vz+=netZ/m*dt;h+=vz*dt;
  }
  const last=states.at(-1)!;
  const settled=contact!==undefined&&leftTime!==undefined&&rightTime!==undefined&&peak<=.8&&Math.abs(last.vz)<=.025&&Math.abs(last.vx)<=.025&&last.leftSupport!>=1&&last.rightSupport!>=1&&last.power<.02;
  if(!directed&&!settled)throw Error('This landing did not settle safely on both supports. Try a gentler descent or ground profile.');
  if(directed&&!settled&&!failureReason)failureReason='Did not settle within capture window';
  const flightResult=directed?{status:failureReason?'failed' as const:impact>.7||peak>.45?'hard-landing' as const:'landed' as const,reason:failureReason||'Settled on both supports',contactOccurred:contact!==undefined,settled:!failureReason,stopFrame:states.length-1}:undefined;
  return validatePerformance({schema:'worldstage-performance-2',...(flightResult?{flightResult}:{}),simulationVersion:directed?'terrain-engine-controller-6':cued?'terrain-cue-controller-4':pilot.id?'terrain-pilot-controller-3':'terrain-vector-controller-2',fps:24,duration_seconds:states.length/24,contact_seconds:contact??-1,video_contact_seconds:contact===undefined?-1:contact+4.5,directing_start_frame:108,settings,controls:{...(directed?{engine_directing:1,engine_coast_entry:1,engine_ignition_scene_seconds:settings.engineIgnition,engine_shutdown_scene_seconds:settings.engineShutdown,engine_ceiling_weight_ratio:settings.engineCeiling}:{}),...(cued?{cue_enabled:1,cue_brake_scene_seconds:settings.cueBrake,cue_hover_scene_seconds:settings.cueHover,cue_land_scene_seconds:settings.cueLand,cue_hover_height_m:settings.cueHeight}:{}),mass_kg:m,gravity_mps2:g,integrator_hz:120,pixels_per_m:ppm,gear_half_span_m:arm,resting_gear_compression_m:.22*settings.gear,gimbal_limit_radians:Math.PI/10,gimbal_rate_radians_per_second:.44,friction_coefficient:.7,camera_contact_kick_pixels:clamp(impact*3,1,4),...(pilot.id?{pilot_style:pilot.id,braking_delay_seconds:delay,engine_rise_seconds:pilot.rise*settings.engineLag,engine_fall_seconds:pilot.fall*settings.engineLag,hover_hold_seconds:pilot.hoverSeconds}:{})},physicsSummary:{contact_seconds:contact??-1,vertical_contact_speed_mps:impact,peak_compression_m:peak,final_compression_m:last.compression/ppm,final_x_pixels:last.x,maximum_nose_up_degrees:-Math.min(...states.map(s=>s.angle))*180/Math.PI,framing_ship_width_pixels:410,previous_width_pixels:500,maximum_drift_pixels:maxDrift,landing_error_pixels:last.x-settings.landingTarget,maximum_wind_acceleration:maxWind,outcome:flightResult?.status==='failed'?failureReason:flightResult?.status==='hard-landing'?'Hard landing':maxDrift>30?'Gust-battered':impact>.49?'Hard landing':'Controlled landing'},states,stateHash:stateHash(states),fixedArrival:directed?{version:4,frames:108,path_locked:true,engine_program_from_start:true}:{version:3,frames:108,independent_of_directing:true},terrain:{profile:groundProfile(settings),targetX:settings.landingTarget,left_contact_seconds:leftTime??-1,right_contact_seconds:rightTime??-1,final_left_compression_m:finalLeft,final_right_compression_m:finalRight}});
}
