import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Users, Image, MessageSquare, Heart } from 'lucide-react';
import { gsap } from 'gsap';

const Landing = () => {
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    // Hero animations
    gsap.from(heroRef.current.querySelector('h1'), {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    });

    gsap.from(heroRef.current.querySelector('p'), {
      y: 30,
      opacity: 0,
      duration: 1,
      delay: 0.3,
      ease: 'power3.out'
    });

    gsap.from(heroRef.current.querySelectorAll('.btn'), {
      y: 20,
      opacity: 0,
      duration: 0.8,
      delay: 0.6,
      stagger: 0.2,
      ease: 'power3.out'
    });

    // Features animations
    gsap.from(featuresRef.current.querySelectorAll('.feature-card'), {
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: featuresRef.current,
        start: 'top center+=100',
        toggleActions: 'play none none reverse'
      }
    });

    // CTA animations
    gsap.from(ctaRef.current, {
      scale: 0.9,
      opacity: 0,
      duration: 0.8,
      scrollTrigger: {
        trigger: ctaRef.current,
        start: 'top center+=200',
        toggleActions: 'play none none reverse'
      }
    });
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div ref={heroRef} className="relative overflow-hidden bg-gradient-to-br from-primary-600 to-primary-800">
        <div className="max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Connect & Share <br />
                <span className="text-accent-500">Your World</span>
              </h1>
              <p className="mt-6 text-xl text-white/80 max-w-lg mx-auto md:mx-0">
                Join Socials today and connect with friends, share moments, and discover interesting people from around the globe.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link
                  to="/register"
                  className="btn bg-white text-primary-700 hover:bg-gray-100 px-8 py-3 rounded-lg font-medium text-lg shadow-lg hover:shadow-xl transition duration-300"
                >
                  Sign Up Now
                </Link>
                <Link
                  to="/login"
                  className="btn bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-3 rounded-lg font-medium text-lg transition duration-300"
                >
                  Login
                </Link>
              </div>
            </div>
            <div className="hidden md:block relative">
              <div className="absolute -top-2 -left-2 w-64 h-64 bg-accent-500/20 rounded-full filter blur-3xl"></div>
              <div className="absolute bottom-10 right-10 w-40 h-40 bg-primary-400/30 rounded-full filter blur-2xl"></div>
              <div className="relative z-10 bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20 transform rotate-2">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-accent-500 flex items-center justify-center text-white font-bold text-lg">S</div>
                    <div className="ml-3">
                      <div className="font-semibold text-white">Socials App</div>
                      <div className="text-sm text-white/70">Just now</div>
                    </div>
                  </div>
                </div>
                <div className="rounded-xl overflow-hidden mb-4 h-48 bg-primary-400/30"></div>
                <div className="flex justify-between text-white mb-2">
                  <div className="flex items-center">
                    <Heart size={20} />
                    <span className="ml-2">142 likes</span>
                  </div>
                  <div className="flex items-center">
                    <MessageSquare size={20} />
                    <span className="ml-2">24 comments</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
            <path
              fill="#ffffff"
              fillOpacity="1"
              d="M0,224L60,213.3C120,203,240,181,360,192C480,203,600,245,720,240C840,235,960,181,1080,165.3C1200,149,1320,171,1380,181.3L1440,192L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
            ></path>
          </svg>
        </div>
      </div>

      {/* Features Section */}
      <div ref={featuresRef} className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900">Why Choose Socials?</h2>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            A modern social platform with everything you need to connect and share
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="feature-card bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition duration-300">
            <div className="w-14 h-14 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 mb-6">
              <Users size={28} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Connect with Friends</h3>
            <p className="text-gray-600">
              Find friends, follow interesting profiles, and build your community.
            </p>
          </div>

          <div className="feature-card bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition duration-300">
            <div className="w-14 h-14 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 mb-6">
              <Image size={28} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Share Moments</h3>
            <p className="text-gray-600">
              Share photos, updates, and important moments with your followers.
            </p>
          </div>

          <div className="feature-card bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition duration-300">
            <div className="w-14 h-14 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 mb-6">
              <MessageSquare size={28} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Real-Time Chat</h3>
            <p className="text-gray-600">
              Message friends directly with our user-friendly chat interface.
            </p>
          </div>

          <div className="feature-card bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition duration-300">
            <div className="w-14 h-14 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 mb-6">
              <Heart size={28} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Engage & Interact</h3>
            <p className="text-gray-600">
              Like and comment on posts to engage with content you love.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div ref={ctaRef} className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900">Ready to get started?</h2>
          <p className="mt-4 text-lg text-gray-600">
            Join thousands of users who are already connecting, sharing, and engaging on Socials.
          </p>
          <div className="mt-8">
            <Link
              to="/register"
              className="btn-primary inline-flex items-center px-8 py-3 rounded-lg text-lg font-medium shadow-lg hover:shadow-xl transition duration-300"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center">
                <span className="text-white font-semibold text-lg">S</span>
              </div>
              <h1 className="ml-2 text-xl font-semibold text-gray-900">Socials</h1>
            </div>
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Socials. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;