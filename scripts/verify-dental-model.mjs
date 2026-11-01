// Validate the generated asset, including the crown/root junction that must
// remain continuous while the viewer animates the two parts independently.
// Usage: node scripts/verify-dental-model.mjs [path/to/model.glb]
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { NodeIO } from "@gltf-transform/core";

const source = process.argv[2] ?? fileURLToPath(new URL("../public/models/dava-dentition.glb", import.meta.url));
const expectedCrowns = ["U", "L"].flatMap(arch =>
  ["I1", "I2", "C", "PM1", "PM2", "M1", "M2"].flatMap(type =>
    ["R", "L"].map(side => `tooth_${arch}_${type}_${side}`)));
const expectedParts = [...expectedCrowns, "gum_upper", "gum_lower", "hero_molar_crown", "hero_molar_roots"];
const positionKey = point => point.map(value => Math.round(value * 1e7)).join(",");

function readGeometry(nodes) {
  const positions = [], normals = [], colors = [], triangles = [];
  let invalidIndices = 0;
  for (const node of nodes) {
    for (const primitive of node.getMesh().listPrimitives()) {
      const position = primitive.getAttribute("POSITION");
      const normal = primitive.getAttribute("NORMAL");
      const color = primitive.getAttribute("COLOR_0");
      const indices = primitive.getIndices();
      assert(position && normal && color && indices, `${node.getName()} must have positions, normals, colors, and indices.`);
      assert.equal(primitive.getMode(), 4, `${node.getName()} must use triangle primitives.`);
      assert.equal(normal.getCount(), position.getCount(), `${node.getName()} normal count differs.`);
      assert.equal(color.getCount(), position.getCount(), `${node.getName()} color count differs.`);
      const offset = positions.length;
      for (let vertex = 0; vertex < position.getCount(); vertex++) {
        positions.push(position.getElement(vertex, []));
        normals.push(normal.getElement(vertex, []));
        colors.push(color.getElement(vertex, []));
      }
      if (indices.getCount() % 3) invalidIndices++;
      for (let index = 0; index + 2 < indices.getCount(); index += 3) {
        const triangle = [indices.getScalar(index), indices.getScalar(index + 1), indices.getScalar(index + 2)];
        if (triangle.every(vertex => Number.isInteger(vertex) && vertex >= 0 && vertex < position.getCount())) {
          triangles.push(triangle.map(vertex => vertex + offset));
        } else invalidIndices++;
      }
    }
  }
  return { positions, normals, colors, triangles, invalidIndices };
}

function inspectGeometry(geometry, weld = false) {
  const { positions, normals, colors, triangles, invalidIndices } = geometry;
  const ids = [], positionIds = new Map(), parents = new Map();
  const root = id => {
    if (!parents.has(id)) parents.set(id, id);
    if (parents.get(id) !== id) parents.set(id, root(parents.get(id)));
    return parents.get(id);
  };
  const join = (a, b) => parents.set(root(a), root(b));
  positions.forEach((point, index) => {
    const key = positionKey(point);
    if (!positionIds.has(key)) positionIds.set(key, positionIds.size);
    ids.push(weld ? positionIds.get(key) : index);
  });
  const edges = new Map(), faces = new Set();
  let zeroArea = 0, collapsedAfterWeld = 0, reversedNormals = 0, duplicateFaces = 0, signedVolume = 0;
  for (const triangle of triangles) {
    const [a, b, c] = triangle.map(vertex => positions[vertex]);
    const ab = b.map((value, axis) => value - a[axis]);
    const ac = c.map((value, axis) => value - a[axis]);
    const cross = [ab[1] * ac[2] - ab[2] * ac[1], ab[2] * ac[0] - ab[0] * ac[2], ab[0] * ac[1] - ab[1] * ac[0]];
    const doubleArea = Math.hypot(...cross);
    // Marching surfaces can contain very small valid triangles. Only an
    // actually collapsed face is invalid; removing tiny faces would open holes.
    if (doubleArea === 0) { zeroArea++; continue; }
    const averageNormal = triangle.reduce((sum, vertex) => sum.map((value, axis) => value + normals[vertex][axis]), [0, 0, 0]);
    if (cross.reduce((sum, value, axis) => sum + value * averageNormal[axis], 0) < -doubleArea * 1e-4) reversedNormals++;
    signedVolume += (a[0] * (b[1] * c[2] - b[2] * c[1]) + a[1] * (b[2] * c[0] - b[0] * c[2]) + a[2] * (b[0] * c[1] - b[1] * c[0])) / 6;
    const vertices = triangle.map(vertex => ids[vertex]);
    join(vertices[0], vertices[1]);
    join(vertices[0], vertices[2]);
    if (new Set(vertices).size < 3) { collapsedAfterWeld++; continue; }
    const faceKey = [...vertices].sort((first, second) => first - second).join(",");
    if (faces.has(faceKey)) duplicateFaces++;
    faces.add(faceKey);
    for (let corner = 0; corner < 3; corner++) {
      const first = vertices[corner], second = vertices[(corner + 1) % 3];
      const key = first < second ? `${first},${second}` : `${second},${first}`;
      const edge = edges.get(key) ?? { count: 0, direction: 0, vertices: [first, second] };
      edge.count++;
      edge.direction += first < second ? 1 : -1;
      edges.set(key, edge);
    }
  }
  const boundaryVertices = new Set();
  let boundaryEdges = 0, nonmanifoldEdges = 0, inconsistentWinding = 0;
  for (const edge of edges.values()) {
    if (edge.count === 1) {
      boundaryEdges++;
      edge.vertices.forEach(vertex => boundaryVertices.add(vertex));
    } else if (edge.count !== 2) nonmanifoldEdges++;
    else if (edge.direction !== 0) inconsistentWinding++;
  }
  return {
    boundaryVertices,
    stats: {
      vertices: positions.length,
      triangles: triangles.length,
      connectedComponents: new Set([...parents.keys()].map(root)).size,
      invalidPositions: positions.filter(point => !point.every(Number.isFinite)).length,
      invalidNormals: normals.filter(normal => !normal.every(Number.isFinite) || Math.abs(Math.hypot(...normal) - 1) > .002).length,
      invalidColors: colors.filter(color => !color.every(Number.isFinite)).length,
      invalidIndices, zeroArea, collapsedAfterWeld, reversedNormals, duplicateFaces,
      boundaryEdges, nonmanifoldEdges, inconsistentWinding, signedVolume,
    },
  };
}

