import { motion } from "framer-motion";
import { Clock } from "lucide-react";

// Schedule event type
interface ScheduleEvent {
  title: string;
  time: string;
  description: string;
}

const Schedule = () => {
  // Wedding schedule events for May 3, 2025
  const events: ScheduleEvent[] = [
    {
      title: "Guest Arrival",
      time: "12:00 NN",
      description:
        "Guests arrive and are seated at St. Therese of the Child Jesus and the Holy Face Parish Church.",
    },
    {
      title: "Processionals",
      time: "12:30 PM",
      description: "Principal Sponsors, sponsors and guests processionals.",
    },
    {
      title: "Start of Ceremony",
      time: "1:00 PM",
      description:
        "Celebration of the Holy Eucharist followed by the exchange of vows and rings.",
    },
    {
      title: "Newlywed Portrait",
      time: "2:00 PM",
      description: "Group photos with family and friends at the church.",
    },
    {
      title: "Reception Start of the Program",
      time: "3:00 PM",
      description:
        "Guests arrive at Mountain Rock Resort for cocktails and appetizers.",
    },
    {
      title: "Reception Ends",
      time: "6:00 PM",
      description:
        "First dance, cake cutting, and open dance floor for all guests.",
    },
  ];

  return (
    <section id="schedule" className="py-20 bg-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 right-10 opacity-5">
        <svg
          width="200"
          height="200"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2M12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4M12.5 7L11 7.75V12.5H15V11H12.5V7Z"
            fill="#6b0f2b"
          />
        </svg>
      </div>

      <div className="container mx-auto px-4">
        <motion.h2
          className="font-['Great_Vibes'] text-4xl md:text-5xl text-[#6b0f2b] text-center mb-16 relative"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Wedding Day Schedule
          <div className="absolute h-[2px] w-40 bg-gradient-to-r from-transparent via-[#6b0f2b] to-transparent mx-auto left-1/2 transform -translate-x-1/2 bottom-[-0.5rem]"></div>
        </motion.h2>

        <div className="flex justify-center mb-10">
          <div className="flex items-center bg-[#fff5f7] px-6 py-3 rounded-full shadow-sm border border-[#e8c1c8]">
            <Clock className="text-[#6b0f2b] mr-2" />
            <span className="font-['Cormorant_Garamond'] text-xl text-[#6b0f2b]">
              May 3, 2025
            </span>
          </div>
        </div>

        <div className="max-w-3xl mx-auto relative">
          {/* Timeline connector - vertical line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-[2px] h-full bg-[#e8c1c8] z-[-1]"></div>

          {/* Timeline Events */}
          {events.map((event, index) => (
            <motion.div
              key={index}
              className={`flex flex-col md:flex-row md:items-center ${index !== events.length - 1 ? "mb-16" : ""} relative`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              {/* Timeline dot */}
              <div className="absolute left-1/2 top-0 md:top-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-[#6b0f2b] border-[3px] border-white shadow-md z-[1]"></div>

              <div className="md:w-1/2 md:pr-16 md:text-right mb-6 md:mb-0">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-[#e8c1c8] md:ml-auto md:mr-0 md:max-w-xs">
                  <h3 className="font-['Cormorant_Garamond'] text-xl text-[#6b0f2b] mb-1">
                    {event.title}
                  </h3>
                  <p className="text-[#4a5568] font-medium text-sm mb-0">
                    {event.time}
                  </p>
                </div>
              </div>

              <div className="md:w-1/2 md:pl-16">
                <div className="bg-[#fff5f7] p-4 rounded-lg shadow-sm border border-[#e8c1c8] md:mr-auto md:ml-0 md:max-w-xs">
                  <p className="text-[#4a5568] font-['Cormorant_Garamond'] text-lg mb-0">
                    {event.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Schedule;
