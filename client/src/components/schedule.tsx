import { motion } from "framer-motion";

// Schedule event type
interface ScheduleEvent {
  title: string;
  time: string;
  description: string;
}

const Schedule = () => {
  // Wedding schedule events
  const events: ScheduleEvent[] = [
    {
      title: "Guest Arrival",
      time: "2:00 PM - 2:45 PM",
      description: "Guests arrive and are seated at the ceremony venue."
    },
    {
      title: "Ceremony",
      time: "3:00 PM - 4:00 PM",
      description: "Exchange of vows and rings, followed by the pronouncement of marriage."
    },
    {
      title: "Cocktail Hour",
      time: "4:30 PM - 5:30 PM",
      description: "Enjoy drinks and appetizers while the newlyweds take photos."
    },
    {
      title: "Reception Dinner",
      time: "5:30 PM - 7:30 PM",
      description: "Dinner service, toasts, and speeches from family and friends."
    },
    {
      title: "Dancing & Celebration",
      time: "7:30 PM - 11:00 PM",
      description: "First dance, cake cutting, and dance floor opens for all guests."
    }
  ];
  
  return (
    <section className="py-20 bg-[#faf7f2]">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="font-['Great_Vibes'] text-4xl md:text-5xl text-[#d4af7a] text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Wedding Day Schedule
        </motion.h2>
        
        <div className="max-w-2xl mx-auto relative">
          {/* Timeline connector - vertical line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-[2px] h-full bg-[#d4af7a] z-[-1]"></div>
          
          {/* Timeline Events */}
          {events.map((event, index) => (
            <motion.div 
              key={index}
              className={`flex flex-col md:flex-row md:items-center ${index !== events.length - 1 ? 'mb-16' : ''} relative`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              {/* Timeline dot */}
              <div className="absolute left-1/2 top-0 md:top-1/2 transform -translate-x-1/2 w-5 h-5 rounded-full bg-[#d4af7a] border-[3px] border-[#faf7f2] z-[1]"></div>
              
              <div className="md:w-1/2 md:pr-12 md:text-right mb-4 md:mb-0">
                <h3 className="font-['Cormorant_Garamond'] text-xl text-[#c9a66b]">{event.title}</h3>
                <p className="text-[#4a5568] font-medium">{event.time}</p>
              </div>
              
              <div className="md:w-1/2 md:pl-12">
                <p className="text-[#718096]">{event.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Schedule;
