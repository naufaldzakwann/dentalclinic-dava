// Original enamel surfaces. +Y is occlusal and +Z is buccal before arch placement.
// A single indexed loft rolls into the chewing surface; there are no separate
// cusp spheres, straight box extrusions, or disconnected caps.
import * as THREE from "three";

const clamp = THREE.MathUtils.clamp;
const mix = THREE.MathUtils.lerp;
const smooth = THREE.MathUtils.smoothstep;
const ANGLES = 80;
const SIDE_RINGS = 32;
const CAP_RINGS = 24;

/** Natural cubic splines also keep curvature continuous under enamel highlights. */
function profileCurve(points) {
  const count = points.length, diagonal = Array(count).fill(1), rhs = Array(count).fill(0);
  const lower = Array(count).fill(0), upper = Array(count).fill(0);
  for (let i = 1; i < count - 1; i++) {
    const before = points[i][0] - points[i - 1][0], after = points[i + 1][0] - points[i][0];
    lower[i] = before;
    diagonal[i] = 2 * (before + after);
    upper[i] = after;
    rhs[i] = 6 * ((points[i + 1][1] - points[i][1]) / after - (points[i][1] - points[i - 1][1]) / before);
  }
  for (let i = 1; i < count; i++) {
    const ratio = lower[i] / diagonal[i - 1];
    diagonal[i] -= ratio * upper[i - 1];
    rhs[i] -= ratio * rhs[i - 1];
  }
  const curvature = Array(count).fill(0);
  for (let i = count - 1; i >= 0; i--) curvature[i] = (rhs[i] - upper[i] * (curvature[i + 1] ?? 0)) / diagonal[i];
  return t => {
    for (let i = 1; i < count; i++) {
      if (t > points[i][0]) continue;
      const [x0, y0] = points[i - 1], [x1, y1] = points[i];
      const span = x1 - x0, a = (x1 - t) / span, b = (t - x0) / span;
      return a * y0 + b * y1 + ((a ** 3 - a) * curvature[i - 1] + (b ** 3 - b) * curvature[i]) * span * span / 6;
    }
    return points.at(-1)[1];
  };
}

