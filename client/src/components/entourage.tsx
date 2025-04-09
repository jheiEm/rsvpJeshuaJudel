import { motion } from "framer-motion";

interface EntourageGroup {
  title: string;
  members: string[];
}

interface EntourageSectionProps {
  title: string;
  left: EntourageGroup[];
  right: EntourageGroup[];
}

const EntourageSection = ({ title, left, right }: EntourageSectionProps) => {
  return (
    <div className="mb-14 relative">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-24 h-24 opacity-20 -translate-x-1/2 -translate-y-1/2">
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <path d="M50,0 C77.6,0 100,22.4 100,50 C100,77.6 77.6,100 50,100 C22.4,100 0,77.6 0,50 C0,22.4 22.4,0 50,0 Z" fill="#6b0f2b" fillRule="evenodd" />
        </svg>
      </div>
      
      <div className="absolute bottom-0 right-0 w-32 h-32 opacity-10 translate-x-1/3 translate-y-1/3">
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <path d="M50,0 C77.6,0 100,22.4 100,50 C100,77.6 77.6,100 50,100 C22.4,100 0,77.6 0,50 C0,22.4 22.4,0 50,0 Z" fill="#6b0f2b" fillRule="evenodd" />
        </svg>
      </div>
      
      <h3 className="font-['Great_Vibes'] text-3xl md:text-4xl text-[#6b0f2b] text-center mb-10 relative">
        {title}
        <div className="absolute h-[2px] w-40 bg-gradient-to-r from-transparent via-[#6b0f2b] to-transparent mx-auto left-1/2 transform -translate-x-1/2 bottom-[-0.5rem]"></div>
      </h3>
      
      <div className="grid md:grid-cols-2 gap-10 relative">
        {/* Left column */}
        <div className="space-y-12 relative">
          {left.map((group, index) => (
            <motion.div 
              key={index} 
              className="relative bg-white bg-opacity-70 backdrop-blur-sm p-6 rounded-lg shadow-sm border border-[#e8c1c8]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <h4 className="font-['Cormorant_Garamond'] text-xl text-[#6b0f2b] uppercase tracking-wider text-center mb-4 pb-2 border-b border-[#e8c1c8]">
                {group.title}
              </h4>
              <ul className="text-center space-y-2">
                {group.members.map((member, i) => (
                  <li key={i} className="text-[#4a5568] font-['Cormorant_Garamond'] tracking-wide">{member}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
        
        {/* Right column */}
        <div className="space-y-12 relative">
          {right.map((group, index) => (
            <motion.div 
              key={index} 
              className="relative bg-white bg-opacity-70 backdrop-blur-sm p-6 rounded-lg shadow-sm border border-[#e8c1c8]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <h4 className="font-['Cormorant_Garamond'] text-xl text-[#6b0f2b] uppercase tracking-wider text-center mb-4 pb-2 border-b border-[#e8c1c8]">
                {group.title}
              </h4>
              <ul className="text-center space-y-2">
                {group.members.map((member, i) => (
                  <li key={i} className="text-[#4a5568] font-['Cormorant_Garamond'] tracking-wide">{member}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const WeddingSymbols = () => {
  const symbols = [
    {
      title: "Ring Bearer",
      name: "LIAM DANE A. BUSCATO"
    },
    {
      title: "Bible Bearer",
      name: "BREN EZEKIEL M. ILAGAN"
    },
    {
      title: "Coin Bearer",
      name: "JOHN KAIRY L. BUENSALIDA"
    },
  ];
  
  const flowerGirls = [
    "SOPHIA WEN P. LUMBERA",
    "STEPHANIE WEN P. LUMBERA",
    "BLISS EURIEL M. ILAGAN",
    "SCHECKY EMERALD L. PASIA"
  ];
  
  return (
    <div className="mb-12 relative">
      {/* Decorative flower elements */}
      <div className="absolute top-1/2 left-0 -translate-x-1/2 opacity-10">
        <svg width="120" height="120" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12,2C7.03,2 3,6.03 3,11C3,14.03 4.53,16.82 7,18.47V22H9V19H11V22H13V19H15V22H17V18.46C19.47,16.81 21,14.03 21,11C21,6.03 16.97,2 12,2M12,4C14.12,4 16,5.88 16,8C16,10.12 14.12,12 12,12C9.88,12 8,10.12 8,8C8,5.88 9.88,4 12,4" fill="#6b0f2b" fillRule="evenodd" />
        </svg>
      </div>
      
      <div className="absolute bottom-0 right-0 translate-x-1/2 opacity-10">
        <svg width="100" height="100" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12,2C7.03,2 3,6.03 3,11C3,14.03 4.53,16.82 7,18.47V22H9V19H11V22H13V19H15V22H17V18.46C19.47,16.81 21,14.03 21,11C21,6.03 16.97,2 12,2M12,4C14.12,4 16,5.88 16,8C16,10.12 14.12,12 12,12C9.88,12 8,10.12 8,8C8,5.88 9.88,4 12,4" fill="#6b0f2b" fillRule="evenodd" />
        </svg>
      </div>
      
      <h3 className="font-['Great_Vibes'] text-3xl md:text-4xl text-[#6b0f2b] text-center mb-10 relative">
        Wedding Symbols
        <div className="absolute h-[2px] w-40 bg-gradient-to-r from-transparent via-[#6b0f2b] to-transparent mx-auto left-1/2 transform -translate-x-1/2 bottom-[-0.5rem]"></div>
      </h3>
      
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        {symbols.map((symbol, index) => (
          <motion.div 
            key={index} 
            className="text-center bg-white bg-opacity-70 backdrop-blur-sm p-6 rounded-lg shadow-sm border border-[#e8c1c8] hover:shadow-md transition-shadow duration-300"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="font-['Cormorant_Garamond'] text-xl text-[#6b0f2b] uppercase tracking-wide mb-3 pb-2 border-b border-[#e8c1c8]">
              {symbol.title}
            </h4>
            <p className="text-[#4a5568] font-['Cormorant_Garamond'] tracking-wide text-lg">{symbol.name}</p>
          </motion.div>
        ))}
      </div>
      
      <motion.div 
        className="text-center bg-white bg-opacity-70 backdrop-blur-sm p-6 rounded-lg shadow-sm border border-[#e8c1c8]"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        viewport={{ once: true }}
      >
        <h4 className="font-['Cormorant_Garamond'] text-xl text-[#6b0f2b] uppercase tracking-wide mb-4 pb-2 border-b border-[#e8c1c8]">
          Flower Girls
        </h4>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {flowerGirls.map((girl, index) => (
            <li key={index} className="text-[#4a5568] font-['Cormorant_Garamond'] tracking-wide text-lg">{girl}</li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
};

const Entourage = () => {
  // Data from the image
  const mainEntourage = {
    title: "Entourage",
    left: [
      {
        title: "Parents of the Groom",
        members: ["MR. EMIGDIO M. MERU JR.", "MRS. MARIA F. MERU"]
      },
      {
        title: "Principal Sponsors",
        members: [
          "MR. LORETO A. GARCIA",
          "MR. DAN ONA",
          "MR. AMBROCIO R. MENDOZA",
          "MR. RYAN CARIDAD",
          "MR. ARNOL D. AGUILERA",
          "MR. RICARDO A. TIBAYAN",
          "ENGR. JOVITO CRUZ",
          "MR. JOEY ONRUBIA",
          "MR. WERNER ULLRICH",
          "MR. GILBERT ALMANZOR",
          "MR. GREGORIO MAYO ECHON JR."
        ]
      },
      {
        title: "Best Man",
        members: ["MR. ARLON P. AGUILERA"]
      },
      {
        title: "Secondary Sponsors",
        members: [
          "To Cloth Us As One",
          "MR. IROX ANDREW S. CABISCUELAS",
          "MS. CLARISSE ZUÑO"
        ]
      },
      {
        title: "Groomsmen",
        members: [
          "MR. ALEXIS A. LUMBERA",
          "MR. JOVERT L. MENDOZA",
          "MR. JOHN DIONSEPH A. MERU",
          "MR. MARK DAVID T. MERU"
        ]
      }
    ],
    right: [
      {
        title: "Parents of the Bride",
        members: ["MR. EDUARDO S. LUMBERA", "MRS. WILMA A. LUMBERA"]
      },
      {
        title: "Principal Sponsors",
        members: [
          "MRS. CELESTE M. GARCIA",
          "MRS. MARIA LOURDES ATIENZA-ONA",
          "MRS. MILAGROS L. MENDOZA",
          "MRS. SCHERINE CARIDAD",
          "MRS. CRISTINA P. AGUILERA",
          "MRS. MARILOU M. TIBAYAN",
          "MRS. ANGELINE CRUZ",
          "MRS. JUANITA ONRUBIA",
          "MRS. EDITHA BUIQUIQ",
          "ENGR. JENNIFER ALMANZOR",
          "MS. ELIZABETH OJALES"
        ]
      },
      {
        title: "Maid of Honor",
        members: ["MS. ANTONETTE A. LUMBERA"]
      },
      {
        title: "Secondary Sponsors",
        members: [
          "To Bind Us As One",
          "MR. JAY M. TIBAYAN",
          "MS. SAMANTHA ALYANNA VIRAY",
          "To Light Our Path",
          "MR. JOHN CZAR F. MERU",
          "MS. EHRA MAYEL H. MENDOZA"
        ]
      },
      {
        title: "Bridesmaid",
        members: [
          "MRS. JULIETLY P. LUMBERA",
          "MS. MIKAS T. MERU",
          "MS. HARMOINIE A. NACIS",
          "MRS. MAUREEN L. QUIROZ"
        ]
      }
    ]
  };

  return (
    <section id="entourage" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="font-['Great_Vibes'] text-4xl md:text-5xl text-[#6b0f2b] text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Wedding Party
        </motion.h2>
        
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <EntourageSection 
            title={mainEntourage.title} 
            left={mainEntourage.left} 
            right={mainEntourage.right} 
          />
          
          <WeddingSymbols />
        </motion.div>
      </div>
    </section>
  );
};

export default Entourage;