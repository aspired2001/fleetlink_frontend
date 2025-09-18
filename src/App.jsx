import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store'
import Navigation from './components/Navigation'
import AddVehicleForm from './components/AddVehicleForm'
import SearchBookPage from './components/SearchBookPage'
import VehicleList from './components/VehicleList'
import BookingList from './components/BookingList'
import { ToastProvider } from './components/ui/toast'
import './index.css'

function AppContent() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Navigate to="/search" replace />} />
          <Route path="/search" element={<SearchBookPage />} />
          <Route path="/add-vehicle" element={<AddVehicleForm />} />
          <Route path="/vehicles" element={<VehicleList />} />
          <Route path="/bookings" element={<BookingList />} />
          {/* Fallback route for any unmatched paths */}
          <Route path="*" element={<Navigate to="/search" replace />} />
        </Routes>
      </main>
    </div>
  )
}

function App() {
  return (
    <Provider store={store}>
      <ToastProvider>
        <Router>
          <AppContent />
        </Router>
      </ToastProvider>
    </Provider>
  )
}

export default App