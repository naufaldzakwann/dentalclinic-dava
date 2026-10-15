// Original dental illustration. No scanned, downloaded, or third-party geometry.
// Reproduce with: node scripts/generate-dental-model.mjs [output.glb]
// +Z is anterior; +Y is up. Crown nodes contain no exposed roots.
import { mkdir } from "node:fs/promises";
import { dirname } from "node:path";
import * as THREE from "three";
import { Document, NodeIO } from "@gltf-transform/core";
import { makeNaturalRoots } from "./dental-roots.mjs";
import { makeReferenceMolar } from "./dental-molar.mjs";

const OUT = process.argv[2] ?? "public/models/dava-dentition.glb";
const ANGLES = 48;
const TYPES = ["I1", "I2", "C", "PM1", "PM2", "M1", "M2"];
const clamp = THREE.MathUtils.clamp;
const smooth = THREE.MathUtils.smoothstep;
const signedPow = (value, exponent) => Math.sign(value) * Math.abs(value) ** exponent;
const mix = THREE.MathUtils.lerp;

const specifications = {
  U: [
    { w: .47, d: .35, h: .65, neck: .73, kind: "incisor" },
    { w: .38, d: .34, h: .58, neck: .66, kind: "incisor" },
    { w: .42, d: .41, h: .64, neck: .72, kind: "canine" },
    { w: .44, d: .54, h: .51, neck: .60, kind: "premolar" },
    { w: .45, d: .56, h: .50, neck: .60, kind: "premolar" },
    { w: .60, d: .65, h: .49, neck: .59, kind: "molar", organic: true },
    { w: .57, d: .63, h: .47, neck: .59, kind: "molar" },
  ],
  L: [
    { w: .31, d: .29, h: .45, neck: -.52, kind: "incisor" },
    { w: .35, d: .32, h: .46, neck: -.53, kind: "incisor" },
    { w: .38, d: .38, h: .53, neck: -.59, kind: "canine" },
    { w: .43, d: .48, h: .48, neck: -.56, kind: "premolar" },
    { w: .44, d: .51, h: .48, neck: -.56, kind: "premolar" },
    { w: .60, d: .60, h: .42, neck: -.56, kind: "molar", reference: true },
    { w: .59, d: .59, h: .46, neck: -.56, kind: "molar" },
  ],
};

function profile(t, points) {
  for (let index = 1; index < points.length; index++) {
    if (t > points[index][0]) continue;
    const [start, a] = points[index - 1];
    const [end, b] = points[index];
    return mix(a, b, smooth(t, start, end));
  }
  return points.at(-1)[1];
}

function makeGeometry(vertices, indices, colors) {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  if (colors) geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  return geometry;
}

const smoothUnion = (a, b, radius) => {
  const blend = clamp(.5 + .5 * (b - a) / radius, 0, 1);
  return mix(b, a, blend) - radius * blend * (1 - blend);
};

function ellipsoidDistance(x, y, z, rx, ry, rz) {
  const first = Math.hypot(x / rx, y / ry, z / rz);
  const second = Math.hypot(x / (rx * rx), y / (ry * ry), z / (rz * rz));
  return second > .00001 ? first * (first - 1) / second : -Math.min(rx, ry, rz);
}

