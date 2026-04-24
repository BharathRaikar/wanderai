import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { generateItinerary } from '../services/api'
import {
  Calendar, DollarSign, Users, Tag, Compass, Globe,
  Loader2, ArrowRight, Plane, Sparkles, ChevronRight, ChevronLeft
} from 'lucide-react'

const INTERESTS = [
  { id: 'culture',     label: '🏛️ Culture',     },
  { id: 'food',        label: '🍜 Food & Wine'  },
  { id: 'adventure',   label: '🧗 Adventure'    },
  { id: 'nature',      label: '🌿 Nature'       },
  { id: 'beach',       label: '🏖️ Beach'        },
  { id: 'history',     label: '📜 History'      },
  { id: 'art',         label: '🎨 Art'          },
  { id: 'nightlife',   label: '🎉 Nightlife'    },
  { id: 'shopping',    label: '🛍️ Shopping'     },
  { id: 'spiritual',   label: '🙏 Spiritual'    },
  { id: 'photography', label: '📸 Photography'  },
  { id: 'wildlife',    label: '🦁 Wildlife'     },
]

const TRAVEL_STYLES = [
  { id: 'culture',     label: 'Cultural Explorer', emoji: '🏛️', desc: 'Museums, temples, local traditions' },
  { id: 'adventure',   label: 'Thrill Seeker',      emoji: '🧗', desc: 'Hiking, extreme sports, outdoor challenges' },
  { id: 'relaxation',  label: 'Rest & Recharge',    emoji: '🧘', desc: 'Spas, beaches, slow travel' },
  { id: 'food',        label: 'Foodie Journey',      emoji: '🍽️', desc: 'Local cuisine, cooking classes, markets' },
  { id: 'romantic',    label: 'Romantic Getaway',   emoji: '💑', desc: 'Intimate settings, sunsets, luxury' },
  { id: 'nightlife',   label: 'Party & Social',     emoji: '🎉', desc: 'Bars, clubs, festivals, events' },
]

const STEPS = ['Dates & Budget', 'Preferences', 'Destination', 'Review']

