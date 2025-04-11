
import { useEffect, useState } from "react";

const ProgressBar = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const sections = document.querySelectorAll("section");
    const updateProgress = () => {
      const windowHeight = window.innerHeight;
      const scrollY = window.scrollY;
      const pageHeight = document.documentElement.scrollHeight - windowHeight;
      
      let currentSection = 0;
      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= windowHeight / 2) {
          currentSection = index + 1;
        }
      });

      const sectionProgress = (currentSection / sections.length) * 100;
      const scrollProgress = (scrollY / pageHeight) * 100;
      
      setProgress(Math.min(scrollProgress, sectionProgress));
    };

    window.addEventListener("scroll", updateProgress);
    updateProgress();

    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  return (
    <div className="fixed top-[60px] left-0 w-full h-1 bg-[#f3d4dc] z-50">
      <div
        className="h-full bg-[#6b0f2b] transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default ProgressBar;
