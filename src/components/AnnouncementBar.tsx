import { useState, useEffect } from 'react';

const announcements = [
  '🚚 FREE Delivery across Mumbai on all orders!',
  '🔥 Flat 20% OFF on Custom Furniture — Use code CUSTOM20',
  '⭐ Premium Polish Services starting at ₹2,999',
  '🎉 New Arrivals: Luxury Sofa Collection 2026 is here!',
  '💳 Easy EMI options available — Starting ₹999/month',
];

const AnnouncementBar = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="bg-[#2d1b0e] text-white text-xs sm:text-sm relative overflow-hidden">
      <div className="container mx-auto px-4 py-2 flex items-center justify-center">
        {/* Previous Arrow */}
        <button
          onClick={() =>
            setCurrentIndex(
              (prev) => (prev - 1 + announcements.length) % announcements.length
            )
          }
          className="absolute left-3 text-white/60 hover:text-white transition-colors hidden sm:block"
          aria-label="Previous announcement"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Announcement Text */}
        <div className="text-center overflow-hidden">
          <p
            className="transition-all duration-500 ease-in-out font-medium tracking-wide"
            key={currentIndex}
          >
            {announcements[currentIndex]}
          </p>
        </div>

        {/* Next Arrow */}
        <button
          onClick={() => setCurrentIndex((prev) => (prev + 1) % announcements.length)}
          className="absolute right-10 text-white/60 hover:text-white transition-colors hidden sm:block"
          aria-label="Next announcement"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Close Button */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-3 text-white/60 hover:text-white transition-colors"
          aria-label="Close announcement"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Progress Dots */}
      <div className="flex justify-center gap-1 pb-1">
        {announcements.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'bg-orange-400 w-4' : 'bg-white/30'
            }`}
            aria-label={`Go to announcement ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default AnnouncementBar;
