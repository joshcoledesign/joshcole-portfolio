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

const GAMMA = 0.55; // compression exponent
const FLOOR = 0.02; // min canvas share per piece

// Weight shaping: compress, then lift small pieces to the floor,
// redistributing the deficit proportionally (8 passes max).
function shaped<T extends { blocks: number }>(list: T[]): { piece: T; w: number }[] {
  const w = list.map((it) => Math.pow(it.blocks, GAMMA));
  for (let p = 0; p < 8; p++) {
    const tot = w.reduce((a, b) => a + b, 0);
    let def = 0;
    const free: number[] = [];
    w.forEach((v, k) => {
      if (v / tot < FLOOR) {
        def += FLOOR * tot - v;
        w[k] = FLOOR * tot;
      } else {
        free.push(k);
      }
    });
    if (def <= 0.0001) break;
    const fs = free.reduce((a, k) => a + w[k], 0);
    if (fs <= def) break;
    free.forEach((k) => {
      w[k] -= def * (w[k] / fs);
    });
  }
  return list.map((it, k) => ({ piece: it, w: w[k] }));
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
export function layout<T extends { blocks: number }>(
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
