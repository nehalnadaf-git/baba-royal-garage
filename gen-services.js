const fs = require('fs');
const base = __dirname;

const allModels = ['Classic 350','Classic 500','Meteor 350','Hunter 350','Bullet 350','Bullet 500','Thunderbird','Himalayan 411','Himalayan 450','Continental GT 650','Interceptor 650','Super Meteor 650','Shotgun 650'];

const svcs = [
{id:'s3',slug:'engine-overhaul-hubli',name:'Engine Overhaul & Rebuild',short:'Full engine restoration by certified specialists',cat:'engine',icon:'Cog',time:'2-5 days',mt:'Engine Overhaul Royal Enfield Hubli | Baba Royal',md:'Complete Royal Enfield engine overhaul & rebuild in Hubli. Certified specialists, genuine parts. Call +91 97422 91701.',kw:'Royal Enfield engine overhaul Hubli',rel:['clutch-repair-hubli','gearbox-repair-hubli','royal-enfield-general-servicing-hubli'],
probs:['Excessive oil consumption','Blue/white exhaust smoke','Loss of compression','Metallic knocking','Severe power loss','Engine seizure'],
inc:['Complete engine removal','Full disassembly','Cylinder bore measurement','Piston & ring replacement','Bearing inspection','Crankshaft check','Valve service','Gasket replacement','Reassembly to spec','Post-rebuild test run'],
signs:['Excessive oil consumption','Blue/white smoke','Hard starting','Metallic knocking','Severe power loss','Engine overheating'],
faqs:[{q:'How long does a Royal Enfield engine overhaul take?',a:'Typically 2-5 days depending on the extent of work needed.'},{q:'When does a Royal Enfield engine need an overhaul?',a:'Signs include excessive oil consumption, blue/white exhaust smoke, low compression, metallic knocking, and significant power loss.'},{q:'Do you use genuine parts for engine rebuilds?',a:'Yes, all internal engine components are genuine Royal Enfield parts from authorized distributors.'},{q:'Can you overhaul Royal Enfield 650 twin engines?',a:'Absolutely. We service both UCE singles and the 650cc parallel-twin engines.'},{q:'Is engine overhaul available with doorstep pickup in Hubli?',a:'Yes! Call +91 97422 91701 for doorstep pickup across Hubli.'}]},

{id:'s4',slug:'clutch-repair-hubli',name:'Clutch Repair & Replacement',short:'Smooth gear transitions every time',cat:'engine',icon:'Settings',time:'2-4 hours',mt:'Clutch Repair Royal Enfield Hubli | Baba Royal',md:'Expert Royal Enfield clutch repair & replacement in Hubli. Fix slipping, stiff clutch. Call +91 97422 91701.',kw:'Royal Enfield clutch repair Hubli',rel:['gearbox-repair-hubli','engine-overhaul-hubli','royal-enfield-general-servicing-hubli'],
probs:['Clutch slipping under load','Stiff clutch lever','Clutch drag','Difficulty finding neutral','Clutch noise/rattle','Incomplete disengagement'],
inc:['Clutch cable adjustment check','Complete clutch disassembly','Friction plate inspection','Steel plate inspection','Spring tension test','Basket & hub check','Component replacement','Reassembly & adjustment','Road test'],
signs:['Engine revs without speed increase','Hard to find neutral','Bike creeps with clutch pulled','Inconsistent lever feel','Clutch area rattling','Burning smell'],
faqs:[{q:'Why is my Royal Enfield clutch slipping?',a:'Usually caused by worn friction plates, weak springs, or incorrect cable adjustment.'},{q:'How often should clutch plates be replaced?',a:'Typically every 15,000-25,000 km depending on riding style.'},{q:'Can you fix a stiff clutch lever?',a:'Yes, stiff clutch can be caused by cable issues, lever pivot wear, or internal problems.'},{q:'Do you service clutch on Interceptor 650?',a:'Yes, we service clutch systems on all RE models including 650cc twins.'},{q:'Is doorstep pickup available for clutch repair?',a:'Yes! Call +91 97422 91701 for pickup across Hubli.'}]},

{id:'s5',slug:'gearbox-repair-hubli',name:'Gearbox Repair & Tuning',short:'Precision gearbox work for flawless shifting',cat:'engine',icon:'SlidersHorizontal',time:'3-6 hours',mt:'Gearbox Repair Royal Enfield Hubli | Baba Royal',md:'Professional Royal Enfield gearbox repair in Hubli. Fix hard shifting, false neutrals. Call +91 97422 91701.',kw:'Royal Enfield gearbox repair Hubli',rel:['clutch-repair-hubli','engine-overhaul-hubli','chain-service-hubli'],
probs:['Hard gear shifting','False neutrals','Gear popping out','Transmission noise','Gear stuck','Grinding sounds'],
inc:['External shift mechanism check','Road test diagnosis','Internal gearbox inspection','Shift fork check','Gear dog inspection','Bearing replacement','Reassembly to spec','Multi-gear road test'],
signs:['Must force gear changes','Finding false neutrals','Gears pop out under load','Grinding during shifts','Cannot select certain gears','Transmission whine'],
faqs:[{q:'Why does my Royal Enfield pop out of gear?',a:'Usually caused by worn engagement dogs, worn shift drum, or weak detent spring.'},{q:'What causes false neutral in Royal Enfield?',a:'False neutrals are common in RE singles, usually due to worn gear dogs.'},{q:'How long does gearbox repair take?',a:'Typically 3-6 hours. Complex internal repairs may require next-day completion.'},{q:'Can hard shifting damage my engine?',a:'Yes, forcing gears can damage shift forks and engagement dogs.'},{q:'Is doorstep pickup available?',a:'Yes! Call +91 97422 91701 for pickup across Hubli.'}]},

{id:'s6',slug:'brake-service-hubli',name:'Brake Service & Pad Replacement',short:'Your safety is our top priority',cat:'regular',icon:'Shield',time:'1-2 hours',mt:'Brake Service Royal Enfield Hubli | Baba Royal',md:'Royal Enfield brake service & pad replacement in Hubli. Safety first, genuine parts. Call +91 97422 91701.',kw:'Royal Enfield brake service Hubli',rel:['tire-service-hubli','royal-enfield-general-servicing-hubli','suspension-service-hubli'],
probs:['Spongy brake lever','Brake squeal','Reduced stopping power','Pulsating brakes','Brake drag','ABS warning light'],
inc:['Brake pad/shoe inspection','Rotor/drum measurement','Fluid level check','Caliper piston test','Brake line inspection','ABS system check','Pad replacement','Brake bleeding','Road test'],
signs:['Longer stopping distances','Scraping sounds','Lever pulls to handlebar','Vibration when braking','Warning light on','Visible pad wear'],
faqs:[{q:'How often should Royal Enfield brakes be serviced?',a:'Brake inspection every 5,000 km and pad replacement when wear indicators show.'},{q:'Do you service ABS on Royal Enfield 650?',a:'Yes, we service complete ABS braking on all 650cc models.'},{q:'Why are my brakes squealing?',a:'Can be caused by glazed, contaminated, or worn pads.'},{q:'How long do brake pads last?',a:'Front disc pads typically last 8,000-15,000 km depending on riding style.'},{q:'Can I get brake service with doorstep pickup?',a:'Yes! Call +91 97422 91701 for pickup anywhere in Hubli.'}]},

{id:'s7',slug:'chain-service-hubli',name:'Chain Cleaning, Lubrication & Adjustment',short:'Smooth power delivery with proper chain maintenance',cat:'regular',icon:'Link',time:'30-60 minutes',mt:'Chain Service Royal Enfield Hubli | Baba Royal',md:'Royal Enfield chain cleaning & lubrication in Hubli. Smooth riding guaranteed. Call +91 97422 91701.',kw:'Royal Enfield chain service Hubli',rel:['tire-service-hubli','royal-enfield-general-servicing-hubli','brake-service-hubli'],
probs:['Loose chain','Chain noise','Sprocket wear','Chain rust','Stiff links','Power loss'],
inc:['Professional chain cleaning','Link-by-link inspection','Stretch measurement','Sprocket tooth inspection','Premium lubrication','Tension adjustment','Wheel alignment check'],
signs:['Chain visibly sagging','Clicking sound','Sprocket teeth hooked','Chain rusty','Tight spots','Jerky acceleration'],
faqs:[{q:'How often should I clean my chain?',a:'Every 500-1,000 km. More often in monsoon or dusty conditions.'},{q:'When should I replace the chain?',a:'When stretch exceeds 2% of original length, or if stiff links or damaged rollers appear.'},{q:'Should I replace sprockets with chain?',a:'Yes, always replace chain and both sprockets together.'},{q:'What chain lube is best?',a:'We use premium O-ring compatible lubricant.'},{q:'Does chain tension affect fuel economy?',a:'Yes, improper tension can decrease economy by 5-10%.'}]},

{id:'s8',slug:'tire-service-hubli',name:'Tire Service & Replacement',short:'Road-ready tires for every ride',cat:'regular',icon:'Circle',time:'1-2 hours',mt:'Tire Service Royal Enfield Hubli | Baba Royal',md:'Royal Enfield tire service & replacement in Hubli. All models covered. Call +91 97422 91701.',kw:'Royal Enfield tire service Hubli',rel:['brake-service-hubli','suspension-service-hubli','chain-service-hubli'],
probs:['Worn tread','Frequent punctures','Uneven wear','Vibration at speed','Tire pulling','Low pressure'],
inc:['Tread depth measurement','Sidewall inspection','Pressure adjustment','Puncture repair','Tire replacement','Wheel balancing','Alignment check'],
signs:['Tread wear indicators visible','Sidewall cracking','Vibration at highway speed','Bike pulls to one side','Frequent pressure loss','Tire older than 5 years'],
faqs:[{q:'What tire size does Classic 350 use?',a:'90/90-19 front and 110/80-18 rear.'},{q:'How often check tire pressure?',a:'Every 2 weeks or before any long ride.'},{q:'Do you do tubeless puncture repair?',a:'Yes, with proper internal patches.'},{q:'When should tires be replaced?',a:'When tread reaches wear indicator, sidewalls crack, or tires are over 5 years old.'},{q:'Can you help choose tires for Hubli roads?',a:'Yes, we recommend based on model, style, and conditions.'}]},

{id:'s9',slug:'battery-replacement-hubli',name:'Battery Check & Replacement',short:'Never get stranded with a reliable battery',cat:'electrical',icon:'Battery',time:'30-45 minutes',mt:'Battery Replacement Royal Enfield Hubli | Baba Royal',md:'Royal Enfield battery check & replacement in Hubli. Genuine batteries. Call +91 97422 91701.',kw:'Royal Enfield battery replacement Hubli',rel:['electrical-diagnostics-hubli','royal-enfield-general-servicing-hubli','doorstep-pickup-drop-hubli'],
probs:['Dead battery','Slow cranking','Frequent jump starts','Battery swelling','Dim lights','Overnight drain'],
inc:['Resting voltage test','Cranking load test','Charging system test','Parasitic drain test','Terminal cleaning','Battery replacement','Post-install verification'],
signs:['Starter sounds weak','Need jump starts','Lights flicker','Horn sounds weak','Battery older than 2 years','Bike sits unused often'],
faqs:[{q:'What battery does Classic 350 use?',a:'A 12V maintenance-free battery. We stock the exact spec.'},{q:'Why does my battery keep dying?',a:'Usually a charging system problem or parasitic drain. We test both.'},{q:'How long does an RE battery last?',a:'Typically 2-3 years in Hubli climate.'},{q:'Can you replace at my home?',a:'Yes! Our doorstep service is perfect for dead batteries.'},{q:'Do you test the charging system?',a:'Always. We test stator and regulator to ensure the new battery charges correctly.'}]},

{id:'s10',slug:'electrical-diagnostics-hubli',name:'Electrical Diagnostics & Repair',short:'Advanced diagnostics to identify any issue instantly',cat:'electrical',icon:'Cpu',time:'1-3 hours',mt:'Electrical Diagnostics Royal Enfield Hubli | Baba Royal',md:'Royal Enfield electrical diagnostics & repair in Hubli. Call +91 97422 91701.',kw:'Royal Enfield electrical repair Hubli',rel:['battery-replacement-hubli','royal-enfield-general-servicing-hubli','engine-overhaul-hubli'],
probs:['Dim/flickering lights','Starter clicking','Instrument failure','Wiring shorts','Blown fuses','Warning lights'],
inc:['Charging system test','Starting system check','Lighting circuit check','Instrument verification','Accessory circuit test','Wiring inspection','Connection cleaning','Component replacement'],
signs:['Warning lights on dash','Lights dim/flicker','Starter clicks only','Instruments read wrong','Fuses blow repeatedly','Accessories stop working'],
faqs:[{q:'Why are my headlights dim?',a:'Can indicate failing charging system, corroded connections, or degraded battery.'},{q:'Can you fix instrument cluster problems?',a:'Yes, we repair and replace clusters for all RE models.'},{q:'Why does my starter click but not crank?',a:'Usually weak battery, failed solenoid, or worn starter motor.'},{q:'Do you repair wiring harness?',a:'Yes, including complete harness section replacement.'},{q:'Can electrical problems prevent starting?',a:'Absolutely. Kill switch, relays, or sensor faults can all prevent starting.'}]},

{id:'s11',slug:'suspension-service-hubli',name:'Suspension Service & Repair',short:'Smooth, controlled rides on any terrain',cat:'suspension',icon:'ArrowUpDown',time:'2-4 hours',mt:'Suspension Service Royal Enfield Hubli | Baba Royal',md:'Royal Enfield suspension service in Hubli. Front fork & rear shock repair. Call +91 97422 91701.',kw:'Royal Enfield suspension service Hubli',rel:['tire-service-hubli','brake-service-hubli','royal-enfield-general-servicing-hubli'],
probs:['Fork oil leak','Harsh ride','Front-end dive','Clunking sounds','Instability at speed','Bottoming out'],
inc:['Fork oil change','Seal inspection/replacement','Stanchion tube check','Rear shock test','Preload adjustment','Bushing inspection','Alignment check','Test ride'],
signs:['Oil on fork tubes','Bike feels bouncy','Excessive brake dive','Clunking over bumps','Unstable in corners','Ride quality degraded'],
faqs:[{q:'How often should fork oil be changed?',a:'Every 10,000-15,000 km or annually.'},{q:'Why is oil leaking from my forks?',a:'Worn fork seals. We replace seals and inspect stanchion tubes.'},{q:'Can you adjust rear suspension?',a:'Yes, we adjust preload for your weight and riding style.'},{q:'Why does my RE feel unstable at speed?',a:'Can be worn fork bushings, suspension settings, or tire issues.'},{q:'Do you service Himalayan suspension?',a:'Yes, including long-travel fork rebuild and rear shock service.'}]},

{id:'s12',slug:'fuel-system-cleaning-hubli',name:'Fuel System Cleaning & Carburetor Tuning',short:'Maximum fuel efficiency and throttle response',cat:'engine',icon:'Gauge',time:'2-3 hours',mt:'Fuel System Cleaning Royal Enfield Hubli | Baba Royal',md:'Royal Enfield fuel system cleaning in Hubli. Better mileage & performance. Call +91 97422 91701.',kw:'Royal Enfield fuel system cleaning Hubli',rel:['engine-oil-change-hubli','royal-enfield-general-servicing-hubli','engine-overhaul-hubli'],
probs:['Poor fuel economy','Rough idle','Hesitation','Backfiring','Hard cold start','Stalling'],
inc:['Carburetor removal & cleaning','Jet cleaning','Float level check','Throttle body cleaning','Injector cleaning','Fuel filter check','Air intake inspection','Mixture adjustment','Test ride'],
signs:['Fuel economy dropped','Engine hunts at idle','Stumbles on acceleration','Pops on deceleration','Difficult cold starting','Engine stalls at lights'],
faqs:[{q:'Why is my RE giving bad mileage?',a:'Dirty carburetor jets, clogged injectors, dirty air filter, or incorrect tuning.'},{q:'Can you tune a carburetor?',a:'Yes, carburetor tuning is one of our specialties.'},{q:'Do you service fuel-injected models?',a:'Yes, including throttle body and injector service.'},{q:'Why does my RE hesitate on acceleration?',a:'Typically lean fuel mixture, dirty jets/injectors, or air intake leaks.'},{q:'How often should fuel system be cleaned?',a:'Every 10,000-15,000 km or sooner if you notice performance issues.'}]},

{id:'s13',slug:'bike-detailing-hubli',name:'Bike Washing & Detailing',short:'Showroom finish every time',cat:'detailing',icon:'Droplets',time:'2-4 hours',mt:'Bike Detailing Royal Enfield Hubli | Baba Royal',md:'Royal Enfield bike detailing in Hubli. Showroom shine, rust protection. Call +91 97422 91701.',kw:'Royal Enfield detailing Hubli',rel:['spare-parts-hubli','chain-service-hubli','royal-enfield-general-servicing-hubli'],
probs:['Dull paint','Oxidized chrome','Chain rust','Engine grime','Faded plastics','Water spots'],
inc:['Pre-wash soak','Hand wash','Engine degreasing','Chrome polishing','Paint correction','Wax/sealant coat','Chain clean & lube','Rust treatment','Rubber conditioning'],
signs:['Paint looks dull','Chrome turning hazy','Chain rusty','Engine covered in grime','Rubber cracking','Not showroom-worthy'],
faqs:[{q:'How long does detailing take?',a:'2-4 hours depending on condition.'},{q:'Do you offer rust treatment?',a:'Yes, removal, treatment, and protection coating.'},{q:'Is detailing recommended before monsoon?',a:'Absolutely. Protective coating shields from monsoon moisture.'},{q:'Can you remove scratches?',a:'Minor scratches yes through machine polishing.'},{q:'Do you detail engines?',a:'Yes, engine degreasing and fin cleaning is included.'}]},

{id:'s14',slug:'spare-parts-hubli',name:'Genuine Royal Enfield Spare Parts',short:'Only authentic parts for your Royal Enfield',cat:'detailing',icon:'Package',time:'Same day (if in stock)',mt:'RE Spare Parts Hubli | Baba Royal Garage',md:'Genuine Royal Enfield spare parts in Hubli. All parts available. Call +91 97422 91701.',kw:'Royal Enfield spare parts Hubli',rel:['royal-enfield-general-servicing-hubli','brake-service-hubli','engine-overhaul-hubli'],
probs:['Worn brake pads','Stretched chain','Dead battery','Leaking gaskets','Worn clutch plates','Broken mirrors'],
inc:['Part identification','Genuine part sourcing','Professional fitting','Torque to specification','Function verification','Old part disposal','Warranty documentation'],
signs:['Parts visibly worn','Performance degraded','Safety items compromised','Scheduled replacement due','Modification planned','Accident damage'],
faqs:[{q:'Do you stock all RE spare parts?',a:'We stock commonly needed parts. Specialized parts ordered with 1-2 day delivery.'},{q:'Are parts genuine Royal Enfield?',a:'Yes, all sourced from authorized distributors with warranty.'},{q:'Can I buy parts without fitting?',a:'We primarily fit parts we sell to ensure proper installation.'},{q:'Do you have parts for discontinued models?',a:'Yes, including Classic 500, Bullet 500, and Thunderbird.'},{q:'How quickly can you get out-of-stock parts?',a:'Most arrive within 1-2 business days.'}]},

{id:'s15',slug:'doorstep-pickup-drop-hubli',name:'Doorstep Pickup & Drop Service',short:'We come to you — anywhere in Hubli',cat:'doorstep',icon:'Truck',time:'Same day pickup',mt:'Doorstep Pickup Royal Enfield Hubli | Baba Royal',md:'Royal Enfield doorstep pickup & drop across Hubli. We come to you! Call +91 97422 91701.',kw:'Royal Enfield doorstep service Hubli',rel:['royal-enfield-general-servicing-hubli','battery-replacement-hubli','brake-service-hubli'],
probs:["Bike won't start",'Flat tire','Accident damage','No time to ride in','Planned servicing','Emergency breakdown'],
inc:['Phone/WhatsApp booking','Vehicle dispatch','Safe bike loading','Workshop transport','Service/repair','Quality check','Doorstep delivery','Payment at delivery'],
signs:['Bike cannot be ridden','No time to visit workshop','Prefer convenience','Emergency breakdown','Live far from workshop','Planned bulk service'],
faqs:[{q:'How does doorstep pickup work?',a:'Call +91 97422 91701, share location and bike details. We dispatch within 1-2 hours.'},{q:'Which areas do you cover?',a:'All Hubli: Keshwapur, Vidyanagar, Gokul Road, Navanagar, Deshpande Nagar, and more.'},{q:'Can you pick up if bike won\'t start?',a:'Absolutely — our most common doorstep request.'},{q:'How long until bike is returned?',a:'Simple services same-day. We keep you updated via WhatsApp.'},{q:'Is doorstep pickup available daily?',a:'Yes, Monday to Saturday 10AM-8PM.'}]},
];

