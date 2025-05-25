import { Link } from "react-router-dom"
import { ArrowRight, Users, MessageCircle, Heart, Camera } from "lucide-react"

const Landing = () => {
  return (
    <div className="min-h-screen gradient-primary">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6 md:p-8 safe-top">
        <div className="text-white text-2xl md:text-3xl font-bold">Socials</div>
        <div className="space-x-4">
          <Link to="/login" className="text-white hover:text-gray-200 transition-colors duration-200">
            Login
          </Link>
          <Link
            to="/register"
            className="bg-white text-primary-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-all duration-200 transform hover:scale-105"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center px-6 py-12 md:py-20 text-center animate-fade-in">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight text-balance">
          Connect, Share,
          <br />
          <span className="bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">Inspire</span>
        </h1>

        <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl leading-relaxed text-balance">
          Join millions of people sharing their moments, connecting with friends, and discovering amazing content on
          Socials.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-12 animate-slide-up">
          <Link
            to="/register"
            className="bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2 shadow-soft-lg"
          >
            Get Started
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            to="/login"
            className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-primary-600 transition-all duration-200 transform hover:scale-105"
          >
            Sign In
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl w-full">
          {[
            {
              icon: Camera,
              title: "Share Moments",
              description: "Capture and share your favorite moments with beautiful photos and videos",
            },
            {
              icon: Users,
              title: "Connect",
              description: "Follow friends and discover new people with similar interests",
            },
            {
              icon: MessageCircle,
              title: "Chat",
              description: "Stay connected with real-time messaging and group conversations",
            },
            {
              icon: Heart,
              title: "Engage",
              description: "Like, comment, and interact with content from your community",
            },
          ].map((feature, index) => (
            <div
              key={feature.title}
              className="glass rounded-2xl p-6 text-center animate-slide-up hover:scale-105 transition-all duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-white/80 text-sm text-balance">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="glass mx-6 md:mx-8 rounded-3xl p-8 mb-12 animate-slide-up">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            { number: "1M+", label: "Active Users" },
            { number: "10M+", label: "Photos Shared" },
            { number: "50M+", label: "Connections Made" },
          ].map((stat, index) => (
            <div key={stat.label} className="animate-scale-in" style={{ animationDelay: `${index * 200}ms` }}>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.number}</div>
              <div className="text-white/80 text-lg">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-white/60 pb-8 safe-bottom">
        <p>&copy; 2024 Socials. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default Landing
// 