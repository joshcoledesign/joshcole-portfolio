// Pure squarified-treemap layout, ported from
// docs/work-surface-reference.html (shaped / worst / placeRow /
// squarifyInto / layout). No DOM, no fs — safe on the client.
//
// The math is the part prose gets subtly wrong, so this is a faithful
// port of the prototype rather than a reimplementation.

export interface Placed<T> {
  piece: T;
  x: number;
  y: number;
  w: number;
  h: number;
  pin?: boolean;
}

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

// Editorial weights drive the map directly. Clamp the smallest value to a
// quarter of the largest so every tile remains visually useful even if future
// authored values expand beyond the current 1–3 scale.
function shaped<T extends { weight: number }>(list: T[]): { piece: T; w: number }[] {
  const largest = Math.max(...list.map((item) => item.weight), 1);
  const minimum = largest / 4;
  return list.map((piece) => ({ piece, w: Math.max(piece.weight, minimum) }));
}

// Ordered horizontal-band packing for the home map. Dynamic programming
// chooses 1–4 consecutive pieces per band, minimizing distance from the
// requested landscape aspect while preserving editorial order.
export function layoutBands<T extends { weight: number; shape?: "landscape" | "portrait" | "square" }>(
  list: T[],
  W: number,
  H: number,
  featured: T[],
  targetAspect = 1.4,
  maxPerBand = 4,
): Placed<T>[] {
  if (!list.length) return [];

  const weighted = shaped(list);
  const hasFeaturedCluster =
    featured.length >= 3 &&
    weighted[0]?.piece === featured[0] &&
    weighted[1]?.piece === featured[1] &&
    weighted[2]?.piece === featured[2];
  const effectiveWeights = weighted.map((item, index) =>
    hasFeaturedCluster && index === 0 ? item.w * 1.5 : item.w,
  );
  const totalWeight = effectiveWeights.reduce((sum, weight) => sum + weight, 0);
  const scale = (W * H) / totalWeight;
  const areas = effectiveWeights.map((weight) => weight * scale);
  const costs = Array<number>(list.length + 1).fill(Infinity);
  const counts = Array<number>(list.length).fill(1);
  const firstBandIndex = hasFeaturedCluster ? 3 : 0;
  costs[list.length] = 0;

  const aspectTarget = (piece: T) => {
    if (piece.shape === "portrait") return 1 / targetAspect;
    if (piece.shape === "square") return 1;
    return targetAspect;
  };

  for (let start = list.length - 1; start >= firstBandIndex; start--) {
    let bandArea = 0;
    for (let count = 1; count <= maxPerBand && start + count <= list.length; count++) {
      bandArea += areas[start + count - 1];
      const bandHeight = bandArea / W;
      const widthFactors = weighted
        .slice(start, start + count)
        .map((item) => aspectTarget(item.piece) * Math.sqrt(item.w));
      const factorTotal = widthFactors.reduce((sum, factor) => sum + factor, 0);
      let aspectCost = 0;
      for (let offset = 0; offset < count; offset++) {
        const index = start + offset;
        const tileWidth = (widthFactors[offset] / factorTotal) * W;
        const aspect = tileWidth / bandHeight;
        const distance = Math.log(aspect / aspectTarget(weighted[index].piece));
        aspectCost += distance * distance;
      }
      const cost = aspectCost / count + costs[start + count];
      if (cost < costs[start]) {
        costs[start] = cost;
        counts[start] = count;
      }
    }
  }

  const featuredSet = new Set(featured);
  const out: Placed<T>[] = [];
  let y = 0;
  if (hasFeaturedCluster) {
    const clusterArea = areas[0] + areas[1] + areas[2];
    const clusterHeight = clusterArea / W;
    const leadWidth = areas[0] / clusterHeight;
    const stackWidth = W - leadWidth;
    const secondHeight = areas[1] / stackWidth;
    out.push(
      { piece: weighted[0].piece, x: 0, y: 0, w: leadWidth, h: clusterHeight, pin: true },
      { piece: weighted[1].piece, x: leadWidth, y: 0, w: stackWidth, h: secondHeight, pin: true },
      {
        piece: weighted[2].piece,
        x: leadWidth,
        y: secondHeight,
        w: stackWidth,
        h: clusterHeight - secondHeight,
        pin: true,
      },
    );
    y = clusterHeight;
  }

  let start = firstBandIndex;
  while (start < list.length) {
    const count = counts[start];
    const bandArea = areas.slice(start, start + count).reduce((sum, area) => sum + area, 0);
    const bandHeight = bandArea / W;
    const widthFactors = weighted
      .slice(start, start + count)
      .map((item) => aspectTarget(item.piece) * Math.sqrt(item.w));
    const factorTotal = widthFactors.reduce((sum, factor) => sum + factor, 0);
    let x = 0;
    for (let offset = 0; offset < count; offset++) {
      const index = start + offset;
      const tileWidth = (widthFactors[offset] / factorTotal) * W;
      out.push({
        piece: weighted[index].piece,
        x,
        y,
        w: tileWidth,
        h: bandHeight,
        pin: featuredSet.has(weighted[index].piece) || undefined,
      });
      x += tileWidth;
    }
    y += bandHeight;
    start += count;
  }

  return out;
}

