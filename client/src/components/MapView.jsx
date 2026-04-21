import { useEffect, useRef } from 'react'

// Marker colour helpers
const COLOURS = {
  destination: '#2563eb',  // blue  – main destination pin
  hotel:       '#16a34a',  // green – hotel
  activity:    '#ea580c',  // orange – activities
}

function makeIcon(colour, label) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 40" width="32" height="40">
      <path d="M16 0C7.16 0 0 7.16 0 16c0 10.5 16 24 16 24S32 26.5 32 16C32 7.16 24.84 0 16 0z"
            fill="${colour}" stroke="white" stroke-width="2"/>
      <circle cx="16" cy="16" r="7" fill="white"/>
      <text x="16" y="20" text-anchor="middle" font-size="10"
            font-family="sans-serif" font-weight="bold" fill="${colour}">${label}</text>
    </svg>`
  return window.L.divIcon({
    html: svg,
    className: '',
    iconSize: [32, 40],
    iconAnchor: [16, 40],
    popupAnchor: [0, -38],
  })
}

export default function MapView({ destination, hotel, activities = [], height = '420px' }) {
  const mapRef = useRef(null)
  const instanceRef = useRef(null)

  useEffect(() => {
    if (!window.L || !destination?.lat) return

    // Destroy previous instance (React StrictMode safe)
    if (instanceRef.current) {
      instanceRef.current.remove()
      instanceRef.current = null
    }

    const map = window.L.map(mapRef.current, {
      center: [destination.lat, destination.lng],
      zoom: 11,
      scrollWheelZoom: false,
    })
    instanceRef.current = map

    // Tile layer – OpenStreetMap (free, no key)
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map)

    const bounds = []

    // ── Main destination pin ──────────────────────────────────────────────────
    const destMarker = window.L.marker(
      [destination.lat, destination.lng],
      { icon: makeIcon(COLOURS.destination, '📍') }
    ).addTo(map)
    destMarker.bindPopup(`
      <div style="font-family:sans-serif;min-width:160px">
        <img src="${destination.image}" style="width:100%;height:80px;object-fit:cover;border-radius:6px;margin-bottom:6px"
             onerror="this.style.display='none'"/>
        <b style="font-size:13px">${destination.name}</b><br/>
        <span style="color:#64748b;font-size:11px">${destination.country}</span><br/>
        <span style="color:#f59e0b;font-size:11px">★ ${destination.rating}</span>
      </div>
    `, { maxWidth: 200 })
    bounds.push([destination.lat, destination.lng])

    // ── Hotel pin ─────────────────────────────────────────────────────────────
    if (hotel?.lat) {
      const hm = window.L.marker([hotel.lat, hotel.lng], { icon: makeIcon(COLOURS.hotel, '🏨') }).addTo(map)
      hm.bindPopup(`
        <div style="font-family:sans-serif;min-width:140px">
          <b style="font-size:12px">${hotel.name}</b><br/>
          <span style="color:#64748b;font-size:11px">${hotel.address}</span><br/>
          <span style="color:#2563eb;font-size:12px;font-weight:bold">$${hotel.pricePerNight}/night</span>
        </div>
      `)
      bounds.push([hotel.lat, hotel.lng])
    }

    // ── Activity pins ─────────────────────────────────────────────────────────
    // Scatter activities in a circle around the destination centre (mock coords)
    const R = 0.04 // ~4km radius spread
    activities.slice(0, 8).forEach((act, i) => {
      const angle = (i / Math.min(activities.length, 8)) * 2 * Math.PI
      const lat = (act.lat) || destination.lat + R * Math.cos(angle) * (0.6 + 0.4 * ((i * 7) % 3) / 3)
      const lng = (act.lng) || destination.lng + R * Math.sin(angle) * (0.6 + 0.4 * ((i * 5) % 3) / 3)
      if (!lat) return
      act = { ...act, lat, lng }
      const am = window.L.marker([act.lat, act.lng], { icon: makeIcon(COLOURS.activity, String(i + 1)) }).addTo(map)
      am.bindPopup(`
        <div style="font-family:sans-serif;min-width:140px">
          <b style="font-size:12px">${act.name}</b><br/>
          <span style="color:#64748b;font-size:11px;text-transform:capitalize">${act.category}</span><br/>
          <span style="font-size:11px">${act.priceUSD === 0 ? '✅ Free' : `$${act.priceUSD}`} · ${act.duration}h</span>
        </div>
      `)
      bounds.push([act.lat, act.lng])
    })

    // Fit map to all markers
    if (bounds.length > 1) {
      map.fitBounds(bounds, { padding: [40, 40] })
    }

    return () => {
      if (instanceRef.current) {
        instanceRef.current.remove()
        instanceRef.current = null
      }
    }
  }, [destination, hotel, activities])

  if (!destination?.lat) {
    return (
      <div className="flex items-center justify-center bg-slate-100 rounded-2xl text-slate-400 text-sm" style={{ height }}>
        📍 Map coordinates not available for this destination.
      </div>
    )
  }

  return (
    <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
      <div ref={mapRef} style={{ height, width: '100%' }} />
      {/* Legend */}
      <div className="bg-white border-t border-slate-100 px-4 py-2 flex items-center gap-5 text-xs text-slate-600">
        {[
          { colour: COLOURS.destination, label: 'Destination' },
          { colour: COLOURS.hotel,       label: 'Hotel' },
          { colour: COLOURS.activity,    label: 'Activities' },
        ].map(({ colour, label }) => (
          <span key={label} className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full inline-block" style={{ background: colour }} />
            {label}
          </span>
        ))}
        <span className="ml-auto text-slate-400">© OpenStreetMap</span>
      </div>
    </div>
  )
}
