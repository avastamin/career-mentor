import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Video, MessageSquare } from 'lucide-react';
import { AnimatedCard } from '../../AnimatedCard';
import { AnimatedButton } from '../../AnimatedButton';

export const UpcomingSessions = () => {
  const sessions = [
    {
      id: 1,
      mentor: "Sarah Johnson",
      date: "Tomorrow",
      time: "2:00 PM",
      type: "Video Call",
      duration: "45 min",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80"
    },
    {
      id: 2,
      mentor: "Michael Chen",
      date: "Next Tuesday",
      time: "11:00 AM",
      type: "Code Review",
      duration: "60 min",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80"
    }
  ];

  return (
    <AnimatedCard>
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Sessions</h2>
        
        <div className="space-y-4">
          {sessions.map((session) => (
            <motion.div
              key={session.id}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              whileHover={{ x: 4 }}
            >
              <img
                src={session.image}
                alt={session.mentor}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{session.mentor}</h3>
                <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {session.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {session.time}
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-1 text-sm text-indigo-600">
                  <Video className="w-4 h-4" />
                  {session.type} • {session.duration}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 flex gap-2">
          <AnimatedButton variant="secondary" className="flex-1">
            Schedule Session
          </AnimatedButton>
          <AnimatedButton variant="secondary" className="p-2">
            <MessageSquare className="w-5 h-5" />
          </AnimatedButton>
        </div>
      </div>
    </AnimatedCard>
  );
};