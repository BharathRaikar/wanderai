import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Planner from './pages/Planner'
import ItineraryPage from './pages/ItineraryPage'
import Bookings from './pages/Bookings'
import Explore from './pages/Explore'
import Login from './pages/Login'
import Register from './pages/Register'

// Redirect authenticated users away from auth pages
function GuestRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return null
  return isAuthenticated ? <Navigate to="/" replace /> : children
}

function AppShell() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main>
        <Routes>
          <Route path="/"              element={<Home />} />
          <Route path="/explore"       element={<Explore />} />
          <Route path="/planner"       element={<Planner />} />
          <Route path="/itinerary/:id" element={<ItineraryPage />} />
          <Route path="/bookings"      element={<Bookings />} />
          <Route path="/login"         element={<GuestRoute><Login /></GuestRoute>} />
          <Route path="/register"      element={<GuestRoute><Register /></GuestRoute>} />
          <Route path="*"              element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppShell />
      <SpeedInsights />
    </AuthProvider>
  )
}
