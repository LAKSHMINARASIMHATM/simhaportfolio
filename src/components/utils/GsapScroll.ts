import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function setCharTimeline(
  character: THREE.Object3D<THREE.Object3DEventMap> | null,
  camera: THREE.PerspectiveCamera
) {
  if (!character) return;

  // Kill existing ScrollTriggers to prevent conflicts
  ScrollTrigger.getAll().forEach(trigger => {
    if (trigger.vars.id !== "work") {
      trigger.kill();
    }
  });

  let intensity: number = 0;
  const intensityInterval = setInterval(() => {
    intensity = Math.random();
  }, 200);

  // Responsive breakpoints
  const isMobile = window.innerWidth <= 768;
  const isTablet = window.innerWidth <= 1024;
  const isDesktop = window.innerWidth > 1024;

  // Get screen light and monitor elements
  let screenLight: any, monitor: any;
  character?.children.forEach((object: any) => {
    if (object.name === "Plane004") {
      object.children.forEach((child: any) => {
        child.material.transparent = true;
        child.material.opacity = 0;
        if (child.material.name === "Material.027") {
          monitor = child;
          child.material.color.set("#FFFFFF");
        }
      });
    }
    if (object.name === "screenlight") {
      object.material.transparent = true;
      object.material.opacity = 0;
      object.material.emissive.set("#C8BFFF");
      gsap.timeline({ repeat: -1, repeatRefresh: true }).to(object.material, {
        emissiveIntensity: () => intensity * 8,
        duration: () => Math.random() * 0.6,
        delay: () => Math.random() * 0.1,
        ease: "power2.inOut"
      });
      screenLight = object;
    }
  });

  let neckBone = character?.getObjectByName("spine005");

  // Desktop animations
  if (isDesktop) {
    // Landing to About transition
    const tl1 = gsap.timeline({
      scrollTrigger: {
        trigger: ".landing-section",
        start: "top top",
        end: "bottom top",
        scrub: 1.2,
        invalidateOnRefresh: true,
        anticipatePin: 1,
      },
    });

    tl1
      .fromTo(character.rotation, { y: 0 }, { y: 0.7, duration: 1, ease: "power2.inOut" }, 0)
      .to(camera.position, { z: 22, duration: 1, ease: "power2.inOut" }, 0)
      .fromTo(".character-model", { x: "0%" }, { x: "-25%", duration: 1, ease: "power2.inOut" }, 0)
      .to(".landing-container", { opacity: 0, duration: 0.4, ease: "power2.inOut" }, 0.6)
      .to(".landing-container", { y: "40%", duration: 0.8, ease: "power2.inOut" }, 0)
      .fromTo(".about-me", { y: "-50%" }, { y: "0%", duration: 1, ease: "power2.inOut" }, 0);

    // About to What I Do transition
    const tl2 = gsap.timeline({
      scrollTrigger: {
        trigger: ".about-section",
        start: "center 55%",
        end: "bottom top",
        scrub: 1.5,
        invalidateOnRefresh: true,
        anticipatePin: 1,
      },
    });

    tl2
      .to(
        camera.position,
        { z: 75, y: 8.4, duration: 6, delay: 2, ease: "power3.inOut" },
        0
      )
      .to(".about-section", { y: "30%", duration: 6, ease: "power2.inOut" }, 0)
      .to(".about-section", { opacity: 0, delay: 3, duration: 2, ease: "power2.inOut" }, 0)
      .fromTo(
        ".character-model",
        { pointerEvents: "inherit" },
        { pointerEvents: "none", x: "-12%", delay: 2, duration: 5, ease: "power2.inOut" },
        0
      )
      .to(character.rotation, { y: 0.92, x: 0.12, delay: 3, duration: 3, ease: "power2.inOut" }, 0)
      .to(neckBone!.rotation, { x: 0.6, delay: 2, duration: 3, ease: "power2.inOut" }, 0)
      .to(monitor.material, { opacity: 1, duration: 0.8, delay: 3.2, ease: "power2.inOut" }, 0)
      .to(screenLight.material, { opacity: 1, duration: 0.8, delay: 4.5, ease: "power2.inOut" }, 0)
      .fromTo(
        ".what-box-in",
        { display: "none" },
        { display: "flex", duration: 0.1, delay: 6 },
        0
      )
      .fromTo(
        monitor.position,
        { y: -10, z: 2 },
        { y: 0, z: 0, delay: 1.5, duration: 3, ease: "power2.inOut" },
        0
      )
      .fromTo(
        ".character-rim",
        { opacity: 1, scaleX: 1.4 },
        { opacity: 0, scale: 0, y: "-70%", duration: 5, delay: 2, ease: "power2.inOut" },
        0.3
      );

    // What I Do transition
    const tl3 = gsap.timeline({
      scrollTrigger: {
        trigger: ".whatIDO",
        start: "top top",
        end: "bottom top",
        scrub: 1,
        invalidateOnRefresh: true,
        anticipatePin: 1,
      },
    });

    tl3
      .fromTo(
        ".character-model",
        { y: "0%" },
        { y: "-100%", duration: 4, ease: "power2.inOut", delay: 1 },
        0
      )
      .fromTo(".whatIDO", { y: 0 }, { y: "15%", duration: 2, ease: "power2.inOut" }, 0)
      .to(character.rotation, { x: -0.04, duration: 2, delay: 1, ease: "power2.inOut" }, 0);

  } else {
    // Mobile/Tablet simplified animations
    const mobileTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".landing-section",
        start: "top top",
        end: "bottom center",
        scrub: 1,
        invalidateOnRefresh: true,
      },
    });

    mobileTl
      .to(".landing-container", { opacity: 0.7, duration: 1, ease: "power2.inOut" })
      .to(character.rotation, { y: 0.3, duration: 1, ease: "power2.inOut" }, 0);

    // Show what-box-in for mobile
    const mobileWhatTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".what-box-in",
        start: "top 70%",
        end: "bottom top",
        toggleActions: "play none none reverse",
      },
    });

    mobileWhatTl.to(".what-box-in", { display: "flex", duration: 0.1 });

    // Mobile monitor animation
    if (monitor && screenLight) {
      const mobileMonitorTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".about-section",
          start: "top center",
          end: "bottom center",
          scrub: 1,
        },
      });

      mobileMonitorTl
        .to(monitor.material, { opacity: 1, duration: 1, ease: "power2.inOut" })
        .to(screenLight.material, { opacity: 1, duration: 1, ease: "power2.inOut" }, 0.5);
    }
  }

  // Cleanup function
  return () => {
    clearInterval(intensityInterval);
    ScrollTrigger.getAll().forEach(trigger => {
      if (trigger.vars.id !== "work") {
        trigger.kill();
      }
    });
  };
}