/** Watertight marching tetrahedra, sharing vertices across all grid edges. */
function sculptSurface(field, bounds, resolution, colorAt) {
  const [nx, ny, nz] = resolution;
  const [min, max] = bounds;
  const strideY = nx + 1, strideZ = (nx + 1) * (ny + 1);
  const samples = new Float32Array((nx + 1) * (ny + 1) * (nz + 1));
  const spacing = max.map((value, axis) => (value - min[axis]) / resolution[axis]);
  const idAt = (x, y, z) => x + y * strideY + z * strideZ;
  for (let z = 0; z <= nz; z++) for (let y = 0; y <= ny; y++) for (let x = 0; x <= nx; x++) {
    samples[idAt(x, y, z)] = field(min[0] + x * spacing[0], min[1] + y * spacing[1], min[2] + z * spacing[2]);
  }
  const cubeCorners = [[0, 0, 0], [1, 0, 0], [1, 1, 0], [0, 1, 0], [0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1]];
  const tetrahedra = [[0, 5, 1, 6], [0, 1, 2, 6], [0, 2, 3, 6], [0, 3, 7, 6], [0, 7, 4, 6], [0, 4, 5, 6]];
  const vertices = [], indices = [], colors = [], edges = new Map();
  const crossing = (a, b) => {
    const low = Math.min(a.id, b.id), high = Math.max(a.id, b.id);
    const key = low + high * samples.length;
    if (edges.has(key)) return edges.get(key);
    const t = a.value / (a.value - b.value);
    const point = a.point.map((value, axis) => mix(value, b.point[axis], t));
    const index = vertices.length / 3;
    vertices.push(...point);
    colors.push(...colorAt(...point));
    edges.set(key, index);
    return index;
  };
  const face = (a, b, c, outward) => {
    const ax = vertices[b * 3] - vertices[a * 3], ay = vertices[b * 3 + 1] - vertices[a * 3 + 1], az = vertices[b * 3 + 2] - vertices[a * 3 + 2];
    const bx = vertices[c * 3] - vertices[a * 3], by = vertices[c * 3 + 1] - vertices[a * 3 + 1], bz = vertices[c * 3 + 2] - vertices[a * 3 + 2];
    const dot = (ay * bz - az * by) * outward[0] + (az * bx - ax * bz) * outward[1] + (ax * by - ay * bx) * outward[2];
    if (dot >= 0) indices.push(a, b, c);
    else indices.push(a, c, b);
  };
  for (let z = 0; z < nz; z++) for (let y = 0; y < ny; y++) for (let x = 0; x < nx; x++) {
    const corners = cubeCorners.map(([dx, dy, dz]) => {
      const id = idAt(x + dx, y + dy, z + dz);
      return { id, value: samples[id], point: [min[0] + (x + dx) * spacing[0], min[1] + (y + dy) * spacing[1], min[2] + (z + dz) * spacing[2]] };
    });
    if (corners.every(corner => corner.value >= 0) || corners.every(corner => corner.value < 0)) continue;
    for (const tetrahedron of tetrahedra) {
      const inside = [], outside = [];
      tetrahedron.forEach(index => (corners[index].value < 0 ? inside : outside).push(corners[index]));
      if (!inside.length || !outside.length) continue;
      const inward = [0, 0, 0], outward = [0, 0, 0];
      inside.forEach(corner => corner.point.forEach((value, axis) => inward[axis] += value / inside.length));
      outside.forEach(corner => corner.point.forEach((value, axis) => outward[axis] += value / outside.length));
      outward.forEach((value, axis) => outward[axis] = value - inward[axis]);
      if (inside.length === 1 || outside.length === 1) {
        const single = inside.length === 1 ? inside[0] : outside[0];
        const others = inside.length === 1 ? outside : inside;
        face(...others.map(corner => crossing(single, corner)), outward);
      } else {
        const a = crossing(inside[0], outside[0]), b = crossing(inside[0], outside[1]);
        const c = crossing(inside[1], outside[0]), d = crossing(inside[1], outside[1]);
        face(a, b, d, outward);
        face(a, d, c, outward);
      }
    }
  }
  const geometry = makeGeometry(vertices, indices, colors);
  // Finite-difference field gradients give a continuous enamel/root normal,
  // including the saddle where the two roots fuse into the cervical trunk.
  const positions = geometry.getAttribute("position"), normals = geometry.getAttribute("normal");
  const epsilon = .0015;
  for (let vertex = 0; vertex < positions.count; vertex++) {
    const x = positions.getX(vertex), y = positions.getY(vertex), z = positions.getZ(vertex);
    const normal = new THREE.Vector3(field(x + epsilon, y, z) - field(x - epsilon, y, z), field(x, y + epsilon, z) - field(x, y - epsilon, z), field(x, y, z + epsilon) - field(x, y, z - epsilon)).normalize();
    normals.setXYZ(vertex, normal.x, normal.y, normal.z);
  }
  return geometry;
}

