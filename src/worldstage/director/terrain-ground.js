// Shared stage geometry: pixels in the approved painted viewpoint, not a 3D mesh.
export function groundAt(settings,x){
  const rough=settings.roughness??0,slope=settings.groundSlope??0;
  return 386+Math.tan(slope*Math.PI/180)*(x-755)+rough*(5*Math.sin((x-620)/43)+3*Math.sin((x-690)/19));
}
export function groundProfile(settings){return Array.from({length:161},(_,i)=>({x:400+i*5,y:groundAt(settings,400+i*5)}));}
