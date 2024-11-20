import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Shield } from 'lucide-react';
import { AnimatedCard } from '../components/AnimatedCard';

export const GDPRPolicy = () => {
  return (
    <>
      <Helmet>
        <title>GDPR Policy - CareerMentorAI</title>
        <meta 
          name="description" 
          content="Learn about your rights under GDPR and how CareerMentorAI protects your data." 
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
                    <h1 className="text-3xl font-bold text-gray-900">GDPR Policy</h1>
                    <p className="text-gray-600">Last updated: March 15, 2024</p>
                  </div>
                </div>

                <div className="prose prose-lg max-w-none">
                  <h2>Introduction</h2>
                  <p>
                    CareerMentorAI is committed to protecting the privacy and rights of our users 
                    under the General Data Protection Regulation (GDPR). This policy outlines how 
                    we comply with GDPR requirements.
                  </p>

                  <h2>Your Rights Under GDPR</h2>
                  <p>Under GDPR, you have the following rights:</p>
                  <ul>
                    <li>The right to be informed about how your data is used</li>
                    <li>The right to access your personal data</li>
                    <li>The right to rectification of inaccurate data</li>
                    <li>The right to erasure ("right to be forgotten")</li>
                    <li>The right to restrict processing</li>
                    <li>The right to data portability</li>
                    <li>The right to object to data processing</li>
                    <li>Rights related to automated decision making and profiling</li>
                  </ul>

                  <h2>Data Processing Principles</h2>
                  <p>We process personal data following these principles:</p>
                  <ul>
                    <li>Lawfulness, fairness, and transparency</li>
                    <li>Purpose limitation</li>
                    <li>Data minimization</li>
                    <li>Accuracy</li>
                    <li>Storage limitation</li>
                    <li>Integrity and confidentiality</li>
                    <li>Accountability</li>
                  </ul>

                  <h2>Legal Basis for Processing</h2>
                  <p>We process your data under the following legal bases:</p>
                  <ul>
                    <li>Consent: When you explicitly agree to data processing</li>
                    <li>Contract: When processing is necessary for our services</li>
                    <li>Legal Obligation: When required by law</li>
                    <li>Legitimate Interests: When it benefits our business operations</li>
                  </ul>

                  <h2>Data Protection Measures</h2>
                  <p>
                    We implement appropriate technical and organizational measures to ensure data 
                    security, including:
                  </p>
                  <ul>
                    <li>Encryption of personal data</li>
                    <li>Regular security assessments</li>
                    <li>Staff training on data protection</li>
                    <li>Access controls and authentication</li>
                    <li>Regular backups and disaster recovery plans</li>
                  </ul>

                  <h2>International Data Transfers</h2>
                  <p>
                    When transferring data outside the EEA, we ensure appropriate safeguards are 
                    in place through:
                  </p>
                  <ul>
                    <li>Standard contractual clauses</li>
                    <li>Adequacy decisions</li>
                    <li>Binding corporate rules</li>
                  </ul>

                  <h2>Data Breach Procedures</h2>
                  <p>
                    In the event of a data breach, we will:
                  </p>
                  <ul>
                    <li>Notify relevant supervisory authorities within 72 hours</li>
                    <li>Inform affected individuals without undue delay</li>
                    <li>Document all breaches and our response</li>
                    <li>Take measures to mitigate any negative consequences</li>
                  </ul>

                  <h2>Contact Information</h2>
                  <p>
                    For any GDPR-related inquiries, please contact our Data Protection Officer at{' '}
                    <a href="mailto:dpo@careermentorai.org" className="text-indigo-600 hover:text-indigo-700">
                      dpo@careermentorai.org
                    </a>
                  </p>

                  <h2>Supervisory Authority</h2>
                  <p>
                    You have the right to lodge a complaint with a supervisory authority if you 
                    believe your rights under GDPR have been violated.
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