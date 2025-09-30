import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { smoother } from "../Navbar";

gsap.registerPlugin(ScrollTrigger);

export function initialFX() {
  // Smooth body overflow transition
  gsap.to(document.body, {
    overflowY: "auto",
    duration: 0.3,
    ease: "power2.inOut"
  });
  
  smoother.paused(false);
  
  const mainElement = document.getElementsByTagName("main")[0];
  if (mainElement) {
    mainElement.classList.add("main-active");
  }

  // Smooth background color transition
  gsap.to("body", {
    backgroundColor: "#0b080c",
    duration: 1,
    delay: 0.5,
    ease: "power2.inOut",
  });

  // Enhanced text splitting with better performance
  const textElements = document.querySelectorAll(".landing-info h3, .landing-intro h2, .landing-intro h1");
  
  textElements.forEach((element, index) => {
    const text = element.textContent || '';
    const chars = text.split('');
    element.innerHTML = chars.map((char, i) => 
      `<span class="char" style="display: inline-block;">${char === ' ' ? '&nbsp;' : char}</span>`
    ).join('');
  });
  
  // Smoother character animations with stagger
  const chars = document.querySelectorAll('.char');
  gsap.fromTo(
    chars,
    { 
      opacity: 0, 
      y: 100, 
      rotationX: -90,
      filter: "blur(10px)",
      transformOrigin: "50% 50% -50px"
    },
    {
      opacity: 1,
      y: 0,
      rotationX: 0,
      filter: "blur(0px)",
      duration: 1.5,
      ease: "back.out(1.7)",
      stagger: {
        amount: 0.8,
        from: "start"
      },
      delay: 0.3,
    }
  );

  // Enhanced h2 info elements animation
  const h2InfoElements = document.querySelectorAll(".landing-h2-info");
  
  h2InfoElements.forEach(element => {
    const text = element.textContent || '';
    const chars = text.split('');
    element.innerHTML = chars.map(char => 
      `<span class="char h2-char" style="display: inline-block;">${char === ' ' ? '&nbsp;' : char}</span>`
    ).join('');
  });
  
  const h2Chars = document.querySelectorAll('.h2-char');
  gsap.fromTo(
    h2Chars,
    { 
      opacity: 0, 
      y: 80, 
      scale: 0.8,
      filter: "blur(5px)" 
    },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      duration: 1.2,
      ease: "back.out(1.4)",
      stagger: {
        amount: 0.6,
        from: "center"
      },
      delay: 0.5,
    }
  );

  // Smoother landing info animation
  gsap.fromTo(
    ".landing-info-h2",
    { 
      opacity: 0, 
      y: 50, 
      scale: 0.9,
      filter: "blur(5px)"
    },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      duration: 1.5,
      ease: "back.out(1.2)",
      delay: 0.8,
    }
  );

  // Enhanced header and icons animation
  gsap.fromTo(
    [".header", ".icons-section", ".nav-fade"],
    { 
      opacity: 0, 
      y: -30,
      filter: "blur(5px)"
    },
    {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      duration: 1.2,
      ease: "power3.out",
      stagger: 0.1,
      delay: 0.2,
    }
  );

  // Process additional text elements with improved animations
  const additionalElements = [
    ".landing-h2-info-1",
    ".landing-h2-1", 
    ".landing-h2-2"
  ];
  
  const elementChars: {[key: string]: NodeListOf<Element>} = {};
  
  additionalElements.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    
    elements.forEach(element => {
      const text = element.textContent || '';
      const chars = text.split('');
      element.innerHTML = chars.map(char => 
        `<span class="char ${selector.replace('.', '')}-char" style="display: inline-block;">${char === ' ' ? '&nbsp;' : char}</span>`
      ).join('');
    });
    
    elementChars[selector] = document.querySelectorAll(`${selector.replace('.', '')}-char`);
  });

  // Create smoother animation loops
  loopTextAnimation(".landing-h2-info", ".landing-h2-info-1", elementChars);
  loopTextAnimation(".landing-h2-1", ".landing-h2-2", elementChars);

  // Add responsive scroll refresh
  ScrollTrigger.addEventListener("refresh", () => {
    // Recalculate positions on refresh
    ScrollTrigger.refresh();
  });

  // Smooth scroll to top on page load
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function loopTextAnimation(selector1: string, selector2: string, elementChars: {[key: string]: NodeListOf<Element>}) {
  const chars1 = document.querySelectorAll(`${selector1.replace('.', '')}-char`);
  const chars2 = elementChars[selector2] || document.querySelectorAll(`${selector2.replace('.', '')}-char`);
  
  if (chars1.length === 0 || chars2.length === 0) return;

  const tl = gsap.timeline({ 
    repeat: -1, 
    repeatDelay: 1.5,
    ease: "power2.inOut"
  });
  
  const delay = 4;
  const delay2 = delay * 2 + 1.5;

  tl.fromTo(
    chars2,
    { 
      opacity: 0, 
      y: 100, 
      rotationX: -90,
      filter: "blur(5px)"
    },
    {
      opacity: 1,
      y: 0,
      rotationX: 0,
      filter: "blur(0px)",
      duration: 1.5,
      ease: "back.out(1.4)",
      stagger: {
        amount: 0.4,
        from: "start"
      },
      delay: delay,
    },
    0
  )
  .fromTo(
    chars1,
    { y: 100, rotationX: -90 },
    {
      y: 0,
      rotationX: 0,
      duration: 1.5,
      ease: "back.out(1.4)",
      stagger: {
        amount: 0.4,
        from: "start"
      },
      delay: delay2,
    },
    1
  )
  .fromTo(
    chars1,
    { y: 0, rotationX: 0 },
    {
      y: -100,
      rotationX: 90,
      duration: 1.5,
      ease: "back.in(1.4)",
      stagger: {
        amount: 0.4,
        from: "end"
      },
      delay: delay,
    },
    0
  )
  .to(
    chars2,
    {
      y: -100,
      rotationX: 90,
      duration: 1.5,
      ease: "back.in(1.4)",
      stagger: {
        amount: 0.4,
        from: "end"
      },
      delay: delay2,
    },
    1
  );
}