import { projectCoverageState, COVERAGE_SCALE, coverageAnchor } from './coverage-projection.js';
import { MAIN_THRUSTERS, nozzleGimbal, nozzleLip } from './thruster-rig.js';
import { exhaustGroundHit } from './exhaust-ground.js';
import { groundAt as worldGroundAt } from './terrain-ground.js';
import { DEFAULT_SETTINGS } from './studio-config.js';
const createCanvas = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
const loadImage = src => new Promise((resolve, reject) => { const image = new Image(); image.onload = () => resolve(image); image.onerror = () => reject(Error('The scene artwork could not load.')); image.src = src; });
export async function createPainter(savedPerformance, cameraView = 'wide') {
    const vectorLanding = savedPerformance.simulationVersion === 'terrain-vector-controller-2' || savedPerformance.states[108]?.thrustMagnitude !== undefined;
    if (!['wide', 'shoreline'].includes(cameraView))
        throw Error('Unknown coverage view');
    const coverageScale = cameraView === 'shoreline' ? COVERAGE_SCALE : 1, anchorX = coverageAnchor(savedPerformance.states);
    const groundAt = (settings, x) => 386 + (worldGroundAt(settings, cameraView === 'shoreline' ? anchorX + (x - 640) / coverageScale : x) - 386) * coverageScale;
    const settings = savedPerformance.settings;
    for (const key of Object.keys(settings))
        if (!['dust', 'smoke', 'ambient'].includes(key) && settings[key] !== (savedPerformance.settings[key] ?? DEFAULT_SETTINGS[key]))
            throw new Error('Painting cannot change saved motion: ' + key);
    const W = 1280, H = 544, FPS = 24, COUNT = savedPerformance.states.length - 108, PIXELS_PER_M = 25 * coverageScale, GROUND_Y = 386;
    let LANDING_X = 755;
    // A fixed pre-roll precedes experiment time zero. It has no directing inputs.
    const INTRO_SECONDS = 4.5, INTRO_FRAMES = 108, FILM_COUNT = INTRO_FRAMES + COUNT;
    const canvas = createCanvas(W, H), ctx = canvas.getContext('2d');
    const [plate, ship, flame] = await Promise.all([loadImage(cameraView === 'shoreline' ? './assets/shoreline-background.png' : './assets/background.png'), loadImage(cameraView === 'shoreline' ? './assets/shoreline-ship.png' : './assets/ship.png'), loadImage('./assets/exhaust.png')]);
    const smooth = (value) => { const x = Math.max(0, Math.min(1, value)); return x * x * (3 - 2 * x); };
    let seed = 28102026;
    const random = () => { seed ^= seed << 13; seed ^= seed >>> 17; seed ^= seed << 5; return (seed >>> 0) / 4294967296; };
    const between = (a, b) => a + (b - a) * random();
    function bounds(image) {
        const c = createCanvas(image.width, image.height), x = c.getContext('2d');
        x.drawImage(image, 0, 0);
        const d = x.getImageData(0, 0, image.width, image.height).data;
        let left = image.width, right = 0, top = image.height, bottom = 0, transparent = 0, filled = 0;
        for (let y = 0; y < image.height; y++)
            for (let px = 0; px < image.width; px++) {
                const alpha = d[(y * image.width + px) * 4 + 3];
                if (alpha === 0)
                    transparent++;
                if (alpha > 12) {
                    filled++;
                    left = Math.min(left, px);
                    right = Math.max(right, px);
                    top = Math.min(top, y);
                    bottom = Math.max(bottom, y);
                }
            }
        return { x: left, y: top, w: right - left + 1, h: bottom - top + 1, transparent, coverage: filled / (image.width * image.height) };
    }
    const box = bounds(ship), flameBox = bounds(flame);
    const riggedHull = createCanvas(ship.width, ship.height), rigCtx = riggedHull.getContext('2d');
    rigCtx.drawImage(ship, 0, 0);
    const referencePoint = (p) => cameraView === 'shoreline' ? [box.x + (p[0] - 85) / 1761 * box.w, box.y + (p[1] - 10) / 795 * box.h] : p;
    const metalLayers = MAIN_THRUSTERS.map(def => { const layer = createCanvas(ship.width, ship.height), c = layer.getContext('2d'); const polygon = def.polygon.map(referencePoint); for (const target of [c, rigCtx]) {
        target.save();
        target.beginPath();
        polygon.forEach((p, i) => i ? target.lineTo(p[0], p[1]) : target.moveTo(p[0], p[1]));
        target.closePath();
        if (target === c) {
            target.clip();
            target.drawImage(ship, 0, 0);
        }
        else {
            target.globalCompositeOperation = 'destination-out';
            target.fill();
        }
        target.restore();
    } return { ...def, layer, crop: { x: Math.floor(Math.min(...polygon.map(p => p[0]))) - 2, y: Math.floor(Math.min(...polygon.map(p => p[1]))) - 2, w: Math.ceil(Math.max(...polygon.map(p => p[0])) - Math.min(...polygon.map(p => p[0]))) + 4, h: Math.ceil(Math.max(...polygon.map(p => p[1])) - Math.min(...polygon.map(p => p[1]))) + 4 } }; });
    // Animation light pass: a ship-alpha mask with zero warmth on upper armor.
    const warmShip = createCanvas(ship.width, ship.height), warmCtx = warmShip.getContext('2d');
    warmCtx.drawImage(ship, 0, 0);
    warmCtx.globalCompositeOperation = 'source-in';
    const underside = warmCtx.createLinearGradient(0, box.y + box.h * .60, 0, box.y + box.h);
    underside.addColorStop(0, 'rgba(255,135,45,0)');
    underside.addColorStop(.15, 'rgba(255,135,45,0)');
    underside.addColorStop(.35, 'rgba(255,145,55,.72)');
    underside.addColorStop(.7, 'rgba(255,151,65,.42)');
    underside.addColorStop(1, 'rgba(255,151,65,0)');
    warmCtx.fillStyle = underside;
    warmCtx.fillRect(0, 0, ship.width, ship.height);
    const warmRig = createCanvas(ship.width, ship.height), warmRigCtx = warmRig.getContext('2d');
    warmRigCtx.drawImage(warmShip, 0, 0);
    warmRigCtx.globalCompositeOperation = 'destination-out';
    for (const def of MAIN_THRUSTERS) {
        warmRigCtx.beginPath();
        def.polygon.map(referencePoint).forEach((p, i) => i ? warmRigCtx.lineTo(p[0], p[1]) : warmRigCtx.moveTo(p[0], p[1]));
        warmRigCtx.closePath();
        warmRigCtx.fill();
    }
    if (box.transparent < ship.width * ship.height * .2 || box.coverage < .2)
        throw new Error('Ship must have genuine alpha and a substantial subject');
    if (flameBox.transparent < flame.width * flame.height * .05)
        throw new Error('Exhaust layer must have genuine alpha');
    const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
    const gain = (value, t) => t < 0 ? 1 : 1 + (value - 1) * smooth(t / .8);
    const controls = savedPerformance.controls;
    const recorded = savedPerformance.states.map(s => projectCoverageState(s, anchorX, cameraView));
    const firstKeyframe = recorded[108], intro = recorded.slice(0, 108), fixedArrival = savedPerformance.fixedArrival;
    const CONTACT = savedPerformance.contact_seconds < 0 ? savedPerformance.duration_seconds + 10 : savedPerformance.contact_seconds;
    const engineDetail = savedPerformance.settings.engineDirecting === 1;
    const rich = !!savedPerformance.terrain, impactGain = rich ? clamp(savedPerformance.physicsSummary.vertical_contact_speed_mps / .4, .65, 2) : 1;
    function atTime(t) { return recorded[clamp(Math.round((t + 4.5) * 24), 0, recorded.length - 1)]; }
    LANDING_X = savedPerformance.departure ? recorded[savedPerformance.departure.sourceFrames - 1].x : recorded.at(-1).x;
    const WASH = recorded.find(s => s.time >= 0 && s.altitude < 80 && s.power > .9)?.time ?? CONTACT - 3;
    const physicsSummary = savedPerformance.physicsSummary;
    function weatherAt(t) {
        if (t < 0)
            return { offset: t * 140, speed: 140, energy: 0 };
        const f = Math.min(recorded.length - 1, 108 + t * 24), a = recorded[Math.floor(f)], b = recorded[Math.min(recorded.length - 1, Math.floor(f) + 1)], u = f - Math.floor(f);
        return { offset: (a.windOffset ?? a.time * 140) * (1 - u) + (b.windOffset ?? b.time * 140) * u, speed: (a.windSpeed ?? 140) * (1 - u) + (b.windSpeed ?? 140) * u, energy: Math.abs((a.windAx ?? 0) * (1 - u) + (b.windAx ?? 0) * u) };
    }
    const weatherPhase = (t) => weatherAt(t).offset / 140;
    const flowDelta = (t, birth) => weatherPhase(t) - weatherPhase(birth);
    function state(frame) { return recorded[frame]; }
    function heave(s, v, u = .5) { const weight = clamp((u - .177) / .646, 0, 1), compression = s.leftCompression === undefined ? s.compression : s.leftCompression * (1 - weight) + s.rightCompression * weight; return s.compression - compression * smooth((v - .73) / .27); }
    function point(s, px, py) {
        if (cameraView === 'shoreline') {
            px = box.x + (px - 85) / 1761 * box.w;
            py = box.y + (py - 10) / 795 * box.h;
        }
        const v = (py - box.y) / box.h, pivot = -s.height * .46;
        const u = (px - box.x) / box.w, perspective = s.perspective ?? 0;
        const localY = (v - 1) * s.height + heave(s, v, u) - pivot, localX = (u - .5) * s.width;
        const y = localY + perspective * .1 * localX;
        const x = localX + perspective * .2 * localY;
        return { x: s.x + x * Math.cos(s.angle) - y * Math.sin(s.angle), y: s.footY + pivot + x * Math.sin(s.angle) + y * Math.cos(s.angle) };
    }
    // A shallow projected card turn supplies subtle perspective within the painted
    // pipeline; shared projection keeps the exhaust attached to the turning artwork.
    function arrivalPlane(image, s, pivot) {
        const perspective = s.perspective ?? 0;
        ctx.save();
        ctx.transform(1, perspective * .1, perspective * .2, 1, 0, 0);
        ctx.drawImage(image, box.x, box.y, box.w, box.h, -s.width / 2, -s.height - pivot, s.width, s.height);
        ctx.restore();
    }
    // Reference: three prominent bells plus four smaller recessed exhaust sources.
    // Draw recessed plumes first so the painted hull, bells and gear occlude them.
    const nozzles = [
        { id: 'recessed-aft-upper', anchor: [600, 645], scale: .46, depth: 'far' },
        { id: 'recessed-aft-lower', anchor: [710, 672], scale: .44, depth: 'far' },
        { id: 'recessed-mid', anchor: [1210, 640], scale: .49, depth: 'far' },
        { id: 'recessed-forward', anchor: [1530, 637], scale: .46, depth: 'far' },
        { id: 'main-aft', anchor: [510, 718], scale: 1, depth: 'near' },
        { id: 'main-mid', anchor: [995, 730], scale: 1, depth: 'near' },
        { id: 'main-forward', anchor: [1407, 730], scale: 1, depth: 'near' },
    ];
    // The reflection is a separate water-clipped pass. Land/foreground rock holes
    // keep the reflected light off the volcanic shelf and larger protruding rocks.
    const reflectionControls = { mirror_y: 400, ship_opacity: .24, exhaust_opacity: .38, ripple_band_pixels: 2 };
    const reflectionCanvas = createCanvas(W, H), reflectionCtx = reflectionCanvas.getContext('2d');
    const rippleCanvas = createCanvas(W, H), rippleCtx = rippleCanvas.getContext('2d');
    const waterMask = createCanvas(W, H), maskCtx = waterMask.getContext('2d');
    maskCtx.fillStyle = 'white';
    maskCtx.beginPath();
    for (const [i, p] of [[0, 405], [175, 400], [280, 407], [365, 418], [405, 437], [520, 438], [600, 450], [710, 460], [840, 485], [960, 520], [980, 544], [0, 544]].entries()) {
        if (i === 0)
            maskCtx.moveTo(p[0], p[1]);
        else
            maskCtx.lineTo(p[0], p[1]);
    }
    maskCtx.closePath();
    maskCtx.fill();
    if (cameraView === 'shoreline') {
        maskCtx.clearRect(0, 0, W, H);
        maskCtx.fillStyle = 'white';
        maskCtx.beginPath();
        for (const [i, p] of [[0, 416], [180, 420], [350, 435], [520, 450], [720, 462], [1000, 471], [1280, 480], [1280, 544], [0, 544]].entries()) {
            if (i === 0)
                maskCtx.moveTo(p[0], p[1]);
            else
                maskCtx.lineTo(p[0], p[1]);
        }
        maskCtx.closePath();
        maskCtx.fill();
    }
    const islands = [[[315, 405], [355, 377], [380, 378], [425, 421], [390, 435]], [[0, 449], [90, 465], [128, 491], [230, 490], [250, 544], [0, 544]], [[300, 481], [348, 464], [376, 482], [405, 507], [382, 527], [298, 514]], [[870, 482], [905, 476], [960, 492], [1100, 520], [1280, 544], [850, 544]]];
    maskCtx.globalCompositeOperation = 'destination-out';
    for (const polygon of islands) {
        maskCtx.beginPath();
        polygon.forEach((p, i) => i === 0 ? maskCtx.moveTo(p[0], p[1]) : maskCtx.lineTo(p[0], p[1]));
        maskCtx.closePath();
        maskCtx.fill();
    }
    // Dark rock specks interrupt the sheen instead of receiving a perfect mirror.
    const terrainCanvas = createCanvas(W, H), terrainCtx = terrainCanvas.getContext('2d');
    terrainCtx.drawImage(plate, 0, 0, W, H);
    const terrain = terrainCtx.getImageData(0, 0, W, H).data, maskPixels = maskCtx.getImageData(0, 0, W, H);
    for (let i = 0; i < terrain.length; i += 4) {
        const light = (terrain[i] + terrain[i + 1] + terrain[i + 2]) / 3;
        maskPixels.data[i + 3] = Math.round(maskPixels.data[i + 3] * clamp((light - 9) / 24, 0, 1));
    }
    maskCtx.putImageData(maskPixels, 0, 0);
    function waterReflection(s) {
        const r = reflectionCtx, t = s.time;
        r.clearRect(0, 0, W, H);
        const pivot = -s.height * .46;
        r.save();
        r.globalAlpha = reflectionControls.ship_opacity;
        r.translate(s.x, 800 - s.footY - pivot);
        r.scale(1, -1);
        r.rotate(s.angle);
        if (s.perspective)
            r.transform(1, s.perspective * .1, s.perspective * .2, 1, 0, 0);
        r.filter = `brightness(${gain(settings.ambient, t)})`;
        r.drawImage(ship, box.x, box.y, box.w, box.h, -s.width / 2, -s.height - pivot + s.compression, s.width, s.height);
        r.restore();
        if (s.power > .015)
            for (let i = 0; i < nozzles.length; i++) {
                const n = nozzles[i], p = point(s, ...n.anchor), strength = clamp(s.power, 0, 1.3) * n.scale * (cameraView === 'shoreline' ? .22 : 1);
                r.save();
                r.globalCompositeOperation = 'screen';
                r.globalAlpha = reflectionControls.exhaust_opacity * strength;
                const width = 55 * n.scale * s.width / 410, height = 90 * s.power * s.width / 410;
                r.translate(p.x, 800 - p.y);
                r.scale(1, -1);
                if (cameraView !== 'shoreline')
                    r.drawImage(flame, flameBox.x, 72, flameBox.w, flame.height - 72, -width / 2, 0, width, height);
                r.restore();
                r.save();
                r.globalCompositeOperation = 'screen';
                r.translate(p.x, 478 + s.altitude * .18);
                r.scale(35 * n.scale * s.width / 410, 38);
                const sheen = r.createRadialGradient(0, 0, 0, 0, 0, 1);
                sheen.addColorStop(0, `rgba(255,157,61,${.23 * strength})`);
                sheen.addColorStop(.5, `rgba(238,130,44,${.10 * strength})`);
                sheen.addColorStop(1, 'rgba(238,130,44,0)');
                r.fillStyle = sheen;
                r.fillRect(-1, -1, 2, 2);
                r.restore();
                // Stretched, broken specular flecks carry the hot core into foreground water.
                for (let y = 420; y < H; y += 3) {
                    const wave = Math.sin(y * .37 + t * 3 + i * 1.7), flicker = .55 + .45 * Math.sin(y * 1.9 + t * 4 + i);
                    const spread = (10 + (y - 420) * .28) * n.scale * s.width / 410;
                    const x = p.x + wave * (3 + (y - 420) * .045), fade = 1 - (y - 420) / 150;
                    r.fillStyle = `rgba(255,${Math.round(154 + flicker * 44)},${Math.round(67 + flicker * 47)},${.55 * strength * fade * flicker})`;
                    r.fillRect(x - spread * .5, y, spread, 1.3);
                }
            }
        const q = rippleCtx;
        q.clearRect(0, 0, W, H);
        for (let y = 398; y < H; y += 2) {
            const offset = (Math.sin(y * .25 - t * 2.4) * 3 + Math.sin(y * .77 + t * 3.1) * 1.5) * (t < 0 ? 1 : 1 + weatherAt(t).energy * .3);
            q.globalAlpha = .5 + .5 * Math.abs(Math.sin(y * .64 + t * .7));
            q.drawImage(reflectionCanvas, 0, y, W, 2, offset, y, W, 2);
        }
        q.globalAlpha = 1;
        q.globalCompositeOperation = 'destination-in';
        q.drawImage(waterMask, 0, 0);
        q.globalCompositeOperation = 'source-over';
        ctx.drawImage(rippleCanvas, 0, 0);
    }
    const dust = Array.from({ length: 360 }, (_, i) => ({ birth: between(i < 240 ? WASH : CONTACT - .28, i < 240 ? CONTACT + .25 : CONTACT + .65), side: random() < .5 ? -1 : 1, speed: between(85, 260), rise: between(12, 55), size: between(12, 29), life: between(3.2, 5.5), phase: between(0, 6.28) }));
    const chips = Array.from({ length: 420 }, (_, i) => ({ birth: between(i < 260 ? CONTACT - 1.7 : CONTACT - .08, CONTACT + .45), vx: between(-260, 260), vy: between(-150, -40), size: between(.7, 3.5), phase: between(0, 6.28) }));
    if (savedPerformance.departure)
        for (const s of recorded) {
            if (s.frame < savedPerformance.departure.sourceFrames || s.frame % 4 || s.power < .15 || s.altitude > 80)
                continue;
            for (const side of [-1, 1]) {
                dust.push({ birth: s.time, side, speed: 90 + 100 * Math.min(1, s.power), rise: 22, size: 17, life: 4.5, phase: s.frame * .73 });
                if (s.frame % 8 === 0)
                    chips.push({ birth: s.time, vx: side * (65 + s.power * 45), vy: -70, size: 1.4, phase: s.frame * .43 });
            }
        }
    const ash = Array.from({ length: 1100 }, () => ({ x: between(0, W), y: between(0, H), speed: between(180, 430), length: between(4, 22), opacity: between(.07, .27) }));
    const atmosphere = { wind_direction: 'right to left, slightly downward', dust_advection_pixels_per_second: 48, dust_lifetime_seconds: [3.2, 5.5], dust_clouds: 360, airborne_grit: 420, wind_streaks: 1100, wind_veils: 24 };
    // Cache irregular, soft-edged brush clouds. Each stamp is a clustered density field,
    // not a stack of hard translucent circles; cool body and warm scatter share texture.
    const cloudStamps = Array.from({ length: 6 }, () => {
        const c = createCanvas(192, 128), p = c.getContext('2d');
        for (let n = 0; n < 32; n++) {
            const a = between(0, Math.PI * 2), distance = Math.sqrt(random());
            const x = 96 + Math.cos(a) * distance * 57, y = 64 + Math.sin(a) * distance * 27, r = between(8, 25);
            const g = p.createRadialGradient(x, y, 0, x, y, r);
            g.addColorStop(0, 'rgba(160,155,147,.09)');
            g.addColorStop(.45, 'rgba(146,144,140,.065)');
            g.addColorStop(1, 'rgba(132,136,144,0)');
            p.fillStyle = g;
            p.fillRect(x - r, y - r, r * 2, r * 2);
        }
        const warm = createCanvas(192, 128), q = warm.getContext('2d');
        q.drawImage(c, 0, 0);
        q.globalCompositeOperation = 'source-in';
        q.fillStyle = '#eda363';
        q.fillRect(0, 0, 192, 128);
        return { cool: c, warm };
    });
    const windVeils = Array.from({ length: 24 }, () => ({ x: between(0, W + 700), y: between(323, 428), size: between(110, 230), speed: between(45, 85), phase: between(0, 6.28) }));
    const waterStrokes = Array.from({ length: 45 }, () => ({ x: between(0, 650), y: between(430, 542), length: between(6, 24), phase: between(0, 6.28) }));
    const smokeStamps = cloudStamps.map(stamp => {
        const c = createCanvas(192, 128), p = c.getContext('2d');
        for (let n = 0; n < 4; n++)
            p.drawImage(stamp.cool, 0, 0);
        p.globalCompositeOperation = 'source-in';
        p.fillStyle = '#747b83';
        p.fillRect(0, 0, 192, 128);
        return c;
    });
    function nozzlePose(s, index) {
        if (s.frame < 108)
            return { ...point(s, ...nozzles[index].anchor), angle: -.27 * s.braking };
        const def = index >= 4 ? MAIN_THRUSTERS[index - 4] : null, gimbal = nozzleGimbal(s);
        if (!def) {
            const p = point(s, ...nozzles[index].anchor);
            return { ...p, angle: s.angle + gimbal };
        }
        const pivot = point(s, def.pivot[0], def.pivot[1]), a = referencePoint(def.pivot), b = referencePoint(def.lip), dx = (b[0] - a[0]) * s.width / box.w, dy = (b[1] - a[1]) * s.height / box.h, lip = { x: pivot.x + dx * Math.cos(s.angle) - dy * Math.sin(s.angle), y: pivot.y + dx * Math.sin(s.angle) + dy * Math.cos(s.angle) }, out = nozzleLip(pivot, lip, gimbal);
        return { ...out, angle: s.angle + gimbal };
    }
    function metalThrusters(s) {
        const scale = s.width / 410;
        for (const def of metalLayers) {
            const pivot = point(s, ...def.pivot), a = s.angle + nozzleGimbal(s);
            for (const side of [-1, 1]) {
                const anchor = point(s, def.pivot[0] + side * 32, def.pivot[1] - 12), dx = side * 16 * s.width / 1761, dy = 36 * s.height / 795, end = { x: pivot.x + dx * Math.cos(a) - dy * Math.sin(a), y: pivot.y + dx * Math.sin(a) + dy * Math.cos(a) };
                ctx.save();
                ctx.lineCap = 'round';
                ctx.beginPath();
                ctx.moveTo(anchor.x, anchor.y);
                ctx.lineTo(end.x, end.y);
                ctx.strokeStyle = '#11191e';
                ctx.lineWidth = 3.4 * scale;
                ctx.stroke();
                ctx.strokeStyle = '#78848b';
                ctx.lineWidth = 1.1 * scale;
                ctx.stroke();
                ctx.fillStyle = '#98a2a5';
                for (const p of [anchor, end]) {
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, 1.15 * scale, 0, Math.PI * 2);
                    ctx.fill();
                }
                ctx.restore();
            }
        }
        for (const def of metalLayers) {
            const pivot = point(s, def.pivot[0], def.pivot[1]), sourcePivot = referencePoint(def.pivot);
            ctx.save();
            ctx.translate(pivot.x, pivot.y);
            ctx.rotate(s.angle + nozzleGimbal(s));
            ctx.drawImage(def.layer, def.crop.x, def.crop.y, def.crop.w, def.crop.h, (def.crop.x - sourcePivot[0]) * s.width / box.w, (def.crop.y - sourcePivot[1]) * s.height / box.h, def.crop.w * s.width / box.w, def.crop.h * s.height / box.h);
            ctx.restore();
        }
    }
    function nozzleRims(s) { if (s.frame < 108)
        return; for (let i = 4; i < 7; i++) {
        const p = nozzlePose(s, i), r = s.width * .05 * nozzles[i].scale;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.beginPath();
        ctx.ellipse(0, 0, r, Math.max(1.2, s.width * .0034), 0, 0, Math.PI);
        ctx.strokeStyle = s.power > .08 ? '#bda286' : '#6c7980';
        ctx.globalAlpha = .8;
        ctx.lineWidth = Math.max(.7, s.width / 650);
        ctx.stroke();
        ctx.restore();
    } }
    const exhaustSmoke = [];
    // Birth positions are sampled from the saved flight, so old smoke stays in world
    // space rather than being dragged along with the moving hull.
    for (const s of recorded) {
        if (s.frame % 3 !== 0 || s.power < .08)
            continue;
        for (let i = 0; i < nozzles.length; i++)
            for (const side of [-1, 1]) {
                const n = nozzles[i], p = nozzlePose(s, i), phase = s.frame * .73 + i * 2.13 + side;
                exhaustSmoke.push({ birth: s.time, x: p.x, y: p.y, vx: s.vx * PIXELS_PER_M * .28,
                    ...(engineDetail && s.frame >= 108 ? { angle: p.angle } : {}), power: s.power, scale: n.scale * s.width / 410, distance: s.width / 410, side, phase, life: 1.5 + .5 * (1 + Math.sin(phase)), nozzle: i });
            }
    }
    const exhaustTreatment = { layers: ['soft amber envelope', 'painted turbulent flame', 'bright narrow core', 'advected cool smoke with hot inner scatter'], smoke_birth_hz_per_side: 8, smoke_particles: exhaustSmoke.length };
    const hotGasStamp = createCanvas(96, 96), gasCtx = hotGasStamp.getContext('2d'), gas = gasCtx.createRadialGradient(44, 39, 0, 48, 48, 45);
    gas.addColorStop(0, 'rgba(255,244,206,.48)');
    gas.addColorStop(.35, 'rgba(255,175,73,.25)');
    gas.addColorStop(.7, 'rgba(222,95,25,.09)');
    gas.addColorStop(1, 'rgba(99,64,46,0)');
    gasCtx.fillStyle = gas;
    gasCtx.fillRect(0, 0, 96, 96);
    // New vector landings emit from the ground intersection of the actual nozzle axis.
    // Existing captured performances retain their original environment treatment.
    const groundEmissions = [];
    if (vectorLanding) {
        dust.length = 0;
        for (const s of recorded) {
            if (s.frame < 108 || s.frame % 4 || s.power < .05 || s.altitude > 90 * coverageScale)
                continue;
            for (let i = 4; i < 7; i++) {
                const hit = exhaustGroundHit(nozzlePose(s, i), x => groundAt(settings, x));
                if (!hit)
                    continue;
                const strength = s.power * clamp(1 - s.altitude / (100 * coverageScale), 0, 1), delay = hit.distance / (950 * coverageScale);
                groundEmissions.push({ frame: s.frame, nozzle: i, x: hit.x, y: hit.y, strength });
                for (const side of [-1, 1])
                    dust.push({ birth: s.time + delay, side, speed: 60 + strength * 140, rise: 10 + strength * 30, size: 10 + strength * 10, life: 3.5 + Math.min(1, strength), phase: s.frame * .73 + i * 2.1, originX: hit.x, originY: hit.y - 3, emissionStrength: strength });
            }
        }
    }
    function smokeLayer(t, front) {
        for (let i = 0; i < exhaustSmoke.length; i++) {
            if ((i % 3 === 0) !== front)
                continue;
            const p = exhaustSmoke[i], age = t - p.birth;
            if (age < 0 || age > p.life)
                continue;
            const descent = 83 * p.distance * (1 - Math.exp(-age * 3.2));
            const y = Math.min(384, p.y + descent * Math.cos(p.angle ?? 0)) - age * age * 12;
            const spill = Math.max(0, p.y + descent - 384);
            const x = p.x - Math.sin(p.angle ?? 0) * descent + p.vx * age - (rich ? 65 : 37) * flowDelta(t, p.birth) + p.side * (5 + age * 14 + spill * .8) + Math.sin(age * 7 + p.phase) * age * 5;
            const size = (8 + age * 28) * Math.sqrt(p.scale);
            const alpha = Math.min(1, (front ? .52 : .82) * Math.min(1, p.power) * smooth(age / .12) * (1 - smooth((age / p.life - .35) / .65)) * gain(settings.smoke, t));
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(p.side * age * .33);
            ctx.globalAlpha = alpha;
            ctx.drawImage(smokeStamps[i % 6], -size * 1.5, -size, size * 3, size * 2);
            // The inner edge catches flame light; outer smoke keeps cool shadow density.
            ctx.globalCompositeOperation = 'screen';
            ctx.globalAlpha = alpha * .9 * Math.exp(-age * 3);
            ctx.drawImage(cloudStamps[i % 6].warm, -size * 1.1 - p.side * size * .2, -size * .85, size * 2.2, size * 1.7);
            ctx.restore();
        }
    }
    function glow(x, y, rx, ry, power) {
        if (power < .01)
            return;
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(rx, ry);
        const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
        g.addColorStop(0, `rgba(255,166,63,${Math.min(.45, power * .26)})`);
        g.addColorStop(.4, `rgba(245,123,40,${Math.min(.2, power * .10)})`);
        g.addColorStop(1, 'rgba(230,110,30,0)');
        ctx.fillStyle = g;
        ctx.fillRect(-1, -1, 2, 2);
        ctx.restore();
    }
    function paintedJet(s, index) {
        if (s.power < .015)
            return;
        const balance = s.thrustBalance ?? 0, power = s.power * (index === 4 ? 1 + balance : index === 6 ? 1 - balance : 1);
        s = { ...s, power };
        const nozzle = nozzles[index], p = nozzlePose(s, index);
        const phaseIndex = nozzle.depth === 'near' ? index - 4 : index + 3;
        let height = Math.min(95 * s.power, s.altitude + 45 * s.width / 650) * (nozzle.depth === 'far' ? 1.12 : 1) * s.width / 410;
        if (vectorLanding && s.frame >= 108) {
            const hit = exhaustGroundHit(p, x => groundAt(settings, x));
            if (hit)
                height = Math.min(height, hit.distance + 3);
        }
        const width = (75 + 14 * Math.sin(s.time * 42 + phaseIndex)) * Math.sqrt(s.power) * s.width / 650 * nozzle.scale;
        ctx.save();
        if (cameraView === 'shoreline' || vectorLanding && s.frame >= 108) {
            ctx.beginPath();
            ctx.rect(0, 0, W, groundAt(settings, p.x) - 1);
            ctx.clip();
        }
        ctx.translate(p.x, p.y - 1);
        ctx.rotate(s.frame < 108 ? -.27 * s.braking : p.angle);
        ctx.globalAlpha = Math.min(1, s.power * 1.6);
        // A broad low-opacity envelope surrounds a narrower bright body, with an
        // off-axis shadow/smoke layer supplying depth rather than a flat extra glow.
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        ctx.globalAlpha = .22 * Math.min(1, s.power);
        ctx.drawImage(flame, flameBox.x, 72, flameBox.w, flame.height - 72, -width * .78, 0, width * 1.56, height * 1.04);
        ctx.restore();
        const bands = 44;
        for (let row = 0; row < bands; row++) {
            const u = row / bands, sourceY = 72 + u * (flame.height - 72);
            const offset = s.frame < 108 ? Math.sin(u * 15 - s.time * 30 + phaseIndex * 1.9) * 2.4 * u : Math.sin(u * 11 - s.time * 21 + phaseIndex * 1.9) * 3.5 * u + Math.sin(u * 29 - s.time * 37 + phaseIndex) * 1.3 * u * u;
            const squash = s.frame < 108 ? 1 + .07 * Math.sin(u * 29 + s.time * 38 + phaseIndex) : 1 + (.08 + .11 * u) * Math.sin(u * 19 - s.time * 23 + phaseIndex);
            ctx.drawImage(flame, flameBox.x, sourceY, flameBox.w, (flame.height - 72) / bands + 1, -width * squash / 2 + offset, u * height, width * squash, height / bands + 1);
        }
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        ctx.globalAlpha = .5 * Math.min(1, s.power);
        ctx.drawImage(flame, flameBox.x, 72, flameBox.w, flame.height - 72, -width * .22, 0, width * .44, height * .72);
        ctx.restore();
        if (s.frame >= 108) {
            ctx.save();
            ctx.globalCompositeOperation = 'screen';
            ctx.globalAlpha = Math.min(.25, s.power * .17);
            for (let lobe = 0; lobe < 4; lobe++) {
                const u = (lobe / 4 + s.time * 2.2 + phaseIndex * .17) % 1, r = width * (.22 + .25 * u), x = Math.sin(u * 12 - s.time * 16 + phaseIndex) * width * .1 * u;
                ctx.drawImage(hotGasStamp, x - r, u * height - r * .8, r * 2, r * 2.3);
            }
            ctx.restore();
        }
        if (engineDetail && s.frame >= 108 && index >= 4) {
            const previous = recorded[Math.max(108, s.frame - 1)], spool = Math.max(0, s.power - previous.power), radius = Math.max(2, width * .25);
            ctx.save();
            ctx.globalCompositeOperation = 'screen';
            ctx.globalAlpha = Math.min(.95, .35 + s.power * .35 + spool * 5);
            const throat = ctx.createRadialGradient(0, 1, 0, 0, 1, radius);
            throat.addColorStop(0, '#fffbe8');
            throat.addColorStop(.3, '#ffd79d');
            throat.addColorStop(1, '#ed731000');
            ctx.fillStyle = throat;
            ctx.scale(1, .32);
            ctx.fillRect(-radius, -radius + 3, radius * 2, radius * 2);
            ctx.restore();
        }
        ctx.restore();
    }
    function dustLayer(t, front) {
        for (let i = 0; i < dust.length; i++) {
            if ((i % 2 === 0) !== front)
                continue;
            const d = dust[i], age = t - d.birth;
            if (age < 0 || age > d.life)
                continue;
            const origin = atTime(d.birth), reaction = d.emissionStrength !== undefined ? clamp(d.emissionStrength, 0, 1.8) : rich ? clamp((origin.washStrength ?? 0) * .7 + impactGain * .5, .5, 1.8) : 1;
            const opacity = Math.min(1, reaction * (front ? .29 : .63) * smooth(age / .16) * (1 - smooth((age / d.life - .45) / .55)) * gain(settings.dust, t));
            // Radial engine wall jet loses speed; prevailing wind keeps advecting the cloud.
            const radial = d.speed * (rich ? impactGain : 1) * 1.6 * (1 - Math.exp(-age / 1.6));
            const x = (d.originX ?? ((rich ? origin.x : LANDING_X) + Math.sin(d.phase) * 95)) + d.side * (18 + radial) - 48 * flowDelta(t, d.birth);
            const y = (d.originY ?? (rich ? groundAt(settings, origin.x) - 3 : 383)) - d.rise * (front ? 1 : 1.6) * (1 - Math.exp(-age / 1.25)) + Math.sin(age * 2 + d.phase) * 7;
            const size = d.size + age * 19;
            const active = vectorLanding || savedPerformance.departure && t >= savedPerformance.departure.start_seconds - 4.5;
            const warmth = (active ? Math.min(1, atTime(t).power) : clamp(1 - (t - CONTACT) / .85, 0, 1)) * Math.exp(-Math.abs(x - (active ? atTime(t).x : LANDING_X)) / 240);
            const stamp = cloudStamps[i % cloudStamps.length];
            ctx.save();
            ctx.globalAlpha = opacity;
            ctx.drawImage(stamp.cool, x - size * 1.8, y - size * .8, size * 3.6, size * 1.6);
            ctx.globalCompositeOperation = 'screen';
            ctx.globalAlpha = opacity * warmth * 1.3;
            ctx.drawImage(stamp.warm, x - size * 1.8, y - size * .8, size * 3.6, size * 1.6);
            ctx.restore();
        }
    }
    function groundRolls(t, front) {
        for (const [i, e] of groundEmissions.entries()) {
            if (e.frame % 8 || (i % 2 === 0) !== front)
                continue;
            const birth = recorded[e.frame].time + .08, age = t - birth, life = 3.8;
            if (age < 0 || age > life)
                continue;
            const phase = e.frame * .61 + e.nozzle * 2.3, fade = smooth(age / .2) * (1 - smooth((age / life - .4) / .6)), power = atTime(t).power;
            for (const side of [-1, 1]) {
                const radius = 12 + age * 18, x = e.x + side * (12 + 115 * e.strength * (1 - Math.exp(-age * 1.4))) - 48 * flowDelta(t, birth), y = e.y - 4 - radius * .24 - Math.sin(age * 2 + phase) * 3, alpha = Math.min(.14, (front ? .045 : .06) * e.strength * fade);
                ctx.save();
                ctx.translate(x, y);
                ctx.scale(1.7, .65);
                ctx.rotate(side * age * .9 + phase);
                ctx.globalAlpha = alpha;
                ctx.drawImage(cloudStamps[i % 6].cool, -radius, -radius, radius * 2, radius * 2);
                ctx.globalCompositeOperation = 'screen';
                ctx.globalAlpha = alpha * Math.min(1, power) * Math.exp(-Math.abs(x - atTime(t).x) / 220);
                ctx.drawImage(cloudStamps[i % 6].warm, -radius, -radius, radius * 2, radius * 2);
                ctx.restore();
            }
        }
    }
    function footContact(s, front) {
        if (s.frame < 108 || !savedPerformance.terrain)
            return;
        for (const [i, u] of [.177, .823].entries()) {
            const support = i ? s.rightSupport : s.leftSupport, p = point(s, 85 + 1761 * u, 805), floor = groundAt(settings, p.x);
            if (!front && support && support > 100) {
                ctx.save();
                ctx.translate(p.x, floor + 1);
                ctx.scale(s.width * .027, 2.6 * s.width / 410);
                const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
                g.addColorStop(0, `rgba(2,5,8,${Math.min(.55, .16 + support / (18000 * 3.8) * .36)})`);
                g.addColorStop(1, 'rgba(2,5,8,0)');
                ctx.fillStyle = g;
                ctx.fillRect(-1, -1, 2, 2);
                ctx.restore();
            }
            if (front) {
                const time = i ? savedPerformance.terrain.right_contact_seconds : savedPerformance.terrain.left_contact_seconds, age = s.time - time;
                if (time < 0 || age < 0 || age > 1.1)
                    continue;
                const birth = atTime(time), origin = point(birth, 85 + 1761 * u, 805), r = (5 + age * 18) * Math.max(.5, Math.min(1.5, savedPerformance.physicsSummary.vertical_contact_speed_mps / .4));
                ctx.save();
                ctx.globalAlpha = .32 * smooth(age / .09) * (1 - smooth(age / 1.1));
                ctx.drawImage(cloudStamps[i].cool, origin.x - r * 1.5 - 30 * flowDelta(s.time, time), groundAt(settings, origin.x) - r * .55, r * 3, r);
                ctx.restore();
            }
        }
    }
    function windLayer(t, front) {
        ctx.save();
        for (let i = 0; i < windVeils.length; i++) {
            if ((i % 3 === 0) !== front)
                continue;
            const v = windVeils[i];
            const x = ((v.x - weatherPhase(t) * v.speed) % (W + 700) + W + 700) % (W + 700) - 350;
            const y = v.y + Math.sin(t * .7 + v.phase) * 8;
            ctx.globalAlpha = front ? .25 : .34;
            ctx.drawImage(cloudStamps[i % 6].cool, x - v.size * 1.5, y - v.size * .22, v.size * 3, v.size * .44);
        }
        ctx.restore();
    }
    const warmDeformation = createCanvas(W, H), warmDeformationCtx = warmDeformation.getContext('2d');
    function compressedLayer(image, s, pivot) {
        const warm = image === warmRig || image === warmShip, target = warm ? warmDeformationCtx : ctx;
        if (warm) {
            target.resetTransform();
            target.clearRect(0, 0, W, H);
            target.setTransform(ctx.getTransform());
            target.globalCompositeOperation = 'source-over';
            target.globalAlpha = 1;
        }
        const columns = rich && Math.abs((s.leftCompression ?? s.compression) - (s.rightCompression ?? s.compression)) > .05 ? 10 : 1, rows = rich ? 120 : 200;
        for (let col = 0; col < columns; col++)
            for (let row = 0; row < rows; row++) {
                const u = (col + .5) / columns, v = row / rows, next = (row + 1) / rows, y = (v - 1) * s.height + heave(s, v, u) - pivot, bottom = (next - 1) * s.height + heave(s, next, u) - pivot;
                target.drawImage(image, box.x + col * box.w / columns, box.y + v * box.h, box.w / columns + 1, box.h / rows + 1, (col / columns - .5) * s.width, y, s.width / columns + s.width / box.w, bottom - y + s.height / box.h);
            }
        if (warm) {
            ctx.save();
            ctx.resetTransform();
            ctx.drawImage(warmDeformation, 0, 0);
            ctx.restore();
        }
    }
    function terrainLayer() {
        // Broken rock shelves blend into the painted shore instead of forming a platform.
        ctx.save();
        for (let i = 0; i < 110; i++) {
            const x = 410 + i * 7.1, y = groundAt(settings, x), height = 1 + (i * 13 % 7) * (settings.roughness ?? 0), width = 4 + (i * 11 % 8);
            const opacity = clamp(1 - Math.abs(x - LANDING_X) / 270, 0, 1);
            ctx.globalAlpha = opacity * .75;
            const shade = ctx.createLinearGradient(0, y - height, 0, y + 15);
            shade.addColorStop(0, i % 3 ? '#0b1016' : '#303b45');
            shade.addColorStop(1, '#11171c00');
            ctx.fillStyle = shade;
            ctx.beginPath();
            ctx.moveTo(x - width, y + 15);
            ctx.lineTo(x - width * .6, y + 1);
            ctx.lineTo(x - 1, y - height);
            ctx.lineTo(x + width, y + 3);
            ctx.lineTo(x + width, y + 15);
            ctx.fill();
        }
        ctx.restore();
    }
    const reactionCanvas = createCanvas(W, H), reactionCtx = reactionCanvas.getContext('2d');
    function waterReactions(s) {
        const r = reactionCtx;
        r.clearRect(0, 0, W, H);
        for (let frame = 108; frame <= s.frame; frame += 8) {
            const birth = recorded[frame], age = s.time - birth.time - .18;
            if (age < 0 || age > 3.4 || (birth.waterReaction ?? 0) < .05)
                continue;
            const radius = 12 + age * 65, strength = birth.waterReaction * (1 - age / 3.4);
            r.save();
            r.translate(clamp(birth.x - 180, 250, 650) - (s.windAx ?? 0) * age * 7, 424 + age * 3);
            r.scale(1, .19);
            r.strokeStyle = `rgba(161,190,209,${Math.min(.22, strength * .12)})`;
            r.lineWidth = 2;
            r.beginPath();
            r.ellipse(0, 0, radius, radius, 0, 0, Math.PI * 2);
            r.stroke();
            r.restore();
        }
        r.globalCompositeOperation = 'destination-in';
        r.drawImage(waterMask, 0, 0);
        r.globalCompositeOperation = 'source-over';
        ctx.drawImage(reactionCanvas, 0, 0);
    }
    const states = [];
    function heatHaze(s) {
        if (!engineDetail || s.frame < 108 || s.power < .1)
            return;
        for (let i = 4; i < 7; i++) {
            const p = nozzlePose(s, i), r = s.width * .047, h = Math.min(80, groundAt(settings, p.x) - p.y - 4);
            if (h < 4)
                continue;
            ctx.save();
            ctx.beginPath();
            ctx.rect(p.x - r, p.y, r * 2, h);
            ctx.clip();
            ctx.globalAlpha = Math.min(.32, s.power * .22);
            for (let row = 0; row < h; row += 7) {
                const x = clamp(p.x - r, 0, W - r * 2), y = clamp(p.y + row, 0, H - 8), drift = Math.sin(s.time * 38 + row * .44 + i) * 1.8 * Math.min(1.5, s.power);
                ctx.drawImage(plate, x / W * plate.width, y / H * plate.height, r * 2 / W * plate.width, 8 / H * plate.height, x + drift, y, r * 2, 8);
            }
            ctx.restore();
        }
    }
    function draw(frame) {
        const s = state(frame), t = s.time;
        states.push(s);
        ctx.clearRect(0, 0, W, H);
        ctx.save();
        const impactAge = t - CONTACT;
        if (impactAge > 0 && impactAge < .8)
            ctx.translate(0, controls.camera_contact_kick_pixels * Math.exp(-impactAge * 5) * Math.sin(impactAge * 22));
        ctx.filter = `brightness(${gain(settings.ambient, t)})`;
        ctx.drawImage(plate, 0, 0, W, H);
        ctx.filter = 'none';
        if (rich && t >= 0)
            terrainLayer();
        waterReflection(s);
        heatHaze(s);
        if (rich && t >= 0)
            waterReactions(s);
        windLayer(t, false);
        // Small painted water glints, rather than reconstructing a water surface.
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(0, 418);
        ctx.lineTo(340, 422);
        ctx.lineTo(860, 544);
        ctx.lineTo(0, 544);
        ctx.clip();
        ctx.strokeStyle = 'rgba(171,194,212,.13)';
        ctx.lineWidth = .8;
        for (const stroke of waterStrokes) {
            const dx = Math.sin(t * 1.8 + stroke.phase + (t < 0 ? 0 : weatherPhase(t) * .25)) * (2 + weatherAt(t).energy * 1.5);
            ctx.beginPath();
            ctx.moveTo(stroke.x + dx, stroke.y);
            ctx.lineTo(stroke.x + stroke.length + dx, stroke.y + .5);
            ctx.stroke();
        }
        ctx.restore();
        // A 2D ground shadow and painted light pools establish weight.
        ctx.save();
        ctx.translate(s.x, (s.groundY ?? 386) + 3);
        ctx.scale(s.width * .52, 17);
        const shade = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
        shade.addColorStop(0, `rgba(3,7,12,${.14 + .42 * (1 - s.altitude / 180)})`);
        shade.addColorStop(1, 'rgba(3,7,12,0)');
        ctx.fillStyle = shade;
        ctx.fillRect(-1, -1, 2, 2);
        ctx.restore();
        const groundPower = s.power * smooth((115 - s.altitude) / 100);
        for (const nozzle of nozzles) {
            const p = point(s, ...nozzle.anchor), hit = engineDetail && s.frame >= 108 ? exhaustGroundHit(nozzlePose(s, nozzles.indexOf(nozzle)), x => groundAt(settings, x)) : null;
            glow(hit?.x ?? p.x, hit ? hit.y - 3 : rich && t >= 0 ? groundAt(settings, p.x) - 3 : 383, 95 * nozzle.scale, 23, groundPower * nozzle.scale);
        }
        footContact(s, false);
        groundRolls(t, false);
        dustLayer(t, false);
        smokeLayer(t, false);
        for (let i = 0; i < (s.frame < 108 ? nozzles.length : 4); i++)
            paintedJet(s, i);
        if (s.frame >= 108)
            metalThrusters(s);
        smokeLayer(t, true);
        // Hull rotates about its mass center; contact heave shortens the leg region only.
        ctx.save();
        const pivot = -s.height * .46;
        ctx.translate(s.x, s.footY + pivot);
        ctx.rotate(s.angle);
        ctx.filter = `brightness(${gain(settings.ambient, t)})`;
        if (s.perspective)
            arrivalPlane(ship, s, pivot);
        else if (s.compression < .01)
            ctx.drawImage(s.frame < 108 ? ship : riggedHull, box.x, box.y, box.w, box.h, -s.width / 2, -s.height - pivot, s.width, s.height);
        else
            compressedLayer(s.frame < 108 ? ship : riggedHull, s, pivot);
        ctx.filter = 'none';
        const warmPower = s.power > .015 ? Math.min(.3, s.power * .24) : 0;
        if (warmPower > 0) {
            ctx.globalCompositeOperation = 'screen';
            ctx.globalAlpha = warmPower;
            if (s.perspective)
                arrivalPlane(warmShip, s, pivot);
            else if (s.compression < .01)
                ctx.drawImage(s.frame < 108 ? warmShip : warmRig, box.x, box.y, box.w, box.h, -s.width / 2, -s.height - pivot, s.width, s.height);
            else
                compressedLayer(s.frame < 108 ? warmShip : warmRig, s, pivot);
        }
        ctx.restore();
        if (s.frame >= 108)
            for (let i = 4; i < nozzles.length; i++)
                paintedJet(s, i);
        nozzleRims(s);
        groundRolls(t, true);
        dustLayer(t, true);
        footContact(s, true);
        // Exhaust-lit suspended grit glows inside the cloud, then cools with shutdown.
        if (groundPower > .01)
            for (let i = 0; i < nozzles.length; i++) {
                const nozzle = nozzles[i], p = point(s, ...nozzle.anchor);
                ctx.save();
                ctx.globalCompositeOperation = 'screen';
                ctx.globalAlpha = clamp(groundPower, 0, 1) * .75 * nozzle.scale;
                const stamp = cloudStamps[i % cloudStamps.length].warm;
                ctx.drawImage(stamp, p.x - 105 * nozzle.scale, 337, 210 * nozzle.scale, 76);
                ctx.restore();
            }
        windLayer(t, true);
        for (const c of chips) {
            const age = t - c.birth, flight = -2 * c.vy / 150;
            if (age < 0 || age > flight)
                continue;
            if (engineDetail && s.frame < 108)
                continue;
            const origin = atTime(c.birth), kick = rich ? Math.sqrt(impactGain) : 1;
            const x = (rich ? origin.x : LANDING_X) + Math.sin(c.phase) * 105 + c.vx * age * kick - (rich ? 45 * flowDelta(t, c.birth) : age * 24), y = (rich ? groundAt(settings, origin.x) - 3 : 383) + c.vy * age * kick + 75 * age * age;
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(c.phase + age * 8);
            ctx.globalAlpha = Math.min(1, .85 * (1 - smooth((age / flight - .68) / .32)) * gain(settings.dust, t));
            ctx.fillStyle = c.phase < 1.5 ? '#806550' : '#21272b';
            ctx.beginPath();
            ctx.moveTo(-c.size, 0);
            ctx.lineTo(-c.size * .2, -c.size * .7);
            ctx.lineTo(c.size * .8, -c.size * .25);
            ctx.lineTo(c.size * .4, c.size * .6);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }
        // Persistent moving ash crosses both the subject and landscape.
        for (const a of ash) {
            const x = ((a.x - weatherPhase(t) * a.speed) % (W + 100) + W + 100) % (W + 100) - 50, y = (a.y + t * 35) % (H + 40) - 20;
            ctx.strokeStyle = `rgba(153,164,173,${a.opacity})`;
            ctx.lineWidth = .65;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x - a.length, y + a.length * .25);
            ctx.stroke();
        }
        ctx.restore();
        if (false && engineDetail && frame >= 108) {
            ctx.save();
            ctx.fillStyle = '#101a23df';
            ctx.fillRect(24, 22, 470, savedPerformance.flightResult?.status === 'failed' ? 58 : 34);
            ctx.font = '12px Segoe UI';
            ctx.fillStyle = '#d5e0e7';
            ctx.fillText(`${(s.enginePhase ?? (savedPerformance.departure && frame >= savedPerformance.departure.sourceFrames ? s.phase : 'landing burn')).toUpperCase()} · ${s.power.toFixed(2)} × WEIGHT`, 36, 44);
            if (savedPerformance.flightResult?.status === 'failed') {
                ctx.fillStyle = '#e7af95';
                ctx.fillText(`${savedPerformance.flightResult.reason.toUpperCase()} · CAPTURE ENDS AT ${((FILM_COUNT - 1) / 24).toFixed(2)}s`, 36, 65);
            }
            ctx.restore();
        }
    }
    return { canvas, draw(frame) { draw(Math.max(0, Math.min(recorded.length - 1, Math.floor(frame)))); return canvas; } };
}
