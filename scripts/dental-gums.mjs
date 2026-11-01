import * as THREE from "three";

const clamp = THREE.MathUtils.clamp;
const mix = THREE.MathUtils.lerp;
const smooth = THREE.MathUtils.smootherstep;

/** A tooth-fitting collar, tapered gingival walls, and a beveled cutaway base. */
export function makeGum(arch, { teeth, arc, extent }) {
  const upper = arch === "U", sign = upper ? 1 : -1;
  const ordered = [...teeth].sort((a, b) => a.s - b.s);
  const vertices = [], indices = [], colors = [];
  const segments = 320, sides = 80;
  const collarAt = s => {
    let left = ordered[0], right = left, t = 0;
    if (s >= ordered.at(-1).s) left = right = ordered.at(-1);
    else if (s > left.s) {
      const index = ordered.findIndex(tooth => tooth.s >= s);
      left = ordered[index - 1];
      right = ordered[index];
      t = (s - left.s) / (right.s - left.s);
    }
    const blend = smooth(t, 0, 1);
    const neck = mix(left.spec.neck, right.spec.neck, blend);
    const depth = mix(left.spec.d, right.spec.d, blend);
    const posterior = smooth(depth, .36, .62);
    // A narrow papilla enters the embrasure, with a broad parabolic margin
    // over each tooth. Both derivatives vanish at the neighboring centers.
    const papilla = Math.sin(Math.PI * t) ** 4;
    const margin = neck - sign * (.022 + mix(.09, .065, posterior) * papilla);
    let prominence = 0;
    for (const tooth of ordered) {
      const local = (s - tooth.s) / (tooth.spec.w * .34);
      prominence += (tooth.spec.kind === "canine" ? .023 : .013) * Math.exp(-local * local * 2);
    }
    return { margin, collarRadius: depth * .385 + .018, prominence, papilla };
  };

  // The coronal face sits inside the crowns; its raised outer edges form a
  // thin free margin. The long facial/lingual walls taper to a flat section
  // instead of revolving a circular or superelliptic tube around the arch.
  const crossSection = new THREE.CurvePath();
  const bezier = (a, b, c, d) => crossSection.add(new THREE.CubicBezierCurve3(...[a, b, c, d].map(([x, y]) => new THREE.Vector3(x, y, 0))));
  bezier([0, .065], [.25, .065], [.56, 0], [.72, 0]);
  bezier([.72, 0], [.88, 0], [.98, .09], [.98, .20]);
  bezier([.98, .20], [.98, .48], [.87, .81], [.82, .90]);
  bezier([.82, .90], [.78, .972], [.71, 1], [.62, 1]);
  bezier([.62, 1], [.20, 1], [-.20, 1], [-.62, 1]);
  bezier([-.62, 1], [-.71, 1], [-.78, .972], [-.82, .90]);
  bezier([-.82, .90], [-.87, .81], [-.96, .48], [-.96, .20]);
  bezier([-.96, .20], [-.96, .09], [-.88, 0], [-.72, 0]);
  bezier([-.72, 0], [-.56, 0], [-.25, .065], [0, .065]);
  const section = crossSection.getSpacedPoints(sides).slice(0, sides);

  const ringAt = s => {
    const { point, normal, t } = arc.pointAt(s);
    const { margin, collarRadius, prominence, papilla } = collarAt(s);
    const posterior = smooth(Math.abs(t), .35, 1.55);
    const base = sign * mix(upper ? 1.075 : 1.025, upper ? 1.10 : 1.035, posterior);
    const height = sign * (base - margin);
    const capT = clamp((extent - Math.abs(s)) / .18, 0, 1);
    const cap = Math.sqrt(Math.max(0, 1 - (1 - capT) ** 2));
    const centerY = (base + margin) * .5;
    return section.map(({ x: radial, y: depth }) => {
      const outer = smooth(radial, 0, .8);
      // Tooth-centered root eminences fade into the attached gingiva; a slight
      // depression between them avoids a repeated bead-like gum outline.
      const rootRelief = (prominence - .005 * papilla) * Math.sin(Math.PI * clamp(depth, 0, 1)) ** 2 * outer;
      const lateral = (radial * collarRadius / .72 + rootRelief) * cap;
      const y = mix(centerY, margin + sign * depth * height, cap);
      const attached = smooth(depth, .06, .40);
      const apical = smooth(depth, .52, 1);
      const variation = .003 * Math.sin(s * 2.8) * Math.sin(Math.PI * depth);
      // Pale marginal/attached tissue transitions gently to deeper apical pink.
      const red = .70 + .025 * attached - .11 * apical + variation;
      const green = .295 + .022 * attached - .10 * apical + variation;
      const blue = .355 + .018 * attached - .075 * apical + variation;
      return {
        position: [point.x + normal.x * lateral, y, point.z + normal.z * lateral],
        color: [red, green, blue],
      };
    });
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
  const start = addVertex(ringAt(-extent)[0]);
  let previous;
  for (let step = 1; step < segments; step++) {
    const s = -extent * Math.cos(step / segments * Math.PI);
    const ring = ringAt(s).map(addVertex);
    for (let side = 0; side < sides; side++) {
      const next = (side + 1) % sides;
      if (previous) {
        face(previous[side], ring[side], previous[next]);
        face(ring[side], ring[next], previous[next]);
      } else face(start, ring[side], ring[next]);
    }
    previous = ring;
  }
  const end = addVertex(ringAt(extent)[0]);
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
