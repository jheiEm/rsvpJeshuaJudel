import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

// Define burgundy color palette
const BURGUNDY = {
  dark: "#4a0d1f",
  main: "#6b0f2b",
  light: "#8a1538",
  accent: "#b52548",
  pale: "#f8e7eb",
  overlay: "rgba(107, 15, 43, 0.5)",
};

const HeroSection = () => {
  return (
    <section
      id="home"
      className="relative h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <svg
          className="absolute opacity-10 -top-20 -left-20 w-64 h-64 text-[#b52548]"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="50" cy="50" r="50" fill="currentColor" />
        </svg>
        <svg
          className="absolute opacity-10 -bottom-20 -right-20 w-80 h-80 text-[#6b0f2b]"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
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
          className="font-['Cormorant_Garamond'] text-lg md:text-xl mb-3 tracking-wider text-[#820000]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          TOGETHER WITH THEIR FAMILIES
        </motion.h3>

        <motion.h2
          className="font-['Great_Vibes'] text-6xl md:text-8xl mb-6 text-[#a70128] drop-shadow-lg"
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
          className="font-['Cormorant_Garamond'] text-2xl md:text-3xl mb-8 tracking-wide text-[#820000]"
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
          <p className="font-['Montserrat'] text-xl md:text-2xl font-light">
            Saturday, May 03, 2025 at 12:30 PM
          </p>
        </motion.div>

        <motion.div
          className="mt-8"
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
              boxShadow:
                "0 10px 25px -5px rgba(107, 15, 43, 0.3), 0 8px 10px -6px rgba(107, 15, 43, 0.2)",
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            RSVP
          </motion.a>
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
  );
};

export default HeroSection;