interface Area<T> {
  piece: T;
  area: number;
}

function sumA<T>(r: Area<T>[]) {
  return r.reduce((a, b) => a + b.area, 0);
}

function worst<T>(row: Area<T>[], len: number) {
  if (!row.length) return Infinity;
  const s = sumA(row);
  let mx = 0;
  let mn = Infinity;
  row.forEach((n) => {
    mx = Math.max(mx, n.area);
    mn = Math.min(mn, n.area);
  });
  return Math.max((len * len * mx) / (s * s), (s * s) / (len * len * mn));
}

function placeRow<T>(row: Area<T>[], r: Rect, out: Placed<T>[]): Rect {
  const s = sumA(row);
  if (r.w >= r.h) {
    const rw = s / r.h;
    let y = r.y;
    row.forEach((n) => {
      const hh = n.area / rw;
      out.push({ piece: n.piece, x: r.x, y, w: rw, h: hh });
      y += hh;
    });
    return { x: r.x + rw, y: r.y, w: r.w - rw, h: r.h };
  }
  const rh = s / r.w;
  let x = r.x;
  row.forEach((n) => {
    const ww = n.area / rh;
    out.push({ piece: n.piece, x, y: r.y, w: ww, h: rh });
    x += ww;
  });
  return { x: r.x, y: r.y + rh, w: r.w, h: r.h - rh };
}

function squarifyInto<T>(weighted: { piece: T; w: number }[], rect: Rect, out: Placed<T>[]) {
  if (!weighted.length || rect.w <= 0 || rect.h <= 0) return;
  const total = weighted.reduce((a, b) => a + b.w, 0);
  const A = rect.w * rect.h;
  const items: Area<T>[] = weighted
    .slice()
    .sort((a, b) => b.w - a.w)
    .map((n) => ({ piece: n.piece, area: (n.w / total) * A }));
  let r: Rect = { ...rect };
  let row: Area<T>[] = [];
  while (items.length) {
    const len = Math.min(r.w, r.h);
    const nx = items[0];
    if (!row.length || worst([...row, nx], len) <= worst(row, len)) {
      row.push(items.shift()!);
    } else {
      r = placeRow(row, r, out);
      row = [];
    }
  }
  if (row.length) placeRow(row, r, out);
}

// Lays `list` into a W×H rectangle. When `feats` is non-empty, three
// pieces pin into the top-left featured region and the rest squarify
// into the leftover right block + bottom band.
export function layout<T extends { weight: number }>(
  list: T[],
  W: number,
  H: number,
  feats: T[],
): Placed<T>[] {
  const out: Placed<T>[] = [];
  const weighted = shaped(list);

  if (!feats.length) {
    squarifyInto(weighted, { x: 0, y: 0, w: W, h: H }, out);
    return out;
  }

  const fw = W * 0.56;
  const fh = H * 0.58;
  out.push({ piece: feats[0], x: 0, y: 0, w: fw * 0.6, h: fh, pin: true });
  if (feats[1]) out.push({ piece: feats[1], x: fw * 0.6, y: 0, w: fw * 0.4, h: fh * 0.52, pin: true });
  if (feats[2]) out.push({ piece: feats[2], x: fw * 0.6, y: fh * 0.52, w: fw * 0.4, h: fh * 0.48, pin: true });

  const featSet = new Set(feats);
  const rest = weighted.filter((n) => !featSet.has(n.piece));
  if (!rest.length) return out;

  const right: Rect = { x: fw, y: 0, w: W - fw, h: fh };
  const bottom: Rect = { x: 0, y: fh, w: W, h: H - fh };
  const aR = right.w * right.h;
  const aB = bottom.w * bottom.h;
  const share = aR / (aR + aB);

  const sorted = rest.slice().sort((a, b) => b.w - a.w);
  const total = sorted.reduce((a, b) => a + b.w, 0);
  const gR: typeof sorted = [];
  const gB: typeof sorted = [];
  let acc = 0;
  sorted.forEach((n) => {
    if (acc / total < share - 0.0001 && gR.length < sorted.length - 1) {
      gR.push(n);
      acc += n.w;
    } else {
      gB.push(n);
    }
  });

  squarifyInto(gR, right, out);
  squarifyInto(gB, bottom, out);
  return out;
}
