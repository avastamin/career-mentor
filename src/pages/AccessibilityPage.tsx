import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Accessibility } from 'lucide-react';
import { AnimatedCard } from '../components/AnimatedCard';

export const AccessibilityPage = () => {
  return (
    <>
      <Helmet>
        <title>Accessibility Statement - CareerMentorAI</title>
        <meta 
          name="description" 
          content="Learn about CareerMentorAI's commitment to accessibility and inclusive design." 
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
                    <Accessibility className="w-8 h-8 text-indigo-600" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">Accessibility Statement</h1>
                    <p className="text-gray-600">Last updated: March 15, 2024</p>
                  </div>
                </div>

                <div className="prose prose-lg max-w-none">
                  <h2>Our Commitment</h2>
                  <p>
                    CareerMentorAI is committed to ensuring digital accessibility for people with 
                    disabilities. We are continually improving the user experience for everyone, 
                    and applying the relevant accessibility standards.
                  </p>

                  <h2>Conformance Status</h2>
                  <p>
                    We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 
                    level AA standards. These guidelines explain how to make web content more 
                    accessible for people with disabilities.
                  </p>

                  <h2>Accessibility Features</h2>
                  <p>Our website includes the following accessibility features:</p>
                  <ul>
                    <li>Keyboard navigation support</li>
                    <li>ARIA landmarks and labels</li>
                    <li>Alt text for images</li>
                    <li>Proper heading structure</li>
                    <li>Sufficient color contrast</li>
                    <li>Resizable text</li>
                    <li>Focus indicators</li>
                    <li>Skip navigation links</li>
                  </ul>

                  <h2>Assistive Technologies</h2>
                  <p>
                    Our platform is designed to be compatible with the following assistive 
                    technologies:
                  </p>
                  <ul>
                    <li>Screen readers</li>
                    <li>Screen magnification software</li>
                    <li>Speech recognition software</li>
                    <li>Keyboard-only navigation</li>
                  </ul>

                  <h2>Known Issues</h2>
                  <p>
                    While we strive for comprehensive accessibility, some content may have 
                    limitations. We are actively working to identify and resolve any 
                    accessibility issues.
                  </p>

                  <h2>Feedback</h2>
                  <p>
                    We welcome your feedback on the accessibility of CareerMentorAI. Please let us 
                    know if you encounter accessibility barriers:
                  </p>
                  <ul>
                    <li>
                      Email:{' '}
                      <a href="mailto:accessibility@careermentorai.org" className="text-indigo-600 hover:text-indigo-700">
                        accessibility@careermentorai.org
                      </a>
                    </li>
                    <li>Phone: +1 (850) 900-9281</li>
                  </ul>

                  <h2>Assessment Methods</h2>
                  <p>
                    We assess the accessibility of our platform through:
                  </p>
                  <ul>
                    <li>Regular automated testing</li>
                    <li>Manual testing with assistive technologies</li>
                    <li>User feedback and testing</li>
                    <li>Third-party accessibility audits</li>
                  </ul>

                  <h2>Additional Resources</h2>
                  <p>
                    For more information about web accessibility, we recommend:
                  </p>
                  <ul>
                    <li>
                      <a 
                        href="https://www.w3.org/WAI/standards-guidelines/wcag/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-700"
                      >
                        Web Content Accessibility Guidelines (WCAG)
                      </a>
                    </li>
                    <li>
                      <a 
                        href="https://www.w3.org/WAI/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-700"
                      >
                        W3C Web Accessibility Initiative (WAI)
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </AnimatedCard>
          </motion.div>
        </div>
      </div>
    </>
  );
};