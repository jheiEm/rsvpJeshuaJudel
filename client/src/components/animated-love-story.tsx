import React from "react";
import { Parallax } from "react-parallax";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import {
  Heart,
  Building,
  Phone,
  Users,
  Coins,
  Store,
  Plane,
  AlertTriangle,
  UserRound,
  ShieldAlert, // For COVID
  CalendarCheck,
  Diamond,
  CalendarDays,
  Cloud,
  BookHeart,
} from "lucide-react";

// Background image for parallax effect - using the watercolor background from the invitation
const bgImage = "/images/dress-code.jpg";

// Timeline data - based on the love story document
const timelineEvents = [
  {
    date: "2016",
    title: "Met in STI, 2016",
    description:
      "We met as instructors and colleagues at STI, both teaching and trying to figure out how to balance work and life.",
    icon: <Building />,
    iconClass: "bg-pink-100 text-[#6b0f2b]",
  },
  {
    date: "2016",
    title: "The Flashdrive Incident",
    description:
      "The spark happened when Jeshua borrowed a **blue flashdrive** from Judel. She needed it for school to submit grades. This simple act became the perfect excuse to start talking.",
    icon: <Users />,
    iconClass: "bg-pink-200 text-[#6b0f2b]",
  },
  {
    date: "2016",
    title: "First Phone Call",
    description:
      "One day, Judel called Jeshua to remind him to bring the flashdrive back to school. During that call, she casually mentioned that his voice sounded cool. This little compliment led to more conversations and deeper connections.",
    icon: <Phone />,
    iconClass: "bg-pink-300 text-[#6b0f2b]",
  },
  {
    date: "2016",
    title: "Courting Period (3 months)",
    description:
      'Our **courting period** lasted for about 3 months, where we constantly hung out, talked, and learned about each other. The funny part? We called each other **"Bes"** (best friend) in the beginning, not even knowing that it would develop into something more serious.',
    icon: <Heart />,
    iconClass: "bg-pink-400 text-[#6b0f2b]",
  },
  {
    date: "2016",
    title: "The Bet",
    description:
      "One of the things we did during our early days together was a little bet. We agreed that the one who treats the other to food first would be the one to fall in love first. Jeshua, being the gentleman that he is, treated Judel after getting hooked first.",
    icon: <Coins />,
    iconClass: "bg-pink-500 text-white",
  },
  {
    date: "November 14, 2016",
    title: "The Sweetest Yes",
    description:
      "After months of getting to know each other and enjoying each other's company, the day finally came when Judel said the **sweetest yes** to Jeshua's proposal in **Jollibee Marawoy** on **November 14, 2016**. It wasn't a fancy proposal, but it was perfect for us.",
    icon: <Store />,
    iconClass: "bg-pink-600 text-white",
  },
  {
    date: "2017-2018",
    title: "Traveling Together",
    description:
      "We went on many **trips together**, exploring places, making memories, and learning about each other. These trips allowed us to grow closer as a couple and understand each other more deeply.",
    icon: <Plane />,
    iconClass: "bg-pink-700 text-white",
  },
  {
    date: "2019",
    title: "The Struggles",
    description:
      "In **2019**, we went through a rough patch and had **two serious breakups**. It was a challenging time, but each breakup taught us valuable lessons about ourselves and each other. Despite the pain, we came back stronger and more committed to making it work.",
    icon: <AlertTriangle />,
    iconClass: "bg-pink-800 text-white",
  },
  {
    date: "2019",
    title: "Asking for Her Hand in Marriage",
    description:
      "That same year, Jeshua tried to take the next step and asked Judel's family for her hand in marriage. It was a nerve-wracking moment, but unfortunately, **Inay (Judel's mom)** turned him down, saying it was important for Judel to focus on her career first.",
    icon: <UserRound />,
    iconClass: "bg-pink-900 text-white",
  },
  {
    date: "2020",
    title: "COVID Season – A Testing Time",
    description:
      "Then came **COVID-19**, and everything was put to the test. The pandemic forced us into situations we never imagined, and we found ourselves in almost a **long-distance relationship** due to the lockdowns and restrictions. It was a challenging time for us, but we managed to keep the bond strong despite the physical distance.",
    icon: <ShieldAlert />,
    iconClass: "bg-red-300 text-[#6b0f2b]",
  },
  {
    date: "2023",
    title: "The 7-Year Milestone",
    description:
      "**7 years** into the relationship, we hit a **major hurdle**, the kind of challenge that many say can break or make a relationship. It was a tough phase, but with time, communication, and patience, we found our way through. It only made us realize how much we meant to each other.",
    icon: <CalendarCheck />,
    iconClass: "bg-red-400 text-white",
  },
  {
    date: "December 31, 2023",
    title: "The Sweetest Yes (Again)",
    description:
      "After everything we've been through, the **sweetest yes** finally came, this time for a **marriage proposal** on **December 31, 2023** (12/31/23 or 123123). It was a special moment, made even more meaningful by everything we had overcome together.",
    icon: <Diamond />,
    iconClass: "bg-red-500 text-white",
  },
  {
    date: "2024",
    title: "Wedding Preparation – A Rollercoaster",
    description:
      "The **preparation for the wedding** wasn't as easy as we thought. There were many obstacles along the way – from family issues to financial challenges, and even doubts about whether we were ready for such a huge commitment. But we stuck together, solving problems as a team.",
    icon: <CalendarDays />,
    iconClass: "bg-red-600 text-white",
  },
  {
    date: "2024",
    title: "Darkest Moments",
    description:
      "We faced some of the **darkest moments** of our lives in this journey, but through it all, we never gave up on each other. We learned how to trust, forgive, and love unconditionally. In the end, all the struggles and challenges only strengthened our bond.",
    icon: <Cloud />,
    iconClass: "bg-red-700 text-white",
  },
  {
    date: "May 3, 2025",
    title: "Our Love Story – A Journey Worth Every Moment",
    description:
      "Looking back, our love story may not have been perfect, but it's **our story**. Through the highs and lows, we've built something beautiful, and now, we're ready for the next chapter of our lives together.",
    icon: <BookHeart />,
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
