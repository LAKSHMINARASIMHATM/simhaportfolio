import * as THREE from "three";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setCharTimeline, setAllTimeline } from "../../utils/GsapScroll";

export default function handleResize(
  renderer: THREE.WebGLRenderer,
  camera: THREE.PerspectiveCamera,
  canvasDiv: React.RefObject<HTMLDivElement>,
  character: THREE.Object3D
) {
  if (!canvasDiv.current) return;

  // Get new dimensions
  const canvas3d = canvasDiv.current.getBoundingClientRect();
  const width = canvas3d.width;
  const height = canvas3d.height;

  // Update renderer and camera
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for performance
  
  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  // Responsive camera adjustments
  const isMobile = window.innerWidth <= 768;
  const isTablet = window.innerWidth <= 1024;

  if (isMobile) {
    camera.position.set(0, 13.1, 28);
    camera.zoom = 0.8;
  } else if (isTablet) {
    camera.position.set(0, 13.1, 26);
    camera.zoom = 0.9;
  } else {
    camera.position.set(0, 13.1, 24.7);
    camera.zoom = 1.1;
  }
  
  camera.updateProjectionMatrix();

  // Kill existing ScrollTriggers except work
  const workTrigger = ScrollTrigger.getById("work");
  ScrollTrigger.getAll().forEach((trigger) => {
    if (trigger !== workTrigger) {
      trigger.kill();
    }
  });

  // Debounced timeline recreation
  clearTimeout((window as any).resizeTimeout);
  (window as any).resizeTimeout = setTimeout(() => {
    // Recreate timelines with new dimensions
    setCharTimeline(character, camera);
    setAllTimeline();
    
    // Refresh ScrollTrigger
    ScrollTrigger.refresh();
  }, 100);
}