// Build descriptions
const descs = {};
descs['s3'] = `At Baba Royal Garage in Hubli, our Engine Overhaul and Rebuild service is the most comprehensive engine restoration available for Royal Enfield motorcycles in the region. When your engine has reached a point where routine servicing is no longer enough — whether due to high mileage, severe wear, oil burning, loss of compression, or catastrophic failure — a full overhaul is the path to restoring factory-fresh performance.

Our engine overhaul process at the Keshwapur and Nehru Stadium branches covers every internal component. We begin with complete engine removal and disassembly, inspecting each part individually. The cylinder bore is measured for wear and re-bored or sleeved if necessary. Pistons and rings are replaced with genuine Royal Enfield components. Crankshaft bearings, cam followers, valve guides, and valve seats are all inspected and replaced as needed.

For Royal Enfield UCE engines found in the Classic 350, Bullet 350, Meteor 350, and Hunter 350, common overhaul triggers include excessive oil consumption, blue or white exhaust smoke, loss of compression leading to hard starting, metallic knocking sounds, and significant power loss. The 650cc parallel-twin engines in the Continental GT, Interceptor, Super Meteor, and Shotgun models have their own set of wear patterns that our specialists know intimately.

The reassembly phase is where our 6+ years of Royal Enfield-specific expertise truly shines. Every tolerance is set to factory specification, all gaskets and seals are replaced with genuine parts, torque values are precisely applied, and the engine is carefully broken in on a test run before delivery. We also address any secondary issues discovered during teardown.

After overhaul, your Royal Enfield engine will deliver restored compression, smoother running, reduced oil consumption, improved fuel efficiency, and the characteristic Royal Enfield thump that drew you to the brand. Walk in at either Hubli branch or call +91 97422 91701 for doorstep pickup and drop service anywhere in Hubli.`;

