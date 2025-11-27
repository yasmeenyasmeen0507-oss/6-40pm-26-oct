import { useLocation, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async"; // ✅ CHANGED
import { Button } from "@/components/ui/button";
import { memo, useMemo } from "react"; // ✅ ADD memo
import { CheckCircle, Truck, IndianRupee, Shield, Clock } from "lucide-react";

interface CityData {
  name: string;
  state: string;
  description: string;
  areas: string[];
}

const cityData: Record<string, CityData> = {
  'bangalore': {
    name: 'Bangalore',
    state: 'Karnataka',
    description: 'Sell your old phone in Bangalore and get instant cash.  We offer the best prices for used mobiles with free doorstep pickup across Bangalore, including Koramangala, Whitefield, Indiranagar, and all areas.',
    areas: ['Koramangala', 'Whitefield', 'Indiranagar', 'Electronic City', 'HSR Layout', 'Marathahalli']
  },
  'delhi': {
    name: 'Delhi',
    state: 'Delhi NCR',
    description: 'Sell your old phone in Delhi and get instant cash. We offer the best prices for used mobiles with free doorstep pickup across Delhi, including Connaught Place, Rohini, Dwarka, and all areas.',
    areas: ['Connaught Place', 'Rohini', 'Dwarka', 'Saket', 'Lajpat Nagar', 'Karol Bagh']
  },
  'mumbai': {
    name: 'Mumbai',
    state: 'Maharashtra',
    description: 'Sell your old phone in Mumbai and get instant cash. We offer the best prices for used mobiles with free doorstep pickup across Mumbai, including Andheri, Bandra, Thane, and all areas.',
    areas: ['Andheri', 'Bandra', 'Powai', 'Borivali', 'Kurla', 'Malad']
  },
  'chennai': {
    name: 'Chennai',
    state: 'Tamil Nadu',
    description: 'Sell your old phone in Chennai and get instant cash. We offer the best prices for used mobiles with free doorstep pickup across Chennai, including T Nagar, Anna Nagar, Velachery, and all areas.',
    areas: ['T Nagar', 'Anna Nagar', 'Velachery', 'Adyar', 'Tambaram', 'Porur']
  },
  'hyderabad': {
    name: 'Hyderabad',
    state: 'Telangana',
    description: 'Sell your old phone in Hyderabad and get instant cash.  We offer the best prices for used mobiles with free doorstep pickup across Hyderabad, including Hitech City, Gachibowli, Secunderabad, and all areas.',
    areas: ['Hitech City', 'Gachibowli', 'Secunderabad', 'Madhapur', 'Banjara Hills', 'Kukatpally']
  },
  'thane': {
    name: 'Thane',
    state: 'Maharashtra',
    description: 'Sell your old phone in Thane and get instant cash. We offer the best prices for used mobiles with free doorstep pickup across Thane, including Ghodbunder Road, Majiwada, Naupada, and all areas.',
    areas: ['Ghodbunder Road', 'Majiwada', 'Naupada', 'Vartak Nagar', 'Wagle Estate', 'Kolshet']
  },
  'jaipur': {
    name: 'Jaipur',
    state: 'Rajasthan',
    description: 'Sell your old phone in Jaipur and get instant cash. We offer the best prices for used mobiles with free doorstep pickup across Jaipur, including Malviya Nagar, Vaishali Nagar, Mansarovar, and all areas.',
    areas: ['Malviya Nagar', 'Vaishali Nagar', 'Mansarovar', 'C-Scheme', 'Jagatpura', 'Raja Park']
  },
  'pune': {
    name: 'Pune',
    state: 'Maharashtra',
    description: 'Sell your old phone in Pune and get instant cash. We offer the best prices for used mobiles with free doorstep pickup across Pune, including Hinjewadi, Kothrud, Viman Nagar, and all areas.',
    areas: ['Hinjewadi', 'Kothrud', 'Viman Nagar', 'Wakad', 'Baner', 'Hadapsar']
  },
  'agra': {
    name: 'Agra',
    state: 'Uttar Pradesh',
    description: 'Sell your old phone in Agra and get instant cash. We offer the best prices for used mobiles with free doorstep pickup across Agra, including Sikandra, Tajganj, Sadar Bazaar, and all areas.',
    areas: ['Sikandra', 'Tajganj', 'Sadar Bazaar', 'Kamla Nagar', 'Dayal Bagh', 'Sanjay Place']
  },
  'kolkata': {
    name: 'Kolkata',
    state: 'West Bengal',
    description: 'Sell your old phone in Kolkata and get instant cash. We offer the best prices for used mobiles with free doorstep pickup across Kolkata, including Salt Lake, Park Street, Howrah, and all areas.',
    areas: ['Salt Lake', 'Park Street', 'Howrah', 'Ballygunge', 'New Town', 'Jadavpur']
  },
  'gorakhpur': {
    name: 'Gorakhpur',
    state: 'Uttar Pradesh',
    description: 'Sell your old phone in Gorakhpur and get instant cash. We offer the best prices for used mobiles with free doorstep pickup across Gorakhpur, including Civil Lines, Golghar, Rapti Nagar, and all areas.',
    areas: ['Civil Lines', 'Golghar', 'Rapti Nagar', 'Taramandal', 'Bank Road', 'Medical College']
  },
  'mathura': {
    name: 'Mathura',
    state: 'Uttar Pradesh',
    description: 'Sell your old phone in Mathura and get instant cash. We offer the best prices for used mobiles with free doorstep pickup across Mathura, including Krishna Nagar, New Bus Stand, Vrindavan Road, and all areas.',
    areas: ['Krishna Nagar', 'New Bus Stand', 'Vrindavan Road', 'Holi Gate', 'Dampier Nagar', 'Masani']
  },
  'varanasi': {
    name: 'Varanasi',
    state: 'Uttar Pradesh',
    description: 'Sell your old phone in Varanasi and get instant cash. We offer the best prices for used mobiles with free doorstep pickup across Varanasi, including Sigra, Lanka, Bhelupur, and all areas.',
    areas: ['Sigra', 'Lanka', 'Bhelupur', 'Cantonment', 'Luxa', 'Sarnath']
  },
  'lucknow': {
    name: 'Lucknow',
    state: 'Uttar Pradesh',
    description: 'Sell your old phone in Lucknow and get instant cash. We offer the best prices for used mobiles with free doorstep pickup across Lucknow, including Gomti Nagar, Hazratganj, Alambagh, and all areas.',
    areas: ['Gomti Nagar', 'Hazratganj', 'Alambagh', 'Indira Nagar', 'Aliganj', 'Mahanagar']
  },
  'kanpur': {
    name: 'Kanpur',
    state: 'Uttar Pradesh',
    description: 'Sell your old phone in Kanpur and get instant cash. We offer the best prices for used mobiles with free doorstep pickup across Kanpur, including Civil Lines, Kakadeo, Swaroop Nagar, and all areas.',
    areas: ['Civil Lines', 'Kakadeo', 'Swaroop Nagar', 'Kalyanpur', 'Armapur', 'Kidwai Nagar']
  },
  'chandigarh': {
    name: 'Chandigarh',
    state: 'Chandigarh',
    description: 'Sell your old phone in Chandigarh and get instant cash. We offer the best prices for used mobiles with free doorstep pickup across Chandigarh, including Sector 17, Sector 35, Panchkula, and all areas.',
    areas: ['Sector 17', 'Sector 35', 'Sector 22', 'Mohali', 'Panchkula', 'Sector 43']
  },
  'amritsar': {
    name: 'Amritsar',
    state: 'Punjab',
    description: 'Sell your old phone in Amritsar and get instant cash. We offer the best prices for used mobiles with free doorstep pickup across Amritsar, including Lawrence Road, Mall Road, Ranjit Avenue, and all areas.',
    areas: ['Lawrence Road', 'Mall Road', 'Ranjit Avenue', 'Chheharta', 'Majitha Road', 'Court Road']
  },
  'patna': {
    name: 'Patna',
    state: 'Bihar',
    description: 'Sell your old phone in Patna and get instant cash. We offer the best prices for used mobiles with free doorstep pickup across Patna, including Boring Road, Kankarbagh, Patliputra, and all areas.',
    areas: ['Boring Road', 'Kankarbagh', 'Patliputra', 'Rajendra Nagar', 'Danapur', 'Bailey Road']
  },
  'ludhiana': {
    name: 'Ludhiana',
    state: 'Punjab',
    description: 'Sell your old phone in Ludhiana and get instant cash. We offer the best prices for used mobiles with free doorstep pickup across Ludhiana, including Model Town, Civil Lines, Sarabha Nagar, and all areas.',
    areas: ['Model Town', 'Civil Lines', 'Sarabha Nagar', 'PAU', 'Dugri', 'Ferozepur Road']
  }
};

// ✅ Memoized Feature Card Component
const FeatureCard = memo(({ icon: Icon, title, description }: { icon: any; title: string; description: string }) => (
  <div className="hover:shadow-lg transition-shadow border border-blue-100 rounded-lg p-6 bg-white">
    <div className="text-center">
      <Icon className="w-12 h-12 mx-auto mb-4 text-blue-600" />
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  </div>
));

FeatureCard.displayName = 'FeatureCard';

// ✅ Memoized Step Component
const StepCard = memo(({ num, title, desc }: { num: string; title: string; desc: string }) => (
  <div className="text-center">
    <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
      {num}
    </div>
    <h3 className="font-semibold mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground">{desc}</p>
  </div>
));

StepCard.displayName = 'StepCard';

const CityLandingPage = () => {
  const location = useLocation();
  
  const { currentCity, citySlug } = useMemo(() => {
    const path = location.pathname;
    const slug = path.replace('/sell-phone-in-', '');
    const city = cityData[slug] || cityData['bangalore'];
    return { currentCity: city, citySlug: slug };
  }, [location.pathname]);

  const metaData = useMemo(() => ({
    title: `Sell Phone in ${currentCity.name} - Get Instant Cash | SellKar India`,
    description: currentCity.description,
    canonical: `https://www.sellkarindia.com/sell-phone-in-${citySlug}`
  }), [currentCity, citySlug]);

  return (
    <>
      <Helmet>
        <title>{metaData.title}</title>
        <meta name="description" content={metaData.description} />
        <link rel="canonical" href={metaData.canonical} />
        <meta property="og:title" content={metaData.title} />
        <meta property="og:description" content={metaData.description} />
        <meta property="og:url" content={metaData.canonical} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
          {`{"@context":"https://schema.org","@type":"LocalBusiness","name":"SellKar India - ${currentCity.name}","description":"${currentCity.description}","url":"${metaData.canonical}","areaServed":{"@type":"City","name":"${currentCity.name}","containedIn":"${currentCity.state}"},"priceRange":"₹₹","paymentAccepted":["Cash","UPI","Bank Transfer"],"currenciesAccepted":"INR"}`}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="container mx-auto px-4 py-16">
          
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Sell Your Phone in {currentCity. name}
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              {currentCity.description}
            </p>
            <Link to="/sell/mobiles">
              <Button size="lg" className="text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700 text-white">
                Get Instant Quote →
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <FeatureCard icon={Truck} title="Free Doorstep Pickup" description={`We pick up from anywhere in ${currentCity.name} - absolutely free!`} />
            <FeatureCard icon={IndianRupee} title="Best Price Guaranteed" description="Get the highest cash value for your old phone" />
            <FeatureCard icon={Clock} title="Instant Payment" description="Receive payment via UPI, bank transfer, or cash" />
            <FeatureCard icon={Shield} title="Safe & Secure" description="Complete data wiping and secure transaction" />
          </div>

          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works in {currentCity.name}</h2>
            <div className="grid md:grid-cols-4 gap-8">
              <StepCard num="1" title="Select Your Phone" desc="Choose your phone brand, model, and condition" />
              <StepCard num="2" title="Get Instant Quote" desc="See the exact price you'll get for your phone" />
              <StepCard num="3" title="Schedule Free Pickup" desc={`Choose a convenient time for pickup in ${currentCity.name}`} />
              <StepCard num="4" title="Get Paid Instantly" desc="Receive payment as soon as we verify your phone" />
            </div>
          </div>

          <div className="mb-16 border border-blue-100 rounded-lg p-6 bg-white">
            <h2 className="text-2xl font-bold mb-4">We Serve All Areas in {currentCity.name}</h2>
            <p className="text-gray-600 mb-4">
              Free doorstep pickup available across {currentCity.name}. No matter where you are in the city, we'll come to you to collect your old phone and pay you instantly.
            </p>
            <div className="flex flex-wrap gap-2">
              {currentCity.areas.map((area) => (
                <span key={area} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 rounded-full text-sm text-blue-700 border border-blue-200">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  {area}
                </span>
              ))}
            </div>
          </div>

          <div className="text-center bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-12 border border-blue-200">
            <h2 className="text-3xl font-bold mb-4 text-blue-900">Ready to Sell Your Phone in {currentCity.name}?</h2>
            <p className="text-xl text-gray-700 mb-8">Get an instant quote now and receive payment within 24 hours! </p>
            <Link to="/sell/mobiles">
              <Button size="lg" className="text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700 text-white">
                Start Selling Now →
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(CityLandingPage);