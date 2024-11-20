import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  ArrowRight,
  Target,
  BookOpen,
  Users,
  Award
} from 'lucide-react';
import { AnimatedCard } from '../../AnimatedCard';
import { AnimatedButton } from '../../AnimatedButton';

interface ActionItemsProps {
  recommendations: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
  };
  learningResources: {
    title: string;
    type: string;
    url: string;
    priority: string;
  }[];
}

export const ActionItems: React.FC<ActionItemsProps> = ({ 
  recommendations,
  learningResources
}) => {
  // Convert recommendations to action items
  const actionItems = [
    ...recommendations.immediate.map(rec => ({
      title: rec,
      type: "high-priority",
      deadline: "2 weeks",
      status: "not-started",
      icon: Target
    })),
    ...recommendations.shortTerm.map(rec => ({
      title: rec,
      type: "medium-priority",
      deadline: "1 month",
      status: "not-started",
      icon: BookOpen
    }))
  ].slice(0, 3); // Show top 3 priority items

  // Find completed items from learning resources
  const achievements = learningResources
    .filter(resource => resource.priority === 'high')
    .map(resource => ({
      title: "Learning Milestone",
      description: `Started ${resource.title}`,
      date: "This week",
      icon: Award
    }))
    .slice(0, 1);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-100";
      case "in-progress":
        return "text-blue-600 bg-blue-100";
      case "not-started":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getPriorityColor = (type: string) => {
    switch (type) {
      case "high-priority":
        return "text-red-600 bg-red-50";
      case "medium-priority":
        return "text-yellow-600 bg-yellow-50";
      case "recommended":
        return "text-green-600 bg-green-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <AnimatedCard>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-indigo-600" />
            <h2 className="text-lg font-semibold text-gray-900">Action Items</h2>
          </div>
          <AnimatedButton
            variant="secondary"
            className="text-sm flex items-center gap-2"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </AnimatedButton>
        </div>

        <div className="space-y-4">
          {actionItems.map((item, index) => (
            <motion.div
              key={index}
              className="p-4 border border-gray-100 rounded-lg hover:border-indigo-100 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${getPriorityColor(item.type)}`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900">{item.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                      {item.status === 'in-progress' ? 'In Progress' : 'To Do'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>Due in {item.deadline}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {achievements.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <h3 className="font-medium text-gray-900 mb-4">Recent Achievements</h3>
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-3 p-3 rounded-lg bg-green-50"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="p-2 rounded-lg bg-green-100">
                  <achievement.icon className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium text-green-900">{achievement.title}</h4>
                  <p className="text-sm text-green-700">{achievement.description}</p>
                  <p className="text-xs text-green-600 mt-1">{achievement.date}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-6">
          <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-indigo-600 mt-0.5" />
              <div>
                <p className="text-sm text-indigo-900 font-medium">AI Recommendation</p>
                <p className="text-sm text-indigo-700 mt-1">
                  {recommendations.immediate[0]}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedCard>
  );
};