/** One organic enamel surface: rounded shoulders roll directly into four cusps. */
function makeOrganicMolar(spec) {
  const { w, d, h } = spec;
  const scaleX = w / .6, scaleY = h / .52, scaleZ = d / .65;
  const field = (rawX, rawY, rawZ) => {
    const x = rawX / scaleX, y = rawY / scaleY, z = rawZ / scaleZ;
    // A bulbous asymmetric ellipsoid puts the widest enamel above the neck.
    // The lower pole continues inside the root trunk instead of ending in a shelf.
    const radial = (Math.abs(x / .29) ** 3.2 + Math.abs(z / .315) ** 3.2) ** (1 / 3.2);
    const vertical = (y - .22) / (y < .22 ? .30 : .245);
    let distance = (Math.hypot(radial, vertical) - 1) * .21;
    for (const [cx, cz, amplitude] of [[-.125, -.135, 1], [.125, -.135, .98], [-.125, .135, .96], [.125, .135, .94]]) {
      const cusp = ellipsoidDistance(x - cx, y - .402, z - cz, .158, .114 * amplitude, .176);
      distance = smoothUnion(distance, cusp, .07);
    }
    // Shallow curving sulci; they remain part of the same smooth surface.
    const occlusal = smooth(y, .39, .5);
    const fissureX = x + .011 * Math.sin(z * 15);
    const fissureZ = z - .012 * Math.sin(x * 16);
    distance += occlusal * (.0045 * Math.exp(-(fissureX ** 2) / .0008) + .004 * Math.exp(-(fissureZ ** 2) / .001));
    return distance;
  };
  return sculptSurface(field, [[-.35 * scaleX, -.13 * scaleY, -.38 * scaleZ], [.35 * scaleX, .57 * scaleY, .38 * scaleZ]], [36, 34, 38], (_x, y) => {
    const cervical = (1 - clamp(y / h, 0, 1)) ** 3;
    const shade = .985 - .022 * cervical;
    return [shade, shade - .008 - .01 * cervical, shade - .027 - .02 * cervical];
  });
}

