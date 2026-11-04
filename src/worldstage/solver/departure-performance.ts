/** Preserve an accepted landing, then integrate ignition, unloading, hover and departure. */
import {groundAt} from '../director/terrain-ground.js';
import {stateHash,validatePerformance,windField,type Performance} from './director-performance';
const clamp=(v:number,a:number,b:number)=>Math.max(a,Math.min(b,v));
const smooth=(v:number)=>{const u=clamp(v,0,1);return u*u*(3-2*u);};
export function appendDeparture(source:Performance):Performance{
  validatePerformance(source);if(source.departure)throw Error('Choose a landed performance without departure.');
  if(source.flightResult&&!source.flightResult.settled)throw Error('This recorded attempt did not settle. Choose a landed take for departure.');
  const last=source.states.at(-1)!;if(Math.abs(last.vz)>.025||last.power>.02||last.compression<1)throw Error('The ship must be landed and settled before departure.');
  const settings=source.settings,states=source.states.map(s=>({...s})),m=18000,g=3.8,ppm=25,dt=1/120,arm=5.3,I=m*arm*arm/3,k=m*g/(.22*settings.gear),damping=2*.44*Math.sqrt(k*m),weather=windField(settings),baseX=last.x/ppm;
  let x=baseX,h=(386-last.footY-last.compression)/ppm,vx=last.vx,vz=last.vz,angle=last.angle,omega=0,T=0,gimbal=0,offset=last.windOffset??0,liftoff:number|undefined;
  const start=states.length/24,startTime=last.time+1/24;
  for(let step=0;step<14*120;step++){
    const t=step*dt,time=startTime+t,w=weather(time),groundHeight=(386-groundAt(settings,x*ppm))/ppm;
    const climbing=t>=7,hoverTarget=groundHeight+1.6*smooth((t-2.3)/2.7),targetH=climbing?groundHeight+1.6+1.6*(t-7):hoverTarget,targetVz=climbing?1.6:t>2.3&&t<5?1.6*6*clamp((t-2.3)/2.7,0,1)*(1-clamp((t-2.3)/2.7,0,1))/2.7:0;
    const targetVx=climbing?3.5*smooth((t-7)/3):0,targetX=baseX+(climbing?3.5*Math.max(0,t-8.5):0);
    const axGoal=clamp(.22*(targetX-x)+1.3*(targetVx-vx)-w.ax,-2.5,2.5),azGoal=clamp(g+2.4*(targetH-h)+2.8*(targetVz-vz)-w.az,0,g*1.8);
    const ignition=smooth((t-1.5)/1.1),desiredT=clamp(m*Math.hypot(axGoal,azGoal),0,m*g*1.8*settings.thrust)*ignition;
    const desiredPitch=climbing?.16*smooth((t-7)/2):0,desiredGimbal=clamp(Math.atan2(axGoal,Math.max(.1,azGoal))-angle,-Math.PI/10,Math.PI/10);
    gimbal+=clamp((desiredGimbal-gimbal)*dt/.18,-.44*dt,.44*dt);T+=(desiredT-T)*dt/(.22*settings.engineLag);
    const theta=angle+gimbal,fx=T*Math.sin(theta),fz=T*Math.cos(theta);
    const support=(side:number)=>{const px=(x+side*arm*Math.cos(angle))*ppm,gy=groundAt(settings,px),gap=h-side*arm*Math.sin(angle)-(386-gy)/ppm,c=Math.max(0,-gap),speed=vz-side*arm*Math.cos(angle)*omega;return{gy,c,force:gap<=0?Math.max(0,k*.5*c-damping*.5*speed):0};};
    const left=support(-1),right=support(1),N=left.force+right.force,compression=(left.c+right.c)/2,free=Math.abs(vx)<.01&&Math.abs(fx+m*w.ax)<=.7*N;
    const friction=free?-(fx+m*w.ax):-Math.sign(vx||fx+m*w.ax)*Math.min(.7*N,m*Math.abs(vx)/dt),netX=fx+m*w.ax+friction,netZ=fz+N-m*g+m*(N>m*g*.5?0:w.az);
    if(liftoff===undefined&&t>2&&N<m*g*.01&&h-groundHeight>.05)liftoff=start+t;
    const requestedTorque=I*(12*(desiredPitch-angle)-6*omega),balance=clamp((requestedTorque+2*fx)/(arm*Math.max(1,fz)),-.35,.35),engineTorque=arm*fz*balance-2*fx,torque=engineTorque+arm*(left.force-right.force)+I*w.torque*.4,angular=torque/I;
    if(step%5===0){const clearance=Math.max(0,h-groundHeight),wash=T/(m*g)*clamp(1-clearance/3,0,1);states.push({frame:states.length,time,x:x*ppm,footY:386-(h+compression)*ppm,width:last.width,height:last.height,angle,altitude:clearance*ppm,power:T/(m*g),braking:0,compression:compression*ppm,vx,vz,ax:netX/m,verticalThrust:fz,supportForce:N,phase:t<1.5?'landed pause':liftoff===undefined?'engine spool and gear unloading':climbing?'powered departure':t<5?'liftoff':'heavy hover',windAx:w.ax,windAz:w.az,windTorque:w.torque,windSpeed:w.speed,windOffset:offset,controlAx:fx/m,referenceX:targetX*ppm,groundY:groundAt(settings,x*ppm),leftGroundY:left.gy,rightGroundY:right.gy,leftCompression:left.c*ppm,rightCompression:right.c*ppm,leftSupport:left.force,rightSupport:right.force,washStrength:wash,waterReaction:wash*clamp((850-x*ppm)/230,0,1),impactPulse:0,nozzleAngle:gimbal,thrustBalance:balance,thrustMagnitude:T,thrustX:fx,thrustZ:fz,netForceX:netX,netForceZ:netZ,angularAcceleration:angular,netTorque:torque});}
    vx+=netX/m*dt;vz+=netZ/m*dt;x+=vx*dt;h+=vz*dt;omega+=angular*dt;angle+=omega*dt;offset+=w.speed*dt;
  }
  if(liftoff===undefined||states.at(-1)!.altitude<200)throw Error('Departure did not achieve a stable powered climb.');
  return validatePerformance({...source,flightResult:undefined,simulationVersion:'landing-plus-vector-departure-1',states,stateHash:stateHash(states),duration_seconds:states.length/24,departure:{...(source.flightResult?{landingResult:source.flightResult}:{}),sourceMotionHash:source.stateHash,sourceFrames:source.states.length,start_seconds:start,ignition_seconds:start+1.5,liftoff_seconds:liftoff,hover_seconds:start+5,departure_seconds:start+7},physicsSummary:{...source.physicsSummary,outcome:'Landing, hover and departure'},controls:{...source.controls,gimbal_limit_radians:Math.PI/10,gimbal_rate_radians_per_second:.44,departure_integrator_hz:120}});
}
