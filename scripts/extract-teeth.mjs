// Ekstraktor: mouth.stl (CC BY 4.0, Mince — via Wikimedia Commons) → teeth-real.glb
// 27 gigi anatomis terpisah dipetakan ke arch/tipe/sisi; geraham atas yang hilang
// di sumber dibuat dengan mirroring. Output: GLB 28 node bernama
// tooth_<U|L>_<I1|I2|C|PM1|PM2|M1|M2>_<L|R> dalam unit mentah model (app yang scale).
// Jalankan: node scripts/extract-teeth.mjs [src.stl] [out.glb]
import { readFileSync } from "node:fs";
import { Document, NodeIO } from "@gltf-transform/core";

const SRC = process.argv[2] ?? "/tmp/mouth.stl";
const OUT = process.argv[3] ?? "public/models/teeth-real.glb";

// — 1. Parse binary STL —
const buf = readFileSync(SRC);
const triCount = buf.readUInt32LE(80);
let off = 84;
const key = (x, y, z) => `${x.toFixed(4)},${y.toFixed(4)},${z.toFixed(4)}`;
const weld = new Map();
const vPos = [];
const vidOf = (p) => {
  const k = key(p[0], p[1], p[2]);
  let id = weld.get(k);
  if (id === undefined) {
    id = weld.size;
    weld.set(k, id);
    vPos[id] = p;
  }
  return id;
};
const triVids = new Array(triCount);
for (let t = 0; t < triCount; t++) {
  const a = vidOf(readV(off + 12));
  const b = vidOf(readV(off + 24));
  const c = vidOf(readV(off + 36));
  triVids[t] = [a, b, c];
  off += 50;
}
function readV(base) {
  return [buf.readFloatLE(base), buf.readFloatLE(base + 4), buf.readFloatLE(base + 8)];
}

// — 2. Connected components —
const parent = new Uint32Array(weld.size);
for (let i = 0; i < parent.length; i++) parent[i] = i;
const find = (a) => {
  while (parent[a] !== a) {
    parent[a] = parent[parent[a]];
    a = parent[a];
  }
  return a;
};
const compTris = new Map();
for (const [a, b, c] of triVids) {
  const ra = find(a);
  const rb = find(b);
  if (ra !== rb) parent[rb] = ra;
  const rc = find(c);
  if (ra !== rc) parent[rc] = ra;
}
for (const [a, b, c] of triVids) {
  const root = find(a);
  let arr = compTris.get(root);
  if (!arr) compTris.set(root, (arr = []));
  arr.push([a, b, c]);
}

// — 3. Saring: gigi = komponen ukuran wajar (blob lidah/gusi dibuang) —
const mirror = (p) => [-p[0], p[1], p[2]];
const comps = [...compTris.values()]
  .map((tris) => {
    const min = [1e9, 1e9, 1e9];
    const max = [-1e9, -1e9, -1e9];
    for (const [a, b, c] of tris) {
      for (const vid of [a, b, c]) {
        const p = vPos[vid];
        for (let d = 0; d < 3; d++) {
          if (p[d] < min[d]) min[d] = p[d];
          if (p[d] > max[d]) max[d] = p[d];
        }
      }
    }
    return { tris, min, max };
  })
  .filter((s) => s.tris.length > 400 && s.tris.length < 5000);

// — 4. Orientasi kanonik: atas (z<0) apa adanya; bawah (z>0) dirotasi Rx(+90°)
// agar lengkung bawah ikut bidang XZ dengan gigi depan mengarah -z. —
for (const comp of comps) {
  const cz = (comp.min[2] + comp.max[2]) / 2;
  comp.arch = cz < 0 ? "U" : "L";
  comp.tris = comp.tris.map(([a, b, c]) =>
    comp.arch === "L" ? [rotLower(vPos[a]), rotLower(vPos[b]), rotLower(vPos[c])] : [vPos[a], vPos[b], vPos[c]],
  );
  if (comp.arch === "L") {
    const [min, max] = [comp.min, comp.max];
    comp.min = [min[0], -max[2], min[1]];
    comp.max = [max[0], -min[2], max[1]];
  }
}
function rotLower(p) {
  return [p[0], -p[2], p[1]];
}

