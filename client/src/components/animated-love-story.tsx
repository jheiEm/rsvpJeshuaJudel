import React from "react";
import { Parallax } from "react-parallax";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import {
  Heart,
  Calendar,
  MapPin,
  Camera,
  MessagesSquare,
  Diamond,
} from "lucide-react";

// Background image for parallax effect - using the watercolor background from the invitation
const bgImage = "/images/dress-code.jpg";

// Timeline data - replace with your own story events
const timelineEvents = [
  {
    date: "2016",
    title: "Met in STI, 2016",
    description:
      "We met as instructors and colleagues at STI, both teaching and trying to figure out how to balance work and life.",
    icon: <MessagesSquare />,
    iconClass: "bg-pink-100 text-[#6b0f2b]",
  },
  {
    date: "2016",
    title: "The Flashdrive Incident",
    description:
      "The spark happened when Jeshua borrowed a **blue flashdrive** from Judel. She needed it for school to submit grades. This simple act became the perfect excuse to start talking.",
    icon: <Heart />,
    iconClass: "bg-pink-200 text-[#6b0f2b]",
  },
  {
    date: "2016",
    title: "First Phone Call",
    description:
      "One day, Judel called Jeshua to remind him to bring the flashdrive back to school. During that call, she casually mentioned that his voice sounded cool. This little compliment led to more conversations and deeper connections.",
    icon: <MapPin />,
    iconClass: "bg-pink-300 text-[#6b0f2b]",
  },
  {
    date: "2016",
    title: "Courting Period",
    description:
      'Our **courting period** lasted for about 3 months, where we constantly hung out, talked, and learned about each other. The funny part? We called each other **"Bes"** (best friend) in the beginning, not even knowing that it would develop into something more serious. ',
    icon: <Calendar />,
    iconClass: "bg-pink-400 text-[#6b0f2b]",
  },
  {
    date: "2016",
    title: "The Bet",
    description:
      "One of the things we did during our early days together was a little bet. We agreed that the one who treats the other to food first would be the one to fall in love first. Jeshua, being the gentleman that he is, treated Judel after getting hooked first.  ",
    icon: <Camera />,
    iconClass: "bg-pink-500 text-white",
  },
  {
    date: "May 20, 2024",
    title: "The Proposal",
    description:
      "On a beautiful sunset overlooking the city, I asked the love of my life to marry me, and the answer was YES!",
    icon: <Diamond />,
    iconClass: "bg-[#6b0f2b] text-white",
  },
];

const AnimatedLoveStory = () => {
  return (
    <section id="story" className="scroll-mt-20">
      <Parallax
        bgImage={bgImage}
        strength={300}
        blur={{ min: -5, max: 15 }}
        className="bg-cover bg-center"
      >
        <div className="py-16 bg-white/80 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="font-['Great_Vibes'] text-5xl text-[#6b0f2b] mb-4">
                Our Love Story
              </h2>
              <p className="font-['Cormorant_Garamond'] text-xl text-gray-600 max-w-2xl mx-auto">
                From the moment we met, we knew our journey together would be
                something special. Here's how our love story unfolded over the
                years.
              </p>
            </div>

            <VerticalTimeline lineColor="#6b0f2b" animate={true}>
              {timelineEvents.map((event, index) => (
                <VerticalTimelineElement
                  key={index}
                  date={event.date}
                  dateClassName="text-gray-700 font-['Cormorant_Garamond'] font-bold md:text-lg"
                  contentStyle={{
                    background: "#fff",
                    boxShadow: "0 4px 20px rgba(107, 15, 43, 0.1)",
                    borderRadius: "12px",
                    padding: "2rem",
                    border: "1px solid rgba(107, 15, 43, 0.08)",
                  }}
                  contentArrowStyle={{ borderRight: "7px solid #fff" }}
                  iconStyle={{
                    background: event.iconClass.split(" ")[0],
                    color: event.iconClass.split(" ")[1],
                    boxShadow:
                      "0 0 0 4px rgba(107, 15, 43, 0.2), 0 4px 20px rgba(107, 15, 43, 0.15)",
                  }}
                  icon={event.icon}
                  visible={true}
                >
                  <h3 className="font-['Cormorant_Garamond'] text-2xl font-bold text-[#6b0f2b]">
                    {event.title}
                  </h3>
                  <p className="font-['Montserrat'] text-gray-700 mt-3">
                    {event.description}
                  </p>
                </VerticalTimelineElement>
              ))}
            </VerticalTimeline>
          </div>
        </div>
      </Parallax>
    </section>
  );
};

export default AnimatedLoveStory;
