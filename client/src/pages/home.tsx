import { useEffect } from "react";
import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import CountdownTimer from "@/components/countdown-timer";
import EventDetails from "@/components/event-details";
import Schedule from "@/components/schedule";
import Gallery from "@/components/gallery";
import RsvpForm from "@/components/rsvp-form";
import Contact from "@/components/contact";
import Footer from "@/components/footer";
import Entourage from "@/components/entourage";
import GuestMessageBoard from "@/components/guest-message-board";
import MusicPlayer from "@/components/music-player";
import AnimatedLoveStory from "@/components/animated-love-story";

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
      <AnimatedLoveStory />
      <EventDetails />
      <Schedule />
      <Entourage />
      <Gallery />
      <RsvpForm />
      <GuestMessageBoard />
      <Contact />
      <Footer />
      <MusicPlayer />
    </div>
  );
};

export default Home;