descs['s4'] = `Clutch problems are among the most common complaints from Royal Enfield riders in Hubli, and at Baba Royal Garage, we have resolved hundreds of clutch issues across every RE model. Whether your clutch is slipping under acceleration, feeling stiff and hard to pull, dragging even when fully disengaged, or making unusual noises, our specialists at the Keshwapur and Nehru Stadium branches have the expertise to diagnose and fix it right.

The Royal Enfield clutch system is a wet multi-plate design that operates in engine oil. Over time, the friction plates wear thin, the steel plates can warp from heat, springs lose tension, and the clutch basket can develop notching. Any of these issues leads to imperfect clutch engagement that affects your riding experience and can even be dangerous in traffic.

Our clutch repair service begins with a thorough diagnosis. We check clutch cable free play, lever feel, engagement point, and perform a road test to identify slip or drag under load. Once the issue is confirmed, we open the clutch cover and inspect every component — friction plates, steel plates, springs, pressure plate, clutch basket, hub, and release mechanism.

For the Classic 350, Bullet 350, and other single-cylinder models, we commonly see clutch slip after 15,000-20,000 km due to friction plate wear. The 650cc twins tend to need clutch attention around 20,000-25,000 km. In all cases, we replace worn components with genuine Royal Enfield parts to ensure proper fitment and longevity.

Signs you need clutch repair include the engine revving without proportional speed increase, difficulty finding neutral, bike creeping forward with clutch fully pulled in, hard or inconsistent lever feel, and unusual rattling from the clutch area. Walk in at our two Hubli branches or call +91 97422 91701 for doorstep pickup and drop service anywhere in Hubli city.`;