export default function Planner() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const today = new Date().toISOString().split('T')[0]
  const nextWeek = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]
  const inTwoWeeks = new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]

  const [form, setForm] = useState({
    startDate: nextWeek,
    endDate: inTwoWeeks,
    budget: 3000,
    travelers: 2,
    interests: ['culture', 'food'],
    travelStyle: 'culture',
    preferredDestination: '',
    flexibility: 'open'
  })

  const set = (key, value) => setForm(f => ({ ...f, [key]: value }))

  const toggleInterest = (id) => {
    setForm(f => ({
      ...f,
      interests: f.interests.includes(id)
        ? f.interests.filter(i => i !== id)
        : [...f.interests, id]
    }))
  }

  const numDays = Math.max(1, Math.round((new Date(form.endDate) - new Date(form.startDate)) / 86400000))

  const handleGenerate = async () => {
    setLoading(true)
    setError(null)
    try {
      const itinerary = await generateItinerary(form)
      navigate(`/itinerary/${itinerary.id}`, { state: { itinerary } })
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate itinerary. Please try again.')
      setLoading(false)
    }
  }

  const canNext = () => {
    if (step === 0) return form.startDate && form.endDate && form.budget > 0 && form.travelers > 0
    if (step === 1) return form.interests.length > 0 && form.travelStyle
    return true
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-slate-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-sm px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-4 h-4" />
            AI Itinerary Planner
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Plan Your Perfect Trip</h1>
          <p className="text-slate-600 mt-2">Answer a few questions and we'll build your itinerary in seconds.</p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-between mb-8">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center gap-2 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 transition-all ${
                i < step ? 'bg-green-500 text-white'
                : i === step ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                : 'bg-slate-100 text-slate-400'
              }`}>
                {i < step ? '✓' : i + 1}
              </div>
              <span className={`text-xs font-medium hidden sm:block ${i === step ? 'text-blue-600' : i < step ? 'text-green-600' : 'text-slate-400'}`}>
                {label}
              </span>
              {i < STEPS.length - 1 && (
                <div className={`h-0.5 flex-1 mx-2 rounded-full ${i < step ? 'bg-green-400' : 'bg-slate-200'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step card */}
        <div className="card p-6 sm:p-8 animate-fade-in">

          {/* STEP 0: Dates & Budget */}
          {step === 0 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-slate-900 mb-1">When are you travelling?</h2>
              <p className="text-slate-500 text-sm mb-4">Set your travel dates and budget.</p>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label flex items-center gap-1.5"><Calendar className="w-4 h-4 text-blue-500" />Departure Date</label>
                  <input type="date" className="input" min={today} value={form.startDate}
                    onChange={e => set('startDate', e.target.value)} />
                </div>
                <div>
                  <label className="label flex items-center gap-1.5"><Calendar className="w-4 h-4 text-blue-500" />Return Date</label>
                  <input type="date" className="input" min={form.startDate} value={form.endDate}
                    onChange={e => set('endDate', e.target.value)} />
                </div>
              </div>

              {numDays > 0 && (
                <div className="bg-blue-50 rounded-xl px-4 py-2 text-sm text-blue-700 font-medium">
                  📅 Trip duration: {numDays} day{numDays > 1 ? 's' : ''}
                </div>
              )}

              <div>
                <label className="label flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-blue-500" />
                  Total Budget (USD)
                </label>
                <input type="number" className="input" min="100" step="100" value={form.budget}
                  onChange={e => set('budget', Number(e.target.value))} />
                <div className="flex gap-2 mt-2">
                  {[500, 1500, 3000, 7000, 15000].map(b => (
                    <button key={b} onClick={() => set('budget', b)}
                      className={`text-xs px-3 py-1 rounded-full border transition-all ${
                        form.budget === b ? 'bg-blue-600 text-white border-blue-600' : 'border-slate-200 text-slate-600 hover:border-blue-400'
                      }`}>
                      ${b.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="label flex items-center gap-1.5"><Users className="w-4 h-4 text-blue-500" />Number of Travelers</label>
                <div className="flex items-center gap-3">
                  <button onClick={() => set('travelers', Math.max(1, form.travelers - 1))}
                    className="w-10 h-10 rounded-full border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-colors flex items-center justify-center text-xl">−</button>
                  <span className="text-2xl font-bold text-slate-900 w-10 text-center">{form.travelers}</span>
                  <button onClick={() => set('travelers', Math.min(20, form.travelers + 1))}
                    className="w-10 h-10 rounded-full border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-colors flex items-center justify-center text-xl">+</button>
                  <span className="text-slate-500 text-sm">
                    ~${Math.round(form.budget / form.travelers).toLocaleString()} per person
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 1: Preferences */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-1">What do you love?</h2>
                <p className="text-slate-500 text-sm mb-4">Select all your interests.</p>
                <div className="flex flex-wrap gap-2">
                  {INTERESTS.map(({ id, label }) => (
                    <button key={id} onClick={() => toggleInterest(id)}
                      className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                        form.interests.includes(id)
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : 'border-slate-200 text-slate-600 hover:border-blue-400 hover:bg-blue-50'
                      }`}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 mb-3">Your travel style</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {TRAVEL_STYLES.map(({ id, label, emoji, desc }) => (
                    <button key={id} onClick={() => set('travelStyle', id)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        form.travelStyle === id
                          ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                          : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                      }`}>
                      <div className="text-2xl mb-1">{emoji}</div>
                      <div className="font-semibold text-sm text-slate-900">{label}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Destination */}
          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-slate-900 mb-1">Any destination in mind?</h2>
              <p className="text-slate-500 text-sm mb-4">Leave blank and our AI will pick the best match for you.</p>

              <div>
                <label className="label flex items-center gap-1.5"><Globe className="w-4 h-4 text-blue-500" />Preferred Destination (optional)</label>
                <input type="text" className="input" placeholder="e.g. Japan, Paris, Bali..." value={form.preferredDestination}
                  onChange={e => set('preferredDestination', e.target.value)} />
              </div>

              <div>
                <label className="label flex items-center gap-1.5"><Compass className="w-4 h-4 text-blue-500" />How flexible are you?</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'fixed', label: '🎯 Fixed', desc: 'I know exactly where I want to go' },
                    { id: 'open', label: '🌀 Open', desc: 'Surprise me with the best match' },
                    { id: 'flexible', label: '🗺️ Flexible', desc: 'A few options would be great' },
                  ].map(({ id, label, desc }) => (
                    <button key={id} onClick={() => set('flexibility', id)}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        form.flexibility === id
                          ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                          : 'border-slate-200 hover:border-blue-300'
                      }`}>
                      <div className="font-semibold text-sm text-slate-900">{label}</div>
                      <div className="text-xs text-slate-500 mt-1">{desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Review */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 mb-1">Review & Generate</h2>
              <p className="text-slate-500 text-sm mb-4">Everything looks good? Let's build your itinerary!</p>

              <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
                {[
                  { label: 'Travel Dates', value: `${form.startDate} → ${form.endDate} (${numDays} days)` },
                  { label: 'Budget', value: `$${form.budget.toLocaleString()} total · ~$${Math.round(form.budget / form.travelers).toLocaleString()}/person` },
                  { label: 'Travelers', value: `${form.travelers} person${form.travelers > 1 ? 's' : ''}` },
                  { label: 'Travel Style', value: TRAVEL_STYLES.find(s => s.id === form.travelStyle)?.label || form.travelStyle },
                  { label: 'Interests', value: form.interests.map(id => INTERESTS.find(i => i.id === id)?.label || id).join(', ') },
                  { label: 'Destination', value: form.preferredDestination || '🤖 AI will choose the best match' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between gap-4 text-sm">
                    <span className="text-slate-500 font-medium flex-shrink-0">{label}</span>
                    <span className="text-slate-900 font-medium text-right">{value}</span>
                  </div>
                ))}
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
                  {error}
                </div>
              )}

              <button
                onClick={handleGenerate}
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2 py-4 text-base"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Building your itinerary…
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate My Itinerary
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-slate-100">
            {step > 0 ? (
              <button onClick={() => setStep(s => s - 1)} className="btn-secondary flex items-center gap-2">
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
            ) : <div />}
            {step < STEPS.length - 1 && (
              <button onClick={() => setStep(s => s + 1)} disabled={!canNext()}
                className="btn-primary flex items-center gap-2">
                Next <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
