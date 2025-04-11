import { ChevronDown, Play, Pause } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useCallback } from "react";

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
}

const AutoScrollButton = ({ isAutoScrolling, toggleAutoScroll }: AutoScrollProps) => {
  return (
    <motion.button
      onClick={toggleAutoScroll}
      className={`fixed bottom-24 right-6 z-50 p-3 rounded-full flex items-center justify-center ${
        isAutoScrolling ? 'bg-white text-[#6b0f2b]' : 'bg-[#6b0f2b] text-white'
      } shadow-lg`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {isAutoScrolling ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
    </motion.button>
  );
};

const HeroSection = () => {
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [currentScrollPosition, setCurrentScrollPosition] = useState(0);
  const [scrollInterval, setScrollInterval] = useState<NodeJS.Timeout | null>(null);

  // Auto-scroll function
  const autoScroll = useCallback(() => {
    if (isAutoScrolling) {
      // Get document height
      const documentHeight = Math.max(
        document.body.scrollHeight, 
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight
      );
      
      // Calculate new position (scroll 1px every 15ms for smooth scrolling)
      const newPosition = window.scrollY + 1;
      
      // If we've reached the bottom, stop auto-scrolling
      if (newPosition >= documentHeight - window.innerHeight) {
        setIsAutoScrolling(false);
        if (scrollInterval) clearInterval(scrollInterval);
        return;
      }
      
      // Scroll to new position
      window.scrollTo({
        top: newPosition,
        behavior: "auto" // Using auto for smoother continuous scrolling
      });
      
      // Save current position
      setCurrentScrollPosition(newPosition);
    }
  }, [isAutoScrolling, scrollInterval]);

  const toggleAutoScroll = useCallback(() => {
    setIsAutoScrolling(prev => !prev);
  }, []);

  // Set up or clear the auto-scroll interval based on isAutoScrolling
  useEffect(() => {
    if (isAutoScrolling) {
      const interval = setInterval(autoScroll, 15); // Adjust timing for speed
      setScrollInterval(interval);
    } else {
      if (scrollInterval) {
        clearInterval(scrollInterval);
        setScrollInterval(null);
      }
    }
    
    return () => {
      if (scrollInterval) clearInterval(scrollInterval);
    };
  }, [isAutoScrolling, autoScroll, scrollInterval]);

  // Add event listeners to pause auto-scroll when user interacts
  useEffect(() => {
    const pauseOnUserInteraction = () => {
      if (isAutoScrolling) {
        setIsAutoScrolling(false);
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
              {isAutoScrolling ? "PAUSE TOUR" : "START TOUR"}
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
      
      {/* Floating auto-scroll button that's always visible */}
      <AutoScrollButton isAutoScrolling={isAutoScrolling} toggleAutoScroll={toggleAutoScroll} />
    </>
  );
};

export default HeroSection;
