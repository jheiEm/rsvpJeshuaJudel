import { useEffect } from "react";
import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import CountdownTimer from "@/components/countdown-timer";
import OurStory from "@/components/our-story";
import EventDetails from "@/components/event-details";
import Schedule from "@/components/schedule";
import Gallery from "@/components/gallery";
import RsvpForm from "@/components/rsvp-form";
import Contact from "@/components/contact";
import Footer from "@/components/footer";

const Home = () => {
  // Smooth scrolling for anchor links
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        const targetId = target.getAttribute('href');
        const targetElement = document.querySelector(targetId || '');
        
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
          
          // Update URL without page reload
          window.history.pushState(null, '', targetId);
        }
      }
    };
    
    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);
  
  return (
    <div className="bg-texture font-['Montserrat'] text-[#2d3748]">
      <Navigation />
      <HeroSection />
      <CountdownTimer />
      <OurStory />
      <EventDetails />
      <Schedule />
      <Gallery />
      <RsvpForm />
      <Contact />
      <Footer />
    </div>
  );
};

export default Home;
