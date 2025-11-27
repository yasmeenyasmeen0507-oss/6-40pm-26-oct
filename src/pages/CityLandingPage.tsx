import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
    description: 'Sell your old phone in Jaipur and get instant cash.  We offer the best prices for used mobiles with free doorstep pickup across Jaipur, including Malviya Nagar, Vaishali Nagar, Mansarovar, and all areas.',
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
    description: 'Sell your old phone in Chandigarh and get instant cash.  We offer the best prices for used mobiles with free doorstep pickup across Chandigarh, including Sector 17, Sector 35, Panchkula, and all areas.',
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

const CityLandingPage = () => {
  const { city } = useParams<{ city: string }>();
  const currentCity = city ?  cityData[city] : cityData['bangalore'];

  if (!currentCity) {
    return <div>City not found</div>;
  }

  const pageTitle = `Sell Phone in ${currentCity.name} - Get Instant Cash | SellKar India`;
  const pageDescription = currentCity.description;
  const canonicalUrl = `https://www.sellkarindia.com/sell-phone-in-${city}`;

  return (
    <>
      {/* SEO Meta Tags */}
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        
        {/* Local Business Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": `SellKar India - ${currentCity.name}`,
            "description": pageDescription,
            "url": canonicalUrl,
            "areaServed": {
              "@type": "City",
              "name": currentCity. name,
              "containedIn": currentCity.state
            },
            "priceRange": "₹₹",
            "paymentAccepted": ["Cash", "UPI", "Bank Transfer"],
            "currenciesAccepted": "INR"
          })}
        </script>
      </Helmet>

      {/* Page Content */}
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4 py-16">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Sell Your Phone in {currentCity. name}
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              {currentCity.description}
            </p>
            <Link to="/sell/mobiles">
              <Button size="lg" className="text-lg px-8 py-6">
                Get Instant Quote →
              </Button>
            </Link>
          </div>

          {/* Features Section */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6 text-center">
                <Truck className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">Free Doorstep Pickup</h3>
                <p className="text-sm text-muted-foreground">
                  We pick up from anywhere in {currentCity.name} - absolutely free!
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6 text-center">
                <IndianRupee className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">Best Price Guaranteed</h3>
                <p className="text-sm text-muted-foreground">
                  Get the highest cash value for your old phone
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6 text-center">
                <Clock className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">Instant Payment</h3>
                <p className="text-sm text-muted-foreground">
                  Receive payment via UPI, bank transfer, or cash
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6 text-center">
                <Shield className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">Safe & Secure</h3>
                <p className="text-sm text-muted-foreground">
                  Complete data wiping and secure transaction
                </p>
              </CardContent>
            </Card>
          </div>

          {/* How It Works Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">
              How It Works in {currentCity.name}
            </h2>
            <div className="grid md:grid-cols-4 gap-8">
              {[
                { num: "1", title: "Select Your Phone", desc: "Choose your phone brand, model, and condition" },
                { num: "2", title: "Get Instant Quote", desc: "See the exact price you'll get for your phone" },
                { num: "3", title: "Schedule Free Pickup", desc: `Choose a convenient time for pickup in ${currentCity.name}` },
                { num: "4", title: "Get Paid Instantly", desc: "Receive payment as soon as we verify your phone" }
              ]. map((step) => (
                <div key={step.num} className="text-center">
                  <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    {step.num}
                  </div>
                  <h3 className="font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step. desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Service Areas */}
          <Card className="mb-16">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">
                We Serve All Areas in {currentCity.name}
              </h2>
              <p className="text-muted-foreground mb-4">
                Free doorstep pickup available across {currentCity.name}.  No matter where you are in the city, 
                we'll come to you to collect your old phone and pay you instantly.
              </p>
              <div className="flex flex-wrap gap-2">
                {currentCity.areas.map((area) => (
                  <span key={area} className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 rounded-full text-sm">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    {area}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-12">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Sell Your Phone in {currentCity.name}? 
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Get an instant quote now and receive payment within 24 hours! 
            </p>
            <Link to="/sell/mobiles">
              <Button size="lg" className="text-lg px-8 py-6">
                Start Selling Now →
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default CityLandingPage;