import { useState, useEffect } from 'react'
import { getDestinations } from '../services/api'
import { useNavigate, useSearchParams } from 'react-router-dom'
import DestinationCard from '../components/DestinationCard'
import { Search, Globe, Filter, Loader2 } from 'lucide-react'

const CONTINENTS = ['All', 'Europe', 'Asia', 'North America', 'South America', 'Africa', 'Middle East']
const BUDGETS = [
  { label: 'All budgets', value: null },
  { label: 'Budget (< $80/day)', value: 80 },
  { label: 'Mid-range (< $150/day)', value: 150 },
  { label: 'High (< $250/day)', value: 250 },
  { label: 'Luxury', value: 9999 },
]

export default function Explore() {
  const [destinations, setDestinations] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const [continent, setContinent] = useState('All')
  const [budget, setBudget] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    getDestinations()
      .then(data => {
        setDestinations(data)
        setFiltered(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    let result = [...destinations]
    if (search) result = result.filter(d =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.country.toLowerCase().includes(search.toLowerCase()) ||
      d.tags.some(t => t.includes(search.toLowerCase()))
    )
    if (continent !== 'All') result = result.filter(d => d.continent === continent)
    if (budget) result = result.filter(d => d.avgDailyCostUSD <= budget)
    setFiltered(result)
  }, [search, continent, budget, destinations])

  const handleDestinationClick = (dest) => {
    navigate(`/planner?destination=${encodeURIComponent(dest.name)}`)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 to-blue-900 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white/80 text-sm px-4 py-2 rounded-full mb-4">
            <Globe className="w-4 h-4" />
            {destinations.length} destinations worldwide
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">Explore the World</h1>
          <p className="text-white/70 max-w-xl mx-auto mb-8">Browse curated destinations and click any to start planning your trip.</p>

          {/* Search */}
          <div className="relative max-w-lg mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search destinations, countries, or tags…"
              className="w-full bg-white rounded-2xl pl-12 pr-4 py-4 text-slate-900 text-sm shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-slate-100 shadow-sm sticky top-16 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-wrap items-center gap-3">
            <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
            {/* Continent filter */}
            <div className="flex gap-1.5 overflow-x-auto">
              {CONTINENTS.map(c => (
                <button key={c} onClick={() => setContinent(c)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-all ${
                    continent === c ? 'bg-blue-600 text-white border-blue-600' : 'border-slate-200 text-slate-600 hover:border-blue-400'
                  }`}>
                  {c}
                </button>
              ))}
            </div>
            <div className="w-px h-4 bg-slate-200 hidden sm:block" />
            {/* Budget filter */}
            <select
              value={budget ?? ''}
              onChange={e => setBudget(e.target.value ? Number(e.target.value) : null)}
              className="text-xs border border-slate-200 rounded-xl px-3 py-1.5 text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {BUDGETS.map(b => (
                <option key={b.label} value={b.value ?? ''}>{b.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <p className="text-slate-600 text-sm">
            {loading ? 'Loading…' : `Showing ${filtered.length} destination${filtered.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Globe className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-medium">No destinations match your filters.</p>
            <button onClick={() => { setSearch(''); setContinent('All'); setBudget(null) }}
              className="btn-secondary mt-4 text-sm py-2">Clear filters</button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map(dest => (
              <DestinationCard key={dest.id} destination={dest} onClick={() => handleDestinationClick(dest)} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
