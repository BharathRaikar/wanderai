import { Star, Clock, ArrowRight } from 'lucide-react'

const typeIcons = {
  flight:       '✈️',
  train:        '🚄',
  bullet_train: '🚅',
  speedboat:    '🚤',
  seaplane:     '🛥️',
  ferry:        '⛴️'
}

const classColors = {
  economy:    'bg-slate-100 text-slate-600',
  standard:   'bg-slate-100 text-slate-600',
  'mid-range': 'bg-blue-100 text-blue-700',
  business:   'bg-blue-100 text-blue-700',
  reserved:   'bg-blue-100 text-blue-700',
  premium:    'bg-purple-100 text-purple-700',
  vistadome:  'bg-green-100 text-green-700',
  deck:       'bg-slate-100 text-slate-600'
}

export default function TransportCard({ transport: t, travelers = 1, onBook }) {
  if (!t) return null
  const totalCost = t.priceUSD * travelers

  return (
    <div className="card p-5 hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* Icon */}
          <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-2xl border border-slate-100">
            {typeIcons[t.type] || '🚌'}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-bold text-slate-900">{t.provider}</span>
              <span className={`badge ${classColors[t.class] || 'bg-slate-100 text-slate-600'} capitalize`}>
                {t.class}
              </span>
            </div>
            {/* Route */}
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <span className="font-medium">{t.from}</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-medium">{t.to}</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">{t.description}</p>
          </div>
        </div>

        <div className="text-right flex-shrink-0">
          <p className="text-xl font-bold text-slate-900">${t.priceUSD.toLocaleString()}<span className="text-xs font-normal text-slate-500">/person</span></p>
          {travelers > 1 && (
            <p className="text-xs text-slate-500">${totalCost.toLocaleString()} total</p>
          )}
          <div className="flex items-center justify-end gap-1 mt-1 mb-2">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs text-slate-500">{t.durationHours}h</span>
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 ml-1" />
            <span className="text-xs text-slate-600 font-medium">{t.rating}</span>
          </div>
          {onBook && (
            <button
              onClick={() => onBook(t)}
              className="btn-primary text-xs py-1.5 px-4 w-full"
            >
              Book
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
