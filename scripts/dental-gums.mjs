import * as THREE from "three";

const clamp = THREE.MathUtils.clamp;
const mix = THREE.MathUtils.lerp;
const smooth = THREE.MathUtils.smootherstep;

/** Continuous cervical scallops on a softly rounded, closed gingival arch. */
export function makeGum(arch, { teeth, arc, extent }) {
  const upper = arch === "U", sign = upper ? 1 : -1;
  const ordered = [...teeth].sort((a, b) => a.s - b.s);
  const vertices = [], indices = [], colors = [];
  const segments = 256, sides = 64;
  const marginAt = s => {
    const first = ordered[0], last = ordered.at(-1);
    if (s <= first.s) return first.spec.neck - sign * .04;
    if (s >= last.s) return last.spec.neck - sign * .04;
    for (let index = 1; index < ordered.length; index++) {
      const left = ordered[index - 1], right = ordered[index];
      if (s > right.s) continue;
      const t = (s - left.s) / (right.s - left.s);
      const neck = mix(left.spec.neck, right.spec.neck, smooth(t, 0, 1));
      // Interdental papillae blend through both neighboring collars. There is
      // no nearest-tooth switch to introduce a ridge in the gum silhouette.
      return neck - sign * (.04 + .046 * Math.sin(Math.PI * t) ** 2);
    }
  };
  const pointAt = (s, theta) => {
    const { point, normal, t } = arc.pointAt(s);
    const capT = clamp((extent - Math.abs(s)) / .24, 0, 1);
    const cap = Math.sqrt(Math.max(0, 1 - (1 - capT) ** 2));
    const posterior = smooth(Math.abs(t), .35, 1.55);
    const margin = marginAt(s);
    const base = sign * mix(upper ? 1.12 : 1.07, upper ? 1.11 : 1.06, posterior);
    const center = (base + margin) * .5;
    const halfHeight = Math.abs(base - margin) * .5;
    // Polar superellipse avoids the sharply sampled corners of signed-power
    // rings while retaining a broad collar and gently flattened attached base.
    const cosine = Math.cos(theta), sine = Math.sin(theta);
    const radius = (Math.abs(cosine) ** 2.65 + Math.abs(sine) ** 2.65) ** (-1 / 2.65);
    const vertical = sine * radius;
    const collar = smooth(-vertical, -.25, .9);
    const breadth = mix(mix(.24, .33, posterior), mix(.218, .315, posterior), collar);
    const lateral = cosine * radius * breadth * cap;
    return {
      position: [point.x + normal.x * lateral, center + sign * vertical * halfHeight * cap, point.z + normal.z * lateral],
      color: [.70 + collar * .045, .278 + collar * .035, .357 + collar * .04],
    };
  };
  const addVertex = ({ position, color }) => {
    const index = vertices.length / 3;
    vertices.push(...position);
    colors.push(...color);
    return index;
  };
  const face = (a, b, c) => {
    if (upper) indices.push(a, b, c);
    else indices.push(a, c, b);
  };
  const start = addVertex(pointAt(-extent, 0));
  let previous;
  for (let step = 1; step < segments; step++) {
    // Cosine sampling concentrates rings near the rounded terminal poles.
    const s = -extent * Math.cos(step / segments * Math.PI);
    const ring = Array.from({ length: sides }, (_, side) => addVertex(pointAt(s, side / sides * Math.PI * 2)));
    for (let side = 0; side < sides; side++) {
      const next = (side + 1) % sides;
      if (previous) {
        face(previous[side], ring[side], previous[next]);
        face(ring[side], ring[next], previous[next]);
      } else face(start, ring[side], ring[next]);
    }
    previous = ring;
  }
  const end = addVertex(pointAt(extent, 0));
  for (let side = 0; side < sides; side++) face(previous[side], end, previous[(side + 1) % sides]);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  return geometry;
}
