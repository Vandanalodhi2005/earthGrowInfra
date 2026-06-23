'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PropertyCard from './PropertyCard';
import { API_URL } from '../apiConfig';
import { motion } from 'framer-motion';

export default function Home() {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [properties, setProperties] = useState([]);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    setIsMobile(typeof window !== 'undefined' && window.innerWidth <= 1024);
  }, []);



  useEffect(() => {
    const fetchData = async () => {
      try {
        const [propsRes, projsRes] = await Promise.all([
          fetch(`${API_URL}/api/properties`),
          fetch(`${API_URL}/api/projects`)
        ]);
        const props = propsRes.ok ? await propsRes.json() : [];
        const projs = projsRes.ok ? (await projsRes.json()).map(p => ({ ...p, isProjectCollection: true })) : [];
        setProperties([...props, ...projs].slice(0, 3));
      } catch (err) {
        console.error('Home data fetch error:', err);
      }
    };
    fetchData();
    // Scroll to top on navigation
    window.scrollTo(0, 0);
  }, []);


  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  if (!mounted) return null;

  return (
    <main className="font-sans">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#0A1C3A] to-[#1a365d] text-white py-24 md:py-36 flex flex-col items-center justify-center text-center">
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="container max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-5 leading-snug">
            Your Home Search, Simplified – Explore with Us!
          </h1>
          <p className="text-lg md:text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Welcome to Earth Grow Infra, where your journey to finding the perfect home begins. Whether you’re looking for a cozy apartment, a spacious family house, or an investment property, we have the expertise to turn your vision into reality.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/properties" className="bg-[#C69C6D] text-[#0A1C3A] px-8 py-4 rounded-lg font-bold transition-transform hover:-translate-y-1">
              Browse Listing
            </Link>
            <Link href="/submit-property" className="border border-white text-white px-8 py-4 rounded-lg font-bold transition-transform hover:-translate-y-1">
              List Your Place
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Diverse Properties Section */}
      <section className="bg-[#f8f9fa] py-16 md:py-24">
        <div className="container mx-auto max-w-6xl grid md:grid-cols-2 gap-12 items-center">
          <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800" alt="Diverse Properties" className="w-full rounded-2xl shadow-lg" />
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0A1C3A] mb-6">
              Diverse Properties, Infinite Possibilities
            </h2>
            <div className="space-y-6">
              {[
                { img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=400', title: 'Location', desc: 'Strategically located in vibrant neighborhoods for easy access to attractions, dining, and an exciting lifestyle.' },
                { img: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=400', title: 'Property Type', desc: 'From modern urban apartments to cozy countryside cottages, we cater to your unique preferences.' },
                { img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=400', title: 'Amenities', desc: 'Top‑notch amenities like fitness centers and communal spaces for a comfortable living experience.' }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4 items-start">
                  <img src={item.img} alt={item.title} className="w-24 h-24 rounded-lg object-cover" />
                  <div>
                    <h3 className="text-xl font-semibold text-[#0A1C3A] mb-2">{item.title}</h3>
                    <p className="text-gray-700 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24 text-center">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#0A1C3A] mb-8">How it works</h2>
          <p className="text-lg text-gray-600 mb-12">Concise overview of the process involved in buying or selling a property.</p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Inquire and Inspire', desc: 'Take the first step in securing your ideal rental or property by reaching out to us.', img: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=400' },
              { step: '02', title: 'Guided Tours, Your Way', desc: 'Personalized property viewings tailored to your schedule and preferences.', img: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=400' },
              { step: '03', title: 'Sealing the Deal, Your Style', desc: "Once you've found your perfect property, we handle the details and make it yours smoothly.", img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=400' }
            ].map((item, idx) => (
              <motion.div key={idx} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="bg-white rounded-xl shadow-lg p-6">
                <div className="text-4xl font-extrabold text-[#C69C6D] mb-4">{item.step}</div>
                <img src={item.img} alt={item.title} className="w-full h-48 object-cover rounded-md mb-4" />
                <h3 className="text-2xl font-semibold text-[#0A1C3A] mb-2">{item.title}</h3>
                <p className="text-gray-700">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Listings Section */}
      <section className="bg-[#f8f9fa] py-16 md:py-24">
        <div className="container mx-auto max-w-6xl text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#0A1C3A] mb-6">Recent Listing</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {properties.map((item, idx) => (
              <PropertyCard key={item._id || idx} property={item} />
            ))}
          </div>
          <div className="mt-8">
            <Link href="/properties" className="inline-block bg-[#0A1C3A] text-white px-10 py-4 rounded-lg font-bold transition-transform hover:-translate-y-1">
              View all
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24 text-center">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#0A1C3A] mb-8">Customer testimonials</h2>
          <p className="text-lg text-gray-600 mb-12">Let’s hear what our customers have to say.</p>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { quote: "We couldn't have asked for a better experience with Earth Grow Infra. Their expertise and dedication made our home‑buying process smooth and stress‑free.", name: 'John', location: 'Hyderabad' },
              { quote: "I can't thank Earth Grow Infra enough for helping me find the perfect rental property. Their attention to detail stands out.", name: 'Maria H', location: 'Bangalore' },
              { quote: "I recently sold my property with Earth Grow Infra, and I was impressed by their professionalism and market knowledge.", name: 'Sarah L', location: 'Chennai' },
              { quote: "Selling my property through Earth Grow Infra was a breeze. Their team's marketing strategies and negotiation skills were impressive.", name: 'Whitney K', location: 'Pune' }
            ].map((item, idx) => (
              <div key={idx} className="bg-[#f8f9fa] p-8 rounded-2xl text-left">
                <p className="text-xl italic text-[#0A1C3A] mb-4">"{item.quote}"</p>
                <h4 className="text-lg font-semibold text-[#0A1C3A]">{item.name}</h4>
                <p className="text-gray-700">Lives in {item.location}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-[#0A1C3A] to-[#1a365d] text-white py-20 md:py-28 flex flex-col items-center justify-center text-center">
        <div className="container mx-auto max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-6">Your Dream Home Awaits – Get Started Now</h2>
          <p className="text-lg md:text-xl opacity-90 mb-8">
            Ready to embark on your real‑estate journey? Whether buying, selling, investing, or exploring, we’re here to make it happen.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/properties" className="bg-[#C69C6D] text-[#0A1C3A] px-8 py-4 rounded-lg font-bold transition-transform hover:-translate-y-1">
              Browse Property
            </Link>
            <Link href="/submit-property" className="border border-white text-white px-8 py-4 rounded-lg font-bold transition-transform hover:-translate-y-1">
              Add Listing
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
