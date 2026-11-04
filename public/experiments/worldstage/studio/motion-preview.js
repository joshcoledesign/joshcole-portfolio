import {MAIN_THRUSTERS,nozzleGimbal,nozzleLip} from './thruster-rig.js';
import {groundProfile} from './terrain-ground.js';
// Lightweight staging only. Saved states drive both this canvas and the final painter.
const load=src=>new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=()=>reject(new Error('Preview artwork could not load.'));image.src=src;});
const [ship,background]=await Promise.all([load('./assets/ship.png'),load('./assets/background.png')]);
const hull=document.createElement('canvas');hull.width=ship.width;hull.height=ship.height;const hc=hull.getContext('2d');hc.drawImage(ship,0,0);
const bells=MAIN_THRUSTERS.map(def=>{const layer=document.createElement('canvas');layer.width=ship.width;layer.height=ship.height;const c=layer.getContext('2d');for(const target of [c,hc]){target.save();target.beginPath();def.polygon.forEach((p,i)=>i?target.lineTo(...p):target.moveTo(...p));target.closePath();if(target===c){target.clip();target.drawImage(ship,0,0);}else{target.globalCompositeOperation='destination-out';target.fill();}target.restore();}return{...def,layer};});

export function drawMotion(canvas,performance,seconds){
  const ctx=canvas.getContext('2d');canvas.width=1280;canvas.height=544;
  const s=performance.states[Math.min(performance.states.length-1,Math.max(0,Math.floor(seconds*24)))];
  ctx.drawImage(background,0,0,1280,544);
  if(performance.terrain){const profile=groundProfile(performance.settings);for(let i=0;i<profile.length;i+=2){const p=profile[i],height=1+(i%7)*(performance.settings.roughness??0);ctx.fillStyle=i%3?'#11171bcc':'#303b4588';ctx.beginPath();ctx.moveTo(p.x-5,p.y+4);ctx.lineTo(p.x,p.y-height);ctx.lineTo(p.x+5,p.y+4);ctx.fill();}}
  const pivot=-s.height*.46;
  ctx.save();ctx.translate(s.x,s.footY+pivot);ctx.rotate(s.angle);
  if(s.power>.015&&s.frame<108){
    for(const [u,v]of [[.27,.90],[.37,.86],[.48,.91],[.55,.86],[.70,.92],[.80,.86],[.85,.90]]){
      const x=(u-.5)*s.width,y=-s.height-pivot+v*s.height;
      const height=Math.min(90,s.altitude+30)*Math.min(1.4,s.power),r=s.width*.018;
      const glow=ctx.createLinearGradient(x,y,x,y+height);glow.addColorStop(0,'#ffefca');glow.addColorStop(.3,'#ff9d3bdd');glow.addColorStop(1,'#ed511100');ctx.fillStyle=glow;ctx.beginPath();ctx.moveTo(x-r,y);ctx.lineTo(x+r,y);ctx.lineTo(x+r*.4,y+height);ctx.lineTo(x-r*.5,y+height);ctx.fill();
    }
  }
  ctx.transform(1,(s.perspective||0)*.1,(s.perspective||0)*.2,1,0,0);
  const local=p=>({x:((p[0]-85)/1761-.5)*s.width,y:((p[1]-10)/795-1)*s.height+s.compression-pivot});
  if(s.frame>=108)for(const def of bells){const p=local(def.pivot);ctx.save();ctx.translate(p.x,p.y);ctx.rotate(nozzleGimbal(s));ctx.drawImage(def.layer,0,0,ship.width,ship.height,-def.pivot[0]*s.width/1761,-def.pivot[1]*s.height/795,ship.width*s.width/1761,ship.height*s.height/795);ctx.restore();}
  const body=s.frame<108?ship:hull;

  if(performance.terrain&&s.compression>.01){for(let col=0;col<10;col++)for(let row=0;row<80;row++){const u=(col+.5)/10,v=row/80,next=(row+1)/80,w=Math.max(0,Math.min(1,(u-.177)/.646)),c=s.leftCompression*(1-w)+s.rightCompression*w;const heave=value=>{const a=Math.max(0,Math.min(1,(value-.73)/.27));return s.compression-c*a*a*(3-2*a);};const y=(v-1)*s.height+heave(v)-pivot,bottom=(next-1)*s.height+heave(next)-pivot;ctx.drawImage(body,85+col*1761/10,10+v*795,1761/10,795/80+1,(col/10-.5)*s.width,y,s.width/10+.4,bottom-y+1);}}
  else ctx.drawImage(body,85,10,1761,795,-s.width/2,-s.height-pivot+s.compression*.5,s.width,s.height-s.compression*.5);
  if(s.frame>=108&&s.power>.015){for(const def of bells){const a=local(def.pivot),b=local(def.lip),p=nozzleLip(a,b,nozzleGimbal(s));ctx.save();ctx.translate(p.x,p.y);ctx.rotate(nozzleGimbal(s));const h=Math.min(75,s.altitude+25)*Math.min(1.4,s.power),r=s.width*.023,g=ctx.createLinearGradient(0,0,0,h);g.addColorStop(0,'#fff0cd');g.addColorStop(.3,'#ffa13bee');g.addColorStop(1,'#ed511100');ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(-r,0);ctx.lineTo(r,0);ctx.lineTo(r*.4,h);ctx.lineTo(-r*.4,h);ctx.fill();ctx.restore();}}ctx.restore();
  if(performance.terrain){const target=performance.terrain.targetX;ctx.strokeStyle='#d2b287';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(target-8,409);ctx.lineTo(target,401);ctx.lineTo(target+8,409);ctx.stroke();ctx.fillStyle='#c8b08c';ctx.font='11px Segoe UI';ctx.fillText('TARGET',target-22,425);}
  if(s.time>=0&&performance.simulationVersion!=='preserved-legacy'){
    if(performance.settings.engineDirecting===1){ctx.fillStyle='#d8c5a7';ctx.font='12px Segoe UI';ctx.fillText(`ENGINE ${(s.enginePhase??'landing burn').toUpperCase()} · ${s.power.toFixed(2)} × WEIGHT`,22,496);}
    // A shared integrated field advects the staging streaks, including gust reversals.
    ctx.strokeStyle='#bed7e54a';ctx.lineWidth=1;
    for(let i=0;i<36;i++){const x=((i*127.3-(s.windOffset||0))%1400+1400)%1400-60,y=80+(i*73)%360;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-25,y+7);ctx.stroke();}
    ctx.font='13px Segoe UI';ctx.fillStyle='#c9d8e0';ctx.fillText(`WIND ${(s.windAx||0).toFixed(2)} m/s²    ${s.phase.toUpperCase()}`,22,518);
  }
}
