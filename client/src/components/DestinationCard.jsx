import { Star, DollarSign, MapPin, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'

const budgetColors = {
  low:     'bg-green-100 text-green-700',
  medium:  'bg-amber-100 text-amber-700',
  high:    'bg-orange-100 text-orange-700',
  luxury:  'bg-purple-100 text-purple-700'
}

export default function DestinationCard({ destination, showScore = false, onClick }) {
  const { id, name, country, image, description, tags, rating, avgDailyCostUSD, budgetLevel, matchScore } = destination

  const card = (
    <div
      className="card group cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
      onClick={onClick}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={e => { e.target.src = `https://source.unsplash.com/800x600/?${name},travel` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        {/* Match score badge */}
        {showScore && matchScore && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
            <TrendingUp className="w-3 h-3" />
            {matchScore}% match
          </div>
        )}

        {/* Location */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white text-sm font-semibold drop-shadow">
          <MapPin className="w-4 h-4" />
          {name}, {country}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-sm text-slate-600 line-clamp-2 mb-3">{description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {tags.slice(0, 4).map(tag => (
            <span key={tag} className="badge bg-slate-100 text-slate-600 capitalize">{tag}</span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div className="flex items-center gap-1 text-amber-500">
            <Star className="w-4 h-4 fill-amber-400" />
            <span className="text-sm font-semibold text-slate-700">{rating}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className={`badge ${budgetColors[budgetLevel] || 'bg-slate-100 text-slate-600'} capitalize`}>
              {budgetLevel}
            </span>
            <span className="text-sm text-slate-500">~${avgDailyCostUSD}/day</span>
          </div>
        </div>
      </div>
    </div>
  )

  if (onClick) return card
  return <Link to={`/explore?dest=${id}`} className="block">{card}</Link>
}
