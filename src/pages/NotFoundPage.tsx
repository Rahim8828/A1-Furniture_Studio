import React from 'react';
import { Link } from 'react-router-dom';
import { usePageMeta } from '../hooks/usePageMeta';

const NotFoundPage: React.FC = () => {
  usePageMeta('NOT_FOUND');
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-lg mx-auto">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="text-8xl font-bold text-[#c17d3c]/20 select-none">404</div>
          <div className="text-6xl -mt-4 mb-4">🪑</div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Looks like this page has been moved or doesn't exist. Don't worry — let's get you back on track.
        </p>

        {/* Quick Links */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {[
            { to: '/', icon: '🏠', label: 'Homepage' },
            { to: '/category/living-room', icon: '🛋️', label: 'Living Room' },
            { to: '/category/bedroom', icon: '🛏️', label: 'Bedroom' },
            { to: '/contact', icon: '📞', label: 'Contact Us' },
          ].map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="flex items-center gap-3 p-4 rounded-xl bg-[#fdf8f0] hover:shadow-card transition-shadow text-left"
            >
              <span className="text-2xl">{link.icon}</span>
              <span className="font-medium text-gray-800">{link.label}</span>
            </Link>
          ))}
        </div>

        <Link
          to="/"
          className="inline-block bg-[#2d1b0e] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#1a1008] transition-colors"
        >
          Back to Homepage
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
