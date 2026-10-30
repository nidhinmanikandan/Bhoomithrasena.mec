import { useEffect, useRef } from "react";
import * as THREE from "three";

const PARTICLE_DENSITY = 100000;
const PARTICLE_SIZE = 1.3;
const PARTICLE_DEPTH = 1.25;
const PARTICLE_MOTION = 0.55;
const MIN_PARTICLE_COUNT = 25000;
const MAX_SAMPLE_DIMENSION = 1024;
const IMAGE_FIT_FRACTION = 0.75;

function makeParticles(image) {
  const detailCanvas = document.createElement("canvas");
  detailCanvas.width = 64;
  detailCanvas.height = 64;
  const detailContext = detailCanvas.getContext("2d", {
    willReadFrequently: true,
  });
  if (!detailContext) {
    throw new Error("Unable to create a canvas context for the particle image.");
  }
  detailContext.drawImage(image, 0, 0, 64, 64);
  const detailPixels = detailContext.getImageData(0, 0, 64, 64).data;
  let edgePixels = 0;
  let opaquePixels = 0;

  for (let y = 0; y < 64; y++) {
    for (let x = 0; x < 64; x++) {
      const index = (y * 64 + x) * 4;
      if (detailPixels[index + 3] < 20) continue;

      opaquePixels++;
      const luminance =
        (detailPixels[index] * 0.2126 +
          detailPixels[index + 1] * 0.7152 +
          detailPixels[index + 2] * 0.0722) /
        255;
      let difference = 0;

      for (const neighbor of [x < 63 ? index + 4 : -1, y < 63 ? index + 256 : -1]) {
        if (neighbor < 0) continue;
        const neighborLuminance =
          (detailPixels[neighbor] * 0.2126 +
            detailPixels[neighbor + 1] * 0.7152 +
            detailPixels[neighbor + 2] * 0.0722) /
          255;
        difference = Math.max(
          difference,
          Math.abs(luminance - neighborLuminance),
          Math.abs(detailPixels[index] - detailPixels[neighbor]) / 255,
          Math.abs(detailPixels[index + 1] - detailPixels[neighbor + 1]) / 255,
          Math.abs(detailPixels[index + 2] - detailPixels[neighbor + 2]) / 255,
          Math.abs(detailPixels[index + 3] - detailPixels[neighbor + 3]) / 255
        );
      }

      if (difference > 0.06) edgePixels++;
    }
  }

  const detailScore =
    opaquePixels > 0 ? Math.min(1, (edgePixels / opaquePixels) * 4) : 0;
  const resolutionFactor = THREE.MathUtils.clamp(
    Math.sqrt((image.naturalWidth * image.naturalHeight) / (512 * 512)),
    0.5,
    1.5
  );
  const particleCount = THREE.MathUtils.clamp(
    Math.floor(
      PARTICLE_DENSITY * resolutionFactor * (0.75 + detailScore * 0.75)
    ),
    Math.min(MIN_PARTICLE_COUNT, PARTICLE_DENSITY),
    PARTICLE_DENSITY
  );
  const canvas = document.createElement("canvas");
  const aspect = image.naturalWidth / image.naturalHeight;
  const sampleDimension = Math.min(
    MAX_SAMPLE_DIMENSION,
    Math.max(512, Math.ceil(Math.sqrt(particleCount * 8)))
  );
  const imageScale =
    sampleDimension / Math.max(image.naturalWidth, image.naturalHeight);
  canvas.width = Math.max(1, Math.round(image.naturalWidth * imageScale));
  canvas.height = Math.max(1, Math.round(image.naturalHeight * imageScale));

  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) {
    throw new Error("Unable to create a canvas context for particle sampling.");
  }
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
  const columns = Math.max(1, Math.floor(Math.sqrt(particleCount * aspect)));
  const rows = Math.max(1, Math.ceil(particleCount / columns));
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 4);
  let count = 0;
  const linearize = (value) =>
    value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;

  for (let sample = 0; sample < particleCount; sample++) {
    const column = sample % columns;
    const row = Math.floor(sample / columns);
    const sampleX = Math.min(
      canvas.width - 1,
      (column + 0.15 + Math.random() * 0.7) * (canvas.width / columns)
    );
    const sampleY = Math.min(
      canvas.height - 1,
      (row + 0.15 + Math.random() * 0.7) * (canvas.height / rows)
    );
    const x = Math.min(canvas.width - 1, Math.floor(sampleX));
    const y = Math.min(canvas.height - 1, Math.floor(sampleY));
    const pixelIndex = (y * canvas.width + x) * 4;
    const red = pixels[pixelIndex];
    const green = pixels[pixelIndex + 1];
    const blue = pixels[pixelIndex + 2];
    const alpha = pixels[pixelIndex + 3] / 255;
    if (alpha < 0.08) continue;

    const luminance = (red * 0.2126 + green * 0.7152 + blue * 0.0722) / 255;
    const positionIndex = count * 3;
    const colorIndex = count * 4;
    positions[positionIndex] = (sampleX / canvas.width - 0.5) * aspect;
    positions[positionIndex + 1] = -(sampleY / canvas.height - 0.5);
    positions[positionIndex + 2] = (luminance - 0.5) * PARTICLE_DEPTH * 0.18;
    colors[colorIndex] = linearize(red / 255);
    colors[colorIndex + 1] = linearize(green / 255);
    colors[colorIndex + 2] = linearize(blue / 255);
    colors[colorIndex + 3] = alpha;
    count++;
  }

  const movingCount = Math.min(count, Math.max(1, Math.floor(count * 0.03)));
  const movingPositions = new Float32Array(movingCount * 3);
  const movingColors = new Float32Array(movingCount * 4);
  const movingPhases = new Float32Array(movingCount);
  const movingSpeeds = new Float32Array(movingCount);
  const movingAmplitudes = new Float32Array(movingCount * 3);
  const shuffledIndices = Uint32Array.from({ length: count }, (_, index) => index);

  for (let index = 0; index < movingCount; index++) {
    const selected = index + Math.floor(Math.random() * (count - index));
    [shuffledIndices[index], shuffledIndices[selected]] = [
      shuffledIndices[selected],
      shuffledIndices[index],
    ];
    const sourceIndex = shuffledIndices[index];
    movingPositions.set(
      positions.subarray(sourceIndex * 3, sourceIndex * 3 + 3),
      index * 3
    );
    movingColors.set(
      colors.subarray(sourceIndex * 4, sourceIndex * 4 + 4),
      index * 4
    );
    movingPhases[index] = Math.random() * Math.PI * 2;
    movingSpeeds[index] = 0.45 + Math.random() * 1.1;
    movingAmplitudes[index * 3] = 0.018 + Math.random() * 0.042;
    movingAmplitudes[index * 3 + 1] = 0.018 + Math.random() * 0.042;
    movingAmplitudes[index * 3 + 2] = 0.025 + Math.random() * 0.055;
  }

  return {
    positions: positions.subarray(0, count * 3),
    colors: colors.subarray(0, count * 4),
    movingPositions,
    movingColors,
    movingPhases,
    movingSpeeds,
    movingAmplitudes,
    aspect,
  };
}

