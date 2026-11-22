import * as T from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

/** Original procedural geometry, built from the supplied visual reference. Units are metres. */
export function createHeritageModel() {
  const batches = new Map<T.Material, T.BufferGeometry[]>();
  const textures: T.Texture[] = [];
  const stoneTexture = (bump: boolean) => {
    const size = 512, bytes = new Uint8Array(size * size * 4);
    let seed = 8147;
    const hash = (x: number, y: number) => {
      let n = Math.imul(x, 374761393) ^ Math.imul(y, 668265263) ^ 8147;
      n = Math.imul(n ^ (n >>> 13), 1274126177);
      return ((n ^ (n >>> 16)) >>> 0) / 4294967296;
    };
    const noise = (x: number, y: number) => {
      const ix = Math.floor(x), iy = Math.floor(y), fx = x - ix, fy = y - iy;
      const u = fx * fx * (3 - 2 * fx), v = fy * fy * (3 - 2 * fy);
      return T.MathUtils.lerp(T.MathUtils.lerp(hash(ix, iy), hash(ix + 1, iy), u), T.MathUtils.lerp(hash(ix, iy + 1), hash(ix + 1, iy + 1), u), v) - .5;
    };
    for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      const grain = seed / 4294967296;
      const mineral = noise(x / 36, y / 36) * .55 + noise(x / 11, y / 11) * .3 + noise(x / 3, y / 3) * .15;
      const value = bump ? 140 + (grain - .5) * 70 + mineral * 90 : 222 + (grain - .5) * 20 + mineral * 70;
      const i = (y * size + x) * 4;
      bytes[i] = value; bytes[i + 1] = bump ? value : value * .96; bytes[i + 2] = bump ? value : value * .89; bytes[i + 3] = 255;
    }
    const texture = new T.DataTexture(bytes, size, size, T.RGBAFormat);
    texture.wrapS = texture.wrapT = T.RepeatWrapping;
    texture.repeat.set(2, 2); texture.magFilter = T.LinearFilter;
    texture.minFilter = T.LinearMipmapLinearFilter; texture.generateMipmaps = true;
    texture.colorSpace = bump ? T.NoColorSpace : T.SRGBColorSpace;
    texture.needsUpdate = true; textures.push(texture); return texture;
  };
  const map = stoneTexture(false), bumpMap = stoneTexture(true);
  const stone = (color: string, roughness = .84) => new T.MeshStandardMaterial({ color, map, bumpMap, bumpScale: .027, roughness });
  const sandstone = stone('#c28d61'), pale = stone('#d5a273'), carved = stone('#b37d51'), base = stone('#a7744c');
  const brass = new T.MeshStandardMaterial({ color: '#b78a43', metalness: .86, roughness: .27, bumpMap, bumpScale: .003 });
  const darkBrass = new T.MeshStandardMaterial({ color: '#80602c', metalness: .78, roughness: .34 });
  const materials = [sandstone, pale, carved, base, brass, darkBrass];
  const matrix = new T.Matrix4(), q = new T.Quaternion();
  function add(g: T.BufferGeometry, m: T.Material, p: [number, number, number] = [0, 0, 0], r: [number, number, number] = [0, 0, 0], scale: [number, number, number] = [1, 1, 1]) {
    q.setFromEuler(new T.Euler(...r)); matrix.compose(new T.Vector3(...p), q, new T.Vector3(...scale));
    g.applyMatrix4(matrix);
    // All merged geometry uses this common attribute layout.
    for (const name of Object.keys(g.attributes)) if (!['position', 'normal', 'uv'].includes(name)) g.deleteAttribute(name);
    const flat = g.index ? g.toNonIndexed() : g;
    if (flat !== g) g.dispose();
    if (!flat.hasAttribute('uv')) flat.setAttribute('uv', new T.BufferAttribute(new Float32Array(flat.getAttribute('position').count * 2), 2));
    const list = batches.get(m) || []; list.push(flat); batches.set(m, list);
  }
  function box(w: number, h: number, d: number, p: [number, number, number], m = sandstone, bevel = .018) {
    add(new RoundedBoxGeometry(w, h, d, 2, Math.min(bevel, h / 3, d / 3)), m, p);
  }
  function lathe(profile: number[][], p: [number, number, number], m = sandstone, segments = 40) {
    add(new T.LatheGeometry(profile.map(v => new T.Vector2(v[0], v[1])), segments), m, p);
  }
  function ring(radius: number, tube: number, p: [number, number, number], m = brass) {
    add(new T.TorusGeometry(radius, tube, 6, 64), m, p, [Math.PI / 2, 0, 0]);
  }
  function tube(points: T.Vector3[], radius: number, m: T.Material, closed = false) {
    add(new T.TubeGeometry(new T.CatmullRomCurve3(points, closed), points.length * 3, radius, 5, closed), m);
  }

  // The outline follows a real open, cusped arch: six lobes and a pointed crown.
  function arch(width: number, height: number, spring: number) {
    const p = new T.Path();
    const sy = (n: number) => spring + n * (height - spring);
    p.moveTo(-width, 0); p.lineTo(-width, spring);
    p.bezierCurveTo(-width * 1.03, sy(.12), -width * .86, sy(.24), -width * .74, sy(.21));
    p.bezierCurveTo(-width * .81, sy(.39), -width * .60, sy(.50), -width * .47, sy(.46));
    p.bezierCurveTo(-width * .53, sy(.65), -width * .29, sy(.83), -width * .20, sy(.81));
    p.bezierCurveTo(-width * .12, sy(.84), -width * .035, sy(.90), 0, height);
    p.bezierCurveTo(width * .035, sy(.90), width * .12, sy(.84), width * .20, sy(.81));
    p.bezierCurveTo(width * .29, sy(.83), width * .53, sy(.65), width * .47, sy(.46));
    p.bezierCurveTo(width * .60, sy(.50), width * .81, sy(.39), width * .74, sy(.21));
    p.bezierCurveTo(width * .86, sy(.24), width * 1.03, sy(.12), width, spring);
    p.lineTo(width, 0); return p.getPoints(9);
  }
  function extrude(shape: T.Shape, depth: number, bevel = .008) {
    return new T.ExtrudeGeometry(shape, { depth, steps: 1, bevelEnabled: true, bevelSegments: 2, bevelSize: bevel, bevelThickness: bevel, curveSegments: 8 });
  }
  function archivolt(outer: T.Vector2[], inner: T.Vector2[], depth: number, z: number, m: T.Material) {
    const shape = new T.Shape([...outer, ...inner.slice().reverse()]); shape.closePath();
    add(extrude(shape, depth), m, [0, .38, z]);
  }
  function flowerHole(x: number, y: number, radius: number) {
    const p = new T.Path();
    for (let j = 0; j < 32; j++) {
      const a = j / 32 * Math.PI * 2, r = radius * (j % 4 === 0 ? .72 : j % 2 ? .88 : 1);
      const px = x + Math.cos(a) * r, py = y + Math.sin(a) * r;
      if (j === 0) p.moveTo(px, py); else p.lineTo(px, py);
    }
    p.closePath(); return p;
  }
  function rosette(x: number, y: number, z: number, radius = .105) {
    add(new T.SphereGeometry(radius * .25, 10, 6), carved, [x, y, z], [0, 0, 0], [1, 1, .5]);
    for (let i = 0; i < 10; i++) {
      const a = i * Math.PI / 5;
      add(new T.SphereGeometry(1, 8, 6), pale, [x + Math.sin(a) * radius * .6, y + Math.cos(a) * radius * .6, z], [0, 0, -a], [radius * .22, radius * .48, .019]);
    }
  }

  // Wide, fully volumetric plinth, bevelled mouldings and inset floor tiles.
  box(3.64, .13, 2.96, [0, .065, 0], base);
  box(3.52, .10, 2.84, [0, .18, 0], carved);
  box(3.40, .10, 2.72, [0, .28, 0], sandstone);
  box(3.48, .055, 2.80, [0, .355, 0], pale);
  for (let x = -2; x <= 2; x++) for (let z = -2; z <= 2; z++)
    box(.53, .025, .44, [x * .54, .394, z * .45], (x + z) % 2 ? sandstone : pale, .004);
  // Masonry corner piers, with real courses and fine mortar joints.
  for (const x of [-1.28, 1.28]) for (const z of [-.99, .99]) {
    for (let course = 0; course < 8; course++) box(.37, .302, .38, [x, .55 + course * .307, z], course % 3 === 0 ? carved : sandstone, .009);
    box(.43, .08, .44, [x, 2.91, z], pale);
  }

  // Both principal elevations have true openings. Nested rings make the depth readable.
  for (const side of [-1, 1]) {
    for (let layer = 0; layer < 4; layer++) {
      const w = 1.04 - layer * .095, h = 2.48 - layer * .125, spring = 1.31 - layer * .025;
      const z = side === 1 ? 1.015 - layer * .065 : -1.13 + layer * .065;
      archivolt(arch(w, h, spring), arch(w - .083, h - .105, spring - .02), .105, z, layer % 2 ? carved : pale);
    }
    // Pierced floral stonework fills the spandrels, not the arch opening.
    const opening = arch(1.055, 2.51, 1.32);
    const spandrel = new T.Shape([new T.Vector2(-1.47, 0), new T.Vector2(-1.47, 2.59), new T.Vector2(1.47, 2.59), new T.Vector2(1.47, 0), ...opening.slice().reverse()]);
    spandrel.closePath();
    const inside = (x: number, y: number) => {
      let hit = false;
      for (let i = 0, j = opening.length - 1; i < opening.length; j = i++) {
        const a = opening[i], b = opening[j];
        if ((a.y > y) !== (b.y > y) && x < (b.x - a.x) * (y - a.y) / (b.y - a.y) + a.x) hit = !hit;
      }
      return hit;
    };
    for (let y = 1.47; y < 2.49; y += .155) for (let x = -1.35; x < 1.4; x += .155) {
      const safe = Array.from({ length: 12 }, (_, i) => !inside(x + Math.cos(i * Math.PI / 6) * .095, y + Math.sin(i * Math.PI / 6) * .095)).every(Boolean);
      if (safe) spandrel.holes.push(flowerHole(x, y, .073));
    }
    add(extrude(spandrel, .12, .005), sandstone, [0, .38, side === 1 ? .91 : -1.03]);
    for (const x of [-1.22, 1.22]) {
      box(.34, .34, .07, [x, 2.73, side * 1.10], carved);
      box(.29, .29, .065, [x, 2.73, side * 1.14], pale);
      if (side === 1) rosette(x, 2.73, 1.185, .12);
    }
    // Engraved cornice frieze, restrained gold inlay under the stone eaves.
    box(2.95, .105, .09, [0, 2.99, side * 1.02], darkBrass, .007);
    for (let x = -1.36; x <= 1.37; x += .14) {
      const points = Array.from({ length: 16 }, (_, i) => new T.Vector3(x + Math.cos(i * Math.PI / 8) * .06, 2.99 + Math.sin(i * Math.PI / 8) * .032, side * 1.075));
      tube(points, .007, brass, true);
    }
  }

  // Side screens: perforated scalloped jali windows with thick stone surrounds.
  for (const side of [-1, 1]) {
    const outline = arch(.68, 2.13, 1.24);
    const window = new T.Shape(outline); window.closePath();
    for (let y = .15; y < 1.88; y += .17) for (let x = -.52; x <= .53; x += .17) {
      const limit = y < 1.24 ? .58 : .58 * Math.sqrt(Math.max(0, 1 - ((y - 1.24) / .75) ** 2));
      if (Math.abs(x) + .08 < limit) window.holes.push(flowerHole(x, y, .078));
    }
    add(extrude(window, .075, .005), carved, [side * 1.29, .52, 0], [0, side * Math.PI / 2, 0]);
    const surround = new T.Shape([new T.Vector2(-.99, 0), new T.Vector2(-.99, 2.38), new T.Vector2(.99, 2.38), new T.Vector2(.99, 0), ...outline.slice().reverse()]); surround.closePath();
    add(extrude(surround, .18), sandstone, [side * 1.22, .52, 0], [0, side * Math.PI / 2, 0]);
    const frame = new T.Shape([...arch(.75, 2.23, 1.25), ...arch(.68, 2.13, 1.24).reverse()]); frame.closePath();
    add(extrude(frame, .055), pale, [side * 1.43, .52, 0], [0, side * Math.PI / 2, 0]);
    box(.28, .15, 2.0, [side * 1.30, .47, 0], carved);
  }

  // Short cylindrical pillars echo the reference, with lotus capitals and decorated pedestals.
  for (const x of [-1.08, 1.08]) for (const z of [-1.10, 1.10]) {
    box(.43, .22, .41, [x, .50, z], pale);
    if (z > 0) {
      box(.33, .15, .02, [x, .50, z + .213], carved, .005);
      rosette(x, .50, z + .23, .065);
    }
    lathe([[0, 0], [.20, 0], [.20, .035], [.16, .06], [.17, .10], [.19, .18], [.15, .24], [.14, .26], [.13, .85], [.14, .91], [.18, .94], [.19, .98], [.15, 1.03], [.21, 1.20], [.23, 1.23], [0, 1.23]], [x, .61, z], pale);
    for (const y of [.85, 1.55, 1.61]) ring(y === .85 ? .153 : .165, .018, [x, y, z], carved);
    for (let i = 0; i < 12; i++) {
      const a = i * Math.PI / 6;
      for (const y of [.75, 1.73]) {
        add(new T.SphereGeometry(1, 8, 6), pale, [x + Math.cos(a) * .168, y, z + Math.sin(a) * .168], [0, -a, .1], [.024, .086, .042]);
      }
    }
    box(.44, .065, .43, [x, 1.87, z], pale);
  }

  // Projecting chhajja and carved corbels on all four corners.
  box(3.12, .12, 2.50, [0, 3.08, 0], carved);
  box(3.48, .09, 2.83, [0, 3.18, 0], pale);
  box(3.57, .042, 2.92, [0, 3.245, 0], sandstone);
  const corbel = new T.Shape();
  corbel.moveTo(0, 0); corbel.bezierCurveTo(.02, .18, .21, .12, .18, .30); corbel.bezierCurveTo(.16, .38, .32, .33, .35, .48); corbel.lineTo(0, .48); corbel.closePath();
  for (const x of [-1.31, 1.31]) for (const z of [-1.03, 1.03]) {
    add(extrude(corbel, .16, .015), pale, [x, 2.64, z - .08], [0, x > 0 ? 0 : Math.PI, 0]);
    add(extrude(corbel, .16, .015), pale, [x - .08, 2.64, z], [0, z > 0 ? -Math.PI / 2 : Math.PI / 2, 0]);
  }

  // Broad, flattened brass dome. Lathed curvature and fine meridional seams.
  lathe([[0, 0], [.89, 0], [.91, .035], [.91, .17], [.93, .19], [.93, .22], [0, .22]], [0, 3.28, 0], darkBrass, 80);
  for (const y of [3.30, 3.47, 3.50]) ring(.92, .018, [0, y, 0]);
  for (let i = 0; i < 48; i++) {
    const angle = i / 48 * Math.PI * 2;
    const points = Array.from({ length: 16 }, (_, j) => {
      const a = j / 16 * Math.PI * 2, theta = angle + Math.cos(a) * .045;
      return new T.Vector3(Math.sin(theta) * .925, 3.385 + Math.sin(a) * .063, Math.cos(theta) * .925);
    });
    tube(points, .009, brass, true);
  }
  const domePoints: number[][] = [];
  for (let i = 0; i <= 32; i++) {
    const t = i / 32 * Math.PI / 2;
    domePoints.push([.92 * Math.cos(t), .65 * Math.sin(t)]);
  }
  lathe(domePoints, [0, 3.50, 0], brass, 80);
  for (let i = 0; i < 20; i++) {
    const a = i / 20 * Math.PI * 2;
    const points = domePoints.map(([r, y]) => new T.Vector3(Math.sin(a) * (r + .003), 3.50 + y, Math.cos(a) * (r + .003)));
    tube(points, .006, darkBrass);
  }
  function finial(x: number, y: number, z: number, scale: number) {
    const profile = [[0, 0], [.16, 0], [.16, .025], [.09, .055], [.065, .10], [.075, .13], [.11, .17], [.115, .22], [.08, .27], [.04, .29], [.055, .32], [.025, .35], [.035, .39], [0, .48]];
    lathe(profile.map(([r, h]) => [r * scale, h * scale]), [x, y, z], brass, 32);
  }
  ring(.19, .018, [0, 4.13, 0]); finial(0, 4.14, 0, 1);
  for (const x of [-1.36, 1.36]) for (const z of [-1.09, 1.09]) {
    box(.26, .12, .26, [x, 3.32, z], carved);
    box(.29, .035, .29, [x, 3.395, z], pale);
    finial(x, 3.42, z, .52);
  }

  const group = new T.Group(); group.name = 'Sandstone and brass heritage pavilion';
  for (const [material, geometries] of batches) {
    const merged = mergeGeometries(geometries);
    geometries.forEach(g => g.dispose());
    if (!merged) throw new Error('Unable to build heritage geometry');
    merged.computeBoundingSphere();
    const mesh = new T.Mesh(merged, material); mesh.castShadow = true; mesh.receiveShadow = true; group.add(mesh);
  }
  return { group, dispose() { group.children.forEach(child => (child as T.Mesh).geometry.dispose()); materials.forEach(m => m.dispose()); textures.forEach(t => t.dispose()); } };
}
