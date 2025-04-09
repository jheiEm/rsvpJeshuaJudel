import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center" 
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1519741347686-c1e0aadf4611?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80')" }}
      ></div>
      <div className="absolute inset-0 bg-[#2d3748] bg-opacity-30"></div>
      
      <motion.div 
        className="relative z-10 text-center text-white px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h2 className="font-['Great_Vibes'] text-5xl md:text-7xl mb-6">Jessica & Michael</h2>
        <div className="h-[1px] w-24 mx-auto mb-6 bg-gradient-to-r from-transparent via-[#d4af7a] to-transparent"></div>
        <h3 className="font-['Cormorant_Garamond'] text-2xl md:text-3xl mb-8">Are getting married</h3>
        <p className="font-['Montserrat'] text-xl md:text-2xl">November 12, 2023</p>
        
        <motion.div 
          className="mt-12"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <a 
            href="#rsvp" 
            className="inline-block bg-[#d4af7a] text-white font-['Cormorant_Garamond'] px-8 py-3 rounded-md hover:bg-[#c9a66b] transition-colors transform hover:-translate-y-2 hover:shadow-lg duration-300"
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
