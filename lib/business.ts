import type { Business } from "@/types";

export const business: Business = {
  name: "Baba Royal Garage",
  tagline: "Royal Enfield Specialist",
  slogan: "Expert Care. Genuine Parts. Royal Treatment.",
  shortDescription:
    "Hubli's most trusted Royal Enfield specialist. Expert servicing, engine repair, genuine parts & doorstep pickup service across all of Hubli.",
  fullDescription:
    "Baba Royal Garage is Hubli's dedicated Royal Enfield specialist garage founded by Babajan Nadaf. With 6+ years of hands-on experience and 1000+ repairs completed, we offer complete Royal Enfield care — from routine servicing and oil changes to full engine overhauls. Walk in at either of our two branches or call for doorstep pickup and drop service anywhere in Hubli.",
  url: "https://babaroyalgarage.com",
  phone1: "+919742291701",
  phone1Display: "+91 97422 91701",
  phone1Name: "Babajan Nadaf",
  phone2: "+918050417479",
  phone2Display: "+91 80504 17479",
  phone2Name: "Raju",
  whatsapp: "919742291701",
  whatsappUrl: "https://wa.me/919742291701",
  experience: "6+",
  bikesServiced: "1000+",
  payment: ["Cash", "UPI", "GPay", "Paytm"],
  hours: {
    weekdays: "Monday – Saturday: 10:00 AM – 8:00 PM",
    sunday: "Sunday: Closed",
    short: "Mon–Sat 10AM–8PM",
    opens: "10:00",
    closes: "20:00",
    days: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
  },
  branches: [
    {
      id: "keshwapur",
      name: "Keshwapur Branch (Main)",
      address:
        "Irkal Building, Beside Convent High School, Bhavani Nagar, Keshwapur",
      city: "Hubballi",
      state: "Karnataka",
      pincode: "580023",
      lat: 15.3568479,
      lng: 75.1464629,
      mapsUrl: "https://maps.app.goo.gl/TcXmPTbPJbdzfATf8",
      mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3847.5!2d75.1464629!3d15.3568479!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTXCsDIxJzI0LjciTiA3NcKwMDgnNDcuMyJF!5e0!3m2!1sen!2sin!4v1700000000000",
    },
    {
      id: "nehru-stadium",
      name: "Nehru Stadium Branch",
      address: "Nehru Stadium",
      city: "Hubli",
      state: "Karnataka",
      pincode: "580020",
      lat: 15.3513985,
      lng: 75.1426777,
      mapsUrl: "https://maps.app.goo.gl/JqEB2r2a4c6vhjfi9",
      mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3847.5!2d75.1426777!3d15.3513985!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTXCsDIxJzA1LjAiTiA3NcKwMDgnMzMuNiJF!5e0!3m2!1sen!2sin!4v1700000000001",
    },
  ],
  owner: {
    name: "Babajan Nadaf",
    title: "Founder & Chief Royal Enfield Technician",
    description:
      "Babajan Nadaf is Hubli's most experienced Royal Enfield specialist with 6+ years dedicated exclusively to Royal Enfield motorcycles.",
  },
  social: {
    whatsapp: "https://wa.me/919742291701",
  },
};
