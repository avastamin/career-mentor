import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Brain, Target, Users, Globe, Sparkles, Award, Rocket, Heart } from 'lucide-react';
import { AnimatedCard } from '../components/AnimatedCard';

export const AboutPage = () => {
  const team = [

    {
      name: "Leaf",
      role: "Founder",
      image: "https://ibb.co/Jz8gpC1",
      description: "Young, dedicated entrepreneur that uses his experience and passion for AI prompting and technology to help others ."
    }
  ];

  const values = [
    {
      icon: Brain,
      title: "Innovation",
      description: "Pushing the boundaries of AI to transform career guidance"
    },
    {
      icon: Heart,
      title: "Empathy",
      description: "Understanding and supporting each individual's unique journey"
    },
    {
      icon: Target,
      title: "Excellence",
      description: "Delivering the highest quality guidance and insights"
    },
    {
      icon: Rocket,
      title: "Growth",
      description: "Fostering continuous learning and development"
    }
  ];

  return (
    <>
      <Helmet>
        <title>About Us - CareerMentorAI</title>
        <meta 
          name="description" 
          content="Learn about CareerMentorAI's mission to transform career development through AI-powered guidance and mentorship." 
        />
      </Helmet>

      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="pt-32 pb-16 bg-gradient-to-br from-indigo-600 to-indigo-800 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <motion.h1 
                className="text-5xl font-bold mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                Transforming Careers Through AI
              </motion.h1>
              <motion.p 
                className="text-xl text-indigo-100 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                At CareerMentorAI, we're revolutionizing career development by combining 
                cutting-edge artificial intelligence with human expertise to provide 
                personalized career guidance at scale.
              </motion.p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <AnimatedCard>
              <div className="p-8">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center">
                    <Globe className="w-8 h-8 text-indigo-600" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
                    <p className="text-gray-600">Empowering careers worldwide</p>
                  </div>
                </div>

                <div className="prose prose-lg max-w-none text-gray-600">
                  <p>
                    Founded in late 2024, CareerMentorAI emerged from a simple yet powerful idea: 
                    what if we could make expert career guidance accessible to everyone? 
                    Our mission is to democratize career development by leveraging artificial 
                    intelligence to provide personalized, actionable career advice to 
                    professionals at every stage of their journey.
                  </p>
                  <p>
                    We believe that everyone deserves access to high-quality career guidance, 
                    regardless of their background or location. By combining advanced AI 
                    technology with deep industry expertise, we're making this vision a reality.
                  </p>
                </div>
              </div>
            </AnimatedCard>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
              <p className="text-xl text-gray-600">The principles that guide everything we do</p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-8 h-8 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Team</h2>
              <p className="text-xl text-gray-600">Meet the experts behind CareerMentorAI</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {team.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <AnimatedCard>
                    <div className="p-6 text-center">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                      />
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                      <p className="text-indigo-600 font-medium mb-3">{member.role}</p>
                      <p className="text-gray-600">{member.description}</p>
                    </div>
                  </AnimatedCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-24 bg-gradient-to-br from-indigo-600 to-indigo-800 text-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
              {[
                { icon: Users, value: "50,000+", label: "Professionals Guided" },
                { icon: Brain, value: "1M+", label: "AI Analyses" },
                { icon: Award, value: "95%", label: "Success Rate" },
                { icon: Sparkles, value: "24/7", label: "AI Support" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="w-8 h-8" />
                  </div>
                  <div className="text-3xl font-bold mb-2">{stat.value}</div>
                  <div className="text-indigo-200">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};