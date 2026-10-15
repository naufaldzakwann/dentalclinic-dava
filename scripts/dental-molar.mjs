// Original video-referenced lower first molar. X mesiodistal, +Z buccal,
// +Y occlusal. A convex cervical loft and five unequal convex height patches
// share one surface; the branching fissures are recessed geometry, not paint.
import * as THREE from "three";

const clamp = THREE.MathUtils.clamp;
const smooth = THREE.MathUtils.smoothstep;
const mix = THREE.MathUtils.lerp;
const signedPower = (value, exponent) => Math.sign(value) * Math.abs(value) ** exponent;
const smoothMaximum = (a, b, radius) => {
  const t = clamp(.5 + .5 * (a - b) / radius, 0, 1);
  return mix(b, a, t) + radius * t * (1 - t);
};

function segmentDistance(x, z, start, end) {
  const dx = end[0] - start[0], dz = end[1] - start[1];
  const t = clamp(((x - start[0]) * dx + (z - start[1]) * dz) / (dx * dx + dz * dz), 0, 1);
  return Math.hypot(x - start[0] - t * dx, z - start[1] - t * dz);
}

export function makeReferenceMolar(spec = { w: .60, d: .60, h: .42 }) {
  const width = spec.w, depth = spec.d, height = spec.h * .965;
  const angularSegments = 128, sideRings = 58, capRings = 64;
  const vertices = [], indices = [], colors = [];
  const outline = (theta, radius = 1) => {
    let x = signedPower(Math.cos(theta), .87), z = signedPower(Math.sin(theta), .87);
    x *= 1 - .065 * smooth(x, 0, 1);
    z *= 1 - .055 * smooth(x, .15, .9);
    const organic = 1 + .012 * Math.sin(theta * 3 + .4) + .012 * Math.cos(theta * 5 - .2);
    return [x * radius * organic, z * radius * organic];
  };
  const cusps = [
    { x: -.45, z: -.59, height: 1, rx: .34, rz: .36 },
    { x: .34, z: -.62, height: .965, rx: .33, rz: .35 },
    { x: -.47, z: .58, height: .955, rx: .34, rz: .35 },
    { x: .15, z: .63, height: .925, rx: .32, rz: .34 },
    { x: .72, z: .17, height: .865, rx: .31, rz: .34 },
  ];
  const curvedSegments = (paths, divisions) => paths.flatMap(path => {
    const curve = new THREE.CatmullRomCurve3(path.map(([x, z]) => new THREE.Vector3(x, 0, z)), false, "centripetal");
    const points = curve.getPoints(divisions);
    return points.slice(1).map((point, index) => [[points[index].x, points[index].z], [point.x, point.z]]);
  });
  const majorGrooves = curvedSegments([
    [[-.71, -.015], [-.39, .025], [-.18, .065], [.015, -.025], [.26, .035], [.64, -.01]],
    [[-.18, .065], [-.23, .42], [-.25, .81]],
    [[.27, .035], [.52, .35], [.76, .65]],
    [[.015, -.025], [.07, -.43], [.03, -.85]],
  ], 20);
  const minorGrooves = curvedSegments([
    [[-.39, .025], [-.52, -.20], [-.61, -.39]],
    [[.29, .025], [.43, -.20], [.48, -.40]],
    [[-.23, .32], [-.43, .39]], [[.10, .19], [.27, .36]],
  ], 10);
  const grooveDistance = (x, z, segments) => {
    let distance = Infinity;
    for (const segment of segments) distance = Math.min(distance, segmentDistance(x, z, ...segment));
    return distance;
  };
  const occlusalHeight = (x, z) => {
    const baseline = .71;
    let surface = baseline;
    for (const cusp of cusps) {
      const radius = ((x - cusp.x) / cusp.rx) ** 2 + ((z - cusp.z) / cusp.rz) ** 2;
      const patch = baseline + (cusp.height - baseline) * Math.exp(-radius);
      surface = smoothMaximum(surface, patch, .017);
    }
    const major = grooveDistance(x, z, majorGrooves);
    const minor = grooveDistance(x, z, minorGrooves);
    const depthAtBasin = .075 + .025 * Math.exp(-(x * x + z * z) / .28);
    surface -= depthAtBasin * Math.exp(-(major ** 2) / .00145);
    surface -= .018 * Math.exp(-(minor ** 2) / .00045);
    // A shallow irregular fossa rounds the central convergence without turning
    // each cusp into a concave bowl or cutting away its broad convex mass.
    surface -= .014 * Math.exp(-((x + .015) ** 2 / .035 + (z - .005) ** 2 / .025));
    return surface * height;
  };
  const addVertex = (x, y, z) => {
    const vertex = vertices.length / 3;
    vertices.push(x, y, z);
    const cervical = (1 - clamp(y / height, 0, 1)) ** 3;
    const grain = .0013 * Math.sin(x * 133 + y * 91) * Math.sin(z * 127 - y * 59);
    const groove = grooveDistance(x / (width * .5), z / (depth * .5), majorGrooves);
    const cavity = .006 * Math.exp(-(groove ** 2) / .002) * smooth(y, height * .63, height * .85);
    const ivory = .985 - cervical * .018 + grain - cavity;
    colors.push(ivory, ivory - .009 - cervical * .007, ivory - .031 - cervical * .014);
    return vertex;
  };
  const addRing = callback => {
    const ring = [];
    for (let segment = 0; segment < angularSegments; segment++) ring.push(addVertex(...callback(segment / angularSegments * Math.PI * 2)));
    return ring;
  };
  const join = (first, second) => {
    for (let segment = 0; segment < angularSegments; segment++) {
      const next = (segment + 1) % angularSegments;
      indices.push(first[segment], second[segment], first[next], second[segment], second[next], first[next]);
    }
  };
  const endRadius = .91, widestAt = .65;
  const sidePoint = (theta, u) => {
    const radius = u <= widestAt
      ? .66 + .34 * Math.sin(Math.PI * .5 * u / widestAt)
      : 1 - (1 - endRadius) * ((u - widestAt) / (1 - widestAt)) ** 2;
    const [nx, nz] = outline(theta, radius);
    const [endX, endZ] = outline(theta, endRadius);
    const cervical = .009 * Math.cos(2 * theta + .35) + .004 * Math.sin(5 * theta);
    const endHeight = occlusalHeight(endX, endZ);
    const maximumBreadthHeight = .235 * height / .405;
    const physicalHeight = u <= widestAt
      ? mix(cervical, maximumBreadthHeight, u / widestAt)
      : mix(maximumBreadthHeight, endHeight, (u - widestAt) / (1 - widestAt));
    // Only the last short shoulder interval converges to the cap's true slope.
    const y = mix(physicalHeight, occlusalHeight(nx, nz), smooth(u, .85, 1));
    const wallGroove = Math.exp(-((theta - 1.78) ** 2) / .006) + .65 * Math.exp(-((theta - .80) ** 2) / .006) + .8 * Math.exp(-((theta - 4.75) ** 2) / .006);
    const indentation = .006 * wallGroove * smooth(u, .15, .60) * (1 - smooth(u, .80, 1));
    const micro = .00022 * Math.sin(nx * 53 + y * 71) * Math.sin(nz * 59 - y * 47) * Math.sin(Math.PI * u);
    return [nx * width * .5 + Math.cos(theta) * (micro - indentation), y, nz * depth * .5 + Math.sin(theta) * (micro - indentation)];
  };
  let neckRing, previous;
  for (let level = 0; level <= sideRings; level++) {
    const ring = addRing(theta => sidePoint(theta, level / sideRings));
    if (previous) join(previous, ring);
    else neckRing = ring;
    previous = ring;
  }
  for (let level = 1; level < capRings; level++) {
    const radius = endRadius * (1 - level / capRings);
    const ring = addRing(theta => {
      const [x, z] = outline(theta, radius);
      return [x * width * .5, occlusalHeight(x, z), z * depth * .5];
    });
    join(previous, ring);
    previous = ring;
  }
  const center = addVertex(0, occlusalHeight(0, 0), 0), neckCenter = addVertex(0, -.025, 0);
  for (let segment = 0; segment < angularSegments; segment++) {
    const next = (segment + 1) % angularSegments;
    indices.push(previous[segment], center, previous[next], neckRing[segment], neckRing[next], neckCenter);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  const positions = geometry.getAttribute("position"), normals = geometry.getAttribute("normal");
  for (let segment = 0; segment < angularSegments; segment++) {
    const before = (segment - 1 + angularSegments) % angularSegments, next = (segment + 1) % angularSegments;
    const tangent = new THREE.Vector3().fromBufferAttribute(positions, next).sub(new THREE.Vector3().fromBufferAttribute(positions, before));
    const up = new THREE.Vector3().fromBufferAttribute(positions, segment + angularSegments).sub(new THREE.Vector3().fromBufferAttribute(positions, segment));
    const normal = up.cross(tangent).normalize();
    normals.setXYZ(segment, normal.x, normal.y, normal.z);
  }
  geometry.computeBoundingBox();
  return geometry;
}
