import React from 'react';
import { motion } from 'framer-motion';
import { Users, DollarSign, Brain, Star } from 'lucide-react';
import { AnimatedCard } from '../../AnimatedCard';
import { getAdminStats } from '../../../lib/admin';

export const AdminStats = () => {
  const [stats, setStats] = React.useState({
    total_users: 0,
    active_subscriptions: 0,
    total_analyses: 0,
    revenue_mtd: 0
  });

  React.useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await getAdminStats();
        setStats(data);
      } catch (error) {
        console.error('Error loading admin stats:', error);
      }
    };

    loadStats();
  }, []);

  const statCards = [
    {
      title: 'Total Users',
      value: stats.total_users,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Active Subscriptions',
      value: stats.active_subscriptions,
      icon: Star,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Total Analyses',
      value: stats.total_analyses,
      icon: Brain,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100'
    },
    {
      title: 'Revenue (MTD)',
      value: `$${stats.revenue_mtd.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <AnimatedCard key={index}>
          <motion.div 
            className="p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900">
              {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
            </h3>
            <p className="text-gray-600 mt-1">{stat.title}</p>
          </motion.div>
        </AnimatedCard>
      ))}
    </div>
  );
};