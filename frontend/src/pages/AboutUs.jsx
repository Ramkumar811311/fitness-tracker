import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faQuoteRight,
  faDumbbell,
  faHeartbeat,
  faUsers,
  faBullseye,
  faChartLine,
  faClock
} from "@fortawesome/free-solid-svg-icons";
import {
  faLinkedin,
  faTwitter,
  faInstagram
} from "@fortawesome/free-brands-svg-icons";

const AboutUs = () => {
  // Debug logging
  useEffect(() => {
    console.log("AboutUs component rendered");
  }, []);

  // Mission statements
  const missionPoints = [
    {
      icon: faHeartbeat,
      title: "Promote Healthy Living",
      description: "We aim to make fitness an accessible and enjoyable part of everyday life for everyone."
    },
    {
      icon: faUsers,
      title: "Build Communities",
      description: "Creating supportive communities where fitness enthusiasts can connect and motivate each other."
    },
    {
      icon: faBullseye,
      title: "Results-Focused Approach",
      description: "Our platform is designed to help you track progress and achieve meaningful results over time."
    },
    {
      icon: faChartLine,
      title: "Continuous Improvement",
      description: "We constantly evolve our platform based on latest fitness research and user feedback."
    }
  ];

  // Team members data
  const teamMembers = [
    {
      name: "Aditya Mishra",
      role: "Founder & CEO",
      image: "Aditya.jpg",
      bio: "Fitness enthusiast with a passion for technology and helping others achieve their health goals.",
      linkedin: "#",
      twitter: "#",
      instagram: "#"
    },
    {
      name: "Jaiprakash Kumar",
      role: "Head of Fitness",
      image: "jaiprakash.jpg",
      bio: "Certified personal trainer with 10+ years of experience in designing effective workout programs.",
      linkedin: "#",
      twitter: "#",
      instagram: "https://www.instagram.com/jayprakash_kushwaha_06/profilecard/?igsh=MWE1c3B5aGU1bnl6eg=="
    },
    {
      name: "Ram Kumar",
      role: "Nutrition Specialist",
      image: "ram.jpg",
      bio: "Registered dietitian passionate about helping people develop sustainable eating habits.",
      linkedin: "https://www.linkedin.com/in/ram-kumar-81bb07360?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      twitter: "https://x.com/r_amkum_ar?s=08",
      instagram: "https://www.instagram.com/__.ram.07"
    },
    {
      name: "Aman Kumar",
      role: "Technology Lead",
      image: "Aman.jpg",
      bio: "Software engineer specializing in creating intuitive user experiences for fitness applications.",
      linkedin: "https://www.linkedin.com/in/aman-kumar-110aa9320?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      twitter: "https://x.com/AmanKum88726639?s=08",
      instagram: "https://www.instagram.com/amankm21?igsh=cWZqN2M5OG5pcTBr"
    }
  ];

  // Timeline data
  const milestones = [
    {
      year: "2020",
      title: "The Idea",
      description: "FitFusion started as a concept to combine technology and fitness in a more meaningful way."
    },
    {
      year: "2021",
      title: "Foundation",
      description: "The company was officially established and initial development of the platform began."
    },
    {
      year: "2022",
      title: "Beta Launch",
      description: "First beta version released to select users, gathering crucial feedback for improvements."
    },
    {
      year: "2023",
      title: "Public Release",
      description: "Official public launch with core features including workout tracking and nutrition monitoring."
    },
    {
      year: "2024",
      title: "Expansion",
      description: "Expanding features to include social connectivity, personalized AI recommendations, and more."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto pt-4 px-4">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-200 to-indigo-200 text-gray-900 rounded-xl overflow-hidden shadow-xl mb-16">
        <div className="container mx-auto px-6 py-16 md:py-24 relative">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              About FitFusion
            </h1>
            <p className="text-xl text-gray-800 mb-8 font-medium">
              We're on a mission to transform how people approach fitness and well-being through technology,
              community, and personalized experiences.
            </p>
            <div>
              <Link to="/Features" className="inline-block bg-purple-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors shadow-md">
                Explore Our Features
              </Link>
            </div>
          </div>

          <div className="absolute right-0 bottom-0 opacity-30 hidden lg:block">
            <FontAwesomeIcon icon={faDumbbell} className="text-9xl transform rotate-12 text-purple-800" />
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="mb-16">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 md:p-10">
            <div className="flex flex-col md:flex-row items-start gap-10">
              <div className="md:w-1/2">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                  <span className="bg-purple-100 p-2 rounded-full mr-3">
                    <FontAwesomeIcon icon={faQuoteRight} className="text-purple-600" />
                  </span>
                  Our Story
                </h2>
                <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                  FitFusion was born from a simple observation: despite the abundance of fitness apps and resources,
                  many people still struggle to maintain consistent health routines that fit their unique needs and lifestyle.
                </p>
                <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                  Our founder, Aditya Mishra, experienced this firsthand while juggling a demanding career in technology
                  and trying to maintain a healthy lifestyle. He found that existing solutions were either too rigid,
                  too complex, or didn't provide the right balance of guidance and flexibility.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  In 2020, he assembled a team of fitness professionals, nutritionists, and software engineers to create
                  a platform that would truly adapt to each user's journey, providing personalized guidance while
                  fostering a supportive community environment.
                </p>
              </div>

              <div className="md:w-1/2">
                <div className="relative h-80 md:h-full overflow-hidden rounded-lg shadow-lg">
                  <img
                    src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                    alt="FitFusion Team Meeting"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                    <div className="p-6 text-white">
                      <p className="font-medium">The founding team discussing the initial vision (2020)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Our Mission</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {missionPoints.map((point, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="h-12 w-12 flex items-center justify-center rounded-full bg-purple-100 text-purple-600 mb-4">
                <FontAwesomeIcon icon={point.icon} className="text-xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">{point.title}</h3>
              <p className="text-gray-600">{point.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">Our Journey</h2>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-purple-200 z-0"></div>

          {/* Timeline items */}
          <div className="relative z-10">
            {milestones.map((milestone, index) => (
              <div
                key={index}
                className={`flex items-center mb-8 ${index % 2 === 0 ? 'justify-start md:pr-8 md:text-right' : 'justify-end md:pl-8 md:flex-row-reverse'}`}
              >
                <div className={`w-full md:w-1/2 flex ${index % 2 === 0 ? 'md:justify-end' : 'md:justify-start'}`}>
                  <div className="bg-white rounded-lg shadow-md p-6 max-w-md">
                    <div className="flex items-center mb-3">
                      <div className="h-8 w-8 flex items-center justify-center rounded-full bg-purple-100 text-purple-600 mr-3">
                        <FontAwesomeIcon icon={faClock} className="text-sm" />
                      </div>
                      <h3 className="text-lg font-bold text-purple-700">{milestone.year}</h3>
                    </div>
                    <h4 className="text-xl font-semibold text-gray-800 mb-2">{milestone.title}</h4>
                    <p className="text-gray-600">{milestone.description}</p>
                  </div>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-purple-500 border-4 border-white shadow"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Meet Our Team</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="h-64 overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800">{member.name}</h3>
                <p className="text-sm text-purple-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 mb-4 text-sm">{member.bio}</p>
                <div className="flex space-x-3">
                  <a href={member.linkedin} className="text-blue-600 hover:text-blue-800 transition-colors">
                    <FontAwesomeIcon icon={faLinkedin} />
                  </a>
                  <a href={member.twitter} className="text-blue-400 hover:text-blue-600 transition-colors">
                    <FontAwesomeIcon icon={faTwitter} />
                  </a>
                  <a href={member.instagram} className="text-pink-600 hover:text-pink-800 transition-colors">
                    <FontAwesomeIcon icon={faInstagram} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-indigo-200 to-purple-200 rounded-xl overflow-hidden shadow-xl">
        <div className="container mx-auto px-6 py-12 md:py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">Join Us on Your Fitness Journey</h2>
            <p className="text-lg md:text-xl mb-8 text-gray-800 font-medium">
              Whether you're just starting out or looking to take your fitness to the next level,
              FitFusion provides the tools, guidance, and community you need to succeed.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/Register" className="bg-purple-600 text-white hover:bg-purple-700 font-semibold px-6 py-3 rounded-lg transition-colors shadow-md">
                Sign Up Now
              </Link>
              <Link to="/Features" className="bg-gray-800 hover:bg-gray-900 text-white border-2 border-gray-800 font-semibold px-6 py-3 rounded-lg transition-colors">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
