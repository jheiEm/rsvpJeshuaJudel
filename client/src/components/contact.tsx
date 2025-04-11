import { motion } from "framer-motion";
import { Phone, Mail, Home, Gift } from "lucide-react";

const Contact = () => {
  const contactItems = [
    {
      icon: <Phone className="h-5 w-5" />,
      title: "Phone",
      details: ["Jeshua: +63 921 397 3751", "Judel: +63 921 397 3751"],
    },
    {
      icon: <Mail className="h-5 w-5" />,
      title: "Email",
      details: ["merujeshua14@gmail.com", "lumberajudel@gmail.com"],
    },
    {
      icon: <Home className="h-5 w-5" />,
      title: "Accommodations",
      details: ["Mountain Rock Resort", "Contact for special rates"],
    },
    {
      icon: <Gift className="h-5 w-5" />,
      title: "Registry",
      details: ["Cash gifts are appreciated", "GCash: 0921 397 3751"],
    },
  ];

  return (
    <section
      id="contact-us"
      className="py-16 bg-[#fff5f7] relative overflow-hidden"
    >
      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 w-40 h-40 opacity-10 -translate-x-1/2 translate-y-1/4">
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M50,0 C77.6,0 100,22.4 100,50 C100,77.6 77.6,100 50,100 C22.4,100 0,77.6 0,50 C0,22.4 22.4,0 50,0 Z"
            fill="#6b0f2b"
            fillRule="evenodd"
          />
        </svg>
      </div>

      <div className="container mx-auto px-4">
        <motion.h2
          className="font-['Great_Vibes'] text-4xl md:text-5xl text-[#6b0f2b] text-center mb-10 relative"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Contact Us
          <div className="absolute h-[2px] w-40 bg-gradient-to-r from-transparent via-[#6b0f2b] to-transparent mx-auto left-1/2 transform -translate-x-1/2 bottom-[-0.5rem]"></div>
        </motion.h2>

        <motion.p
          className="text-center text-[#4a5568] max-w-xl mx-auto mb-12 font-['Cormorant_Garamond'] text-lg"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          For any questions or assistance regarding our wedding, please don't
          hesitate to reach out to us.
        </motion.p>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          {contactItems.map((item, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-lg shadow-sm border border-[#e8c1c8] p-6 flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
              viewport={{ once: true }}
              whileHover={{
                y: -5,
                boxShadow:
                  "0 10px 25px -5px rgba(107, 15, 43, 0.1), 0 8px 10px -6px rgba(107, 15, 43, 0.1)",
              }}
            >
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-[#fff5f7] text-[#6b0f2b] mb-6 shadow-sm">
                {item.icon}
              </div>
              <h3 className="font-['Cormorant_Garamond'] text-xl text-[#6b0f2b] mb-3">
                {item.title}
              </h3>
              <div className="text-[#4a5568] font-['Cormorant_Garamond'] tracking-wide">
                {item.details.map((detail, i) => (
                  <p key={i} className="mb-1">
                    {detail}
                  </p>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <p className="text-[#6b0f2b] font-['Great_Vibes'] text-2xl">
            We look forward to celebrating with you!
          </p>
          <p className="text-[#4a5568] font-['Cormorant_Garamond'] mt-2">
            Jeshua & Judel
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
