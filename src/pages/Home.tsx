import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Star, Calculator, Truck, CreditCard, MessageCircle, Phone, MapPin, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Footer from "@/components/Footer";
import FallingConfetti from "@/components/FallingConfetti";
import IndianFlag from "@/components/IndianFlag";
import AshokaChakra from "@/components/AshokaChakra";
import PatrioticBadge from "@/components/PatrioticBadge";
import NewYearParticles from "@/components/NewYearParticles";
import NewYearGlowBadge from "@/components/NewYearGlowBadge";

interface Review {
  id: string;
  customer_name: string;
  device_name: string;
  rating: number;
  review_text: string;
  location: string;
}

// ==================== TYPING TEXT COMPONENT ====================
interface TypingTextProps {
  text: string;
  speed?: number;
  className?: string;
}

const TypingText = ({ text, speed = 40, className = "" }: TypingTextProps) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);

  return (
    <span className={className}>
      {displayedText}
      {currentIndex < text.length && (
        <span className="animate-pulse text-gold">|</span>
      )}
    </span>
  );
};

const PHONE_NUMBER = "7411329292";
const WHATSAPP_NUMBER = "7411329292";
const WHATSAPP_MESSAGE = "Hi!  I'm interested in selling my gadget and would like to know more.  ";
const LOCATION_ADDRESS = "22, 2nd floor, Kothanur, Behind MCS Convention Hall, K Narayanapura Main Rd, Bengaluru, Nagareshwara - Nagenahalli, Karnataka 560077";

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
    const routes = {
      phone: "/sell/mobiles",
      laptop: "/sell/laptop",
      ipad: "/sell/ipad"
    };
    navigate(routes[category]);
  };

  const scrollToCategories = () => {
    document.getElementById('categories-section')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const whatsappClick = () => {
    const whatsappUrl = `https://wa.me/91${WHATSAPP_NUMBER}? text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
    window.open(whatsappUrl, '_blank');
  };

  const callUsClick = () => {
    window.open(`tel:${PHONE_NUMBER}`, '_self');
  };

  const steps = [
    {
      icon: Calculator,
      title: "Get a Quote",
      description: "Select your device and condition to receive an instant price estimate using our advanced evaluation system.",
      gradient: "from-primary/20 to-primary/5"
    },
    {
      icon: Truck,
      title: "Schedule Pickup",
      description: "Book a convenient time for our professional team to collect your device from your doorstep at no extra cost.",
      gradient: "from-accent/20 to-accent/5"
    },
    {
      icon: CreditCard,
      title: "Get Paid",
      description: "After quick inspection and verification, receive immediate payment via your preferred method - cash, bank transfer, or UPI.",
      gradient: "from-primary/20 to-primary/5"
    }
  ];

  return (
    <div className="min-h-screen bg-[#f5f0e8]">
      {/* ==================== REPUBLIC DAY 2026 HERO SECTION ==================== */}
      <main className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url("/assets/republic-day-bg.jpg")' }}
        >
          {/* Overlays for readability */}
          <div className="absolute inset-0 bg-white/30" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-white/70" />
        </div>

        {/* Falling Confetti */}
        <FallingConfetti />

        {/* Decorative Floating Flags */}
        <motion.div
          className="absolute top-20 left-[10%] opacity-80 hidden md:block"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 0.8, x: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <IndianFlag size="md" waving />
        </motion.div>

        <motion.div
          className="absolute top-20 right-[10%] opacity-80 hidden md:block"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 0.8, x: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          <IndianFlag size="md" waving />
        </motion.div>

        {/* Decorative Floating Chakras */}
        <motion.div
          className="absolute top-40 left-[20%] opacity-20 hidden lg:block"
          animate={{ y: [0, -15, 0], rotate: 360 }}
          transition={{
            y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 20, repeat: Infinity, ease: "linear" }
          }}
        >
          <AshokaChakra size={80} />
        </motion.div>

        <motion.div
          className="absolute bottom-40 right-[15%] opacity-20 hidden lg:block"
          animate={{ y: [0, -20, 0], rotate: -360 }}
          transition={{
            y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 },
            rotate: { duration: 25, repeat: Infinity, ease: "linear" }
          }}
        >
          <AshokaChakra size={100} />
        </motion.div>

        {/* Main Content */}
        <div className="relative z-20 text-center max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10 flex flex-col items-center justify-center min-h-[80vh]">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8"
          >
            {/* Main Title: SELLKAR */}
            <h1 className="font-serif font-black text-5xl md:text-7xl tracking-wider text-[#1e3a8a] mb-2 drop-shadow-lg">
              SELLKAR
            </h1>

            {/* Subtitle: INDIA with lines */}
            <div className="flex items-center justify-center gap-4">
              <div className="h-[2px] w-12 md:w-20 bg-[#FF9933]" /> {/* Saffron Line */}
              <span className="font-serif text-xl md:text-2xl font-bold text-[#1e3a8a] tracking-[0.3em]">
                INDIA
              </span>
              <div className="h-[2px] w-12 md:w-20 bg-[#138808]" /> {/* Green Line */}
            </div>
          </motion.div>

          {/* Republic Day Greeting */}
          <motion.div
            className="flex items-center gap-3 mb-6 bg-white/40 backdrop-blur-sm px-6 py-2 rounded-full border border-white/50 shadow-sm"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <AshokaChakra size={28} className="text-[#1e3a8a]" />
            <h2 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-[#FF9933] via-[#1e3a8a] to-[#138808] bg-clip-text text-transparent">
              Happy Republic Day 2026!
            </h2>
            <AshokaChakra size={28} className="text-[#1e3a8a]" />
          </motion.div>

          {/* Tagline */}
          <motion.h3
            className="text-xl md:text-3xl font-bold text-[#1e293b] mb-6 drop-shadow-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Celebrate with Pride – Sell Smart!
          </motion.h3>

          {/* Description */}
          <motion.p
            className="text-lg md:text-xl mb-10 max-w-2xl mx-auto font-bold text-gray-900 leading-relaxed drop-shadow-sm bg-white/10 p-4 rounded-xl backdrop-blur-[2px]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            This Republic Day, turn your old gadgets into instant cash! Get the best prices, hassle-free pickup, and celebrate freedom with extra money in your pocket.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Button
              className="text-white text-lg px-12 py-6 rounded-lg font-bold shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-[#1e3a8a]/50 border-2 border-[#1e3a8a]/20"
              style={{
                backgroundColor: '#1e3a8a',
              }}
              onClick={scrollToCategories}
            >
              SELL NOW
            </Button>
          </motion.div>

          {/* Bottom Badge */}
          <motion.div
            className="mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <PatrioticBadge>
              <span className="flex items-center gap-2">
                <Star className="w-4 h-4 text-[#FF9933] fill-[#FF9933]" />
                <span className="text-sm md:text-base font-bold text-[#1e3a8a]">Celebrate 26th January – Republic Day Special Deals!</span>
                <Star className="w-4 h-4 text-[#138808] fill-[#138808]" />
              </span>
            </PatrioticBadge>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer z-30"
          onClick={scrollToCategories}
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 rounded-full flex justify-center border-[#FF9933]">
            <motion.div
              className="w-1 h-3 rounded-full mt-2 bg-gradient-to-b from-[#FF9933] via-[#1e3a8a] to-[#138808]"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>

        {/* Tricolor Bottom Border */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-4 flex z-30"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <div className="flex-1 bg-[#FF9933]" />
          <div className="flex-1 bg-white relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <AshokaChakra size={20} animate={true} />
            </div>
          </div>
          <div className="flex-1 bg-[#138808]" />
        </motion.div>
      </main>

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
                  <Card className="cursor-pointer group hover:scale-105 transition-all duration-300 hover:ring-2 hover: ring-blue-700" onClick={() => handleCategoryClick("laptop")}>
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

      <section className="py-16 bg-gradient-to-br from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
              Sell Your Phone in <span className="text-blue-700">Major Cities</span>
            </h2>
            <p className="text-center text-gray-700 mb-8 max-w-2xl mx-auto text-lg">
              Get instant cash with free home pickup in your city
            </p>
            <div className="flex flex-wrap justify-center gap-6 max-w-3xl mx-auto">
              <a
                href="/sell-phone-in-bangalore"
                className="inline-flex items-center gap-2 text-lg text-blue-600 hover:text-blue-800 hover:underline transition-colors font-medium"
              >
                <CheckCircle className="w-5 h-5" />
                Sell Old Phones in Bangalore
              </a>
              <span className="text-gray-300 text-2xl">|</span>
              <a
                href="/sell-phone-in-hyderabad"
                className="inline-flex items-center gap-2 text-lg text-blue-600 hover: text-blue-800 hover: underline transition-colors font-medium"
              >
                <CheckCircle className="w-5 h-5" />
                Sell Old Phones in Hyderabad
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-[#f5f0e8]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in-scale">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              How <span className="text-blue-700">It Works</span>
            </h2>
            <p className="text-xl text-black max-w-3xl mx-auto">
              Our streamlined process makes selling your gadgets simple, secure, and hassle-free. From quote to payment in just three easy steps.
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
                        <IconComponent className="w-10 h-10 text-blue-700" />
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

      <section className="py-20 bg-[#faf7f2]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in-scale">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              What Our <span className="text-blue-700">Customers Say</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of satisfied customers who have trusted SellkarIndia for their device selling needs. Real reviews from real customers across India.
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

          <div className="grid grid-cols-1 md: grid-cols-2 lg:grid-cols-3 gap-8">
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
            <p className="text-lg text-black mb-6">Ready to join our community of satisfied customers? </p>
            <Button onClick={scrollToCategories} className="bg-blue-700 hover: bg-blue-800 text-white font-semibold py-3 px-8 rounded-full transition duration-300">
              Start Selling Today
            </Button>
          </div>
        </div>
      </section>

      <section id="contact" className="py-20 bg-[#f5f0e8]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in-scale">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              Contact <span className="text-blue-700">& Support</span>
            </h2>
            <p className="text-xl text-black max-w-3xl mx-auto">
              Have questions?  Need assistance? Our dedicated support team is here to help you 24/7. Get in touch through your preferred channel.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="hidden lg:block"></div>

            <div className="space-y-8 animate-slide-in-up">
              <Card className="bg-white border-2">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-6">Quick Contact</h3>

                  <div className="space-y-4">
                    <button
                      onClick={whatsappClick}
                      className="w-full flex items-center p-4 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl hover:from-green-700 hover:to-green-600 transition-all duration-300 hover:scale-[1.02] shadow-lg"
                    >
                      <MessageCircle className="w-6 h-6 mr-3" />
                      <div className="text-left">
                        <div className="font-semibold">WhatsApp Chat</div>
                        <div className="text-sm opacity-90">Get instant support</div>
                      </div>
                    </button>

                    <button
                      onClick={callUsClick}
                      className="flex items-center w-full p-4 bg-gray-50 rounded-xl border-2 hover:bg-blue-50 transition"
                    >
                      <Phone className="w-6 h-6 text-blue-700 mr-3" />
                      <div>
                        <div className="font-semibold text-gray-900">Call Us</div>
                        <div className="text-blue-700">+91 {PHONE_NUMBER}</div>
                      </div>
                    </button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-2">
                <CardContent className="p-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-blue-700" />
                    Location
                  </h4>
                  <p className="text-sm text-gray-700 leading-relaxed">{LOCATION_ADDRESS}</p>
                </CardContent>
              </Card>

              <Card className="bg-white border-2">
                <CardContent className="p-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Why Choose Our Support? </h4>
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
                      Multilingual Support (Hindi, English, Kannada, Malayalam)
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

      {/* Add snowfall animation to global styles */}
      <style>{`
        @keyframes snowfall {
          0% {
            transform: translateY(-10vh) translateX(0);
          }
          100% {
            transform: translateY(100vh) translateX(100px);
          }
        }
      `}</style>
    </div>
  );
};

export default Home;
