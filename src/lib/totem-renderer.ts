export type TotemShape = { paths: Path2D[]; viewBox: number[] };
export type TotemSettings = { seed: number; density: number; scale: number; palette: number; rotation: number; speed: number; trails: number };
export const TOTEM_DEFAULTS: TotemSettings = { seed: 1313, density: 750, scale: 1, palette: 0, rotation: 0.7, speed: 0.3, trails: 3 };
export const TOTEM_PALETTES = [
  { name: "Pastel", colors: ["#fdd9f0", "#fcc5eb", "#fab09a", "#fcf87a", "#b6faff"], background: "#fde8f3" },
  { name: "Pink", colors: ["#FCC5EB", "#FCCDED", "#FDD4EF", "#FDD9F0", "#FDE0F3", "#FEE7F4"], background: "#f324b3" },
  { name: "Monochrome", colors: ["#222222", "#444444", "#666666", "#888888", "#aaaaaa"], background: "#101010" },
  { name: "Oscillating", colors: ["#9C2C50", "#F59640", "#FBD260", "#62E0DD", "#46CDEE"], background: "#262626" },
] as const;

export function settingsFromSearch(search: string): TotemSettings {
  const params = new URLSearchParams(search);
  const settings = { ...TOTEM_DEFAULTS };
  const ranges: Record<keyof TotemSettings, [number, number]> = {
    seed: [0, 2147483647], density: [25, 2000], scale: [0.3, 2], palette: [0, 3], rotation: [0, 2], speed: [0, 2], trails: [0, 40],
  };
  for (const key of Object.keys(ranges) as (keyof TotemSettings)[]) {
    const raw = params.get(key);
    if (raw === null || raw.trim() === "") continue;
    const value = Number(raw);
    if (Number.isFinite(value)) settings[key] = Math.max(ranges[key][0], Math.min(ranges[key][1], value));
  }
  settings.seed = Math.floor(settings.seed);
  settings.density = Math.floor(settings.density);
  settings.palette = Math.floor(settings.palette);
  return settings;
}