descs['s5'] = `Gear shifting problems can transform your Royal Enfield from a joy to ride into a frustrating experience. At Baba Royal Garage in Hubli, our Gearbox Repair and Tuning service addresses every transmission issue with precision and expertise honed over 6+ years of working exclusively on Royal Enfield motorcycles.

The Royal Enfield gearbox is a constant-mesh design — robust by nature but requiring proper maintenance and occasional repair. Common gearbox issues we fix at our Keshwapur and Nehru Stadium branches include hard shifting between gears, false neutrals especially between 2nd and 3rd, gear popping out under load, excessive transmission noise, and gear engagement failure.

Our diagnostic process starts with a detailed road test to reproduce the issue. We then inspect the external shift mechanism including the gear lever, shift shaft, return spring, and linkage. If internal, we remove the gearbox and inspect shift forks, shift drum, gear dogs, engagement slots, selector mechanism, and all bearings.

For Classic 350 and Bullet 350 models, the most common complaint is false neutrals — where the gear slips into neutral unexpectedly. This is usually caused by worn engagement dogs or a worn shift drum. The 650cc twins have a different architecture but can also develop shift quality issues.

After repair, we perform comprehensive testing including gear engagement in all ratios, smooth upshifts and downshifts, neutral finding, and clutchless entry verification. Every repaired gearbox leaves our workshop shifting as smooth as factory new. Walk in at either Hubli branch or call +91 97422 91701 for doorstep pickup.`;

