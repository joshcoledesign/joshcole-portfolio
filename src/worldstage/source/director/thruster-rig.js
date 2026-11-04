// Reference-space cutout contours. Source artwork stays intact; only the draw layers separate.
export const MAIN_THRUSTERS=[
  {id:'main-aft',pivot:[510,620],lip:[510,730],polygon:[[468,620],[553,620],[607,720],[605,735],[407,735],[410,718]]},
  {id:'main-mid',pivot:[995,623],lip:[995,732],polygon:[[947,623],[1043,623],[1108,721],[1108,737],[880,737],[884,719]]},
  {id:'main-forward',pivot:[1407,622],lip:[1407,731],polygon:[[1360,622],[1454,622],[1517,719],[1517,736],[1294,736],[1298,718]]},
];
export function nozzleGimbal(state){return state.nozzleAngle??Math.max(-Math.PI/10,Math.min(Math.PI/10,Math.atan2(state.controlAx??0,Math.max(.2,(state.verticalThrust??0)/18000))-state.angle));}
export function nozzleLip(pivot,lip,angle){const x=lip.x-pivot.x,y=lip.y-pivot.y;return{x:pivot.x+x*Math.cos(angle)-y*Math.sin(angle),y:pivot.y+x*Math.sin(angle)+y*Math.cos(angle)};}
