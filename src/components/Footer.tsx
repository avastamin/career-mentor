import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Compass, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  const footerSections = [
    {
      title: "Product",
      links: [
        { text: "Features", to: "/#features", scroll: true },
        { text: "Pricing", to: "/pricing", scroll: false },
        { text: "Learning Resources", to: "/dashboard/learning", scroll: false },
        { text: "Career Analysis", to: "/dashboard/career-analysis", scroll: false },
        { text: "Success Stories", to: "/about#success-stories", scroll: true }
      ]
    },
    {
      title: "Company",
      links: [
        { text: "About Us", to: "/about", scroll: false },
        { text: "Contact", to: "/contact", scroll: false },
        { text: "Careers", to: "/about#careers", scroll: true },
        { text: "Press", to: "/about#press", scroll: true },
        { text: "News", to: "/about#news", scroll: true }
      ]
    },
    {
      title: "Legal",
      links: [
        { text: "Terms of Service", to: "/terms", scroll: false },
        { text: "Privacy Policy", to: "/privacy", scroll: false },
        { text: "Cookie Policy", to: "/cookies", scroll: false },
        { text: "GDPR", to: "/gdpr", scroll: false },
        { text: "Accessibility", to: "/accessibility", scroll: false }
      ]
    }
  ];

  const handleLinkClick = (to: string, scroll: boolean) => {
    // If it's a hash link, handle scrolling
    if (scroll && to.includes('#')) {
      const id = to.split('#')[1];
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  return (
    <motion.footer 
      className="bg-gray-900 text-gray-300"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
    >
      <div className="container mx-auto pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Company Info */}
          <motion.div 
            className="lg:col-span-2"
            variants={itemVariants}
          >
            <motion.div 
              className="flex items-center space-x-3 mb-6"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <motion.div 
                className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.7 }}
              >
                <Compass className="w-5 h-5 text-indigo-400" />
              </motion.div>
              <span className="text-xl font-bold text-white">CareerMentorAI</span>
            </motion.div>
            <motion.p 
              className="text-gray-400 mb-6 max-w-sm"
              variants={itemVariants}
            >
              Empowering careers through AI-driven guidance and personalized mentorship.
            </motion.p>
            <motion.div className="space-y-3" variants={itemVariants}>
              {[
                { icon: Mail, text: "contact@careermentorai.org", href: "mailto:contact@careermentorai.org" },
                { icon: Phone, text: "+1 (850) 900-9281", href: "tel:+1-850-900-9281" },
                { icon: MapPin, text: "925 Westwood Boulevard, Los Angeles, CA" }
              ].map((item, index) => (
                <motion.div 
                  key={index}
                  className="flex items-center gap-3"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <item.icon className="w-5 h-5 text-indigo-400" />
                  {item.href ? (
                    <motion.a 
                      href={item.href}
                      className="hover:text-indigo-400 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {item.text}
                    </motion.a>
                  ) : (
                    <span>{item.text}</span>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Quick Links */}
          {footerSections.map((section, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
            >
              <motion.h3 
                className="text-white font-semibold mb-6"
                variants={itemVariants}
              >
                {section.title}
              </motion.h3>
              <motion.ul 
                className="space-y-4"
                variants={containerVariants}
              >
                {section.links.map((link, linkIndex) => (
                  <motion.li 
                    key={linkIndex}
                    variants={itemVariants}
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Link 
                      to={link.to}
                      className="text-gray-400 hover:text-indigo-400 transition-colors"
                      onClick={() => handleLinkClick(link.to, link.scroll)}
                    >
                      {link.text}
                    </Link>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          ))}
        </div>

        {/* Social Links & Copyright */}
        <motion.div 
          className="pt-8 border-t border-gray-800"
          variants={itemVariants}
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <motion.div 
              className="flex items-center gap-6"
              variants={containerVariants}
            >
              {[Facebook, Twitter, Linkedin, Instagram].map((Icon, index) => (
                <motion.a
                  key={index}
                  href="#"
                  className="text-gray-400 hover:text-indigo-400 transition-colors"
                  whileHover={{ 
                    scale: 1.2,
                    rotate: 360,
                    color: "#818cf8"
                  }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              ))}
            </motion.div>
            <motion.p 
              className="text-gray-400 text-sm text-center"
              variants={itemVariants}
            >
              © {currentYear} CareerMentorAI. All rights reserved. Transforming careers with AI-powered guidance.
            </motion.p>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
};