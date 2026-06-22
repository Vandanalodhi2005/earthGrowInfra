'use client'

import Header from './Header'
import Footer from './Footer'
import FloatingActions from './FloatingActions'
import ScrollToTop from './ScrollToTop'

export default function UserLayout({ children }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', overflowX: 'hidden', width: '100%' }} className="bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <ScrollToTop />
      <Header />
      <main style={{ flexGrow: 1, width: '100%', overflowX: 'hidden' }}>
        {children}
      </main>
      <FloatingActions />
      <Footer />
    </div>
  )
}
