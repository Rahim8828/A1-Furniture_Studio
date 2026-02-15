import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { megaMenuData } from './MegaMenu';
import { Building2, Phone, Sparkles, Wrench, MapPin } from 'lucide-react';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  isAuthenticated: boolean;
  userName?: string;
  cartItemCount: number;
  wishlistItemCount: number;
}

const MobileDrawer = ({
  isOpen,
  onClose,
  isAuthenticated,
  userName,
  cartItemCount,
  wishlistItemCount,
}: MobileDrawerProps) => {
  const drawerRef = useRef<HTMLDivElement>(null);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={`fixed top-0 left-0 h-full w-[85vw] max-w-[380px] bg-white z-50 transform transition-transform duration-300 ease-out shadow-2xl ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="bg-[#4A2F24] text-white p-5">
          <div className="flex items-center justify-between mb-4">
            <Link to="/" onClick={onClose} className="text-lg font-bold tracking-wide">
              A1 Furniture Studio
            </Link>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white p-1 transition-colors"
              aria-label="Close menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* User Section */}
          {isAuthenticated ? (
            <Link to="/account" onClick={onClose} className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-sm">Hello, {userName || 'User'}</p>
                <p className="text-xs text-white/60">View Account</p>
              </div>
            </Link>
          ) : (
            <div className="flex gap-3">
              <Link
                to="/login"
                onClick={onClose}
                className="flex-1 text-center py-2 border border-white/30 rounded text-sm font-medium hover:bg-white/10 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={onClose}
                className="flex-1 text-center py-2 bg-[#C6A75E] rounded text-sm font-medium hover:bg-[#B0914A] transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 border-b border-gray-100">
          <Link
            to="/cart"
            onClick={onClose}
            className="flex flex-col items-center py-4 text-gray-600 hover:text-[#C6A75E] transition-colors relative"
          >
            <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="text-xs">Cart</span>
            {cartItemCount > 0 && (
              <span className="absolute top-2 right-6 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </Link>
          <Link
            to="/wishlist"
            onClick={onClose}
            className="flex flex-col items-center py-4 text-gray-600 hover:text-[#C6A75E] transition-colors border-x border-gray-100 relative"
          >
            <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span className="text-xs">Wishlist</span>
            {wishlistItemCount > 0 && (
              <span className="absolute top-2 right-6 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                {wishlistItemCount}
              </span>
            )}
          </Link>
          <Link
            to="/contact"
            onClick={onClose}
            className="flex flex-col items-center py-4 text-gray-600 hover:text-[#C6A75E] transition-colors"
          >
            <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span className="text-xs">Call Us</span>
          </Link>
        </div>

        {/* Menu Content */}
        <div className="overflow-y-auto h-[calc(100%-250px)]">
          {/* Category Navigation */}
          <div className="py-2">
            <p className="px-5 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Shop by Category
            </p>
            {megaMenuData.map((cat) => (
              <MobileCategory key={cat.path} category={cat} onClose={onClose} />
            ))}
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100 mx-5" />

          {/* Services & Pages */}
          <div className="py-2">
            <p className="px-5 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              More
            </p>
            {[
              { label: 'About Us', path: '/about', icon: <Building2 className="w-4 h-4" /> },
              { label: 'Contact Us', path: '/contact', icon: <Phone className="w-4 h-4" /> },
              { label: 'Custom Furniture', path: '/custom-furniture', icon: <Sparkles className="w-4 h-4" /> },
              { label: 'Repair & Polish', path: '/repair-polish', icon: <Wrench className="w-4 h-4" /> },
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className="flex items-center gap-3 px-5 py-3 text-sm text-gray-700 hover:bg-[#F5EFE6] hover:text-[#C6A75E] transition-colors"
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Pincode Check */}
          <div className="mx-5 my-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs font-semibold text-gray-500 mb-2 flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> Check Delivery</p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter Pincode"
                maxLength={6}
                className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-[#C6A75E]"
              />
              <button className="px-3 py-2 bg-[#C6A75E] text-white text-xs font-medium rounded hover:bg-[#B0914A] transition-colors">
                Check
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Expandable mobile category component
const MobileCategory = ({
  category,
  onClose,
}: {
  category: (typeof megaMenuData)[number];
  onClose: () => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div>
      <div className="flex items-center">
        <Link
          to={category.path}
          onClick={onClose}
          className="flex-1 flex items-center gap-3 px-5 py-3 text-sm text-gray-700 hover:text-[#C6A75E] transition-colors"
        >
          <span>{category.icon}</span>
          <span className="font-medium">{category.label}</span>
          {category.highlight && (
            <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-semibold">
              {category.highlight}
            </span>
          )}
        </Link>
        {category.subcategories && category.subcategories.length > 0 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-4 py-3 text-gray-400 hover:text-[#C6A75E] transition-colors"
            aria-label={`Expand ${category.label}`}
          >
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${
                isExpanded ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Subcategories */}
      {isExpanded && category.subcategories && (
        <div className="bg-gray-50 py-1">
          {category.subcategories.map((sub) => (
            <Link
              key={sub.path}
              to={sub.path}
              onClick={onClose}
              className="block pl-14 pr-5 py-2 text-sm text-gray-500 hover:text-[#C6A75E] transition-colors"
            >
              {sub.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MobileDrawer;
