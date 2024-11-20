import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Lock } from 'lucide-react';
import { AnimatedCard } from '../components/AnimatedCard';

export const PrivacyPage = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy - CareerMentorAI</title>
        <meta 
          name="description" 
          content="Learn about how CareerMentorAI protects your privacy and handles your personal information." 
        />
      </Helmet>

      <div className="min-h-screen pt-32 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <AnimatedCard>
              <div className="p-8">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center">
                    <Lock className="w-8 h-8 text-indigo-600" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
                    <p className="text-gray-600">Last updated: March 15, 2024</p>
                  </div>
                </div>

                <div className="prose prose-lg max-w-none">
                  <h2>1. Introduction</h2>
                  <p>
                    CareerMentorAI ("we," "our," or "us") is committed to protecting your privacy. 
                    This Privacy Policy explains how we collect, use, disclose, and safeguard your 
                    information when you use our services.
                  </p>

                  <h2>2. Information We Collect</h2>
                  <h3>2.1 Personal Information</h3>
                  <ul>
                    <li>Name and contact information</li>
                    <li>Professional background and experience</li>
                    <li>Career goals and preferences</li>
                    <li>Skills and qualifications</li>
                    <li>Account credentials</li>
                  </ul>

                  <h3>2.2 Usage Information</h3>
                  <ul>
                    <li>Device and browser information</li>
                    <li>IP address and location data</li>
                    <li>Usage patterns and preferences</li>
                    <li>Interaction with our services</li>
                  </ul>

                  <h2>3. How We Use Your Information</h2>
                  <p>We use your information to:</p>
                  <ul>
                    <li>Provide personalized career guidance and recommendations</li>
                    <li>Improve and optimize our AI algorithms</li>
                    <li>Communicate with you about our services</li>
                    <li>Process payments and manage subscriptions</li>
                    <li>Ensure security and prevent fraud</li>
                    <li>Comply with legal obligations</li>
                  </ul>

                  <h2>4. Data Protection</h2>
                  <p>
                    We implement appropriate technical and organizational measures to protect 
                    your personal information against unauthorized access, alteration, disclosure, 
                    or destruction.
                  </p>

                  <h2>5. Data Sharing and Disclosure</h2>
                  <p>We may share your information with:</p>
                  <ul>
                    <li>Service providers who assist in operating our platform</li>
                    <li>Analytics partners to improve our services</li>
                    <li>Legal authorities when required by law</li>
                  </ul>

                  <h2>6. AI and Machine Learning</h2>
                  <p>
                    Our AI systems process your data to provide personalized career guidance. 
                    This processing is essential to our services and is conducted in accordance 
                    with industry best practices and ethical AI principles.
                  </p>

                  <h2>7. Your Rights</h2>
                  <p>You have the right to:</p>
                  <ul>
                    <li>Access your personal information</li>
                    <li>Correct inaccurate data</li>
                    <li>Request deletion of your data</li>
                    <li>Object to data processing</li>
                    <li>Export your data</li>
                  </ul>

                  <h2>8. Cookies and Tracking</h2>
                  <p>
                    We use cookies and similar tracking technologies to enhance your experience 
                    and collect usage data. You can control cookie preferences through your 
                    browser settings.
                  </p>

                  <h2>9. Children's Privacy</h2>
                  <p>
                    Our services are not intended for users under 16 years of age. We do not 
                    knowingly collect information from children.
                  </p>

                  <h2>10. International Data Transfers</h2>
                  <p>
                    Your information may be transferred and processed in countries other than 
                    your own. We ensure appropriate safeguards are in place for such transfers.
                  </p>

                  <h2>11. Changes to Privacy Policy</h2>
                  <p>
                    We may update this Privacy Policy periodically. We will notify you of any 
                    material changes and obtain consent where required.
                  </p>

                  <h2>12. Contact Us</h2>
                  <p>
                    For privacy-related questions or concerns, please contact our Data Protection 
                    Officer at{' '}
                    <a href="mailto:privacy@careermentorai.org" className="text-indigo-600 hover:text-indigo-700">
                      privacy@careermentorai.org
                    </a>
                  </p>
                </div>
              </div>
            </AnimatedCard>
          </motion.div>
        </div>
      </div>
    </>
  );
};