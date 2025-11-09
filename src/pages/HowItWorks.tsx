import { Smartphone } from "lucide-react";

const howItWorksData = [
  {
    num: 1,
    title: "Share Your Device Details",
    description:
      "Visit our website or WhatsApp us with your device details — brand, model, storage, condition, age, and any issues (if any). Whether it’s a phone, laptop, tablet, MacBook, iMac, or console, we take it all.",
    img: "/assets/how1.jpg",
  },
  {
    num: 2,
    title: "Get an Instant and Transparent Price Quote",
    description:
      "Based on your inputs, we’ll instantly give you the best possible quote — no time-wasting, no fake high offers that drop later. Our prices are based on real-time market demand and device condition, so you get a fair value.",
    img: "/assets/how2.jpg",
  },
  {
    num: 3,
    title: "Schedule a Free Pickup",
    description:
      "Once you’re happy with the quoted price, our team will schedule a free doorstep pickup. Whether it’s your home, office, or even a café — we come to you. No need to travel or stand in queues.",
    img: "/assets/how3.jpg",
  },
  {
    num: 4,
    title: "On-Spot Inspection",
    description:
      "At the time of pickup, our trained executive will physically inspect your device. If your declared condition matches, we proceed at the same quoted price. No last-minute price slashing unless there’s a mismatch.",
    img: "/assets/how4.jpg",
  },
  {
    num: 5,
    title: "Instant Payment — Your Way",
    description:
      "Once verified, you get paid immediately through your preferred mode: UPI, bank transfer, or cash. No delays, no follow-ups. You sell it, we pay it — right there.",
    img: "/assets/how5.jpg",
  },
  {
    num: 6,
    title: "Done. That Simple.",
    description:
      "No drama, no dodgy buyers, no marketplace risks. Just a clean, secure, and professional selling experience.",
    img: "/assets/how6.jpg",
  },
  {
    num: 7,
    title: "Safe & Secure Process",
    description:
      "Your safety matters. All pickups are handled by verified professionals. No random dealers or risky meet-ups. Your data is wiped securely before resale. We ensure safe handling at every step.",
    img: "/assets/how7.jpg",
  },
];

const HowItWorks = () => (
  <div className="min-h-screen bg-gray-50">
    {/* Hero/Header */}
    <section className="bg-gradient-to-br from-blue-100 to-blue-200 py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex items-center gap-2 justify-center mb-4">
            <div className="bg-white p-2 rounded-lg">
              <Smartphone className="w-6 h-6 text-blue-800" />
            </div>
            <span className="text-xl sm:text-2xl font-bold text-blue-800">
              SellkarIndia
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-blue-800">
            How It Works
          </h1>
          <p className="text-lg sm:text-xl text-black font-medium max-w-xl mx-auto">
            Selling your old device with SellKar India is fast, fair, and completely hassle-free. Here’s exactly how our process works from start to finish:
          </p>
        </div>
      </div>
    </section>

    {/* Steps */}
    <section className="py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="space-y-16 sm:space-y-24">
          {howItWorksData.map((step, i) => (
            <div
              key={step.num}
              className={`grid md:grid-cols-2 gap-8 items-center ${
                i % 2 === 0 ? "" : "md:flex-row-reverse"
              }`}
            >
              {/* Img left for even, right for odd */}
              <div
                className={`${
                  i % 2 === 0
                    ? "order-2 md:order-1"
                    : "order-2 md:order-2"
                } flex items-center justify-center`}
              >
                <div className="rounded-2xl overflow-hidden shadow-lg w-full max-w-md h-64 flex items-center justify-center bg-white">
                  <img
                    src={step.img}
                    alt={step.title}
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              </div>
              <div
                className={`${
                  i % 2 === 0
                    ? "order-1 md:order-2"
                    : "order-1 md:order-1"
                }`}
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className="bg-blue-800 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                    {step.num}
                  </div>
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-blue-800 mb-3">
                      {step.title}
                    </h3>
                    <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  </div>
);

export default HowItWorks;