import React from "react";
import { motion } from 'framer-motion'
import { Link } from "react-router-dom";
//icons
import { FaFacebook, FaLinkedin, FaGithub } from "react-icons/fa";
import { FaXTwitter, FaPhone, FaLocationDot } from "react-icons/fa6";
import { IoMail } from "react-icons/io5";

//images
import logo from '../../assets/LegalGPT-Nepal.png'
const Footer: React.FC = () => {
  const links = [
    { to: "/", label: "Home" },
    { to: "/features", label: "Features" },
    { to: "/docs", label: "Documentation" },
    { to: "/dataset", label: "Dataset Format" },
    { to: "/model", label: "Trained Model" },
    { to: "/about", label: "About Us" },
    { to: "/copyright", label: "Copyright" },
  ];

  return (
    <footer className="bg-primary-dark text-white">
      <div className="mx-4 sm:mx-8 md:mx-12 lg:mx-16 xl:mx-65  py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

          {/* Column 1: Logo and Details */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-20 h-20 bg-primary  flex items-center justify-center rounded-full ">
                {/* <span className="text-xl font-bold">LG</span> */}
                <img src={logo} alt='logo' className="rounded-full" />
              </div>
              <h2 className="text-2xl font-bold">LegalG.P.T</h2>
            </div>
            <p className="text-text leading-relaxed">
              Your AI-powered legal assistant specialized in Nepali law. Get accurate legal advice and information tailored to Nepal's legal framework.
            </p>
            <div className="flex flex-col gap-2 text-sm text-white/60">
              <p>© 2024 LegalGPT Nepal</p>
              <p>All rights reserved</p>
            </div>
          </motion.div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold text-white mb-2">Quick Links</h3>
            <ul className="flex flex-col gap-3">
              {links.map((link, index) => (
                <motion.li
                  key={link.to}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                >
                  <Link to={link.to} className="block">
                    <motion.div
                      className="text-text hover:text-secondary transition-colors cursor-pointer flex items-center gap-2"
                      whileHover={{ x: 8 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <motion.span
                        className="text-secondary opacity-0"
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        →
                      </motion.span>
                      <span>{link.label}</span>
                    </motion.div>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>
          {/* Column 3: Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold text-white mb-2">Get in Touch</h3>

            {/* Contact Details */}
            <div className="flex flex-col gap-3">
              <motion.div
                whileHover={{ x: 8 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="flex items-center gap-3 text-text hover:text-secondary">
                <IoMail className="w-5 h-5 " />
                <a href="mailto:info@legalgpt.np" className="hover:text-secondary transition-colors">
                  info@legalgpt.np
                </a>
              </motion.div>
              <motion.div 
                whileHover={{ x: 8 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}              
              className="flex items-center gap-3 text-text hover:text-secondary">
                <FaPhone className="w-5 h-5 " />
                <a href="tel:+9779812345678" className="hover:text-secondary transition-colors">
                  +977 981-2345678
                </a>
              </motion.div>
              <motion.div 
                whileHover={{ x: 8 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="flex items-center gap-3 text-text hover:text-secondary">
                <FaLocationDot className="w-5 h-5 " />
                <span>Kathmandu, Nepal</span>
              </motion.div>
            </div>

            {/* Social Media Links */}
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-400 mb-3">Follow Us</h4>
              <div className="flex gap-4">
                <a
                  href="https://facebook.com/legalgptnepal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center hover:text-secondary transition-all"
                  aria-label="Facebook"
                >
                  <FaFacebook className="w-5 h-5" />
                </a>
                <a
                  href="https://twitter.com/legalgptnepal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center hover:text-secondary transition-all"
                  aria-label="Twitter"
                >
                  <FaXTwitter className="w-5 h-5" />
                </a>
                <a
                  href="https://linkedin.com/company/legalgptnepal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center hover:text-secondary transition-all"
                  aria-label="LinkedIn"
                >
                  <FaLinkedin className="w-5 h-5" />
                </a>
                <a
                  href="https://github.com/legalgptnepal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center hover:text-secondary transition-all"
                  aria-label="GitHub"
                >
                  <FaGithub className="w-5 h-5" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-700 text-center text-gray-400 text-sm">
          <p>
            Disclaimer: LegalGPT Nepal provides general legal information based on Nepal's laws.
            For specific legal advice, please consult a qualified lawyer.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;