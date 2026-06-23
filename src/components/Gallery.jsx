import { useState, useEffect } from 'react';
import { HiX, HiArrowsExpand, HiOutlinePhotograph } from 'react-icons/hi';

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(9);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth <= 1024);

  // Fetch images and handle resize
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/gallery`);
        if (response.ok) {
          const data = await response.json();
          setImages(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error('Error fetching gallery images:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const displayedImages = images.slice(0, visibleCount);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 mb-10">
      {/* Hero Section */}
      <section className={`relative ${isMobile ? 'h-[25vh]' : 'h-[35vh]'} flex items-center justify-center bg-primary overflow-hidden`)}>
        <div className="absolute inset-0 opacity-30">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&auto=format&fit=crop&w=2070"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 text-center py-8">
          <h1 className="text-white font-extrabold uppercase tracking-wide text-2xl md:text-4xl">Our Gallery</h1>
          <div className="w-12 h-1 bg-gold mx-auto my-4" />
        </div>
      </section>

      {/* Gallery Grid */}
      <section className={isMobile ? 'py-10' : 'py-20'}>
        <div className="container mx-auto">
          <div className="grid gap-5 md:gap-10" style={{ gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(320px, 1fr))' }}>
            {displayedImages.length > 0 ? (
              displayedImages.map((img, idx) => (
                <div
                  key={img._id || idx}
                  className="group relative bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer"
                  onClick={() => setSelectedImage(img)}
                >
                  <img src={img.imageUrl} alt="" className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105" />
                  <div className="absolute inset-0 flex items-center justify-center bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <HiArrowsExpand size={24} className="text-primary/30" />
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-20 text-gray-400">
                <HiOutlinePhotograph className="mx-auto text-4xl mb-4" />
                <p className="uppercase tracking-wider text-sm">Gallery Empty</p>
              </div>
            )}
          </div>

          {/* Load More */}
          {visibleCount < images.length && (
            <div className="flex justify-center mt-12">
              <button
                onClick={() => setVisibleCount((prev) => prev + 9)}
                className="bg-primary text-white border border-gold px-8 py-3 rounded-full font-semibold uppercase tracking-wider hover:bg-gold transition-colors"
              >
                Explore More
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-primary/90 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedImage(null)}>
          <button
            className="absolute top-5 right-5 text-white text-2xl opacity-70 hover:opacity-100"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage(null);
            }}
          >
            <HiX />
          </button>
          <div className="bg-white rounded-xl p-4 max-w-3xl w-full max-h-full overflow-auto" onClick={(e) => e.stopPropagation()}>
            <img src={selectedImage.imageUrl} alt="" className="w-full h-auto object-contain" />
          </div>
        </div>
      )}
    </div>
  );
}
