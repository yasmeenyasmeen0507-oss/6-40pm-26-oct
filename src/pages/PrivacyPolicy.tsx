import { Smartphone, Phone, Mail } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-4 sm:p-8 lg:p-10">
          {/* Logo and Title */}
          <div className="text-center mb-4 sm:mb-6">
            <div className="flex items-center gap-2 justify-center mb-2 sm:mb-3">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-lg">
                <Smartphone className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="text-xl sm:text-2xl font-bold text-gray-900">SellkarIndia</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              Privacy Policy
            </h1>
          </div>
          
          <p className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-6 leading-relaxed">
            At SellKar India, your privacy is not just a promise — it's our responsibility. We collect only what's needed to provide a smooth, secure, and professional selling experience, and we never misuse or sell your data. Here's how we handle your information:
          </p>

          <div className="border-t border-gray-200 my-4 sm:my-6"></div>

          {/* Section 1 */}
          <section className="mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
              1. Information We Collect
            </h2>
            <ul className="list-disc list-inside space-y-1.5 sm:space-y-2 text-sm sm:text-base text-gray-700 ml-4">
              <li><strong>Personal Info:</strong> Name, mobile number, email, and address — only to contact and complete your transaction.</li>
              <li><strong>Device Details:</strong> For accurate price quotes and seamless operations.</li>
              <li><strong>Payment Details:</strong> For secure and instant payouts (never stored after use).</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
              2. How We Use Your Data
            </h2>
            <ul className="list-disc list-inside space-y-1.5 sm:space-y-2 text-sm sm:text-base text-gray-700 ml-4">
              <li>To contact you for pick-ups, quote confirmations, and support</li>
              <li>To verify and secure smooth transactions</li>
              <li>To improve our service and customer experience</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
              3. We Don't Sell Your Data — Ever
            </h2>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              Your personal information is never shared with third parties for marketing, ads, or unrelated purposes. It's only shared with trusted partners when needed for a transaction (like pickups or payments).
            </p>
          </section>

          {/* Section 4 */}
          <section className="mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
              4. Data Security
            </h2>
            <ul className="list-disc list-inside space-y-1.5 sm:space-y-2 text-sm sm:text-base text-gray-700 ml-4">
              <li>All data is stored securely on encrypted servers</li>
              <li>We follow strict internal policies for handling personal details</li>
              <li>Access is limited to verified and trained team members</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
              5. Your Device Data is Always Safe
            </h2>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              Before resale or recycling, all gadgets we receive are permanently factory reset and data wiped using certified tools. Even if you forget to format it — we do.
            </p>
          </section>

          {/* Section 6 */}
          <section className="mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
              6. Your Control
            </h2>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              You can request to update or delete your stored info anytime by contacting us at{" "}
              <a href="mailto:info@sellkarindia.com" className="text-blue-600 hover:text-blue-700 font-medium">
                info@sellkarindia.com
              </a>.
            </p>
          </section>

          {/* Section 7 */}
          <section className="mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
              7. Legal Compliance
            </h2>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              We follow all applicable data protection laws in India and update this policy as required.
            </p>
          </section>

          {/* Contact Section */}
          <section className="mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
              Contact Us
            </h2>
            <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4">For any privacy-related questions or concerns, reach out at:</p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 space-y-2.5 sm:space-y-3">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="bg-blue-100 p-1.5 sm:p-2 rounded-lg">
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                </div>
                <a href="tel:+917411329292" className="text-sm sm:text-base text-blue-600 hover:text-blue-700 font-medium">
                  +91 7411 329 292
                </a>
              </div>
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="bg-blue-100 p-1.5 sm:p-2 rounded-lg">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                </div>
                <a href="mailto:info@sellkarindia.com" className="text-sm sm:text-base text-blue-600 hover:text-blue-700 font-medium break-all">
                  info@sellkarindia.com
                </a>
              </div>
            </div>
          </section>

          <div className="border-t border-gray-200 mt-6 sm:mt-8 pt-4 sm:pt-6">
            <p className="text-xs sm:text-sm text-gray-500 text-center">
              Last Updated: January 9, 2025
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicy;