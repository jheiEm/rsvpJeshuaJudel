import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="py-8 bg-[#4a5568] text-white">
      <div className="container mx-auto px-4 text-center">
        <motion.h2
          className="font-['Great_Vibes'] text-3xl text-[#e8c1c8] mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Jeshua & Judel
        </motion.h2>

        <p className="font-['Cormorant_Garamond'] mb-4">
          May 3, 2025 | Lipa City, Philippines
        </p>

        <div className="h-[1px] w-24 mx-auto mb-4 bg-gradient-to-r from-transparent via-[#e8c1c8] to-transparent"></div>

        <p className="text-sm text-[#a0aec0]">
          &copy; {new Date().getFullYear()} Jeshua & Judel Wedding. All Rights
          Reserved.
        </p>
        <p className="text-sm text-[#a0aec0] mt-2">
          #JESHUANNABEWITHJUDELFOREVER
        </p>
      </div>
    </footer>
  );
};

export default Footer;
