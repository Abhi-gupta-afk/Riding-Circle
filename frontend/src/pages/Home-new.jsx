import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  const features = [
    {
      icon: "fas fa-users",
      title: "Find Your Club",
      description: "Connect with like-minded bikers and join amazing clubs in your city.",
      link: "/clubs",
      buttonText: "Explore Clubs",
      color: "blue"
    },
    {
      icon: "fas fa-route",
      title: "Plan Your Trip",
      description: "Discover, join, or organize trips and adventures with your club.",
      link: "/trips",
      buttonText: "Browse Trips",
      color: "green"
    },
    {
      icon: "fas fa-star",
      title: "Share & Read Reviews",
      description: "Share your experiences and read reviews from fellow bikers.",
      link: "/reviews",
      buttonText: "Read Reviews",
      color: "yellow"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative px-4 py-24 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
              Welcome to{' '}
              <span className="text-blue-200">RideCircle</span>
            </h1>
            <p className="max-w-md mx-auto mt-6 text-xl text-blue-100 sm:max-w-3xl">
              A modern platform for bikers to join clubs, plan epic trips, and share amazing experiences with the community.
            </p>
            <div className="max-w-sm mx-auto mt-8 sm:max-w-none sm:flex sm:justify-center">
              <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex">
                <Link
                  to="/clubs"
                  className="flex items-center justify-center px-8 py-3 text-base font-medium text-blue-600 bg-white border border-transparent rounded-md shadow hover:bg-blue-50 md:py-4 md:text-lg md:px-10"
                >
                  <i className="fas fa-users mr-2"></i>
                  Get Started
                </Link>
                <Link
                  to="/login"
                  className="flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-blue-500 border border-transparent rounded-md shadow hover:bg-blue-400 md:py-4 md:text-lg md:px-10"
                >
                  <i className="fas fa-sign-in-alt mr-2"></i>
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Everything you need for your biking community
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600">
              Join the largest community of bikers and discover new adventures
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="relative bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-${feature.color}-100 rounded-lg mb-6`}>
                  <i className={`${feature.icon} text-${feature.color}-600 text-2xl`}></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {feature.description}
                </p>
                <Link
                  to={feature.link}
                  className={`inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-${feature.color}-600 rounded-lg hover:bg-${feature.color}-700 transition-colors duration-200`}
                >
                  {feature.buttonText}
                  <i className="fas fa-arrow-right ml-2"></i>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                <i className="fas fa-users"></i>
              </div>
              <div className="text-3xl font-bold text-gray-900">500+</div>
              <div className="text-gray-600">Active Members</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">
                <i className="fas fa-motorcycle"></i>
              </div>
              <div className="text-3xl font-bold text-gray-900">50+</div>
              <div className="text-gray-600">Riding Clubs</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">
                <i className="fas fa-route"></i>
              </div>
              <div className="text-3xl font-bold text-gray-900">200+</div>
              <div className="text-gray-600">Epic Trips</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-600 mb-2">
                <i className="fas fa-star"></i>
              </div>
              <div className="text-3xl font-bold text-gray-900">1000+</div>
              <div className="text-gray-600">Reviews</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Ready to start your adventure?
          </h2>
          <p className="mt-4 text-xl text-blue-100">
            Join thousands of bikers who have already found their tribe
          </p>
          <div className="mt-8">
            <Link
              to="/register"
              className="inline-flex items-center px-8 py-4 text-lg font-medium text-blue-600 bg-white rounded-lg hover:bg-blue-50 transition-colors duration-200"
            >
              <i className="fas fa-user-plus mr-2"></i>
              Join RideCircle Today
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
