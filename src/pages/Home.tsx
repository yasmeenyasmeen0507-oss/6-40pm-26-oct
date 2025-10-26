import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Star, CheckCircle, Shield, Clock, IndianRupee } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Footer from "@/components/Footer";

interface Review {
  id: string;
  customer_name: string;
  device_name: string;
  rating: number;
  review_text: string;
  location: string;
}

const Home = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("is_featured", true)
      .order("created_at", { ascending: false })
      .limit(6);

    if (!error && data) {
      setReviews(data);
    }
  };

  const handleCategoryClick = (category: "phone" | "laptop" | "ipad") => {
    navigate("/sell", { state: { category } });
  };

  const scrollToCategories = () => {
    document.getElementById('categories-section')?.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Full Height without Navbar */}
      <main className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
        {/* Floating Orbs for Visual Appeal */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-400/20 rounded-full blur-3xl animate-float-delayed"></div>

        {/* Hero Content */}
        <div className="relative z-10 text-center max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            {/* Main Heading */}
            <h1 className="font-extrabold mb-8">
              <span className="block text-5xl sm:text-6xl lg:text-7xl text-blue-600 leading-tight">
                SELLKAR
              </span>
              <span className="flex items-center justify-center mt-4">
                <span className="block flex-1 h-0.5 bg-gradient-to-r from-transparent via-blue-600 to-blue-600"></span>
                <span className="text-2xl sm:text-3xl lg:text-4xl text-blue-600 leading-none px-6">
                  INDIA
                </span>
                <span className="block flex-1 h-0.5 bg-gradient-to-l from-transparent via-blue-600 to-blue-600"></span>
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl lg:text-3xl text-gray-900 mb-4 font-light">
              Your Trusted Marketplace for Quality Electronics
            </p>
            
            <p className="text-lg text-gray-700 mb-12 max-w-2xl mx-auto">
              Get instant quotes, schedule convenient pickups, and receive immediate payment for your premium gadgets. 
              Professional, secure, and hassle-free.
            </p>

            <div className="flex justify-center">
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-12 py-6 rounded-lg font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 animate-pulse-glow"
                onClick={scrollToCategories}
              >
                SELL NOW
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <div className="text-3xl font-bold text-blue-600">10,000+</div>
                <div className="text-gray-700">Devices Purchased</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <div className="text-3xl font-bold text-blue-600">4.9★</div>
                <div className="text-gray-700">Customer Rating</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <div className="text-3xl font-bold text-blue-600">24/7</div>
                <div className="text-gray-700">Support Available</div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer"
          onClick={scrollToCategories}
        >
          <div className="w-6 h-10 border-2 border-blue-600/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-blue-600 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </main>

      {/* Categories Section with Images from public/assets */}
      <section id="categories-section" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">What Would You Like to Sell?</h2>
            <p className="text-xl text-gray-600">Choose your device category and get instant valuation</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Phone Card with Image from public/assets */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card
                className="group cursor-pointer hover:shadow-2xl transition-all duration-300 border-2 hover:border-blue-500 overflow-hidden bg-gradient-to-br from-blue-50 to-white"
                onClick={() => handleCategoryClick("phone")}
              >
                <CardContent className="p-8 text-center">
                  {/* Phone Image from public/assets */}
                  <div className="w-32 h-32 mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <img 
                      src="/assets/phone.png" 
                      alt="Sell Phone"
                      className="w-full h-full object-contain drop-shadow-lg"
                    />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-gray-900">Phones</h3>
                  <p className="text-gray-600 mb-4">iPhone, Samsung, OnePlus & more</p>
                  <p className="text-sm font-semibold text-blue-600">Starting from ₹5,000</p>
                  <Button variant="ghost" className="mt-4 group-hover:bg-blue-50 text-gray-700">
                    Sell Phone <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Laptop Card with Image from public/assets */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card
                className="group cursor-pointer hover:shadow-2xl transition-all duration-300 border-2 hover:border-green-500 overflow-hidden bg-gradient-to-br from-green-50 to-white"
                onClick={() => handleCategoryClick("laptop")}
              >
                <CardContent className="p-8 text-center">
                  {/* Laptop Image from public/assets */}
                  <div className="w-32 h-32 mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <img 
                      src="/assets/laptop.png" 
                      alt="Sell Laptop"
                      className="w-full h-full object-contain drop-shadow-lg"
                    />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-gray-900">Laptops</h3>
                  <p className="text-gray-600 mb-4">MacBook, Dell, HP, Lenovo & more</p>
                  <p className="text-sm font-semibold text-green-600">Starting from ₹15,000</p>
                  <Button variant="ghost" className="mt-4 group-hover:bg-green-50 text-gray-700">
                    Sell Laptop <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Tablet Card with Image from public/assets */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card
                className="group cursor-pointer hover:shadow-2xl transition-all duration-300 border-2 hover:border-orange-500 overflow-hidden bg-gradient-to-br from-orange-50 to-white"
                onClick={() => handleCategoryClick("ipad")}
              >
                <CardContent className="p-8 text-center">
                  {/* Tablet Image from public/assets */}
                  <div className="w-32 h-32 mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <img 
                      src="/assets/tablet.png" 
                      alt="Sell Tablet"
                      className="w-full h-full object-contain drop-shadow-lg"
                    />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-gray-900">Tablets</h3>
                  <p className="text-gray-600 mb-4">iPad Pro, iPad Air & more</p>
                  <p className="text-sm font-semibold text-orange-600">Starting from ₹10,000</p>
                  <Button variant="ghost" className="mt-4 group-hover:bg-orange-50 text-gray-700">
                    Sell Tablet <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">Why Choose SellkarIndia?</h2>
            <p className="text-xl text-gray-600">Trusted by thousands of happy customers across India</p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card className="text-center p-6 hover:shadow-xl transition-shadow bg-white border-2 hover:border-blue-200">
                <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <IndianRupee className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-900">Best Prices</h3>
                <p className="text-sm text-gray-600">Get the highest market value for your devices</p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="text-center p-6 hover:shadow-xl transition-shadow bg-white border-2 hover:border-green-200">
                <div className="bg-green-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-900">Instant Payment</h3>
                <p className="text-sm text-gray-600">Get paid immediately after device verification</p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="text-center p-6 hover:shadow-xl transition-shadow bg-white border-2 hover:border-orange-200">
                <div className="bg-orange-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-900">Free Pickup</h3>
                <p className="text-sm text-gray-600">Convenient doorstep pickup at your chosen time</p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="text-center p-6 hover:shadow-xl transition-shadow bg-white border-2 hover:border-red-200">
                <div className="bg-red-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-900">Safe & Secure</h3>
                <p className="text-sm text-gray-600">Complete data security and hassle-free process</p>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">What Our Customers Say</h2>
            <p className="text-xl text-gray-600">Real experiences from real people</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {reviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-xl transition-shadow bg-white border-2">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-700 mb-4 italic">"{review.review_text}"</p>
                    <div className="border-t pt-4">
                      <p className="font-semibold text-gray-900">{review.customer_name}</p>
                      <p className="text-sm text-gray-600">Sold {review.device_name}</p>
                      <p className="text-xs text-gray-500 mt-1">{review.location}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Ready to Sell Your Device?</h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers and get the best value for your gadgets today
            </p>
            <Button
              size="lg"
              onClick={scrollToCategories}
              className="bg-white text-blue-700 hover:bg-gray-100 text-lg px-10 py-7 rounded-2xl shadow-2xl font-semibold"
            >
              Get Started Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;