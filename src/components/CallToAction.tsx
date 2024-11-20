import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AnimatedButton } from './AnimatedButton';

export const CallToAction = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const benefits = [
    "Start your free trial today",
    "No credit card required",
    "Cancel anytime",
    "24/7 support"
  ];

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard/overview');
    } else {
      navigate('/signin');
    }
  };

  return (
    <section className="py-24 bg-gradient-to-br from-indigo-600 to-indigo-800 text-white">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Transform Your Career?
            </h2>
            <p className="text-xl text-indigo-100 mb-8">
              Join thousands of professionals who have already taken the first step towards their dream career
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <CheckCircle className="w-5 h-5 text-indigo-200" />
                  <span className="text-indigo-100">{benefit}</span>
                </motion.div>
              ))}
            </div>

            <AnimatedButton
              onClick={handleGetStarted}
              className="bg-white text-indigo-600 hover:bg-indigo-50 group"
              variant="secondary"
            >
              Get Started Now
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </AnimatedButton>
          </motion.div>
        </div>
      </div>
    </section>
  );
};