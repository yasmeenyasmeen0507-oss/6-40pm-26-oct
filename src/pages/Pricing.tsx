import { Smartphone, CheckCircle, Shield, DollarSign } from "lucide-react";

const Pricing = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-100 to-blue-200 py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex items-center gap-2 justify-center mb-4">
              <div className="bg-white p-2 rounded-lg">
                <Smartphone className="w-6 h-6 text-blue-800" />
              </div>
              <span className="text-xl sm:text-2xl font-bold text-blue-800">SellkarIndia</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-black">
              Our Pricing
            </h1>
            <p className="text-lg sm:text-xl text-black font-medium">
              At SellKar India, we keep our pricing simple, honest, and transparent — no fake high quotes, no last-minute price drops, and no shady deductions.
            </p>
          </div>
        </div>
      </section>

      {/* How We Calculate Section */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-center text-blue-800 mb-12">
              How We Calculate Your Price
            </h2>

            {/* 1. Real-Time Market Value - Image Left, Text Right */}
            <div className="grid md:grid-cols-2 gap-8 items-center mb-16">
              {/* IMAGE Left, Text Right (on desktop) */}
              <div className="order-2 md:order-1 flex items-center justify-center">
                <div className="rounded-2xl overflow-hidden shadow-lg w-full max-w-md h-64 flex items-center justify-center bg-white">
                  <img
                    src="/assets/point1.jpg"
                    alt="Real-Time Market Value"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              </div>
              <div className="order-1 md:order-2">
                <div className="flex items-start gap-3 mb-4">
                  <div className="bg-blue-800 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-blue-800 mb-3">
                      Real-Time Market Value
                    </h3>
                    <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                      We analyze current demand and resale value across India to get you the best rate.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Device Condition - Text Left, Image Right */}
            <div className="grid md:grid-cols-2 gap-8 items-center mb-16">
              <div>
                <div className="flex items-start gap-3 mb-4">
                  <div className="bg-blue-800 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-blue-800 mb-3">
                      Device Condition
                    </h3>
                    <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                      Based on physical condition, age, functional status, and accessories like box, charger, or bill.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="rounded-2xl overflow-hidden shadow-lg w-full max-w-md h-64 flex items-center justify-center bg-white">
                  <img
                    src="/assets/point2.jpg"
                    alt="Device Condition"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              </div>
            </div>

            {/* 3. Brand & Model - Image Left, Text Right */}
            <div className="grid md:grid-cols-2 gap-8 items-center mb-16">
              <div className="order-2 md:order-1 flex items-center justify-center">
                <div className="rounded-2xl overflow-hidden shadow-lg w-full max-w-md h-64 flex items-center justify-center bg-white">
                  <img
                    src="/assets/point3.jpg"
                    alt="Brand & Model"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              </div>
              <div className="order-1 md:order-2">
                <div className="flex items-start gap-3 mb-4">
                  <div className="bg-blue-800 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-blue-800 mb-3">
                      Brand & Model
                    </h3>
                    <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                      High-end and popular models naturally hold greater resale value.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Storage & Specs - Text Left, Image Right */}
            <div className="grid md:grid-cols-2 gap-8 items-center mb-16">
              <div>
                <div className="flex items-start gap-3 mb-4">
                  <div className="bg-blue-800 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                    4
                  </div>
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-blue-800 mb-3">
                      Storage & Specs
                    </h3>
                    <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                      Higher storage, RAM, and premium variants fetch a better price.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="rounded-2xl overflow-hidden shadow-lg w-full max-w-md h-64 flex items-center justify-center bg-white">
                  <img
                    src="/assets/point4.jpg"
                    alt="Storage & Specs"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What You Get Section */}
      <section className="bg-white py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-center text-blue-800 mb-12">
              What You Get
            </h2>
            <div className="space-y-8">

              {/* Instant Quote */}
              <div className="flex gap-4 items-start">
                <div className="bg-blue-100 p-3 rounded-lg flex-shrink-0">
                  <CheckCircle className="w-8 h-8 text-blue-800" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-black mb-2">
                    Instant Quote — No Lowballing
                  </h3>
                  <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                    You get a real, fair market price within seconds based on your device details.
                  </p>
                </div>
              </div>
              {/* Price Protection */}
              <div className="flex gap-4 items-start">
                <div className="bg-blue-100 p-3 rounded-lg flex-shrink-0">
                  <Shield className="w-8 h-8 text-blue-800" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-black mb-2">
                    Price Protection Guarantee
                  </h3>
                  <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                    If your described condition matches during pickup, the quote stays the same. No on-the-spot negotiations.
                  </p>
                </div>
              </div>
              {/* Zero Hidden Charges */}
              <div className="flex gap-4 items-start">
                <div className="bg-blue-100 p-3 rounded-lg flex-shrink-0">
                  <DollarSign className="w-8 h-8 text-blue-800" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-black mb-2">
                    Zero Hidden Charges
                  </h3>
                  <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                    Free pickup, no service fee, no platform charges. What we offer is what we pay.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Transparency Section */}
      <section className="bg-blue-50 py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-800 mb-6">
              Transparency at Every Step
            </h2>
            <p className="text-lg sm:text-xl text-gray-700 leading-relaxed">
              We don't tempt you with inflated online prices just to slash them later. Our system is consistent: what you see is what you get.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;