import { motion } from "framer-motion";
import {
  Calendar,
  MapPin,
  Info,
  Utensils,
  Route,
  Navigation,
  Car,
  Clock,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

// For TypeScript type safety
declare global {
  interface Window {
    L: any;
  }
}

const EventDetails = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [showDirections, setShowDirections] = useState(false);

  // Initialize map when component mounts
  useEffect(() => {
    let map: any = null;
    let directionsControl: any = null;

    // Function to initialize the map
    const initializeMap = () => {
      if (!mapRef.current || !window.L) return;

      // Clear the map container in case it was initialized before
      mapRef.current.innerHTML = "";

      // Exact coordinates for the correct addresses
      // St Therese Church - St. Therese of the Child Jesus and the Holy Face Parish Church, Lipa City
      // Mountain Rock Resort - Santo Tomas - Lipa Rd, Lipa, Batangas
      const ceremonyCoords = [13.9445, 121.1621]; // St. Therese Church - more precise coordinates
      const receptionCoords = [13.9388, 121.1590]; // Mountain Rock Resort - more precise coordinates

      // Initialize map centered between the two locations
      map = window.L.map(mapRef.current).setView(
        [
          (ceremonyCoords[0] + receptionCoords[0]) / 2,
          (ceremonyCoords[1] + receptionCoords[1]) / 2,
        ],
        14,
      );

      // Add a prettier map tile layer (Mapbox Streets)
      window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      // Custom ceremony icon
      const ceremonyIcon = window.L.divIcon({
        html: `<div class="flex items-center justify-center w-8 h-8 rounded-full bg-[#6b0f2b] text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>`,
        className: "custom-div-icon",
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      });

      // Custom reception icon
      const receptionIcon = window.L.divIcon({
        html: `<div class="flex items-center justify-center w-8 h-8 rounded-full bg-[#6b0f2b] text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3"/>
                  <path d="M3 16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v2H7v-2a2 2 0 0 0-4 0Z"/>
                  <path d="M5 14v2"/>
                  <path d="M19 14v2"/>
                </svg>
              </div>`,
        className: "custom-div-icon",
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      });

      // Add markers for ceremony and reception
      const ceremonyMarker = window.L.marker(ceremonyCoords, {
        icon: ceremonyIcon,
      })
        .addTo(map)
        .bindPopup(
          `
          <div class="text-center">
            <h3 class="font-bold text-[#6b0f2b] mb-2">Ceremony</h3>
            <p>St. Therese of the Child Jesus and<br>the Holy Face Parish Church</p>
            <p class="text-xs text-gray-500 mt-1">Santo Tomas-Lipa Rd<br>Brgy. Talisay, Lipa City, Batangas</p>
            <a href="https://maps.google.com/?q=13.9445,121.1621" target="_blank" class="block mt-2 text-blue-500 text-sm">Open in Google Maps</a>
          </div>
        `,
          { maxWidth: 220 },
        )
        .openPopup();

      const receptionMarker = window.L.marker(receptionCoords, {
        icon: receptionIcon,
      })
        .addTo(map)
        .bindPopup(
          `
          <div class="text-center">
            <h3 class="font-bold text-[#6b0f2b] mb-2">Reception</h3>
            <p>Mountain Rock Resort</p>
            <p class="text-xs text-gray-500 mt-1">Santo Tomas - Lipa Rd<br>Brgy. Talisay, Lipa City, Batangas</p>
            <a href="https://maps.google.com/?q=13.9388,121.1590" target="_blank" class="block mt-2 text-blue-500 text-sm">Open in Google Maps</a>
          </div>
        `,
          { maxWidth: 220 },
        );

      // Add a polyline to show the route between the ceremony and reception
      const routeCoordinates = [
        ceremonyCoords,
        [13.9425, 121.1610], // Intersection point 1
        [13.9412, 121.1603], // Mid-point
        [13.9395, 121.1595], // Intersection point 2
        receptionCoords,
      ];

      const routeLine = window.L.polyline(routeCoordinates, {
        color: "#6b0f2b",
        weight: 4,
        opacity: 0.7,
        dashArray: "10, 10",
        lineJoin: "round",
      }).addTo(map);

      // Fit map to show the entire route
      const bounds = window.L.latLngBounds(routeCoordinates);
      map.fitBounds(bounds, { padding: [30, 30] });

      // Save the map instance to state for later reference
      return map;
    };

    // Load Leaflet
    const loadScripts = () => {
      // Load Leaflet CSS
      const linkEl = document.createElement("link");
      linkEl.rel = "stylesheet";
      linkEl.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(linkEl);

      // Load Leaflet JS
      const scriptEl = document.createElement("script");
      scriptEl.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      scriptEl.onload = () => {
        map = initializeMap();
      };
      document.head.appendChild(scriptEl);
    };

    // Initialize or load scripts
    if (!window.L) {
      loadScripts();
    } else {
      map = initializeMap();
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
            <h3 className="font-['Cormorant_Garamond'] text-2xl text-[#6b0f2b] mb-2">
              The Ceremony
            </h3>
            <div className="h-[1px] w-16 mb-4 bg-gradient-to-r from-transparent via-[#6b0f2b] to-transparent"></div>
            <p className="font-['Montserrat'] text-[#718096] mb-4">
              Join us as we exchange vows and begin our journey as husband and
              wife.
            </p>
            <ul className="text-[#4a5568] space-y-2 mb-6">
              <li className="flex items-start">
                <Calendar className="h-5 w-5 text-[#6b0f2b] mr-3 mt-1" />
                <span>May 3, 2025 | 1:00 PM</span>
              </li>
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-[#6b0f2b] mr-3 mt-1" />
                <span>
                  St. Therese of the Child Jesus and
                  <br />
                  the Holy Face Parish Church
                  <br />
                  Brgy. Talisay, Lipa City
                </span>
              </li>
              <li className="flex items-start">
                <Info className="h-5 w-5 text-[#6b0f2b] mr-3 mt-1" />
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
            <h3 className="font-['Cormorant_Garamond'] text-2xl text-[#6b0f2b] mb-2">
              The Reception
            </h3>
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
                <span>
                  Mountain Rock Resort
                  <br />
                  Brgy. Talisay, Lipa City
                </span>
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
          <h3 className="font-['Cormorant_Garamond'] text-2xl text-[#6b0f2b] text-center mb-2">
            Wedding Locations
          </h3>
          <p className="text-center text-[#4a5568] mb-6 max-w-2xl mx-auto">
            Our ceremony and reception venues are located only a short 5-minute
            drive from each other. Use the interactive map below to see
            directions from the church to the reception.
          </p>

          <div className="aspect-video h-80 rounded-lg overflow-hidden shadow-lg mb-8">
            <div ref={mapRef} className="w-full h-full bg-[#a0aec0]">
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-[#4a5568]">Interactive map loading...</p>
              </div>
            </div>
          </div>

          {/* Direction Toggle Button */}
          <div className="flex justify-center mb-8">
            <button
              onClick={() => setShowDirections(!showDirections)}
              className="flex items-center gap-2 bg-[#6b0f2b] hover:bg-[#890f32] text-white py-2 px-4 rounded-full transition-all duration-300"
            >
              {showDirections ? (
                <>
                  <Car className="h-5 w-5" />
                  <span>Hide Directions</span>
                </>
              ) : (
                <>
                  <Route className="h-5 w-5" />
                  <span>Show Directions</span>
                </>
              )}
            </button>
          </div>

          {/* Directions */}
          {showDirections && (
            <motion.div
              className="bg-[#fff5f7] rounded-lg p-6 border border-[#e8c1c8] shadow-sm mb-8"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h4 className="font-['Cormorant_Garamond'] text-xl text-center text-[#6b0f2b] mb-4">
                Directions from Church to Reception
              </h4>

              <div className="flex items-start gap-4 mb-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#6b0f2b] text-white flex items-center justify-center">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[#4a5568] font-medium">
                    Estimated Travel Time: 5 minutes (0.6 km)
                  </p>
                </div>
              </div>

              <div className="pl-12 relative">
                {/* Vertical line connecting direction steps */}
                <div className="absolute left-3 top-2 bottom-0 w-0.5 bg-[#e8c1c8]"></div>

                <ul className="space-y-6">
                  <li className="relative">
                    <div className="absolute left-[-24px] top-0 w-6 h-6 rounded-full bg-white border-2 border-[#6b0f2b] flex items-center justify-center">
                      <span className="text-[#6b0f2b] font-bold text-xs">
                        1
                      </span>
                    </div>
                    <p className="text-[#4a5568]">
                      Exit{" "}
                      <strong>
                        St. Therese of the Child Jesus and the Holy Face Parish
                        Church
                      </strong>{" "}
                      and turn right onto Santo Tomas-Lipa Road heading
                      southwest.
                    </p>
                  </li>

                  <li className="relative">
                    <div className="absolute left-[-24px] top-0 w-6 h-6 rounded-full bg-white border-2 border-[#6b0f2b] flex items-center justify-center">
                      <span className="text-[#6b0f2b] font-bold text-xs">
                        2
                      </span>
                    </div>
                    <p className="text-[#4a5568]">
                      Continue straight for approximately 400 meters on Santo
                      Tomas-Lipa Road.
                    </p>
                  </li>

                  <li className="relative">
                    <div className="absolute left-[-24px] top-0 w-6 h-6 rounded-full bg-white border-2 border-[#6b0f2b] flex items-center justify-center">
                      <span className="text-[#6b0f2b] font-bold text-xs">
                        3
                      </span>
                    </div>
                    <p className="text-[#4a5568]">
                      Look for the <strong>Mountain Rock Resort</strong> signage
                      on your right. Turn right into the resort entrance.
                    </p>
                  </li>

                  <li className="relative">
                    <div className="absolute left-[-24px] top-0 w-6 h-6 rounded-full bg-white border-2 border-[#6b0f2b] flex items-center justify-center">
                      <span className="text-[#6b0f2b] font-bold text-xs">
                        4
                      </span>
                    </div>
                    <p className="text-[#4a5568]">
                      Follow the driveway to the reception area where ushers
                      will guide you to the parking area.
                    </p>
                  </li>
                </ul>
              </div>

              <div className="mt-8 flex justify-center">
                <a
                  href="https://www.google.com/maps/dir/13.9445,121.1621/13.9388,121.1590"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#6b0f2b] hover:bg-[#890f32] text-white py-2 px-4 rounded-md flex items-center gap-2 transition-all duration-300"
                >
                  <Navigation className="h-4 w-4" />
                  <span>Get Directions on Google Maps</span>
                </a>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default EventDetails;
