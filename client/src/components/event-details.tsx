import { motion } from "framer-motion";
import { Calendar, MapPin, Info, Utensils } from "lucide-react";
import { useEffect, useRef } from "react";

// For TypeScript type safety
declare global {
  interface Window {
    L: any;
  }
}

const EventDetails = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  
  // Initialize map when component mounts
  useEffect(() => {
    let map: any = null;
    
    // Function to initialize the map
    const initializeMap = () => {
      if (!mapRef.current || !window.L) return;
      
      // Clear the map container in case it was initialized before
      mapRef.current.innerHTML = '';
      
      // Sample coordinates - using approximation for Lipa City, Philippines
      const ceremonyCoords = [13.9421, 121.1631]; // St. Therese of the Child Jesus and the Holy Face Parish Church
      const receptionCoords = [13.9442, 121.1697]; // Mountain Rock Resort
      
      // Initialize map centered between the two locations
      map = window.L.map(mapRef.current).setView([
        (ceremonyCoords[0] + receptionCoords[0]) / 2, 
        (ceremonyCoords[1] + receptionCoords[1]) / 2
      ], 14);
      
      // Add tile layer (map style)
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
      
      // Add markers for ceremony and reception
      const ceremonyMarker = window.L.marker(ceremonyCoords).addTo(map)
        .bindPopup('<b>Ceremony</b><br>St. Therese of the Child Jesus and<br>the Holy Face Parish Church<br>Brgy. Talisay, Lipa City')
        .openPopup();
        
      const receptionMarker = window.L.marker(receptionCoords).addTo(map)
        .bindPopup('<b>Reception</b><br>Mountain Rock Resort<br>Brgy. Talisay, Lipa City');
      
      // Fit map to show both markers
      const bounds = window.L.latLngBounds([ceremonyCoords, receptionCoords]);
      map.fitBounds(bounds, { padding: [50, 50] });
    };
    
    // Load Leaflet if not already loaded
    if (!window.L) {
      // Load Leaflet CSS and JS dynamically
      const linkEl = document.createElement('link');
      linkEl.rel = 'stylesheet';
      linkEl.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(linkEl);
      
      const scriptEl = document.createElement('script');
      scriptEl.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      scriptEl.onload = initializeMap;
      document.head.appendChild(scriptEl);
    } else {
      // Leaflet already loaded, initialize map
      initializeMap();
    }
    
    // Cleanup function
    return () => {
      if (map) {
        map.remove();
      }
    };
  }, []);
  
  return (
    <section id="details" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="font-['Great_Vibes'] text-4xl md:text-5xl text-[#6b0f2b] text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Wedding Details
        </motion.h2>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Ceremony Card */}
          <motion.div 
            className="bg-[#fff5f7] p-8 rounded-lg shadow-md border border-[#e8c1c8] transform transition-transform hover:-translate-y-1 duration-300"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="mb-6">
              <img 
                src="https://images.unsplash.com/photo-1519741347686-c1e0aadf4611?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Ceremony venue" 
                className="w-full h-48 object-cover rounded-md" 
              />
            </div>
            <h3 className="font-['Cormorant_Garamond'] text-2xl text-[#6b0f2b] mb-2">The Ceremony</h3>
            <div className="h-[1px] w-16 mb-4 bg-gradient-to-r from-transparent via-[#6b0f2b] to-transparent"></div>
            <p className="font-['Montserrat'] text-[#718096] mb-4">
              Join us as we exchange vows and begin our journey as husband and wife.
            </p>
            <ul className="text-[#4a5568] space-y-2 mb-6">
              <li className="flex items-start">
                <Calendar className="h-5 w-5 text-[#6b0f2b] mr-3 mt-1" />
                <span>May 3, 2025 | 1:00 PM</span>
              </li>
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-[#6b0f2b] mr-3 mt-1" />
                <span>St. Therese of the Child Jesus and<br/>the Holy Face Parish Church<br/>Brgy. Talisay, Lipa City</span>
              </li>
              <li className="flex items-start">
                <Info className="h-5 w-5 text-[#6b0f2b] mr-3 mt-1" />
                <span>Semi-formal attire with burgundy touches</span>
              </li>
            </ul>
          </motion.div>
          
          {/* Reception Card */}
          <motion.div 
            className="bg-[#fff5f7] p-8 rounded-lg shadow-md border border-[#e8c1c8] transform transition-transform hover:-translate-y-1 duration-300"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="mb-6">
              <img 
                src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Reception venue" 
                className="w-full h-48 object-cover rounded-md" 
              />
            </div>
            <h3 className="font-['Cormorant_Garamond'] text-2xl text-[#6b0f2b] mb-2">The Reception</h3>
            <div className="h-[1px] w-16 mb-4 bg-gradient-to-r from-transparent via-[#6b0f2b] to-transparent"></div>
            <p className="font-['Montserrat'] text-[#718096] mb-4">
              Celebrate with us over dinner and festivities.
            </p>
            <ul className="text-[#4a5568] space-y-2 mb-6">
              <li className="flex items-start">
                <Calendar className="h-5 w-5 text-[#6b0f2b] mr-3 mt-1" />
                <span>May 3, 2025 | After ceremony</span>
              </li>
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-[#6b0f2b] mr-3 mt-1" />
                <span>Mountain Rock Resort<br/>Brgy. Talisay, Lipa City</span>
              </li>
              <li className="flex items-start">
                <Utensils className="h-5 w-5 text-[#6b0f2b] mr-3 mt-1" />
                <span>Dinner will be provided</span>
              </li>
            </ul>
          </motion.div>
        </div>
        
        {/* Map Section */}
        <motion.div 
          className="mt-16 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <h3 className="font-['Cormorant_Garamond'] text-2xl text-[#4a5568] text-center mb-6">Locations</h3>
          <div className="aspect-video h-80 rounded-lg overflow-hidden shadow-lg">
            <div ref={mapRef} className="w-full h-full bg-[#a0aec0]">
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-[#4a5568]">Interactive map loading...</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default EventDetails;
