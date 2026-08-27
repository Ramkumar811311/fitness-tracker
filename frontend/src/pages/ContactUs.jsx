import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faPaperPlane,
  faSpinner,
  faCheck
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebookF,
  faTwitter,
  faInstagram,
  faLinkedinIn
} from "@fortawesome/free-brands-svg-icons";

const ContactUs = () => {
  // Debug logging
  useEffect(() => {
    console.log("ContactUs component rendered");
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(
        `/api/users/contact`,
        formData
      );

      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });

      toast.success("Message sent successfully! We'll get back to you soon.");

      setTimeout(() => {
        setSubmitted(false);
      }, 3000);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error(
        error.response?.data?.message || "Failed to send message. Please try again later."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = "w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300";
  const errorClasses = "mt-1 text-sm text-red-600";

  return (
    <div className="max-w-7xl mx-auto pt-4 px-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-purple-200 to-indigo-200 px-6 py-10 text-center">
          <h1 className="text-4xl font-bold mb-2 text-gray-900">Get In Touch</h1>
          <p className="text-gray-800 max-w-2xl mx-auto font-medium">
            Have questions or feedback? We'd love to hear from you. Our team is always ready to help with any inquiries you might have.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-0">
          {/* Contact Form */}
          <div className="md:col-span-3 p-6 md:p-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Send Us a Message</h2>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`${inputClasses} ${errors.name ? "border-red-500" : ""}`}
                    placeholder="John Doe"
                  />
                  {errors.name && <p className={errorClasses}>{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`${inputClasses} ${errors.email ? "border-red-500" : ""}`}
                    placeholder="john@example.com"
                  />
                  {errors.email && <p className={errorClasses}>{errors.email}</p>}
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className={inputClasses}
                  placeholder="How can we help you?"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  className={`${inputClasses} resize-none ${errors.message ? "border-red-500" : ""}`}
                  placeholder="Tell us more about your inquiry..."
                ></textarea>
                {errors.message && <p className={errorClasses}>{errors.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting || submitted}
                className={`inline-flex items-center justify-center px-6 py-3 bg-purple-600 text-white font-medium rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors ${(isSubmitting || submitted) ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                {isSubmitting ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} className="mr-2" />
                    Sending...
                  </>
                ) : submitted ? (
                  <>
                    <FontAwesomeIcon icon={faCheck} className="mr-2" />
                    Sent Successfully
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="md:col-span-2 bg-gray-50 p-6 md:p-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Contact Information</h2>

            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <FontAwesomeIcon icon={faEnvelope} className="text-purple-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Email</h3>
                  <a href="mailto:ramkumar070406@gmail.com" className="text-base text-gray-900 hover:text-purple-600 mt-1 block">
                    ramkumar070406@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <FontAwesomeIcon icon={faPhone} className="text-purple-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                  <a href="tel:+919523430484" className="text-base text-gray-900 hover:text-purple-600 mt-1 block">
                    +91 9523430484
                  </a>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="text-purple-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Address</h3>
                  <p className="text-base text-gray-900 mt-1">
                    123 Fitness Street<br />
                    Healthy City, 400001<br />
                    Bihar, India
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Connect With Us</h3>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700"
                >
                  <FontAwesomeIcon icon={faFacebookF} />
                </a>
                <a
                  href="https://x.com/r_amkum_ar?s=08"
                  className="h-10 w-10 rounded-full bg-blue-400 text-white flex items-center justify-center hover:bg-blue-500"
                >
                  <FontAwesomeIcon icon={faTwitter} />
                </a>
                <a
                  href="https://www.instagram.com/__.ram.07"
                  className="h-10 w-10 rounded-full bg-pink-600 text-white flex items-center justify-center hover:bg-pink-700"
                >
                  <FontAwesomeIcon icon={faInstagram} />
                </a>
                <a
                  href="https://www.linkedin.com/in/ram-kumar-81bb07360?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
                  className="h-10 w-10 rounded-full bg-blue-800 text-white flex items-center justify-center hover:bg-blue-900"
                >
                  <FontAwesomeIcon icon={faLinkedinIn} />
                </a>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Business Hours</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex justify-between">
                  <span>Monday - Friday:</span>
                  <span className="font-medium">9:00 AM - 8:00 PM</span>
                </li>
                <li className="flex justify-between">
                  <span>Saturday:</span>
                  <span className="font-medium">10:00 AM - 6:00 PM</span>
                </li>
                <li className="flex justify-between">
                  <span>Sunday:</span>
                  <span className="font-medium">Closed</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="h-96 w-full">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241317.1160984904!2d72.71637338061778!3d19.082089444606518!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c6306644edc1%3A0x5da4ed8f8d648c69!2sBihar%2C%20Bihar!5e0!3m2!1sen!2sin!4v1651902254197!5m2!1sen!2sin"
            className="w-full h-full border-0"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="FitFusion location map"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;