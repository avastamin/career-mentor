import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Crown,
  Star,
  Sparkles,
  X,
  Check,
  Users,
  Brain,
  Target,
  BookOpen,
  Gem,
  Zap,
  Loader,
} from "lucide-react";
import { AnimatedButton } from "../AnimatedButton";
import { useAuth } from "../../contexts/AuthContext";
import { createCheckoutSession } from "../../lib/stripe";
import { supabase } from "../../lib/supabase";

interface PricingPlansModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PricingPlansModal: React.FC<PricingPlansModalProps> = ({
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /*   useEffect(() => {
    const SUPABASE_FUNCTION_URL =
      "https://exsjlgkzfbjykpmzbqws.supabase.co/functions/v1/create-checkout";

    console.log(
      "import.meta.env.VITE_SUPABASE_ANON_KEY",
      import.meta.env.VITE_SUPABASE_ANON_KEY
    );
    async function callEdgeFunction() {
      try {
        const response = await fetch(SUPABASE_FUNCTION_URL, {
          method: "POST",
          body: JSON.stringify({
            priceId: "price_12345",
            successUrl: "https://example.com/success",
            cancelUrl: "https://example.com/cancel",
          }),
          headers: {
            "Content-Type": "application/json",
            apikey: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4c2psZ2t6ZmJqeWtwbXpicXdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE1MzA5MTgsImV4cCI6MjA0NzEwNjkxOH0.KuQn2oaJqxT9cY9co9yxv9Zcy5_m1BT0ULIlKWjmNw8`,
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsImtpZCI6IjNiSE1hUEpKSW5wSHVMZTciLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2V4c2psZ2t6ZmJqeWtwbXpicXdzLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiIwZTJlNWRkMC01YTM4LTQxYTAtYWUyYS0wYmFjZjA1NzE0NjAiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzMyMTE1ODI5LCJpYXQiOjE3MzIxMTIyMjksImVtYWlsIjoicnVodWxAZGVtby5jb20iLCJwaG9uZSI6IiIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6ImVtYWlsIiwicHJvdmlkZXJzIjpbImVtYWlsIl19LCJ1c2VyX21ldGFkYXRhIjp7ImVtYWlsIjoicnVodWxAZGVtby5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZ1bGxfbmFtZSI6IlJ1aHVsIiwicGhvbmVfdmVyaWZpZWQiOmZhbHNlLCJzdWIiOiIwZTJlNWRkMC01YTM4LTQxYTAtYWUyYS0wYmFjZjA1NzE0NjAifSwicm9sZSI6ImF1dGhlbnRpY2F0ZWQiLCJhYWwiOiJhYWwxIiwiYW1yIjpbeyJtZXRob2QiOiJwYXNzd29yZCIsInRpbWVzdGFtcCI6MTczMjA5OTY2OH1dLCJzZXNzaW9uX2lkIjoiYWZkMzlkMzMtZDE4MC00N2FiLWE2ZTMtZTkxNWYxOWEwZmVlIiwiaXNfYW5vbnltb3VzIjpmYWxzZX0.89NPVxPhlNJcy0HyPKmfvNnx0J7sAR-jaasJYTFP9n0`, // Use the anon key
          },
        });

        const data = await response.json();
        console.log("Function response:", data);
      } catch (error) {
        console.error("Error calling Edge Function:", error);
      }
    }

    callEdgeFunction();
  }, []);
 */
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const plans = [
    {
      name: "Free",
      price: "0",
      description: "Basic career analysis preview",
      icon: Star,
      features: [
        "Single basic analysis",
        "Basic skill gap identification",
        "Limited learning resources",
        "Basic career recommendations",
      ],
    },
    {
      name: "Pro",
      price: "19",
      icon: Crown,
      priceId: "price_1QMzcALbngEU6IxBCH6dSTSk",
      description: "Enhanced career guidance",
      features: [
        "10 analyses per month",
        "Full skill gap analysis",
        "Advanced market dynamics",
        "AI Resume builder",
        "Email support",
        "Basic progress tracking",
        "Advanced Network Strategies",
        {
          text: "Personal AI",
          badge: {
            icon: Zap,
            text: "GPT-3.5",
          },
        },
      ],
    },
    {
      name: "Premium",
      price: "49",
      popular: true,
      priceId: "price_1QMzXsLbngEU6IxBPIeuYKYP",
      description: "Complete career development",
      icon: Gem,
      features: [
        "Everything in Pro",
        "Unlimited analyses",
        "Professional visibility",
        "Advanced learning paths",
        "Interview preparation",
        "Priority support",
        "Advanced market positioning",
        "Strategic career development",
        "Career transition planning",
        {
          text: "Personal AI",
          badge: {
            icon: Zap,
            text: "GPT-4",
          },
        },
      ],
    },
  ];

  const handleSubscription = async (plan: (typeof plans)[0]) => {
    if (isProcessing) return;

    try {
      setIsProcessing(true);
      setError(null);

      if (!plan.priceId) {
        onClose();
        return;
      }

      const { error: checkoutError } = await createCheckoutSession(
        plan.priceId
      );

      if (checkoutError) {
        console.error("Checkout error:", checkoutError);
        setError(checkoutError.message || "Failed to start checkout process");
      } else {
        onClose();
      }
    } catch (err) {
      console.error("Subscription error:", err);
      setError("An unexpected error occurred");
    } finally {
      setIsProcessing(false);
    }
  };

  const getButtonText = (plan: (typeof plans)[0]) => {
    if (!userProfile) return "Get Started";

    if (userProfile.role === plan.name.toLowerCase()) {
      return "Current Plan";
    }

    if (plan.name === "Free") {
      return userProfile.role === "pro" || userProfile.role === "premium"
        ? "Switch to Free"
        : "Current Plan";
    }

    return "Upgrade";
  };

  const getButtonDisabled = (plan: (typeof plans)[0]) => {
    if (!userProfile) return false;
    return userProfile.role === plan.name.toLowerCase();
  };

  const getButtonStyle = (plan: (typeof plans)[0]) => {
    if (plan.name === "Free") {
      return "bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200";
    }
    if (plan.name === "Premium") {
      return "bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white border-0";
    }
    return "";
  };

  const features = [
    { icon: Brain, label: "AI Analysis" },
    { icon: Target, label: "Career Paths" },
    { icon: BookOpen, label: "Learning" },
    { icon: Users, label: "Mentorship" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-8 bg-white rounded-xl shadow-xl z-[61] overflow-hidden flex flex-col"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div className="p-6 pb-4 flex-shrink-0 border-b border-gray-100">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="text-center">
                <h2 className="text-3xl font-bold mb-2">Choose Your Plan</h2>
                <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                  Select the perfect plan to accelerate your career growth
                </p>
              </div>
            </div>

            <div className="flex-1 px-6 py-4 overflow-auto">
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 text-red-600">
                    <X className="w-5 h-5" />
                    <p>{error}</p>
                  </div>
                </div>
              )}

              <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {plans.map((plan, index) => (
                  <motion.div
                    key={plan.name}
                    className={`relative rounded-xl border-2 ${
                      plan.popular
                        ? "border-yellow-400 shadow-lg shadow-yellow-100"
                        : plan.name === "Pro"
                        ? "border-indigo-500"
                        : "border-gray-200"
                    } p-5 flex flex-col bg-white mt-4`}
                    whileHover={{ y: -4 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  >
                    {plan.popular && (
                      <motion.div
                        className="absolute -top-4 left-1/2 -translate-x-1/2 z-10"
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                      >
                        <span className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-4 py-1.5 rounded-full text-sm font-medium shadow-lg flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          Most Popular
                        </span>
                      </motion.div>
                    )}

                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className={`w-10 h-10 rounded-lg ${
                          plan.name === "Premium"
                            ? "bg-yellow-100"
                            : plan.name === "Pro"
                            ? "bg-indigo-100"
                            : "bg-gray-100"
                        } flex items-center justify-center`}
                      >
                        <plan.icon
                          className={`w-5 h-5 ${
                            plan.name === "Premium"
                              ? "text-yellow-600"
                              : plan.name === "Pro"
                              ? "text-indigo-600"
                              : "text-gray-600"
                          }`}
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-xl leading-none mb-1">
                          {plan.name}
                        </h3>
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-bold">
                            ${plan.price}
                          </span>
                          <span className="text-gray-600">/month</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 flex-1 mb-4">
                      {plan.features.map((feature, featureIndex) => (
                        <motion.div
                          key={featureIndex}
                          className="flex items-start gap-2"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: featureIndex * 0.1 }}
                        >
                          <Check
                            className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                              plan.name === "Premium"
                                ? "text-yellow-500"
                                : plan.name === "Pro"
                                ? "text-indigo-500"
                                : "text-green-500"
                            }`}
                          />
                          <span className="text-gray-600">
                            {typeof feature === "string" ? (
                              feature
                            ) : (
                              <span className="flex items-center gap-2">
                                {feature.text}
                                {feature.badge && (
                                  <span
                                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                      feature.badge.text === "GPT-4"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-indigo-100 text-indigo-800"
                                    }`}
                                  >
                                    <feature.badge.icon className="w-3 h-3 mr-1" />
                                    {feature.badge.text}
                                  </span>
                                )}
                              </span>
                            )}
                          </span>
                        </motion.div>
                      ))}
                    </div>

                    <AnimatedButton
                      onClick={() => handleSubscription(plan)}
                      className={`w-full ${getButtonStyle(plan)}`}
                      disabled={isProcessing || getButtonDisabled(plan)}
                    >
                      {isProcessing && plan.priceId ? (
                        <div className="flex items-center justify-center gap-2">
                          <Loader className="w-5 h-5 animate-spin" />
                          <span>Processing...</span>
                        </div>
                      ) : (
                        getButtonText(plan)
                      )}
                    </AnimatedButton>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex-shrink-0 bg-gray-50">
              <div className="grid grid-cols-4 gap-6 max-w-2xl mx-auto mb-4">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    className="text-center"
                    whileHover={{ y: -4 }}
                  >
                    <motion.div
                      className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-sm"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.7 }}
                    >
                      <feature.icon className="w-5 h-5 text-indigo-600" />
                    </motion.div>
                    <span className="text-sm text-gray-600">
                      {feature.label}
                    </span>
                  </motion.div>
                ))}
              </div>

              <p className="text-gray-500 text-sm text-center">
                All plans include SSL security and basic email support
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