/** Rounded rectangular body with a separately modelled incisal/occlusal surface. */
function makeCrown(spec, direction) {
  if (spec.reference) {
    const crown = makeReferenceMolar(spec);
    if (direction < 0) crown.rotateX(Math.PI);
    return crown;
  }
  if (spec.organic) {
    const crown = makeOrganicMolar(spec);
    if (direction < 0) crown.rotateX(Math.PI);
    return crown;
  }
  const { w, d, h, kind } = spec;
  const posterior = kind === "molar" || kind === "premolar";
  const exponent = kind === "incisor" ? .54 : kind === "canine" ? .69 : .74;
  const vertices = [], indices = [], colors = [];
  const ringIndices = [];
  const sideSign = direction > 0 ? 1 : -1;
  const gauss = (x, z, cx, cz, spread) => Math.exp(-((x - cx) ** 2 + (z - cz) ** 2) / spread);
  const capHeight = (x, z) => {
    const xn = x / (w * .5), zn = z / (d * .5);
    if (kind === "incisor") return h - .033 * Math.abs(xn) ** 5 + .006 * (1 - zn ** 2);
    if (kind === "canine") return h - .075 + .075 * Math.exp(-((xn - .05) ** 2 / .48 + zn ** 2 / .7));
    if (kind === "premolar") {
      return h - .078 + .08 * (gauss(xn, zn, -.04, -.48, .17) + gauss(xn, zn, .04, .48, .17)) - .008 * Math.exp(-(zn ** 2) / .018);
    }
    const cusps = gauss(xn, zn, -.46, -.43, .18) + .92 * gauss(xn, zn, .45, -.46, .18) + .88 * gauss(xn, zn, -.46, .44, .18) + .8 * gauss(xn, zn, .44, .45, .18);
    const centralGroove = .005 * Math.exp(-(xn ** 2) / .018) + .006 * Math.exp(-(zn ** 2) / .02);
    return h - .092 + .094 * cusps - centralGroove;
  };
  const ringPoint = (angle, u, radius = 1) => {
    const width = profile(u, [[0, .73], [.15, .85], [.48, .99], [.75, 1], [1, posterior ? .86 : kind === "canine" ? .73 : .91]]);
    const depth = profile(u, [[0, .77], [.22, .93], [.48, 1], [.75, .94], [1, posterior ? .86 : kind === "canine" ? .65 : .36]]);
    const x = signedPow(Math.cos(angle), exponent) * w * .5 * width * radius;
    const z = signedPow(Math.sin(angle), exponent) * d * .5 * depth * radius;
    const incisal = capHeight(x, z);
    const baseHeight = posterior ? h - .092 : kind === "canine" ? h - .075 : h;
    const localHeight = mix(baseHeight * u, incisal, smooth(u, .73, 1));
    // The shallow buccal convexity reads as enamel, not a straight extruded block.
    const bulge = Math.sin(Math.PI * u) * .012;
    return [x, direction * localHeight, z + Math.sign(z) * bulge];
  };
  const pushVertex = (point, cervical) => {
    const index = vertices.length / 3;
    vertices.push(...point);
    const shade = .985 - .025 * cervical;
    colors.push(shade, shade - .008 - .012 * cervical, shade - .027 - .025 * cervical);
    return index;
  };
  const addRing = (fn, cervical = 0) => {
    const ring = [];
    for (let angle = 0; angle < ANGLES; angle++) ring.push(pushVertex(fn(angle / ANGLES * Math.PI * 2), cervical));
    return ring;
  };
  const joinRings = (first, second, orientation) => {
    for (let angle = 0; angle < ANGLES; angle++) {
      const next = (angle + 1) % ANGLES;
      if (orientation > 0) indices.push(first[angle], second[angle], first[next], second[angle], second[next], first[next]);
      else indices.push(first[angle], first[next], second[angle], second[angle], first[next], second[next]);
    }
  };
  for (let level = 0; level <= 26; level++) {
    const u = level / 26;
    const ring = addRing(angle => ringPoint(angle, u), (1 - u) ** 3);
    if (ringIndices.length) joinRings(ringIndices.at(-1), ring, sideSign);
    ringIndices.push(ring);
  }
  let previous = ringIndices.at(-1);
  for (let level = 1; level < 12; level++) {
    const radius = 1 - level / 12;
    const ring = addRing(angle => {
      const point = ringPoint(angle, 1, radius);
      point[1] = direction * capHeight(point[0], point[2]);
      return point;
    });
    joinRings(previous, ring, sideSign);
    previous = ring;
  }
  const capCenter = pushVertex([0, direction * capHeight(0, 0), 0], 0);
  for (let angle = 0; angle < ANGLES; angle++) {
    const next = (angle + 1) % ANGLES;
    if (sideSign > 0) indices.push(previous[angle], capCenter, previous[next]);
    else indices.push(previous[angle], previous[next], capCenter);
  }
  // A closed cervical cap remains embedded in the gum from every camera angle.
  const neckCenter = pushVertex([0, 0, 0], 1);
  const neckRing = ringIndices[0];
  for (let angle = 0; angle < ANGLES; angle++) {
    const next = (angle + 1) % ANGLES;
    if (sideSign > 0) indices.push(neckRing[angle], neckRing[next], neckCenter);
    else indices.push(neckRing[angle], neckCenter, neckRing[next]);
  }
  return makeGeometry(vertices, indices, colors);
}

