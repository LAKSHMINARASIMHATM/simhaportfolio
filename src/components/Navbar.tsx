import { useEffect, useState, useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HoverLinks from "./HoverLinks";
import { gsap } from "gsap";
import "./styles/Navbar.css";
import { FiMenu, FiX } from "react-icons/fi";

gsap.registerPlugin(ScrollTrigger);

interface NavbarProps {
  isMobile?: boolean;
}

// Custom smoother implementation
// Export the smoother for use in other components
export const smoother = {
  scrollTop: (val: number) => {
    window.scrollTo(0, val);
  },
  paused: (val: boolean) => {
    document.body.style.overflow = val ? 'hidden' : 'auto';
    return val;
  }
};

const Navbar = ({ isMobile = false }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    document.body.style.overflow = !isMenuOpen ? 'hidden' : '';
  };

  // Close menu when clicking on a nav link
  const handleNavClick = () => {
    if (isMobile) {
      setIsMenuOpen(false);
      document.body.style.overflow = '';
    }
  };

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      if (navRef.current) {
        if (window.scrollY > 50) {
          navRef.current.classList.add('scrolled');
        } else {
          navRef.current.classList.remove('scrolled');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Setup smooth scrolling
  useEffect(() => {
    const wrapper = document.querySelector("#smooth-wrapper");
    const content = document.querySelector("#smooth-content");
    
    if (wrapper && content) {
      wrapper.setAttribute('style', 'position: relative; min-height: 100vh; overflow: hidden;');
      content.setAttribute('style', 'position: relative;');
    }

    smoother.scrollTop(0);
    smoother.paused(true);

    let links = document.querySelectorAll(".header ul a");
    links.forEach((elem) => {
      let element = elem as HTMLAnchorElement;
      element.addEventListener("click", (e) => {
        if (window.innerWidth > 1024) {
          e.preventDefault();
          let elem = e.currentTarget as HTMLAnchorElement;
          let section = elem.getAttribute("data-href");
          if (section) {
            const targetElement = document.querySelector(section);
            if (targetElement) {
              const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset;
              smoother.scrollTop(offsetTop);
            }
          }
        }
      });
    });

    window.addEventListener("resize", () => {
      ScrollTrigger.refresh(true);
    });
  }, []);

  return (
    <header 
      className={`header ${isMobile ? 'mobile' : ''} ${isMenuOpen ? 'menu-open' : ''}`} 
      ref={navRef}
    >
      <nav>
        <div className="logo">
          <a href="#home" onClick={handleNavClick}>
            <span>Portfolio</span>
          </a>
        </div>
        
        {isMobile && (
          <button 
            className="menu-toggle" 
            onClick={toggleMenu}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        )}
        
        <div className={`nav-links ${isMobile ? (isMenuOpen ? 'open' : '') : ''}`}>
          <ul>
            <li>
              <a data-href="#about" href="#about" onClick={handleNavClick}>
                <HoverLinks text="ABOUT" />
              </a>
            </li>
            <li>
              <a data-href="#work" href="#work" onClick={handleNavClick}>
                <HoverLinks text="WORK" />
              </a>
            </li>
            <li>
              <a data-href="#what" href="#what" onClick={handleNavClick}>
                <HoverLinks text="WHAT I DO" />
              </a>
            </li>
            <li>
              <a data-href="#career" href="#career" onClick={handleNavClick}>
                <HoverLinks text="CAREER" />
              </a>
            </li>
            <li>
              <a data-href="#contact" href="#contact" onClick={handleNavClick}>
                <HoverLinks text="CONTACT" />
              </a>
            </li>
            <li className="resume-download">
              <a 
                href="/resume.pdf" 
                className="resume-download-link"
                onClick={handleNavClick}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open resume in new tab"
              >
                <HoverLinks text="RESUME" />
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

// Export the Navbar component as default
export default Navbar;
