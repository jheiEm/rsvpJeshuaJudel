import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll event to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavLinkClick = () => {
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav 
      className={`fixed w-full bg-white bg-opacity-95 shadow-sm z-50 transition-all duration-300 ${
        isScrolled ? "py-2 shadow-md" : "py-3"
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <a href="#home" className="font-['Great_Vibes'] text-3xl text-[#6b0f2b]">
          Jeshua & Judel
        </a>
        
        <div className="hidden md:flex space-x-6">
          <a href="#home" className="font-['Cormorant_Garamond'] text-[#4a5568] hover:text-[#6b0f2b] transition-colors">
            Home
          </a>
          <a href="#story" className="font-['Cormorant_Garamond'] text-[#4a5568] hover:text-[#6b0f2b] transition-colors">
            Our Story
          </a>
          <a href="#details" className="font-['Cormorant_Garamond'] text-[#4a5568] hover:text-[#6b0f2b] transition-colors">
            Details
          </a>
          <a href="#entourage" className="font-['Cormorant_Garamond'] text-[#4a5568] hover:text-[#6b0f2b] transition-colors">
            Wedding Party
          </a>
          <a href="#gallery" className="font-['Cormorant_Garamond'] text-[#4a5568] hover:text-[#6b0f2b] transition-colors">
            Gallery
          </a>
          <a href="#rsvp" className="font-['Cormorant_Garamond'] text-[#4a5568] hover:text-[#6b0f2b] transition-colors">
            RSVP
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
                className="font-['Cormorant_Garamond'] text-[#4a5568] hover:text-[#6b0f2b] transition-colors"
                onClick={handleNavLinkClick}
              >
                Home
              </a>
              <a 
                href="#story" 
                className="font-['Cormorant_Garamond'] text-[#4a5568] hover:text-[#6b0f2b] transition-colors"
                onClick={handleNavLinkClick}
              >
                Our Story
              </a>
              <a 
                href="#details" 
                className="font-['Cormorant_Garamond'] text-[#4a5568] hover:text-[#6b0f2b] transition-colors"
                onClick={handleNavLinkClick}
              >
                Details
              </a>
              <a 
                href="#entourage" 
                className="font-['Cormorant_Garamond'] text-[#4a5568] hover:text-[#6b0f2b] transition-colors"
                onClick={handleNavLinkClick}
              >
                Wedding Party
              </a>
              <a 
                href="#gallery" 
                className="font-['Cormorant_Garamond'] text-[#4a5568] hover:text-[#6b0f2b] transition-colors"
                onClick={handleNavLinkClick}
              >
                Gallery
              </a>
              <a 
                href="#rsvp" 
                className="font-['Cormorant_Garamond'] text-[#4a5568] hover:text-[#6b0f2b] transition-colors"
                onClick={handleNavLinkClick}
              >
                RSVP
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navigation;