const document = await new NodeIO().read(source);
const nodes = document.getRoot().listNodes().filter(node => node.getMesh());
assert.equal(nodes.length, expectedParts.length, "The asset must contain 28 crowns, two gums, and two hero parts.");
for (const name of expectedParts) assert.equal(nodes.filter(node => node.getName() === name).length, 1, `Expected exactly one ${name}.`);
const geometryByName = new Map(nodes.map(node => [node.getName(), readGeometry([node])]));
const inspectionByName = new Map([...geometryByName].map(([name, geometry]) => [name, inspectGeometry(geometry)]));
const failures = [];
const checkQuality = (name, stats, closed) => {
  const errors = Object.entries(stats).filter(([key, value]) =>
    ["invalidPositions", "invalidNormals", "invalidColors", "invalidIndices", "zeroArea", "collapsedAfterWeld", "reversedNormals", "duplicateFaces", "nonmanifoldEdges", "inconsistentWinding"].includes(key) && value !== 0);
  if (stats.connectedComponents !== 1) errors.push(["connectedComponents", stats.connectedComponents]);
  if (closed && stats.boundaryEdges !== 0) errors.push(["boundaryEdges", stats.boundaryEdges]);
  if (!(stats.signedVolume > 0)) errors.push(["signedVolume", stats.signedVolume]);
  if (errors.length) failures.push({ name, errors: Object.fromEntries(errors) });
};
for (const [name, { stats }] of inspectionByName) checkQuality(name, stats, !name.startsWith("hero_"));

const crownName = "hero_molar_crown", rootName = "hero_molar_roots";
const crown = geometryByName.get(crownName), roots = geometryByName.get(rootName);
const crownBoundary = inspectionByName.get(crownName).boundaryVertices;
const rootBoundary = inspectionByName.get(rootName).boundaryVertices;
const rootSeam = new Map([...rootBoundary].map(vertex => [positionKey(roots.positions[vertex]), vertex]));
let matchedSeamVertices = 0, unequalSeamAttributes = 0;
for (const vertex of crownBoundary) {
  const match = rootSeam.get(positionKey(crown.positions[vertex]));
  if (match === undefined) continue;
  matchedSeamVertices++;
  // Both meshes must carry exactly the same exported position, normal, and
  // color at the split. Merely intersecting two closed shells does not pass.
  for (const attribute of ["positions", "normals", "colors"]) {
    if (crown[attribute][vertex].some((value, axis) => value !== roots[attribute][match][axis])) unequalSeamAttributes++;
  }
}
if (!crownBoundary.size || matchedSeamVertices !== crownBoundary.size || matchedSeamVertices !== rootBoundary.size || unequalSeamAttributes) {
  failures.push({ name: "hero cervical seam", crownBoundary: crownBoundary.size, rootBoundary: rootBoundary.size, matchedSeamVertices, unequalSeamAttributes });
}
const hero = inspectGeometry(readGeometry(nodes.filter(node => [crownName, rootName].includes(node.getName()))), true).stats;
checkQuality("hero joined surface", hero, true);
assert.equal(failures.length, 0, `Dental geometry validation failed:\n${JSON.stringify(failures, null, 2)}`);
const triangles = [...inspectionByName.values()].reduce((sum, { stats }) => sum + stats.triangles, 0);
console.log(`Dental model verified: 28 crowns, 2 gums, and a continuous two-part hero (${triangles.toLocaleString("en-US")} triangles).`);
console.log(`Hero seam: ${matchedSeamVertices} exact position/normal/color matches; one closed component; no open or nonmanifold edges.`);
