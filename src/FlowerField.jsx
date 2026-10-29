import { useMemo } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const FLOWER_CELLS = [
  [0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],
  [0,1],[1,1],[2,1],[3,1],[4,1],[5,1],[6,1],[7,1],
  [0,2],[1,2],[2,2],[3,2],[4,2],[5,2],[6,2],[7,2],
  [0,3],[1,3],[2,3],[3,3],[4,3],[5,3],[6,3],[7,3],
  [5,4],[6,4],
];

// Green plant clumps from rows 4-5 of the 8 x 8 atlas.
const LEAF_CELLS = [
  [0,4],[1,4],[2,4],[3,4],[4,4],[7,4],
  [0,5],[1,5],[2,5],[3,5],[4,5],[5,5],[6,5],[7,5],
];

const VERTEX_SHADER = /* glsl */ `
  attribute vec2 aCell;
  attribute float aSize;
  attribute float aRotation;
  varying vec2 vCell;
  varying float vRotation;
  varying float vDepth;
  uniform vec2 uResolution;
  uniform float uFov;

  void main() {
    vCell = aCell;
    vRotation = aRotation;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vDepth = -mvPosition.z;
    gl_Position = projectionMatrix * mvPosition;
    float focalPixels = uResolution.y / (2.0 * tan(radians(uFov) * 0.5));
    gl_PointSize = clamp(aSize * focalPixels / max(vDepth, 0.5), 1.0, 120.0);
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  uniform sampler2D uAtlas;
  varying vec2 vCell;
  varying float vRotation;
  varying float vDepth;

  void main() {
    vec2 p = gl_PointCoord - 0.5;
    float c = cos(vRotation);
    float s = sin(vRotation);
    p = mat2(c, -s, s, c) * p + 0.5;

    if (p.x < 0.0 || p.x > 1.0 || p.y < 0.0 || p.y > 1.0) discard;

    // Atlas is an 8 x 8 grid. The image's first row is at the top.
    vec2 uv = vec2(
      (vCell.x + p.x) / 8.0,
      (7.0 - vCell.y + p.y) / 8.0
    );

    vec4 texel = texture2D(uAtlas, uv);
    if (texel.a < 0.12) discard;

    // Fade distant sprites into the dark atmosphere.
    float distanceFade = 1.0 - smoothstep(13.0, 25.0, vDepth);
    texel.rgb *= mix(0.24, 1.0, distanceFade);
    texel.a *= distanceFade;
    gl_FragColor = texel;
  }
`;

function seeded(seed) {
  const v = Math.sin(seed * 127.1 + 311.7) * 43758.5453123;
  return v - Math.floor(v);
}

function terrainHeight(x, z) {
  // A shallow valley with uneven ridges; no visible flat ground plane.
  const sideRidge = Math.pow(Math.abs(x) / 12, 1.7) * 0.95;
  const rolling = Math.sin(z * 0.47 + x * 0.28) * 0.16
    + Math.sin(x * 0.72 - z * 0.31) * 0.11
    + (seeded(Math.floor((x + 20) * 13 + (z + 30) * 7)) - 0.5) * 0.12;
  return -0.85 + sideRidge + rolling;
}

const CLUSTERS = [
  [-8.0, 1.0], [-5.2, -3.0], [-1.5, -6.0], [3.0, -4.0],
  [7.5, -1.0], [9.0, -7.0], [-9.0, -9.0], [-3.5, -12.0],
  [2.0, -14.0], [7.0, -12.0], [0.0, 0.0], [4.0, 2.0],
];

function samplePosition(seed, spreadX, spreadZ) {
  const center = CLUSTERS[Math.floor(seeded(seed * 2.1) * CLUSTERS.length)];
  // Averaging random values creates soft clumps instead of a uniform grid.
  const nx = seeded(seed * 3.7) + seeded(seed * 5.3) + seeded(seed * 7.9) - 1.5;
  const nz = seeded(seed * 11.3) + seeded(seed * 13.7) + seeded(seed * 17.1) - 1.5;
  let x = center[0] + nx * spreadX;
  let z = center[1] + nz * spreadZ;
  // Keep most vegetation in the valley's visible footprint.
  x = THREE.MathUtils.clamp(x, -12.5, 12.5);
  z = THREE.MathUtils.clamp(z, -19.0, 3.0);
  return { x, z, y: terrainHeight(x, z) };
}