descs['s6'] = `Your brakes are your lifeline, and at Baba Royal Garage in Hubli, we treat every brake service with the seriousness it deserves. As Royal Enfield specialists with 6+ years of experience, we have serviced braking systems on every RE model from the drum-brake Bullet to the dual-disc 650 twins.

Royal Enfield brake systems vary significantly across models. The Classic 350 and Bullet 350 feature a front disc with rear drum combination, the Meteor 350 and Hunter 350 come with front disc and rear options, while the 650cc range features dual disc brakes with ABS. Each system has unique service requirements that our technicians handle expertly at both the Keshwapur and Nehru Stadium branches.

Our brake service includes complete inspection of brake pads or shoes for wear, measurement of rotor or drum thickness, brake fluid level and condition check, caliper piston movement test, brake line inspection for leaks or damage, and ABS system verification where applicable. We replace worn components with genuine Royal Enfield brake parts.

Common brake problems we fix include spongy brake lever feel from air in the lines, brake squeal from glazed pads, pulsating brakes from warped rotors, reduced stopping power from worn pads, brake drag from seized caliper pistons, and ABS warning lights. Never delay brake service — your safety depends on it.

Visit either of our two Hubli branches or call +91 97422 91701 for doorstep pickup and drop service across the city. We use only genuine Royal Enfield brake components and back every brake service with our specialist guarantee.`;

