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
    <div className="mb-12">
      <h3 className="font-['Great_Vibes'] text-3xl md:text-4xl text-[#6b0f2b] text-center mb-8">
        {title}
      </h3>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          {left.map((group, index) => (
            <div key={index} className="mb-8">
              <h4 className="font-['Cormorant_Garamond'] text-xl text-[#4a5568] uppercase tracking-wider text-center mb-4">
                {group.title}
              </h4>
              <ul className="text-center">
                {group.members.map((member, i) => (
                  <li key={i} className="mb-2 text-[#4a5568]">{member}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div>
          {right.map((group, index) => (
            <div key={index} className="mb-8">
              <h4 className="font-['Cormorant_Garamond'] text-xl text-[#4a5568] uppercase tracking-wider text-center mb-4">
                {group.title}
              </h4>
              <ul className="text-center">
                {group.members.map((member, i) => (
                  <li key={i} className="mb-2 text-[#4a5568]">{member}</li>
                ))}
              </ul>
            </div>
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
    <div className="mb-12">
      <h3 className="font-['Great_Vibes'] text-3xl md:text-4xl text-[#6b0f2b] text-center mb-8">
        Wedding Symbols
      </h3>
      
      <div className="grid md:grid-cols-3 gap-4 mb-10">
        {symbols.map((symbol, index) => (
          <div key={index} className="text-center">
            <h4 className="font-['Cormorant_Garamond'] text-xl text-[#4a5568] uppercase tracking-wider mb-2">
              {symbol.title}
            </h4>
            <p className="text-[#4a5568]">{symbol.name}</p>
          </div>
        ))}
      </div>
      
      <div className="text-center">
        <h4 className="font-['Cormorant_Garamond'] text-xl text-[#4a5568] uppercase tracking-wider mb-4">
          Flower Girls
        </h4>
        <ul>
          {flowerGirls.map((girl, index) => (
            <li key={index} className="mb-2 text-[#4a5568]">{girl}</li>
          ))}
        </ul>
      </div>
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