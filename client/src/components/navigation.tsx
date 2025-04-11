import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home'); // Added state for active section

  // Handle scroll event to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
      //Added logic to detect active section based on scroll position.  This is a simplified example and may need adjustment based on your section IDs and heights.
      const sections = document.querySelectorAll('section');
      sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top >= 0 && rect.top <= window.innerHeight / 2) {
          setActiveSection(section.id);
        }
      });

    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavLinkClick = (section) => {
    setActiveSection(section); //Update active section on link click.
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav
      className={`fixed w-full bg-white bg-opacity-95 shadow-sm z-[100] transition-all duration-300 ${
        isScrolled ? "py-2 shadow-md" : "py-3"
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <a
          href="#home"
          className="font-['Great_Vibes'] text-3xl text-[#6b0f2b]"
        >
          J & J
        </a>

        <div className="hidden md:flex space-x-6">
          <a
            href="#home"
            onClick={() => handleNavLinkClick('home')} //added onClick for active section tracking
            className={`font-['Cormorant_Garamond'] transition-colors ${
              activeSection === 'home'
                ? 'text-[#6b0f2b] font-semibold'
                : 'text-[#4a5568] hover:text-[#6b0f2b]'
            }`}
          >
            Home
          </a>
          <a
            href="#story"
            onClick={() => handleNavLinkClick('story')} //added onClick for active section tracking
            className={`font-['Cormorant_Garamond'] transition-colors ${
              activeSection === 'story'
                ? 'text-[#6b0f2b] font-semibold'
                : 'text-[#4a5568] hover:text-[#6b0f2b]'
            }`}
          >
            Our Story
          </a>
          <a
            href="#details"
            onClick={() => handleNavLinkClick('details')} //added onClick for active section tracking
            className={`font-['Cormorant_Garamond'] transition-colors ${
              activeSection === 'details'
                ? 'text-[#6b0f2b] font-semibold'
                : 'text-[#4a5568] hover:text-[#6b0f2b]'
            }`}
          >
            Details
          </a>
          <a
            href="#entourage"
            onClick={() => handleNavLinkClick('entourage')} //added onClick for active section tracking
            className={`font-['Cormorant_Garamond'] transition-colors ${
              activeSection === 'entourage'
                ? 'text-[#6b0f2b] font-semibold'
                : 'text-[#4a5568] hover:text-[#6b0f2b]'
            }`}
          >
            Wedding Party
          </a>
          <a
            href="#gallery"
            onClick={() => handleNavLinkClick('gallery')} //added onClick for active section tracking
            className={`font-['Cormorant_Garamond'] transition-colors ${
              activeSection === 'gallery'
                ? 'text-[#6b0f2b] font-semibold'
                : 'text-[#4a5568] hover:text-[#6b0f2b]'
            }`}
          >
            Gallery
          </a>
          <a
            href="#rsvp"
            onClick={() => handleNavLinkClick('rsvp')} //added onClick for active section tracking
            className={`font-['Cormorant_Garamond'] transition-colors ${
              activeSection === 'rsvp'
                ? 'text-[#6b0f2b] font-semibold'
                : 'text-[#4a5568] hover:text-[#6b0f2b]'
            }`}
          >
            RSVP
          </a>
          <a
            href="#messages"
            onClick={() => handleNavLinkClick('messages')} //added onClick for active section tracking
            className={`font-['Cormorant_Garamond'] transition-colors ${
              activeSection === 'messages'
                ? 'text-[#6b0f2b] font-semibold'
                : 'text-[#4a5568] hover:text-[#6b0f2b]'
            }`}
          >
            Messages
          </a>
        </div>

        <button
          className="md:hidden text-[#6b0f2b]"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden bg-white py-4 absolute w-full"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container mx-auto px-4 flex flex-col space-y-4">
              <a
                href="#home"
                onClick={() => handleNavLinkClick('home')} //added onClick for active section tracking
                className={`font-['Cormorant_Garamond'] transition-colors ${
                  activeSection === 'home'
                    ? 'text-[#6b0f2b] font-semibold'
                    : 'text-[#4a5568] hover:text-[#6b0f2b]'
                }`}
              >
                Home
              </a>
              <a
                href="#story"
                onClick={() => handleNavLinkClick('story')} //added onClick for active section tracking
                className={`font-['Cormorant_Garamond'] transition-colors ${
                  activeSection === 'story'
                    ? 'text-[#6b0f2b] font-semibold'
                    : 'text-[#4a5568] hover:text-[#6b0f2b]'
                }`}
              >
                Our Story
              </a>
              <a
                href="#details"
                onClick={() => handleNavLinkClick('details')} //added onClick for active section tracking
                className={`font-['Cormorant_Garamond'] transition-colors ${
                  activeSection === 'details'
                    ? 'text-[#6b0f2b] font-semibold'
                    : 'text-[#4a5568] hover:text-[#6b0f2b]'
                }`}
              >
                Details
              </a>
              <a
                href="#entourage"
                onClick={() => handleNavLinkClick('entourage')} //added onClick for active section tracking
                className={`font-['Cormorant_Garamond'] transition-colors ${
                  activeSection === 'entourage'
                    ? 'text-[#6b0f2b] font-semibold'
                    : 'text-[#4a5568] hover:text-[#6b0f2b]'
                }`}
              >
                Wedding Party
              </a>
              <a
                href="#gallery"
                onClick={() => handleNavLinkClick('gallery')} //added onClick for active section tracking
                className={`font-['Cormorant_Garamond'] transition-colors ${
                  activeSection === 'gallery'
                    ? 'text-[#6b0f2b] font-semibold'
                    : 'text-[#4a5568] hover:text-[#6b0f2b]'
                }`}
              >
                Gallery
              </a>
              <a
                href="#rsvp"
                onClick={() => handleNavLinkClick('rsvp')} //added onClick for active section tracking
                className={`font-['Cormorant_Garamond'] transition-colors ${
                  activeSection === 'rsvp'
                    ? 'text-[#6b0f2b] font-semibold'
                    : 'text-[#4a5568] hover:text-[#6b0f2b]'
                }`}
              >
                RSVP
              </a>
              <a
                href="#messages"
                onClick={() => handleNavLinkClick('messages')} //added onClick for active section tracking
                className={`font-['Cormorant_Garamond'] transition-colors ${
                  activeSection === 'messages'
                    ? 'text-[#6b0f2b] font-semibold'
                    : 'text-[#4a5568] hover:text-[#6b0f2b]'
                }`}
              >
                Messages
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navigation;