export function makeArchCrown(spec, direction = 1) {
  const { w, d, h, kind } = spec;
  const incisor = kind === "incisor", canine = kind === "canine";
  const premolar = kind === "premolar", posterior = !incisor && !canine;
  const vertices = [], colors = [], indices = [];
  // Rounded quadrilateral occlusal outlines retain the broad biting faces of
  // posterior teeth, with softer corners than the old signed-power rectangles.
  const power = incisor ? 2.55 : canine ? 2.25 : premolar ? 2.45 : 2.65;
  const outline = theta => {
    const c = Math.cos(theta), s = Math.sin(theta);
    const radial = (Math.abs(c) ** power + Math.abs(s) ** power) ** (-1 / power);
    const variation = posterior ? 1 + .009 * Math.cos(3 * theta + .35) : 1;
    const x = c * radial * variation;
    const z = s * radial * variation * (1 - (posterior ? .035 : .02) * smooth(x, 0, 1));
    return [x, z];
  };
  const gaussian = (x, z, cx, cz, rx, rz) => Math.exp(-(((x - cx) / rx) ** 2 + ((z - cz) / rz) ** 2));
  const topHeight = (x, z) => {
    if (incisor) {
      // A thin curved cutting edge, gently lowered at its rounded corners.
      return h * (1 - .060 * Math.abs(x) ** 5 - .23 * z * z + .005 * x);
    }
    if (canine) {
      // The long mesial/distal cusp slopes converge on a small rounded tip.
      // A conic distance gives a clear taring silhouette, unlike a wide dome.
      const cuspDistance = Math.sqrt(x * x + .78 * z * z + .045 ** 2) - .045;
      return h - h * .35 * cuspDistance + h * .012 * x;
    }
    if (premolar) {
      const buccal = gaussian(x, z, -.035, .49, .52, .39);
      const lingual = gaussian(x, z, .04, -.46, .50, .40);
      const centralSulcus = .020 * Math.exp(-((z + .025 * Math.sin(x * 5)) ** 2) / .012) * Math.exp(-(x * x) / .5);
      return h * (.78 + .215 * buccal + .18 * lingual - centralSulcus);
    }
    const cusps = gaussian(x, z, -.43, .45, .40, .43)
      + .94 * gaussian(x, z, .43, .44, .39, .41)
      + .96 * gaussian(x, z, -.41, -.45, .41, .42)
      + .87 * gaussian(x, z, .40, -.43, .40, .42);
    const grooveX = x + .032 * Math.sin(z * 4);
    const grooveZ = z - .025 * Math.sin(x * 4);
    const sulci = .013 * Math.exp(-(grooveX ** 2) / .012) * Math.exp(-z * z / .65)
      + .015 * Math.exp(-(grooveZ ** 2) / .012) * Math.exp(-x * x / .65);
    return h * (.765 + .215 * cusps - sulci);
  };
  const widthProfile = incisor
    ? [[0, .70], [.33, .87], [.73, 1], [1, .94]]
    : canine
      ? [[0, .70], [.38, .96], [.61, 1], [1, .68]]
      : [[0, .70], [.30, .91], [.63, 1], [1, .88]];
  const depthProfile = incisor
    ? [[0, .74], [.28, .99], [.58, .81], [1, .20]]
    : canine
      ? [[0, .77], [.35, 1], [.61, .92], [1, .54]]
      : widthProfile;
  const widthAt = profileCurve(widthProfile), depthAt = profileCurve(depthProfile);
  const pointAt = (theta, u, capRadius = 1) => {
    const [ox, oz] = outline(theta);
    const x = ox * widthAt(u) * capRadius;
    const z = oz * depthAt(u) * capRadius;
    const cervical = .007 * Math.cos(theta * 2 + .25);
    const linearHeight = mix(cervical, h * (posterior ? .84 : canine ? .83 : .96), u);
    // During the shoulder roll, y becomes the same function of x/z as the
    // entire cap. The shared ring therefore has a continuous tangent plane.
    const y = mix(linearHeight, topHeight(x, z), THREE.MathUtils.smootherstep(u, .72, 1));
    const labial = incisor || canine ? .008 * Math.sin(Math.PI * u) ** 2 * Math.max(0, oz) : 0;
    return [x * w * .5, y, z * d * .5 + labial];
  };
  const addVertex = point => {
    const index = vertices.length / 3;
    vertices.push(...point);
    const cervical = (1 - clamp(point[1] / h, 0, 1)) ** 3;
    const ivory = .985 - .022 * cervical;
    colors.push(ivory, ivory - .009 - .010 * cervical, ivory - .029 - .020 * cervical);
    return index;
  };
  const ring = callback => Array.from({ length: ANGLES }, (_, i) => addVertex(callback(i * Math.PI * 2 / ANGLES)));
  const join = (first, second) => {
    for (let i = 0; i < ANGLES; i++) {
      const next = (i + 1) % ANGLES;
      indices.push(first[i], second[i], first[next], second[i], second[next], first[next]);
    }
  };
  let previous, neckRing;
  for (let i = 0; i <= SIDE_RINGS; i++) {
    const next = ring(theta => pointAt(theta, i / SIDE_RINGS));
    if (previous) join(previous, next);
    else neckRing = next;
    previous = next;
  }
  for (let i = 1; i < CAP_RINGS; i++) {
    const next = ring(theta => pointAt(theta, 1, 1 - i / CAP_RINGS));
    join(previous, next);
    previous = next;
  }
  const top = addVertex([0, topHeight(0, 0), 0]);
  const neck = addVertex([0, -.015, 0]);
  for (let i = 0; i < ANGLES; i++) {
    const next = (i + 1) % ANGLES;
    indices.push(previous[i], top, previous[next], neckRing[i], neckRing[next], neck);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  // Remove the influence of the hidden cervical closure on the enamel normals.
  const positions = geometry.getAttribute("position"), normals = geometry.getAttribute("normal");
  for (let i = 0; i < ANGLES; i++) {
    const before = (i + ANGLES - 1) % ANGLES, after = (i + 1) % ANGLES;
    const tangent = new THREE.Vector3().fromBufferAttribute(positions, after).sub(new THREE.Vector3().fromBufferAttribute(positions, before));
    const up = new THREE.Vector3().fromBufferAttribute(positions, i + ANGLES).sub(new THREE.Vector3().fromBufferAttribute(positions, i));
    const normal = up.cross(tangent).normalize();
    normals.setXYZ(i, normal.x, normal.y, normal.z);
  }
  if (direction < 0) geometry.rotateX(Math.PI);
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  geometry.userData = { originalGeometry: true, kind, surface: "Continuous rounded shoulder loft", cusp: canine ? "Single conic cusp with softened apex" : undefined };
  return geometry;
}
