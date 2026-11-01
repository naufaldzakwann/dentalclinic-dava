// Original dental illustration. No scanned, downloaded, or third-party geometry.
// Reproduce with: node scripts/generate-dental-model.mjs [output.glb]
// +Z is anterior; +Y is up. Crown nodes contain no exposed roots.
import { mkdir } from "node:fs/promises";
import { dirname } from "node:path";
import * as THREE from "three";
import { Document, NodeIO } from "@gltf-transform/core";
import { makeHeroMolar } from "./dental-hero.mjs";
import { makeArchCrown } from "./dental-crowns.mjs";
import { makeGum } from "./dental-gums.mjs";
import { makeReferenceMolar } from "./dental-molar.mjs";

const OUT = process.argv[2] ?? "public/models/dava-dentition.glb";
const TYPES = ["I1", "I2", "C", "PM1", "PM2", "M1", "M2"];
const clamp = THREE.MathUtils.clamp;

const specifications = {
  U: [
    { w: .47, d: .35, h: .65, neck: .73, kind: "incisor" },
    { w: .38, d: .34, h: .58, neck: .66, kind: "incisor" },
    { w: .42, d: .41, h: .64, neck: .72, kind: "canine" },
    { w: .44, d: .54, h: .51, neck: .60, kind: "premolar" },
    { w: .45, d: .56, h: .50, neck: .60, kind: "premolar" },
    { w: .60, d: .65, h: .49, neck: .59, kind: "molar" },
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

function makeCrown(spec, direction) {
  if (!spec.reference) return makeArchCrown(spec, direction);
  const crown = makeReferenceMolar(spec);
  if (direction < 0) crown.rotateX(Math.PI);
  return crown;
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

const doc = new Document();
const buffer = doc.createBuffer("dava-original-dentition");
const scene = doc.createScene("Dava dentition");
const enamel = doc.createMaterial("enamel_ivory").setBaseColorFactor([1, 1, 1, 1]).setMetallicFactor(0).setRoughnessFactor(.22);
const gingiva = doc.createMaterial("gingiva_rose").setBaseColorFactor([1, 1, 1, 1]).setMetallicFactor(0).setRoughnessFactor(.50);
const dentin = doc.createMaterial("root_dentin").setBaseColorFactor([1, 1, 1, 1]).setMetallicFactor(0).setRoughnessFactor(.22);
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
const { crown: heroCrown, roots: heroRoots } = makeHeroMolar(specifications.L[5], { resolution: 96 });
writeMesh("hero_molar_crown", heroCrown, enamel, hero);
writeMesh("hero_molar_roots", heroRoots, dentin, hero);
hero.setExtras({ standalone: true, visibleInMouth: false, axis: "crown +Y; roots -Y", originalGeometry: true, slot: "tooth_L_M1_R", crownRotationX: 0 });

doc.getRoot().setExtras({ authoring: "Original procedural model for Dava Dental Care", generator: "scripts/generate-dental-model.mjs", anterior: "+Z", vertical: "+Y", toothCount: 28, heroSlot: "tooth_L_M1_R", heroCrownRotationX: 0, meshVertices: totalVertices, triangles: totalTriangles, mouthBounds: { min: mouthBounds.min.toArray(), max: mouthBounds.max.toArray() } });
await mkdir(dirname(OUT), { recursive: true });
await new NodeIO().write(OUT, doc);
console.log(JSON.stringify({ output: OUT, vertices: totalVertices, triangles: totalTriangles, mouthSize: mouthBounds.getSize(new THREE.Vector3()).toArray(), mouthCenter: mouthBounds.getCenter(new THREE.Vector3()).toArray(), toothCount: 28, gumNodes: ["gum_upper", "gum_lower"], hero: "hero_molar" }, null, 2));
