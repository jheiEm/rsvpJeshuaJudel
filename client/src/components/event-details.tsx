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
    // Check if Leaflet is loaded
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
    
    function initializeMap() {
      if (!mapRef.current || !window.L) return;
      
      // Clear the map container in case it was initialized before
      mapRef.current.innerHTML = '';
      
      // Sample coordinates - replace with real venue coordinates
      const ceremonyCoords = [45.523064, -122.676483]; // Portland, OR coordinates as placeholder
      const receptionCoords = [45.515231, -122.658719]; // Another Portland location
      
      // Initialize map centered between the two locations
      const map = window.L.map(mapRef.current).setView([
        (ceremonyCoords[0] + receptionCoords[0]) / 2, 
        (ceremonyCoords[1] + receptionCoords[1]) / 2
      ], 13);
      
      // Add tile layer (map style)
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
      
      // Add markers for ceremony and reception
      const ceremonyMarker = window.L.marker(ceremonyCoords).addTo(map)
        .bindPopup('<b>Ceremony</b><br>St. Mary\'s Cathedral<br>1000 Cathedral Place<br>Portland, Oregon')
        .openPopup();
        
      const receptionMarker = window.L.marker(receptionCoords).addTo(map)
        .bindPopup('<b>Reception</b><br>The Grand Ballroom<br>500 Rose Gardens Lane<br>Portland, Oregon');
      
      // Fit map to show both markers
      const bounds = window.L.latLngBounds([ceremonyCoords, receptionCoords]);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
    
    // Cleanup function
    return () => {
      if (mapRef.current) {
        mapRef.current.innerHTML = '';
      }
    };
  }, []);
  
  return (
    <section id="details" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="font-['Great_Vibes'] text-4xl md:text-5xl text-[#d4af7a] text-center mb-16"
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
            className="bg-[#faf7f2] p-8 rounded-lg shadow-md border border-[#e6d5b8] transform transition-transform hover:-translate-y-1 duration-300"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="mb-6">
              <img 
                src="https://images.unsplash.com/photo-1522413452208-996ff3f3e740?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Ceremony venue" 
                className="w-full h-48 object-cover rounded-md" 
              />
            </div>
            <h3 className="font-['Cormorant_Garamond'] text-2xl text-[#c9a66b] mb-2">The Ceremony</h3>
            <div className="h-[1px] w-16 mb-4 bg-gradient-to-r from-transparent via-[#d4af7a] to-transparent"></div>
            <p className="font-['Montserrat'] text-[#718096] mb-4">
              Join us as we exchange vows and begin our journey as husband and wife.
            </p>
            <ul className="text-[#4a5568] space-y-2 mb-6">
              <li className="flex items-start">
                <Calendar className="h-5 w-5 text-[#d4af7a] mr-3 mt-1" />
                <span>November 12, 2023 | 3:00 PM</span>
              </li>
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-[#d4af7a] mr-3 mt-1" />
                <span>St. Mary's Cathedral<br/>1000 Cathedral Place<br/>Portland, Oregon</span>
              </li>
              <li className="flex items-start">
                <Info className="h-5 w-5 text-[#d4af7a] mr-3 mt-1" />
                <span>Formal attire requested</span>
              </li>
            </ul>
          </motion.div>
          
          {/* Reception Card */}
          <motion.div 
            className="bg-[#faf7f2] p-8 rounded-lg shadow-md border border-[#e6d5b8] transform transition-transform hover:-translate-y-1 duration-300"
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
            <h3 className="font-['Cormorant_Garamond'] text-2xl text-[#c9a66b] mb-2">The Reception</h3>
            <div className="h-[1px] w-16 mb-4 bg-gradient-to-r from-transparent via-[#d4af7a] to-transparent"></div>
            <p className="font-['Montserrat'] text-[#718096] mb-4">
              Celebrate with us over dinner, dancing, and festivities.
            </p>
            <ul className="text-[#4a5568] space-y-2 mb-6">
              <li className="flex items-start">
                <Calendar className="h-5 w-5 text-[#d4af7a] mr-3 mt-1" />
                <span>November 12, 2023 | 5:30 PM</span>
              </li>
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-[#d4af7a] mr-3 mt-1" />
                <span>The Grand Ballroom<br/>500 Rose Gardens Lane<br/>Portland, Oregon</span>
              </li>
              <li className="flex items-start">
                <Utensils className="h-5 w-5 text-[#d4af7a] mr-3 mt-1" />
                <span>Dinner and open bar provided</span>
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
