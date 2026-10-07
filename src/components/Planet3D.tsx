import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { Planet } from '../data/planets';

type Planet3DProps = {
  planet: Planet;
  onClose: () => void;
};

function createPlanetTexture(planet: Planet) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const context = canvas.getContext('2d');

  if (!context) {
    return new THREE.CanvasTexture(canvas);
  }

  const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, planet.color);
  gradient.addColorStop(0.5, planet.color);
  gradient.addColorStop(1, '#111827');
  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.globalAlpha = 0.22;
  for (let y = 0; y < canvas.height; y += 18) {
    context.fillStyle = y % 36 === 0 ? '#ffffff' : '#000000';
    context.fillRect(0, y, canvas.width, 5);
  }

  context.globalAlpha = 0.13;
  for (let i = 0; i < 140; i += 1) {
    const x = (i * 97) % canvas.width;
    const y = (i * 53) % canvas.height;
    context.fillStyle = i % 2 === 0 ? '#ffffff' : '#000000';
    context.beginPath();
    context.arc(x, y, 2 + (i % 4), 0, Math.PI * 2);
    context.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  return texture;
}

export default function Planet3D({ planet, onClose }: Planet3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020617);
    scene.fog = new THREE.FogExp2(0x020617, 0.035);

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    camera.position.set(0, 2.5, 6);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.minDistance = 0.25;
    controls.maxDistance = 180;
    controls.enablePan = false;

    const ambientLight = new THREE.AmbientLight(0x8ea8d8, 0.7);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 3.5);
    keyLight.position.set(5, 4, 6);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(planet.color, 1.2);
    rimLight.position.set(-5, -2, -4);
    scene.add(rimLight);

    const planetGeometry = new THREE.SphereGeometry(1, 96, 64);
    const planetMaterial = new THREE.MeshStandardMaterial({
      map: createPlanetTexture(planet),
      roughness: 0.88,
      metalness: 0.02,
    });
    const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);
    planetMesh.castShadow = true;
    planetMesh.receiveShadow = true;
    scene.add(planetMesh);

    if (planet.id === 'saturn') {
      const ringGeometry = new THREE.RingGeometry(1.35, 2.45, 160);
      const ringMaterial = new THREE.MeshStandardMaterial({
        color: 0xe8d088,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.72,
        roughness: 0.7,
        metalness: 0,
      });
      const rings = new THREE.Mesh(ringGeometry, ringMaterial);
      rings.rotation.x = Math.PI / 2.5;
      rings.castShadow = true;
      scene.add(rings);
    }

    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(1200 * 3);
    for (let i = 0; i < 1200; i += 1) {
      const radius = 120 + Math.random() * 150;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      starPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = radius * Math.cos(phi);
      starPositions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
    }
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const stars = new THREE.Points(
      starGeometry,
      new THREE.PointsMaterial({ color: 0xffffff, size: 0.12, transparent: true, opacity: 0.8 }),
    );
    scene.add(stars);

    const resize = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };

    let lastFrameTime = performance.now();
    const render = (timestamp: number) => {
      const elapsed = Math.min((timestamp - lastFrameTime) / 1000, 0.05);
      lastFrameTime = timestamp;
      controls.update();
      planetMesh.rotation.y += elapsed * 2.5;
      stars.rotation.y += elapsed * 0.35;
      renderer.render(scene, camera);
      animationFrame = requestAnimationFrame(render);
    };

    let animationFrame = 0;
    resize();
    window.addEventListener('resize', resize);
    animationFrame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', resize);
      controls.dispose();
      planetGeometry.dispose();
      planetMaterial.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, [planet]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 p-4" role="dialog" aria-modal="true" aria-label={`Vue 3D de ${planet.name}`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.08),transparent_45%)]" />
      <button type="button" onClick={onClose} className="absolute right-5 top-5 z-20 rounded-full bg-white/10 px-5 py-2.5 text-white backdrop-blur transition hover:bg-white/20" aria-label="Fermer la vue 3D">
        Fermer ×
      </button>
      <div className="relative h-[82vh] w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-slate-950 shadow-2xl">
        <div ref={mountRef} className="h-full w-full" />
        <div className="pointer-events-none absolute left-5 top-5 rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 backdrop-blur">
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Vue 3D</p>
          <h2 className="text-2xl font-bold text-white">{planet.nameFr}</h2>
          <p className="mt-1 text-sm text-slate-400">Utilisez la souris pour tourner et zoomer</p>
        </div>
      </div>
    </div>
  );
}
