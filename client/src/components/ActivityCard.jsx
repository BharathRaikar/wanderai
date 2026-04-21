import { Star, Clock, DollarSign, Tag } from 'lucide-react'

const categoryColors = {
  sightseeing: 'bg-blue-100 text-blue-700',
  culture:     'bg-purple-100 text-purple-700',
  food:        'bg-orange-100 text-orange-700',
  adventure:   'bg-red-100 text-red-700',
  nature:      'bg-green-100 text-green-700',
  outdoor:     'bg-emerald-100 text-emerald-700',
  experience:  'bg-pink-100 text-pink-700',
  walking:     'bg-cyan-100 text-cyan-700',
  history:     'bg-amber-100 text-amber-700',
  beach:       'bg-yellow-100 text-yellow-700',
  'water sports': 'bg-sky-100 text-sky-700',
  wildlife:    'bg-lime-100 text-lime-700',
}

export default function ActivityCard({ activity, onBook }) {
  const { name, category, duration, priceUSD, rating, image, description } = activity

  return (
    <div className="card group hover:shadow-md transition-all duration-200">
      {/* Image */}
      <div className="relative h-40 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={e => { e.target.src = `https://source.unsplash.com/600x400/?travel,activity` }}
        />
        <div className={`absolute top-3 left-3 badge ${categoryColors[category] || 'bg-slate-100 text-slate-600'} capitalize font-semibold`}>
          {category}
        </div>
        {priceUSD === 0 && (
          <div className="absolute top-3 right-3 badge bg-green-600 text-white font-bold">FREE</div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-slate-900 mb-1 leading-tight">{name}</h3>
        <p className="text-sm text-slate-600 mb-3 line-clamp-2">{description}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {duration < 24 ? `${duration}h` : `${Math.round(duration/24)} days`}
            </span>
            <span className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              {rating}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">
              {priceUSD === 0 ? 'Free' : `$${priceUSD}`}
            </span>
            {onBook && (
              <button
                onClick={() => onBook(activity)}
                className="btn-primary text-xs py-1.5 px-3"
              >
                Book
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
