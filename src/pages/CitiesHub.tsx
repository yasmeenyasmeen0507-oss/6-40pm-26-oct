import { Helmet } from "react-helmet-async";
import { CheckCircle, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const cities = [
  { name: "Bangalore", state: "Karnataka", slug: "bangalore" },
  { name: "Hyderabad", state: "Telangana", slug: "hyderabad" },
  { name: "Mumbai", state: "Maharashtra", slug: "mumbai" },
  { name: "Delhi", state: "Delhi NCR", slug: "delhi" },
  { name: "Chennai", state: "Tamil Nadu", slug: "chennai" },
  { name: "Pune", state: "Maharashtra", slug: "pune" },
  { name: "Kolkata", state: "West Bengal", slug: "kolkata" },
  { name: "Jaipur", state: "Rajasthan", slug: "jaipur" },
  { name: "Lucknow", state: "Uttar Pradesh", slug: "lucknow" },
  { name: "Kanpur", state: "Uttar Pradesh", slug: "kanpur" },
  { name: "Varanasi", state: "Uttar Pradesh", slug: "varanasi" },
  { name: "Agra", state: "Uttar Pradesh", slug: "agra" },
  { name: "Thane", state: "Maharashtra", slug: "thane" },
  { name: "Chandigarh", state: "Chandigarh", slug: "chandigarh" },
  { name: "Amritsar", state: "Punjab", slug: "amritsar" },
  { name: "Ludhiana", state: "Punjab", slug: "ludhiana" },
  { name: "Patna", state: "Bihar", slug: "patna" },
  { name: "Gorakhpur", state: "Uttar Pradesh", slug: "gorakhpur" },
  { name: "Mathura", state: "Uttar Pradesh", slug: "mathura" },
];

const CitiesHub = () => {
  return (
    <>
      <Helmet>
        <title>Cities We Serve | Sell Old Phones Across India | SellKar India</title>
        <meta 
          name="description" 
          content="SellKar India offers free doorstep pickup and instant cash for old phones across 19+ major cities in India. Find your city and sell your phone today with guaranteed best prices." 
        />
        <meta name="robots" content="index,follow" />
        <link rel="canonical" href="https://www.sellkarindia.com/cities" />
        <meta property="og:title" content="Cities We Serve | Sell Old Phones Across India" />
        <meta property="og:description" content="Free doorstep pickup and instant cash for old phones in 19+ cities across India." />
        <meta property="og:url" content="https://www.sellkarindia.com/cities" />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex items-center justify-center gap-2 mb-6">
                <MapPin className="w-10 h-10" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Cities We Serve Across India
              </h1>
              <p className="text-xl mb-8 opacity-90">
                Get instant cash for your old phones, laptops, and tablets with free doorstep pickup in 19+ major cities across India.  Professional service, transparent pricing, and same-day payment guaranteed.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/sell/mobiles">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                    Get Instant Quote →
                  </Button>
                </Link>
                <a href="tel:7411329292">
                  <Button 
                    size="lg" 
                    className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 transition-all duration-300"
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    Call: 7411329292
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-white border-b">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto text-center">
              <div>
                <div className="text-4xl font-bold text-blue-600 mb-2">19+</div>
                <div className="text-gray-600">Cities Covered</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-600 mb-2">10,000+</div>
                <div className="text-gray-600">Devices Purchased</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-600 mb-2">4. 9★</div>
                <div className="text-gray-600">Customer Rating</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-600 mb-2">24/7</div>
                <div className="text-gray-600">Support Available</div>
              </div>
            </div>
          </div>
        </section>

        {/* Cities Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-4 text-gray-900">
                Select Your City
              </h2>
              <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
                Choose your city below to get instant pricing, schedule free doorstep pickup, and receive payment within 24 hours.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cities.map((city) => (
                  <a
                    key={city.slug}
                    href={`/sell-phone-in-${city. slug}`}
                    className="group bg-white border-2 border-blue-100 rounded-xl p-6 hover:border-blue-600 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="flex items-start gap-4">
                      <div className="bg-blue-100 p-3 rounded-lg group-hover:bg-blue-600 transition-colors">
                        <CheckCircle className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                          {city. name}
                        </h3>
                        <p className="text-sm text-gray-500 mb-3">{city. state}</p>
                        <p className="text-sm text-gray-700">
                          Sell Old Phones in {city. name}
                        </p>
                        <div className="mt-3 text-blue-600 font-medium flex items-center gap-2 group-hover:gap-3 transition-all">
                          Get Started
                          <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                        </div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
                Why Choose SellKar India?
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Free Doorstep Pickup</h3>
                  <p className="text-gray-600">
                    No need to visit any store. We come to your location at your convenient time.
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Instant Cash Payment</h3>
                  <p className="text-gray-600">
                    Get paid immediately after device verification via cash, UPI, or bank transfer.
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Best Market Price</h3>
                  <p className="text-gray-600">
                    Transparent pricing based on real market value with no hidden charges.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Sell Your Phone? 
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Get an instant quote now and schedule your free doorstep pickup in any of our service cities.
              </p>
              <Link to="/sell/mobiles">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-10 py-6">
                  Start Selling Now →
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default CitiesHub;
