import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Zap, 
  DollarSign, 
  Users,
  Building,
  ChevronRight,
  LineChart,
  ArrowUpRight,
  Target,
  Globe
} from 'lucide-react';
import { AnimatedCard } from '../../AnimatedCard';

interface MarketDynamicsProps {
  dynamics: {
    emergingTechnologies: string[];
    skillDemand: string[];
    compensationTrends: string;
    workCulture: string;
  };
}

export const MarketDynamics = ({ dynamics }: MarketDynamicsProps) => {
  if (!dynamics) return null;

  // Pre-compute styles for better performance
  const cardStyle = {
    willChange: 'transform',
    transform: 'translateZ(0)', // Force GPU acceleration
  };

  const itemVariants = {
    initial: { 
      opacity: 0, 
      x: -10,
      transition: { duration: 0.2 }
    },
    visible: (i: number) => ({ 
      opacity: 1, 
      x: 0,
      transition: { 
        duration: 0.2,
        delay: i * 0.05,
        ease: 'easeOut'
      }
    }),
    hover: { 
      x: 4,
      transition: { 
        duration: 0.2,
        ease: 'easeOut'
      }
    }
  };

  const iconVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.1,
      transition: {
        duration: 0.2,
        ease: 'easeOut'
      }
    }
  };

  return (
    <AnimatedCard>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
            <LineChart className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Market Dynamics</h2>
            <p className="text-gray-600">Current industry trends and market analysis</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Emerging Technologies */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-indigo-600" />
              <h3 className="font-medium text-gray-900">Emerging Technologies</h3>
            </div>
            <div className="space-y-2">
              {dynamics.emergingTechnologies.map((tech, index) => (
                <motion.div
                  key={index}
                  style={cardStyle}
                  className="p-3 bg-indigo-50 text-indigo-700 rounded-lg cursor-pointer"
                  custom={index}
                  initial="initial"
                  animate="visible"
                  whileHover="hover"
                  variants={itemVariants}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ArrowUpRight className="w-4 h-4" />
                      <span className="font-medium">{tech}</span>
                    </div>
                    <motion.div
                      variants={iconVariants}
                      className="w-2 h-2 rounded-full bg-indigo-400"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Skill Demand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-indigo-600" />
              <h3 className="font-medium text-gray-900">In-Demand Skills</h3>
            </div>
            <div className="space-y-2">
              {dynamics.skillDemand.map((skill, index) => (
                <motion.div
                  key={index}
                  style={cardStyle}
                  className="p-3 bg-green-50 text-green-700 rounded-lg cursor-pointer"
                  custom={index}
                  initial="initial"
                  animate="visible"
                  whileHover="hover"
                  variants={itemVariants}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ChevronRight className="w-4 h-4" />
                      <span className="font-medium">{skill}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-1.5 h-1.5 rounded-full bg-green-${400 + i * 100}`}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mt-8">
          {/* Compensation Trends */}
          <div className="p-6 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Compensation Trends</h3>
                <p className="text-sm text-gray-600">Market salary insights</p>
              </div>
            </div>
            <p className="text-gray-600 leading-relaxed">{dynamics.compensationTrends}</p>
            <div className="mt-4 flex items-center gap-4">
              <motion.div
                className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                whileHover={{ scale: 1.05 }}
                style={cardStyle}
              >
                <TrendingUp className="w-4 h-4 inline-block mr-1" />
                Market Growth
              </motion.div>
              <motion.div
                className="px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium"
                whileHover={{ scale: 1.05 }}
                style={cardStyle}
              >
                <Users className="w-4 h-4 inline-block mr-1" />
                High Demand
              </motion.div>
            </div>
          </div>

          {/* Work Culture */}
          <div className="p-6 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <Building className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Work Culture</h3>
                <p className="text-sm text-gray-600">Industry environment</p>
              </div>
            </div>
            <p className="text-gray-600 leading-relaxed">{dynamics.workCulture}</p>
            <div className="mt-4 flex items-center gap-4">
              <motion.div
                className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                whileHover={{ scale: 1.05 }}
                style={cardStyle}
              >
                <Globe className="w-4 h-4 inline-block mr-1" />
                Industry Trends
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedCard>
  );
};