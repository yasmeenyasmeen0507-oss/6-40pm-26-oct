import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Smartphone, Laptop, Tablet, ArrowRight, Star, CheckCircle, TrendingUp, Shield, Clock, IndianRupee } from "lucide-react";
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/95 border-b border-border/50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-xl">
              <Smartphone className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              SellkarIndia
            </span>
          </div>
          <Button
            onClick={() => navigate("/sell")}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
          >
            Sell Now
          </Button>
        </div>
      </header>

      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white">
        <div className="absolute inset-0 bg-grid-white/10 bg-[size:30px_30px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 to-transparent" />

        <div className="container relative mx-auto px-4 py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Sell Your Gadgets
              <br />
              <span className="text-blue-200">Get Instant Cash</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-2xl mx-auto">
              India's most trusted platform to sell old phones, laptops, and tablets. Get the best price with instant payment and free doorstep pickup.
            </p>
            <Button
              size="lg"
              onClick={() => navigate("/sell")}
              className="bg-white text-blue-700 hover:bg-blue-50 text-lg px-8 py-6 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105"
            >
              Start Selling Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>

            <div className="grid grid-cols-3 gap-6 mt-16 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2">50K+</div>
                <div className="text-blue-200 text-sm md:text-base">Devices Sold</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2">4.8★</div>
                <div className="text-blue-200 text-sm md:text-base">Customer Rating</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2">24Hrs</div>
                <div className="text-blue-200 text-sm md:text-base">Quick Payment</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">What Would You Like to Sell?</h2>
            <p className="text-xl text-muted-foreground">Choose your device category and get instant valuation</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card
                className="group cursor-pointer hover:shadow-2xl transition-all duration-300 border-2 hover:border-blue-500 overflow-hidden"
                onClick={() => handleCategoryClick("phone")}
              >
                <CardContent className="p-8 text-center">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Smartphone className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Phones</h3>
                  <p className="text-muted-foreground mb-4">iPhone, Samsung, OnePlus & more</p>
                  <p className="text-sm font-semibold text-blue-600">Starting from ₹5,000</p>
                  <Button variant="ghost" className="mt-4 group-hover:bg-blue-50">
                    Sell Phone <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card
                className="group cursor-pointer hover:shadow-2xl transition-all duration-300 border-2 hover:border-green-500 overflow-hidden"
                onClick={() => handleCategoryClick("laptop")}
              >
                <CardContent className="p-8 text-center">
                  <div className="bg-gradient-to-br from-green-500 to-green-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Laptop className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Laptops</h3>
                  <p className="text-muted-foreground mb-4">MacBook, Dell, HP, Lenovo & more</p>
                  <p className="text-sm font-semibold text-green-600">Starting from ₹15,000</p>
                  <Button variant="ghost" className="mt-4 group-hover:bg-green-50">
                    Sell Laptop <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card
                className="group cursor-pointer hover:shadow-2xl transition-all duration-300 border-2 hover:border-orange-500 overflow-hidden"
                onClick={() => handleCategoryClick("ipad")}
              >
                <CardContent className="p-8 text-center">
                  <div className="bg-gradient-to-br from-orange-500 to-orange-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Tablet className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Tablets</h3>
                  <p className="text-muted-foreground mb-4">iPad Pro, iPad Air & more</p>
                  <p className="text-sm font-semibold text-orange-600">Starting from ₹10,000</p>
                  <Button variant="ghost" className="mt-4 group-hover:bg-orange-50">
                    Sell Tablet <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Why Choose SellkarIndia?</h2>
            <p className="text-xl text-muted-foreground">Trusted by thousands of happy customers across India</p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card className="text-center p-6 hover:shadow-lg transition-shadow">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <IndianRupee className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold mb-2">Best Prices</h3>
                <p className="text-sm text-muted-foreground">Get the highest market value for your devices</p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="text-center p-6 hover:shadow-lg transition-shadow">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-bold mb-2">Instant Payment</h3>
                <p className="text-sm text-muted-foreground">Get paid immediately after device verification</p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="text-center p-6 hover:shadow-lg transition-shadow">
                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-lg font-bold mb-2">Free Pickup</h3>
                <p className="text-sm text-muted-foreground">Convenient doorstep pickup at your chosen time</p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="text-center p-6 hover:shadow-lg transition-shadow">
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-lg font-bold mb-2">Safe & Secure</h3>
                <p className="text-sm text-muted-foreground">Complete data security and hassle-free process</p>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">What Our Customers Say</h2>
            <p className="text-xl text-muted-foreground">Real experiences from real people</p>
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
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-4 italic">"{review.review_text}"</p>
                    <div className="border-t pt-4">
                      <p className="font-semibold">{review.customer_name}</p>
                      <p className="text-sm text-muted-foreground">Sold {review.device_name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{review.location}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-blue-600 to-blue-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Ready to Sell Your Device?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers and get the best value for your gadgets today
            </p>
            <Button
              size="lg"
              onClick={() => navigate("/sell")}
              className="bg-white text-blue-700 hover:bg-blue-50 text-lg px-8 py-6 rounded-full shadow-2xl"
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
