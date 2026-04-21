# WanderAI — AI-Powered Travel Itinerary Planner

A full-stack web application that generates personalised day-by-day travel itineraries based on a user's budget, travel dates, interests, and style. Built as a personal portfolio project.

---

## Features

- **Smart itinerary generation** — A rule-based engine scores and ranks destinations by budget fit, interests, season, and travel style. It then assembles a full day-by-day plan with hotels, activities, and transport.
- **15 curated destinations** — Covers Europe, Asia, the Americas, Africa, and the Middle East, including three Indian destinations: Goa, Rajasthan, and Kerala.
- **Interactive map** — Every itinerary includes a Leaflet.js map showing the destination, hotel, and activity pins.
- **Booking flow** — Users can book hotels, activities, and transport with a confirmation code generated on the spot.
- **User accounts** — JWT-based authentication with bcrypt password hashing. Itineraries and bookings are scoped to the logged-in user and persisted across sessions.
- **Budget breakdown** — Visual bar chart showing estimated spend across accommodation, transport, activities, food, and miscellaneous.
- **Travel tips & packing list** — Auto-generated per destination based on climate and travel month.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router v6, Tailwind CSS, Vite |
| Backend | Node.js, Express |
| Auth | JSON Web Tokens (JWT), bcryptjs |
| Database | JSON flat-file store (zero native deps, cross-platform) |
| Map | Leaflet.js (OpenStreetMap, no API key required) |
| HTTP | Axios |

---

## Project Structure

```
wanderai/
├── client/                  # React frontend (Vite)
│   └── src/
│       ├── components/      # Navbar, cards, BookingModal, MapView
│       ├── context/         # AuthContext (JWT session)
│       ├── pages/           # Home, Explore, Planner, Itinerary, Bookings, Login, Register
│       └── services/        # Axios API wrapper
│
└── server/                  # Express backend
    ├── data/                # Mock JSON datasets (destinations, hotels, activities, transport)
    ├── middleware/          # JWT auth middleware
    ├── routes/              # /api/auth, /api/destinations, /api/itinerary, /api/bookings
    └── services/            # Itinerary generation engine
```

---

## Getting Started

### Prerequisites
- Node.js 18 or higher

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/wanderai.git
cd wanderai
```

### 2. Set up the backend

```bash
cd server
cp .env.example .env          # copy env template
npm install
npm run dev                   # starts on http://localhost:3001
```

### 3. Set up the frontend

```bash
# in a new terminal
cd client
npm install
npm run dev                   # starts on http://localhost:5173
```

### 4. Open the app

Visit **http://localhost:5173** in your browser.

---

## API Reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | — | Create account |
| `POST` | `/api/auth/login` | — | Sign in, receive JWT |
| `GET` | `/api/auth/me` | ✅ | Get current user |
| `GET` | `/api/destinations` | — | List all destinations |
| `POST` | `/api/destinations/recommend` | — | Rank destinations by preferences |
| `POST` | `/api/itinerary/generate` | Optional | Generate + persist itinerary |
| `GET` | `/api/itinerary` | Optional | List itineraries (user-scoped if authed) |
| `GET` | `/api/itinerary/:id` | — | Get full itinerary |
| `DELETE` | `/api/itinerary/:id` | ✅ | Delete itinerary |
| `POST` | `/api/bookings` | Optional | Create booking |
| `GET` | `/api/bookings` | Optional | List bookings (user-scoped if authed) |
| `DELETE` | `/api/bookings/:id` | Optional | Cancel booking |

---

## Extending with Real APIs

The mock data layer in `server/data/` and the engine in `server/services/itineraryGenerator.js` are designed to be replaced with live API calls:

- **[Amadeus for Developers](https://developers.amadeus.com)** — Flight search, hotel search, points of interest (free developer tier)
- **[Google Places API](https://developers.google.com/maps/documentation/places/web-service)** — Destination discovery and activity search
- **[Open-Meteo](https://open-meteo.com)** — Free weather forecasts for travel dates (no API key)
- **[ExchangeRate API](https://www.exchangerate-api.com)** — Real-time currency conversion (free tier)

---

## Roadmap

- [ ] Real flight and hotel pricing via Amadeus API
- [ ] Weather forecast widget for travel dates
- [ ] PDF export of itinerary
- [ ] Share itinerary via public link
- [ ] Multi-itinerary comparison view
- [ ] Email booking confirmations via Resend

---

## Development Notes

This project was developed with AI-assisted tooling. Architecture decisions, feature scope, product direction, and all iteration were driven by me — AI was used as an accelerator, similar to how a developer might use GitHub Copilot or pair programming. The full codebase has been reviewed, tested, and understood before publishing.

---

## License

MIT — feel free to fork, adapt, and build on this.
