import React from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { CareerAnalysisForm } from "../components/CareerAnalysis";

export const CareerAnalysisPage = () => {
  return (
    <>
      <Helmet>
        <title>
          Career Analysis - Get AI-Powered Career Insights | CareerMentor
        </title>
        <meta
          name="description"
          content="Get personalized career analysis, skill gap assessment, and tailored recommendations powered by AI. Start your career transformation today."
        />
        <meta
          name="keywords"
          content="career analysis, skill assessment, career guidance, AI career advisor, professional development"
        />
        <link rel="canonical" href="https://careermentor.ai/career-analysis" />
      </Helmet>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen pt-24 pb-16 bg-gradient-to-br from-gray-50 to-white"
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center mb-12"
          >
            <h1 className="text-4xl font-bold mb-4">
              AI-Powered Career Analysis
            </h1>
            <p className="text-xl text-gray-600">
              Get personalized career insights and recommendations based on your
              profile
            </p>
          </motion.div>
          <CareerAnalysisForm />
        </div>
      </motion.div>
    </>
  );
};
