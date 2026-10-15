import * as THREE from "three";
import { MarchingCubes } from "three/examples/jsm/objects/MarchingCubes.js";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";

const TOP = 0.08;
const ROOTS = [
  { side: -1, length: 0.84, depth: -0.012 },
  { side: 1, length: 0.88, depth: 0.018 },
];

const clamp = THREE.MathUtils.clamp;
const smooth = THREE.MathUtils.smootherstep;

function hash(x, y, z) {
  let value = Math.imul(x, 374761393) + Math.imul(y, 668265263) + Math.imul(z, 2147483647);
  value = Math.imul(value ^ value >>> 13, 1274126177);
  return ((value ^ value >>> 16) >>> 0) / 4294967295;
}

function noise(x, y, z) {
  const ix = Math.floor(x), iy = Math.floor(y), iz = Math.floor(z);
  const u = smooth(x - ix, 0, 1), v = smooth(y - iy, 0, 1), w = smooth(z - iz, 0, 1);
  const mix = THREE.MathUtils.lerp;
  return mix(
    mix(mix(hash(ix, iy, iz), hash(ix + 1, iy, iz), u), mix(hash(ix, iy + 1, iz), hash(ix + 1, iy + 1, iz), u), v),
    mix(mix(hash(ix, iy, iz + 1), hash(ix + 1, iy, iz + 1), u), mix(hash(ix, iy + 1, iz + 1), hash(ix + 1, iy + 1, iz + 1), u), v),
    w,
  );
}

function microfinish(x, y, z) {
  const grain = noise(x * 36 + 5.7, y * 36 - 8.1, z * 36 + 2.3) - 0.5;
  const fibres = noise(x * 56 - 2.4, y * 7 + 4.9, z * 56 - 0.7) - 0.5;
  return { grain, fibres };
}

/** A continuous elliptic section along a root, with an ellipsoidal rounded tip. */
function rootField(x, y, z, root) {
  const t = clamp((TOP - y) / root.length, 0, 1.5);
  const curveT = Math.min(1, t);
  const sin = Math.sin(Math.PI * curveT);
  // The mesial blade leans outward steadily; the broader distal blade has one gentle bow.
  const centerX = root.side < 0
    ? -0.05 - 0.2 * curveT ** 1.35
    : 0.05 + 0.105 * Math.sin(Math.PI * 0.72 * curveT) - 0.01 * curveT * curveT;
  const centerZ = root.depth * curveT;
  // One analytic envelope, rather than repeated samples/rings, keeps the specular silhouette smooth.
  const rx = root.side < 0
    ? 0.147 * (1 - 0.28 * curveT) - 0.028 * sin * sin
    : 0.147 * (1 - 0.2 * curveT) - 0.02 * sin * sin;
  // Flattened, buccolingually broad sections match the blades seen in the video side view.
  const rz = root.side < 0
    ? 0.177 * (1 - 0.12 * curveT) - 0.005 * sin * sin
    : 0.177 * (1 - 0.09 * curveT) - 0.005 * sin * sin;
  // This ellipsoidal term tapers continuously all the way to a rounded, finite-curvature tip.
  const q = Math.sqrt(((x - centerX) / rx) ** 2 + ((z - centerZ) / rz) ** 2 + t ** 1.05);
  return (q - 1) * Math.min(rx, rz);
}

function smoothUnion(a, b, blend) {
  const h = Math.max(blend - Math.abs(a - b), 0) / blend;
  return Math.min(a, b) - h * h * blend * 0.25;
}

function field(x, y, z) {
  // Contract the embedded trunk into the ovoid cervical footprint from every viewing angle.
  const neckScale = 1 - 0.18 * smooth(y, -0.08, TOP);
  const roots = smoothUnion(rootField(x / neckScale, y, z / neckScale, ROOTS[0]), rootField(x / neckScale, y, z / neckScale, ROOTS[1]), 0.035) * neckScale;
  const { grain, fibres } = microfinish(x, y, z);
  const texture = (grain * 0.00012 + fibres * 0.00008) * smooth(TOP - y, 0, 0.12);
  // The flat closure is entirely inside the crown; there is no added collar, disk or trunk sphere.
  return Math.max(roots + texture, y - TOP);
}

/**
 * Original smooth two-root molar: crown is +Y, roots are -Y; embed the top at Y +0.08.
 * Returns indexed THREE.BufferGeometry with analytic gradient normals and linear RGB vertex colors.
 * Visible roots span Y 0 to -0.76 / -0.80, calibrated against the supplied rotating molar video.
 */
