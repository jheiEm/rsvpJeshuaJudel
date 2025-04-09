import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center" 
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80')",
          backgroundPosition: "center"
        }}
      ></div>
      <div className="absolute inset-0 bg-[#6b0f2b] bg-opacity-20"></div>
      
      <motion.div 
        className="relative z-10 text-center text-white px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h3 className="font-['Cormorant_Garamond'] text-lg md:text-xl mb-2">TOGETHER WITH THEIR FAMILIES</h3>
        <h2 className="font-['Great_Vibes'] text-5xl md:text-7xl mb-6">Jeshua & Judel</h2>
        <div className="h-[1px] w-24 mx-auto mb-6 bg-gradient-to-r from-transparent via-[#6b0f2b] to-transparent"></div>
        <h3 className="font-['Cormorant_Garamond'] text-2xl md:text-3xl mb-8">INVITE YOU TO CELEBRATE THEIR WEDDING</h3>
        <p className="font-['Montserrat'] text-xl md:text-2xl">Saturday, May 03, 2025 at 1:00 PM</p>
        
        <motion.div 
          className="mt-12"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <a 
            href="#rsvp" 
            className="inline-block bg-[#6b0f2b] text-white font-['Cormorant_Garamond'] px-8 py-3 rounded-md hover:bg-[#890f32] transition-colors transform hover:-translate-y-2 hover:shadow-lg duration-300"
          >
            RSVP
          </a>
        </motion.div>
      </motion.div>
      
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
  );
};

export default HeroSection;
