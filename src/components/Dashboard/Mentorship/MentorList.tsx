import React from 'react';
import { motion } from 'framer-motion';
import { Star, MessageSquare, Calendar, ArrowRight } from 'lucide-react';
import { AnimatedCard } from '../../AnimatedCard';
import { AnimatedButton } from '../../AnimatedButton';

export const MentorList = () => {
  const mentors = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Senior Software Engineer at Google",
      expertise: ["System Design", "Frontend Development", "Career Growth"],
      rating: 4.9,
      reviews: 124,
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80"
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Tech Lead at Microsoft",
      expertise: ["Cloud Architecture", "Team Leadership", "Backend Development"],
      rating: 4.8,
      reviews: 98,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">Available Mentors</h2>
        <AnimatedButton variant="secondary" className="text-sm">
          View All
        </AnimatedButton>
      </div>

      <div className="space-y-4">
        {mentors.map((mentor) => (
          <AnimatedCard key={mentor.id}>
            <div className="p-6">
              <div className="flex items-start gap-4">
                <img
                  src={mentor.image}
                  alt={mentor.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{mentor.name}</h3>
                  <p className="text-gray-600 text-sm">{mentor.role}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">
                      {mentor.rating} ({mentor.reviews} reviews)
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {mentor.expertise.map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <AnimatedButton variant="secondary" className="text-sm p-2">
                    <MessageSquare className="w-4 h-4" />
                  </AnimatedButton>
                  <AnimatedButton variant="primary" className="text-sm p-2">
                    <Calendar className="w-4 h-4" />
                  </AnimatedButton>
                </div>
              </div>
            </div>
          </AnimatedCard>
        ))}
      </div>
    </div>
  );
};