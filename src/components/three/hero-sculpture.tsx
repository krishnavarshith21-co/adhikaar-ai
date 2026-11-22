'use client';

import { useCallback, useEffect, useRef, useState, type PointerEvent, type KeyboardEvent } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { Pause, Play, RotateCcw } from 'lucide-react';
import { createHeritageModel } from './heritage-model';
import { SculptureFallback } from './sculpture-fallback';

interface Interaction {
  yaw: number; pitch: number; cursorX: number; cursorY: number;
  dragging: boolean; lastInteraction: number; invalidate: () => void;
}
function Pavilion({ interaction, moving }: { interaction: React.RefObject<Interaction>; moving: boolean }) {
  const group = useRef<THREE.Group>(null);
  const drift = useRef(0);
  useEffect(() => {
    const parent = group.current;
    const model = createHeritageModel();
    model.group.position.y = -2.25;
    parent?.add(model.group);
    return () => { parent?.remove(model.group); model.dispose(); };
  }, []);
  useFrame((state, delta) => {
    if (!group.current) return;
    const input = interaction.current;
    // Integrate only active frame deltas: resuming a hidden tab cannot jump the angle.
    const dt = Math.min(delta, .05);
    if (moving && !input.dragging && performance.now() - input.lastInteraction > 2500) drift.current += dt * .075;
    const automatic = Math.sin(drift.current) * .18;
    const yaw = input.yaw + automatic + (moving ? input.cursorX * .035 : 0);
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, yaw, 7, dt);
    // Exposed on the canvas for deterministic browser QA; no per-frame React updates.
    state.gl.domElement.dataset.rotation = group.current.rotation.y.toFixed(5);
    const unsettled = Math.abs(group.current.rotation.y - yaw) > .0001;
    if (!moving && unsettled) state.invalidate();
  });
  return <group ref={group} position={[0, 2.25, 0]}><group position={[0, -2.25, 0]} /></group>;
}

// Three.js resources are deliberately mutable and owned by this effect lifecycle.
function installStudio(gl: THREE.WebGLRenderer, scene: THREE.Scene, input: Interaction, invalidate: () => void, failed: () => void) {
  input.invalidate = invalidate;
  const environment = new RoomEnvironment();
  const generator = new THREE.PMREMGenerator(gl);
  const target = generator.fromScene(environment, .04);
  scene.environment = target.texture; scene.environmentIntensity = .55;
  environment.dispose(); generator.dispose();
  const lost = (event: Event) => { event.preventDefault(); failed(); };
  gl.domElement.addEventListener('webglcontextlost', lost); invalidate();
  return () => {
    scene.environment = null; target.dispose();
    gl.domElement.removeEventListener('webglcontextlost', lost);
    input.invalidate = () => {};
  };
}

function Studio({ interaction, moving, failed }: { interaction: React.RefObject<Interaction>; moving: boolean; failed: () => void }) {
  const { gl, scene, camera, size, invalidate } = useThree();
  const cameraBase = useRef(new THREE.Vector3());
  useEffect(() => installStudio(gl, scene, interaction.current, invalidate, failed), [gl, scene, invalidate, interaction, failed]);
  useEffect(() => {
    const aspect = size.width / Math.max(size.height, 1);
    const distance = 10.3 * Math.max(1, .97 / aspect);
    camera.position.copy(new THREE.Vector3(-.40, .18, .9).normalize().multiplyScalar(distance).add(new THREE.Vector3(0, 2.12, 0)));
    cameraBase.current.copy(camera.position);
    camera.lookAt(0, 2.12, 0); camera.updateProjectionMatrix(); invalidate();
  }, [camera, size.width, size.height, invalidate]);
  useFrame((state, delta) => {
    const camera = state.camera;
    const input = interaction.current;
    const desiredY = cameraBase.current.y + input.pitch * 6 + (moving ? input.cursorY * .06 : 0);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, desiredY, 7, Math.min(delta, .05));
    camera.lookAt(0, 2.12, 0);
    if (!moving && Math.abs(camera.position.y - desiredY) > .0001) invalidate();
  });
  return <>
    <color attach="background" args={['#F7F2E9']} />
    <fog attach="fog" args={['#F7F2E9', 15, 32]} />
    <hemisphereLight args={['#fff3df', '#b79c7e', .55]} />
    <directionalLight position={[-4, 7, 5]} intensity={2.7} color="#ffe2b6" castShadow shadow-mapSize={[1024, 1024]} shadow-bias={-.0003} shadow-normalBias={.025} shadow-camera-left={-4} shadow-camera-right={4} shadow-camera-top={6} shadow-camera-bottom={-4} shadow-camera-near={.5} shadow-camera-far={20} shadow-radius={3} />
    <directionalLight position={[4, 4, -2]} intensity={.65} color="#dbe5f5" />
    <directionalLight position={[0, 5, -4]} intensity={1.1} color="#ffe9c8" />
    <Pavilion interaction={interaction} moving={moving} />
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -.012, 0]} receiveShadow><planeGeometry args={[200, 200]} /><meshStandardMaterial color="#F7F2E9" roughness={1} /></mesh>
  </>;
}

