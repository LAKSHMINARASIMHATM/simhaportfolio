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

  // Debounce resize handler to prevent excessive re-renders
  const handleResize = useCallback(debounce(() => {
    const width = window.innerWidth;
    
    if (width < BREAKPOINTS.tablet) {
      setViewportSize('mobile');
    } else if (width < BREAKPOINTS.laptop) {
      setViewportSize('tablet');
    } else if (width < BREAKPOINTS.desktop) {
      setViewportSize('laptop');
    } else if (width < BREAKPOINTS.large) {
      setViewportSize('desktop');
    } else {
      setViewportSize('large');
    }
    
    // Update split text after viewport change
    setSplitText();
  }, 100), []);

  useEffect(() => {
    // Initial setup
    handleResize();
    
    // Add event listeners
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      handleResize.cancel();
    };
  }, [handleResize]);

  // Add viewport class to body for global styling
  useEffect(() => {
    document.body.className = `viewport-${viewportSize}`;
    
    return () => {
      document.body.className = '';
    };
  }, [viewportSize]);

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
              <Suspense fallback={<div className="loading-placeholder">Loading Tech Stack...</div>}>
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
