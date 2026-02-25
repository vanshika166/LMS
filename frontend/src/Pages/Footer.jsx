import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  return (
    <footer className="bg-[#2A27F3] text-[#F6F5F8]">
      {/* Top Section */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo & About */}
        <div>
          <h2 className="font-Nunito text-2xl">
            Learn
            <span className="text-[#A4FE6A] font-bold text-[1.5rem]">Z</span>y
          </h2>
          <p className="mt-4 text-gray-300 text-sm">
            Empowering learners worldwide with high-quality, affordable, and
            accessible courses. Your journey to success starts here.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm hover:cursor-pointer">
            {["Home", "Courses", "About", "Blog"].map((link, index) => {
              return (
                <li>
                  <p
                    key={index}
                    onClick={() =>
                      link === "Home"
                        ? navigate("/")
                        : navigate(`/${link.toLowerCase()}`)
                    }
                    className="hover:text-[#A4FE6A] transition"
                  >
                    {link}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Support</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:text-[#A4FE6A] transition">
                FAQs
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#A4FE6A] transition">
                Help Center
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#A4FE6A] transition">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#A4FE6A] transition">
                Terms of Service
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Email */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Have a Question?
          </h3>
          <p className="text-sm text-gray-300 mb-3">
            If you have any queries or need assistance, feel free to email us
            anytime.
          </p>

          <div className="flex items-center">
            <a
              href="mailto:support@yoursite.com"
              className="bg-[#A4FE6A] text-black px-5 py-2 rounded-md font-semibold hover:bg-[#90f44d] transition"
            >
              Email Us
            </a>
          </div>

          <p className="text-sm text-gray-400 mt-3">support@yoursite.com</p>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-600"></div>

      {/* Bottom Section */}
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center text-sm">
        <p className="text-gray-300">
          © {new Date().getFullYear()} Learnzy. All rights reserved.
        </p>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <a href="https://facebook.com" className="hover:text-[#A4FE6A]">
            <FaFacebookF />
          </a>
          <a href="https://twitter.com" className="hover:text-[#A4FE6A]">
            <FaTwitter />
          </a>
          <a href="https://instagram.com" className="hover:text-[#A4FE6A]">
            <FaInstagram />
          </a>
          <a href="https://linkedin.com" className="hover:text-[#A4FE6A]">
            <FaLinkedinIn />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