export function makeNaturalRoots({ resolution = 120 } = {}) {
  const size = clamp(Math.round(resolution), 64, 160);
  const limits = { min: new THREE.Vector3(-0.35, -0.85, -0.25), max: new THREE.Vector3(0.35, 0.13, 0.25) };
  const span = limits.max.clone().sub(limits.min);
  const middle = limits.min.clone().add(limits.max).multiplyScalar(0.5);
  const material = new THREE.MeshStandardMaterial();
  const maxPolygons = Math.ceil(90000 * (size / 120) ** 2 * 1.12);
  const marching = new MarchingCubes(size, material, false, false, maxPolygons);
  marching.isolation = 0;
  for (let iz = 0; iz < size; iz++) {
    const z = limits.min.z + iz / size * span.z;
    for (let iy = 0; iy < size; iy++) {
      const y = limits.min.y + iy / size * span.y;
      for (let ix = 0; ix < size; ix++) {
        const x = limits.min.x + ix / size * span.x;
        marching.field[ix + iy * size + iz * size * size] = -field(x, y, z);
      }
    }
  }
  marching.update();
  if (!marching.count || marching.count >= maxPolygons * 3) throw new Error("The root surface could not be generated completely.");

  const positions = new Float32Array(marching.count * 3);
  const normals = new Float32Array(marching.count * 3);
  const colors = new Float32Array(marching.count * 3);
  const source = marching.geometry.getAttribute("position");
  const point = new THREE.Vector3();
  const normal = new THREE.Vector3();
  const neck = new THREE.Color().setRGB(0.84, 0.79, 0.68);
  const tip = new THREE.Color().setRGB(0.75, 0.685, 0.55);
  const epsilon = 0.00025;
  for (let index = 0; index < marching.count; index++) {
    point.fromBufferAttribute(source, index).multiply(span).multiplyScalar(0.5).add(middle);
    point.toArray(positions, index * 3);
    normal.set(
      field(point.x + epsilon, point.y, point.z) - field(point.x - epsilon, point.y, point.z),
      field(point.x, point.y + epsilon, point.z) - field(point.x, point.y - epsilon, point.z),
      field(point.x, point.y, point.z + epsilon) - field(point.x, point.y, point.z - epsilon),
    ).normalize().toArray(normals, index * 3);
    const tone = smooth((TOP - point.y) / 0.88, 0.1, 1);
    const { grain, fibres } = microfinish(point.x, point.y, point.z);
    neck.clone().lerp(tip, tone).multiplyScalar(1 + grain * 0.014 + fibres * 0.008).toArray(colors, index * 3);
  }
  const surface = new THREE.BufferGeometry();
  surface.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  surface.setAttribute("normal", new THREE.BufferAttribute(normals, 3));
  surface.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  const welded = mergeVertices(surface, 0.00000001);
  if (welded !== surface) surface.dispose();
  const cleanIndices = [];
  const faces = new Set();
  const weldedPositions = welded.getAttribute("position");
  const weldedNormals = welded.getAttribute("normal");
  const aPoint = new THREE.Vector3(), bPoint = new THREE.Vector3(), cPoint = new THREE.Vector3(), faceNormal = new THREE.Vector3();
  for (let index = 0; index < welded.index.count; index += 3) {
    const a = welded.index.getX(index), b = welded.index.getX(index + 1), c = welded.index.getX(index + 2);
    if (a === b || b === c || c === a) continue;
    aPoint.fromBufferAttribute(weldedPositions, a); bPoint.fromBufferAttribute(weldedPositions, b); cPoint.fromBufferAttribute(weldedPositions, c);
    faceNormal.copy(bPoint).sub(aPoint).cross(cPoint.sub(aPoint));
    if (faceNormal.lengthSq() === 0) continue;
    const key = [a, b, c].sort((first, second) => first - second).join(":");
    if (faces.has(key)) continue;
    faces.add(key);
    normal.fromBufferAttribute(weldedNormals, a);
    if (faceNormal.dot(normal) < 0) cleanIndices.push(a, c, b);
    else cleanIndices.push(a, b, c);
  }
  welded.setIndex(cleanIndices);
  const geometry = welded;
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  geometry.userData = { originalGeometry: true, rootCount: 2, topY: TOP, rootLengths: ROOTS.map(({ length }) => length), visibleTipY: ROOTS.map(({ length }) => TOP - length), microfinish: "Baked normal grain and longitudinal striation; linear RGB cream dentin", authoring: "Video-calibrated asymmetric flattened root blades" };
  marching.geometry.dispose();
  material.dispose();
  return geometry;
}
