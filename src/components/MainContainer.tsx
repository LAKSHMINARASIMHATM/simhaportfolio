import { lazy, PropsWithChildren, Suspense, useEffect, useState, useCallback } from "react";
import About from "./About";
import Career from "./Career";
import Contact from "./Contact";
import Cursor from "./Cursor";
import Landing from "./Landing";
import Navbar from "./Navbar";
import SocialIcons from "./SocialIcons";
import WhatIDo from "./WhatIDo";
import Work from "./Work";
import setSplitText from "./utils/splitText";
import { debounce } from "lodash-es";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gsap } from "gsap";

gsap.registerPlugin(ScrollTrigger);

const TechStack = lazy(() => import("./TechStack"));

// Define breakpoints as constants for better maintainability
const BREAKPOINTS = {
  mobile: 576,
  tablet: 768,
  laptop: 992,
  desktop: 1200,
  large: 1600,
} as const;

type ViewportSize = 'mobile' | 'tablet' | 'laptop' | 'desktop' | 'large';

const MainContainer = ({ children }: PropsWithChildren) => {
  const [viewportSize, setViewportSize] = useState<ViewportSize>('desktop');
  const isMobileView = viewportSize === 'mobile' || viewportSize === 'tablet';

  // Enhanced resize handler with ScrollTrigger refresh
  const handleResize = useCallback(debounce(() => {
    const width = window.innerWidth;
    
    let newViewportSize: ViewportSize;
    if (width < BREAKPOINTS.tablet) {
      newViewportSize = 'mobile';
    } else if (width < BREAKPOINTS.laptop) {
      newViewportSize = 'tablet';
    } else if (width < BREAKPOINTS.desktop) {
      newViewportSize = 'laptop';
    } else if (width < BREAKPOINTS.large) {
      newViewportSize = 'desktop';
    } else {
      newViewportSize = 'large';
    }
    
    // Only update if viewport size actually changed
    if (newViewportSize !== viewportSize) {
      setViewportSize(newViewportSize);
    }
    
    // Update CSS custom properties for responsive design
    document.documentElement.style.setProperty('--viewport-width', `${width}px`);
    document.documentElement.style.setProperty('--viewport-height', `${window.innerHeight}px`);
    
    // Refresh ScrollTrigger and split text
    ScrollTrigger.refresh();
    setSplitText();
  }, 150), [viewportSize]);

  // Enhanced viewport height calculation for mobile browsers
  const updateViewportHeight = useCallback(() => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }, []);

  useEffect(() => {
    // Initial setup
    handleResize();
    updateViewportHeight();
    
    // Add event listeners with passive option for better performance
    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('orientationchange', () => {
      // Delay to ensure orientation change is complete
      setTimeout(() => {
        updateViewportHeight();
        handleResize();
      }, 100);
    }, { passive: true });
    
    // Update viewport height on scroll for mobile browsers
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateViewportHeight();
          ticking = false;
        });
        ticking = true;
      }
    };
    
    if (isMobileView) {
      window.addEventListener('scroll', handleScroll, { passive: true });
    }
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      window.removeEventListener('scroll', handleScroll);
      handleResize.cancel();
    };
  }, [handleResize, updateViewportHeight, isMobileView]);

  // Add viewport class to body for global styling
  useEffect(() => {
    const bodyClasses = [
      `viewport-${viewportSize}`,
      isMobileView ? 'mobile-view' : 'desktop-view'
    ];
    
    document.body.className = bodyClasses.join(' ');
    
    // Add data attributes for CSS targeting
    document.body.setAttribute('data-viewport', viewportSize);
    document.body.setAttribute('data-mobile', isMobileView.toString());
    
    return () => {
      document.body.className = '';
      document.body.removeAttribute('data-viewport');
      document.body.removeAttribute('data-mobile');
    };
  }, [viewportSize, isMobileView]);

  // Performance optimization: preload critical components
  useEffect(() => {
    if (!isMobileView) {
      // Preload TechStack component for desktop
      import("./TechStack").catch(console.error);
    }
  }, [isMobileView]);

  return (
    <div className={`main-container viewport-${viewportSize}`}>
      <Cursor />
      <Navbar isMobile={isMobileView} />
      <SocialIcons isMobile={isMobileView} />
      
      {!isMobileView && children}
      
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <div className="main-content">
            <Landing>{isMobileView && children}</Landing>
            <About />
            <WhatIDo />
            <Career />
            <Work />
            {!isMobileView && (
              <Suspense fallback={
                <div className="loading-placeholder" style={{
                  height: '100vh',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-accent)',
                  fontSize: '1.2rem'
                }}>
                  Loading Tech Stack...
                </div>
              }>
                <TechStack />
              </Suspense>
            )}
            <Contact />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContainer;