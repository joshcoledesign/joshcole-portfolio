/** Pilot guidance/actuator choices. Mass, terrain, weather and force integration are shared. */
const standard={brakeDelay:1.3,brakeGain:1,descentStart:2.5,descentRate:.68,cushionRate:.44,rise:.28,fall:.19,pitchGain:.16,hoverSeconds:0};
export const PILOT_STYLES=[
 {id:0,label:'Standard',description:'The existing coupled landing. Keeps earlier directing controls and saved takes compatible.',...standard},
 {id:1,label:'Heavy transport',description:'Early, sustained braking and slower engine spool. A steady descent ends with deliberate gear loading.',...standard,brakeDelay:.65,brakeGain:.8,descentStart:2.9,descentRate:.54,cushionRate:.4,rise:.48,fall:.28,pitchGain:.15},
 {id:2,label:'Precision pilot',description:'Brake onto the target, hold a short low hover, then descend gently with small corrections.',...standard,brakeDelay:.75,descentRate:.55,cushionRate:.22,rise:.23,fall:.16,pitchGain:.14,hoverSeconds:1.8},
 {id:3,label:'Emergency arrival',description:'Late braking and a faster descent demand stronger corrections, uneven contact and a larger debris reaction.',...standard,brakeDelay:2.3,brakeGain:1.55,descentStart:.9,descentRate:1,cushionRate:.64,rise:.4,fall:.24,pitchGain:.2},
] as const;
export function pilotStyle(id=0){const style=PILOT_STYLES.find(s=>s.id===id);if(!style)throw Error('Choose an available landing style.');return style;}
