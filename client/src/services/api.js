import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
})

// ─── Itinerary ────────────────────────────────────────────────────────────────
export const generateItinerary = (preferences) =>
  api.post('/itinerary/generate', preferences).then(r => r.data.itinerary)

export const getItinerary = (id) =>
  api.get(`/itinerary/${id}`).then(r => r.data.itinerary)

export const listItineraries = () =>
  api.get('/itinerary').then(r => r.data.itineraries)

export const deleteItinerary = (id) =>
  api.delete(`/itinerary/${id}`).then(r => r.data)

// ─── Destinations ─────────────────────────────────────────────────────────────
export const getDestinations = (params = {}) =>
  api.get('/destinations', { params }).then(r => r.data.destinations)

export const getDestination = (id) =>
  api.get(`/destinations/${id}`).then(r => r.data)

export const recommendDestinations = (preferences) =>
  api.post('/destinations/recommend', preferences).then(r => r.data.destinations)

// ─── Bookings ─────────────────────────────────────────────────────────────────
export const createBooking = (booking) =>
  api.post('/bookings', booking).then(r => r.data)

export const listBookings = () =>
  api.get('/bookings').then(r => r.data.bookings)

export const cancelBooking = (id) =>
  api.delete(`/bookings/${id}`).then(r => r.data)

export default api
