import { motion } from "framer-motion";

interface EntourageGroup {
  title: string;
  members: string[];
  icon?: React.ReactNode;
  description?: string;
}

interface EntourageSectionProps {
  title: string;
  left: EntourageGroup[];
  right: EntourageGroup[];
}

const EntourageSection = ({ title, left, right }: EntourageSectionProps) => {
  // Find the Bridesmaid card in the right array
  const bridesmaidIndex = right.findIndex(item => item.title === "Bridesmaid");
  const bridesmaidCard = bridesmaidIndex >= 0 ? right[bridesmaidIndex] : null;
  
  // Find the Bridesmaid card to display separately
  // We'll leave the "To Light Our Path" card in its original position in the right column
  const filteredRight = right.filter(item => 
    item.title !== "Bridesmaid"
  );
  
  // Create balanced columns that look good visually
  const adjustedLeft = [...left];
  
  // Only add "To Light Our Path" if it should be in the left column
  // We're moving it back to right column based on user feedback
  // if (lightPathCard) {
  //   adjustedLeft.push(lightPathCard);
  // }
  
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
          {adjustedLeft.map((group, index) => (
            <motion.div 
              key={index} 
              className="relative backdrop-blur-sm p-6 rounded-lg bg-gradient-to-b from-white to-[#fef2f4] border-2 border-[#8a1538] shadow-md"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ 
                y: -5, 
                scale: 1.02,
                boxShadow: "0 10px 25px -5px rgba(107, 15, 43, 0.2), 0 8px 10px -6px rgba(107, 15, 43, 0.1)" 
              }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              {group.icon && (
                <div className="mb-2">
                  {group.icon}
                </div>
              )}
              <h4 className="font-['Cormorant_Garamond'] text-xl uppercase tracking-wider text-center mb-4 pb-2 text-[#6b0f2b] font-semibold border-b-2 border-[#8a1538]">
                {group.title}
              </h4>
              <ul className="text-center space-y-2">
                {group.members.map((member, i) => (
                  <li key={i} className="font-['Cormorant_Garamond'] tracking-wide text-[#4a5568] font-medium">{member}</li>
                ))}
              </ul>
              {group.description && (
                <p className="mt-4 text-[#6b0f2b]/70 text-sm italic text-center">{group.description}</p>
              )}
            </motion.div>
          ))}
        </div>
        
        {/* Right column */}
        <div className="space-y-12 relative">
          {filteredRight.map((group, index) => (
            <motion.div 
              key={index} 
              className="relative backdrop-blur-sm p-6 rounded-lg bg-gradient-to-b from-white to-[#fef2f4] border-2 border-[#8a1538] shadow-md"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ 
                y: -5, 
                scale: 1.02,
                boxShadow: "0 10px 25px -5px rgba(107, 15, 43, 0.2), 0 8px 10px -6px rgba(107, 15, 43, 0.1)" 
              }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              {group.icon && (
                <div className="mb-2">
                  {group.icon}
                </div>
              )}
              <h4 className="font-['Cormorant_Garamond'] text-xl uppercase tracking-wider text-center mb-4 pb-2 text-[#6b0f2b] font-semibold border-b-2 border-[#8a1538]">
                {group.title}
              </h4>
              <ul className="text-center space-y-2">
                {group.members.map((member, i) => (
                  <li key={i} className="font-['Cormorant_Garamond'] tracking-wide text-[#4a5568] font-medium">{member}</li>
                ))}
              </ul>
              {group.description && (
                <p className="mt-4 text-[#6b0f2b]/70 text-sm italic text-center">{group.description}</p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Centered Bridesmaid card */}
      {bridesmaidCard && (
        <div className="mt-12 max-w-md mx-auto">
          <motion.div 
            className="relative backdrop-blur-sm p-6 rounded-lg bg-gradient-to-b from-white to-[#fef2f4] border-2 border-[#8a1538] shadow-md"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ 
              y: -5, 
              scale: 1.02,
              boxShadow: "0 10px 25px -5px rgba(107, 15, 43, 0.2), 0 8px 10px -6px rgba(107, 15, 43, 0.1)" 
            }}
            transition={{ duration: 0.5, delay: 0.5 }}
            viewport={{ once: true }}
          >
            {bridesmaidCard.icon && (
              <div className="mb-2">
                {bridesmaidCard.icon}
              </div>
            )}
            <h4 className="font-['Cormorant_Garamond'] text-xl uppercase tracking-wider text-center mb-4 pb-2 text-[#6b0f2b] font-semibold border-b-2 border-[#8a1538]">
              {bridesmaidCard.title}
            </h4>
            <ul className="text-center space-y-2">
              {bridesmaidCard.members.map((member, i) => (
                <li key={i} className="font-['Cormorant_Garamond'] tracking-wide text-[#4a5568] font-medium">{member}</li>
              ))}
            </ul>
            {bridesmaidCard.description && (
              <p className="mt-4 text-[#6b0f2b]/70 text-sm italic text-center">{bridesmaidCard.description}</p>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
};

const WeddingSymbols = () => {
  const symbols = [
    {
      title: "Ring Bearer",
      name: "LIAM DANE A. BUSCATO",
      icon: (
        <svg width="60" height="60" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-4">
          <path d="M12,10L8,4.4L9.6,2H14.4L16,4.4L12,10M15.5,6.8L14.3,8.5C16.5,9.4 18,11.5 18,14A6,6 0 0,1 12,20A6,6 0 0,1 6,14C6,11.5 7.5,9.4 9.7,8.5L8.5,6.8C5.8,8.1 4,10.8 4,14A8,8 0 0,0 12,22A8,8 0 0,0 20,14C20,10.8 18.2,8.1 15.5,6.8Z" 
            fill="#6b0f2b" 
            className="drop-shadow-md"
          />
        </svg>
      )
    },
    {
      title: "Bible Bearer",
      name: "BREN EZEKIEL M. ILAGAN",
      icon: (
        <svg width="60" height="60" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-4">
          <path d="M5.81,2C4.83,2.09 4,3 4,4V20C4,21.05 4.95,22 6,22H18C19.05,22 20,21.05 20,20V4C20,2.89 19.1,2 18,2H12V9L9.5,7.5L7,9V2H6C5.94,2 5.87,2 5.81,2M12,13H13A1,1 0 0,1 14,14V15H12V17H14A1,1 0 0,1 15,18V19H12V21H15A3,3 0 0,0 18,18V17.5A1.5,1.5 0 0,0 16.5,16A1.5,1.5 0 0,0 18,14.5V14A3,3 0 0,0 15,11H12V13Z" 
            fill="#6b0f2b"
            className="drop-shadow-md"
          />
        </svg>
      )
    },
    {
      title: "Coin Bearer",
      name: "JOHN KAIRY L. BUENSALIDA",
      icon: (
        <svg width="60" height="60" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-4">
          <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M11,17V16H9V14H13V13H10A1,1 0 0,1 9,12V9A1,1 0 0,1 10,8H11V7H13V8H15V10H11V11H14A1,1 0 0,1 15,12V15A1,1 0 0,1 14,16H13V17H11Z" 
            fill="#6b0f2b"
            className="drop-shadow-md"
          />
        </svg>
      )
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
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 z-0 overflow-hidden">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <pattern id="pattern-circles" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse" patternContentUnits="userSpaceOnUse">
            <circle id="pattern-circle" cx="10" cy="10" r="1.6257413380501518" fill="#6b0f2b"></circle>
          </pattern>
          <rect id="rect" x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles)"></rect>
        </svg>
      </div>
      
      <div className="relative z-10">
        <h3 className="font-['Great_Vibes'] text-3xl md:text-4xl text-[#6b0f2b] text-center mb-10 relative">
          Wedding Symbols
          <div className="absolute h-[2px] w-40 bg-gradient-to-r from-transparent via-[#6b0f2b] to-transparent mx-auto left-1/2 transform -translate-x-1/2 bottom-[-0.5rem]"></div>
        </h3>
        
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {symbols.map((symbol, index) => (
            <motion.div 
              key={index} 
              className="text-center bg-gradient-to-b from-white to-[#fef2f4] backdrop-blur-sm p-6 rounded-lg shadow-md border-2 border-[#8a1538]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ 
                y: -5, 
                scale: 1.02,
                boxShadow: "0 10px 25px -5px rgba(107, 15, 43, 0.2), 0 8px 10px -6px rgba(107, 15, 43, 0.1)" 
              }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="mb-2">
                {symbol.icon}
              </div>
              <h4 className="font-['Cormorant_Garamond'] text-xl text-[#6b0f2b] uppercase tracking-wide mb-3 pb-2 font-semibold border-b-2 border-[#8a1538]">
                {symbol.title}
              </h4>
              <p className="text-[#4a5568] font-['Cormorant_Garamond'] tracking-wide text-lg font-medium">{symbol.name}</p>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          className="text-center bg-gradient-to-b from-white to-[#fef2f4] backdrop-blur-sm p-6 rounded-lg shadow-md border-2 border-[#8a1538] relative overflow-hidden max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          whileHover={{ 
            y: -5, 
            scale: 1.01,
            boxShadow: "0 10px 25px -5px rgba(107, 15, 43, 0.2), 0 8px 10px -6px rgba(107, 15, 43, 0.1)" 
          }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
        >
          {/* Decorative flower icon */}
          <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 opacity-10 w-32 h-32">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12,1C9.24,1 7,3.24 7,6C7,8.1 8.45,9.86 10.4,10.6C9.1,11.17 8,12.15 7.37,13.39C8.2,12.74 9.26,12.31 10.4,12.31C12.94,12.31 15,14.37 15,16.91C15,18.5 14.16,19.89 12.92,20.7C14.5,20.71 16.02,19.92 17,18.6C17.4,18.9 17.9,19.12 18.42,19.27C19.09,20.93 20.07,21.88 20.07,21.88C20.07,21.88 21.96,17.84 20.11,14.23C21.28,12.24 20.87,9.37 18.91,7.9C18.91,7.9 19.42,6.74 19.5,6C19.5,6 18.55,5.97 17.92,6.24C17.24,3.34 14.5,1 11.27,1H12M9,6A1,1 0 0,1 10,7A1,1 0 0,1 9,8A1,1 0 0,1 8,7A1,1 0 0,1 9,6M11.5,14C10.67,14 10,14.67 10,15.5C10,16.33 10.67,17 11.5,17C12.33,17 13,16.33 13,15.5C13,14.67 12.33,14 11.5,14Z" 
                fill="#6b0f2b"
              />
            </svg>
          </div>
          
          <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 opacity-10 w-32 h-32">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12,1C9.24,1 7,3.24 7,6C7,8.1 8.45,9.86 10.4,10.6C9.1,11.17 8,12.15 7.37,13.39C8.2,12.74 9.26,12.31 10.4,12.31C12.94,12.31 15,14.37 15,16.91C15,18.5 14.16,19.89 12.92,20.7C14.5,20.71 16.02,19.92 17,18.6C17.4,18.9 17.9,19.12 18.42,19.27C19.09,20.93 20.07,21.88 20.07,21.88C20.07,21.88 21.96,17.84 20.11,14.23C21.28,12.24 20.87,9.37 18.91,7.9C18.91,7.9 19.42,6.74 19.5,6C19.5,6 18.55,5.97 17.92,6.24C17.24,3.34 14.5,1 11.27,1H12M9,6A1,1 0 0,1 10,7A1,1 0 0,1 9,8A1,1 0 0,1 8,7A1,1 0 0,1 9,6M11.5,14C10.67,14 10,14.67 10,15.5C10,16.33 10.67,17 11.5,17C12.33,17 13,16.33 13,15.5C13,14.67 12.33,14 11.5,14Z" 
                fill="#6b0f2b"
              />
            </svg>
          </div>
          
          <div className="relative z-10">
            <div className="mx-auto mb-4 w-16 h-16">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.5,12A4.5,4.5 0 0,1 23,16.5C23,17.83 22.5,19.04 21.61,20C22.5,21 23,22.33 23,23.5A1.5,1.5 0 0,1 21.5,25A1.5,1.5 0 0,1 20,23.5A1.5,1.5 0 0,1 20.25,22.76C19.54,22.45 18.95,21.93 18.53,21.28C17.45,22.16 16.17,22.5 15,22.5C13.83,22.5 12.55,22.16 11.47,21.28C11.05,21.93 10.46,22.45 9.75,22.76A1.5,1.5 0 0,1 10,23.5A1.5,1.5 0 0,1 8.5,25A1.5,1.5 0 0,1 7,23.5C7,22.33 7.5,21 8.39,20C7.5,19.04 7,17.83 7,16.5A4.5,4.5 0 0,1 11.5,12C11.84,12 12.17,12.04 12.5,12.13C12.83,12.04 13.16,12 13.5,12A4.5,4.5 0 0,1 18,16.5V16.74C18.05,16.64 18.1,16.55 18.16,16.45C18.07,16.13 18,15.82 18,15.5A3.5,3.5 0 0,1 21.5,12C21.5,12.17 21.47,12.34 21.44,12.5C21.59,12.5 21.75,12.5 21.9,12.53L19.03,8.5H14.97L12.5,9.87L10.03,8.5H5.97L1.57,14.5L5.97,20.5H10.03L11.35,19.67C11.05,19.33 10.81,18.92 10.66,18.5H6.97L3.57,14.5L6.97,10.5H10.72L13.19,11.87L15.5,10.87L15.66,10.5H17.28L19.03,12.97C19.63,12.36 20.48,12 21.5,12C21.5,12 21.5,12 21.5,12C21.5,9.5 19.5,7.5 17,7.5V7H14V7.5C11.5,7.5 9.5,9.5 9.5,12C9.5,12 9.5,12 9.5,12C10.09,12 10.65,12.13 11.15,12.37L11.53,12.24L12.42,12.76L12.92,12.03C12.88,12.36 12.89,12.69 12.96,13H12.5C10.84,13 9.5,14.34 9.5,16C9.5,16.85 9.9,17.61 10.5,18.13C10.23,17.63 10.05,17.08 10,16.5C10,14 12,12 14.5,12C15.79,12 16.97,12.58 17.77,13.5H19.44C18.3,12.3 16.5,11.5 14.5,11.5L14.66,11.97L12.42,12.76L12.31,12.5C11.32,12 10.13,11.5 9,11.5V10C8.06,10 7.21,10.28 6.5,10.76V8.91L9.27,5H14.73L18.5,10.29C17.91,10.1 17.28,10 16.63,10C16.11,10 15.61,10.07 15.13,10.21C15.04,10.04 14.94,9.88 14.73,9.73C14.26,9.36 13.65,9 13.19,9C14,9 14.78,9.19 15.5,9.5C16.21,9.82 16.85,10.27 17.39,10.81C17.85,9.33 18.96,8.11 18.96,8.11C18.96,8.11 20.27,9.37 20.91,11H21.34L17,5H7L2,12L7,19H13.34C13.89,20.15 14.43,20.59 15.5,21C16.57,21.59 17.17,22 18.5,22M15.5,14A2.5,2.5 0 0,0 13,16.5A2.5,2.5 0 0,0 15.5,19A2.5,2.5 0 0,0 18,16.5A2.5,2.5 0 0,0 15.5,14M17.41,13.71C17.58,13.95 17.73,14.2 17.84,14.46C18.5,14.72 19,15.33 19,16.03V16.03C19,16.86 18.33,17.53 17.5,17.53C16.95,17.53 16.44,17.25 16.2,16.79C16.33,16.71 16.44,16.63 16.56,16.53C16.74,16.4 16.91,16.24 17.03,16.03C16.94,15.96 16.83,15.9 16.7,15.88L16.5,15.88L16.5,15.88C16.5,15.37 16.12,14.94 15.62,14.94C15.5,14.94 15.37,14.96 15.25,15.01C15.2,14.96 15.16,14.91 15.11,14.86L15.06,14.82C15.18,14.5 15.22,14.25 15.41,14C15.5,14 15.5,14 15.5,14C16.2,14 16.89,14.28 17.41,14.71M17.5,15.5C17.78,15.5 18,15.72 18,16C18,16.28 17.78,16.5 17.5,16.5C17.22,16.5 17,16.28 17,16C17,15.72 17.22,15.5 17.5,15.5M18.25,12.76C18.68,13.04 19.03,13.36 19.33,13.71L19,13.25C18.69,12.79 18.5,12.76 18.25,12.76Z" 
                  fill="#6b0f2b"
                  className="opacity-70"
                />
              </svg>
            </div>
            <h4 className="font-['Cormorant_Garamond'] text-xl text-[#6b0f2b] uppercase tracking-wide mb-4 pb-2 font-semibold border-b-2 border-[#8a1538]">
              Flower Girls
            </h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {flowerGirls.map((girl, index) => (
                <li key={index} className="text-[#4a5568] font-['Cormorant_Garamond'] tracking-wide text-lg font-medium">{girl}</li>
              ))}
            </ul>
          </div>
        </motion.div>
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
        title: "To Cloth Us As One",
        members: [
          "MR. IROX ANDREW S. CABISCUELAS",
          "MS. CLARISSE ZUÑO"
        ],
        icon: (
          <svg width="40" height="40" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-3">
            <path d="M12,4A6,6 0 0,1 18,10C18,12.97 15.84,15.44 13,15.92V18H15V20H13V22H11V20H9V18H11V15.92C8.16,15.44 6,12.97 6,10A6,6 0 0,1 12,4M12,6A4,4 0 0,0 8,10A4,4 0 0,0 12,14A4,4 0 0,0 16,10A4,4 0 0,0 12,6Z" 
              fill="#6b0f2b" 
              className="drop-shadow-md"
            />
          </svg>
        ),
        description: "The veil and cord symbolize the clothing of the couple as one in their marriage journey."
      },
      {
        title: "To Light Our Path",
        members: [
          "MR. JOHN CZAR F. MERU",
          "MS. EHRA MAYEL H. MENDOZA"
        ],
        icon: (
          <svg width="40" height="40" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-3">
            <path d="M16,12V4H17V2H7V4H8V12L6,14V16H11.2V22H12.8V16H18V14L16,12M8.8,14L10,12.8V4H14V12.8L15.2,14H8.8Z" 
              fill="#6b0f2b" 
              className="drop-shadow-md"
            />
          </svg>
        ),
        description: "The candles represent the light that will guide the couple's path together."
      },
      {
        title: "Groomsmen",
        members: [
          "MR. ALEXIS A. LUMBERA",
          "MR. JOVERT L. MENDOZA",
          "MR. JOHN DIONSEPH A. MERU",
          "MR. MARK DAVID T. MERU"
        ],
        icon: (
          <svg width="40" height="40" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-3">
            <path d="M12 4C14.21 4 16 5.79 16 8S14.21 12 12 12 8 10.21 8 8 9.79 4 12 4M12 14C16.42 14 20 15.79 20 18V20H4V18C4 15.79 7.58 14 12 14Z" 
              fill="#6b0f2b" 
              className="drop-shadow-md"
            />
          </svg>
        )
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
        title: "To Bind Us As One",
        members: [
          "MR. JAY M. TIBAYAN",
          "MS. SAMANTHA ALYANNA VIRAY"
        ],
        icon: (
          <svg width="40" height="40" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-3">
            <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z" 
              fill="#6b0f2b" 
              className="drop-shadow-md"
            />
          </svg>
        ),
        description: "The cord symbolizes the binding of the couple as one in their marriage journey."
      },
      {
        title: "Bridesmaid",
        members: [
          "MRS. JULIETLY P. LUMBERA",
          "MS. MIKAS T. MERU",
          "MS. HARMOINIE A. NACIS",
          "MRS. MAUREEN L. QUIROZ"
        ],
        icon: (
          <svg width="40" height="40" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-3">
            <path d="M16.5,12A2.5,2.5 0 0,0 19,9.5A2.5,2.5 0 0,0 16.5,7A2.5,2.5 0 0,0 14,9.5A2.5,2.5 0 0,0 16.5,12M9,11A3,3 0 0,0 12,8A3,3 0 0,0 9,5A3,3 0 0,0 6,8A3,3 0 0,0 9,11M16.5,14C14.67,14 11,14.92 11,16.75V19H22V16.75C22,14.92 18.33,14 16.5,14M9,13C6.67,13 2,14.17 2,16.5V19H9V16.75C9,15.9 9.33,14.41 11.37,13.28C10.5,13.1 9.66,13 9,13Z" 
              fill="#6b0f2b" 
              className="drop-shadow-md"
            />
          </svg>
        )
      }
    ]
  };

  return (
    <section id="entourage" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="font-['Great_Vibes'] text-4xl md:text-5xl text-[#6b0f2b] text-center mb-16 relative"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Wedding Party
          <motion.div 
            className="absolute h-[2px] w-40 bg-gradient-to-r from-transparent via-[#6b0f2b] to-transparent mx-auto left-1/2 transform -translate-x-1/2 bottom-[-0.5rem]"
            initial={{ width: 0, opacity: 0 }}
            whileInView={{ width: "10rem", opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          />
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