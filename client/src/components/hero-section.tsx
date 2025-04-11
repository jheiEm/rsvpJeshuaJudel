import { ChevronDown, Play, Pause, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useCallback, useRef } from "react";

// Define burgundy color palette
const BURGUNDY = {
  dark: "#4a0d1f",
  main: "#6b0f2b",
  light: "#8a1538",
  accent: "#b52548",
  pale: "#f8e7eb",
  overlay: "rgba(107, 15, 43, 0.5)"
};

interface AutoScrollProps {
  isAutoScrolling: boolean;
  toggleAutoScroll: () => void;
  scrollProgress: number;
  sectionTitles: string[];
  currentSectionIndex: number;
}

const AutoScrollButton = ({ 
  isAutoScrolling, 
  toggleAutoScroll,
  scrollProgress,
  sectionTitles,
  currentSectionIndex
}: AutoScrollProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end space-y-2">
      {/* Progress indicator */}
      <motion.div 
        className="relative rounded-lg p-4 bg-white/90 backdrop-blur-sm shadow-lg max-w-xs overflow-hidden"
        initial={{ opacity: 0, height: 0, width: 0 }}
        animate={{ 
          opacity: isExpanded ? 1 : 0, 
          height: isExpanded ? 'auto' : 0,
          width: isExpanded ? 250 : 0,
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="mb-2 text-[#6b0f2b] font-semibold text-sm">
          {currentSectionIndex >= 0 && currentSectionIndex < sectionTitles.length ? (
            <span>Now viewing: {sectionTitles[currentSectionIndex]}</span>
          ) : (
            <span>Wedding Tour</span>
          )}
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-[#6b0f2b] to-[#b52548]"
            initial={{ width: '0%' }}
            animate={{ width: `${scrollProgress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <div className="mt-3 space-y-2 max-h-32 overflow-y-auto pr-2">
          {sectionTitles.map((title, index) => (
            <div 
              key={index}
              className={`text-xs py-1 px-2 rounded flex items-center transition-colors ${
                index === currentSectionIndex
                  ? 'bg-[#f8e7eb] text-[#6b0f2b] font-medium'
                  : 'text-gray-500'
              }`}
            >
              <div className={`w-2 h-2 rounded-full mr-2 ${
                index === currentSectionIndex ? 'bg-[#6b0f2b]' : 'bg-gray-300'
              }`}></div>
              {title}
            </div>
          ))}
        </div>
      </motion.div>
      
      {/* Toggle expansion button */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className="bg-white text-[#6b0f2b] p-2 rounded-full shadow-lg"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isExpanded ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronUp className="h-4 w-4" />
        )}
      </motion.button>
      
      {/* Play/Pause button */}
      <motion.button
        onClick={toggleAutoScroll}
        className={`p-3 rounded-full flex items-center justify-center shadow-lg border ${
          isAutoScrolling 
            ? 'bg-white text-[#6b0f2b] border-[#6b0f2b]' 
            : 'bg-[#6b0f2b] text-white border-white'
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {isAutoScrolling ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
      </motion.button>
    </div>
  );
};

// Define the sections we want to scroll through
const SECTIONS = [
  { id: "home", title: "Home" },
  { id: "countdown", title: "Countdown" },
  { id: "story", title: "Our Story" },
  { id: "details", title: "Event Details" },
  { id: "schedule", title: "Schedule" },
  { id: "entourage", title: "Wedding Party" },
  { id: "gallery", title: "Gallery" },
  { id: "rsvp", title: "RSVP" },
  { id: "guest-messages", title: "Guest Messages" },
  { id: "contact-us", title: "Contact" }
];

const HeroSection = () => {
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [targetSection, setTargetSection] = useState<string | null>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const sectionRefs = useRef<{[key: string]: HTMLElement | null}>({});

  // Monitor scroll position to update progress
  useEffect(() => {
    const updateScrollProgress = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = Math.max(
        document.body.scrollHeight, 
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight
      );
      
      const scrolled = window.scrollY;
      const maxScroll = documentHeight - windowHeight;
      const progress = (scrolled / maxScroll) * 100;
      
      setScrollProgress(Math.min(Math.max(progress, 0), 100));
      
      // Update current section based on scroll position
      SECTIONS.forEach((section, index) => {
        const el = document.getElementById(section.id);
        if (el) {
          sectionRefs.current[section.id] = el;
          
          // Get the element's position relative to the viewport
          const rect = el.getBoundingClientRect();
          
          // If the element is in view (with some buffer for transitions)
          if (rect.top <= windowHeight * 0.3 && rect.bottom >= 0) {
            setCurrentSectionIndex(index);
          }
        }
      });
    };
    
    window.addEventListener('scroll', updateScrollProgress);
    return () => window.removeEventListener('scroll', updateScrollProgress);
  }, []);

  // Smooth section scroll function
  const scrollToSection = useCallback((sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      window.scrollTo({
        top: section.offsetTop,
        behavior: 'smooth'
      });
    }
  }, []);

  // Auto-scroll function with section-by-section navigation
  const startAutoScroll = useCallback(() => {
    if (isAutoScrolling) {
      let nextIndex = currentSectionIndex;
      if (currentSectionIndex < SECTIONS.length - 1) {
        nextIndex = currentSectionIndex + 1;
      } else {
        // We've reached the end, stop auto-scrolling
        setIsAutoScrolling(false);
        return;
      }
      
      // Set the target section for scrolling
      const targetSectionId = SECTIONS[nextIndex].id;
      setTargetSection(targetSectionId);
      
      // Scroll to that section
      scrollToSection(targetSectionId);
      
      // Set a timeout for the next scroll action, allowing time for animation
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      
      scrollTimeoutRef.current = setTimeout(() => {
        startAutoScroll();
      }, 5000); // Wait 5 seconds at each section
    }
  }, [isAutoScrolling, currentSectionIndex, scrollToSection]);

  // Toggle auto-scrolling
  const toggleAutoScroll = useCallback(() => {
    setIsAutoScrolling(prev => {
      if (!prev) {
        // If we're starting auto-scroll, begin from the current section
        return true;
      } else {
        // If we're stopping, clear any pending timeouts
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
          scrollTimeoutRef.current = null;
        }
        return false;
      }
    });
  }, []);

  // Start or stop auto-scrolling based on state
  useEffect(() => {
    if (isAutoScrolling) {
      startAutoScroll();
    } else if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = null;
    }
    
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [isAutoScrolling, startAutoScroll]);

  // Add event listeners to pause auto-scroll when user interacts
  useEffect(() => {
    const pauseOnUserInteraction = () => {
      if (isAutoScrolling) {
        setIsAutoScrolling(false);
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
          scrollTimeoutRef.current = null;
        }
      }
    };
    
    window.addEventListener('wheel', pauseOnUserInteraction);
    window.addEventListener('touchmove', pauseOnUserInteraction);
    window.addEventListener('keydown', pauseOnUserInteraction);
    
    return () => {
      window.removeEventListener('wheel', pauseOnUserInteraction);
      window.removeEventListener('touchmove', pauseOnUserInteraction);
      window.removeEventListener('keydown', pauseOnUserInteraction);
    };
  }, [isAutoScrolling]);

  return (
    <>
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background image with overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80')",
            backgroundPosition: "center",
          }}
        ></div>
        
        {/* Burgundy gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#4a0d1f]/40 via-[#6b0f2b]/30 to-[#8a1538]/40"></div>
        
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <svg className="absolute opacity-10 -top-20 -left-20 w-64 h-64 text-[#b52548]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="50" fill="currentColor" />
          </svg>
          <svg className="absolute opacity-10 -bottom-20 -right-20 w-80 h-80 text-[#6b0f2b]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="50" fill="currentColor" />
          </svg>
        </div>
        
        {/* Content */}
        <motion.div 
          className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <motion.h3 
            className="font-['Cormorant_Garamond'] text-lg md:text-xl mb-3 tracking-wider"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            TOGETHER WITH THEIR FAMILIES
          </motion.h3>
          
          <motion.h2 
            className="font-['Great_Vibes'] text-6xl md:text-8xl mb-6 text-[#f8e7eb] drop-shadow-lg"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            Jeshua & Judel
          </motion.h2>
          
          <motion.div 
            className="h-[2px] w-36 mx-auto mb-8 bg-gradient-to-r from-transparent via-[#b52548] to-transparent"
            initial={{ width: 0 }}
            animate={{ width: "9rem" }}
            transition={{ duration: 1.2, delay: 0.6 }}
          ></motion.div>
          
          <motion.h3 
            className="font-['Cormorant_Garamond'] text-2xl md:text-3xl mb-8 tracking-wide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            INVITE YOU TO CELEBRATE THEIR WEDDING
          </motion.h3>
          
          <motion.div
            className="px-6 py-4 backdrop-blur-sm bg-[#4a0d1f]/30 rounded-lg inline-block mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <p className="font-['Montserrat'] text-xl md:text-2xl font-light">Saturday, May 03, 2025 at 1:00 PM</p>
          </motion.div>
          
          <motion.div 
            className="mt-8 space-x-4 flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <motion.a 
              href="#rsvp" 
              className="inline-block bg-[#6b0f2b] text-white font-['Cormorant_Garamond'] px-8 py-3 rounded-md border-2 border-[#8a1538] shadow-lg tracking-wider"
              whileHover={{ 
                scale: 1.05, 
                backgroundColor: "#8a1538",
                boxShadow: "0 10px 25px -5px rgba(107, 15, 43, 0.3), 0 8px 10px -6px rgba(107, 15, 43, 0.2)"
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              RSVP
            </motion.a>
            
            <motion.button
              onClick={toggleAutoScroll}
              className="inline-block bg-transparent text-white font-['Cormorant_Garamond'] px-8 py-3 rounded-md border-2 border-white hover:bg-white hover:text-[#6b0f2b] transition-colors tracking-wider"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 10px 25px -5px rgba(255, 255, 255, 0.3), 0 8px 10px -6px rgba(255, 255, 255, 0.2)"
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              {isAutoScrolling ? "PAUSE TOUR" : "START PRESENTATION"}
            </motion.button>
          </motion.div>
        </motion.div>
        
        {/* Scroll down indicator */}
        <motion.div 
          className="absolute bottom-10 left-0 right-0 text-center"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <a href="#countdown" className="text-white">
            <ChevronDown className="h-8 w-8 mx-auto" />
          </a>
        </motion.div>
      </section>
      
      {/* Floating auto-scroll button and progress indicator */}
      <AutoScrollButton 
        isAutoScrolling={isAutoScrolling} 
        toggleAutoScroll={toggleAutoScroll} 
        scrollProgress={scrollProgress}
        sectionTitles={SECTIONS.map(s => s.title)}
        currentSectionIndex={currentSectionIndex}
      />

      {/* Section transition animation */}
      <AnimatePresence>
        {targetSection && isAutoScrolling && (
          <motion.div
            key="section-transition"
            className="fixed inset-0 z-[60] pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-[#4a0d1f]/10 via-[#6b0f2b]/10 to-[#8a1538]/10 backdrop-blur-sm" />
            <div className="flex h-full items-center justify-center">
              <motion.div
                className="text-white text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="font-['Great_Vibes'] text-4xl mb-2">
                  {SECTIONS.find(s => s.id === targetSection)?.title}
                </div>
                <div className="w-24 h-[2px] mx-auto bg-white opacity-60" />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default HeroSection;