// — 5. Rank per arch: jarak pusat gigi dari titik depan lengkung (midline, z terdepan);
// pasangkan R/L dua-pointer; gigi tanpa pasangan → mirror. —
const TYPES = ["I1", "I2", "C", "PM1", "PM2", "M1", "M2"];
for (const arch of ["U", "L"]) {
  const group = comps.filter((s) => s.arch === arch);
  const fz = Math.min(...group.map((s) => (s.min[2] + s.max[2]) / 2));
  for (const s of group) {
    s.dist = Math.hypot((s.min[0] + s.max[0]) / 2, (s.min[2] + s.max[2]) / 2 - fz);
    s.side = (s.min[0] + s.max[0]) / 2 >= 0 ? "R" : "L";
  }
  const R = group.filter((s) => s.side === "R").sort((a, b) => a.dist - b.dist);
  const L = group.filter((s) => s.side === "L").sort((a, b) => a.dist - b.dist);
  const pairs = [];
  let i = 0;
  let j = 0;
  while (i < R.length && j < L.length) {
    const d = Math.abs(R[i].dist - L[j].dist);
    const nextR = Math.abs((R[i + 1]?.dist ?? 1e9) - L[j].dist);
    const nextL = Math.abs(R[i].dist - (L[j + 1]?.dist ?? 1e9));
    if (d <= nextR && d <= nextL) pairs.push([R[i++], L[j++]]);
    else if (nextR < nextL) pairs.push([R[i++], null]);
    else pairs.push([null, L[j++]]);
  }
  while (i < R.length) pairs.push([R[i++], null]);
  while (j < L.length) pairs.push([null, L[j++]]);
  if (pairs.length !== TYPES.length) {
    throw new Error(`arch ${arch}: ${pairs.length} pasangan, harusnya ${TYPES.length}`);
  }
  pairs.forEach((pair, rank) => {
    const type = TYPES[rank];
    for (const [k, s] of pair.entries()) {
      if (!s) continue;
      s.name = `tooth_${arch}_${type}_${k === 0 ? "R" : "L"}`;
    }
    if (!pair[0] || !pair[1]) {
      const src = pair[0] ?? pair[1];
      const mirrorSide = src.side === "R" ? "L" : "R";
      comps.push({
        tris: src.tris.map(([a, b, c]) => [mirror(a), mirror(c), mirror(b)]),
        min: [-src.max[0], src.min[1], src.min[2]],
        max: [-src.min[0], src.max[1], src.max[2]],
        arch,
        name: `tooth_${arch}_${type}_${mirrorSide}`,
      });
      console.log(`mirror: ${src.name} → tooth_${arch}_${type}_${mirrorSide}`);
    }
  });
}

// — 5b. Turunkan lengkung bawah agar gigi atas & bawah tidak saling menembus —
{
  const uppers = comps.filter((s) => s.arch === "U");
  const lowers = comps.filter((s) => s.arch === "L");
  const upperMinY = Math.min(...uppers.map((s) => s.min[1]));
  const lowerMaxY = Math.max(...lowers.map((s) => s.max[1]));
  const dy = upperMinY - 0.002 - lowerMaxY;
  for (const s of lowers) {
    s.tris = s.tris.map(([a, b, c]) => [
      [a[0], a[1] + dy, a[2]],
      [b[0], b[1] + dy, b[2]],
      [c[0], c[1] + dy, c[2]],
    ]);
    s.min[1] += dy;
    s.max[1] += dy;
  }
  console.log(`lengkung bawah digeser y=${dy.toFixed(4)}`);
}

// — 6. Tulis GLB (posisi absolut, tanpa indeks; app yang normalisasi & smooth) —
const doc = new Document();
const buffer = doc.createBuffer();
const scene = doc.createScene("Teeth");
let written = 0;
for (const comp of comps) {
  if (!comp.name) continue;
  const flat = [];
  const min = [1e9, 1e9, 1e9];
  const max = [-1e9, -1e9, -1e9];
  for (const tri of comp.tris) {
    for (const p of tri) {
      flat.push(p[0], p[1], p[2]);
      for (let d = 0; d < 3; d++) {
        if (p[d] < min[d]) min[d] = p[d];
        if (p[d] > max[d]) max[d] = p[d];
      }
    }
  }
  const accessor = doc
    .createAccessor(`pos_${written}`)
    .setType("VEC3")
    .setArray(new Float32Array(flat))
    .setBuffer(buffer);
  const prim = doc.createPrimitive().setAttribute("POSITION", accessor);
  const mesh = doc.createMesh(`mesh_${written}`).addPrimitive(prim);
  scene.addChild(doc.createNode(comp.name).setMesh(mesh));
  written++;
}
await new NodeIO().write(OUT, doc);
console.log(`OK: ${written} gigi ditulis ke ${OUT}`);
