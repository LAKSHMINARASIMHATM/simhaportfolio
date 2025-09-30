import { useEffect, useState, useRef } from "react";
import "./styles/Loading.css";
import { useLoading } from "../context/LoadingProvider";
import Marquee from "react-fast-marquee";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
  gsap.config({
    force3D: true,
    autoSleep: 60,
    nullTargetWarn: false,
  });
}

const Loading = ({ percent = 0 }: { percent?: number }) => {
  const [displayPercent, setDisplayPercent] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [clicked, setClicked] = useState(false);
  const { setIsLoading } = useLoading();
  const loadingRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Handle loading completion with smooth animations
  useEffect(() => {
    if (percent >= 100 && !loaded) {
      setLoaded(true);
      
      // Add loaded class to the loading screen
      if (loadingRef.current) {
        loadingRef.current.classList.add('loading-complete');
      }
      
      // Animate progress bar to 100% if it's not already there
      if (progressBarRef.current) {
        gsap.killTweensOf(progressBarRef.current);
        gsap.to(progressBarRef.current, {
          width: '100%',
          duration: 0.5,
          ease: 'power2.out',
          onComplete: () => {
            // After progress bar fills up, show welcome button
            setTimeout(() => {
              setClicked(true);
              
              // Animate content out
              if (contentRef.current) {
                gsap.to(contentRef.current, {
                  opacity: 0,
                  y: -20,
                  duration: 0.5,
                  ease: 'power2.inOut',
                  onComplete: () => {
                    // Simulate loading completion
                    setTimeout(() => {
                      import("./utils/initialFX")
                        .then((module) => {
                          if (module.initialFX) {
                            module.initialFX();
                          }
                        })
                        .catch(console.error)
                        .finally(() => {
                          // Small delay before hiding the loading screen
                          setTimeout(() => {
                            setIsLoading(false);
                          }, 300);
                        });
                    }, 300);
                  }
                });
              }
            }, 500);
          }
        });
      }
    }
  }, [percent, setIsLoading, loaded]);

  // Smoothly animate the progress bar with GSAP
  useEffect(() => {
    if (percent > displayPercent) {
      // Clear any existing timeouts to prevent stacking
      const timer = setTimeout(() => {
        setDisplayPercent(prev => {
          const next = Math.min(prev + 1, percent);
          
          // Update progress bar width with GSAP for smooth animation
          if (progressBarRef.current) {
            gsap.killTweensOf(progressBarRef.current);
            gsap.to(progressBarRef.current, {
              width: `${next}%`,
              duration: 0.3,
              ease: 'power1.out',
              overwrite: true
            });
          }
          
          return next;
        });
      }, 10);
      
      return () => clearTimeout(timer);
    } else if (percent < displayPercent) {
      // Handle case where percent decreases (shouldn't normally happen)
      setDisplayPercent(percent);
    }
  }, [percent, displayPercent]);

  function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
    const { currentTarget: target } = e;
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    target.style.setProperty("--mouse-x", `${x}px`);
    target.style.setProperty("--mouse-y", `${y}px`);
  }

  // Set focus to loading container for screen readers
  useEffect(() => {
    if (loadingRef.current) {
      loadingRef.current.focus();
    }
  }, []);

  return (
    <div 
      className="loading-screen" 
      ref={loadingRef}
      role="status"
      aria-live="polite"
      aria-atomic="true"
      tabIndex={-1}
    >
      {/* Animated Background */}
      <div className="loading-background">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="loading-particle" />
        ))}
      </div>
      
      {/* Header with Logo */}
      <div className="loading-header">
        <a 
          href="/#" 
          className="loader-title" 
          data-cursor="disable"
          aria-label="Return to home"
        >
          Portfolio
        </a>
        <div className={`loaderGame ${clicked ? "loader-out" : ""}`}>
          <div className="loaderGame-container">
            <div className="loaderGame-in">
              {[...Array(27)].map((_, index) => (
                <div 
                  className="loaderGame-line" 
                  key={index}
                  style={{
                    animationDelay: `${index * 0.05}s`,
                    transform: `rotate(${index * 13.33}deg)`
                  }}
                />
              ))}
            </div>
            <div className="loaderGame-ball"></div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="loading-content-wrapper" ref={contentRef}>
        <div className="loading-marquee" aria-hidden="true">
          <Marquee speed={30} gradient={false}>
            <span>• Creative Developer • UI/UX Designer • Problem Solver •</span>
          </Marquee>
        </div>
        
        <div 
          className="loading-progress-container"
          role="progressbar"
          aria-valuenow={displayPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Loading progress"
        >
          <div className="loading-progress-bar" ref={progressBarRef} />
          <div className="loading-percentage" aria-hidden="true">
            {displayPercent}%
          </div>
        </div>
        
        <div 
          className={`loading-button ${loaded ? "loaded" : ""} ${clicked ? "clicked" : ""}`}
          onMouseMove={handleMouseMove}
        >
          <div className="loading-button-content">
            {!loaded ? (
              <>
                <span className="loading-text">Loading</span>
                <span className="loading-dots">
                  <span className="dot">.</span>
                  <span className="dot">.</span>
                  <span className="dot">.</span>
                </span>
              </>
            ) : (
              <span className="welcome-text">Welcome</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;

export const setProgress = (setLoading: (value: number) => void) => {
  let percent: number = 0;

  let interval = setInterval(() => {
    if (percent <= 50) {
      let rand = Math.round(Math.random() * 5);
      percent = percent + rand;
      setLoading(percent);
    } else {
      clearInterval(interval);
      interval = setInterval(() => {
        percent = percent + Math.round(Math.random());
        setLoading(percent);
        if (percent > 91) {
          clearInterval(interval);
        }
      }, 2000);
    }
  }, 100);

  function clear() {
    clearInterval(interval);
    setLoading(100);
  }

  function loaded() {
    return new Promise<number>((resolve) => {
      clearInterval(interval);
      interval = setInterval(() => {
        if (percent < 100) {
          percent++;
          setLoading(percent);
        } else {
          resolve(percent);
          clearInterval(interval);
        }
      }, 2);
    });
  }
  return { loaded, percent, clear };
};
