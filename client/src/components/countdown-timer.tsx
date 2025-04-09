import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  
  useEffect(() => {
    // Set wedding date - May 3, 2025 at 1:00 PM
    const weddingDate = new Date("May 3, 2025 13:00:00").getTime();
    
    // Update countdown every second
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = weddingDate - now;
      
      // If the wedding date has passed, clear the interval
      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0
        });
        return;
      }
      
      // Calculate time units
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      
      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);
    
    // Clean up the interval on component unmount
    return () => clearInterval(timer);
  }, []);
  
  // Format numbers to always have two digits
  const formatNumber = (num: number): string => {
    return num.toString().padStart(2, '0');
  };
  
  const countdownItems = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];
  
  return (
    <section id="countdown" className="py-20 bg-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="font-['Great_Vibes'] text-4xl md:text-5xl text-[#6b0f2b] mb-12">
          Counting Down To Our Special Day
        </h2>
        
        <motion.div 
          className="flex flex-wrap justify-center gap-4 md:gap-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {countdownItems.map((item, index) => (
            <motion.div
              key={item.label}
              className="w-20 md:w-32 p-4 bg-[#fff5f7] border border-[#e8c1c8] rounded-lg"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="font-['Cormorant_Garamond'] text-3xl md:text-5xl text-[#6b0f2b]">
                {formatNumber(item.value)}
              </div>
              <div className="font-['Montserrat'] text-sm md:text-base text-[#718096] mt-2">
                {item.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CountdownTimer;
