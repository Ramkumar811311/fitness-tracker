import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowRight, FaDumbbell, FaAppleAlt, FaCalculator, FaTools, FaUserPlus, FaInfoCircle } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import "../css/features.css";

const FeatureCard = ({
  title,
  description,
  link,
  requiresLogin,
  icon,
}) => {
  const { isAuthenticated } = useAuth();

  const locked = requiresLogin && !isAuthenticated;

  return (
    <motion.div
      className="feature-card"
      whileHover={{ y: -8 }}
      transition={{ duration: 0.25 }}
    >
      <div className="feature-icon">
        {icon}
      </div>

      <div className="flex-1">
        <div className="flex items-center justify-between gap-2 mb-3">
          <h3 className="text-xl font-bold text-gray-900">
            {title}
          </h3>

          {locked && (
            <span className="text-[10px] font-semibold bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full whitespace-nowrap">
              Login Required
            </span>
          )}
        </div>

        <p className="text-gray-500 text-sm leading-7">
          {description}
        </p>
      </div>

      <Link
        to={locked ? "/signin" : link}
        className="feature-button"
      >
        {locked ? "Sign In" : "Explore"}
        <FaArrowRight className="text-xs" />
      </Link>
    </motion.div>
  );
};

const Features = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      title: "Workout Database",
      description:
        "Discover exercises and workout routines designed to help you train smarter and reach your fitness goals.",
      link: "/workoutdatabase",
      requiresLogin: true,
      icon: <FaDumbbell />,
    },
    {
      title: "Nutrition Checker",
      description:
        "Check calories, protein, carbohydrates, fats, and other nutritional information for your food.",
      link: "/nutritionchecker",
      requiresLogin: true,
      icon: <FaAppleAlt />,
    },
    {
      title: "BMR Calculator",
      description:
        "Calculate your Basal Metabolic Rate and understand your daily energy requirements.",
      link: "/bmrcalculator",
      requiresLogin: true,
      icon: <FaCalculator />,
    },
    {
      title: "Workout Builder",
      description:
        "Create personalized workouts by selecting exercises, repetitions, sets, and training goals.",
      link: "/workoutbuilder",
      requiresLogin: true,
      icon: <FaTools />,
    },
    {
      title: "Create Account",
      description:
        "Create your free FitFusion account and unlock personalized fitness tools and progress tracking.",
      link: "/register",
      requiresLogin: false,
      icon: <FaUserPlus />,
    },
    {
      title: "About FitFusion",
      description:
        "Learn about our mission and how FitFusion helps you build healthier and more consistent habits.",
      link: "/AboutUs",
      requiresLogin: false,
      icon: <FaInfoCircle />,
    },
  ];

  return (
    <main className="features-page">
      {/* Header */}
      <section className="features-header">
        <span className="features-label">
          FITFUSION TOOLS
        </span>

        <h1>
          Everything you need to
          <span> get fitter.</span>
        </h1>

        <p>
          Powerful and simple tools to help you train, eat, track,
          and improve every day.
        </p>
      </section>

      {/* Login Notice */}
      {!isAuthenticated && (
        <motion.div
          className="login-notice"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <strong>Unlock all fitness tools</strong>
            <p>
              Create a free account to access workouts, nutrition,
              BMR calculator, and more.
            </p>
          </div>

          <Link to="/register">
            Create Account
            <FaArrowRight />
          </Link>
        </motion.div>
      )}

      {/* Feature Cards */}
      <motion.section
        className="features-grid"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.08,
            },
          },
        }}
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            variants={{
              hidden: {
                opacity: 0,
                y: 25,
              },
              visible: {
                opacity: 1,
                y: 0,
              },
            }}
          >
            <FeatureCard {...feature} />
          </motion.div>
        ))}
      </motion.section>
    </main>
  );
};

export default Features;