function makeArc(a, b) {
  const samples = 2400, max = 2.1, distances = [0];
  let last = new THREE.Vector2(0, b);
  for (let index = 1; index <= samples; index++) {
    const t = max * index / samples;
    const point = new THREE.Vector2(a * Math.sin(t), b * Math.cos(t));
    distances.push(distances.at(-1) + point.distanceTo(last));
    last = point;
  }
  const angleAt = distance => {
    const s = Math.abs(distance);
    let low = 0, high = samples;
    while (high - low > 1) {
      const middle = (high + low) >> 1;
      if (distances[middle] < s) low = middle;
      else high = middle;
    }
    return Math.sign(distance) * max * (low + (s - distances[low]) / (distances[high] - distances[low])) / samples;
  };
  const pointAt = distance => {
    const t = angleAt(distance);
    const point = new THREE.Vector3(a * Math.sin(t), 0, b * Math.cos(t));
    const tangent = new THREE.Vector3(a * Math.cos(t), 0, -b * Math.sin(t)).normalize();
    const normal = new THREE.Vector3(-tangent.z, 0, tangent.x);
    return { point, tangent, normal, t };
  };
  return { angleAt, pointAt };
}

function arrangeArch(arch) {
  const arc = makeArc(arch === "U" ? 1.60 : 1.50, arch === "U" ? 1.85 : 1.74);
  const teeth = [];
  let distance = .003;
  specifications[arch].forEach((spec, index) => {
    distance += spec.w / 2;
    for (const side of ["R", "L"]) {
      const s = distance * (side === "R" ? 1 : -1);
      const placement = arc.pointAt(s);
      teeth.push({ name: `tooth_${arch}_${TYPES[index]}_${side}`, spec, s, ...placement });
    }
    distance += spec.w / 2 + .007;
  });
  return { teeth, arc, extent: distance + .13 };
}

