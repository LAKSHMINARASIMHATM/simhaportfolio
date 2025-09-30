import {
  FaGithub,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
  FaFilePdf
} from "react-icons/fa6";
import "./styles/SocialIcons.css";
import { TbNotes } from "react-icons/tb";
import { useEffect, useState, useRef } from "react";
import HoverLinks from "./HoverLinks";
import { gsap } from "gsap";

interface SocialIconsProps {
  isMobile?: boolean;
}

// Import the PDF file (make sure to place your resume.pdf in the public folder)
const RESUME_PDF = "/resume.pdf";

const socialLinks = [
  { icon: <FaGithub />, url: "https://github.com" },
  { icon: <FaLinkedinIn />, url: "https://www.linkedin.com" },
  { icon: <FaXTwitter />, url: "https://x.com" },
  { icon: <FaInstagram />, url: "https://www.instagram.com" },
];

const SocialIcons = ({ isMobile = false }: SocialIconsProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const socialRef = useRef<HTMLDivElement>(null);
  const iconsRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Handle mouse move effect for desktop
  useEffect(() => {
    if (isMobile) return;
    
    const social = socialRef.current;
    if (!social) return;

    const updatePosition = (elem: HTMLElement, link: HTMLElement, e: MouseEvent) => {
      const rect = elem.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Only update position if mouse is within the icon bounds
      if (x > 0 && x < rect.width && y > 0 && y < rect.height) {
        link.style.setProperty("--siLeft", `${x}px`);
        link.style.setProperty("--siTop", `${y}px`);
      } else {
        link.style.setProperty("--siLeft", `${centerX}px`);
        link.style.setProperty("--siTop", `${centerY}px`);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!social) return;
      
      social.querySelectorAll(".social-icon").forEach((item) => {
        const elem = item as HTMLElement;
        const link = elem.querySelector("a") as HTMLElement;
        if (link) {
          updatePosition(elem, link, e);
        }
      });
    };

    // Set initial positions
    social.querySelectorAll(".social-icon").forEach((item) => {
      const elem = item as HTMLElement;
      const link = elem.querySelector("a") as HTMLElement;
      if (link) {
        const rect = elem.getBoundingClientRect();
        link.style.setProperty("--siLeft", `${rect.width / 2}px`);
        link.style.setProperty("--siTop", `${rect.height / 2}px`);
      }
    });

    window.addEventListener("mousemove", handleMouseMove);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isMobile]);

  // Animate icons for mobile
  useEffect(() => {
    if (!isMobile || !iconsRef.current) return;
    
    const icons = Array.from(iconsRef.current.children) as HTMLElement[];
    
    if (isMenuOpen) {
      // Animate in
      gsap.to(icons, {
        y: (i) => i * -60 - 20,
        opacity: 1,
        duration: 0.3,
        stagger: 0.1,
        ease: "power2.out"
      });
    } else {
      // Animate out
      gsap.to(icons, {
        y: 0,
        opacity: 0,
        duration: 0.2,
        stagger: 0.05,
        ease: "power2.in"
      });
    }
  }, [isMenuOpen, isMobile]);
  // Render mobile menu toggle button
  if (isMobile) {
    return (
      <div className={`mobile-social-icons ${isMenuOpen ? 'open' : ''}`}>
        <div className="mobile-social-toggle" onClick={toggleMenu}>
          <div className={`mobile-social-icon ${isMenuOpen ? 'open' : ''}`}>
            {isMenuOpen ? <FaFilePdf /> : <FaGithub />}
          </div>
        </div>
        <div className="mobile-social-menu" ref={iconsRef}>
          {socialLinks.map((link, index) => (
            <a 
              key={index} 
              href={link.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="mobile-social-link"
              style={{ '--i': index } as React.CSSProperties}
            >
              {link.icon}
            </a>
          ))}
        </div>
      </div>
    );
  }

  // Desktop version
  return (
    <div className="icons-section">
      <div className="social-icons" data-cursor="icons" id="social" ref={socialRef}>
        {socialLinks.map((link, index) => (
          <span key={index} className="social-icon">
            <a 
              href={link.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-link"
            >
              {link.icon}
            </a>
          </span>
        ))}
      </div>
      <a 
        className="resume-button" 
        href={RESUME_PDF}
        target="_blank"
        rel="noopener noreferrer"
        ref={buttonRef}
        aria-label="View Resume"
      >
        <HoverLinks text="RESUME" />
        <span className="resume-icon">
          <FaFilePdf />
        </span>
      </a>
    </div>
  );
};

export default SocialIcons;
