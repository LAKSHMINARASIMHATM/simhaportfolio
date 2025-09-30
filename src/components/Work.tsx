import "./styles/Work.css";
import WorkImage from "./WorkImage";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const Work = () => {
  const workRef = useRef<HTMLDivElement>(null);
  const workFlexRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!workRef.current || !workFlexRef.current) return;

    let translateX: number = 0;

    function setTranslateX() {
      const boxes = document.getElementsByClassName("work-box");
      const container = document.querySelector(".work-container");
      
      if (!boxes.length || !container) return;

      const rectLeft = container.getBoundingClientRect().left;
      const rect = boxes[0].getBoundingClientRect();
      const parentWidth = container.getBoundingClientRect().width;
      const padding = parseInt(window.getComputedStyle(boxes[0]).padding) / 2;
      
      translateX = rect.width * boxes.length - (rectLeft + parentWidth) + padding;
    }

    // Responsive translate calculation
    const updateTranslateX = () => {
      setTranslateX();
      ScrollTrigger.refresh();
    };

    setTranslateX();

    // Kill existing work timeline
    const existingWorkTrigger = ScrollTrigger.getById("work");
    if (existingWorkTrigger) {
      existingWorkTrigger.kill();
    }

    const isMobile = window.innerWidth <= 768;
    const isTablet = window.innerWidth <= 1024;

    let timeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".work-section",
        start: "top top",
        end: `+=${Math.max(translateX, window.innerWidth)}`,
        scrub: isMobile ? 0.5 : 1,
        pin: true,
        id: "work",
        anticipatePin: 1,
        invalidateOnRefresh: true,
        refreshPriority: -1,
      },
    });

    // Smoother horizontal scroll animation
    timeline.to(".work-flex", {
      x: -translateX,
      ease: "none",
      duration: 1,
    });

    // Add staggered work box animations
    const workBoxes = document.querySelectorAll('.work-box');
    workBoxes.forEach((box, index) => {
      gsap.fromTo(box.querySelectorAll('.work-info > *'), 
        { 
          opacity: 0, 
          y: 30,
          filter: "blur(5px)"
        },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: box,
            start: "left 80%",
            end: "right 20%",
            horizontal: true,
            toggleActions: "play none none reverse"
          }
        }
      );

      // Image hover animations
      const workImage = box.querySelector('.work-image');
      if (workImage) {
        gsap.set(workImage, { scale: 1 });
        
        workImage.addEventListener('mouseenter', () => {
          gsap.to(workImage, {
            scale: 1.05,
            duration: 0.4,
            ease: "power2.out"
          });
        });

        workImage.addEventListener('mouseleave', () => {
          gsap.to(workImage, {
            scale: 1,
            duration: 0.4,
            ease: "power2.out"
          });
        });
      }
    });

    // Responsive resize handler
    const handleResize = () => {
      updateTranslateX();
    };

    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      timeline.kill();
      ScrollTrigger.getById("work")?.kill();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="work-section" id="work" ref={workRef}>
      <div className="work-container section-container">
        <h2>
          My <span>Work</span>
        </h2>
        <div className="work-flex" ref={workFlexRef}>
          {[...Array(6)].map((_value, index) => (
            <div className="work-box" key={index}>
              <div className="work-info">
                <div className="work-title">
                  <h3>0{index + 1}</h3>
                  <div>
                    <h4>Project Name</h4>
                    <p>Category</p>
                  </div>
                </div>
                <h4>Tools and features</h4>
                <p>Javascript, TypeScript, React, Threejs</p>
              </div>
              <WorkImage image="/images/placeholder.webp" alt="" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Work;