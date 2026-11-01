import * as THREE from "three";
import { makeReferenceMolar } from "./dental-molar.mjs";
import { makeNaturalRoots } from "./dental-roots.mjs";

const mix = THREE.MathUtils.lerp;
const smooth = THREE.MathUtils.smootherstep;
const TAU = Math.PI * 2;
const angleOf = (x, z) => (Math.atan2(z, x) + TAU) % TAU;

/** Cut away the old, mismatched root collar, retaining its indexed lower surface. */
function openRootTrunk(source, cutY) {
  const positions = [], normals = [], indices = [];
  const copied = new Map(), intersections = new Map();
  const input = source.getAttribute("position"), inputNormals = source.getAttribute("normal");
  const add = (point, normal) => {
    const index = positions.length / 3;
    positions.push(...point);
    normals.push(...normal);
    return index;
  };
  const copy = index => {
    if (!copied.has(index)) copied.set(index, add(
      [input.getX(index), input.getY(index), input.getZ(index)],
      [inputNormals.getX(index), inputNormals.getY(index), inputNormals.getZ(index)],
    ));
    return copied.get(index);
  };
  const intersection = (first, second) => {
    const key = [first, second].sort((a, b) => a - b).join(":");
    if (!intersections.has(key)) {
      const t = (cutY - input.getY(first)) / (input.getY(second) - input.getY(first));
      const point = new THREE.Vector3().fromBufferAttribute(input, first).lerp(new THREE.Vector3().fromBufferAttribute(input, second), t);
      const normal = new THREE.Vector3().fromBufferAttribute(inputNormals, first).lerp(new THREE.Vector3().fromBufferAttribute(inputNormals, second), t).normalize();
      point.y = cutY;
      intersections.set(key, add(point.toArray(), normal.toArray()));
    }
    return intersections.get(key);
  };
  for (let offset = 0; offset < source.index.count; offset += 3) {
    const face = [source.index.getX(offset), source.index.getX(offset + 1), source.index.getX(offset + 2)];
    const polygon = [];
    for (let corner = 0; corner < 3; corner++) {
      const first = face[corner], second = face[(corner + 1) % 3];
      const firstInside = input.getY(first) <= cutY, secondInside = input.getY(second) <= cutY;
      if (firstInside) polygon.push(copy(first));
      if (firstInside !== secondInside) polygon.push(intersection(first, second));
    }
    for (let corner = 1; corner + 1 < polygon.length; corner++) indices.push(polygon[0], polygon[corner], polygon[corner + 1]);
  }
  const boundary = [...intersections.values()].sort((a, b) => angleOf(positions[a * 3], positions[a * 3 + 2]) - angleOf(positions[b * 3], positions[b * 3 + 2]));
  if (boundary.length < 32) throw new Error("The molar root trunk has no usable cervical boundary.");
  return { positions, normals, indices, boundary };
}

function hermite(start, end, startSlope, endSlope, t) {
  const square = t * t, cube = square * t;
  return (2 * cube - 3 * square + 1) * start + (-2 * cube + 3 * square) * end
    + (cube - 2 * square + t) * startSlope + (cube - square) * endSlope;
}

/**
 * Two animation parts with one continuous outer surface. Both share exactly the
 * same 128 cervical vertices, normals and colors; neither has an internal cap.
 * A Hermite loft carries the enamel tangent into the existing two-root trunk.
 */
