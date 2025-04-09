import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="py-8 bg-[#4a5568] text-white">
      <div className="container mx-auto px-4 text-center">
        <motion.h2 
          className="font-['Great_Vibes'] text-3xl text-[#d4af7a] mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Jessica & Michael
        </motion.h2>
        
        <p className="font-['Cormorant_Garamond'] mb-4">November 12, 2023 | Portland, Oregon</p>
        
        <div className="h-[1px] w-24 mx-auto mb-4 bg-gradient-to-r from-transparent via-[#d4af7a] to-transparent"></div>
        
        <p className="text-sm text-[#a0aec0]">&copy; {new Date().getFullYear()} Jessica & Michael Wedding. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
