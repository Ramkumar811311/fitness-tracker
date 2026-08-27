import React from "react";
import { Link } from "react-router-dom";
import "../css/footer.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faTwitter,
  faInstagram,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import {
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";

const Footer = () => {
  return (
    <footer className="fit-footer">
      <div className="footer-container">

        {/* Top CTA */}
        <div className="footer-cta">
          <div>
            <span className="footer-label">FITFUSION</span>
            <h2>
              Your fitness journey
              <span> starts today.</span>
            </h2>
            <p>
              Train smarter, eat better, and become a stronger version of
              yourself.
            </p>
          </div>

          <Link to="/features" className="footer-cta-button">
            Explore Features
            <FontAwesomeIcon icon={faArrowRight} />
          </Link>
        </div>

        {/* Main Footer */}
        <div className="footer-grid">

          {/* Brand */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <img
                src="/FitnessAppLogo.png"
                alt="FitFusion Logo"
              />

              <div>
                <h3>FitFusion</h3>
                <span>BUILD • MOVE • GROW</span>
              </div>
            </Link>

            <p>
              Your all-in-one fitness companion for personalized workouts,
              nutrition guidance, and health tracking.
            </p>

            <div className="social-links">
              <a
                href="#"
                aria-label="Facebook"
                className="social facebook"
              >
                <FontAwesomeIcon icon={faFacebookF} />
              </a>

              <a
                href="https://x.com/r_amkum_ar?s=08"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="social twitter"
              >
                <FontAwesomeIcon icon={faTwitter} />
              </a>

              <a
                href="https://www.instagram.com/__.ram.07"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="social instagram"
              >
                <FontAwesomeIcon icon={faInstagram} />
              </a>

              <a
                href="#"
                aria-label="YouTube"
                className="social youtube"
              >
                <FontAwesomeIcon icon={faYoutube} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-column">
            <h3>Explore</h3>

            <Link to="/">Home</Link>
            <Link to="/features">Features</Link>
            <Link to="/about">About Us</Link>
            <Link to="/contact">Contact Us</Link>
          </div>

          {/* Features */}
          <div className="footer-column">
            <h3>Fitness Tools</h3>

            <Link to="/workoutdatabase">Workout Database</Link>
            <Link to="/nutritionchecker">Nutrition Checker</Link>
            <Link to="/bmrcalculator">BMR Calculator</Link>
            <Link to="/workoutbuilder">Workout Builder</Link>
          </div>

          {/* Contact */}
          <div className="footer-column contact-column">
            <h3>Get In Touch</h3>

            <div className="contact-item">
              <div className="contact-icon">
                <FontAwesomeIcon icon={faMapMarkerAlt} />
              </div>

              <span>
                123 Fitness Street,
                <br />
                Healthy City, Bihar, India
              </span>
            </div>

            <div className="contact-item">
              <div className="contact-icon">
                <FontAwesomeIcon icon={faPhone} />
              </div>

              <a href="tel:+919523430484">
                +91 9523430484
              </a>
            </div>

            <div className="contact-item">
              <div className="contact-icon">
                <FontAwesomeIcon icon={faEnvelope} />
              </div>

              <a href="mailto:ramkumar070406@gmail.com">
                ramkumar070406@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} FitFusion. All Rights Reserved.
          </p>

          <div className="legal-links">
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/terms-of-service">Terms of Service</Link>
            <Link to="/cookie-policy">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;