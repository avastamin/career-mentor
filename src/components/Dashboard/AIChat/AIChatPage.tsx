import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Bot, Send, User, Crown, Gem, Sparkles, Lock, Zap } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { useCareerAnalysis } from '../../../contexts/CareerAnalysisContext';
import { AnimatedCard } from '../../AnimatedCard';
import { AnimatedButton } from '../../AnimatedButton';
import { PricingPlansModal } from '../PricingPlansModal';
import { CareerAnalysisPrompt } from '../CareerAnalysisPrompt';
import { supabase } from '../../../lib/supabase';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIChatPageProps {}

export const AIChatPage: React.FC<AIChatPageProps> = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user, userProfile } = useAuth();
  const { analysisResults } = useCareerAnalysis();

  const isProUser = userProfile?.role === 'pro';
  const isPremiumUser = userProfile?.role === 'premium';
  const canAccessChat = isProUser || isPremiumUser;
  const hasCompletedAnalysis = !!analysisResults;

  // Add initial welcome message when component mounts
  useEffect(() => {
    if (canAccessChat && hasCompletedAnalysis) {
      const welcomeMessage: Message = {
        role: 'assistant',
        content: `Hello! I'm your ${isPremiumUser ? 'Premium' : 'Pro'} Personal AI Assistant. I'm here to help you with career guidance, skill development, and professional growth. What would you like to discuss today?`,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [canAccessChat, isPremiumUser, hasCompletedAnalysis]);

  // Only scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !canAccessChat) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await openai.chat.completions.create({
        model: isPremiumUser ? 'gpt-4' : 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are CareerMentor AI, a professional career advisor. Provide ${
              isPremiumUser ? 'executive-level' : 'professional'
            } career guidance and mentorship. Be concise but insightful.`
          },
          ...messages.map(msg => ({ role: msg.role, content: msg.content })),
          { role: 'user', content: input.trim() }
        ],
        temperature: 0.7,
        max_tokens: isPremiumUser ? 500 : 300
      });

      const assistantMessage: Message = {
        role: 'assistant',
        content: response.choices[0].message.content || 'I apologize, but I was unable to generate a response.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'I apologize, but I encountered an error. Please try again.',
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!canAccessChat) {
    return (
      <>
        <Helmet>
          <title>Personal AI - CareerMentor</title>
        </Helmet>
        <div className="h-full min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md"
          >
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-8 h-8 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Upgrade to Access Personal AI</h2>
            <p className="text-gray-600 mb-8">
              Get personalized career guidance and mentorship with our AI assistant feature. Available for Pro and Premium members.
            </p>
            <AnimatedButton
              variant="primary"
              onClick={() => setShowPricingModal(true)}
            >
              View Plans
            </AnimatedButton>
          </motion.div>
        </div>
        <PricingPlansModal
          isOpen={showPricingModal}
          onClose={() => setShowPricingModal(false)}
        />
      </>
    );
  }

  if (!hasCompletedAnalysis) {
    return <CareerAnalysisPrompt />;
  }

  return (
    <>
      <Helmet>
        <title>Personal AI - CareerMentor</title>
      </Helmet>
      <div className="h-full min-h-[calc(100vh-4rem)] flex flex-col">
        <AnimatedCard className="flex-1 flex flex-col">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isPremiumUser ? (
                <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                  <Gem className="w-5 h-5 text-yellow-600" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                  <Crown className="w-5 h-5 text-indigo-600" />
                </div>
              )}
              <div>
                <h2 className="font-semibold">Personal AI Assistant</h2>
                <p className="text-sm text-gray-600">
                  {isPremiumUser ? 'Premium AI Assistant' : 'Pro AI Assistant'}
                </p>
              </div>
            </div>
            {isPremiumUser ? (
              <div className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium flex items-center gap-1">
                <Sparkles className="w-4 h-4" />
                GPT-4 Powered
              </div>
            ) : (
              <div className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium flex items-center gap-1">
                <Zap className="w-4 h-4" />
                GPT-3.5
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-start gap-3 ${
                  message.role === 'assistant' ? 'flex-row' : 'flex-row-reverse'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  message.role === 'assistant' 
                    ? isPremiumUser 
                      ? 'bg-yellow-100' 
                      : 'bg-indigo-100'
                    : 'bg-gray-100'
                }`}>
                  {message.role === 'assistant' ? (
                    <Bot className={`w-4 h-4 ${
                      isPremiumUser ? 'text-yellow-600' : 'text-indigo-600'
                    }`} />
                  ) : (
                    <User className="w-4 h-4 text-gray-600" />
                  )}
                </div>
                <div className={`flex-1 p-4 rounded-lg ${
                  message.role === 'assistant'
                    ? 'bg-gray-50'
                    : isPremiumUser
                    ? 'bg-yellow-50'
                    : 'bg-indigo-50'
                }`}>
                  <p className="text-gray-900 whitespace-pre-wrap">{message.content}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 text-gray-500"
              >
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="p-4 border-t border-gray-100">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything about your career..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                disabled={isLoading}
              />
              <AnimatedButton
                type="submit"
                variant="primary"
                disabled={isLoading || !input.trim()}
                className={isPremiumUser 
                  ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700' 
                  : 'bg-indigo-600 hover:bg-indigo-700'
                }
              >
                <Send className="w-5 h-5" />
              </AnimatedButton>
            </div>
          </form>
        </AnimatedCard>
      </div>
    </>
  );
};