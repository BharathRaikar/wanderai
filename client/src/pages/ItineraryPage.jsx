import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getItinerary } from '../services/api'
import HotelCard from '../components/HotelCard'
import ActivityCard from '../components/ActivityCard'
import TransportCard from '../components/TransportCard'
import BookingModal from '../components/BookingModal'
import DestinationCard from '../components/DestinationCard'
import MapView from '../components/MapView'
import {
  MapPin, Calendar, Users, DollarSign, Star, Clock,
  Plane, Hotel, Zap, Bus, Map, ChevronDown, ChevronUp,
  ArrowLeft, Luggage, Lightbulb, TrendingUp, RefreshCw
} from 'lucide-react'

const TAB_ICONS = { overview: Map, map: MapPin, hotel: Hotel, transport: Bus, activities: Zap, budget: DollarSign, tips: Lightbulb }

export default function ItineraryPage() {
  const { id } = useParams()
  const [itinerary, setItinerary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [expandedDay, setExpandedDay] = useState(1)
  const [bookingModal, setBookingModal] = useState(null)

  useEffect(() => {
    getItinerary(id)
      .then(data => { setItinerary(data); setLoading(false) })
      .catch(() => { setError('Could not load itinerary.'); setLoading(false) })
  }, [id])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-slow">
          <Plane className="w-8 h-8 text-blue-600" />
        </div>
        <p className="text-slate-600 font-medium">Loading your itinerary…</p>
      </div>
    </div>
  )

  if (error || !itinerary) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-red-600 font-medium">{error || 'Itinerary not found.'}</p>
      <Link to="/planner" className="btn-primary flex items-center gap-2">
        <RefreshCw className="w-4 h-4" /> Create New Itinerary
      </Link>
    </div>
  )

  const { destination, hotel, transport, dailyPlans, budgetBreakdown, packingTips, travelTips, alternativeDestinations, preferences } = itinerary

  const tabs = [
    { id: 'overview',   label: 'Overview' },
    { id: 'map',        label: 'Map' },
    { id: 'hotel',      label: 'Hotel' },
    { id: 'transport',  label: 'Transport' },
    { id: 'activities', label: 'Activities' },
    { id: 'budget',     label: 'Budget' },
    { id: 'tips',       label: 'Tips' },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <div className="relative h-80 sm:h-96">
        <img src={destination.image} alt={destination.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 max-w-7xl mx-auto w-full">
          <Link to="/planner" className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2 bg-white/20 backdrop-blur text-white text-sm px-4 py-2 rounded-full hover:bg-white/30 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>

          <div className="flex items-center gap-2 text-white/70 text-sm mb-2">
            <MapPin className="w-4 h-4" />
            <span>{destination.name}, {destination.country}</span>
            <span className="mx-1">·</span>
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>{destination.rating}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-2">{destination.name}</h1>
          <p className="text-white/80 max-w-2xl text-sm sm:text-base">{itinerary.summary}</p>

          {/* Quick stats */}
          <div className="flex flex-wrap gap-4 mt-4">
            {[
              { icon: Calendar, label: `${preferences.numDays} days` },
              { icon: Users, label: `${preferences.travelers} traveler${preferences.travelers > 1 ? 's' : ''}` },
              { icon: DollarSign, label: `$${preferences.budget.toLocaleString()} budget` },
              { icon: TrendingUp, label: `${itinerary.matchScore}% match` },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-1.5 bg-white/15 backdrop-blur text-white text-sm px-3 py-1.5 rounded-full">
                <Icon className="w-4 h-4" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-16 z-30 bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto gap-1 py-1 no-scrollbar">
            {tabs.map(({ id, label }) => {
              const Icon = TAB_ICONS[id]
              return (
                <button key={id} onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all ${
                    activeTab === id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}>
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Tab content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <h2 className="section-title mb-2">Day-by-Day Itinerary</h2>
              {dailyPlans.map((day) => (
                <div key={day.day} className="card overflow-hidden">
                  <button
                    className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors"
                    onClick={() => setExpandedDay(expandedDay === day.day ? null : day.day)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm flex-shrink-0">
                        {day.day}
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-slate-900">{day.title}</p>
                        <p className="text-sm text-slate-500">
                          {day.activities.length} activities · ~${day.estimatedCost} est. cost
                        </p>
                      </div>
                    </div>
                    {expandedDay === day.day
                      ? <ChevronUp className="w-5 h-5 text-slate-400" />
                      : <ChevronDown className="w-5 h-5 text-slate-400" />
                    }
                  </button>

                  {expandedDay === day.day && (
                    <div className="border-t border-slate-100 p-5 animate-fade-in">
                      {day.activities.length === 0 ? (
                        <p className="text-slate-500 text-sm">Relax and explore at your own pace.</p>
                      ) : (
                        <div className="space-y-4">
                          {day.activities.map((act, idx) => (
                            <div key={act.id} className="flex gap-4">
                              <div className="flex flex-col items-center">
                                <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-bold flex-shrink-0">{idx + 1}</div>
                                {idx < day.activities.length - 1 && <div className="w-px flex-1 bg-slate-200 mt-1 mb-1" />}
                              </div>
                              <div className="flex-1 pb-2">
                                <div className="flex items-start gap-3">
                                  <img src={act.image} alt={act.name} className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                                    onError={e => { e.target.src = `https://source.unsplash.com/200x200/?travel` }} />
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2">
                                      <h4 className="font-semibold text-slate-900 truncate">{act.name}</h4>
                                      <span className="font-bold text-slate-900 flex-shrink-0">{act.priceUSD === 0 ? 'Free' : `$${act.priceUSD}`}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{act.description}</p>
                                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{act.duration}h</span>
                                      <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-amber-400 text-amber-400" />{act.rating}</span>
                                      <button onClick={() => setBookingModal({ item: act, type: 'activity' })}
                                        className="text-blue-600 font-medium hover:underline">Book</button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Hotel preview */}
              {hotel && (
                <div className="card p-4">
                  <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <Hotel className="w-4 h-4 text-blue-600" /> Accommodation
                  </h3>
                  <img src={hotel.image} alt={hotel.name} className="w-full h-32 object-cover rounded-xl mb-3"
                    onError={e => { e.target.src = `https://source.unsplash.com/600x300/?hotel` }} />
                  <p className="font-semibold text-slate-900">{hotel.name}</p>
                  <p className="text-sm text-slate-500 mb-2">{hotel.address}</p>
                  <p className="font-bold text-blue-600">${hotel.pricePerNight}/night</p>
                  <button onClick={() => setActiveTab('hotel')} className="btn-secondary w-full mt-3 text-sm py-2">
                    View Details
                  </button>
                </div>
              )}

              {/* Alternatives */}
              {alternativeDestinations?.length > 0 && (
                <div className="card p-4">
                  <h3 className="font-bold text-slate-900 mb-3">Alternative Destinations</h3>
                  <div className="space-y-3">
                    {alternativeDestinations.map(dest => (
                      <div key={dest.id} className="flex items-center gap-3">
                        <img src={dest.image} alt={dest.name} className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                          onError={e => { e.target.src = `https://source.unsplash.com/200x200/?travel` }} />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-900 truncate">{dest.name}</p>
                          <p className="text-xs text-slate-500">{dest.country} · {dest.matchScore}% match</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* MAP TAB */}
        {activeTab === 'map' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="section-title">Interactive Map</h2>
                <p className="text-slate-500 text-sm mt-1">
                  Showing {destination.name} with your hotel and {dailyPlans.flatMap(d => d.activities).length} activities
                </p>
              </div>
            </div>
            <MapView
              destination={destination}
              hotel={hotel}
              activities={dailyPlans.flatMap(d => d.activities)}
              height="520px"
            />
            <div className="mt-6 grid sm:grid-cols-3 gap-4 text-sm">
              <div className="card p-4 flex items-start gap-3">
                <div className="w-3 h-3 rounded-full bg-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-slate-900">{destination.name}</p>
                  <p className="text-slate-500 text-xs">{destination.country} · {destination.continent}</p>
                </div>
              </div>
              {hotel && (
                <div className="card p-4 flex items-start gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-900">{hotel.name}</p>
                    <p className="text-slate-500 text-xs">{hotel.address}</p>
                  </div>
                </div>
              )}
              <div className="card p-4 flex items-start gap-3">
                <div className="w-3 h-3 rounded-full bg-orange-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-slate-900">{dailyPlans.flatMap(d => d.activities).length} Activities</p>
                  <p className="text-slate-500 text-xs">Scattered near destination centre</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* HOTEL TAB */}
        {activeTab === 'hotel' && (
          <div className="max-w-3xl">
            <h2 className="section-title mb-6">Recommended Accommodation</h2>
            {hotel
              ? <HotelCard hotel={hotel} nights={preferences.numDays} travelers={preferences.travelers}
                  onBook={(h) => setBookingModal({ item: h, type: 'hotel' })} />
              : <p className="text-slate-500">No hotel recommendation available.</p>
            }
          </div>
        )}

        {/* TRANSPORT TAB */}
        {activeTab === 'transport' && (
          <div className="max-w-3xl">
            <h2 className="section-title mb-6">Getting There</h2>
            {transport
              ? <TransportCard transport={transport} travelers={preferences.travelers}
                  onBook={(t) => setBookingModal({ item: t, type: 'transport' })} />
              : <p className="text-slate-500">No transport option available.</p>
            }
          </div>
        )}

        {/* ACTIVITIES TAB */}
        {activeTab === 'activities' && (
          <div>
            <h2 className="section-title mb-6">All Activities</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {dailyPlans.flatMap(d => d.activities).map(act => (
                <ActivityCard key={act.id} activity={act}
                  onBook={(a) => setBookingModal({ item: a, type: 'activity' })} />
              ))}
            </div>
          </div>
        )}

        {/* BUDGET TAB */}
        {activeTab === 'budget' && (
          <div className="max-w-2xl">
            <h2 className="section-title mb-6">Budget Breakdown</h2>
            <div className="card p-6 space-y-4">
              {[
                { label: 'Accommodation', key: 'accommodation', emoji: '🏨', color: 'bg-blue-500' },
                { label: 'Transportation', key: 'transportation', emoji: '✈️', color: 'bg-purple-500' },
                { label: 'Activities',     key: 'activities',     emoji: '🎭', color: 'bg-orange-500' },
                { label: 'Food & Dining',  key: 'food',           emoji: '🍽️', color: 'bg-green-500' },
                { label: 'Miscellaneous',  key: 'miscellaneous',  emoji: '🛍️', color: 'bg-slate-400' },
              ].map(({ label, key, emoji, color }) => {
                const amount = budgetBreakdown[key] || 0
                const pct = Math.round((amount / budgetBreakdown.total) * 100)
                return (
                  <div key={key}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="flex items-center gap-2 font-medium text-slate-700">
                        {emoji} {label}
                      </span>
                      <span className="font-bold text-slate-900">${amount.toLocaleString()} <span className="text-slate-400 font-normal">({pct}%)</span></span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}

              <div className="border-t border-slate-200 pt-4 flex justify-between">
                <span className="text-lg font-bold text-slate-900">Total Estimated</span>
                <span className="text-2xl font-extrabold text-blue-600">${budgetBreakdown.total.toLocaleString()}</span>
              </div>
              <p className="text-xs text-slate-500">
                {budgetBreakdown.total <= preferences.budget
                  ? `✅ Within your budget of $${preferences.budget.toLocaleString()} — you have $${(preferences.budget - budgetBreakdown.total).toLocaleString()} to spare!`
                  : `⚠️ Estimated cost exceeds your budget by $${(budgetBreakdown.total - preferences.budget).toLocaleString()}. Consider a shorter stay or budget accommodation.`
                }
              </p>
            </div>
          </div>
        )}

        {/* TIPS TAB */}
        {activeTab === 'tips' && (
          <div className="max-w-2xl space-y-6">
            <div>
              <h2 className="section-title mb-4">Travel Tips for {destination.name}</h2>
              <div className="space-y-2">
                {travelTips.map((tip, i) => (
                  <div key={i} className="card p-4 text-sm text-slate-700">{tip}</div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Luggage className="w-5 h-5 text-blue-600" /> Packing List
              </h3>
              <div className="card p-4">
                <div className="grid sm:grid-cols-2 gap-2">
                  {packingTips.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-slate-700">
                      <div className="w-5 h-5 rounded border-2 border-slate-300 flex-shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {bookingModal && (
        <BookingModal
          item={bookingModal.item}
          type={bookingModal.type}
          travelers={preferences.travelers}
          itineraryId={itinerary.id}
          onClose={() => setBookingModal(null)}
          onSuccess={() => setTimeout(() => setBookingModal(null), 3000)}
        />
      )}
    </div>
  )
}
