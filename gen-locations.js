const fs = require('fs');
const base = __dirname;

const locations = [
  {
    id: 'l1', slug: 'royal-enfield-service-keshwapur-hubli', name: 'Keshwapur',
    branch: 'keshwapur', dist: '0 km (Main Branch)',
    landmarks: ['Convent High School', 'Bhavani Nagar', 'Irkal Building', 'Keshwapur Circle'],
    mt: 'Royal Enfield Service Centre Keshwapur Hubli | Baba Royal',
    md: 'Baba Royal Garage — Royal Enfield specialist in Keshwapur, Hubli. Main branch. Call +91 97422 91701.',
    faqs: [
      {q:'Where is Baba Royal Garage in Keshwapur?',a:'Irkal Building, Beside Convent High School, Bhavani Nagar, Keshwapur, Hubballi 580023.'},
      {q:'Is Keshwapur branch the main branch?',a:'Yes, our Keshwapur branch is the main workshop with full equipment for all services.'},
      {q:'What services are available at Keshwapur branch?',a:'All services: general servicing, engine overhaul, clutch, gearbox, brakes, suspension, electrical, detailing, and spare parts.'},
      {q:'What are Keshwapur branch working hours?',a:'Monday to Saturday, 10:00 AM to 8:00 PM. Closed Sundays.'},
      {q:'Is parking available at Keshwapur branch?',a:'Yes, there is parking space available at the Keshwapur branch premises.'},
    ],
    desc: `If you are a Royal Enfield rider in Keshwapur, Hubli, you have access to the best Royal Enfield specialist garage in the city right in your neighborhood. Baba Royal Garage's main branch is located at Irkal Building, Beside Convent High School, Bhavani Nagar, Keshwapur — making it the most convenient choice for Royal Enfield owners across Keshwapur and its surrounding areas.\n\nOur Keshwapur branch is our flagship workshop, fully equipped to handle every Royal Enfield service from routine oil changes to complete engine overhauls. The main branch has the most comprehensive tooling, largest parts inventory, and our senior technicians present daily. When your Royal Enfield needs the most thorough attention, the Keshwapur branch delivers it.\n\nKeshwapur is a well-connected neighborhood in Hubballi, with easy access from Bhavani Nagar, Vidyanagar, and the surrounding residential areas. Whether you ride in from nearby streets or further away in the city, our Keshwapur location is straightforward to find beside the landmark Convent High School on the Irkal Building premises.\n\nRiders from across Keshwapur bring their Classic 350, Meteor 350, Hunter 350, Bullet, Himalayan, and 650cc twin models to our main branch. We have built long-standing relationships with Keshwapur's Royal Enfield community over 6+ years of dedicated service. Our wall is covered with thank-you messages from satisfied Keshwapur riders.\n\nFor Royal Enfield owners in Keshwapur who cannot ride in, we also offer doorstep pickup and drop service. Call +91 97422 91701 and we will come to your home or office in Keshwapur. You can also walk in any day Monday through Saturday between 10 AM and 8 PM.`
  },
  {
    id: 'l2', slug: 'royal-enfield-service-vidyanagar-hubli', name: 'Vidyanagar',
    branch: 'keshwapur', dist: '~2 km',
    landmarks: ['Vidyanagar Post Office', 'KCD Layout', 'Siddharth Colony', 'Vidyanagar Bypass'],
    mt: 'Royal Enfield Service Vidyanagar Hubli | Baba Royal Garage',
    md: 'Baba Royal Garage serves Vidyanagar, Hubli for Royal Enfield service. Pickup available. Call +91 97422 91701.',
    faqs: [
      {q:'Is there a Royal Enfield specialist near Vidyanagar Hubli?',a:'Yes! Baba Royal Garage\'s Keshwapur branch is just ~2 km from Vidyanagar. We also offer doorstep pickup.'},
      {q:'Can I get Royal Enfield pickup from Vidyanagar?',a:'Absolutely! Call +91 97422 91701 for doorstep pickup from Vidyanagar anywhere in Hubli.'},
      {q:'Which branch serves Vidyanagar riders?',a:'Our Keshwapur main branch is closest to Vidyanagar riders.'},
      {q:'Do you service all RE models for Vidyanagar customers?',a:'Yes, Classic 350, Meteor, Hunter, Himalayan, 650cc twins — all models for Vidyanagar riders.'},
      {q:'What are your timings for Vidyanagar service?',a:'Walk in Mon-Sat 10AM-8PM, or call +91 97422 91701 for same-day doorstep pickup from Vidyanagar.'},
    ],
    desc: `Royal Enfield riders in Vidyanagar, Hubli, have a dedicated specialist just around the corner. Baba Royal Garage serves the Vidyanagar community from our main Keshwapur branch, located approximately 2 km away, and through our doorstep pickup and drop service that comes directly to your Vidyanagar home or office.\n\nVidyanagar is one of Hubli's established residential neighborhoods, home to a significant Royal Enfield riding community. Whether you ride a Classic 350 on your daily university commute, a Meteor 350 on weekend scenic rides, or a powerful 650cc twin, we have the expertise to keep your bike at its best.\n\nThe connection from Vidyanagar to our Keshwapur branch is an easy, short ride — perfect for bikes that are running but due for service. For bikes that need urgent attention or cannot be ridden, our doorstep pickup service offers the ultimate convenience. Call +91 97422 91701 and we will arrive at your Vidyanagar location within 1-2 hours.\n\nOver the years, we have built a strong reputation with Vidyanagar's RE community. Many of our long-term customers live in Vidyanagar and consider Baba Royal Garage their trusted service partner. From routine servicing to engine overhauls, every Royal Enfield service performed for Vidyanagar customers receives the same attention to detail we deliver at our workshop.\n\nFor Vidyanagar Royal Enfield riders — call +91 97422 91701 to schedule your service, request doorstep pickup, or simply ride in to our Keshwapur branch Monday through Saturday, 10 AM to 8 PM.`
  },
  {
    id: 'l3', slug: 'royal-enfield-service-gokul-road-hubli', name: 'Gokul Road',
    branch: 'keshwapur', dist: '~4 km',
    landmarks: ['Gokul Road Junction', 'Hubli Airport Road', 'KPTCL Circle', 'Gokul Extension'],
    mt: 'Royal Enfield Service Gokul Road Hubli | Baba Royal Garage',
    md: 'Baba Royal Garage serves Gokul Road, Hubli for Royal Enfield service. Doorstep pickup. Call +91 97422 91701.',
    faqs: [
      {q:'Is there a Royal Enfield specialist near Gokul Road Hubli?',a:'Yes! Baba Royal Garage serves Gokul Road with full service and doorstep pickup. Call +91 97422 91701.'},
      {q:'How far is Baba Royal Garage from Gokul Road?',a:'Our Keshwapur main branch is approximately 4 km from Gokul Road Junction.'},
      {q:'Can I get doorstep Royal Enfield service on Gokul Road?',a:'Absolutely! Call +91 97422 91701 for same-day pickup anywhere on Gokul Road, Hubli.'},
      {q:'Which Royal Enfield models do you service for Gokul Road riders?',a:'All models: Classic 350, Meteor, Hunter, Himalayan 411 & 450, and all 650cc twins.'},
      {q:'What are your working hours for Gokul Road customers?',a:'Walk in Mon-Sat 10AM-8PM at Keshwapur, or call for doorstep pickup anytime during hours.'},
    ],
    desc: `Gokul Road is one of Hubli's most active commuter corridors, and Royal Enfield motorcycles are a common sight on this stretch. Baba Royal Garage is the Royal Enfield specialist of choice for Gokul Road riders, serving this community from our Keshwapur main branch and through doorstep pickup service directly to Gokul Road.\n\nGokul Road leads from central Hubli toward the airport and industrial areas, making it a route that sees both commuter and touring Royal Enfield riders. The road conditions and distances demand well-maintained bikes. Our services keep Gokul Road RE riders' chains, brakes, tires, and engines in top condition.\n\nThe approximately 4 km ride from Gokul Road to our Keshwapur branch is straightforward, and many Gokul Road customers prefer to combine their service drop-off with other errands in the Keshwapur area. Alternatively, our doorstep pickup service makes the trip entirely unnecessary — we come to you on Gokul Road.\n\nFor Gokul Road riders who have encountered breakdowns, flat tires, or bikes that will not start, our emergency pickup service is invaluable. Call +91 97422 91701 and we will typically be at your Gokul Road location within 1-2 hours during working hours.\n\nWe service all Royal Enfield models popular among Gokul Road riders — from the nimble Hunter 350 perfect for the road's traffic to the touring-ready Meteor 350 and adventurous Himalayan. All services use genuine Royal Enfield parts. Walk in Monday through Saturday, 10 AM to 8 PM, or call for doorstep service.`
  },
  {
    id: 'l4', slug: 'royal-enfield-service-navanagar-hubli', name: 'Navanagar',
    branch: 'nehru-stadium', dist: '~3 km',
    landmarks: ['Navanagar Bus Stand', 'BDA Colony', 'Navanagar Post Office', 'Navanagar Layout'],
    mt: 'Royal Enfield Service Navanagar Hubli | Baba Royal Garage',
    md: 'Baba Royal Garage serves Navanagar, Hubli for Royal Enfield service & repair. Call +91 97422 91701.',
    faqs: [
      {q:'Is there a Royal Enfield specialist near Navanagar Hubli?',a:'Yes! Baba Royal Garage\'s Nehru Stadium branch serves Navanagar riders. We also offer doorstep pickup.'},
      {q:'Which branch is closest to Navanagar?',a:'Our Nehru Stadium branch is approximately 3 km from Navanagar.'},
      {q:'Can I get Royal Enfield pickup from Navanagar?',a:'Yes! Call +91 97422 91701 for same-day doorstep pickup from Navanagar.'},
      {q:'Do you have Royal Enfield spare parts for Navanagar customers?',a:'Yes, all genuine RE parts are stocked at both branches and available for Navanagar riders.'},
      {q:'How can I book a service from Navanagar?',a:'Call +91 97422 91701, WhatsApp, or use our website booking form. Doorstep pickup available from Navanagar.'},
    ],
    desc: `Royal Enfield riders in Navanagar, Hubli, have a trusted specialist at their service in Baba Royal Garage. We serve the Navanagar community from our Nehru Stadium branch — approximately 3 km from Navanagar — and through our comprehensive doorstep pickup and drop service across the area.\n\nNavanagar is a well-established residential locality in Hubli known for its planned layout and active community. The area's Royal Enfield riders include daily commuters, weekend touring enthusiasts, and adventure riders who head toward the Sahyadri foothills. Baba Royal Garage keeps all their motorcycles running at peak performance.\n\nFor Navanagar riders, the short trip to our Nehru Stadium branch is an easy ride. The branch handles all Royal Enfield services including general servicing, oil changes, engine work, clutch and gearbox repair, electrical diagnostics, suspension service, and genuine spare parts. No Royal Enfield problem is too minor or too complex for our Nehru Stadium team.\n\nWhen rides are not possible — whether due to a dead battery, a flat tire in your Navanagar parking spot, or simply a busy schedule — our doorstep pickup service handles everything. We collect your Royal Enfield from your Navanagar address, service it at our workshop, and return it repaired and ready.\n\nNavanagar Royal Enfield owners have been part of the Baba Royal Garage family since we opened. Call +91 97422 91701 or walk in at our Nehru Stadium branch (Mon-Sat 10AM-8PM) for all your Royal Enfield needs.`
  },
  {
    id: 'l5', slug: 'royal-enfield-service-deshpande-nagar-hubli', name: 'Deshpande Nagar',
    branch: 'keshwapur', dist: '~3 km',
    landmarks: ['Deshpande Nagar Chowk', 'Hubli-Dharwad Old Road', 'Deshpande Foundation', 'Sector Layout'],
    mt: 'Royal Enfield Service Deshpande Nagar Hubli | Baba Royal',
    md: 'Baba Royal Garage serves Deshpande Nagar, Hubli. Royal Enfield specialist. Call +91 97422 91701.',
    faqs: [
      {q:'Royal Enfield service near Deshpande Nagar Hubli?',a:'Yes! Baba Royal Garage\'s Keshwapur branch is ~3 km from Deshpande Nagar. Doorstep pickup available.'},
      {q:'Which branch serves Deshpande Nagar?',a:'Our Keshwapur main branch is the closest to Deshpande Nagar.'},
      {q:'Can I get doorstep Royal Enfield service in Deshpande Nagar?',a:'Yes! Call +91 97422 91701 for same-day pickup from Deshpande Nagar.'},
      {q:'Do you fix RE engines for Deshpande Nagar riders?',a:'Yes, from oil changes to full engine overhauls for all RE models.'},
      {q:'How do I book a service from Deshpande Nagar?',a:'Call +91 97422 91701 or WhatsApp. We will arrange doorstep pickup or you can walk in at Keshwapur.'},
    ],
    desc: `Deshpande Nagar is a growing residential and commercial neighborhood in Hubli, and its Royal Enfield riders rely on Baba Royal Garage as their specialist service partner. Our Keshwapur main branch, located approximately 3 km from Deshpande Nagar, provides full Royal Enfield care for this community — complemented by the doorstep pickup service that comes directly to your Deshpande Nagar location.\n\nThe area around Deshpande Nagar has seen rapid development in recent years, with a growing population of Royal Enfield enthusiasts. Many professionals and families in Deshpande Nagar choose Royal Enfield motorcycles for their daily commute and weekend rides. These bikes deserve specialist care, and Baba Royal Garage delivers exactly that.\n\nFor Deshpande Nagar riders, our service menu covers every Royal Enfield need: routine oil changes and servicing, clutch and gearbox repairs, brake service, electrical diagnostics, suspension work, detailing, and genuine spare parts. Whatever your Classic 350, Meteor, Hunter, Himalayan, or 650cc twin needs, our Keshwapur technicians handle it.\n\nThe short ride to Keshwapur from Deshpande Nagar is pleasant, passing through familiar Hubli streets. If you prefer doorstep service, our team will pick up your Royal Enfield from your Deshpande Nagar home or office at a time that suits you.\n\nFor Deshpande Nagar Royal Enfield owners — call +91 97422 91701 or WhatsApp to schedule your service. Walk-ins welcome Monday through Saturday, 10 AM to 8 PM at our Keshwapur main branch.`
  },
  {
    id: 'l6', slug: 'royal-enfield-service-kalyan-nagar-hubli', name: 'Kalyan Nagar',
    branch: 'nehru-stadium', dist: '~2 km',
    landmarks: ['Kalyan Nagar Bus Stand', 'APMC Road', 'Kalyan Water Tank', 'Kalyan Nagar Housing Society'],
    mt: 'Royal Enfield Service Kalyan Nagar Hubli | Baba Royal Garage',
    md: 'Baba Royal Garage serves Kalyan Nagar, Hubli for Royal Enfield service. Call +91 97422 91701.',
    faqs: [
      {q:'Royal Enfield service near Kalyan Nagar Hubli?',a:'Yes! Our Nehru Stadium branch is ~2 km from Kalyan Nagar. Doorstep pickup also available.'},
      {q:'How far is Baba Royal Garage from Kalyan Nagar?',a:'Approximately 2 km to our Nehru Stadium branch — a very quick ride.'},
      {q:'Can I get Royal Enfield repaired in Kalyan Nagar?',a:'We offer doorstep pickup from Kalyan Nagar or you can ride to our Nehru Stadium branch.'},
      {q:'Which RE models do you service for Kalyan Nagar?',a:'All models — Classic, Meteor, Hunter, Himalayan 411 & 450, and all 650cc twins.'},
      {q:'What is the fastest way to get service from Kalyan Nagar?',a:'Call +91 97422 91701 for immediate WhatsApp response and doorstep pickup booking.'},
    ],
    desc: `Royal Enfield riders in Kalyan Nagar, Hubli, have one of the most convenient access points to expert motorcycle care. Our Nehru Stadium branch is located just approximately 2 km from Kalyan Nagar, making it one of the quickest rides to specialist Royal Enfield service in the city. Baba Royal Garage has been serving the Kalyan Nagar Royal Enfield community for 6+ years.\n\nKalyan Nagar is a residential neighborhood adjacent to key Hubli roads, and its residents include a loyal community of Royal Enfield riders. From Classic 350 commuters to weekend 650cc twin tourers, the variety of Royal Enfield models in Kalyan Nagar reflects the bike's broad appeal. Our Nehru Stadium workshop handles them all.\n\nThe 2 km ride from Kalyan Nagar to our Nehru Stadium branch takes just minutes, making it practical to drop your bike off and collect it the same day for most services. For engine overhauls or complex repairs, we will keep you updated via WhatsApp throughout the process.\n\nFor Kalyan Nagar riders who prefer maximum convenience, our doorstep pickup service is the answer. A call to +91 97422 91701 sets the process in motion — we arrive at your Kalyan Nagar address, pick up your Royal Enfield, perform the required service at our workshop, and deliver it back to you.\n\nKalyan Nagar Royal Enfield owners — we are just around the corner. Walk in at our Nehru Stadium branch Monday through Saturday, 10 AM to 8 PM, or call +91 97422 91701 for immediate assistance.`
  },
  {
    id: 'l7', slug: 'royal-enfield-service-shirur-park-hubli', name: 'Shirur Park',
    branch: 'nehru-stadium', dist: '~2.5 km',
    landmarks: ['Shirur Park Garden', 'Shirur Colony', 'Nehru Stadium Road', 'Shirur Extension'],
    mt: 'Royal Enfield Service Shirur Park Hubli | Baba Royal Garage',
    md: 'Baba Royal Garage serves Shirur Park, Hubli for Royal Enfield service. Call +91 97422 91701.',
    faqs: [
      {q:'Royal Enfield mechanic near Shirur Park Hubli?',a:'Baba Royal Garage\'s Nehru Stadium branch is just ~2.5 km from Shirur Park.'},
      {q:'Can I get doorstep Royal Enfield service in Shirur Park?',a:'Yes! Call +91 97422 91701 for same-day pickup from Shirur Park.'},
      {q:'Which branch is closest to Shirur Park?',a:'Our Nehru Stadium branch is the closest to Shirur Park area.'},
      {q:'Do you service Himalayan at Shirur Park?',a:'Yes, we service all RE models including Himalayan 411 and 450 for Shirur Park riders.'},
      {q:'How do I contact for Shirur Park service?',a:'Call or WhatsApp +91 97422 91701. We respond promptly during Mon-Sat 10AM-8PM.'},
    ],
    desc: `Shirur Park, a peaceful residential area in Hubli, is home to Royal Enfield enthusiasts who know quality motorcycle care when they find it. Baba Royal Garage serves the Shirur Park community from our Nehru Stadium branch, located approximately 2.5 km away, with full Royal Enfield specialist services and the convenience of doorstep pickup.\n\nThe Shirur Park neighborhood, with its quiet streets and residential character, has a growing base of Royal Enfield riders. Many residents choose Royal Enfield for weekend rides toward the Sahyadri mountains, day trips to Dharwad, or simply the pleasure of Hubli's evening rides. Keeping these bikes in peak condition is our specialty.\n\nOur Nehru Stadium branch, serving Shirur Park riders, offers the complete Baba Royal Garage service menu: comprehensive oil changes and general servicing, engine diagnostics and overhaul, clutch and gearbox repair, suspension service, brake maintenance, electrical troubleshooting, and genuine Royal Enfield spare parts. Every service uses genuine RE components.\n\nThe short distance from Shirur Park to Nehru Stadium makes it practical for most Shirur Park riders to use both our walk-in and doorstep services. For bikes that need urgent attention or for riders with busy schedules, the doorstep pickup option delivers maximum convenience — call +91 97422 91701 and we handle the rest.\n\nShirur Park Royal Enfield owners — walk in at our Nehru Stadium branch (Mon-Sat 10AM-8PM) or call +91 97422 91701 for doorstep pickup from your Shirur Park address.`
  },
  {
    id: 'l8', slug: 'royal-enfield-service-sadashivnagar-hubli', name: 'Sadashivnagar',
    branch: 'keshwapur', dist: '~4 km',
    landmarks: ['Sadashivnagar Layout', 'Hubli-Dharwad Highway', 'KHB Colony', 'Sadashivnagar Gate'],
    mt: 'Royal Enfield Service Sadashivnagar Hubli | Baba Royal Garage',
    md: 'Baba Royal Garage serves Sadashivnagar Hubli for Royal Enfield service. Call +91 97422 91701.',
    faqs: [
      {q:'Royal Enfield service near Sadashivnagar Hubli?',a:'Yes! Baba Royal Garage serves Sadashivnagar from our Keshwapur branch (~4 km) and via doorstep pickup.'},
      {q:'Can I get Royal Enfield pickup in Sadashivnagar?',a:'Yes! Call +91 97422 91701 for same-day doorstep pickup from Sadashivnagar.'},
      {q:'What RE services are available for Sadashivnagar riders?',a:'All services from general servicing and oil change to engine overhaul, electrics, and spare parts.'},
      {q:'How do I book from Sadashivnagar?',a:'Call +91 97422 91701 or WhatsApp for quick booking. Walk in at Keshwapur Mon-Sat 10AM-8PM.'},
      {q:'How far is Keshwapur from Sadashivnagar?',a:'Approximately 4 km — an easy ride or we can arrange doorstep pickup for Sadashivnagar.'},
    ],
    desc: `Sadashivnagar, situated along the Hubli-Dharwad corridor, is a location many Royal Enfield riders call home. At Baba Royal Garage, we provide Royal Enfield specialist service to the Sadashivnagar community from our Keshwapur main branch and through our doorstep pickup service that reaches every corner of Hubli including Sadashivnagar.\n\nThe Hubli-Dharwad stretch that passes Sadashivnagar is popular with Royal Enfield touring riders who use this route regularly. Well-maintained bikes are essential for this kind of riding, and Baba Royal Garage ensures your Royal Enfield is always tour-ready. Pre-tour inspection services are especially popular with Sadashivnagar riders before weekend trips.\n\nFor Sadashivnagar riders who regularly commute on their Royal Enfields, consistent servicing at the correct intervals keeps running costs low and reliability high. We perform all preventive maintenance at our Keshwapur branch — oil changes, chain service, brake inspection, battery checks — on a schedule that keeps your bike problem-free.\n\nThe 4 km ride from Sadashivnagar to our Keshwapur main branch takes riders through familiar Hubli streets. The branch is easy to find beside Convent High School at Irkal Building in Bhavani Nagar, Keshwapur. Alternatively, call +91 97422 91701 for doorstep pickup from Sadashivnagar for maximum convenience.\n\nSadashivnagar Royal Enfield owners — we provide the specialist care your motorcycle deserves. Call +91 97422 91701 or visit our Keshwapur branch Monday through Saturday, 10 AM to 8 PM.`
  },
  {
    id: 'l9', slug: 'royal-enfield-service-hosur-hubli', name: 'Hosur',
    branch: 'keshwapur', dist: '~5 km',
    landmarks: ['Hosur Road', 'Hosur Toll', 'NH 48 Junction', 'Hosur Layout'],
    mt: 'Royal Enfield Service Hosur Hubli | Baba Royal Garage',
    md: 'Baba Royal Garage serves Hosur area, Hubli for Royal Enfield service. Call +91 97422 91701.',
    faqs: [
      {q:'Royal Enfield mechanic near Hosur Hubli?',a:'Baba Royal Garage serves Hosur from our Keshwapur branch and via doorstep pickup. Call +91 97422 91701.'},
      {q:'Can I get Royal Enfield service in Hosur Hubli?',a:'Yes! We offer doorstep pickup from Hosur area and our Keshwapur branch is 5 km away.'},
      {q:'Which RE models do you service for Hosur customers?',a:'All models — Classic 350, Meteor, Hunter, Himalayan, Interceptor, Continental GT, Super Meteor, Shotgun.'},
      {q:'What if my RE breaks down near Hosur?',a:'Call +91 97422 91701 immediately. We offer emergency pickup across Hubli including Hosur.'},
      {q:'How do I contact for Hosur area RE service?',a:'Call or WhatsApp +91 97422 91701. Walk in at Keshwapur Mon-Sat 10AM-8PM.'},
    ],
    desc: `The Hosur area on the outskirts of Hubli is a growing zone where Royal Enfield riders benefit from Baba Royal Garage's citywide service reach. Our Keshwapur main branch provides full Royal Enfield specialist care for Hosur area residents, and our doorstep pickup service ensures no Hosur Royal Enfield owner is ever left stranded.\n\nHosur's proximity to the NH 48 junction makes it a point of departure for many Royal Enfield touring riders heading toward Bangalore, Goa, or the Sahyadri region. A bike that is properly serviced and inspected before these long rides delivers the confidence and performance that Royal Enfield is famous for. Our pre-tour service checks are popular with Hosur riders before major journeys.\n\nFor everyday Hosur commuters, regular maintenance at Baba Royal Garage keeps Royal Enfield motorcycles reliable on both the local roads and the highway stretches that Hosur residents often navigate. Chain condition, tire pressure, brake performance, and oil quality are all addressed at every service visit.\n\nThe 5 km distance from Hosur to our Keshwapur main branch is a manageable ride for most Royal Enfield owners with bikes in working condition. For bikes that need emergency attention or riders who prefer not to ride to the workshop, doorstep pickup is the answer — one call to +91 97422 91701 sets everything in motion.\n\nHosur area Royal Enfield owners — call +91 97422 91701 for booking, emergency pickup, or any Royal Enfield query. Walk in at our Keshwapur branch Monday through Saturday, 10 AM to 8 PM.`
  },
  {
    id: 'l10', slug: 'royal-enfield-service-nehru-nagar-hubli', name: 'Nehru Nagar',
    branch: 'nehru-stadium', dist: '~1 km',
    landmarks: ['Nehru Stadium', 'Court Circle', 'Hubli Central Bus Stand', 'Nehru Nagar Post Office'],
    mt: 'Royal Enfield Service Nehru Nagar Hubli | Baba Royal Garage',
    md: 'Baba Royal Garage Nehru Stadium branch serves Nehru Nagar, Hubli. Minutes away. Call +91 97422 91701.',
    faqs: [
      {q:'Is Baba Royal Garage near Nehru Nagar Hubli?',a:'Yes! Our Nehru Stadium branch is just ~1 km from Nehru Nagar — the closest RE specialist in the area.'},
      {q:'What services at the Nehru Stadium branch?',a:'Full Royal Enfield services: servicing, engine work, brakes, suspension, electrical, parts.'},
      {q:'Can I walk in at the Nehru Stadium branch?',a:'Yes, walk in Monday to Saturday 10AM-8PM. The branch is at Nehru Stadium, Hubli.'},
      {q:'Is doorstep pickup available from Nehru Nagar?',a:'Yes! Call +91 97422 91701 for same-day pickup from Nehru Nagar.'},
      {q:'What is the Nehru Stadium branch address?',a:'Nehru Stadium, Hubli, Karnataka 580020.'},
    ],
    desc: `For Royal Enfield riders in Nehru Nagar, Hubli, expert motorcycle care is just around the corner. Our Nehru Stadium branch — the second of Baba Royal Garage's two Hubli locations — is located at Nehru Stadium, Hubli, just approximately 1 km from the Nehru Nagar neighborhood. This makes it one of the most conveniently located Royal Enfield specialist services in central Hubli.\n\nNehru Nagar's central Hubli location means its residents are close to everything that makes the city great — and close to Baba Royal Garage's Nehru Stadium branch. Royal Enfield riders from Nehru Nagar can drop their bikes off and explore the nearby Court Circle area or Central Bus Stand while their motorcycle is being serviced. Most standard services are completed same-day.\n\nOur Nehru Stadium branch offers the complete range of Baba Royal Garage services: general servicing and oil changes, engine diagnostics, clutch and gearbox repair, brake service, suspension work, electrical diagnostics, battery replacement, and genuine Royal Enfield spare parts. The same expertise and quality standards that define our Keshwapur branch apply at Nehru Stadium.\n\nFor Nehru Nagar riders, the 1 km distance to our Nehru Stadium branch makes it trivial to ride in even for quick services like oil changes, battery checks, or chain adjustments. For bikes that need more complex work, we welcome same-day appointments.\n\nNehru Nagar Royal Enfield owners — our Nehru Stadium branch is your nearest Royal Enfield specialist. Walk in Monday through Saturday, 10 AM to 8 PM, or call +91 97422 91701 for booking or emergency doorstep pickup.`
  },
];

const content = `import type { Location } from "@/types";

export const locations: Location[] = ${JSON.stringify(locations.map(l => ({
  id: l.id,
  slug: l.slug,
  name: l.name,
  city: 'Hubli',
  description: l.desc,
  landmarks: l.landmarks,
  nearestBranch: l.branch,
  distanceFromBranch: l.dist,
  metaTitle: l.mt,
  metaDescription: l.md,
  faqs: l.faqs.map(f => ({question: f.q, answer: f.a})),
})), null, 2)};

export function getLocationBySlug(slug: string): Location | undefined {
  return locations.find((l) => l.slug === slug);
}
`;

fs.writeFileSync(base + '/lib/locations.ts', content, 'utf8');
console.log('Locations written: ' + locations.length);
