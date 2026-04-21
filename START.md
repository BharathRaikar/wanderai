# WanderAI — Quick Start Guide (v2 — MVP)

## Prerequisites
- Node.js 18+ installed ([nodejs.org](https://nodejs.org))
- A terminal / command prompt

---

## Step 1 — Install Dependencies

Open two terminals in this folder.

**Terminal 1 (Backend):**
```bash
cd server
npm install
```

**Terminal 2 (Frontend):**
```bash
cd client
npm install
```

---

## Step 2 — Start the App

**Terminal 1 — Start the API server (port 3001):**
```bash
cd server
npm run dev
```
You should see:
```
🌍 WanderAI Travel Planner API
   Server running at http://localhost:3001
   Health check: http://localhost:3001/api/health
```

**Terminal 2 — Start the React frontend (port 5173):**
```bash
cd client
npm run dev
```

---

## Step 3 — Open in Browser

Navigate to: **http://localhost:5173**

---

## What's Inside

| Feature | Description |
|---|---|
| 🏠 Home | Landing page with featured destinations |
| 🔍 Explore | Browse & filter 15 destinations (inc. 3 in India) |
| 🗺️ Plan Trip | 4-step wizard to configure your trip |
| 📋 Itinerary | Day-by-day plan with hotel, transport, activities, **map**, budget, tips |
| 🗺️ Map View | Interactive Leaflet map — destination pin, hotel, activities |
| 📖 Bookings | View and manage all bookings (persisted to SQLite) |
| 🔐 Auth | Register / Login with JWT — itineraries & bookings scoped to user |

## New in v2 (MVP)
- **User auth** — register/login with bcrypt + JWT; 30-day sessions
- **SQLite persistence** — all itineraries and bookings survive server restarts
- **Interactive map** — Leaflet (free, no API key) on every itinerary
- **India destinations** — Goa, Rajasthan, Kerala with full hotels/activities/transport

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/register | Create account |
| POST | /api/auth/login | Sign in, receive JWT |
| GET  | /api/auth/me | Get current user |
| GET  | /api/destinations | List all 15 destinations |
| POST | /api/destinations/recommend | AI destination recommendation |
| POST | /api/itinerary/generate | Generate + persist itinerary |
| GET  | /api/itinerary | List user's itineraries |
| GET  | /api/itinerary/:id | Get full itinerary |
| POST | /api/bookings | Create a booking |
| GET  | /api/bookings | List user's bookings |
| DELETE | /api/bookings/:id | Cancel a booking |

## Extending with Real APIs

To connect real travel APIs, replace mock data in `server/data/` or update the service calls in `server/services/itineraryGenerator.js`:

- **Amadeus** ([developers.amadeus.com](https://developers.amadeus.com)) — Flights, hotels, activities (free dev tier)
- **Google Places API** — Destination discovery & maps
- **Booking.com Affiliate API** — Hotel rates and availability
- **Skyscanner API** — Flight search and pricing
