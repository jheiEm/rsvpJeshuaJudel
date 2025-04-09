import { motion } from "framer-motion";

const OurStory = () => {
  return (
    <section id="story" className="py-20 bg-[#fff5f7] relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-40 h-40 opacity-10">
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <path d="M50,0 C77.6,0 100,22.4 100,50 C100,77.6 77.6,100 50,100 C22.4,100 0,77.6 0,50 C0,22.4 22.4,0 50,0 Z" fill="#6b0f2b" fillRule="evenodd" />
        </svg>
      </div>
      <div className="absolute bottom-0 right-0 w-60 h-60 opacity-10">
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <path d="M50,0 C77.6,0 100,22.4 100,50 C100,77.6 77.6,100 50,100 C22.4,100 0,77.6 0,50 C0,22.4 22.4,0 50,0 Z" fill="#6b0f2b" fillRule="evenodd" />
        </svg>
      </div>
      
      <div className="container mx-auto px-4">
        <motion.h2 
          className="font-['Great_Vibes'] text-4xl md:text-5xl text-[#6b0f2b] text-center mb-16 relative"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Our Love Story
          <div className="absolute h-[2px] w-40 bg-gradient-to-r from-transparent via-[#6b0f2b] to-transparent mx-auto left-1/2 transform -translate-x-1/2 bottom-[-0.5rem]"></div>
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
            <div className="order-2 md:order-1 bg-white bg-opacity-70 p-6 rounded-lg shadow-sm border border-[#e8c1c8]">
              <h3 className="font-['Cormorant_Garamond'] text-2xl md:text-3xl text-[#6b0f2b] mb-4 pb-2 border-b border-[#e8c1c8]">How We Met</h3>
              <p className="text-[#4a5568] font-['Cormorant_Garamond'] tracking-wide text-lg">
                We first met at the University of Santo Tomas in 2014. Jeshua was a Civil Engineering student and Judel was taking up Education. Our paths crossed during a university event, and we instantly connected over our shared love for music and travel. What started as a friendship soon blossomed into something more beautiful.
              </p>
            </div>
            <motion.div 
              className="order-1 md:order-2"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3 }}
            >
              <img 
                src="https://images.unsplash.com/photo-1583157763403-b916257d1f7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Couple holding hands" 
                className="rounded-lg shadow-md w-full h-64 md:h-80 object-cover border-4 border-white" 
              />
            </motion.div>
          </motion.div>
          
          {/* The Journey */}
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
                alt="Couple's journey" 
                className="rounded-lg shadow-md w-full h-64 md:h-80 object-cover border-4 border-white" 
              />
            </motion.div>
            <div className="bg-white bg-opacity-70 p-6 rounded-lg shadow-sm border border-[#e8c1c8]">
              <h3 className="font-['Cormorant_Garamond'] text-2xl md:text-3xl text-[#6b0f2b] mb-4 pb-2 border-b border-[#e8c1c8]">Our Journey</h3>
              <p className="text-[#4a5568] font-['Cormorant_Garamond'] tracking-wide text-lg">
                Through 9 years of adventures, challenges, and growth, our love only grew stronger. We've traveled together, supported each other through career changes, and built a strong foundation of trust and respect. Each day, we've learned something new about each other, and that's what makes our journey so special.
              </p>
            </div>
          </motion.div>
          
          {/* The Proposal */}
          <motion.div 
            className="grid md:grid-cols-2 gap-8 items-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="order-2 md:order-1 bg-white bg-opacity-70 p-6 rounded-lg shadow-sm border border-[#e8c1c8]">
              <h3 className="font-['Cormorant_Garamond'] text-2xl md:text-3xl text-[#6b0f2b] mb-4 pb-2 border-b border-[#e8c1c8]">The Proposal</h3>
              <p className="text-[#4a5568] font-['Cormorant_Garamond'] tracking-wide text-lg">
                On a perfect day in December 2023, surrounded by the beauty of Tagaytay's highlands, Jeshua got down on one knee. With the sun setting behind them, he asked Judel to spend forever with him. Through tears of joy, she said "Yes!" and they began planning their future together as husband and wife.
              </p>
            </div>
            <motion.div 
              className="order-1 md:order-2"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3 }}
            >
              <img 
                src="https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="The proposal" 
                className="rounded-lg shadow-md w-full h-64 md:h-80 object-cover border-4 border-white" 
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default OurStory;