descs['s7'] = `The drive chain is one of the hardest-working components on your Royal Enfield, transferring all engine power to the rear wheel. At Baba Royal Garage in Hubli, our Chain Service covers everything from routine cleaning and lubrication to complete chain and sprocket replacement, ensuring smooth, efficient power delivery.

Royal Enfield motorcycles use a roller chain final drive system. The chain needs regular maintenance — cleaning every 500 km, lubrication every 500-1,000 km, and tension adjustment as it stretches. Neglected chains accelerate sprocket wear, reduce fuel efficiency, create power loss, and can even snap at speed.

Our chain service at the Keshwapur and Nehru Stadium branches begins with thorough cleaning using professional-grade chain cleaner. We inspect every link for tight spots, damaged rollers, cracked side plates, and excessive stretch. The chain is measured for elongation — replace when stretch exceeds 2% of original length.

Sprocket inspection is equally important. We check both front and rear sprockets for hooked, pointed, or broken teeth. Worn sprockets destroy new chains rapidly, so we always recommend replacing chain and both sprockets together as a complete kit.

After cleaning and inspection, we lubricate with premium chain lube, adjust tension to manufacturer spec, and verify rear wheel alignment. The result is smoother acceleration, better fuel efficiency, reduced drivetrain noise, and extended component life. Walk in at either Hubli branch or call +91 97422 91701 for doorstep pickup and drop.`;

descs['s8'] = `Your tires are the only contact between your Royal Enfield and the road, making tire condition critical for safety, handling, and riding pleasure. At Baba Royal Garage in Hubli, our Tire Service covers inspection, puncture repair, rotation, balancing, and full replacement with quality tires suited to your RE model.

Different Royal Enfield models use different tire sizes and types. The Classic 350 runs on 90/90-19 front and 110/80-18 rear, the Meteor 350 uses tubeless tires, the Himalayan needs dual-purpose tires, and the 650cc twins use wider sport-touring rubber. Our technicians at both branches stock and fit the correct tire for every model.

Our tire service includes tread depth measurement, sidewall inspection, tire pressure adjustment, wheel balancing, and alignment verification. We check for uneven wear patterns indicating suspension or alignment issues. Puncture repair uses internal patches — never external plugs that can fail at speed.

When replacement is needed, we help choose the right tire for your riding conditions. City commuters benefit from touring compounds, while highway riders may prefer sport-touring options. We also stock monsoon-ready compounds for Hubli's rainy season.

Signs your tires need attention include visible wear indicators, sidewall cracking, vibration at speed, bike pulling to one side, and frequent pressure loss. Visit either Hubli branch or call +91 97422 91701 for doorstep pickup and drop across the city.`;

