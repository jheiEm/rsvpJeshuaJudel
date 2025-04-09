import { motion } from "framer-motion";

const OurStory = () => {
  return (
    <section id="story" className="py-20 bg-[#faf7f2]">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="font-['Great_Vibes'] text-4xl md:text-5xl text-[#d4af7a] text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Our Love Story
        </motion.h2>
        
        <div className="max-w-4xl mx-auto">
          {/* How We Met */}
          <motion.div 
            className="grid md:grid-cols-2 gap-8 items-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="order-2 md:order-1">
              <h3 className="font-['Cormorant_Garamond'] text-2xl md:text-3xl text-[#4a5568] mb-4">How We Met</h3>
              <p className="text-[#718096]">
                We first crossed paths at a mutual friend's birthday party in 2018. Michael was immediately captivated by Jessica's laugh, while she couldn't help but notice his kind eyes and great sense of humor. After a night of conversation that felt like minutes, we exchanged numbers and the rest, as they say, is history.
              </p>
            </div>
            <motion.div 
              className="order-1 md:order-2"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3 }}
            >
              <img 
                src="https://images.unsplash.com/photo-1494774157365-9e04c6720e47?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Couple holding hands" 
                className="rounded-lg shadow-md w-full h-64 md:h-80 object-cover" 
              />
            </motion.div>
          </motion.div>
          
          {/* The Proposal */}
          <motion.div 
            className="grid md:grid-cols-2 gap-8 items-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <motion.div
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3 }}
            >
              <img 
                src="https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Couple's engagement" 
                className="rounded-lg shadow-md w-full h-64 md:h-80 object-cover" 
              />
            </motion.div>
            <div>
              <h3 className="font-['Cormorant_Garamond'] text-2xl md:text-3xl text-[#4a5568] mb-4">The Proposal</h3>
              <p className="text-[#718096]">
                After three wonderful years together, Michael planned an intimate picnic at our favorite spot overlooking the city. As the sun began to set, painting the sky in shades of pink and gold, he got down on one knee and asked Jessica to spend forever with him. Through happy tears, she said yes, and we began planning the next chapter of our journey together.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default OurStory;
