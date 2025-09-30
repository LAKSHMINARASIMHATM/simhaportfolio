import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
// Removed trial dependencies - using standard GSAP

interface ParaElement extends HTMLElement {
  anim?: gsap.core.Animation;
  split?: any; // Modified SplitText type
}

gsap.registerPlugin(ScrollTrigger);

export default function setSplitText() {
  ScrollTrigger.config({ ignoreMobileResize: true });
  if (window.innerWidth < 900) return;
  const paras: NodeListOf<ParaElement> = document.querySelectorAll(".para");
  const titles: NodeListOf<ParaElement> = document.querySelectorAll(".title");

  const TriggerStart = window.innerWidth <= 1024 ? "top 60%" : "20% 60%";
  const ToggleAction = "play pause resume reverse";

  paras.forEach((para: ParaElement) => {
    para.classList.add("visible");
    if (para.anim) {
      para.anim.progress(1).kill();
      para.split?.revert();
    }

    // Using standard text manipulation instead of SplitText
    para.split = {
      revert: () => {}
    };
    // Simple text splitting simulation
    const words = para.innerHTML.split(' ').map(word => `<span class="word">${word}</span>`).join(' ');
    para.innerHTML = `<div class="line">${words}</div>`;
    const wordElements = para.querySelectorAll('.word');
    
    // Create animation for words
    para.anim = gsap.fromTo(
      wordElements,
      { autoAlpha: 0, y: 80 },
      {
        autoAlpha: 1,
        scrollTrigger: {
          trigger: para.parentElement?.parentElement,
          toggleActions: ToggleAction,
          start: TriggerStart,
        },
        duration: 1,
        ease: "power3.out",
        y: 0,
        stagger: 0.02,
      }
    );
  });
  titles.forEach((title: ParaElement) => {
    if (title.anim) {
      title.anim.progress(1).kill();
      title.split?.revert();
    }
    // Custom SplitText implementation
    title.split = {
      chars: [],
      revert: () => {}
    };
    
    // Split text into characters and lines
    const text = title.innerHTML;
    title.innerHTML = "";
    
    // Create a line wrapper
    const lineWrapper = document.createElement('div');
    lineWrapper.className = 'split-line';
    title.appendChild(lineWrapper);
    
    // Split into characters
    const chars = text.split('');
    title.split.chars = chars.map(char => {
      const charSpan = document.createElement('span');
      charSpan.className = 'char';
      charSpan.textContent = char === ' ' ? '\u00A0' : char;
      lineWrapper.appendChild(charSpan);
      return charSpan;
    });
    title.anim = gsap.fromTo(
      title.split.chars,
      { autoAlpha: 0, y: 80, rotate: 10 },
      {
        autoAlpha: 1,
        scrollTrigger: {
          trigger: title.parentElement?.parentElement,
          toggleActions: ToggleAction,
          start: TriggerStart,
        },
        duration: 0.8,
        ease: "power2.inOut",
        y: 0,
        rotate: 0,
        stagger: 0.03,
      }
    );
  });

  ScrollTrigger.addEventListener("refresh", () => setSplitText());
}