export function makeHeroMolar(spec = { w: .60, d: .60, h: .42 }, { resolution = 96 } = {}) {
  const crown = makeReferenceMolar(spec, { closeNeck: false });
  const source = makeNaturalRoots({ resolution });
  const cutY = -.12, rings = 28;
  const { positions, normals, indices, boundary } = openRootTrunk(source, cutY);
  source.dispose();
  const crownPositions = crown.getAttribute("position"), crownNormals = crown.getAttribute("normal"), crownColors = crown.getAttribute("color");
  const cervical = crown.userData.cervicalRing;
  const count = cervical.length;
  const boundaryAngles = boundary.map(index => angleOf(positions[index * 3], positions[index * 3 + 2]));
  const colors = [];
  const rootColor = (x, y, z) => {
    const amount = smooth(-y, .035, .75);
    const grain = .0015 * Math.sin(x * 103 + y * 79) * Math.sin(z * 111 - y * 47) * amount;
    return [mix(.955, .82, amount) + grain, mix(.937, .765, amount) + grain, mix(.910, .66, amount) + grain];
  };
  for (let index = 0; index < positions.length; index += 3) colors.push(...rootColor(positions[index], positions[index + 1], positions[index + 2]));
  const bottomAt = phi => {
    let next = boundaryAngles.findIndex(angle => angle >= phi);
    if (next < 0) next = 0;
    const previous = (next - 1 + boundary.length) % boundary.length;
    const a = boundary[previous], b = boundary[next];
    const ax = positions[a * 3], az = positions[a * 3 + 2], bx = positions[b * 3], bz = positions[b * 3 + 2];
    const dx = Math.cos(phi), dz = Math.sin(phi), ex = bx - ax, ez = bz - az;
    const t = (az * dx - ax * dz) / (ex * dz - ez * dx);
    const normal = new THREE.Vector3(...normals.slice(a * 3, a * 3 + 3)).lerp(new THREE.Vector3(...normals.slice(b * 3, b * 3 + 3)), t).normalize();
    return { point: new THREE.Vector3(mix(ax, bx, t), cutY, mix(az, bz, t)), normal };
  };
  const columns = cervical.map((index, segment) => {
    const top = new THREE.Vector3().fromBufferAttribute(crownPositions, index);
    const above = new THREE.Vector3().fromBufferAttribute(crownPositions, index + count);
    const phi = angleOf(top.x, top.z), bottom = bottomAt(phi);
    const deltaY = cutY - top.y;
    // The collar contracts on leaving the crown, without an overhanging shelf.
    const startSlope = above.clone().sub(top).multiplyScalar(deltaY / (above.y - top.y));
    const radialNormal = bottom.normal.x * Math.cos(phi) + bottom.normal.z * Math.sin(phi);
    const drdy = -bottom.normal.y / radialNormal;
    const endSlope = new THREE.Vector3(Math.cos(phi) * drdy * deltaY, deltaY, Math.sin(phi) * drdy * deltaY);
    return { top, bottom: bottom.point, startSlope, endSlope, phi, segment };
  });
  const loft = [];
  for (let ring = 0; ring < rings; ring++) {
    const t = ring / rings, vertices = [];
    columns.forEach(({ top, bottom, startSlope, endSlope, segment }) => {
      const x = hermite(top.x, bottom.x, startSlope.x, endSlope.x, t);
      const y = mix(top.y, cutY, t);
      const z = hermite(top.z, bottom.z, startSlope.z, endSlope.z, t);
      const index = positions.length / 3;
      vertices.push(index);
      positions.push(x, y, z);
      normals.push(0, 0, 0);
      const blend = smooth(t, 0, 1), dentin = rootColor(x, y, z);
      colors.push(...[0, 1, 2].map(axis => mix(crownColors.array[segment * 3 + axis], dentin[axis], blend)));
    });
    loft.push(vertices);
  }
  const addFace = (a, b, c) => {
    const pa = new THREE.Vector3(...positions.slice(a * 3, a * 3 + 3));
    const pb = new THREE.Vector3(...positions.slice(b * 3, b * 3 + 3));
    const pc = new THREE.Vector3(...positions.slice(c * 3, c * 3 + 3));
    const normal = pb.clone().sub(pa).cross(pc.clone().sub(pa));
    const radial = new THREE.Vector3(pa.x + pb.x + pc.x, 0, pa.z + pb.z + pc.z);
    if (normal.dot(radial) >= 0) indices.push(a, b, c);
    else indices.push(a, c, b);
  };
  for (let ring = 1; ring < rings; ring++) {
    for (let segment = 0; segment < count; segment++) {
      const next = (segment + 1) % count;
      addFace(loft[ring - 1][segment], loft[ring][segment], loft[ring - 1][next]);
      addFace(loft[ring][segment], loft[ring][next], loft[ring - 1][next]);
    }
  }
  // Angular zipper preserves every vertex of the original clipped root surface.
  const last = loft.at(-1);
  let a = 0, b = 0;
  while (a < count || b < boundary.length) {
    const nextA = a < count ? (a + 1 < count ? columns[a + 1].phi : TAU) : Infinity;
    const nextB = b < boundary.length ? (b + 1 < boundary.length ? boundaryAngles[b + 1] : boundaryAngles[0] + TAU) : Infinity;
    if (nextA <= nextB) {
      addFace(last[a % count], boundary[b % boundary.length], last[(a + 1) % count]);
      a++;
    } else {
      addFace(last[a % count], boundary[b % boundary.length], boundary[(b + 1) % boundary.length]);
      b++;
    }
  }
  const roots = new THREE.BufferGeometry();
  roots.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  roots.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  roots.setIndex(indices);
  roots.computeVertexNormals();
  const outputNormals = roots.getAttribute("normal");
  // Preserve the analytic branch normals and exact crown tangent at both seams.
  for (let index = 0; index < loft[0][0]; index++) outputNormals.setXYZ(index, normals[index * 3], normals[index * 3 + 1], normals[index * 3 + 2]);
  loft[0].forEach((index, segment) => outputNormals.setXYZ(index, crownNormals.getX(segment), crownNormals.getY(segment), crownNormals.getZ(segment)));
  roots.computeBoundingBox();
  roots.computeBoundingSphere();
  roots.userData = { originalGeometry: true, rootCount: 2, cervicalRing: loft[0], cervicalSegments: count, trunkJoinY: cutY };
  return { crown, roots };
}
