import { motion } from "framer-motion";
import { useState } from "react";
import { X } from "lucide-react";

interface GalleryImage {
  src: string;
  alt: string;
}

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  // Gallery images
  const images: GalleryImage[] = [
    {
      src: "/images/IMG_0089.jpg",
      alt: "Couple portrait",
    },
    {
      src: "/images/IMG_9661.jpg",
      alt: "Couple holding hands",
    },
    {
      src: "/images/IMG_9536.jpg",
      alt: "Engagement",
    },
    {
      src: "/images/IMG_9607.jpg",
      alt: "Wedding venue",
    },
    {
      src: "/images/IMG_9675.jpg",
      alt: "Floral arrangement",
    },
    {
      src: "/images/IMG_9918.jpg",
      alt: "Wedding decor",
    },
  ];

  const openImageModal = (image: GalleryImage) => {
    setSelectedImage(image);
    document.body.style.overflow = "hidden"; // Prevent scrolling when modal is open
  };

  const closeImageModal = () => {
    setSelectedImage(null);
    document.body.style.overflow = "auto"; // Re-enable scrolling
  };

  return (
    <section id="gallery" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.h2
          className="font-['Great_Vibes'] text-4xl md:text-5xl text-[#d4af7a] text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Our Gallery
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
          {images.map((image, index) => (
            <motion.div
              key={index}
              className="overflow-hidden rounded-lg shadow-md h-64 sm:h-72 md:h-80 cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              onClick={() => openImageModal(image)}
            >
              <motion.img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Full-size image modal */}
      {selectedImage && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            className="absolute top-5 right-5 text-white hover:text-[#d4af7a] transition-colors"
            onClick={closeImageModal}
          >
            <X className="h-8 w-8" />
          </button>

          <motion.img
            src={selectedImage.src}
            alt={selectedImage.alt}
            className="max-h-[90vh] max-w-[90vw] object-contain"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
      )}
    </section>
  );
};

export default Gallery;
