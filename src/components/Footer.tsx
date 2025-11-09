import { Smartphone } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8">
          {/* First Column: Logo and Tagline */}
          <div className="text-center sm:text-left">
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

          {/* Second Column: Quick Links */}
          <div className="text-center sm:text-left">
            <h3 className="text-white font-bold text-base sm:text-lg mb-3 sm:mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#how-it-works" className="text-sm hover:text-white transition-colors inline-block">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-sm hover:text-white transition-colors inline-block">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#about" className="text-sm hover:text-white transition-colors inline-block">
                  About Us
                </a>
              </li>
              <li>
                <a href="#contact" className="text-sm hover:text-white transition-colors inline-block">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Third Column: Categories */}
          <div className="text-center sm:text-left">
            <h3 className="text-white font-bold text-base sm:text-lg mb-3 sm:mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/sell/mobiles" className="text-sm hover:text-white transition-colors inline-block">
                  Sell Phone
                </Link>
              </li>
              <li>
                <Link to="/sell/laptop" className="text-sm hover:text-white transition-colors inline-block">
                  Sell Laptop
                </Link>
              </li>
              <li>
                <Link to="/sell/ipad" className="text-sm hover:text-white transition-colors inline-block">
                  Sell Tablet
                </Link>
              </li>
            </ul>
          </div>

          {/* Fourth Column: Empty placeholder */}
          <div className="hidden lg:flex items-center justify-center h-full">
            <h3 className="text-white text-center font-bold text-lg">
              {/* Empty placeholder */}
            </h3>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-800 pt-6 sm:pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <p className="text-xs sm:text-sm text-center md:text-left order-2 md:order-1">
              &copy; {currentYear} SellkarIndia. All rights reserved.
            </p>
            
            {/* Policy Links */}
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm order-1 md:order-2">
              <a href="#privacy" className="hover:text-white transition-colors whitespace-nowrap">
                Privacy Policy
              </a>
              <a href="#terms" className="hover:text-white transition-colors whitespace-nowrap">
                Terms of Service
              </a>
              <a href="#refund" className="hover:text-white transition-colors whitespace-nowrap">
                Refund Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;