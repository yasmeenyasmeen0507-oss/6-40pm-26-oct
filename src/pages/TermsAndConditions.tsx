import { Smartphone, Phone, Mail } from "lucide-react";

const TermsAndConditions = () => {
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
              Terms of Service
            </h1>
          </div>
          
          <p className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-6 leading-relaxed">
            These Terms govern your use of SellKar India's website, services, and any interactions with our platform or team. By using our services, you agree to the following:
          </p>

          <div className="border-t border-gray-200 my-4 sm:my-6"></div>

          {/* Section 1 */}
          <section className="mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
              1. Eligibility
            </h2>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              You must be at least 18 years old to sell a device through SellKar India. You must legally own the device you're selling.
            </p>
          </section>

          {/* Section 2 */}
          <section className="mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
              2. Device Ownership
            </h2>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              You confirm that you are the rightful owner of the device being sold and that it is not stolen, fake, or illegally obtained. You may be asked for ID proof or purchase invoice in certain cases.
            </p>
          </section>

          {/* Section 3 */}
          <section className="mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
              3. Accurate Device Information
            </h2>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              The price we offer is based on the condition and details you provide. If the actual device condition doesn't match your description, the price will be revised on the spot.
            </p>
          </section>

          {/* Section 4 */}
          <section className="mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
              4. Final Price
            </h2>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              If the device matches the described condition during inspection, our quoted price is final. No bargaining or negotiation is required or entertained at pickup.
            </p>
          </section>

          {/* Section 5 */}
          <section className="mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
              5. Payments
            </h2>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              We offer instant payment through UPI, bank transfer, or cash once the device is verified and accepted. You are responsible for providing accurate payment details.
            </p>
          </section>

          {/* Section 6 */}
          <section className="mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
              6. Data Responsibility
            </h2>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              You are responsible for backing up and removing your personal data from the device before selling it. However, SellKar India will securely wipe data again using certified tools. We are not liable for data that was not removed by you.
            </p>
          </section>

          {/* Section 7 */}
          <section className="mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
              7. Service Availability
            </h2>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              Pickup service availability depends on location, executives, and scheduling. We do not guarantee same-day pickup in all cases, but we aim to process requests as quickly as possible.
            </p>
          </section>

          {/* Section 8 */}
          <section className="mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
              8. Order Cancellation
            </h2>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              You can cancel the pickup anytime before device inspection. We also reserve the right to cancel the deal if we find legal or technical issues with the device or seller.
            </p>
          </section>

          {/* Section 9 */}
          <section className="mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
              9. Prohibited Items
            </h2>
            <p className="text-sm sm:text-base text-gray-700 mb-2 sm:mb-3">We do not buy:</p>
            <ul className="list-disc list-inside space-y-1.5 sm:space-y-2 text-sm sm:text-base text-gray-700 ml-4">
              <li>Stolen devices</li>
              <li>iCloud or FRP-locked devices</li>
              <li>Fake, cloned, or counterfeit products</li>
              <li>Devices with illegal modifications or tampering</li>
            </ul>
          </section>

          {/* Section 10 */}
          <section className="mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
              10. Limitation of Liability
            </h2>
            <p className="text-sm sm:text-base text-gray-700 mb-2 sm:mb-3">SellKar India is not responsible for:</p>
            <ul className="list-disc list-inside space-y-1.5 sm:space-y-2 text-sm sm:text-base text-gray-700 ml-4">
              <li>Issues caused due to inaccurate information provided by the seller</li>
              <li>Any damage to device before pickup</li>
              <li>Delays caused due to external factors (traffic, weather, etc.)</li>
              <li>Any loss of data in devices not backed up prior to the sale</li>
            </ul>
          </section>

          {/* Section 11 */}
          <section className="mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
              11. Changes to Terms
            </h2>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              We may modify these Terms at any time. Updated Terms will be posted on our website, and continued use of our services means you accept those changes.
            </p>
          </section>

          {/* Section 12 */}
          <section className="mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
              12. Contact & Support
            </h2>
            <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4">For any questions or disputes, reach out at:</p>
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
                <a href="mailto:info@sellkarindia.com" className="text-sm sm:text-base text-blue-600 hover:text-blue-700 font-medium">
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

export default TermsAndConditions;