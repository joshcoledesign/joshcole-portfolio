/** Small, shared validation boundary for the local directing experiment. */
export const SETTING_SPEC = {
    engineDirecting: { label: 'Direct engines', min: 0, max: 1, step: 1, group: 'engine' },
    engineIgnition: { label: 'Ignition', min: 4.5, max: 9, step: .1, group: 'engine' },
    engineCeiling: { label: 'Thrust ceiling', min: .25, max: 1.8, step: .05, group: 'engine' },
    engineShutdown: { label: 'Shutdown', min: 5, max: 26, step: .1, group: 'engine' },
    cueEnabled: { label: 'Cue directing', min: 0, max: 1, step: 1, group: 'cue' },
    cueBrake: { label: 'Brake cue', min: 4.5, max: 9, step: .1, group: 'cue' },
    cueHover: { label: 'Hover cue', min: 7.5, max: 15.5, step: .1, group: 'cue' },
    cueLand: { label: 'Land cue', min: 9, max: 20, step: .1, group: 'cue' },
    cueHeight: { label: 'Hover height', min: .7, max: 2, step: .1, group: 'cue' },
    pilotStyle: { label: 'Landing style', min: 0, max: 3, step: 1, group: 'pilot' },
    landingTarget: { label: 'Landing target', min: 640, max: 890, step: 5, group: 'ground' },
    roughness: { label: 'Ground unevenness', min: 0, max: 1, step: .05, group: 'ground' },
    groundSlope: { label: 'Ground slope', min: -3, max: 3, step: .25, group: 'ground' },
    carry: { label: 'Forward carry', min: .85, max: 1.15, step: .05, group: 'landing' },
    braking: { label: 'Braking strength', min: .85, max: 1.25, step: .05, group: 'landing' },
    descent: { label: 'Descent pace', min: .75, max: 1.25, step: .05, group: 'landing' },
    engineLag: { label: 'Engine response delay', min: .65, max: 1.35, step: .05, group: 'landing' },
    gear: { label: 'Gear softness', min: .8, max: 1.3, step: .05, group: 'landing' },
    wind: { label: 'Wind strength', min: 0, max: 2, step: .05, group: 'environment' },
    gustiness: { label: 'Gustiness', min: 0, max: 2, step: .05, group: 'environment' },
    correction: { label: 'Correction strength', min: .6, max: 1.4, step: .05, group: 'environment' },
    thrust: { label: 'Available thrust', min: .85, max: 1.2, step: .05, group: 'landing' },
    seed: { label: 'Variation seed', min: 1, max: 9999999, step: 1, group: 'variation' },
    dust: { label: 'Ground dust', min: .2, max: 1.8, step: .05, group: 'atmosphere' },
    smoke: { label: 'Exhaust smoke', min: .2, max: 1.8, step: .05, group: 'atmosphere' },
    ambient: { label: 'Ambient light', min: .7, max: 1.2, step: .05, group: 'atmosphere' },
};
export const DEFAULT_SETTINGS = { engineDirecting: 0, engineIgnition: 4.5, engineCeiling: 1.8, engineShutdown: 20, cueEnabled: 0, cueBrake: 5.5, cueHover: 11.5, cueLand: 14, cueHeight: 1.1, pilotStyle: 0, landingTarget: 755, roughness: 0, groundSlope: 0, carry: 1, braking: 1, descent: 1, engineLag: 1, gear: 1, wind: 1, gustiness: 1, correction: 1, thrust: 1, seed: 101, dust: 1, smoke: 1, ambient: 1 };
export const directorFrameCount = (settings) => 408 + 24 * Math.ceil(Math.max(0, 1 / settings.descent - 1) * 4);
export function parseSettings(input) {
    if (!input || typeof input !== 'object' || Array.isArray(input))
        throw new Error('Choose valid directing settings.');
    const data = input, result = { ...DEFAULT_SETTINGS };
    for (const [key, value] of Object.entries(data)) {
        if (!Object.hasOwn(SETTING_SPEC, key))
            throw new Error('Unknown setting: ' + key);
        const k = key, spec = SETTING_SPEC[k];
        if (typeof value !== 'number' || !Number.isFinite(value) || value < spec.min || value > spec.max)
            throw new Error(spec.label + ' is outside its supported range.');
        if (k === 'seed' && !Number.isInteger(value))
            throw new Error('Choose a whole-number seed.');
        if (k === 'pilotStyle' && !Number.isInteger(value))
            throw new Error('Choose an available landing style.');
        result[k] = value;
    }
    if (!Number.isInteger(result.cueEnabled))
        throw Error('Choose whether cue directing is enabled.');
    if (!Number.isInteger(result.engineDirecting))
        throw Error('Choose whether engine directing is enabled.');
    if (result.engineDirecting && result.engineShutdown - result.engineIgnition < .2)
        throw Error('Shutdown must follow ignition by at least 0.2 seconds.');
    if (result.cueEnabled && (result.cueHover - result.cueBrake < .75 || result.cueLand - result.cueHover < .5))
        throw Error('Leave at least 0.75 seconds from Brake to Hover, and 0.5 seconds from Hover to Land.');
    return result;
}
/** Pilot guidance/actuator choices. Mass, terrain, weather and force integration are shared. */
const standard = { brakeDelay: 1.3, brakeGain: 1, descentStart: 2.5, descentRate: .68, cushionRate: .44, rise: .28, fall: .19, pitchGain: .16, hoverSeconds: 0 };
export const PILOT_STYLES = [
    { id: 0, label: 'Standard', description: 'The existing coupled landing. Keeps earlier directing controls and saved takes compatible.', ...standard },
    { id: 1, label: 'Heavy transport', description: 'Early, sustained braking and slower engine spool. A steady descent ends with deliberate gear loading.', ...standard, brakeDelay: .65, brakeGain: .8, descentStart: 2.9, descentRate: .54, cushionRate: .4, rise: .48, fall: .28, pitchGain: .15 },
    { id: 2, label: 'Precision pilot', description: 'Brake onto the target, hold a short low hover, then descend gently with small corrections.', ...standard, brakeDelay: .75, descentRate: .55, cushionRate: .22, rise: .23, fall: .16, pitchGain: .14, hoverSeconds: 1.8 },
    { id: 3, label: 'Emergency arrival', description: 'Late braking and a faster descent demand stronger corrections, uneven contact and a larger debris reaction.', ...standard, brakeDelay: 2.3, brakeGain: 1.55, descentStart: .9, descentRate: 1, cushionRate: .64, rise: .4, fall: .24, pitchGain: .2 },
];
export function pilotStyle(id = 0) { const style = PILOT_STYLES.find(s => s.id === id); if (!style)
    throw Error('Choose an available landing style.'); return style; }
