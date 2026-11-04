// Screen-space exhaust axis points down/left for positive body + gimbal angle.
export function exhaustGroundHit(mouth,groundAt){
 const c=Math.cos(mouth.angle),s=Math.sin(mouth.angle);if(c<.25)return null;
 let d=Math.max(0,(groundAt(mouth.x)-mouth.y)/c);
 for(let i=0;i<5;i++)d=Math.max(0,(groundAt(mouth.x-s*d)-mouth.y)/c);
 return{x:mouth.x-s*d,y:groundAt(mouth.x-s*d),distance:d};
}
