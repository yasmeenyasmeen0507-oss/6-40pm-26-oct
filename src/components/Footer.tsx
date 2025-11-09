import { Smartphone, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  // WhatsApp link with pre-filled message
  const whatsappNumber = "917411329292";
  const whatsappMessage = "Hi, SellkarIndia. I am interested in partnership with you.";
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
        {/* Main Footer Content */}
        <div className="mb-8">
          {/* First Column: Logo and Tagline */}
          <div className="text-center sm:text-left mb-6">
            <div className="flex items-center gap-2 mb-4 justify-center sm:justify-start">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-lg">
                <Smartphone className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="text-xl sm:text-2xl font-bold text-white">SellkarIndia</span>
            </div>
            <p className="text-xs sm:text-sm mb-4 max-w-xs mx-auto sm:mx-0">
              India's most trusted platform for selling old phones, laptops, and tablets. Get instant cash with doorstep pickup.
            </p>
          </div>

          {/* Desktop Grid Layout */}
          <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {/* Second Column: Quick Links */}
            <div>
              <h3 className="text-white font-bold text-base sm:text-lg mb-3 sm:mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link 
                    to="/how-it-works" 
                    className="text-sm hover:text-white transition-colors inline-block"
                  >
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/pricing" 
                    className="text-sm hover:text-white transition-colors inline-block"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/about" 
                    className="text-sm hover:text-white transition-colors inline-block"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <a 
                    href="#contact" 
                    className="text-sm hover:text-white transition-colors inline-block"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Third Column: Categories */}
            <div>
              <h3 className="text-white font-bold text-base sm:text-lg mb-3 sm:mb-4">Categories</h3>
              <ul className="space-y-2">
                <li>
                  <Link 
                    to="/sell/mobiles" 
                    className="text-sm hover:text-white transition-colors inline-block"
                  >
                    Sell Phone
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/sell/laptop" 
                    className="text-sm hover:text-white transition-colors inline-block"
                  >
                    Sell Laptop
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/sell/ipad" 
                    className="text-sm hover:text-white transition-colors inline-block"
                  >
                    Sell Tablet
                  </Link>
                </li>
              </ul>
            </div>

            {/* Fourth Column: More Info */}
            <div>
              <h3 className="text-white font-bold text-base sm:text-lg mb-3 sm:mb-4">More Info</h3>
              <ul className="space-y-2">
                <li>
                  <Link 
                    to="/terms-and-conditions" 
                    className="text-sm hover:text-white transition-colors inline-block"
                  >
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/privacy-policy" 
                    className="text-sm hover:text-white transition-colors inline-block"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <a 
                    href={whatsappLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm hover:text-white transition-colors inline-block"
                  >
                    Become a Partner
                  </a>
                </li>
              </ul>
            </div>

            {/* Empty placeholder */}
            <div className="hidden lg:flex items-center justify-center h-full">
              <h3 className="text-white text-center font-bold text-lg">
                {/* Empty placeholder */}
              </h3>
            </div>
          </div>

          {/* Mobile Accordion Layout */}
          <div className="sm:hidden space-y-3">
            {/* Quick Links Dropdown */}
            <div className="border-b border-slate-800 pb-3">
              <button
                onClick={() => toggleSection("quick-links")}
                className="w-full flex items-center justify-between text-white font-bold text-base py-2"
              >
                <span>Quick Links</span>
                <ChevronDown
                  className={`w-5 h-5 transition-transform ${
                    openSection === "quick-links" ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openSection === "quick-links" && (
                <ul className="space-y-2 mt-3">
                  <li>
                    <Link 
                      to="/how-it-works" 
                      className="text-sm hover:text-white transition-colors inline-block"
                    >
                      How It Works
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/pricing" 
                      className="text-sm hover:text-white transition-colors inline-block"
                    >
                      Pricing
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/about" 
                      className="text-sm hover:text-white transition-colors inline-block"
                    >
                      About Us
                    </Link>
                  </li>
                  <li>
                    <a 
                      href="#contact" 
                      className="text-sm hover:text-white transition-colors inline-block"
                    >
                      Contact
                    </a>
                  </li>
                </ul>
              )}
            </div>

            {/* Categories Dropdown */}
            <div className="border-b border-slate-800 pb-3">
              <button
                onClick={() => toggleSection("categories")}
                className="w-full flex items-center justify-between text-white font-bold text-base py-2"
              >
                <span>Categories</span>
                <ChevronDown
                  className={`w-5 h-5 transition-transform ${
                    openSection === "categories" ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openSection === "categories" && (
                <ul className="space-y-2 mt-3">
                  <li>
                    <Link 
                      to="/sell/mobiles" 
                      className="text-sm hover:text-white transition-colors inline-block"
                    >
                      Sell Phone
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/sell/laptop" 
                      className="text-sm hover:text-white transition-colors inline-block"
                    >
                      Sell Laptop
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/sell/ipad" 
                      className="text-sm hover:text-white transition-colors inline-block"
                    >
                      Sell Tablet
                    </Link>
                  </li>
                </ul>
              )}
            </div>

            {/* More Info Dropdown */}
            <div className="border-b border-slate-800 pb-3">
              <button
                onClick={() => toggleSection("more-info")}
                className="w-full flex items-center justify-between text-white font-bold text-base py-2"
              >
                <span>More Info</span>
                <ChevronDown
                  className={`w-5 h-5 transition-transform ${
                    openSection === "more-info" ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openSection === "more-info" && (
                <ul className="space-y-2 mt-3">
                  <li>
                    <Link 
                      to="/terms-and-conditions" 
                      className="text-sm hover:text-white transition-colors inline-block"
                    >
                      Terms & Conditions
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/privacy-policy" 
                      className="text-sm hover:text-white transition-colors inline-block"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <a 
                      href={whatsappLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm hover:text-white transition-colors inline-block"
                    >
                      Become a Partner
                    </a>
                  </li>
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-800 pt-6 sm:pt-8">
          <div className="flex flex-col items-center gap-4">
            {/* Disclaimer Text */}
            <p className="text-xs sm:text-sm text-center text-slate-400 max-w-4xl px-4">
              All product names, logos, and brands are property of their respective owners. All company, product and service names used in this website are for identification purposes only. Use of these names, logos, and brands does not imply endorsement.
            </p>
            
            {/* Border Line */}
            <div className="w-full border-t border-slate-800"></div>
            
            {/* Copyright */}
            <p className="text-xs sm:text-sm text-center">
              &copy; {currentYear} SellkarIndia. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;