import React from 'react';
import { Parallax } from 'react-parallax';
import { 
  VerticalTimeline, 
  VerticalTimelineElement 
} from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import { Heart, Calendar, MapPin, Camera, MessagesSquare, Diamond } from 'lucide-react';

// Background image for parallax effect - using the watercolor background from the invitation
const bgImage = '/images/dress-code.jpg';

// Timeline data - replace with your own story events
const timelineEvents = [
  {
    date: 'December 15, 2019',
    title: 'First Meeting',
    description: 'We met at a mutual friend\'s birthday party. I knew from the first conversation that there was something special.',
    icon: <MessagesSquare />,
    iconClass: 'bg-pink-100 text-[#6b0f2b]',
  },
  {
    date: 'February 14, 2020',
    title: 'First Date',
    description: 'Our first official date was on Valentine\'s Day. We went to dinner and spent hours talking and getting to know each other.',
    icon: <Heart />,
    iconClass: 'bg-pink-200 text-[#6b0f2b]',
  },
  {
    date: 'August 10, 2020',
    title: 'First Trip Together',
    description: 'We took our first trip together to Boracay. It was during this trip that we really connected on a deeper level.',
    icon: <MapPin />,
    iconClass: 'bg-pink-300 text-[#6b0f2b]',
  },
  {
    date: 'December 24, 2020',
    title: 'First Holiday Together',
    description: 'We spent our first Christmas together with each other\'s families. It felt like we had known each other forever.',
    icon: <Calendar />,
    iconClass: 'bg-pink-400 text-[#6b0f2b]',
  },
  {
    date: 'July 15, 2021',
    title: 'Moving In Together',
    description: 'We decided to take the next step in our relationship and moved in together. Creating our first home together was so special.',
    icon: <Camera />,
    iconClass: 'bg-pink-500 text-white',
  },
  {
    date: 'May 20, 2024',
    title: 'The Proposal',
    description: 'On a beautiful sunset overlooking the city, I asked the love of my life to marry me, and the answer was YES!',
    icon: <Diamond />,
    iconClass: 'bg-[#6b0f2b] text-white',
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
              <h2 className="font-['Great_Vibes'] text-5xl text-[#6b0f2b] mb-4">Our Love Story</h2>
              <p className="font-['Cormorant_Garamond'] text-xl text-gray-600 max-w-2xl mx-auto">
                From the moment we met, we knew our journey together would be something special.
                Here's how our love story unfolded over the years.
              </p>
            </div>
            
            <VerticalTimeline lineColor="#6b0f2b" animate={true}>
              {timelineEvents.map((event, index) => (
                <VerticalTimelineElement
                  key={index}
                  date={event.date}
                  dateClassName="text-gray-700 font-['Cormorant_Garamond'] font-bold md:text-lg"
                  contentStyle={{ 
                    background: '#fff', 
                    boxShadow: '0 4px 20px rgba(107, 15, 43, 0.1)',
                    borderRadius: '12px',
                    padding: '2rem',
                    border: '1px solid rgba(107, 15, 43, 0.08)'
                  }}
                  contentArrowStyle={{ borderRight: '7px solid #fff' }}
                  iconStyle={{ 
                    background: event.iconClass.split(' ')[0],
                    color: event.iconClass.split(' ')[1],
                    boxShadow: '0 0 0 4px rgba(107, 15, 43, 0.2), 0 4px 20px rgba(107, 15, 43, 0.15)',
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