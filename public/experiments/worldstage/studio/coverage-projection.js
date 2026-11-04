export const coverageAnchor=states=>states.find(s=>s.phase==='landed pause')?.x??states.at(-1).x;
export const COVERAGE_SCALE=1.45;
export function projectCoverageState(s,anchorX,view='wide'){
  if(view!=='shoreline')return s;
  const scale=COVERAGE_SCALE,out={...s,x:640+(s.x-anchorX)*scale,footY:386+(s.footY-386)*scale,width:s.width*scale,height:s.height*scale,altitude:s.altitude*scale,compression:s.compression*scale};
  for(const key of ['leftCompression','rightCompression'])if(s[key]!==undefined)out[key]=s[key]*scale;
  for(const key of ['groundY','leftGroundY','rightGroundY'])if(s[key]!==undefined)out[key]=386+(s[key]-386)*scale;
  return out;
}