export function HeroSculpture() {
  const container = useRef<HTMLDivElement>(null);
  const interaction = useRef<Interaction>({ yaw: 0, pitch: 0, cursorX: 0, cursorY: 0, dragging: false, lastInteraction: 0, invalidate: () => {} });
  const drag = useRef({ id: -1, x: 0, y: 0, yaw: 0, pitch: 0 });
  const [visible, setVisible] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [reduced, setReduced] = useState(true);
  const [paused, setPaused] = useState(false);
  const [failed, setFailed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const fail = useCallback(() => setFailed(true), []);
  useEffect(() => {
    const element = container.current;
    const observer = new IntersectionObserver(([entry]) => { setVisible(entry.isIntersecting); if (entry.isIntersecting) setMounted(true); }, { threshold: .08 });
    if (element) observer.observe(element);
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const motion = () => setReduced(media.matches);
    const visibility = () => setPageVisible(document.visibilityState === 'visible');
    motion(); visibility(); media.addEventListener('change', motion); document.addEventListener('visibilitychange', visibility);
    return () => { observer.disconnect(); media.removeEventListener('change', motion); document.removeEventListener('visibilitychange', visibility); };
  }, []);
  const moving = visible && pageVisible && !reduced && !paused;
  const touch = () => { interaction.current.lastInteraction = performance.now(); interaction.current.invalidate(); };
  function pointerDown(e: PointerEvent<HTMLDivElement>) {
    if (e.button !== 0) return;
    drag.current = { id: e.pointerId, x: e.clientX, y: e.clientY, yaw: interaction.current.yaw, pitch: interaction.current.pitch };
    interaction.current.dragging = true; touch();
    e.currentTarget.setPointerCapture(e.pointerId);
  }
  function pointerMove(e: PointerEvent<HTMLDivElement>) {
    const input = interaction.current;
    if (input.dragging && drag.current.id === e.pointerId) {
      input.yaw = THREE.MathUtils.clamp(drag.current.yaw + (e.clientX - drag.current.x) * .005, -.85, .85);
      // Touch vertical gestures belong to page scrolling; only mouse can tilt the model.
      if (e.pointerType !== 'touch') input.pitch = THREE.MathUtils.clamp(drag.current.pitch + (e.clientY - drag.current.y) * .0015, -.06, .08);
      touch();
    } else if (e.pointerType === 'mouse') {
      const bounds = e.currentTarget.getBoundingClientRect();
      input.cursorX = (e.clientX - bounds.left) / bounds.width * 2 - 1;
      input.cursorY = (e.clientY - bounds.top) / bounds.height * 2 - 1;
    }
  }
  function end(e: PointerEvent<HTMLDivElement>) {
    interaction.current.dragging = false; touch();
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
  }
  function reset() { interaction.current.yaw = 0; interaction.current.pitch = 0; interaction.current.cursorX = 0; interaction.current.cursorY = 0; touch(); }
  function keyboard(e: KeyboardEvent<HTMLDivElement>) {
    if (!['ArrowLeft', 'ArrowRight', 'Home'].includes(e.key)) return;
    e.preventDefault();
    if (e.key === 'Home') reset();
    else { interaction.current.yaw = THREE.MathUtils.clamp(interaction.current.yaw + (e.key === 'ArrowLeft' ? -.12 : .12), -.85, .85); touch(); }
  }
  return <div ref={container} className={`heritage-viewer${visible ? ' is-visible' : ''}`} data-motion={moving ? 'running' : 'paused'}>
    <div className="heritage-stage" tabIndex={failed ? -1 : 0} role="group" aria-label="Interactive sandstone pavilion. Drag horizontally or use left and right arrow keys to rotate. Home resets the view." aria-describedby="heritage-instructions" onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={end} onPointerCancel={end} onLostPointerCapture={() => { interaction.current.dragging = false; }} onPointerLeave={() => { interaction.current.cursorX = 0; interaction.current.cursorY = 0; }} onKeyDown={keyboard}>
      {failed || !mounted ? <SculptureFallback /> : <Canvas shadows={{ type: THREE.PCFShadowMap }} camera={{ fov: 34, near: .1, far: 80, position: [-4, 4, 9] }} dpr={[1, 1.5]} frameloop={moving ? 'always' : 'demand'} gl={{ antialias: true, alpha: false, powerPreference: 'low-power', toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: .95 }} fallback={<SculptureFallback />} style={{ width: '100%', height: '100%', touchAction: 'pan-y' }}><Studio interaction={interaction} moving={moving} failed={fail} /></Canvas>}
    </div>
    <div className="heritage-controls"><span id="heritage-instructions">{failed ? 'Architectural study · static view' : 'Drag to explore'}</span><div>{!reduced && !failed && <button type="button" onClick={() => setPaused(v => !v)} aria-label={paused ? 'Resume sculpture rotation' : 'Pause sculpture rotation'} aria-pressed={paused}>{paused ? <Play size={15} /> : <Pause size={15} />}</button>}{!failed && <button type="button" onClick={reset} aria-label="Reset sculpture view"><RotateCcw size={15} /></button>}</div></div>
  </div>;
}
