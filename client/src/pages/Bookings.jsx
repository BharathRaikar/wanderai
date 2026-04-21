import { useState, useEffect } from 'react'
import { listBookings, cancelBooking } from '../services/api'
import { Link } from 'react-router-dom'
import {
  BookOpen, CheckCircle, XCircle, Hotel, Bus, Zap,
  Calendar, Users, DollarSign, Loader2, Trash2
} from 'lucide-react'

const typeIcons = { hotel: Hotel, transport: Bus, activity: Zap }
const typeColors = { hotel: 'bg-blue-100 text-blue-700', transport: 'bg-purple-100 text-purple-700', activity: 'bg-orange-100 text-orange-700' }

export default function Bookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(null)

  useEffect(() => {
    listBookings().then(data => { setBookings(data); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  const handleCancel = async (id) => {
    if (!confirm('Cancel this booking?')) return
    setCancelling(id)
    try {
      await cancelBooking(id)
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'cancelled' } : b))
    } finally {
      setCancelling(null)
    }
  }

  const active = bookings.filter(b => b.status === 'confirmed')
  const cancelled = bookings.filter(b => b.status === 'cancelled')

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-br from-slate-900 to-blue-900 text-white py-14 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white/80 text-sm px-4 py-2 rounded-full mb-4">
            <BookOpen className="w-4 h-4" />
            My Bookings
          </div>
          <h1 className="text-4xl font-extrabold mb-2">Your Bookings</h1>
          <p className="text-white/70">Manage all your travel reservations in one place.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-700 mb-2">No bookings yet</h2>
            <p className="text-slate-500 mb-6">Start by planning a trip and booking hotels, activities, or transport.</p>
            <Link to="/planner" className="btn-primary inline-flex items-center gap-2">Plan a Trip</Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Active bookings */}
            {active.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Confirmed ({active.length})
                </h2>
                <div className="space-y-3">
                  {active.map(booking => <BookingRow key={booking.id} booking={booking} onCancel={handleCancel} cancelling={cancelling} />)}
                </div>
              </div>
            )}

            {/* Cancelled bookings */}
            {cancelled.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-slate-500 mb-4 flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-400" />
                  Cancelled ({cancelled.length})
                </h2>
                <div className="space-y-3 opacity-60">
                  {cancelled.map(booking => <BookingRow key={booking.id} booking={booking} />)}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function BookingRow({ booking, onCancel, cancelling }) {
  const Icon = typeIcons[booking.type] || BookOpen
  const colorClass = typeColors[booking.type] || 'bg-slate-100 text-slate-600'
  const isCancelled = booking.status === 'cancelled'

  return (
    <div className="card p-5 flex items-center gap-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${colorClass}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <h3 className="font-bold text-slate-900 truncate">{booking.itemName}</h3>
          <span className={`badge capitalize ${colorClass}`}>{booking.type}</span>
        </div>
        <div className="flex flex-wrap gap-3 text-xs text-slate-500">
          {booking.date && (
            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{booking.date}</span>
          )}
          <span className="flex items-center gap-1"><Users className="w-3 h-3" />{booking.travelers} traveler{booking.travelers > 1 ? 's' : ''}</span>
          <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />${booking.totalPrice.toLocaleString()}</span>
          <span className="font-medium text-blue-600">{booking.confirmationCode}</span>
        </div>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <span className={`badge font-semibold ${isCancelled ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'}`}>
          {isCancelled ? '✗ Cancelled' : '✓ Confirmed'}
        </span>
        {!isCancelled && onCancel && (
          <button onClick={() => onCancel(booking.id)} disabled={cancelling === booking.id}
            className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            title="Cancel booking">
            {cancelling === booking.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
          </button>
        )}
      </div>
    </div>
  )
}
