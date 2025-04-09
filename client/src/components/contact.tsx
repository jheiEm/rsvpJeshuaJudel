import { motion } from "framer-motion";
import { Phone, Mail, Bed } from "lucide-react";

const Contact = () => {
  const contactItems = [
    {
      icon: <Phone className="h-5 w-5" />,
      title: "Phone",
      details: [
        "Jessica: (555) 123-4567",
        "Michael: (555) 987-6543"
      ]
    },
    {
      icon: <Mail className="h-5 w-5" />,
      title: "Email",
      details: [
        "wedding@jessicaandmichael.com"
      ]
    },
    {
      icon: <Bed className="h-5 w-5" />,
      title: "Accommodations",
      details: [
        "Grand Hotel Portland",
        "Room block under \"Smith-Johnson Wedding\""
      ]
    }
  ];
  
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="font-['Great_Vibes'] text-4xl text-[#d4af7a] text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Contact Us
        </motion.h2>
        
        <motion.p 
          className="text-center text-[#718096] max-w-xl mx-auto mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          If you have any questions or need assistance, please don't hesitate to reach out.
        </motion.p>
        
        <motion.div 
          className="flex flex-wrap justify-center gap-8 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          {contactItems.map((item, index) => (
            <motion.div 
              key={index}
              className="flex flex-col items-center p-4 transition-transform transform hover:-translate-y-1 duration-300"
              whileHover={{ y: -5 }}
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#e6d5b8] text-[#d4af7a] mb-4">
                {item.icon}
              </div>
              <h3 className="font-['Cormorant_Garamond'] text-lg text-[#4a5568] mb-1">{item.title}</h3>
              <div className="text-[#718096] text-center">
                {item.details.map((detail, i) => (
                  <p key={i}>{detail}</p>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
