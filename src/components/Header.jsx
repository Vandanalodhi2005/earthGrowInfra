'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { PhoneCall, Search, X } from 'lucide-react'

function Header() {
    const [scrolled, setScrolled] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const pathname = usePathname()

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false)
    }, [pathname])

    const isActive = (path) => {
        return pathname === path ? 'active-link' : ''
    }

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen)
    }

    const handleSearchSubmit = (e) => {
        e.preventDefault()
        if (searchTerm.trim()) {
            // Redirect to a global search or properties page with query
            window.location.href = `/properties?search=${encodeURIComponent(searchTerm.trim())}`
        }
    }

    return (
        <>
        <div style={{ height: '80px' }}></div>
        <header className={`navbar ${scrolled ? 'scrolled' : ''}`} id="navbar">
            <div className="container nav-content">
                <Link href="/" className="logo-container" onClick={() => setMobileMenuOpen(false)}>
                    <img src="/logo/logo.png" alt="Earth Grow Infra Emblem" className="logo-badge" />
                </Link>
                <nav className={`nav-links ${mobileMenuOpen ? 'mobile-active' : ''}`}>
                    <Link href="/" className={isActive('/')}>Home</Link>
                    <Link href="/residential" className={isActive('/residential')}>Residential</Link>
                    <Link href="/commercial" className={isActive('/commercial')}>Commercial</Link>
                    <Link href="/resale" className={isActive('/resale')}>Resale</Link>
                    <Link href="/interior" className={isActive('/interior')}>Interior</Link>
                    <Link href="/gallery" className={isActive('/gallery')}>Gallery</Link>
                    <Link href="/about" className={isActive('/about')}>About Us</Link>
                    <Link href="/careers" className={isActive('/careers')}>Careers</Link>

                    <Link href="/contact" className="btn btn-nav-contact">
                        <PhoneCall size={18} />
                        <span>Contact Us</span>
                    </Link>
                </nav>

                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <button 
                        className="nav-search-trigger" 
                        onClick={() => setIsSearchOpen(true)}
                        aria-label="Search"
                    >
                        <Search size={22} />
                    </button>

                    <div className="mobile-menu-toggle" onClick={toggleMobileMenu}>
                        <i className={mobileMenuOpen ? "fas fa-times" : "fas fa-bars"}></i>
                    </div>
                </div>
            </div>

            {/* Professional Search Overlay */}
            <div className={`search-overlay ${isSearchOpen ? 'active' : ''}`}>
                <div className="container search-overlay-content">
                    <form onSubmit={handleSearchSubmit} className="search-overlay-form">
                        <Search className="search-icon" size={24} />
                        <input 
                            type="text" 
                            placeholder="Search properties, projects, or locations..." 
                            className="search-overlay-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            autoFocus={isSearchOpen}
                        />
                        <button type="button" className="search-close-btn" onClick={() => setIsSearchOpen(false)}>
                            <X size={24} />
                        </button>
                    </form>
                </div>
            </div>
        </header>
        {/* Mobile Menu Backdrop */}
        {mobileMenuOpen && <div className="mobile-menu-backdrop" onClick={() => setMobileMenuOpen(false)}></div>}
        </>
    )
}

export default Header