export function setAllTimeline() {
  // Kill existing career timeline
  const existingCareerTrigger = ScrollTrigger.getById("career");
  if (existingCareerTrigger) {
    existingCareerTrigger.kill();
  }

  const isMobile = window.innerWidth <= 768;
  const isTablet = window.innerWidth <= 1024;

  const careerTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: ".career-section",
      start: isMobile ? "top 60%" : "top 30%",
      end: "100% center",
      scrub: 1.2,
      invalidateOnRefresh: true,
      id: "career",
      anticipatePin: 1,
    },
  });

  careerTimeline
    .fromTo(
      ".career-timeline",
      { maxHeight: "10%" },
      { maxHeight: "100%", duration: 0.5, ease: "power2.inOut" },
      0
    )
    .fromTo(
      ".career-timeline",
      { opacity: 0 },
      { opacity: 1, duration: 0.1 },
      0
    )
    .fromTo(
      ".career-info-box",
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, stagger: 0.1, duration: 0.5, ease: "power2.out" },
      0.2
    )
    .fromTo(
      ".career-dot",
      { animationIterationCount: "infinite" },
      {
        animationIterationCount: "1",
        delay: 0.3,
        duration: 0.1,
      },
      0
    );

  // Responsive career section movement
  if (isTablet && !isMobile) {
    careerTimeline.fromTo(
      ".career-section",
      { y: 0 },
      { y: "10%", duration: 0.5, delay: 0.2, ease: "power2.inOut" },
      0
    );
  } else if (!isMobile) {
    careerTimeline.fromTo(
      ".career-section",
      { y: 0 },
      { y: "20%", duration: 0.5, delay: 0.2, ease: "power2.inOut" },
      0
    );
  }

  // Add smooth text animations for better UX
  const textElements = document.querySelectorAll('.career-info h4, .career-info h5, .career-info p');
  if (textElements.length > 0) {
    gsap.fromTo(textElements, 
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".career-section",
          start: "top 70%",
          toggleActions: "play none none reverse"
        }
      }
    );
  }
}