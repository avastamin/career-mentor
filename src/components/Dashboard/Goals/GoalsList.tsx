import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Target, Clock, Calendar, Star } from 'lucide-react';
import { AnimatedCard } from '../../AnimatedCard';
import { AnimatedButton } from '../../AnimatedButton';
import { AddGoalModal } from './AddGoalModal';
import { DraggableProgress } from './DraggableProgress';

export interface Goal {
  id: string;
  title: string;
  type: 'short-term' | 'mid-term' | 'long-term';
  deadline: string;
  progress: number;
  status: 'not-started' | 'in-progress' | 'completed';
  priority: 'high' | 'medium' | 'low';
  description?: string;
}

export const GoalsList = () => {
  const [goals, setGoals] = useState<Goal[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('careerGoals') || '[]');
    } catch {
      return [];
    }
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  // Update localStorage when goals change
  useEffect(() => {
    localStorage.setItem('careerGoals', JSON.stringify(goals));
    // Dispatch storage event to update other components
    window.dispatchEvent(new Event('storage'));
  }, [goals]);

  const handleSaveGoal = (goal: Goal) => {
    if (editingGoal) {
      setGoals(goals.map(g => g.id === editingGoal.id ? goal : g));
    } else {
      setGoals([...goals, goal]);
    }
    setShowAddModal(false);
    setEditingGoal(null);
  };

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
    setShowAddModal(true);
  };

  const handleDeleteGoal = (goalId: string) => {
    setGoals(goals.filter(g => g.id !== goalId));
  };

  const handleProgressChange = (goalId: string, newProgress: number) => {
    setGoals(currentGoals => {
      return currentGoals.map(goal => {
        if (goal.id !== goalId) return goal;

        // Update status based on progress
        let status: Goal['status'] = 'not-started';
        if (newProgress >= 100) {
          status = 'completed';
          newProgress = 100; // Ensure progress doesn't exceed 100
        } else if (newProgress > 0) {
          status = 'in-progress';
        }

        return {
          ...goal,
          progress: newProgress,
          status
        };
      });
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'in-progress':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-yellow-600 bg-yellow-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-green-600 bg-green-50';
    }
  };

  const getProgressBarColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-600';
      case 'medium':
        return 'bg-yellow-600';
      case 'low':
        return 'bg-green-600';
      default:
        return 'bg-indigo-600';
    }
  };

  return (
    <>
      <AnimatedCard>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Target className="w-6 h-6 text-indigo-600" />
              <h2 className="text-lg font-semibold text-gray-900">Your Goals</h2>
            </div>
            <AnimatedButton
              variant="primary"
              onClick={() => {
                setEditingGoal(null);
                setShowAddModal(true);
              }}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Goal
            </AnimatedButton>
          </div>

          <div className="space-y-4">
            {goals.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Goals Yet</h3>
                <p className="text-gray-600 mb-6">
                  Start by adding your first career goal
                </p>
              </div>
            ) : (
              goals.map((goal) => (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 border border-gray-100 rounded-lg hover:border-indigo-100 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900">{goal.title}</h3>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(goal.status)}`}>
                            {goal.status.replace('-', ' ')}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(goal.priority)}`}>
                            {goal.priority} priority
                          </span>
                        </div>
                      </div>
                      {goal.description && (
                        <p className="text-sm text-gray-600 mb-2">{goal.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{goal.type}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>Due in {goal.deadline}</span>
                        </div>
                      </div>
                      <div className="mt-3">
                        <DraggableProgress
                          progress={goal.progress}
                          onChange={(newProgress) => handleProgressChange(goal.id, newProgress)}
                          color={getProgressBarColor(goal.priority)}
                        />
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-100 flex justify-end gap-2">
                        <AnimatedButton
                          variant="secondary"
                          onClick={() => handleEditGoal(goal)}
                          className="text-sm py-1"
                        >
                          Edit
                        </AnimatedButton>
                        <AnimatedButton
                          variant="secondary"
                          onClick={() => handleDeleteGoal(goal.id)}
                          className="text-sm py-1 text-red-600 hover:text-red-700"
                        >
                          Delete
                        </AnimatedButton>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </AnimatedCard>

      <AddGoalModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditingGoal(null);
        }}
        onSave={handleSaveGoal}
        initialGoal={editingGoal}
      />
    </>
  );
};