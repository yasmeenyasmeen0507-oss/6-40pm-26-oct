import { Smartphone } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* First Column: Logo and Tagline (Kept) */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-lg">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">SellkarIndia</span>
            </div>
            <p className="text-sm mb-4">
              India's most trusted platform for selling old phones, laptops, and tablets. Get instant cash with doorstep pickup.
            </p>
            {/* Removed Social Media Links */}
          </div>

          {/* Second Column: Quick Links (Kept) */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/sell" className="hover:text-white transition-colors">
                  Sell Device
                </Link>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-white transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-white transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-white transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Third Column: Categories (Kept) */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/sell" state={{ category: "phone" }} className="hover:text-white transition-colors">
                  Sell Phone
                </Link>
              </li>
              <li>
                <Link to="/sell" state={{ category: "laptop" }} className="hover:text-white transition-colors">
                  Sell Laptop
                </Link>
              </li>
              <li>
                <Link to="/sell" state={{ category: "ipad" }} className="hover:text-white transition-colors">
                  Sell Tablet
                </Link>
              </li>
              <li>
                <a href="#brands" className="hover:text-white transition-colors">
                  All Brands
                </a>
              </li>
            </ul>
          </div>

          {/* Fourth Column: Contact Us (Removed) */}
          <div className="flex items-center justify-center h-full">
                <h3 className="text-white text-center font-bold text-lg">
                     
                </h3>
            </div>
        </div>

        <div className="border-t border-slate-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-center md:text-left">
              &copy; {currentYear} SellkarIndia. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#terms" className="hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#refund" className="hover:text-white transition-colors">
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