function getFitScale(camera, aspect, imageAspect) {
  const viewHeight =
    2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.length();
  return Math.min(
    viewHeight * IMAGE_FIT_FRACTION,
    (viewHeight * aspect * IMAGE_FIT_FRACTION) / imageAspect,
    viewHeight * 2
  );
}

function createParticleGeometry(positions, colors) {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 4));
  return geometry;
}

export default function ParticleField() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(43, 1, 0.1, 100);
    camera.position.set(0, 0, 8.8);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.setAttribute("aria-hidden", "true");
    container.appendChild(renderer.domElement);

    const pointer = { x: 0, y: 0 };
    const startTime = performance.now();
    const image = new Image();
    let cloud = null;
    let movingCloud = null;
    let particleData = null;
    let animationFrame = 0;
    let disposed = false;

    const resize = () => {
      const { width, height } = container.getBoundingClientRect();
      if (!width || !height) return;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);

      if (cloud && movingCloud && particleData) {
        const fitScale = getFitScale(
          camera,
          camera.aspect,
          particleData.aspect
        );
        cloud.scale.setScalar(fitScale);
        movingCloud.scale.setScalar(fitScale);
      }
    };

    const onPointerMove = (event) => {
      pointer.x = (event.clientX / window.innerWidth - 0.5) * 2;
      pointer.y = (event.clientY / window.innerHeight - 0.5) * 2;
    };

    const animate = () => {
      animationFrame = window.requestAnimationFrame(animate);
      const elapsed = (performance.now() - startTime) / 1000;

      if (cloud && movingCloud && particleData) {
        const movingAttribute = movingCloud.geometry.attributes.position;
        const positions = movingAttribute.array;
        for (let index = 0; index < particleData.movingPositions.length; index += 3) {
          const particleIndex = index / 3;
          const phase = particleData.movingPhases[particleIndex];
          const speed = particleData.movingSpeeds[particleIndex];
          const originX = particleData.movingPositions[index];
          const originY = particleData.movingPositions[index + 1];
          const originZ = particleData.movingPositions[index + 2];
          const amplitudeX =
            particleData.movingAmplitudes[index] * PARTICLE_MOTION;
          const amplitudeY =
            particleData.movingAmplitudes[index + 1] * PARTICLE_MOTION;
          const amplitudeZ =
            particleData.movingAmplitudes[index + 2] * PARTICLE_MOTION;

          positions[index] =
            originX +
            Math.sin(elapsed * speed + phase) * amplitudeX +
            Math.sin(elapsed * speed * 0.37 + phase * 1.7) * amplitudeX * 0.18;
          positions[index + 1] =
            originY +
            Math.cos(elapsed * speed * 0.83 + phase) * amplitudeY +
            Math.sin(elapsed * speed * 0.29 + phase * 1.3) *
              amplitudeY *
              0.18;
          positions[index + 2] =
            originZ + Math.sin(elapsed * speed * 0.67 + phase * 1.2) * amplitudeZ;
        }
        movingAttribute.needsUpdate = true;
        cloud.rotation.y = movingCloud.rotation.y =
          Math.sin(elapsed * 0.18) * 0.12 + pointer.x * 0.18;
        cloud.rotation.x = movingCloud.rotation.x =
          Math.cos(elapsed * 0.16) * 0.07 - pointer.y * 0.12;
      }

      renderer.render(scene, camera);
    };

    image.onload = () => {
      if (disposed) return;

      particleData = makeParticles(image);
      const geometry = createParticleGeometry(
        particleData.positions,
        particleData.colors
      );
      const material = new THREE.PointsMaterial({
        size: PARTICLE_SIZE,
        vertexColors: true,
        transparent: true,
        opacity: 1,
        sizeAttenuation: false,
        depthWrite: false,
      });
      cloud = new THREE.Points(geometry, material);
      cloud.frustumCulled = false;

      const movingGeometry = createParticleGeometry(
        particleData.movingPositions.slice(),
        particleData.movingColors
      );
      const movingMaterial = new THREE.PointsMaterial({
        size: PARTICLE_SIZE,
        vertexColors: true,
        transparent: true,
        opacity: 0.72,
        sizeAttenuation: false,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      movingCloud = new THREE.Points(movingGeometry, movingMaterial);
      movingCloud.frustumCulled = false;
      scene.add(cloud, movingCloud);
      resize();
    };
    image.onerror = () => {
      console.error("Failed to load the tree particle source image.");
    };
    image.src = "/tree-particle-source.png";

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove);
    resize();
    animate();

    return () => {
      disposed = true;
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      resizeObserver.disconnect();
      image.onload = null;
      image.onerror = null;
      scene.traverse((object) => {
        if (object instanceof THREE.Points) {
          object.geometry.dispose();
          object.material.dispose();
        }
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div
      className="initiative-particle-overlay"
      ref={containerRef}
      aria-hidden="true"
    />
  );
}
