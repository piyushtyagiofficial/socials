import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Users, Image, MessageSquare, Heart, ArrowRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Landing = () => {
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    // Hero section animations
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    
    heroTl.from(heroRef.current.querySelector('h1'), {
      y: 60,
      opacity: 0,
      duration: 1,
    })
    heroTl.from(heroRef.current.querySelector('.hero-text'), {
      y: 30,
      opacity: 0,
      duration: 0.8,
    }, '-=0.4')

    const heroButtons = heroRef.current.querySelectorAll('.hero-btn');
    if (heroButtons.length > 0) {
      gsap.set(heroButtons, { opacity: 1 }); // Ensure buttons aren't stuck hidden
      heroTl.from(heroButtons, {
        y: 20,
        opacity: 0,
        stagger: 0.2,
        duration: 0.6,
      }, '-=0.2');
    }

    heroTl.from(heroRef.current.querySelector('.hero-card'), {
      scale: 0.8,
      opacity: 0,
      duration: 0.8,
      rotate: -5,
    }, '-=0.4');

    // Features animations
    const featureCards = featuresRef.current.querySelectorAll('.feature-card');
    
    featureCards.forEach((card, index) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 90%',
          end: 'top 60%',
          toggleActions: 'play none none reverse',
        },
        y: 60,
        opacity: 0,
        duration: 0.4,
        delay: index * 0.1,
      });
    });

    // CTA animations
    gsap.from(ctaRef.current, {
      scrollTrigger: {
        trigger: ctaRef.current,
        start: 'top bottom-=100',
        toggleActions: 'play none none reverse',
      },
      y: 40,
      opacity: 0,
      duration: 0.8,
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-primary-50">
      {/* Hero Section */}
      <div ref={heroRef} className="relative overflow-hidden bg-gradient-to-br from-primary-600 to-primary-800 pb-20">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1920')] bg-cover bg-center opacity-10"></div>
        <div className="max-w-7xl mx-auto pt-20 px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                Connect & Share <br />
                <span className="text-accent-400">Your World</span>
              </h1>
              <p className="mt-6 text-xl text-white/90 max-w-lg mx-auto md:mx-0 hero-text">
                Join millions of people on Socials to connect with friends, share moments, and discover amazing content from around the globe.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link
                  to="/register"
                  className="hero-btn group bg-white text-primary-700 hover:bg-primary-50 px-8 py-4 rounded-xl font-medium text-lg shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/login"
                  className="hero-btn bg-primary-700/50 backdrop-blur-sm border-2 border-white/50 hover:border-primary-700/80 text-white hover:bg-primary-700/80 px-8 py-4 rounded-xl font-medium text-lg transition-all duration-300 flex items-center justify-center"
                >
                  Sign In
                </Link>
              </div>
            </div>
            <div className="hidden md:block relative hero-card">
              <div className="absolute -top-10 -left-10 w-72 h-72 bg-accent-500/20 rounded-full filter blur-3xl"></div>
              <div className="absolute bottom-20 right-20 w-48 h-48 bg-primary-400/30 rounded-full filter blur-2xl"></div>
              <div className="relative z-10 bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/20 transform hover:rotate-0 rotate-2 transition-transform duration-500">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">S</div>
                    <div className="ml-3">
                      <div className="font-semibold text-white">Socials App</div>
                      <div className="text-sm text-white/70">Just now</div>
                    </div>
                  </div>
                </div>
                <div className="rounded-xl overflow-hidden mb-4">
                  <img 
                    src="https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                    alt="Social Connection"
                    className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="flex justify-between text-white mb-2">
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center space-x-1 hover:text-accent-400 transition-colors">
                      <Heart size={20} className="fill-current" />
                      <span>142</span>
                    </button>
                    <button className="flex items-center space-x-1 hover:text-primary-400 transition-colors">
                      <MessageSquare size={20} />
                      <span>24</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path fill="#ffffff" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </div>

      {/* Features Section */}
      <div ref={featuresRef} className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Socials?</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience the next generation of social networking with our powerful features
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Feature Card 1 */}
          <div className="feature-card group bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600 mb-6 group-hover:scale-110 transition-transform">
              <Users size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Connect with Friends</h3>
            <p className="text-gray-600">
              Find and connect with friends, follow interesting profiles, and build your community.
            </p>
          </div>
          {/* Feature Card 2 */}
          <div className="feature-card group bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-16 h-16 bg-accent-100 rounded-xl flex items-center justify-center text-accent-600 mb-6 group-hover:scale-110 transition-transform">
              <Image size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Share Moments</h3>
            <p className="text-gray-600">
              Share your favorite photos, updates, and life's special moments with your followers.
            </p>
          </div>
          {/* Feature Card 3 */}
          <div className="feature-card group bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600 mb-6 group-hover:scale-110 transition-transform">
              <MessageSquare size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Real-Time Chat</h3>
            <p className="text-gray-600">
              Stay connected with friends through our seamless real-time messaging system.
            </p>
          </div>
          {/* Feature Card 4 */}
          <div className="feature-card group bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-16 h-16 bg-accent-100 rounded-xl flex items-center justify-center text-accent-600 mb-6 group-hover:scale-110 transition-transform">
              <Heart size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Engage & Interact</h3>
            <p className="text-gray-600">
              Like, comment, and interact with content that matters to you and your network.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div ref={ctaRef} className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/10 to-accent-500/10 backdrop-blur-3xl"></div>
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Ready to get started?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of users who are already connecting, sharing, and engaging on Socials.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center px-8 py-4 rounded-xl text-lg font-medium bg-primary-600 text-white hover:bg-primary-700 shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            Create Your Account
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center shadow-lg">
                <span className="text-white font-semibold text-xl">S</span>
              </div>
              <h1 className="ml-3 text-2xl font-bold text-gray-900">Socials</h1>
            </div>
            <p className="text-gray-500">
              © {new Date().getFullYear()} Socials. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;