// Deliberately separate from Java's RNG: reproducible browser compositions, not pixel parity claims.
export function seededRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let value = Math.imul(state ^ (state >>> 15), state | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

export async function loadTotemShapes(urls: string[], signal: AbortSignal): Promise<TotemShape[]> {
  return Promise.all(urls.map(async (url) => {
    const response = await fetch(url, { signal });
    if (!response.ok) throw new Error("An illustration could not be loaded.");
    const document = new DOMParser().parseFromString(await response.text(), "image/svg+xml");
    if (document.querySelector("parsererror")) throw new Error("An illustration could not be read.");
    if (document.querySelector("[transform], use, rect, line, clipPath, mask, filter")) throw new Error("This illustration needs additional browser rendering support.");
    const viewBox = document.documentElement.getAttribute("viewBox")?.trim().split(/[\s,]+/).map(Number);
    if (!viewBox || viewBox.length !== 4 || !viewBox.every(Number.isFinite) || viewBox[2] <= 0 || viewBox[3] <= 0) throw new Error("Invalid illustration dimensions.");
    const paths = [...document.querySelectorAll("path, polygon, polyline, ellipse, circle")].map((element) => {
      if (element.tagName === "path") return new Path2D(element.getAttribute("d") ?? "");
      if (element.tagName === "ellipse" || element.tagName === "circle") {
        const cx = Number(element.getAttribute("cx") ?? 0);
        const cy = Number(element.getAttribute("cy") ?? 0);
        const rx = Number(element.getAttribute(element.tagName === "circle" ? "r" : "rx"));
        const ry = element.tagName === "circle" ? rx : Number(element.getAttribute("ry"));
        if (![cx, cy, rx, ry].every(Number.isFinite) || rx < 0 || ry < 0) throw new Error("Invalid illustration ellipse.");
        const path = new Path2D();
        if (rx === 0 || ry === 0) return path;
        path.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
        return path;
      }
      const points = (element.getAttribute("points") ?? "").trim().split(/[\s,]+/).map(Number);
      if (points.length < 4 || points.length % 2 || !points.every(Number.isFinite)) throw new Error("Invalid illustration outline.");
      const path = new Path2D();
      path.moveTo(points[0], points[1]);
      for (let index = 2; index < points.length; index += 2) path.lineTo(points[index], points[index + 1]);
      if (element.tagName === "polygon") path.closePath();
      return path;
    });
    if (!paths.length) throw new Error("The illustration has no drawable paths.");
    return { paths, viewBox };
  }));
}

function paintShape(context: CanvasRenderingContext2D, shape: TotemShape, size: number, x: number, y: number, angle: number, colors: readonly string[], colorValues: number[], stroke: string) {
  const [left, top, width, height] = shape.viewBox;
  context.save();
  context.translate(x, y);
  context.rotate(angle * Math.PI / 180);
  context.scale(size / width, size / height);
  context.translate(-left - width / 2, -top - height / 2);
  context.lineJoin = "round";
  context.lineCap = "round";
  context.lineWidth = 0.5 * width / Math.max(1, size);
  context.strokeStyle = stroke;
  shape.paths.forEach((path, index) => {
    context.fillStyle = colors[Math.floor(colorValues[index] * colors.length)];
    context.fill(path);
    context.stroke(path);
  });
  context.restore();
}

export function renderTotemPrint(canvas: HTMLCanvasElement, shapes: TotemShape[], settings: TotemSettings, onProgress: (drawn: number) => void): () => void {
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas rendering is unavailable.");
  const palette = TOTEM_PALETTES[settings.palette];
  context.setTransform(canvas.width / 3000, 0, 0, canvas.height / 3000, 0, 0);
  context.fillStyle = palette.background;
  context.fillRect(0, 0, 3000, 3000);
  const random = seededRandom(settings.seed);
  let drawn = 0;
  let frame = 0;
  function batch() {
    if (!context) return;
    const end = Math.min(drawn + 64, settings.density);
    while (drawn < end) {
      const shape = shapes[Math.floor(random() * shapes.length)];
      const size = (400 + random() * 600) * settings.scale;
      const angle = random() * 360;
      const x = random() * 3000;
      const y = random() * 3000;
      const colors = shape.paths.map(() => random());
      paintShape(context, shape, size, x, y, angle, palette.colors, colors, "#f324b3");
      drawn++;
    }
    onProgress(drawn);
    if (drawn < settings.density) frame = requestAnimationFrame(batch);
  }
  frame = requestAnimationFrame(batch);
  return () => cancelAnimationFrame(frame);
}

export function createTotemMotion(canvas: HTMLCanvasElement, shapes: TotemShape[], settings: TotemSettings) {
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas rendering is unavailable.");
  const palette = TOTEM_PALETTES[settings.palette === 0 ? 3 : settings.palette === 3 ? 0 : settings.palette];
  const random = seededRandom(settings.seed);
  const instances = shapes.map((shape, index) => {
    random(); // Keep the original study's initial rotation draw in the sequence.
    return { shape, index, size: 50 + Math.floor(random() * 4) * 50, colors: shape.paths.map(() => random()) };
  });
  context.setTransform(canvas.width / 900, 0, 0, canvas.height / 900, 0, 0);
  context.fillStyle = palette.background;
  context.fillRect(0, 0, 900, 900);
  let step = 0;
  function paint(delta: number) {
    if (!context) return;
    step += delta;
    if (delta > 0 && settings.trails > 0) {
      context.save();
      context.globalAlpha = 1 - Math.pow(1 - settings.trails / 255, delta);
      context.fillStyle = palette.background;
      context.fillRect(0, 0, 900, 900);
      context.restore();
    }
    for (const instance of instances) {
      const rotation = (Math.sin((instance.index + step * settings.rotation) * 2 * Math.PI / 180) + 1) * 180;
      const scale = 0.5 + (Math.sin((instance.index + step * settings.speed) * 5 * Math.PI / 180) + 1) * 3.75;
      paintShape(context, instance.shape, instance.size * scale * settings.scale, 450, 450, rotation, palette.colors, instance.colors, "#262626");
    }
  }
  paint(0);
  return { paint };
}
