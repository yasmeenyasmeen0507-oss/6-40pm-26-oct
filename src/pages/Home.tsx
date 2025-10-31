import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Star, CheckCircle, Shield, Clock, IndianRupee, Calculator, Truck, CreditCard, MessageCircle, Phone, Mail, MapPin } from "lucide-react";
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

const TypingText = ({ text }: { text: string }) => {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text]);

  return (
    <span className="font-bold">
      {displayText}
      {currentIndex < text.length && (
        <span className="animate-pulse">|</span>
      )}
    </span>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const whatsappClick = () => {
    const message = "Hi! I'm interested in selling my gadget and would like to know more.";
    // UPDATED PHONE NUMBER
    const whatsappUrl = `https://wa.me/919620919351?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const steps = [
    {
      icon: Calculator,
      title: "Get a Quote",
      description: "Select your device and condition to receive an instant price estimate using our advanced evaluation system.",
      color: "text-blue-700",
      gradient: "from-blue-700/20 to-blue-700/5"
    },
    {
      icon: Truck,
      title: "Schedule Pickup",
      description: "Book a convenient time for our professional team to collect your device from your doorstep at no extra cost.",
      color: "text-gold",
      gradient: "from-gold/20 to-gold/5"
    },
    {
      icon: CreditCard,
      title: "Get Paid",
      description: "After quick inspection and verification, receive immediate payment via your preferred method - cash, bank transfer, or UPI.",
      color: "text-blue-700",
      gradient: "from-blue-700/20 to-blue-700/5"
    }
  ];

  return (
    <div className="min-h-screen bg-[#f5f0e8]">
      {/* Hero Section with Background Image */}
      <main className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero">
        <div className="absolute inset-0 z-0">
          <img 
            src="/assets/hero-gadgets.jpg"
            alt="Premium modern gadgets and electronics"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#f5f0e8]/70 to-[#f5f0e8]/40"></div>
        </div>

        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl float-animation"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-400/20 rounded-full blur-3xl float-animation" style={{animationDelay: '2s'}}></div>

        {/* MODIFICATION: Removed the "-mt-16" class to bring the content down and center it better. */}
        <div className="relative z-10 text-center max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
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
            
            <p className="text-xl sm:text-2xl lg:text-3xl text-black mb-4 font-light min-h-[2.5rem]">
              <TypingText text="Your Trusted Marketplace for Quality Electronics" />
            </p>
            
            <p className="text-lg text-black mb-12 max-w-2xl mx-auto">
              Get instant quotes, schedule convenient pickups, and receive immediate payment for your premium gadgets. 
              Professional, secure, and hassle-free.
            </p>

            <div className="flex justify-center">
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-12 py-6 rounded-lg font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105"
                onClick={scrollToCategories}
              >
                SELL NOW
              </Button>
            </div>

            <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}>
                <div className="text-3xl font-bold text-blue-600">10,000+</div>
                <div className="text-black">Devices Purchased</div>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }}>
                <div className="text-3xl font-bold text-blue-600">4.9★</div>
                <div className="text-black">Customer Rating</div>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.6 }}>
                <div className="text-3xl font-bold text-blue-600">24/7</div>
                <div className="text-black">Support Available</div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        <div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer"
          onClick={scrollToCategories}
        >
          <div className="w-6 h-10 border-2 border-blue-600/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-blue-600 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </main>

      {/* Categories Section */}
      <section id="categories-section" className="py-20 bg-[#faf7f2]">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in-scale">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              <span className="text-blue-700">Instant Price</span> Evaluation
            </h2>
            <p className="text-xl text-gray-900 max-w-2xl mx-auto">
              Get an accurate quote for your device in seconds. Our AI-powered
              evaluation system ensures you get the best price for your gadgets.
            </p>
          </div>

          <div className="card-premium max-w-3xl mx-auto">
            <div className="space-y-8">
              <h3 className="text-2xl font-semibold text-center text-gray-900 mb-8">
                What would you like to sell?
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}>
                  <Card className="cursor-pointer group hover:scale-105 transition-all duration-300 hover:ring-2 hover:ring-blue-700" onClick={() => handleCategoryClick("phone")}>
                    <CardContent className="p-6">
                      <div className="relative overflow-hidden rounded-xl mb-4">
                        <img src="/assets/ph.jpg" alt="Sell Phone" className="w-full h-40 object-contain object-center rounded-lg transition-transform duration-300 group-hover:scale-110" loading="lazy" />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                      <div className="text-center">
                        <h4 className="text-xl font-semibold text-foreground mb-2">Sell Phone</h4>
                        <p className="text-sm text-gray-900">Smartphones & Mobile Devices</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}>
                  <Card className="cursor-pointer group hover:scale-105 transition-all duration-300 hover:ring-2 hover:ring-blue-700" onClick={() => handleCategoryClick("laptop")}>
                    <CardContent className="p-6">
                      <div className="relative overflow-hidden rounded-xl mb-4">
                        <img src="/assets/laptopppp.jpg" alt="Sell Laptop" className="w-full h-40 object-contain object-center rounded-lg transition-transform duration-300 group-hover:scale-110" loading="lazy" />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                      <div className="text-center">
                        <h4 className="text-xl font-semibold text-foreground mb-2">Sell Laptop</h4>
                        <p className="text-sm text-gray-900">Laptops & Computers</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <div className="col-span-2 flex justify-center md:col-span-1 md:flex-none">
                  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3 }} className="w-full max-w-[15rem]">
                    <Card className="cursor-pointer group hover:scale-105 transition-all duration-300 hover:ring-2 hover:ring-blue-700" onClick={() => handleCategoryClick("ipad")}>
                      <CardContent className="p-6">
                        <div className="relative overflow-hidden rounded-xl mb-4">
                          <img src="/assets/ipaddd.jpg" alt="Sell iPad" className="w-full h-40 object-contain object-center rounded-lg transition-transform duration-300 group-hover:scale-110" loading="lazy" />
                          <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                        <div className="text-center">
                          <h4 className="text-xl font-semibold text-foreground mb-2">Sell iPad</h4>
                          <p className="text-sm text-gray-900">Tablets & iPads</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-[#f5f0e8]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in-scale">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              How <span className="text-blue-700">It Works</span>
            </h2>
            <p className="text-xl text-black max-w-3xl mx-auto">
              Our streamlined process makes selling your gadgets simple, secure, and hassle-free. 
              From quote to payment in just three easy steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: index * 0.2 }} className="relative">
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-border to-transparent z-0"></div>
                  )}
                  
                  <Card className="text-center relative z-10 group hover:shadow-2xl transition-all duration-300 bg-white border-2 hover:border-blue-700 cursor-pointer">
                    <CardContent className="p-8">
                      <div className="absolute -top-4 -left-4 w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                        {index + 1}
                      </div>
                      <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center transition-all duration-300 group-hover:scale-110`}>
                        <IconComponent className={`w-10 h-10 ${step.color}`} />
                      </div>
                      <h3 className="text-2xl font-semibold text-gray-900 mb-4">{step.title}</h3>
                      <p className="text-gray-700 leading-relaxed">{step.description}</p>
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-700/5 to-gold/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          <div className="text-center mt-16 animate-fade-in-scale">
            <p className="text-lg text-black mb-6">Ready to sell your device? Start the process now!</p>
            <Button onClick={scrollToCategories} className="bg-blue-700 hover:bg-blue-800 text-white px-10 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl">
              Get Started Today
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-[#faf7f2]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in-scale">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              What Our <span className="text-blue-700">Customers Say</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of satisfied customers who have trusted SellkarIndia for their device selling needs. 
              Real reviews from real customers across India.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-16">
            <motion.div className="text-center" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <div className="text-4xl font-bold text-blue-700 mb-2">4.9/5</div>
              <div className="text-black">Average Rating</div>
            </motion.div>
            <motion.div className="text-center" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}>
              <div className="text-4xl font-bold text-blue-700 mb-2">10,000+</div>
              <div className="text-black">Happy Customers</div>
            </motion.div>
            <motion.div className="text-center" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}>
              <div className="text-4xl font-bold text-blue-700 mb-2">₹50Cr+</div>
              <div className="text-black">Paid to Customers</div>
            </motion.div>
            <motion.div className="text-center" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3 }}>
              <div className="text-4xl font-bold text-blue-700 mb-2">25+</div>
              <div className="text-black">Cities Covered</div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((review, index) => (
              <motion.div key={review.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: index * 0.1 }} className="relative p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300">
                <div className="flex mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                <blockquote className="text-gray-700 mb-6 leading-relaxed">"{review.review_text}"</blockquote>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-blue-700 flex items-center justify-center text-white font-bold text-lg mr-4 border-2 border-blue-700">
                    {review.customer_name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{review.customer_name}</div>
                    <div className="text-sm text-gray-500">Sold {review.device_name}</div>
                    <div className="text-xs text-blue-700">{review.location}</div>
                  </div>
                </div>
                <div className="absolute top-4 right-4 text-6xl text-blue-700/10 font-serif">"</div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-16 animate-fade-in-scale">
            <p className="text-lg text-black mb-6">Ready to join our community of satisfied customers?</p>
            <Button onClick={scrollToCategories} className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 px-8 rounded-full transition duration-300">
              Start Selling Today
            </Button>
          </div>
        </div>
      </section>

      {/* Contact & Support Section */}
      <section id="contact" className="py-20 bg-[#f5f0e8]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in-scale">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              Contact <span className="text-blue-700">& Support</span>
            </h2>
            <p className="text-xl text-black max-w-3xl mx-auto">
              Have questions? Need assistance? Our dedicated support team is here to help you 24/7. 
              Get in touch through your preferred channel.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="animate-slide-in-up">
              <Card className="bg-white border-2">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-6">Send us a Message</h3>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input name="name" placeholder="Your Name" value={formData.name} onChange={handleInputChange} required className="border-2" />
                      <Input name="email" type="email" placeholder="Email Address" value={formData.email} onChange={handleInputChange} required className="border-2" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input name="phone" type="tel" placeholder="Phone Number" value={formData.phone} onChange={handleInputChange} required className="border-2" />
                      <Input name="subject" placeholder="Subject" value={formData.subject} onChange={handleInputChange} required className="border-2" />
                    </div>

                    <Textarea name="message" placeholder="Your Message" rows={5} value={formData.message} onChange={handleInputChange} required className="border-2 resize-none" />

                    <Button type="submit" className="w-full bg-blue-700 text-white hover:bg-blue-800 font-semibold">
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-8 animate-slide-in-up">
              <Card className="bg-white border-2">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-6">Quick Contact</h3>
                  
                  <div className="space-y-4">
                    <button onClick={whatsappClick} className="w-full flex items-center p-4 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl hover:from-green-700 hover:to-green-600 transition-all duration-300 hover:scale-[1.02] shadow-lg">
                      <MessageCircle className="w-6 h-6 mr-3" />
                      <div className="text-left">
                        <div className="font-semibold">WhatsApp Chat</div>
                        <div className="text-sm opacity-90">Get instant support</div>
                      </div>
                    </button>

                    <div className="flex items-center p-4 bg-gray-50 rounded-xl border-2">
                      <Phone className="w-6 h-6 text-blue-700 mr-3" />
                      <div>
                        <div className="font-semibold text-gray-900">Call Us</div>
                        {/* UPDATED PHONE NUMBER */}
                        <div className="text-blue-700">+91 96209 19351</div>
                      </div>
                    </div>

                    {/* REMOVED EMAIL SUPPORT BLOCK HERE */}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-2">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-6">Business Info</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <MapPin className="w-6 h-6 text-blue-700 mr-3 mt-1" />
                      <div>
                        <div className="font-semibold text-gray-900">Headquarters</div>
                        <div className="text-gray-700">Tech Hub, Koramangala<br />Bangalore, Karnataka 560034</div>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Clock className="w-6 h-6 text-blue-700 mr-3 mt-1" />
                      <div>
                        <div className="font-semibold text-gray-900">Business Hours</div>
                        <div className="text-gray-700">Monday - Sunday: 9:00 AM - 9:00 PM<br />Emergency Support: 24/7</div>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Shield className="w-6 h-6 text-blue-700 mr-3 mt-1" />
                      <div>
                        <div className="font-semibold text-gray-900">Service Coverage</div>
                        <div className="text-gray-700">25+ Cities across India<br />Free pickup & delivery</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-2">
                <CardContent className="p-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Why Choose Our Support?</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center text-gray-700">
                      <div className="w-2 h-2 bg-blue-700 rounded-full mr-3"></div>
                      24/7 Customer Support Available
                    </div>
                    <div className="flex items-center text-gray-700">
                      <div className="w-2 h-2 bg-gold rounded-full mr-3"></div>
                      Average Response Time: Under 30 minutes
                    </div>
                    <div className="flex items-center text-gray-700">
                      <div className="w-2 h-2 bg-blue-700 rounded-full mr-3"></div>
                      Multilingual Support (Hindi, English)
                    </div>
                    <div className="flex items-center text-gray-700">
                      <div className="w-2 h-2 bg-gold rounded-full mr-3"></div>
                      Dedicated Account Managers for High-Value Sales
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
