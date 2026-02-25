import { FiHelpCircle, FiZap } from "react-icons/fi";
import { useSelector } from "react-redux";

const FAQ = () => {
   const mode = useSelector((state)=>state.app.mode)
  const faqs = [
    {
      question: "What is included in the free plan?",
      answer:
        "Our free plan gives you access to a limited number of courses, community support, and a basic learning experience.",
      icon: <FiZap className="text-indigo-500 text-2xl" />,
    },
    {
      question: "Do I get a certificate after completing a course?",
      answer:
        "Yes, certificates are available in Standard and Premium plans once you successfully complete a course.",
      icon: <FiHelpCircle className="text-indigo-500 text-2xl" />,
    },
    {
      question: "Can I upgrade my plan later?",
      answer:
        "Absolutely! You can upgrade or downgrade your plan anytime from your account settings.",
      icon: <FiZap className="text-indigo-500 text-2xl" />,
    },
    {
      question: "Is there a refund policy?",
      answer:
        "Yes, we offer a 7-day refund policy if you are not satisfied with your subscription.",
      icon: <FiHelpCircle className="text-indigo-500 text-2xl" />,
    },
    {
      question: "Are the courses beginner friendly?",
      answer:
        "Yes, our courses are designed for learners at all levels including beginners, intermediates, and advanced students.",
      icon: <FiZap className="text-indigo-500 text-2xl" />,
    },
    {
      question: "How much does it cost?",
      answer:
        "You can start for free, and upgrade to Standard or Premium depending on the features you need.",
      icon: <FiHelpCircle className="text-indigo-500 text-2xl" />,
    },
  ];

  return (
    <section className={`py-20 px-6 md:px-12 lg:px-20 ${mode?"bg-black":"bg-[#F6F5F8]"}`}>
      {/* Heading */}
      <div className="text-center mb-14">
        <h2 className={`text-4xl md:text-5xl font-bold ${mode?"text-white":"text-gray-800"}`}>
          Frequently Asked Questions
        </h2>
        <p className={`${mode?"text-gray-300":"text-gray-500"} mt-3 text-lg`}>
          Here are the most asked questions based from our users
        </p>
      </div>

      {/* FAQ Grid */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
        {faqs.map((faq, index) => (
          <div key={index} className="flex gap-4">
            {/* Icon */}
            <div>{faq.icon}</div>

            {/* Content */}
            <div>
              <h3 className={`text-lg font-semibold ${mode?"text-white":"text-gray-800"} mb-2`}>
                {faq.question}
              </h3>
              <p className={`${mode?"text-gray-300":"text-gray-500"} text-sm leading-relaxed`}>
                {faq.answer}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQ;
