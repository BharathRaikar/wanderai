import { Star, Wifi, MapPin, Check } from 'lucide-react'

export default function HotelCard({ hotel, nights = 1, travelers = 1, onBook }) {
  if (!hotel) return null
  const { name, stars, image, pricePerNight, currency, rating, reviews, amenities, address, type, description } = hotel
  const totalCost = pricePerNight * nights * travelers

  const typeColors = {
    luxury:    'bg-purple-100 text-purple-700',
    'mid-range': 'bg-blue-100 text-blue-700',
    boutique:  'bg-pink-100 text-pink-700',
    budget:    'bg-green-100 text-green-700'
  }

  return (
    <div className="card group">
      <div className="flex flex-col sm:flex-row">
        {/* Image */}
        <div className="relative sm:w-56 h-44 sm:h-auto flex-shrink-0 overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={e => { e.target.src = `https://source.unsplash.com/600x400/?hotel,room` }}
          />
          <div className={`absolute top-3 left-3 badge ${typeColors[type] || 'bg-slate-100 text-slate-600'} capitalize font-semibold`}>
            {type}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 flex flex-col justify-between">
          <div>
            {/* Stars */}
            <div className="flex items-center gap-1 mb-1">
              {Array.from({ length: Math.min(stars, 5) }).map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              ))}
              {stars > 5 && <span className="text-xs font-bold text-amber-600 ml-1">{stars}★ Ultra Luxury</span>}
            </div>

            <h3 className="font-bold text-slate-900 text-lg leading-tight">{name}</h3>

            <div className="flex items-center gap-1 text-slate-500 text-sm mt-1 mb-2">
              <MapPin className="w-3.5 h-3.5" />
              {address}
            </div>

            <p className="text-sm text-slate-600 mb-3">{description}</p>

            {/* Amenities */}
            <div className="flex flex-wrap gap-1.5">
              {amenities.slice(0, 5).map(a => (
                <span key={a} className="flex items-center gap-1 text-xs text-slate-600 bg-slate-50 px-2 py-0.5 rounded-full">
                  <Check className="w-3 h-3 text-green-500" />
                  {a}
                </span>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
            <div>
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-semibold text-slate-900">{rating}</span>
                <span className="text-slate-500 text-sm">({reviews.toLocaleString()} reviews)</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-slate-900">${pricePerNight.toLocaleString()}<span className="text-sm font-normal text-slate-500">/night</span></p>
              {nights > 1 && (
                <p className="text-sm text-slate-500">${totalCost.toLocaleString()} total ({nights} nights × {travelers} guest{travelers > 1 ? 's' : ''})</p>
              )}
              {onBook && (
                <button
                  onClick={() => onBook(hotel)}
                  className="btn-primary text-sm py-2 px-4 mt-2"
                >
                  Book Now
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
