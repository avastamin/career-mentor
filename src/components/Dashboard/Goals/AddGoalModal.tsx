import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, Flag } from 'lucide-react';
import { AnimatedButton } from '../../AnimatedButton';
import type { Goal } from './GoalsList';

interface AddGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (goal: Goal) => void;
  initialGoal?: Goal | null;
}

export const AddGoalModal: React.FC<AddGoalModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialGoal
}) => {
  const [goal, setGoal] = useState<Goal>({
    id: '',
    title: '',
    type: 'short-term',
    deadline: '2 weeks',
    progress: 0,
    status: 'not-started',
    priority: 'medium',
    description: ''
  });

  useEffect(() => {
    if (initialGoal) {
      setGoal(initialGoal);
    } else {
      setGoal({
        id: Math.random().toString(36).substr(2, 9),
        title: '',
        type: 'short-term',
        deadline: '2 weeks',
        progress: 0,
        status: 'not-started',
        priority: 'medium',
        description: ''
      });
    }
  }, [initialGoal, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal.title.trim()) return;
    onSave(goal);
  };

  const modalVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.95,
      y: -20
    },
    visible: { 
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: -20,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          <motion.div
            className="relative bg-white rounded-xl shadow-xl p-6 w-full max-w-lg mx-4"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {initialGoal ? 'Edit Goal' : 'Add New Goal'}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Goal Title
                </label>
                <input
                  type="text"
                  value={goal.title}
                  onChange={(e) => setGoal({ ...goal, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter your goal"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={goal.description}
                  onChange={(e) => setGoal({ ...goal, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="Describe your goal"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    value={goal.type}
                    onChange={(e) => setGoal({ ...goal, type: e.target.value as Goal['type'] })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="short-term">Short Term</option>
                    <option value="mid-term">Mid Term</option>
                    <option value="long-term">Long Term</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    value={goal.priority}
                    onChange={(e) => setGoal({ ...goal, priority: e.target.value as Goal['priority'] })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deadline
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={goal.deadline}
                      onChange={(e) => setGoal({ ...goal, deadline: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 2 weeks"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={goal.status}
                    onChange={(e) => {
                      const status = e.target.value as Goal['status'];
                      const progress = status === 'completed' ? 100 : 
                                     status === 'in-progress' ? 50 : 0;
                      setGoal({ ...goal, status, progress });
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="not-started">Not Started</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6">
                <AnimatedButton
                  variant="secondary"
                  onClick={onClose}
                  type="button"
                >
                  Cancel
                </AnimatedButton>
                <AnimatedButton
                  variant="primary"
                  type="submit"
                >
                  {initialGoal ? 'Update Goal' : 'Add Goal'}
                </AnimatedButton>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};