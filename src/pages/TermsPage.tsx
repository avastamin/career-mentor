import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Shield } from 'lucide-react';
import { AnimatedCard } from '../components/AnimatedCard';

export const TermsPage = () => {
  return (
    <>
      <Helmet>
        <title>Terms of Service - CareerMentorAI</title>
        <meta 
          name="description" 
          content="Read CareerMentorAI's terms of service and understand our commitment to providing quality career guidance services." 
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
                    <Shield className="w-8 h-8 text-indigo-600" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
                    <p className="text-gray-600">Last updated: March 15, 2024</p>
                  </div>
                </div>

                <div className="prose prose-lg max-w-none">
                  <h2>1. Acceptance of Terms</h2>
                  <p>
                    By accessing and using CareerMentorAI's services, you agree to be bound by these 
                    Terms of Service. If you do not agree to these terms, please do not use our services.
                  </p>

                  <h2>2. Description of Services</h2>
                  <p>
                    CareerMentorAI provides AI-powered career guidance, analysis, and mentorship 
                    services. Our services include career path analysis, skill assessment, learning 
                    recommendations, and professional development guidance.
                  </p>

                  <h2>3. User Accounts</h2>
                  <p>
                    You must create an account to access our services. You are responsible for 
                    maintaining the confidentiality of your account credentials and for all 
                    activities under your account.
                  </p>

                  <h2>4. User Obligations</h2>
                  <ul>
                    <li>Provide accurate and complete information</li>
                    <li>Maintain the security of your account</li>
                    <li>Comply with all applicable laws and regulations</li>
                    <li>Not misuse or attempt to manipulate our services</li>
                  </ul>

                  <h2>5. Subscription and Payments</h2>
                  <p>
                    We offer various subscription plans with different features and pricing. 
                    Payments are processed securely through our payment providers. Subscriptions 
                    automatically renew unless cancelled.
                  </p>

                  <h2>6. Intellectual Property</h2>
                  <p>
                    All content, features, and functionality of our services are owned by 
                    CareerMentorAI and are protected by international copyright, trademark, 
                    and other intellectual property laws.
                  </p>

                  <h2>7. Data Usage and Privacy</h2>
                  <p>
                    We collect and use your data as described in our Privacy Policy. By using 
                    our services, you consent to our data practices as described in the Privacy Policy.
                  </p>

                  <h2>8. AI-Generated Content</h2>
                  <p>
                    Our AI-powered services provide recommendations and insights based on the 
                    information you provide. While we strive for accuracy, we do not guarantee 
                    specific outcomes or results.
                  </p>

                  <h2>9. Limitation of Liability</h2>
                  <p>
                    CareerMentorAI is not liable for any indirect, incidental, special, 
                    consequential, or punitive damages resulting from your use of our services.
                  </p>

                  <h2>10. Modifications to Service</h2>
                  <p>
                    We reserve the right to modify or discontinue our services at any time. 
                    We will provide reasonable notice of any significant changes.
                  </p>

                  <h2>11. Termination</h2>
                  <p>
                    We may terminate or suspend your account for violations of these terms. 
                    You may terminate your account at any time by contacting support.
                  </p>

                  <h2>12. Governing Law</h2>
                  <p>
                    These terms are governed by the laws of the State of California, United 
                    States, without regard to its conflict of law principles.
                  </p>

                  <h2>13. Contact Information</h2>
                  <p>
                    For questions about these Terms of Service, please contact us at{' '}
                    <a href="mailto:legal@careermentorai.org" className="text-indigo-600 hover:text-indigo-700">
                      legal@careermentorai.org
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