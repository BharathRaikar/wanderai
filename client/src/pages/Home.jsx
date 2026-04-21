import { Link } from 'react-router-dom'
import { Plane, Star, Shield, Zap, MapPin, ArrowRight, Globe, Users, TrendingUp } from 'lucide-react'

const featuredDestinations = [
  { name: 'Tokyo', country: 'Japan', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80', tag: 'Culture & Food' },
  { name: 'Bali', country: 'Indonesia', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80', tag: 'Beach & Zen' },
  { name: 'Santorini', country: 'Greece', image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80', tag: 'Romance' },
  { name: 'Patagonia', country: 'Argentina', image: 'https://images.unsplash.com/photo-1465056836041-7f43ac27dcb5?w=800&q=80', tag: 'Adventure' },
]

const features = [
  { icon: Zap, title: 'AI-Powered Planning', desc: 'Smart itineraries tailored to your budget, interests, and travel style.' },
  { icon: MapPin, title: '12+ Destinations', desc: 'Curated destinations across all continents with real local insights.' },
  { icon: Shield, title: 'Instant Booking', desc: 'Reserve hotels, activities, and transport with one-click booking.' },
  { icon: TrendingUp, title: 'Budget Optimizer', desc: 'Automatic budget breakdown ensuring you stay on track.' },
]

const stats = [
  { value: '12+', label: 'Destinations', icon: Globe },
  { value: '50+', label: 'Activities', icon: Zap },
  { value: '98%', label: 'Happy Travelers', icon: Users },
  { value: '4.9★', label: 'Average Rating', icon: Star },
]

export default function Home() {
  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920&q=85"
            alt="Travel"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-blue-900/60 to-slate-900/70" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto animate-slide-up">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 text-white text-sm px-4 py-2 rounded-full mb-6">
            <Plane className="w-4 h-4" />
            AI-Powered Travel Planning
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6">
            Your Dream Trip,
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300">
              Planned Instantly
            </span>
          </h1>

          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8 leading-relaxed">
            Tell us your preferences and budget — our AI builds a personalized day-by-day itinerary with recommended hotels, activities, and transport in seconds.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/planner" className="btn-primary text-base py-4 px-8 flex items-center gap-2 justify-center">
              <Zap className="w-5 h-5" />
              Plan My Trip Now
            </Link>
            <Link to="/explore" className="btn-secondary text-base py-4 px-8 flex items-center gap-2 justify-center bg-white/10 border-white/30 text-white hover:bg-white/20">
              <Globe className="w-5 h-5" />
              Explore Destinations
            </Link>
          </div>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-6 mt-10 flex-wrap">
            {stats.map(({ value, label, icon: Icon }) => (
              <div key={label} className="flex items-center gap-2 text-white/90">
                <Icon className="w-4 h-4 text-blue-300" />
                <span className="font-bold">{value}</span>
                <span className="text-white/60 text-sm">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-white/50 rounded-full" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Everything You Need to Travel Smarter</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">From AI-generated itineraries to instant bookings, WanderAI handles the planning so you can focus on the adventure.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card p-6 hover:shadow-md transition-shadow text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Trending Destinations</h2>
              <p className="text-slate-600 mt-1">Handpicked by our AI based on thousands of trips</p>
            </div>
            <Link to="/explore" className="flex items-center gap-1.5 text-blue-600 font-semibold hover:underline">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredDestinations.map(({ name, country, image, tag }) => (
              <Link key={name} to="/planner" className="group card overflow-hidden">
                <div className="relative h-64">
                  <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <p className="text-xs font-medium text-white/70 mb-0.5">{tag}</p>
                    <p className="text-xl font-bold">{name}</p>
                    <p className="text-sm text-white/80 flex items-center gap-1"><MapPin className="w-3 h-3" />{country}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-700">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to Start Your Adventure?</h2>
          <p className="text-blue-100 text-lg mb-8">Answer a few questions and get your personalized itinerary in seconds.</p>
          <Link to="/planner" className="inline-flex items-center gap-2 bg-white text-blue-700 font-bold px-8 py-4 rounded-xl hover:bg-blue-50 transition-colors shadow-lg text-base">
            <Plane className="w-5 h-5" />
            Build My Itinerary
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
