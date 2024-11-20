import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Cookie } from 'lucide-react';
import { AnimatedCard } from '../components/AnimatedCard';

export const CookiePolicy = () => {
  return (
    <>
      <Helmet>
        <title>Cookie Policy - CareerMentorAI</title>
        <meta 
          name="description" 
          content="Learn about how CareerMentorAI uses cookies to improve your experience." 
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
                    <Cookie className="w-8 h-8 text-indigo-600" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">Cookie Policy</h1>
                    <p className="text-gray-600">Last updated: March 15, 2024</p>
                  </div>
                </div>

                <div className="prose prose-lg max-w-none">
                  <h2>What Are Cookies</h2>
                  <p>
                    Cookies are small text files that are placed on your computer or mobile device 
                    when you visit our website. They help us make our site work better for you 
                    and provide a more personalized experience.
                  </p>

                  <h2>How We Use Cookies</h2>
                  <p>We use cookies for several purposes, including:</p>
                  <ul>
                    <li>Essential cookies for site functionality</li>
                    <li>Analytics cookies to understand user behavior</li>
                    <li>Preference cookies to remember your settings</li>
                    <li>Authentication cookies to keep you signed in</li>
                  </ul>

                  <h2>Types of Cookies We Use</h2>
                  
                  <h3>Essential Cookies</h3>
                  <p>
                    These cookies are necessary for the website to function properly. They enable 
                    core functionality such as security, network management, and accessibility.
                  </p>

                  <h3>Analytics Cookies</h3>
                  <p>
                    We use analytics cookies to understand how visitors interact with our website, 
                    helping us improve our services and user experience.
                  </p>

                  <h3>Functionality Cookies</h3>
                  <p>
                    These cookies help us remember your preferences and settings to provide 
                    enhanced, more personal features.
                  </p>

                  <h3>Performance Cookies</h3>
                  <p>
                    These cookies collect information about how you use our website, helping us 
                    identify which pages are the most and least popular.
                  </p>

                  <h2>Managing Cookies</h2>
                  <p>
                    Most web browsers allow you to control cookies through their settings. You can:
                  </p>
                  <ul>
                    <li>View cookies stored on your computer</li>
                    <li>Delete all or specific cookies</li>
                    <li>Block cookies from being set</li>
                    <li>Allow or block cookies from specific websites</li>
                  </ul>

                  <h2>Third-Party Cookies</h2>
                  <p>
                    Some of our pages display content from external providers, such as YouTube, 
                    Facebook, and Twitter. To view this content, you may have to accept their 
                    specific terms and conditions, including their cookie policies.
                  </p>

                  <h2>Updates to This Policy</h2>
                  <p>
                    We may update this Cookie Policy from time to time. Any changes will be 
                    posted on this page with an updated revision date.
                  </p>

                  <h2>Contact Us</h2>
                  <p>
                    If you have any questions about our use of cookies, please contact us at{' '}
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