function makePlantGeometry({ count, cells, kind }) {
  const positions = new Float32Array(count * 3);
  const cellData = new Float32Array(count * 2);
  const sizes = new Float32Array(count);
  const rotations = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const seed = i + (kind === 'leaf' ? 1000 : 9000);
    const p = samplePosition(seed, kind === 'leaf' ? 3.4 : 2.9, kind === 'leaf' ? 2.8 : 2.3);

    // Flowers rise slightly above the foliage; their sprites include stems.
    const heightOffset = kind === 'leaf'
      ? 0.16 + seeded(seed * 19.1) * 0.12
      : 0.27 + seeded(seed * 23.9) * 0.18;

    positions[i * 3] = p.x;
    positions[i * 3 + 1] = p.y + heightOffset;
    positions[i * 3 + 2] = p.z;

    // Randomly select a real cell from the supplied sprite atlas.
    const cell = cells[Math.floor(seeded(seed * 29.3) * cells.length)];
    cellData[i * 2] = cell[0];
    cellData[i * 2 + 1] = cell[1];

    const scaleRandom = seeded(seed * 31.7);
    sizes[i] = kind === 'leaf'
      ? 0.38 + scaleRandom * 0.48
      : 0.42 + scaleRandom * 0.58;
    rotations[i] = (seeded(seed * 37.1) - 0.5) * 1.5;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('aCell', new THREE.BufferAttribute(cellData, 2));
  geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
  geometry.setAttribute('aRotation', new THREE.BufferAttribute(rotations, 1));
  geometry.computeBoundingSphere();
  return geometry;
}

function AtlasPoints({ atlas, count, cells, kind }) {
  const { size, gl } = useThree();
  const geometry = useMemo(
    () => makePlantGeometry({ count, cells, kind }),
    [count, cells, kind]
  );

  const material = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      uAtlas: { value: atlas },
      uResolution: { value: new THREE.Vector2(size.width * gl.getPixelRatio(), size.height * gl.getPixelRatio()) },
      uFov: { value: 48 },
    },
    vertexShader: VERTEX_SHADER,
    fragmentShader: FRAGMENT_SHADER,
    transparent: true,
    depthTest: true,
    depthWrite: false,
  }), [atlas]);

  useFrame(({ camera, size: currentSize, gl: renderer }) => {
    material.uniforms.uResolution.value.set(
      currentSize.width * renderer.getPixelRatio(),
      currentSize.height * renderer.getPixelRatio()
    );
    material.uniforms.uFov.value = camera.fov ?? 48;
  });

  return <points geometry={geometry} material={material} frustumCulled={false} />;
}

function Scene() {
  const atlas = useLoader(THREE.TextureLoader, '/valley/flowers/pool_summer.png');
  atlas.colorSpace = THREE.SRGBColorSpace;
  atlas.generateMipmaps = true;
  atlas.minFilter = THREE.LinearMipmapLinearFilter;
  atlas.magFilter = THREE.LinearFilter;

  return (
    <>
      <color attach="background" args={['#030303']} />
      <fog attach="fog" args={['#030303', 5, 24]} />
      <ambientLight intensity={0.4} />
      <hemisphereLight args={['#c6d0bd', '#10130c', 0.65]} />
      <directionalLight position={[-4, 6, 3]} intensity={0.65} color="#ffe1c5" />

      {/* Green foliage first, flowers layered just above it. */}
      <AtlasPoints atlas={atlas} count={15000} cells={LEAF_CELLS} kind="leaf" />
      <AtlasPoints atlas={atlas} count={4200} cells={FLOWER_CELLS} kind="flower" />
    </>
  );
}

export default function FlowerField() {
  return (
    <Canvas
      camera={{ position: [0, 1.35, 7.5], fov: 48, near: 0.1, far: 80 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: false }}
      onCreated={({ camera }) => camera.lookAt(0, 0.6, -5)}
    >
      <Scene />
    </Canvas>
  );
}
