import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { smoother } from "../Navbar";
// Ensure no SplitText or ScrollSmoother references remain

gsap.registerPlugin(ScrollTrigger);

export function initialFX() {
  document.body.style.overflowY = "auto";
  smoother.paused(false);
  document.getElementsByTagName("main")[0].classList.add("main-active");
  gsap.to("body", {
    backgroundColor: "#0b080c",
    duration: 0.5,
    delay: 1,
  });

  // Custom text splitting implementation
  const elements = document.querySelectorAll(".landing-info h3, .landing-intro h2, .landing-intro h1");
  
  elements.forEach(element => {
    // Split text into characters
    const text = element.textContent || '';
    const chars = text.split('');
    element.innerHTML = chars.map(char => 
      `<span class="char">${char === ' ' ? '&nbsp;' : char}</span>`
    ).join('');
  });
  
  // Animate the characters
  const chars = document.querySelectorAll('.char');
  gsap.fromTo(
    chars,
    { opacity: 0, y: 80, filter: "blur(5px)" },
    {
      opacity: 1,
      duration: 1.2,
      filter: "blur(0px)",
      ease: "power3.inOut",
      y: 0,
      stagger: 0.025,
      delay: 0.3,
    }
  );

  // Apply the same text splitting to landing-h2-info elements
  const h2InfoElements = document.querySelectorAll(".landing-h2-info");
  
  h2InfoElements.forEach(element => {
    // Split text into characters
    const text = element.textContent || '';
    const chars = text.split('');
    element.innerHTML = chars.map(char => 
      `<span class="char h2-char">${char === ' ' ? '&nbsp;' : char}</span>`
    ).join('');
  });
  
  // Animate the h2 characters
  const h2Chars = document.querySelectorAll('.h2-char');
  gsap.fromTo(
    h2Chars,
    { opacity: 0, y: 80, filter: "blur(5px)" },
    {
      opacity: 1,
      duration: 1.2,
      filter: "blur(0px)",
      ease: "power3.inOut",
      y: 0,
      stagger: 0.025,
      delay: 0.3,
    }
  );

  gsap.fromTo(
    ".landing-info-h2",
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      duration: 1.2,
      ease: "power1.inOut",
      y: 0,
      delay: 0.8,
    }
  );
  gsap.fromTo(
    [".header", ".icons-section", ".nav-fade"],
    { opacity: 0 },
    {
      opacity: 1,
      duration: 1.2,
      ease: "power1.inOut",
      delay: 0.1,
    }
  );

  // Apply text splitting to additional elements
  const additionalElements = [
    ".landing-h2-info-1",
    ".landing-h2-1",
    ".landing-h2-2"
  ];
  
  // Process each element and store references to their character spans
  const elementChars: {[key: string]: NodeListOf<Element>} = {};
  
  additionalElements.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    
    elements.forEach(element => {
      // Split text into characters
      const text = element.textContent || '';
      const chars = text.split('');
      element.innerHTML = chars.map(char => 
        `<span class="char ${selector.replace('.', '')}-char">${char === ' ' ? '&nbsp;' : char}</span>`
      ).join('');
    });
    
    // Store reference to character spans
    elementChars[selector] = document.querySelectorAll(`${selector}-char`);
  });

  // Create animation loops between pairs of elements
  loopTextAnimation(".landing-h2-info", ".landing-h2-info-1", elementChars);
  loopTextAnimation(".landing-h2-1", ".landing-h2-2", elementChars);
}

function loopTextAnimation(selector1: string, selector2: string, elementChars: {[key: string]: NodeListOf<Element>}) {
  const chars1 = document.querySelectorAll(`${selector1.replace('.', '')}-char`);
  const chars2 = elementChars[selector2] || document.querySelectorAll(`${selector2.replace('.', '')}-char`);
  
  var tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });
  const delay = 4;
  const delay2 = delay * 2 + 1;

  tl.fromTo(
    chars2,
    { opacity: 0, y: 80 },
    {
      opacity: 1,
      duration: 1.2,
      ease: "power3.inOut",
      y: 0,
      stagger: 0.1,
      delay: delay,
    },
    0
  )
    .fromTo(
      chars1,
      { y: 80 },
      {
        duration: 1.2,
        ease: "power3.inOut",
        y: 0,
        stagger: 0.1,
        delay: delay2,
      },
      1
    )
    .fromTo(
      chars1,
      { y: 0 },
      {
        y: -80,
        duration: 1.2,
        ease: "power3.inOut",
        stagger: 0.1,
        delay: delay,
      },
      0
    )
    .to(
      chars2,
      {
        y: -80,
        duration: 1.2,
        ease: "power3.inOut",
        stagger: 0.1,
        delay: delay2,
      },
      1
    );
}
