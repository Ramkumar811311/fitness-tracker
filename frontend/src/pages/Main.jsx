import React from "react";
import Lottie from "lottie-react";
import bannerAnimation from "../assets/banner-animation.json";
import bannerAnimation2 from "../assets/banner-animation2.json";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../css/main.css";

const Main = () => {
  const { isAuthenticated } = useAuth();

  return (
    <main className="fitness-home">
      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <span className="hero-badge">
              <span className="pulse-dot"></span>
              YOUR FITNESS. YOUR JOURNEY.
            </span>

            <h1>
              Build a Better
              <span> You.</span>
            </h1>

            <p className="hero-description">
              Train smarter, eat better, and stay consistent. FitFusion gives
              you everything you need to turn your fitness goals into reality.
            </p>

            <div className="hero-buttons">
              <Link to="/features" className="primary-btn">
                Explore Features
                <span>→</span>
              </Link>

              {!isAuthenticated && (
                <Link to="/register" className="secondary-btn">
                  Get Started
                </Link>
              )}
            </div>

            <div className="hero-stats">
              <div>
                <strong>10+</strong>
                <span>Fitness Tools</span>
              </div>

              <div className="stat-divider"></div>

              <div>
                <strong>24/7</strong>
                <span>Track Your Progress</span>
              </div>

              <div className="stat-divider"></div>

              <div>
                <strong>100%</strong>
                <span>Goal Focused</span>
              </div>
            </div>
          </div>

          <div className="hero-animation">
            <div className="animation-glow"></div>

            <Lottie
              animationData={bannerAnimation}
              className="main-lottie"
            />

            <div className="floating-card floating-card-one">
              <span className="floating-icon">🔥</span>
              <div>
                <strong>Stay Consistent</strong>
                <small>Every day matters</small>
              </div>
            </div>

            <div className="floating-card floating-card-two">
              <span className="floating-icon">💪</span>
              <div>
                <strong>Keep Moving</strong>
                <small>Progress over perfection</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES INTRO */}
      <section className="tools-section">
        <div className="section-heading">
          <span className="section-label">POWERFUL TOOLS</span>

          <h2>
            Everything you need to
            <span> reach your goals.</span>
          </h2>

          <p>
            From workouts to nutrition, FitFusion puts your fitness journey
            in one simple place.
          </p>
        </div>

        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon green-icon">🏋️</div>
            <span className="feature-number">01</span>

            <h3>Learn. Track. Improve.</h3>

            <p>
              Build better workout habits, track your progress, and understand
              what works best for your body.
            </p>

            <Link to="/workoutdatabase" className="feature-link">
              Explore workouts →
            </Link>
          </div>

          <div className="feature-card featured-card">
            <div className="feature-icon orange-icon">🥗</div>
            <span className="feature-number">02</span>

            <h3>Fuel Your Body.</h3>

            <p>
              Make smarter nutrition decisions and keep your meals aligned
              with your fitness goals.
            </p>

            <Link to="/nutritionchecker" className="feature-link">
              Check nutrition →
            </Link>
          </div>

          <div className="feature-card">
            <div className="feature-icon blue-icon">📊</div>
            <span className="feature-number">03</span>

            <h3>Know Your Numbers.</h3>

            <p>
              Understand your BMR and use meaningful data to create a smarter
              and more personalized fitness routine.
            </p>

            <Link to="/bmrcalculator" className="feature-link">
              Calculate BMR →
            </Link>
          </div>
        </div>
      </section>

      {/* JOURNEY SECTION */}
      <section className="journey-section">
        <div className="journey-animation">
          <Lottie
            animationData={bannerAnimation2}
            className="journey-lottie"
          />
        </div>

        <div className="journey-content">
          <span className="section-label">YOUR JOURNEY STARTS HERE</span>

          <h2>
            Small steps.
            <span> Big changes.</span>
          </h2>

          <p>
            Fitness isn't about being perfect. It's about showing up,
            staying consistent, and becoming a little better every day.
          </p>

          <div className="journey-points">
            <div>
              <span>✓</span>
              <p>Build personalized workout routines</p>
            </div>

            <div>
              <span>✓</span>
              <p>Track your nutrition and daily habits</p>
            </div>

            <div>
              <span>✓</span>
              <p>Monitor your fitness progress</p>
            </div>

            <div>
              <span>✓</span>
              <p>Stay motivated toward your goals</p>
            </div>
          </div>

          {!isAuthenticated && (
            <div className="journey-buttons">
              <Link to="/register" className="primary-btn">
                Start Your Journey
                <span>→</span>
              </Link>

              <Link to="/signin" className="text-btn">
                Already a member? Sign in
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="final-cta">
        <div className="cta-content">
          <span className="section-label">READY?</span>

          <h2>
            Your strongest version
            <span> starts today.</span>
          </h2>

          <p>
            Stop waiting for the perfect time. Start building the habits that
            will change your life.
          </p>

          <Link
            to={isAuthenticated ? "/workoutbuilder" : "/register"}
            className="cta-button"
          >
            {isAuthenticated ? "Build Your Workout" : "Join FitFusion"}
            <span>→</span>
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Main;