descs['s9'] = `A dead battery is one of the most frustrating experiences for any Royal Enfield rider. At Baba Royal Garage in Hubli, we provide comprehensive battery diagnostics and replacement service that gets you back on the road quickly. With doorstep pickup across Hubli, we can even come to you when your bike will not start.

Royal Enfield motorcycles use different battery types depending on model and year. Older models may use conventional lead-acid, while newer models use maintenance-free or AGM batteries. Our technicians at both the Keshwapur and Nehru Stadium branches stock genuine batteries for all RE models.

Our battery service begins with comprehensive testing — resting voltage, cranking voltage under load, charging system output, and parasitic drain. This tells us whether the problem is the battery, the charging system, or an electrical drain. We never just replace without testing.

Common battery problems include slow cranking, failure to start, overnight drain, dim headlights, and battery swelling. For bikes that sit unused, we offer conditioning and maintenance charging advice.

Signs you need battery service include weak starter, frequent jump starts, flickering lights, weak horn, and battery older than 2-3 years. Royal Enfield batteries typically last 2-3 years in Hubli climate. Call +91 97422 91701 for doorstep pickup — especially when your bike will not start.`;

descs['s10'] = `Modern Royal Enfield motorcycles rely on sophisticated electrical systems, and when something goes wrong, you need a specialist who understands RE-specific wiring, sensors, and electronics. At Baba Royal Garage in Hubli, our Electrical Diagnostics and Repair service covers every electrical issue from a blown fuse to complete wiring harness restoration.

Current RE models feature electronic fuel injection, digital instrument clusters, ride modes, ABS systems, and USB charging. Our technicians at both the Keshwapur and Nehru Stadium branches are trained on all generations of RE electrical systems.

Our diagnostic process uses systematic troubleshooting. We check charging system, starting system, lighting, instrumentation, and accessory circuits using multimeters and diagnostic tools to pinpoint faults accurately.

Common problems we fix include charging failure causing battery drain, headlight flickering, indicators malfunction, starter clicking, instrument cluster issues, horn failure, and intermittent faults from water ingress or corroded connections.

Signs of electrical trouble include dashboard warning lights, dim lights, starter clicking, accessories not working, and repeated battery failure. Address promptly as electrical issues can strand you. Visit either Hubli branch or call +91 97422 91701 for doorstep pickup.`;

descs['s11'] = `The suspension system of your Royal Enfield separates a smooth, controlled ride from a jarring, unstable one. At Baba Royal Garage in Hubli, we provide complete suspension service including front fork oil change, seal replacement, rear shock absorber service, and full suspension tuning.

Royal Enfield suspension varies across models. The Classic 350 and Bullet series use conventional telescopic forks with twin rear shocks. The Meteor 350 uses USD front forks. The Himalayan has long-travel suspension for off-road. The 650cc twins feature cartridge-type forks. Each requires specific procedures and oil grades.

Our service includes fork oil replacement, seal inspection and replacement, stanchion tube check, rear shock function testing, spring preload adjustment, and setting optimization using manufacturer-specified oil grades and volumes.

Common problems include fork oil leaking past worn seals, excessive front-end dive, bottoming out, harsh ride quality, front-end instability, clunking sounds, and rear shocks losing effectiveness.

Signs you need suspension service include oil on fork tubes, instability in corners, excessive bounce, uneven tire wear, and degraded ride quality. Visit our Keshwapur or Nehru Stadium branch or call +91 97422 91701 for doorstep pickup across Hubli.`;

descs['s12'] = `Proper fuel delivery is essential for your Royal Enfield to run efficiently. At Baba Royal Garage in Hubli, our Fuel System Cleaning and Carburetor Tuning service restores optimal fuel flow, improves throttle response, and maximizes fuel efficiency for both carbureted and fuel-injected models.

Older models like the Bullet 350 and pre-2020 Classic 350 use carburetors, while newer models feature electronic fuel injection. Both systems can develop problems from fuel quality issues, debris, and age. Our technicians at both branches service both systems expertly.

For carbureted models, we perform complete carburetor removal, disassembly, and ultrasonic cleaning of all jets, passages, and chambers. For fuel-injected models, we clean the injector, inspect fuel pump and filter, check pressure, clean throttle body, and verify sensor readings.

Common problems include rough idle, hesitation during acceleration, poor fuel economy, exhaust smoke, backfiring, difficulty starting, and engine stalling. These affect both your riding experience and fuel costs.

Signs your fuel system needs attention include starting difficulties, mileage drops, engine missing, irregular idle, and fuel smell from exhaust. Visit either branch or call +91 97422 91701 for doorstep pickup across Hubli.`;

