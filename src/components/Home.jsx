'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PropertyCard from './PropertyCard';
import HeroSlider from './HeroSlider';
import { API_URL } from '../apiConfig';

function Home() {
    const router = useRouter();

    const [activeTab, setActiveTab] = useState('residential');
    const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth <= 1024);
    const [categories, setCategories] = useState({
        residential: [],
        commercial: [],
        resale: [],
        interior: [],
        plots: []
    });

    useEffect(() => {
        window.scrollTo(0, 0);
        const handleResize = () => setIsMobile(window.innerWidth <= 1024);
        window.addEventListener('resize', handleResize);
        
        // Observer for animations
        const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
        const fadeObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                    entry.target.classList.add('fade-in-up');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        const animatedElements = document.querySelectorAll('.section-header, .property-card, .service-card');
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.animationPlayState = 'paused';
            fadeObserver.observe(el);
        });

        // Fetch and categorize data from API
        const fetchData = async () => {
            try {
                const [propsRes, projsRes] = await Promise.all([
                    fetch(`${API_URL}/api/properties`),
                    fetch(`${API_URL}/api/projects`)
                ]);

                const props = propsRes.ok ? await propsRes.json() : [];
                const projs = projsRes.ok ? (await projsRes.json()).map(p => ({ ...p, isProjectCollection: true })) : [];

                // Combine Residential properties and projects
                const resData = [
                    ...props.filter(p => p.propertyType === 'apartment' || p.propertyType === 'villa'),
                    ...projs.filter(p => p.category === 'residential' || p.type === 'residential')
                ];

                // Combine Commercial properties and projects
                const commData = [
                    ...props.filter(p => p.propertyType === 'commercial' || p.propertyType === 'plot'),
                    ...projs.filter(p => p.category === 'commercial' || p.type === 'commercial')
                ];

                // Resale properties and projects
                const resaleData = [
                    ...props.filter(p => p.transaction === 'resale'),
                    ...projs.filter(p => p.type === 'resale' || p.category === 'resale')
                ];

                // Interior projects
                const interiorData = projs.filter(p => p.type === 'interior' || p.category === 'interior');

                setCategories({
                    residential: resData.slice(0, 4),
                    commercial: commData.slice(0, 4),
                    resale: resaleData.slice(0, 4),
                    interior: interiorData.slice(0, 4),
                    plots: projs.slice(0, 4)
                });
            } catch (err) {
                console.error("Home data fetch error:", err);
            }
        };

        fetchData();

        return () => {
            fadeObserver.disconnect();
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('.search-btn');
        const originalText = btn.innerText;
        btn.innerText = 'Searching...';
        btn.style.opacity = '0.7';

        setTimeout(() => {
            btn.innerText = originalText;
            btn.style.opacity = '1';
            router.push('/properties');
        }, 800);
    };

    const CategorySection = ({ title, subtitle, data, link, dark = false, description }) => {
        if (!data || data.length === 0) return null;

        return (
            <section className="section-padding" style={{ backgroundColor: dark ? '#f8f9fa' : 'white' }}>
                <div className="container">
                    <div className="section-header text-center">
                        <span className="subtitle">{subtitle}</span>
                        <h2>{title}</h2>
                        <div className="divider mx-auto"></div>
                        {description && <p className="section-desc">{description}</p>}
                    </div>

                    <div className="property-grid" style={{ gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(320px, 1fr))' }}>
                        {data.map((item, idx) => (
                            <PropertyCard key={item._id || idx} property={item} />
                        ))}
                    </div>

                    <div style={{ textAlign: 'center', marginTop: '40px' }}>
                        <Link href={link} className="btn btn-primary" style={{ padding: '12px 40px' }}>
                            Explore All {title}
                        </Link>
                    </div>
                </div>
            </section>
        );
    };

    return (
        <main>
            <HeroSlider />

            {/* Visual Category Navigation - 'Shop' Card Presentation */}
            <section className="section-padding bg-white" id="category-navigation">
                <div className="container">
                    <div className="section-header text-center">
                        <span className="subtitle">Our Expertise</span>
                        <h2>Shop By Category</h2>
                        <div className="divider mx-auto"></div>
                    </div>

                    <div className="category-card-grid">
                        {[
                            { id: 'residential', label: 'Residential', icon: 'fa-home', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070' },
                            { id: 'commercial', label: 'Commercial', icon: 'fa-city', img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069' },
                            { id: 'resale', label: 'Resale', icon: 'fa-sync-alt', img: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2073' },
                            { id: 'interior', label: 'Interior', icon: 'fa-couch', img: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000' },
                            { id: 'plots', label: 'Plots and Land', icon: 'fa-map-marked-alt', img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070' }
                        ].map(cat => (
                            <div 
                                key={cat.id} 
                                className={`category-nav-card ${activeTab === cat.id ? 'active' : ''}`}
                                onClick={() => {
                                  setActiveTab(cat.id);
                                  router.push(cat.id === 'plots' ? '/properties' : `/${cat.id}`);
                                }}
                            >
                                <div className="cat-card-overlay"></div>
                                <img src={cat.img} alt={cat.label} className="cat-card-img" />
                                <div className="cat-card-content">
                                    <i className={`fas ${cat.icon}`}></i>
                                    <h3>{cat.label}</h3>
                                    <span className="cat-card-btn">View {cat.label} Collection</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Dynamic Property Grid (The 'Shop' View) */}
                    <div className="property-grid animate-fade-in" key={activeTab} style={{ marginTop: '60px', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(320px, 1fr))' }}>
                        {categories[activeTab]?.slice(0, 4).map((item, idx) => (
                            <PropertyCard key={item._id || idx} property={item} />
                        ))}
                    </div>

                    <div style={{ textAlign: 'center', marginTop: '50px' }}>
                        <Link 
                            href={`/${activeTab}`} 
                            className="btn btn-primary" 
                            style={{ padding: '14px 50px', borderRadius: '50px', boxShadow: 'var(--shadow-md)' }}
                        >
                            Explore All {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} <i className="fas fa-arrow-right" style={{ marginLeft: '10px' }}></i>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Residential Section */}
            <CategorySection
                title="Residential Properties"
                subtitle="Luxury Living"
                data={categories.residential}
                link="/residential"
                dark={true}
                description="Discover your perfect property from our extensive collection of residential spaces defined by excellence."
            />

            {/* Commercial Section */}
            <CategorySection
                title="Commercial Properties"
                subtitle="Prime Business Locations"
                data={categories.commercial}
                link="/commercial"
                dark={true}
                description="Explore prime commercial locations and plots designed for business growth and strategic investment."
            />

            {/* Resale Section */}
            <CategorySection
                title="Resale Properties"
                subtitle="Best Deals"
                data={categories.resale}
                link="/resale"
                description="Explore our exclusive range of resale properties offering great value and immediate possession."
            />

            {/* Interior Section */}
            <CategorySection
                title="Interior Designs"
                subtitle="Transform Your Space"
                data={categories.interior}
                link="/interior"
                dark={true}
                description="Exquisite interior solutions tailored to your lifestyle, from luxury homes to commercial spaces."
            />

            {/* Featured Projects Section - Added to ensure previous data is visible */}
            <CategorySection
                title="Featured Projects"
                subtitle="Our Architectural Excellence"
                data={categories.projects}
                link="/properties"
                description="Browse through our diverse portfolio of successfully delivered and upcoming architectural marvels."
            />

            {/* About TRX Section */}
            <section className="section-padding" style={{ backgroundColor: 'white' }}>
                <div className="container">
                    <div className="about-highlights-grid" style={{ 
                        display: 'grid', 
                        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', 
                        gap: isMobile ? '40px' : '80px',
                        alignItems: 'center'
                    }}>
                        <div className="about-image-side section-header">
                            <div className="premium-image-container">
                                <img
                                    src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071&auto=format&fit=crop"
                                    alt="Luxury Real Estate"
                                    className="about-main-img"
                                    onError={(e) => { e.target.src = '/assets/images/about_trx.png' }}
                                />
                                <div className="experience-badge">
                                    <h4>8+</h4>
                                    <p>Years of Excellence</p>
                                </div>
                            </div>
                        </div>

                        <div className="about-content-side section-header">
                            <span className="subtitle" style={{ letterSpacing: isMobile ? '2px' : '4px' }}>ABOUT REALTY XPERTS</span>
                            <h2 style={{ fontSize: isMobile ? '1.8rem' : '2.8rem', color: 'var(--color-navy)', lineHeight: '1.2', fontWeight: '800', marginBottom: '1rem' }}>
                                Congruence | Consistency | Curator
                            </h2>
                            <h3 style={{ fontSize: isMobile ? '1.2rem' : '1.5rem', color: 'var(--color-teal)', marginBottom: '1.5rem', fontWeight: '600' }}>
                                Building Better Lives With Every Home
                            </h3>
                            <div className="divider"></div>

                            <div className="about-text" style={{ textAlign: 'justify', fontSize: isMobile ? '0.9rem' : '1.05rem' }}>
                                <p style={{ marginBottom: '1rem' }}>
                                    At <strong className="text-navy">The Realty Xperts</strong>, our zeal is to create milestones that meet universal eminence, exemplify the esteem of our organization, and are crafted on a legacy of belief traversed over centuries. We are steered by our foresightedness of <strong className="text-teal">‘Creating a better living’</strong> and trust that real estate transfigures lives. Any place you buy is a springboard for the desire and dreams, for living a flourishing and persuasive life.
                                </p>
                                <p style={{ marginBottom: '1rem' }}>
                                    We have the adroitness to deliver both attribute and commitment, at an inimitable swiftness. By forging the magnificent worldwide confederation, and deploying the finest people and procedures, we generate the best benefits for our consumers beyond landscapes, markets, and customer tranche.
                                </p>
                                <p>
                                    As a family which makes presumably the long-lasting impact to our surroundings and the lives of our compeer, we perpetrate to act in the concern of each one of our peer. We are <strong>‘Creating a better living’</strong> in exceptionally furthermore mechanism than anyone can envisage.
                                </p>
                            </div>

                            <div style={{ marginTop: '2.5rem' }}>
                                <Link href="/about" className="btn btn-primary" style={{ padding: isMobile ? '12px 30px' : '14px 40px' }}>Learn Our Legacy</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Welcome/Bottom Section */}
            <section className="section-padding" style={{ textAlign: 'center', backgroundColor: '#f8f9fa' }}>
                <div className="container">
                    <div className="section-header text-center" style={{ marginTop: '20px' }}>
                        <span className="subtitle">Welcome</span>
                        <h2>Where Dreams Meet Addresses</h2>
                        <div className="divider mx-auto"></div>
                        <p className="section-desc">Explore our top-tier properties, comprehensive services, and learn about our prestigious legacy.</p>
                    </div>

                    <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link href="/properties" className="btn btn-primary">View All Properties</Link>
                        <Link href="/services" className="btn btn-outline-primary">Our Services</Link>
                        <Link href="/about" className="btn btn-outline-primary">About Us</Link>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default Home;
