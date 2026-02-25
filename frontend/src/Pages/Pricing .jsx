import { useSelector } from "react-redux";

const Pricing = () => {
 const mode = useSelector((state)=>state.app.mode);

  const plans = [
    {
      name: "Basic",
      price: "₹499",
      duration: "/month",
      features: ["Access to 10 courses", "Community Support", "No Certificate"],
      popular: false,
    },
    {
      name: "Standard",
      price: "₹999",
      duration: "/month",
      features: [
        "Access to all courses",
        "Priority Support",
        "Course Completion Certificate",
      ],
      popular: true,
    },
    {
      name: "Premium",
      price: "₹1999",
      duration: "/month",
      features: [
        "Access to all courses",
        "1-on-1 Mentorship",
        "Lifetime Certificate",
        "Exclusive Webinars",
      ],
      popular: false,
    },
  ];

  return (
    <div className={`${mode?"bg-black":"bg-[#F6F5F8]"} py-20 px-6`}>
      {/* Heading */}
      <div className="text-center mb-16 flex flex-col items-center">
        <h2 className={`text-[3rem] w-[50%] font-bold font-Nunito ${mode?"text-white":"text-gray-800"}`}>Choose the plan that fits your needs</h2>
        <p className={`${mode?"text-gray-300":"text-gray-600"} text-sm w-[40%] mt-3`}>
          Looking to master advanced skills, our plans are built to give you maximum value, transparency, and growth opportunities—without hidden costs.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-6xl mx-auto grid gap-10 grid-cols-1 md:grid-cols-3">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`relative rounded-2xl shadow-lg p-10 flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
              plan.popular
                ? "bg-[#2A27F3] text-white scale-105"
                : mode?"bg-[#1F2024] text-white":"bg-white text-gray-800"
            }`}
          >
            {/* Most Popular Tag */}
            {plan.popular && (
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#A4FE6A] text-gray-900 px-4 py-1 rounded-full text-sm font-semibold shadow-md">
                Most Popular
              </span>
            )}

            <h3 className="text-2xl font-semibold mb-4 text-center">{plan.name}</h3>
            <div className="flex justify-center items-baseline mb-6">
              <span className="text-4xl font-bold">{plan.price}</span>
              <span className="ml-2">{plan.duration}</span>
            </div>

            <ul className="space-y-3 mb-8">
              {plan.features.map((feature, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 text-sm md:text-base"
                >
                  <span>✔️</span> {feature}
                </li>
              ))}
            </ul>

            <button
              className={`mt-auto py-3 px-6 rounded-xl font-medium transition-all duration-300 ${
                plan.popular
                  ? "bg-white text-[#2A27F3] hover:bg-gray-200"
                  : "bg-[#2A27F3] text-white hover:bg-[#3334FE]"
              }`}
            >
              Get Started
            </button>
          </div>
        ))}
      </div>

{/* CTA Section */}
<div className={`mt-24 bg-[#2A27F3] text-white py-16 px-6 text-center shadow-xl`}>
  <h3 className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tight">
    Still confused which plan suits you?
  </h3>
  <p className={`text-lg text-indigo-100 mb-8 max-w-2xl mx-auto`}>
    Try our platform free for 7 days and explore every feature. Upgrade anytime when you’re ready!
  </p>

  {/* CTA Buttons */}
  <div className="flex flex-wrap justify-center gap-6 mb-10">
    <button className={`bg-white text-[#2A27F3] px-8 py-3 font-semibold text-lg hover:bg-gray-200 transition`}>
      Start Free Trial
    </button>
    <button className={`border border-white px-8 py-3 font-semibold text-lg hover:bg-white hover:text-[#2A27F3] transition`}>
      View Plans
    </button>
  </div>

  {/* Extra Trust Signals */}
  <div className="text-sm text-indigo-200 space-y-2">
    <p>✔ 7-Day Money Back Guarantee</p>
    <p>✔ Trusted by 10,000+ learners worldwide</p>
    <p>✔ Includes Certificates & Expert Support</p>
  </div>
</div>


    </div>
  );
};

export default Pricing;