/** A broad solid denture base, with cervical scallops and gently rounded closed ends. */
function makeGum(arch, arrangement) {
  const upper = arch === "U", sign = upper ? 1 : -1;
  const { teeth, arc, extent } = arrangement;
  const vertices = [], indices = [], colors = [];
  const segments = 240, sides = 40;
  const ordered = [...teeth].sort((a, b) => a.s - b.s);
  const marginAt = s => {
    let nearest = ordered[0];
    for (const tooth of ordered) if (Math.abs(s - tooth.s) < Math.abs(s - nearest.s)) nearest = tooth;
    let neck = s <= ordered[0].s ? ordered[0].spec.neck : ordered.at(-1).spec.neck;
    for (let index = 1; index < ordered.length; index++) {
      const left = ordered[index - 1], right = ordered[index];
      if (s >= left.s && s <= right.s) {
        neck = mix(left.spec.neck, right.spec.neck, smooth(s, left.s, right.s));
        break;
      }
    }
    const normalized = clamp(Math.abs(s - nearest.s) / (nearest.spec.w * .5), 0, 1);
    const scallop = .055 * Math.sin(normalized * Math.PI * .5) ** 2;
    return neck - sign * (.045 + scallop);
  };
  for (let step = 0; step <= segments; step++) {
    const s = mix(-extent, extent, step / segments);
    const { point, normal, t } = arc.pointAt(s);
    const endDistance = extent - Math.abs(s);
    const capProgress = clamp(endDistance / .2, 0, 1);
    const capFactor = Math.sqrt(1 - (1 - capProgress) ** 2);
    const posterior = smooth(Math.abs(t), .4, 1.5);
    const margin = marginAt(s);
    const top = sign * (mix(upper ? 1.24 : 1.20, upper ? 1.19 : 1.16, posterior) - .025 * Math.exp(-s * s / .015));
    const centerY = (top + margin) * .5;
    const halfHeight = Math.abs(top - margin) * .5;
    const attachmentY = centerY;
    for (let side = 0; side < sides; side++) {
      const angle = side / sides * Math.PI * 2;
      const vertical = signedPow(Math.sin(angle), .94);
      const radial = signedPow(Math.cos(angle), .94);
      const baseWidth = mix(.285, .36, posterior);
      // The collar stays wider than the cervical enamel while the body recedes.
      const neckWidth = mix(.215, .335, posterior);
      const breadth = mix(baseWidth, neckWidth, smooth(-vertical, .3, 1));
      const lobe = .007 * Math.cos(s * 11) * (1 - vertical ** 2);
      const radius = (breadth * radial + lobe * Math.sign(radial)) * capFactor;
      const y = mix(attachmentY, centerY + sign * vertical * halfHeight, capFactor);
      vertices.push(point.x + normal.x * radius, y, point.z + normal.z * radius);
      const blush = .018 * Math.cos(s * 5 + angle * 2) + .009 * Math.sin(s * 17 + angle * 3);
      const collar = smooth(-vertical, .1, .95);
      colors.push(.69 + collar * .06 + blush, .255 + collar * .065 + blush * .65, .345 + collar * .065 + blush * .7);
      if (step < segments) {
        const a = step * sides + side, b = a + sides;
        const next = step * sides + (side + 1) % sides, nextB = next + sides;
        if (upper) indices.push(a, b, next, b, nextB, next);
        else indices.push(a, next, b, b, next, nextB);
      }
    }
  }
  // Each collapsed terminal ring is one geometric pole. Share its index so
  // smooth shading cannot assign a different normal to every fan triangle.
  const finalPole = segments * sides;
  for (let index = 0; index < indices.length; index++) {
    if (indices[index] < sides) indices[index] = 0;
    else if (indices[index] >= finalPole) indices[index] = finalPole;
  }
  const geometry = makeGeometry(vertices, indices, colors);
  const normals = geometry.getAttribute("normal");
  const startNormal = arc.pointAt(-extent).tangent.multiplyScalar(-1);
  const endNormal = arc.pointAt(extent).tangent;
  // At the closed poles the exact outward derivative is the arch tangent.
  for (let side = 0; side < sides; side++) {
    normals.setXYZ(side, startNormal.x, startNormal.y, startNormal.z);
    normals.setXYZ(finalPole + side, endNormal.x, endNormal.y, endNormal.z);
  }
  return geometry;
}

const doc = new Document();
const buffer = doc.createBuffer("dava-original-dentition");
const scene = doc.createScene("Dava dentition");
const enamel = doc.createMaterial("enamel_ivory").setBaseColorFactor([1, 1, 1, 1]).setMetallicFactor(0).setRoughnessFactor(.22);
const gingiva = doc.createMaterial("gingiva_rose").setBaseColorFactor([1, 1, 1, 1]).setMetallicFactor(0).setRoughnessFactor(.34);
const dentin = doc.createMaterial("root_dentin").setBaseColorFactor([1, 1, 1, 1]).setMetallicFactor(0).setRoughnessFactor(.64);
let totalVertices = 0, totalTriangles = 0;
const mouthBounds = new THREE.Box3();
const sharedMeshes = new Map();