descs['s13'] = `Your Royal Enfield deserves to look as good as it rides. At Baba Royal Garage in Hubli, our Bike Washing and Detailing service delivers comprehensive cleaning, polishing, and protection that restores your motorcycle to showroom condition.

Our detailing at both branches starts with pre-wash to loosen grime, then hand-wash with pH-neutral motorcycle shampoo safe for paint, chrome, and rubber. The engine is carefully degreased avoiding water ingress into electrical connections.

After washing, we dry completely using compressed air and microfiber cloths. Chrome is polished to remove oxidation. Painted surfaces receive clay bar treatment, machine polish for scratches, and protective wax or sealant. Chain is cleaned and lubricated, metal surfaces get anti-rust treatment, and rubber is conditioned.

We address Royal Enfield-specific rust-prone areas — engine fins, under the tank, and exhaust headers. This comprehensive approach protects your investment from Hubli weather conditions including monsoon humidity and summer heat.

Signs your RE needs detailing include dull paint, hazy chrome, rusty chain, grimy engine, cracking rubber, and general appearance not matching your pride of ownership. Visit either branch or call +91 97422 91701 for doorstep pickup.`;

descs['s14'] = `Using genuine parts is essential for a Royal Enfield. At Baba Royal Garage in Hubli, we stock and fit only authentic Royal Enfield spare parts, ensuring every replacement maintains the performance, safety, and longevity your motorcycle was designed to deliver.

Our parts inventory at both branches covers the full spectrum: engine components (pistons, rings, gaskets, bearings, valves), brake parts (pads, shoes, rotors, fluid), drivetrain (chains, sprockets, clutch plates, gearbox components), and electrical (batteries, bulbs, regulators, switches).

Why genuine parts matter: aftermarket parts compromise in critical ways. Inferior brake pads have longer stopping distances. Copy clutch plates wear out three times faster. Fake gaskets leak oil. Low-grade chains can break. We have seen the consequences too many times.

We source from authorized Royal Enfield distributors with full traceability and manufacturer warranty. Each part is guaranteed to fit your specific model. If not in stock, we order with 1-2 day delivery. Our technicians install every part we sell, ensuring proper fitment, correct torque, and verification.

Walk in at either Hubli branch or call +91 97422 91701. Doorstep pickup and drop available across all of Hubli for parts and fitting service.`;

descs['s15'] = `Cannot ride your Royal Enfield to the garage? Baba Royal Garage offers comprehensive doorstep pickup and drop service across all of Hubli, bringing our specialist expertise directly to you. This is especially valuable when your bike will not start, has a flat tire, or when convenience matters.

How it works: Call or WhatsApp +91 97422 91701. Share your location, bike model, and issue. We dispatch our pickup vehicle — typically within 1-2 hours during working hours. Your RE is carefully loaded and transported to our Keshwapur or Nehru Stadium workshop.

At our workshop, your bike receives the same expert attention as walk-in service. Our 6+ years experienced technicians diagnose, communicate findings via WhatsApp, and proceed with your approval. When complete, we deliver your Royal Enfield back to your doorstep.

We cover all Hubli neighborhoods: Keshwapur, Bhavani Nagar, Vidyanagar, Gokul Road, Navanagar, Deshpande Nagar, Kalyan Nagar, Shirur Park, Sadashivnagar, Hosur, and all surrounding areas.

Common scenarios: dead battery, engine not starting, flat tire, accident damage, planned servicing when busy, and any situation where riding is not feasible. Same quality guarantee — genuine parts, specialist technicians, transparent communication. Call +91 97422 91701 now.`;

// Read existing, insert before ];
let content = fs.readFileSync(base + '/lib/services.ts', 'utf8');
const closingIdx = content.lastIndexOf('];');
const before = content.substring(0, closingIdx);
const after = content.substring(closingIdx);

const entries = svcs.map(s => {
  const desc = descs[s.id] || s.short;
  return `  {
    id: "${s.id}",
    slug: "${s.slug}",
    name: "${s.name}",
    shortDescription: "${s.short}",
    fullDescription: \`${desc}\`,
    category: "${s.cat}",
    icon: "${s.icon}",
    commonProblems: ${JSON.stringify(s.probs)},
    whatWeInclude: ${JSON.stringify(s.inc)},
    signsYouNeed: ${JSON.stringify(s.signs)},
    brandsModels: ${JSON.stringify(allModels)},
    timeEstimate: "${s.time}",
    metaTitle: "${s.mt}",
    metaDescription: "${s.md}",
    primaryKeyword: "${s.kw}",
    faqs: ${JSON.stringify(s.faqs.map(f => ({question:f.q,answer:f.a})), null, 6).split('\n').join('\n    ')},
    relatedServices: ${JSON.stringify(s.rel)},
  }`;
});

content = before + ',\n' + entries.join(',\n') + '\n' + after;
fs.writeFileSync(base + '/lib/services.ts', content, 'utf8');
console.log('Done! Added ' + svcs.length + ' services.');
