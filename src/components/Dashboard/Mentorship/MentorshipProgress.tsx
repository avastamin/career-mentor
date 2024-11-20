import React from 'react';
import { motion } from 'framer-motion';
import { Users, Clock, Target } from 'lucide-react';
import { AnimatedCard } from '../../AnimatedCard';
import { useAnimations } from '../../../hooks/useAnimations';

export const MentorshipProgress = () => {
  const { progressBarVariants } = useAnimations();

  const mentorshipStats = {
    sessionCompleted: 12,
    totalHours: 18,
    goalsAchieved: 5,
    nextSession: "Tomorrow, 2:00 PM",
    currentMentor: "Sarah Johnson",
    progress: 75
  };

  return (
    <AnimatedCard>
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Mentorship Progress</h2>
        
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Overall Progress</span>
            <span className="text-sm font-medium text-gray-900">
              {mentorshipStats.progress}%
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-indigo-600 rounded-full"
              variants={progressBarVariants}
              initial="initial"
              animate="animate"
              custom={mentorshipStats.progress}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-600">Sessions</p>
              <p className="font-medium">{mentorshipStats.sessionCompleted}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-600">Hours</p>
              <p className="font-medium">{mentorshipStats.totalHours}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-600">Goals</p>
              <p className="font-medium">{mentorshipStats.goalsAchieved}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Current Mentor</p>
              <p className="font-medium text-gray-900">{mentorshipStats.currentMentor}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Next Session</p>
              <p className="font-medium text-gray-900">{mentorshipStats.nextSession}</p>
            </div>
          </div>
        </div>
      </div>
    </AnimatedCard>
  );
};