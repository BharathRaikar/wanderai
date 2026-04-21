import { useState } from 'react'
import { X, Check, Loader2 } from 'lucide-react'
import { createBooking } from '../services/api'

export default function BookingModal({ item, type, travelers, itineraryId, onClose, onSuccess }) {
  const [form, setForm] = useState({ guestName: '', guestEmail: '', date: '' })
  const [loading, setLoading] = useState(false)
  const [confirmation, setConfirmation] = useState(null)
  const [error, setError] = useState(null)

  const price = type === 'hotel' ? item.pricePerNight
    : type === 'transport' ? item.priceUSD
    : item.priceUSD

  const itemName = item.name || item.provider

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const result = await createBooking({
        itineraryId,
        type,
        itemId: item.id,
        itemName,
        travelers,
        pricePerPerson: price,
        date: form.date,
        guestName: form.guestName,
        guestEmail: form.guestEmail
      })
      setConfirmation(result.booking)
      onSuccess && onSuccess(result.booking)
    } catch (err) {
      setError(err.response?.data?.error || 'Booking failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">
            {confirmation ? '🎉 Booking Confirmed!' : `Book ${itemName}`}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="p-5">
          {confirmation ? (
            /* Success state */
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-slate-600 mb-2">Your booking is confirmed!</p>
              <div className="bg-slate-50 rounded-xl p-4 text-left space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Confirmation #</span>
                  <span className="font-bold text-blue-600">{confirmation.confirmationCode}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Item</span>
                  <span className="font-medium">{confirmation.itemName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Travelers</span>
                  <span className="font-medium">{confirmation.travelers}</span>
                </div>
                <div className="flex justify-between text-sm border-t border-slate-200 pt-2 mt-2">
                  <span className="font-semibold text-slate-700">Total</span>
                  <span className="font-bold text-slate-900">${confirmation.totalPrice.toLocaleString()}</span>
                </div>
              </div>
              <button onClick={onClose} className="btn-primary w-full mt-4">Done</button>
            </div>
          ) : (
            /* Booking form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Price summary */}
              <div className="bg-blue-50 rounded-xl p-3 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>${price.toLocaleString()} × {travelers} traveler{travelers > 1 ? 's' : ''}</span>
                  <span className="font-bold text-slate-900">${(price * travelers).toLocaleString()}</span>
                </div>
              </div>

              <div>
                <label className="label">Full Name</label>
                <input
                  type="text"
                  required
                  className="input"
                  placeholder="Jane Smith"
                  value={form.guestName}
                  onChange={e => setForm(f => ({ ...f, guestName: e.target.value }))}
                />
              </div>

              <div>
                <label className="label">Email Address</label>
                <input
                  type="email"
                  required
                  className="input"
                  placeholder="jane@example.com"
                  value={form.guestEmail}
                  onChange={e => setForm(f => ({ ...f, guestEmail: e.target.value }))}
                />
              </div>

              {type !== 'transport' && (
                <div>
                  <label className="label">Date</label>
                  <input
                    type="date"
                    required
                    className="input"
                    value={form.date}
                    onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                  />
                </div>
              )}

              {error && (
                <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
              )}

              <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? 'Processing...' : `Confirm Booking · $${(price * travelers).toLocaleString()}`}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
