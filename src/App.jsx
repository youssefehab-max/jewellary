import React, { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnnouncementBar, AppPromoBar } from './components/AnnouncementBar'
import { Header } from './components/Header'
import { NavDrawer } from './components/NavDrawer'
import { CartDrawer } from './components/CartDrawer'
import { FloatingActions } from './components/FloatingActions'
import { Footer } from './components/Footer'
import Home from './pages/Home'
import Collection from './pages/Collection'
import ProductDetail from './pages/ProductDetail'

// Component to track page views with Facebook Pixel
function PixelPageViewTracker() {
  const location = useLocation();

  useEffect(() => {
    if (window.fbq) {
      window.fbq('track', 'PageView');
    }
  }, [location]);

  return null;
}

export default function App() {
  const location = useLocation()

  // Scroll to top on route change for a native app-like feel.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <div className="min-h-screen flex flex-col">
      {/* تتبع الزيارات عبر Meta Pixel */}
      <PixelPageViewTracker />

      <AnnouncementBar />
      <AppPromoBar />
      <Header />
      <NavDrawer />
      <CartDrawer />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collections/:slug" element={<Collection />} />
          <Route path="/products/:id" element={<ProductDetail />} />
        </Routes>
      </main>

      <Footer />
      <FloatingActions />
    </div>
  )
}
