import { useLocation, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { memo, useMemo } from "react";
import { CheckCircle, Smartphone, Laptop, Tablet, ChevronRight } from "lucide-react";

interface CityData {
  name: string;
  state: string;
  title: string;
  metaDescription: string;
  h1: string;
  intro: string;
  devices: string[];
  whyChoose: string[];
  howItWorks: { step: string; desc: string }[];
  serviceAreas: string;
  faqs: { question: string; answer: string }[];
}

const cityData: Record<string, CityData> = {
  'bangalore': {
    name: 'Bangalore',
    state: 'Karnataka',
    title: 'Sell Old Phones in Bangalore | Free Home Pickup & Instant Cash',
    metaDescription: 'Sell old phones, laptops and gadgets in Bangalore with free home pickup and instant cash.  Check your device price online and book a doorstep pickup with SellKar India.',
    h1: 'Sell Old Phones in Bangalore – Free Home Pickup',
    intro: 'Selling your old smartphone in Bangalore shouldn\'t be time-wasting. SellKar India gives you a quick, transparent and professional way to sell old phones at the best price with free home pickup anywhere in Bangalore.  No negotiation headaches, no marketplace fraud – just a smooth, verified process with instant cash.',
    devices: [
      'Smartphones (Apple, Samsung, OnePlus and more)',
      'Laptops',
      'Tablets & iPads',
      'MacBooks & iMacs'
    ],
    whyChoose: [
      'Instant cash at the time of pickup',
      'Free doorstep service across Bangalore',
      'Accurate price estimation based on real market value',
      'Trained professionals for device inspection',
      '100% data privacy with secure data wipe'
    ],
    howItWorks: [
      { step: 'Check Your Price', desc: 'Check your device price on our website or enquiry form.' },
      { step: 'Schedule Pickup', desc: 'Schedule a free home pickup at your convenient time.' },
      { step: 'Get Paid Instantly', desc: 'Our executive verifies the device and you receive instant payment.' }
    ],
    serviceAreas: 'We offer free home pickup across major locations in Bangalore, including: Koramangala, HSR Layout, Indiranagar, MG Road, Whitefield, Electronic City, JP Nagar, Jayanagar, Rajajinagar, Yelahanka, Hebbal, BTM Layout, Banashankari and many more surrounding areas.',
    faqs: [
      {
        question: 'Do you provide home pickup everywhere in Bangalore?',
        answer: 'Yes, we cover almost all major areas in Bangalore.  Share your location and our team will confirm availability.'
      },
      {
        question: 'How do you decide the price of my phone?',
        answer: 'The price is based on the model, condition, age of the device and current market demand.'
      },
      {
        question: 'Do you buy damaged or slightly faulty phones?',
        answer: 'Yes, we buy phones with minor issues as long as the device powers on.  The final price will depend on the exact condition.'
      },
      {
        question: 'Is my data safe when I sell my phone?',
        answer: 'Yes, we perform a complete data wipe from the device as part of our process. We strongly recommend you also back up and reset your phone before selling.'
      },
      {
        question: 'How fast can you schedule a pickup in Bangalore?',
        answer: 'In most cases, pickups are scheduled on the same day or within 2–6 hours depending on your location and slot availability.'
      }
    ]
  },
  'hyderabad': {
    name: 'Hyderabad',
    state: 'Telangana',
    title: 'Sell Old Phones in Hyderabad | Free Home Pickup & Instant Cash',
    metaDescription: 'Sell old phones, laptops and gadgets in Hyderabad with free home pickup and instant cash. Check your device price online and book a doorstep pickup with SellKar India.',
    h1: 'Sell Old Phones in Hyderabad – Free Home Pickup',
    intro: 'Selling an old phone in Hyderabad is now simple.  SellKar India lets you check your device price online, book a free home pickup and get paid instantly. No time wasted dealing with random buyers, no scams and no lowball offers – our trained team handles everything professionally.',
    devices: [
      'Smartphones',
      'Laptops',
      'Tablets & iPads',
      'MacBooks'
    ],
    whyChoose: [
      'Instant cash payment at your doorstep',
      'Free home pickup across Hyderabad',
      'Transparent pricing with no hidden cuts',
      'Professional and verified executives',
      'Data wipe guarantee for your security'
    ],
    howItWorks: [
      { step: 'Get Estimated Price', desc: 'Enter your device details and get an estimated price.' },
      { step: 'Book Pickup Slot', desc: 'Select a convenient pickup slot at your address.' },
      { step: 'Receive Payment', desc: 'Our executive verifies the device and you receive instant payment.' }
    ],
    serviceAreas: 'We provide free pickup across popular areas of Hyderabad, including: Madhapur, Gachibowli, Banjara Hills, Jubilee Hills, Kukatpally, Miyapur, Secunderabad, Hitech City, Begumpet, Ameerpet, LB Nagar, Uppal and many other nearby localities.',
    faqs: [
      {
        question: 'Do you pick up from all areas in Hyderabad?',
        answer: 'We cover most major areas in and around Hyderabad. Share your location and we will confirm the pickup availability.'
      },
      {
        question: 'Will you buy a phone with minor issues?',
        answer: 'Yes, we accept phones with minor problems depending on the condition. The offer price will be adjusted accordingly.'
      },
      {
        question: 'How long does it take for the pickup?',
        answer: 'Usually we manage a same-day pickup.  In busy slots it may take a few extra hours but we try to complete it as fast as possible.'
      },
      {
        question: 'Is the price final or negotiable?',
        answer: 'We try to give the best possible price upfront based on market value and device condition, so there is minimal negotiation needed.'
      },
      {
        question: 'What documents do I need to provide?',
        answer: 'You only need to provide a valid ID proof at the time of pickup as per our verification process.'
      }
    ]
  },
  'mumbai': {
    name: 'Mumbai',
    state: 'Maharashtra',
    title: 'Sell Old Phones in Mumbai | Free Home Pickup & Instant Cash',
    metaDescription: 'Sell old phones, laptops and gadgets in Mumbai with free home pickup and instant cash. Check your device price online and book a doorstep pickup with SellKar India.',
    h1: 'Sell Old Phones in Mumbai – Free Home Pickup',
    intro: 'Looking to sell your old phone in Mumbai?  SellKar India makes it hassle-free with doorstep pickup service across the city. Get instant cash for your old smartphones, laptops and gadgets without any hidden charges.  Our verified executives ensure a smooth, safe and transparent transaction every time.',
    devices: [
      'Smartphones (iPhone, Samsung, OnePlus, Xiaomi)',
      'Laptops & MacBooks',
      'Tablets & iPads',
      'Gaming Consoles'
    ],
    whyChoose: [
      'Instant cash payment at pickup',
      'Free home pickup across Mumbai and suburbs',
      'Best market price with no hidden deductions',
      'Verified and professional executives',
      'Complete data security and privacy'
    ],
    howItWorks: [
      { step: 'Check Price Online', desc: 'Get an instant price estimate for your device on our website.' },
      { step: 'Schedule Free Pickup', desc: 'Book a convenient time slot for home pickup.' },
      { step: 'Get Instant Cash', desc: 'Our executive inspects the device and you receive immediate payment.' }
    ],
    serviceAreas: 'We provide free doorstep pickup across Mumbai, including: Andheri, Bandra, Powai, Borivali, Kurla, Malad, Thane, Goregaon, Dadar, Churchgate, Colaba, Worli, Lower Parel, Mulund and all other areas across Mumbai and Navi Mumbai.',
    faqs: [
      {
        question: 'Do you cover all areas in Mumbai including suburbs?',
        answer: 'Yes, we provide free pickup service across Mumbai, Navi Mumbai and extended suburbs. Just share your location and we will confirm the slot.'
      },
      {
        question: 'What if my phone has a cracked screen?',
        answer: 'We buy phones with cracked screens or minor damages.  The final price will be adjusted based on the condition of the device.'
      },
      {
        question: 'How is the price calculated?',
        answer: 'We evaluate based on device model, age, condition, accessories and current market demand to offer you the best price.'
      },
      {
        question: 'Is it safe to sell my phone to SellKar India?',
        answer: 'Absolutely.  We follow strict data wiping protocols and all our executives are verified.  Your privacy and security are our top priority.'
      },
      {
        question: 'How quickly can I get my phone picked up in Mumbai?',
        answer: 'Most pickups are completed the same day.  During peak hours, it may take a few extra hours but we ensure quick service.'
      }
    ]
  },
  'delhi': {
    name: 'Delhi',
    state: 'Delhi NCR',
    title: 'Sell Old Phones in Delhi | Free Home Pickup & Instant Cash',
    metaDescription: 'Sell old phones, laptops and gadgets in Delhi with free home pickup and instant cash. Check your device price online and book a doorstep pickup with SellKar India.',
    h1: 'Sell Old Phones in Delhi – Free Home Pickup',
    intro: 'Selling your old phone in Delhi has never been easier. SellKar India offers instant cash with free doorstep pickup across all areas of Delhi NCR. Skip the hassle of finding buyers, negotiating prices or worrying about fraud.  We handle everything professionally and pay you on the spot.',
    devices: [
      'Smartphones (All Brands)',
      'Laptops & Notebooks',
      'Tablets & iPads',
      'MacBooks & iMacs'
    ],
    whyChoose: [
      'Instant payment via cash, UPI or bank transfer',
      'Free pickup across Delhi and NCR',
      'Fair pricing based on real market value',
      'Trained and verified team',
      'Secure data wipe on all devices'
    ],
    howItWorks: [
      { step: 'Get Your Quote', desc: 'Enter device details and get an instant price estimate.' },
      { step: 'Book Pickup', desc: 'Choose a time slot that works for you.' },
      { step: 'Receive Cash', desc: 'Hand over your device and get paid immediately.' }
    ],
    serviceAreas: 'We offer free home pickup across Delhi NCR, including: Connaught Place, Rohini, Dwarka, Saket, Lajpat Nagar, Karol Bagh, Janakpuri, Vasant Kunj, Nehru Place, Greater Kailash, Noida, Gurgaon, Faridabad and all surrounding areas.',
    faqs: [
      {
        question: 'Do you pick up from Noida and Gurgaon as well?',
        answer: 'Yes, we cover entire Delhi NCR including Noida, Gurgaon, Faridabad and Ghaziabad. Share your address and we will schedule a pickup.'
      },
      {
        question: 'Can I sell a phone that is not working?',
        answer: 'Yes, we buy non-functional or damaged phones as well. The price will depend on the extent of damage and parts condition.'
      },
      {
        question: 'Do I need to bring the original box?',
        answer: 'No, the original box is not mandatory. However, having the box and accessories may increase the resale value slightly.'
      },
      {
        question: 'How do I know the price is fair?',
        answer: 'Our pricing is transparent and based on current market rates. You can compare with other platforms and we are confident you will find our offer competitive.'
      },
      {
        question: 'What payment methods do you offer?',
        answer: 'We offer instant cash, UPI transfer or direct bank transfer at the time of pickup.'
      }
    ]
  },
  'chennai': {
    name: 'Chennai',
    state: 'Tamil Nadu',
    title: 'Sell Old Phones in Chennai | Free Home Pickup & Instant Cash',
    metaDescription: 'Sell old phones, laptops and gadgets in Chennai with free home pickup and instant cash. Check your device price online and book a doorstep pickup with SellKar India.',
    h1: 'Sell Old Phones in Chennai – Free Home Pickup',
    intro: 'Sell your old phone in Chennai with complete peace of mind. SellKar India provides professional doorstep pickup service with instant cash payment. Whether you have an iPhone, Samsung or any other brand, get the best value without stepping out of your home.',
    devices: [
      'Smartphones (iPhone, Samsung, Vivo, Oppo)',
      'Laptops',
      'Tablets & iPads',
      'MacBooks'
    ],
    whyChoose: [
      'Immediate cash payment on pickup',
      'Free home service across Chennai',
      'Transparent and competitive pricing',
      'Experienced and trustworthy team',
      'Safe data deletion process'
    ],
    howItWorks: [
      { step: 'Check Device Price', desc: 'Visit our website and check the estimated price for your device.' },
      { step: 'Schedule Pickup', desc: 'Select your preferred date and time for doorstep pickup.' },
      { step: 'Get Paid', desc: 'Our executive verifies and you receive instant payment.' }
    ],
    serviceAreas: 'We provide free pickup across Chennai, including: T Nagar, Anna Nagar, Velachery, Adyar, Tambaram, Porur, Chrompet, Mylapore, Nungambakkam, OMR, ECR and all other localities across Chennai.',
    faqs: [
      {
        question: 'Do you provide pickup in all areas of Chennai?',
        answer: 'Yes, we cover all major and surrounding areas of Chennai. Share your location and we will arrange the pickup.'
      },
      {
        question: 'Will you buy phones with software issues?',
        answer: 'Yes, we buy phones with software problems as long as the hardware is functional. Price will be adjusted accordingly.'
      },
      {
        question: 'How long does the pickup process take?',
        answer: 'The pickup itself takes just 10-15 minutes. Our executive will inspect the device and complete the payment on the spot.'
      },
      {
        question: 'Can I sell multiple devices at once?',
        answer: 'Absolutely!  You can sell multiple phones, laptops or gadgets in a single pickup.  Just let us know the details when booking.'
      },
      {
        question: 'Is there any service charge?',
        answer: 'No, our pickup service is completely free. The price you see is the price you get with no hidden deductions.'
      }
    ]
  },
  'pune': {
    name: 'Pune',
    state: 'Maharashtra',
    title: 'Sell Old Phones in Pune | Free Home Pickup & Instant Cash',
    metaDescription: 'Sell old phones, laptops and gadgets in Pune with free home pickup and instant cash.  Check your device price online and book a doorstep pickup with SellKar India.',
    h1: 'Sell Old Phones in Pune – Free Home Pickup',
    intro: 'Want to sell your old phone in Pune? SellKar India offers the easiest way to get instant cash with free doorstep pickup. We serve all areas of Pune with professional service, fair pricing and complete transparency.  No bargaining, no delays – just quick cash.',
    devices: [
      'Smartphones (All Brands)',
      'Laptops & Ultrabooks',
      'Tablets & iPads',
      'MacBooks'
    ],
    whyChoose: [
      'Instant cash or online payment',
      'Free pickup anywhere in Pune',
      'Market-best pricing',
      'Verified professionals',
      'Complete data security'
    ],
    howItWorks: [
      { step: 'Get Price Estimate', desc: 'Check your device price on our website in seconds.' },
      { step: 'Book Free Pickup', desc: 'Choose a convenient time for doorstep service.' },
      { step: 'Receive Payment', desc: 'Get paid instantly after device verification.' }
    ],
    serviceAreas: 'We offer free home pickup across Pune, including: Hinjewadi, Kothrud, Viman Nagar, Wakad, Baner, Hadapsar, Aundh, Pimpri-Chinchwad, Magarpatta, Kharadi, Kalyani Nagar and all other areas.',
    faqs: [
      {
        question: 'Do you cover Pimpri-Chinchwad area? ',
        answer: 'Yes, we provide free pickup across Pune including Pimpri-Chinchwad and all PCMC areas.'
      },
      {
        question: 'What if I am not satisfied with the price?',
        answer: 'There is no obligation to sell. If you are not happy with the final offer, you can keep your device without any charges.'
      },
      {
        question: 'Do you buy old laptops as well?',
        answer: 'Yes, we buy laptops, MacBooks, tablets and other gadgets along with smartphones.'
      },
      {
        question: 'How is data security ensured?',
        answer: 'We perform a complete factory reset and data wipe on all devices to ensure your personal information is completely removed.'
      },
      {
        question: 'Can I track my pickup request?',
        answer: 'Yes, once you book a pickup, you will receive confirmation and tracking details via SMS and email.'
      }
    ]
  },
  'kolkata': {
    name: 'Kolkata',
    state: 'West Bengal',
    title: 'Sell Old Phones in Kolkata | Free Home Pickup & Instant Cash',
    metaDescription: 'Sell old phones, laptops and gadgets in Kolkata with free home pickup and instant cash. Check your device price online and book a doorstep pickup with SellKar India.',
    h1: 'Sell Old Phones in Kolkata – Free Home Pickup',
    intro: 'Sell your old smartphone in Kolkata with SellKar India and get instant cash without leaving your home. We offer transparent pricing, professional service and guaranteed data security.  Serving all areas of Kolkata with the fastest and most reliable phone selling experience.',
    devices: [
      'Smartphones',
      'Laptops',
      'Tablets & iPads',
      'MacBooks'
    ],
    whyChoose: [
      'Same-day pickup available',
      'Free doorstep service across Kolkata',
      'Best prices with no hidden cuts',
      'Professional and courteous staff',
      'Complete data wiping'
    ],
    howItWorks: [
      { step: 'Get Instant Quote', desc: 'Enter your device details and see the estimated price.' },
      { step: 'Schedule Pickup', desc: 'Book a free home pickup at your convenience.' },
      { step: 'Get Cash', desc: 'Receive payment immediately after inspection.' }
    ],
    serviceAreas: 'We provide free pickup across Kolkata, including: Salt Lake, Park Street, Howrah, Ballygunge, New Town, Jadavpur, Behala, Dum Dum, Rajarhat, Esplanade, Gariahat and all other localities.',
    faqs: [
      {
        question: 'Do you serve Howrah and surrounding areas?',
        answer: 'Yes, we cover Howrah, Salt Lake, New Town and all areas in and around Kolkata.'
      },
      {
        question: 'Can I sell a phone with a broken display?',
        answer: 'Yes, we accept phones with broken displays.  The price will be adjusted based on the damage.'
      },
      {
        question: 'Do I need to factory reset my phone before selling?',
        answer: 'It is recommended but not mandatory. Our team will perform a secure wipe during the process.'
      },
      {
        question: 'What is the minimum value phone you accept?',
        answer: 'We accept phones of all values.  Even older models have resale value and we will make you an offer.'
      },
      {
        question: 'How quickly can you arrange a pickup?',
        answer: 'Most pickups are scheduled within 2-6 hours. Same-day service is available for most locations.'
      }
    ]
  },
  'jaipur': {
    name: 'Jaipur',
    state: 'Rajasthan',
    title: 'Sell Old Phones in Jaipur | Free Home Pickup & Instant Cash',
    metaDescription: 'Sell old phones, laptops and gadgets in Jaipur with free home pickup and instant cash. Check your device price online and book a doorstep pickup with SellKar India.',
    h1: 'Sell Old Phones in Jaipur – Free Home Pickup',
    intro: 'Selling your old phone in Jaipur is now simple and rewarding with SellKar India. Get the best price with free home pickup service across the Pink City. Our process is quick, transparent and completely secure, ensuring you get instant cash for your devices.',
    devices: [
      'Smartphones (All Brands)',
      'Laptops',
      'Tablets',
      'MacBooks'
    ],
    whyChoose: [
      'Instant payment on the spot',
      'Free pickup across Jaipur',
      'Fair and transparent pricing',
      'Trusted and verified team',
      'Safe data removal'
    ],
    howItWorks: [
      { step: 'Check Price', desc: 'Get an instant price quote for your device online.' },
      { step: 'Book Pickup', desc: 'Schedule a free home pickup at your preferred time.' },
      { step: 'Get Paid', desc: 'Receive instant cash after verification.' }
    ],
    serviceAreas: 'We offer free pickup across Jaipur, including: Malviya Nagar, Vaishali Nagar, Mansarovar, C-Scheme, Jagatpura, Raja Park, Ajmer Road, Tonk Road, Sikar Road and all other areas.',
    faqs: [
      {
        question: 'Do you provide pickup in residential colonies?',
        answer: 'Yes, we provide doorstep pickup in all residential and commercial areas across Jaipur.'
      },
      {
        question: 'Can I sell an old feature phone?',
        answer: 'Yes, we buy feature phones as well.  The price will depend on the model and condition.'
      },
      {
        question: 'Do you offer the same price that shows online?',
        answer: 'The online price is an estimate. The final price is determined after physical inspection based on the actual condition.'
      },
      {
        question: 'Is there a limit on how many devices I can sell?',
        answer: 'No, you can sell multiple devices in one pickup. Just provide details while booking.'
      },
      {
        question: 'What documents are required? ',
        answer: 'A valid government-issued ID proof is required for verification purposes.'
      }
    ]
  },
  'lucknow': {
    name: 'Lucknow',
    state: 'Uttar Pradesh',
    title: 'Sell Old Phones in Lucknow | Free Home Pickup & Instant Cash',
    metaDescription: 'Sell old phones, laptops and gadgets in Lucknow with free home pickup and instant cash. Check your device price online and book a doorstep pickup with SellKar India.',
    h1: 'Sell Old Phones in Lucknow – Free Home Pickup',
    intro: 'Looking to sell your old phone in Lucknow? SellKar India makes it hassle-free with doorstep pickup and instant cash. We serve all areas of Lucknow with professional service, best prices and complete transparency.',
    devices: [
      'Smartphones',
      'Laptops',
      'Tablets',
      'MacBooks'
    ],
    whyChoose: [
      'Instant cash payment',
      'Free home pickup in Lucknow',
      'Best market rates',
      'Professional team',
      'Secure data wipe'
    ],
    howItWorks: [
      { step: 'Get Quote', desc: 'Check your device price online instantly.' },
      { step: 'Schedule Pickup', desc: 'Book free home pickup at your convenience.' },
      { step: 'Receive Cash', desc: 'Get paid immediately after verification.' }
    ],
    serviceAreas: 'We provide free pickup across Lucknow, including: Gomti Nagar, Hazratganj, Alambagh, Indira Nagar, Aliganj, Mahanagar, Aminabad, Chowk, Kaiserbagh and all other areas.',
    faqs: [
      {
        question: 'Do you cover all areas of Lucknow?',
        answer: 'Yes, we provide service across all major and surrounding areas of Lucknow.'
      },
      {
        question: 'Can I negotiate the price?',
        answer: 'Our prices are already competitive based on market rates. However, the final price is based on device condition.'
      },
      {
        question: 'Do you buy water-damaged phones?',
        answer: 'We can evaluate water-damaged phones.  The price will depend on the extent of damage.'
      },
      {
        question: 'How do I prepare my phone for sale?',
        answer: 'Back up your data, sign out of accounts and factory reset if possible.  We will also do a secure wipe.'
      },
      {
        question: 'Is pickup really free?',
        answer: 'Yes, absolutely. There are no hidden charges or pickup fees.'
      }
    ]
  },
  'kanpur': {
    name: 'Kanpur',
    state: 'Uttar Pradesh',
    title: 'Sell Old Phones in Kanpur | Free Home Pickup & Instant Cash',
    metaDescription: 'Sell old phones, laptops and gadgets in Kanpur with free home pickup and instant cash. Check your device price online and book a doorstep pickup with SellKar India.',
    h1: 'Sell Old Phones in Kanpur – Free Home Pickup',
    intro: 'Sell your old smartphone in Kanpur with SellKar India and get the best value with doorstep service. We offer instant cash, professional handling and complete data security across all areas of Kanpur.',
    devices: [
      'Smartphones',
      'Laptops',
      'Tablets',
      'Gaming Devices'
    ],
    whyChoose: [
      'Instant payment',
      'Free pickup service',
      'Transparent pricing',
      'Verified executives',
      'Data security guaranteed'
    ],
    howItWorks: [
      { step: 'Check Price', desc: 'Get instant price estimate online.' },
      { step: 'Book Pickup', desc: 'Schedule free home pickup.' },
      { step: 'Get Cash', desc: 'Receive payment immediately.' }
    ],
    serviceAreas: 'We offer pickup across Kanpur, including: Civil Lines, Kakadeo, Swaroop Nagar, Kalyanpur, Armapur, Kidwai Nagar, Govind Nagar and all other localities.',
    faqs: [
      {
        question: 'Do you serve all areas in Kanpur?',
        answer: 'Yes, we cover all major areas and surrounding localities of Kanpur.'
      },
      {
        question: 'What if my phone is very old?',
        answer: 'We buy phones of all ages.  Even older models have value.'
      },
      {
        question: 'Can I reschedule my pickup?',
        answer: 'Yes, you can reschedule by contacting our support team.'
      },
      {
        question: 'Do you buy locked phones?',
        answer: 'We prefer unlocked phones but can evaluate locked devices case by case.'
      },
      {
        question: 'How long does payment take?',
        answer: 'Payment is instant at the time of pickup via cash or UPI.'
      }
    ]
  },
  'varanasi': {
    name: 'Varanasi',
    state: 'Uttar Pradesh',
    title: 'Sell Old Phones in Varanasi | Free Home Pickup & Instant Cash',
    metaDescription: 'Sell old phones, laptops and gadgets in Varanasi with free home pickup and instant cash. Check your device price online and book a doorstep pickup with SellKar India.',
    h1: 'Sell Old Phones in Varanasi – Free Home Pickup',
    intro: 'Sell your old phone in Varanasi with ease.  SellKar India provides doorstep pickup with instant cash payment across the city. Professional service, best prices and complete security guaranteed.',
    devices: [
      'Smartphones',
      'Laptops',
      'Tablets',
      'Other Gadgets'
    ],
    whyChoose: [
      'Instant cash',
      'Free home pickup',
      'Best prices',
      'Professional team',
      'Secure process'
    ],
    howItWorks: [
      { step: 'Get Quote', desc: 'Check device price online.' },
      { step: 'Book Pickup', desc: 'Schedule free pickup.' },
      { step: 'Get Paid', desc: 'Receive instant payment.' }
    ],
    serviceAreas: 'We serve all areas of Varanasi, including: Sigra, Lanka, Bhelupur, Cantonment, Luxa, Sarnath, Mahmoorganj, Nadesar and other localities.',
    faqs: [
      {
        question: 'Do you provide pickup in all areas?',
        answer: 'Yes, we cover all major areas of Varanasi.'
      },
      {
        question: 'Is the online price guaranteed?',
        answer: 'The online price is an estimate. Final price depends on actual condition.'
      },
      {
        question: 'Can I sell damaged phones?',
        answer: 'Yes, we buy phones with damage. Price adjusted accordingly.'
      },
      {
        question: 'Do you buy laptops? ',
        answer: 'Yes, we buy laptops, tablets and other gadgets.'
      },
      {
        question: 'How fast is the pickup?',
        answer: 'Usually same-day or within 24 hours.'
      }
    ]
  },
  'agra': {
    name: 'Agra',
    state: 'Uttar Pradesh',
    title: 'Sell Old Phones in Agra | Free Home Pickup & Instant Cash',
    metaDescription: 'Sell old phones, laptops and gadgets in Agra with free home pickup and instant cash. Check your device price online and book a doorstep pickup with SellKar India.',
    h1: 'Sell Old Phones in Agra – Free Home Pickup',
    intro: 'Sell your old phone in Agra with SellKar India.  Get instant cash with free doorstep pickup.  Professional, secure and hassle-free service across all areas.',
    devices: ['Smartphones', 'Laptops', 'Tablets', 'Accessories'],
    whyChoose: ['Instant payment', 'Free pickup', 'Best rates', 'Trusted team', 'Data security'],
    howItWorks: [
      { step: 'Get Price', desc: 'Check online quote.' },
      { step: 'Book Pickup', desc: 'Schedule free pickup.' },
      { step: 'Get Cash', desc: 'Instant payment.' }
    ],
    serviceAreas: 'We serve Agra including: Sikandra, Tajganj, Sadar Bazaar, Kamla Nagar, Dayal Bagh, Sanjay Place and all areas.',
    faqs: [
      { question: 'Do you cover all Agra areas?', answer: 'Yes, we serve all major areas of Agra.' },
      { question: 'Can I sell multiple devices?', answer: 'Yes, you can sell multiple devices at once.' },
      { question: 'Is data wiping done?', answer: 'Yes, we ensure complete data removal.' },
      { question: 'What payment methods? ', answer: 'Cash, UPI or bank transfer.' },
      { question: 'Any hidden charges?', answer: 'No, pickup is completely free.' }
    ]
  },
  'thane': {
    name: 'Thane',
    state: 'Maharashtra',
    title: 'Sell Old Phones in Thane | Free Home Pickup & Instant Cash',
    metaDescription: 'Sell old phones, laptops and gadgets in Thane with free home pickup and instant cash. Check your device price online and book a doorstep pickup with SellKar India.',
    h1: 'Sell Old Phones in Thane – Free Home Pickup',
    intro: 'Sell your old phone in Thane with SellKar India. Free doorstep pickup, instant cash and transparent pricing across all areas of Thane.',
    devices: ['Smartphones', 'Laptops', 'Tablets', 'MacBooks'],
    whyChoose: ['Instant cash', 'Free pickup', 'Best prices', 'Professional', 'Secure'],
    howItWorks: [
      { step: 'Get Quote', desc: 'Check price online.' },
      { step: 'Book Pickup', desc: 'Schedule free service.' },
      { step: 'Get Paid', desc: 'Instant payment.' }
    ],
    serviceAreas: 'We serve Thane including: Ghodbunder Road, Majiwada, Naupada, Vartak Nagar, Wagle Estate, Kolshet, Manpada and all areas.',
    faqs: [
      { question: 'Do you cover Navi Mumbai too?', answer: 'Yes, we serve Thane and nearby Navi Mumbai areas.' },
      { question: 'Can I sell broken phones?', answer: 'Yes, we buy phones with damage.' },
      { question: 'How quick is pickup?', answer: 'Usually same-day service available.' },
      { question: 'Is pricing transparent?', answer: 'Yes, no hidden deductions.' },
      { question: 'Documents needed?', answer: 'Valid ID proof required.' }
    ]
  },
  'chandigarh': {
    name: 'Chandigarh',
    state: 'Chandigarh',
    title: 'Sell Old Phones in Chandigarh | Free Home Pickup & Instant Cash',
    metaDescription: 'Sell old phones, laptops and gadgets in Chandigarh with free home pickup and instant cash.  Check your device price online and book a doorstep pickup with SellKar India.',
    h1: 'Sell Old Phones in Chandigarh – Free Home Pickup',
    intro: 'Sell old phones in Chandigarh with SellKar India. Get best prices with free home pickup across all sectors. Quick, professional and secure service.',
    devices: ['Smartphones', 'Laptops', 'Tablets', 'MacBooks'],
    whyChoose: ['Instant payment', 'Free pickup', 'Best rates', 'Professional', 'Secure'],
    howItWorks: [
      { step: 'Get Price', desc: 'Check online.' },
      { step: 'Book Pickup', desc: 'Schedule service.' },
      { step: 'Get Cash', desc: 'Instant payment.' }
    ],
    serviceAreas: 'We serve Chandigarh including: Sector 17, Sector 35, Sector 22, Mohali, Panchkula, Sector 43 and all sectors.',
    faqs: [
      { question: 'Do you serve Mohali and Panchkula?', answer: 'Yes, we cover entire Chandigarh Tricity.' },
      { question: 'Can I sell damaged phones?', answer: 'Yes, we buy damaged devices.' },
      { question: 'How fast is service?', answer: 'Same-day pickup available.' },
      { question: 'Payment methods?', answer: 'Cash, UPI or bank transfer.' },
      { question: 'Any charges?', answer: 'No, completely free service.' }
    ]
  },
  'amritsar': {
    name: 'Amritsar',
    state: 'Punjab',
    title: 'Sell Old Phones in Amritsar | Free Home Pickup & Instant Cash',
    metaDescription: 'Sell old phones, laptops and gadgets in Amritsar with free home pickup and instant cash.  Check your device price online and book a doorstep pickup with SellKar India.',
    h1: 'Sell Old Phones in Amritsar – Free Home Pickup',
    intro: 'Sell your old phone in Amritsar with SellKar India. Free pickup, instant cash and transparent process across the city.',
    devices: ['Smartphones', 'Laptops', 'Tablets', 'Gadgets'],
    whyChoose: ['Instant cash', 'Free pickup', 'Best price', 'Professional', 'Secure'],
    howItWorks: [
      { step: 'Get Quote', desc: 'Check price.' },
      { step: 'Book Pickup', desc: 'Schedule.' },
      { step: 'Get Paid', desc: 'Instant.' }
    ],
    serviceAreas: 'We serve Amritsar including: Lawrence Road, Mall Road, Ranjit Avenue, Chheharta, Majitha Road, Court Road and all areas.',
    faqs: [
      { question: 'All areas covered?', answer: 'Yes, entire Amritsar.' },
      { question: 'Damaged phones accepted?', answer: 'Yes, with price adjustment.' },
      { question: 'Pickup speed?', answer: 'Same-day usually.' },
      { question: 'Payment mode?', answer: 'Cash or UPI.' },
      { question: 'Free service?', answer: 'Yes, completely free.' }
    ]
  },
  'ludhiana': {
    name: 'Ludhiana',
    state: 'Punjab',
    title: 'Sell Old Phones in Ludhiana | Free Home Pickup & Instant Cash',
    metaDescription: 'Sell old phones, laptops and gadgets in Ludhiana with free home pickup and instant cash.  Check your device price online and book a doorstep pickup with SellKar India.',
    h1: 'Sell Old Phones in Ludhiana – Free Home Pickup',
    intro: 'Sell old phones in Ludhiana with SellKar India. Best prices, free doorstep pickup and instant cash across the city.',
    devices: ['Smartphones', 'Laptops', 'Tablets', 'Accessories'],
    whyChoose: ['Instant payment', 'Free service', 'Best rates', 'Professional', 'Secure'],
    howItWorks: [
      { step: 'Get Quote', desc: 'Check online.' },
      { step: 'Book Pickup', desc: 'Schedule.' },
      { step: 'Get Cash', desc: 'Instant.' }
    ],
    serviceAreas: 'We serve Ludhiana including: Model Town, Civil Lines, Sarabha Nagar, PAU, Dugri, Ferozepur Road and all areas.',
    faqs: [
      { question: 'Cover all Ludhiana? ', answer: 'Yes, all areas.' },
      { question: 'Buy damaged devices?', answer: 'Yes.' },
      { question: 'How fast? ', answer: 'Same-day.' },
      { question: 'Payment? ', answer: 'Cash/UPI.' },
      { question: 'Charges?', answer: 'No charges.' }
    ]
  },
  'patna': {
    name: 'Patna',
    state: 'Bihar',
    title: 'Sell Old Phones in Patna | Free Home Pickup & Instant Cash',
    metaDescription: 'Sell old phones, laptops and gadgets in Patna with free home pickup and instant cash. Check your device price online and book a doorstep pickup with SellKar India.',
    h1: 'Sell Old Phones in Patna – Free Home Pickup',
    intro: 'Sell your old phone in Patna with SellKar India. Get instant cash with free home pickup across all areas of Patna.',
    devices: ['Smartphones', 'Laptops', 'Tablets', 'Gadgets'],
    whyChoose: ['Instant cash', 'Free pickup', 'Best price', 'Professional', 'Secure'],
    howItWorks: [
      { step: 'Get Quote', desc: 'Check price.' },
      { step: 'Book Pickup', desc: 'Schedule.' },
      { step: 'Get Paid', desc: 'Instant.' }
    ],
    serviceAreas: 'We serve Patna including: Boring Road, Kankarbagh, Patliputra, Rajendra Nagar, Danapur, Bailey Road and all areas.',
    faqs: [
      { question: 'All areas covered?', answer: 'Yes, entire Patna.' },
      { question: 'Damaged phones? ', answer: 'Yes.' },
      { question: 'Speed? ', answer: 'Same-day.' },
      { question: 'Payment?', answer: 'Cash/UPI.' },
      { question: 'Free? ', answer: 'Yes.' }
    ]
  },
  'gorakhpur': {
    name: 'Gorakhpur',
    state: 'Uttar Pradesh',
    title: 'Sell Old Phones in Gorakhpur | Free Home Pickup & Instant Cash',
    metaDescription: 'Sell old phones, laptops and gadgets in Gorakhpur with free home pickup and instant cash. Check your device price online and book a doorstep pickup with SellKar India.',
    h1: 'Sell Old Phones in Gorakhpur – Free Home Pickup',
    intro: 'Sell old phones in Gorakhpur with SellKar India. Free pickup, instant cash and professional service across the city.',
    devices: ['Smartphones', 'Laptops', 'Tablets', 'Gadgets'],
    whyChoose: ['Instant cash', 'Free pickup', 'Best rates', 'Professional', 'Secure'],
    howItWorks: [
      { step: 'Get Quote', desc: 'Check price.' },
      { step: 'Book Pickup', desc: 'Schedule.' },
      { step: 'Get Paid', desc: 'Instant.' }
    ],
    serviceAreas: 'We serve Gorakhpur including: Civil Lines, Golghar, Rapti Nagar, Taramandal, Bank Road, Medical College and all areas.',
    faqs: [
      { question: 'Cover all areas?', answer: 'Yes.' },
      { question: 'Damaged phones?', answer: 'Yes.' },
      { question: 'Speed?', answer: 'Same-day.' },
      { question: 'Payment? ', answer: 'Cash/UPI.' },
      { question: 'Free?', answer: 'Yes.' }
    ]
  },
  'mathura': {
    name: 'Mathura',
    state: 'Uttar Pradesh',
    title: 'Sell Old Phones in Mathura | Free Home Pickup & Instant Cash',
    metaDescription: 'Sell old phones, laptops and gadgets in Mathura with free home pickup and instant cash. Check your device price online and book a doorstep pickup with SellKar India.',
    h1: 'Sell Old Phones in Mathura – Free Home Pickup',
    intro: 'Sell old phones in Mathura with SellKar India. Get instant cash with free doorstep pickup service.',
    devices: ['Smartphones', 'Laptops', 'Tablets', 'Gadgets'],
    whyChoose: ['Instant cash', 'Free pickup', 'Best price', 'Professional', 'Secure'],
    howItWorks: [
      { step: 'Get Quote', desc: 'Check price.' },
      { step: 'Book Pickup', desc: 'Schedule.' },
      { step: 'Get Paid', desc: 'Instant.' }
    ],
    serviceAreas: 'We serve Mathura including: Krishna Nagar, New Bus Stand, Vrindavan Road, Holi Gate, Dampier Nagar, Masani and all areas.',
    faqs: [
      { question: 'All areas? ', answer: 'Yes.' },
      { question: 'Damaged? ', answer: 'Yes.' },
      { question: 'Speed?', answer: 'Same-day.' },
      { question: 'Payment?', answer: 'Cash/UPI.' },
      { question: 'Free? ', answer: 'Yes.' }
    ]
  }
};

const CityLandingPage = () => {
  const location = useLocation();
  
  const { currentCity, citySlug } = useMemo(() => {
    const path = location.pathname;
    const slug = path.replace('/sell-phone-in-', '');
    const city = cityData[slug] || cityData['bangalore'];
    return { currentCity: city, citySlug: slug };
  }, [location. pathname]);

  const canonicalUrl = `https://www.sellkarindia.com/sell-phone-in-${citySlug}`;

  // Breadcrumb structured data
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.sellkarindia. com/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Cities",
        "item": "https://www.sellkarindia. com/cities"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": currentCity.name,
        "item": canonicalUrl
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>{currentCity.title}</title>
        <meta name="description" content={currentCity.metaDescription} />
        <meta name="robots" content="index,follow" />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={currentCity.title} />
        <meta property="og:description" content={currentCity.metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        
        {/* Breadcrumb Schema */}
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
        
        {/* LocalBusiness Schema */}
        <script type="application/ld+json">
          {`{"@context":"https://schema.org","@type":"LocalBusiness","name":"SellKar India - ${currentCity.name}","description":"${currentCity.metaDescription}","url":"${canonicalUrl}","areaServed":{"@type":"City","name":"${currentCity.name}","containedIn":"${currentCity.state}"},"priceRange":"₹₹","paymentAccepted":["Cash","UPI","Bank Transfer"],"currenciesAccepted":"INR"}`}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="container mx-auto px-4 py-16">
          
          {/* Breadcrumb Navigation */}
          <nav aria-label="breadcrumb" className="mb-8">
            <ol className="flex items-center space-x-2 text-sm text-gray-600">
              <li>
                <Link 
                  to="/" 
                  className="hover:text-blue-600 transition-colors flex items-center"
                >
                  Home
                </Link>
              </li>
              <li>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </li>
              <li>
                <Link 
                  to="/cities" 
                  className="hover:text-blue-600 transition-colors flex items-center"
                >
                  Cities
                </Link>
              </li>
              <li>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </li>
              <li className="text-blue-600 font-medium" aria-current="page">
                {currentCity.name}
              </li>
            </ol>
          </nav>

          {/* Hero Section */}
          <section className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              {currentCity.h1}
            </h1>
            <p className="text-lg text-gray-700 mb-8 max-w-4xl mx-auto leading-relaxed">
              {currentCity.intro}
            </p>
            <Link to="/sell/mobiles">
              <Button size="lg" className="text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700 text-white">
                Check Price Now →
              </Button>
            </Link>
          </section>

          {/* Devices We Buy */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
              Devices We Buy in {currentCity.name}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {currentCity.devices.map((device, idx) => (
                <div key={idx} className="bg-white border border-blue-100 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
                  {idx === 0 && <Smartphone className="w-10 h-10 mx-auto mb-3 text-blue-600" />}
                  {idx === 1 && <Laptop className="w-10 h-10 mx-auto mb-3 text-blue-600" />}
                  {idx === 2 && <Tablet className="w-10 h-10 mx-auto mb-3 text-blue-600" />}
                  {idx > 2 && <CheckCircle className="w-10 h-10 mx-auto mb-3 text-blue-600" />}
                  <p className="text-sm font-medium text-gray-800">{device}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Why Choose SellKar India */}
          <section className="mb-16 bg-white rounded-lg p-8 border border-blue-100">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
              Why Choose SellKar India in {currentCity.name}
            </h2>
            <ul className="space-y-4 max-w-3xl mx-auto">
              {currentCity.whyChoose.map((reason, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{reason}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* How It Works */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
              How It Works
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {currentCity.howItWorks.map((step, idx) => (
                <div key={idx} className="text-center">
                  <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    {idx + 1}
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-gray-900">{step.step}</h3>
                  <p className="text-gray-600">{step.desc}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link to="/sell/mobiles">
                <Button size="lg" className="text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700 text-white">
                  Book Free Pickup →
                </Button>
              </Link>
            </div>
          </section>

          {/* Service Areas */}
          <section className="mb-16 bg-blue-50 rounded-lg p-8 border border-blue-200">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">
              Service Areas in {currentCity.name}
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {currentCity.serviceAreas}
            </p>
          </section>

          {/* FAQ Section */}
          {currentCity.faqs.length > 0 && (
            <section className="mb-16">
              <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
                Frequently Asked Questions
              </h2>
              <div className="space-y-6 max-w-4xl mx-auto">
                {currentCity.faqs.map((faq, idx) => (
                  <div key={idx} className="bg-white rounded-lg p-6 border border-blue-100">
                    <h3 className="text-lg font-semibold mb-3 text-gray-900">
                      {faq.question}
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Cross-link to Other Cities */}
          <section className="mb-8">
            <div className="max-w-4xl mx-auto text-center">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Also Available in Other Cities:
              </h3>
              <div className="flex flex-wrap justify-center gap-4">
                {citySlug === 'bangalore' && (
                  <a 
                    href="/sell-phone-in-hyderabad"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline transition-colors text-base"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Sell Old Phones in Hyderabad
                  </a>
                )}
                {citySlug === 'hyderabad' && (
                  <a 
                    href="/sell-phone-in-bangalore"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline transition-colors text-base"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Sell Old Phones in Bangalore
                  </a>
                )}
              </div>
            </div>
          </section>

          {/* Final CTA */}
          <section className="text-center bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-12 border border-blue-200">
            <h2 className="text-3xl font-bold mb-4 text-blue-900">
              Ready to Sell Your Phone in {currentCity.name}? 
            </h2>
            <p className="text-xl text-gray-700 mb-8">
              Get an instant quote now and receive payment within 24 hours! 
            </p>
            <Link to="/sell/mobiles">
              <Button size="lg" className="text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700 text-white">
                Start Selling Now →
              </Button>
            </Link>
          </section>
        </div>
      </div>
    </>
  );
};

export default memo(CityLandingPage);
