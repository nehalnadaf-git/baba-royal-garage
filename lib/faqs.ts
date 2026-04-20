import type { FAQ } from "@/types";

export const faqs: FAQ[] = [
  // General
  {
    id: "faq-1",
    question: "What is Baba Royal Garage?",
    answer: "Baba Royal Garage is Hubli's dedicated Royal Enfield specialist garage. Founded by Babajan Nadaf with 6+ years of experience and 1000+ repairs completed, we offer comprehensive Royal Enfield care including routine servicing, engine overhauls, electrical diagnostics, and genuine spare parts. Visit us at our Keshwapur or Nehru Stadium branch, or use our doorstep pickup and drop service anywhere in Hubli.",
    category: "general",
  },
  {
    id: "faq-2",
    question: "Is Baba Royal Garage an authorized Royal Enfield service center?",
    answer: "Baba Royal Garage is a Royal Enfield specialist — not an official authorized dealer. We specialize exclusively in Royal Enfield motorcycles with 6+ years of dedicated experience. Our technicians are trained in all RE models from Classic 350 to the 650 twins. We use genuine Royal Enfield spare parts for every repair and service.",
    category: "general",
  },
  {
    id: "faq-3",
    question: "How many years of experience does Baba Royal Garage have?",
    answer: "Babajan Nadaf, our founder and chief technician, has over 6 years of hands-on experience working exclusively on Royal Enfield motorcycles. In that time, we have completed over 1000 Royal Enfield repairs at our two branches in Hubli — Keshwapur and Nehru Stadium.",
    category: "general",
  },
  {
    id: "faq-4",
    question: "Where is Baba Royal Garage located in Hubli?",
    answer: "We have two branches in Hubli. Our main Keshwapur Branch is at Irkal Building, Beside Convent High School, Bhavani Nagar, Keshwapur, Hubballi, Karnataka 580023. Our second branch is at Nehru Stadium, Hubli, Karnataka 580020. Both are open Monday to Saturday, 10 AM to 8 PM.",
    category: "location",
  },
  {
    id: "faq-5",
    question: "What are the working hours of Baba Royal Garage?",
    answer: "We are open Monday to Saturday from 10:00 AM to 8:00 PM. We are closed on Sundays. For emergencies, you can reach us on WhatsApp at +91 97422 91701 and we will respond as soon as possible.",
    category: "general",
  },
  // Booking
  {
    id: "faq-6",
    question: "How do I book a service at Baba Royal Garage?",
    answer: "You can book a service through our website by clicking the 'Book Service' button, which lets you describe your bike model and problem, then sends a pre-filled message to our WhatsApp. Alternatively, you can call us directly at +91 97422 91701 (Babajan Nadaf) or +91 80504 17479 (Raju), or walk in at either of our two branches in Keshwapur or Nehru Stadium.",
    category: "booking",
  },
  {
    id: "faq-7",
    question: "Can I book a service via WhatsApp?",
    answer: "Yes! WhatsApp is our preferred booking method. You can message us directly at +91 97422 91701 or use our website's booking form which generates a pre-filled WhatsApp message with your bike model and problem details. We typically respond within minutes during working hours.",
    category: "booking",
  },
  {
    id: "faq-8",
    question: "Do I need an appointment or can I walk in?",
    answer: "Both walk-ins and appointments are welcome! You can visit either our Keshwapur or Nehru Stadium branch during working hours (Mon-Sat 10AM-8PM) without an appointment. However, for major services like engine overhauls, we recommend booking in advance via WhatsApp so we can prepare the right parts.",
    category: "booking",
  },
  // Doorstep
  {
    id: "faq-9",
    question: "Does Baba Royal Garage offer doorstep pickup and drop service?",
    answer: "Yes! We offer doorstep pickup and drop service across all of Hubli. If your bike won't start or you can't ride it to our garage, call us at +91 97422 91701 and we will pick up your Royal Enfield from your location, service it at our workshop, and deliver it back to you. This service is available citywide.",
    category: "doorstep",
  },
  {
    id: "faq-10",
    question: "Which areas in Hubli does the doorstep service cover?",
    answer: "Our doorstep pickup and drop service covers all areas in Hubli including Keshwapur, Bhavani Nagar, Vidyanagar, Gokul Road, Navanagar, Deshpande Nagar, Kalyan Nagar, Shirur Park, Sadashivnagar, Hosur, and all surrounding neighborhoods. No matter where you are in Hubli, we will come to you.",
    category: "doorstep",
  },
  // Services
  {
    id: "faq-11",
    question: "What services does Baba Royal Garage offer?",
    answer: "We offer complete Royal Enfield care: general servicing & oil changes, engine overhaul & rebuild, clutch & gearbox repair, brake service, chain maintenance, tire service, battery replacement, electrical diagnostics, suspension service, fuel system cleaning, bike detailing, genuine spare parts fitting, and doorstep pickup & drop. All services are performed by RE-trained specialists using genuine parts.",
    category: "services",
  },
  {
    id: "faq-12",
    question: "Do you use genuine Royal Enfield spare parts?",
    answer: "Yes, we exclusively use genuine Royal Enfield spare parts for all repairs and replacements. Using authentic parts ensures optimal performance, proper fitment, and longevity for your motorcycle. We source our parts directly from authorized Royal Enfield suppliers.",
    category: "parts",
  },
  {
    id: "faq-13",
    question: "How long does a general Royal Enfield service take?",
    answer: "A standard general service including oil change, filter cleaning, and safety checks typically takes 2-3 hours. More complex services like engine overhauls may take 1-3 days depending on the work required. We always communicate the expected timeline before starting any work. Walk in at our Keshwapur or Nehru Stadium branch, or use doorstep pickup.",
    category: "services",
  },
  {
    id: "faq-14",
    question: "Can you fix Royal Enfield engine problems?",
    answer: "Absolutely. Engine diagnostics and repair is one of our core specialties. We handle everything from minor issues like unusual noises and oil leaks to full engine overhauls and rebuilds. Our 6+ years of Royal Enfield-specific experience means we can diagnose and fix engine problems that general mechanics often miss.",
    category: "services",
  },
  // Models
  {
    id: "faq-15",
    question: "Which Royal Enfield models do you service?",
    answer: "We service all Royal Enfield models including Classic 350, Classic 500, Meteor 350, Hunter 350, Bullet 350, Bullet 500, Thunderbird series, Himalayan 411, Himalayan 450, Continental GT 650, Interceptor 650, Super Meteor 650, and Shotgun 650. Both current models and legacy/discontinued models are handled with equal expertise.",
    category: "models",
  },
  {
    id: "faq-16",
    question: "Do you service Royal Enfield 650cc twin-cylinder bikes?",
    answer: "Yes, we are fully equipped to service the entire 650cc twin-cylinder range including the Continental GT 650, Interceptor 650, Super Meteor 650, and Shotgun 650. Our technicians have specific training on the 648cc parallel-twin engine and its unique maintenance requirements.",
    category: "models",
  },
  {
    id: "faq-17",
    question: "Can you service the new Himalayan 450?",
    answer: "Yes! We service the new Himalayan 450 with its Sherpa 450 engine, as well as the older Himalayan 411. Our technicians stay updated with training on all new Royal Enfield models as they are released. Visit either our Keshwapur or Nehru Stadium branch in Hubli.",
    category: "models",
  },
  // Pricing
  {
    id: "faq-18",
    question: "What payment methods does Baba Royal Garage accept?",
    answer: "We accept multiple payment methods for your convenience: Cash, UPI, Google Pay (GPay), and Paytm. You can pay using whichever method is most convenient for you after your service is complete.",
    category: "pricing",
  },
  {
    id: "faq-19",
    question: "How much does a Royal Enfield service cost in Hubli?",
    answer: "Service costs vary depending on the type of work needed and parts required. We believe in transparent, fair pricing — you will always get a clear explanation of what work is needed and why before we begin. Contact us on WhatsApp at +91 97422 91701 or call to discuss your specific requirements.",
    category: "pricing",
  },
  // Parts
  {
    id: "faq-20",
    question: "Can I buy Royal Enfield spare parts from Baba Royal Garage?",
    answer: "Yes, we stock a wide range of genuine Royal Enfield spare parts including engine components, brake pads, chains, sprockets, batteries, filters, clutch plates, and more. We also fit the parts for you. If a specific part is not in stock, we can order it and typically have it within 1-2 days.",
    category: "parts",
  },
  {
    id: "faq-21",
    question: "Do you provide warranty on spare parts and repairs?",
    answer: "All genuine Royal Enfield spare parts come with the manufacturer's standard warranty. We also stand behind our workmanship — if any issue arises from a repair we performed, bring your bike back and we will make it right. Contact us at +91 97422 91701 for warranty-related queries.",
    category: "parts",
  },
  // Location-specific
  {
    id: "faq-22",
    question: "Is there a Royal Enfield specialist near Gokul Road, Hubli?",
    answer: "Yes! Baba Royal Garage serves Gokul Road and all surrounding areas. Our Keshwapur branch is just a short ride from Gokul Road. We also offer doorstep pickup and drop service, so you don't even need to ride to our workshop. Call +91 97422 91701 to book.",
    category: "location",
  },
  {
    id: "faq-23",
    question: "Which branch is closest to Vidyanagar in Hubli?",
    answer: "Our Keshwapur Branch (Main) at Irkal Building, Beside Convent High School, Bhavani Nagar is the closest to Vidyanagar. It's approximately 2-3 km away. Alternatively, use our doorstep pickup service and we'll collect your bike from Vidyanagar directly.",
    category: "location",
  },
  {
    id: "faq-24",
    question: "Do you serve customers from Dharwad?",
    answer: "While our two branches are in Hubli (Keshwapur and Nehru Stadium), we do serve Royal Enfield owners from Dharwad and nearby areas. Many of our regular customers ride in from Dharwad for our specialist services. We also offer doorstep pickup within Hubli city limits.",
    category: "location",
  },
  {
    id: "faq-25",
    question: "What should I do if my Royal Enfield breaks down in Hubli?",
    answer: "Call us immediately at +91 97422 91701 or WhatsApp us. We offer emergency pickup service across Hubli. If your bike won't start or is not rideable, our team will come to your location, assess the situation, and either fix it on-site or transport it to our workshop. We aim for same-day response during working hours. You can also visit our emergency repair page for instant contact options.",
    category: "general",
  },
  {
    id: "faq-26",
    question: "Can I get my Royal Enfield serviced during monsoon season?",
    answer: "Absolutely! In fact, monsoon season is one of the most important times to service your Royal Enfield. We offer complete monsoon-readiness checks including brake inspection, chain lubrication, electrical system check, tire condition assessment, and rust protection treatment. Book your monsoon service at our Keshwapur or Nehru Stadium branch.",
    category: "services",
  },
  {
    id: "faq-27",
    question: "How often should I service my Royal Enfield?",
    answer: "We recommend a general service every 3,000-5,000 km or every 3-4 months, whichever comes first. Oil changes should be done every 3,000 km for optimal engine health. For specific maintenance schedules tailored to your model (Classic 350, Meteor 350, 650 twins, etc.), consult with our technicians at +91 97422 91701. Walk in at our Keshwapur or Nehru Stadium branch.",
    category: "services",
  },
];