function writeMesh(name, geometry, material, parent, translation = [0, 0, 0], rotation) {
  const sharedKey = name.startsWith("tooth_") ? name.replace(/_[RL]$/, "") : null;
  if (sharedKey && sharedMeshes.has(sharedKey)) {
    const node = doc.createNode(name).setMesh(sharedMeshes.get(sharedKey)).setTranslation(translation);
    if (rotation) node.setRotation(rotation);
    parent.addChild(node);
    totalVertices += geometry.getAttribute("position").count;
    totalTriangles += geometry.getIndex().count / 3;
    return node;
  }
  const attributes = {};
  for (const [name, attribute] of Object.entries(geometry.attributes)) {
    const gltfName = { position: "POSITION", normal: "NORMAL", color: "COLOR_0" }[name];
    if (!gltfName) continue;
    const color = name === "color";
    const array = color
      ? new Uint8Array(Array.from(attribute.array, value => Math.round(clamp(value, 0, 1) * 255)))
      : new Float32Array(attribute.array);
    attributes[gltfName] = doc.createAccessor(`${name}_${totalVertices}`).setType("VEC3").setArray(array).setNormalized(color).setBuffer(buffer);
  }
  const index = geometry.getIndex();
  const IndexArray = geometry.getAttribute("position").count <= 65535 ? Uint16Array : Uint32Array;
  const accessor = doc.createAccessor(`${name}_indices`).setType("SCALAR").setArray(new IndexArray(index.array)).setBuffer(buffer);
  const primitive = doc.createPrimitive().setIndices(accessor).setMaterial(material);
  for (const [name, accessor] of Object.entries(attributes)) primitive.setAttribute(name, accessor);
  const mesh = doc.createMesh(`${name}_mesh`).addPrimitive(primitive);
  if (sharedKey) sharedMeshes.set(sharedKey, mesh);
  const node = doc.createNode(name).setMesh(mesh).setTranslation(translation);
  if (rotation) node.setRotation(rotation);
  parent.addChild(node);
  totalVertices += geometry.getAttribute("position").count;
  totalTriangles += index.count / 3;
  return node;
}

for (const arch of ["U", "L"]) {
  const arrangement = arrangeArch(arch);
  for (const tooth of arrangement.teeth) {
    const { name, spec, point, tangent } = tooth;
    const rotation = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.atan2(-tangent.z, tangent.x));
    const geometry = makeCrown(spec, arch === "U" ? -1 : 1);
    const transform = new THREE.Matrix4().compose(new THREE.Vector3(point.x, spec.neck, point.z), rotation, new THREE.Vector3(1, 1, 1));
    mouthBounds.union(geometry.boundingBox.clone().applyMatrix4(transform));
    writeMesh(name, geometry, enamel, scene, [point.x, spec.neck, point.z], rotation.toArray());
    geometry.dispose();
  }
  const gum = makeGum(arch, arrangement);
  mouthBounds.union(gum.boundingBox);
  writeMesh(arch === "U" ? "gum_upper" : "gum_lower", gum, gingiva, scene);
  gum.dispose();
}

const hero = doc.createNode("hero_molar").setExtras({ standalone: true, axis: "crown +Y; roots -Y", originalGeometry: true, slot: "tooth_L_M1_R", crownRotationX: 0 });
scene.addChild(hero);
// The video reference is a lower first molar. Its hero is the exact same local
// crown as tooth_L_M1_R: +Y occlusal, with no baked rotation or scale change.
const heroCrown = makeCrown(specifications.L[5], 1);
writeMesh("hero_molar_crown", heroCrown, enamel, hero);
const heroRoots = makeNaturalRoots({ resolution: 96 });
writeMesh("hero_molar_roots", heroRoots, dentin, hero);
hero.setExtras({ standalone: true, visibleInMouth: false, axis: "crown +Y; roots -Y", originalGeometry: true, slot: "tooth_L_M1_R", crownRotationX: 0 });

doc.getRoot().setExtras({ authoring: "Original procedural model for Dava Dental Care", generator: "scripts/generate-dental-model.mjs", anterior: "+Z", vertical: "+Y", toothCount: 28, heroSlot: "tooth_L_M1_R", heroCrownRotationX: 0, meshVertices: totalVertices, triangles: totalTriangles, mouthBounds: { min: mouthBounds.min.toArray(), max: mouthBounds.max.toArray() } });
await mkdir(dirname(OUT), { recursive: true });
await new NodeIO().write(OUT, doc);
console.log(JSON.stringify({ output: OUT, vertices: totalVertices, triangles: totalTriangles, mouthSize: mouthBounds.getSize(new THREE.Vector3()).toArray(), mouthCenter: mouthBounds.getCenter(new THREE.Vector3()).toArray(), toothCount: 28, gumNodes: ["gum_upper", "gum_lower"], hero: "hero_molar" }, null, 2));
