import { Smartphone } from "lucide-react";

const aboutData = [
  {
    title: "What we do",
    description:
      "Pick up your gadget from your location, evaluate it instantly, and pay you on the spot.",
    img: "/assets/about1.jpg",
  },
  {
    title: "Why we’re different",
    description:
      "No hidden cuts, no reselling drama, no waiting. Just a verified team, transparent pricing, and same-day payout.",
    img: "/assets/about2.jpg",
  },
  {
    title: "Who we serve",
    description:
      "Anyone across India who wants to sell electronics quickly — students, professionals, retailers, corporates, and even bulk sellers.",
    img: "/assets/about3.jpg",
  },
  {
    title: "Our reach",
    description:
      "From Bangalore to 18 cities and growing, powered by a trusted network of local partners and vendors.",
    img: "/assets/about4.jpg",
  },
];

const AboutUs = () => (
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
            About Us
          </h1>
          <p className="text-lg sm:text-xl text-black font-medium max-w-xl mx-auto">
            SellKar India is a fast, transparent, and doorstep service for selling used phones, laptops, tablets, Macs, and other gadgets across India. We help individuals and businesses get fair value for their old devices without wasting time on negotiations, fake buyers, or marketplace hassle.
          </p>
        </div>
      </div>
    </section>

    {/* Four Points */}
    <section className="py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="space-y-16 sm:space-y-24">
          {aboutData.map((point, i) => (
            <div
              key={point.title}
              className={`grid md:grid-cols-2 gap-8 items-center ${
                i % 2 === 0 ? "" : "md:flex-row-reverse"
              }`}
            >
              <div
                className={`${
                  i % 2 === 0
                    ? "order-2 md:order-1"
                    : "order-2 md:order-2"
                } flex items-center justify-center`}
              >
                <div className={`rounded-2xl overflow-hidden shadow-lg w-full max-w-md bg-white flex items-center justify-center ${i === 3 ? "" : "h-64"}`}>
                  {i === 3 ? (
                    <img
                      src={point.img}
                      alt={point.title}
                      className="w-full h-auto object-contain object-center"
                      style={{
                        display: "block",
                        background: "#fff",
                        aspectRatio: "1/1"
                      }}
                    />
                  ) : (
                    <img
                      src={point.img}
                      alt={point.title}
                      className="w-full h-full object-cover object-center"
                      style={{
                        aspectRatio: "1/1",
                        maxHeight: "256px",
                        background: "#fff",
                      }}
                    />
                  )}
                </div>
              </div>
              <div className={`${
                i % 2 === 0
                  ? "order-1 md:order-2"
                  : "order-1 md:order-1"
              }`}>
                <div className="flex flex-col gap-2 mb-4">
                  <h3 className="text-2xl sm:text-3xl font-bold text-blue-800 mb-2">
                    {point.title}
                  </h3>
                  <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                    {point.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  </div>
);

export default AboutUs;