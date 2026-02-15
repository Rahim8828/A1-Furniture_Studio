import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, Wrench } from 'lucide-react';
import AnnouncementBar from './AnnouncementBar';
import SearchBarEnhanced from './SearchBarEnhanced';
import MegaMenu from './MegaMenu';
import MobileDrawer from './MobileDrawer';
import { megaMenuData } from './MegaMenu';

interface NavigationProps {
  currentPage?: string;
  cartItemCount: number;
  wishlistItemCount: number;
  isAuthenticated: boolean;
  userName?: string;
  onSearch: (query: string) => void;
}

const Navigation = ({
  currentPage: _currentPage = '',
  cartItemCount,
  wishlistItemCount,
  isAuthenticated,
  userName,
  onSearch,
}: NavigationProps) => {
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const location = useLocation();

  // Close menus on route change
  useEffect(() => {
    setIsMobileDrawerOpen(false);
    setIsMegaMenuOpen(false);
    setShowMobileSearch(false);
  }, [location.pathname]);

  // Handle scroll for sticky shadow effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCloseMegaMenu = useCallback(() => {
    setIsMegaMenuOpen(false);
  }, []);

  return (
    <header className="sticky top-0 z-50">
      {/* Tier 1: Announcement Bar */}
      <AnnouncementBar />

      {/* Tier 2: Main Header */}
      <div
        className={`bg-white transition-shadow duration-300 ${
          isScrolled ? 'shadow-lg' : 'shadow-sm'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Left: Hamburger (mobile) + Logo */}
            <div className="flex items-center gap-3 flex-shrink-0">
              {/* Mobile Hamburger */}
              <button
                onClick={() => setIsMobileDrawerOpen(true)}
                className="lg:hidden text-gray-700 hover:text-[#c17d3c] transition-colors p-1"
                aria-label="Open menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {/* Logo */}
              <Link to="/" className="flex items-center gap-2 group">
                <div className="w-9 h-9 bg-[#2d1b0e] rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[#c17d3c] transition-colors">
                  <span className="text-white font-bold text-sm">A1</span>
                </div>
                <div className="hidden sm:block">
                  <span className="text-lg font-bold text-gray-900 tracking-tight leading-none">
                    A1 Furniture Studio
                  </span>
                  <span className="hidden md:block text-[10px] text-gray-400 tracking-wider uppercase leading-none mt-0.5">
                    Premium Handcrafted Furniture
                  </span>
                </div>
              </Link>
            </div>

            {/* Center: Search Bar (Desktop) */}
            <div className="hidden md:block flex-1 max-w-xl">
              <SearchBarEnhanced onSearch={onSearch} />
            </div>

            {/* Right: Action Icons */}
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              {/* Mobile Search Toggle */}
              <button
                onClick={() => setShowMobileSearch(!showMobileSearch)}
                className="md:hidden text-gray-600 hover:text-[#c17d3c] transition-colors p-2"
                aria-label="Search"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* Pincode Checker (Desktop) */}
              <div className="hidden xl:flex items-center gap-1.5 text-gray-600 hover:text-[#c17d3c] cursor-pointer transition-colors px-2 py-1 rounded-md hover:bg-orange-50 group">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-xs font-medium">Mumbai</span>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {/* Divider */}
              <div className="hidden xl:block w-px h-6 bg-gray-200 mx-1" />

              {/* Account/Login */}
              {isAuthenticated ? (
                <Link
                  to="/account"
                  className="flex items-center gap-2 text-gray-600 hover:text-[#c17d3c] transition-colors p-2 rounded-md hover:bg-orange-50"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {userName && (
                    <div className="hidden lg:block text-left">
                      <p className="text-[10px] text-gray-400 leading-none">Hello,</p>
                      <p className="text-xs font-semibold leading-tight truncate max-w-[80px]">
                        {userName}
                      </p>
                    </div>
                  )}
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-2 text-gray-600 hover:text-[#c17d3c] transition-colors p-2 rounded-md hover:bg-orange-50"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="hidden lg:block text-xs font-medium">Login</span>
                </Link>
              )}

              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="relative text-gray-600 hover:text-[#c17d3c] transition-colors p-2 rounded-md hover:bg-orange-50"
                aria-label="Wishlist"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {wishlistItemCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                    {wishlistItemCount > 9 ? '9+' : wishlistItemCount}
                  </span>
                )}
                <span className="hidden lg:block text-[10px] text-gray-500 leading-none mt-0.5 text-center">
                  Wishlist
                </span>
              </Link>

              {/* Cart */}
              <Link
                to="/cart"
                className="relative text-gray-600 hover:text-[#c17d3c] transition-colors p-2 rounded-md hover:bg-orange-50"
                aria-label="Cart"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cartItemCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 bg-[#c17d3c] text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                    {cartItemCount > 9 ? '9+' : cartItemCount}
                  </span>
                )}
                <span className="hidden lg:block text-[10px] text-gray-500 leading-none mt-0.5 text-center">
                  Cart
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar (expandable) */}
        {showMobileSearch && (
          <div className="md:hidden px-4 pb-3 animate-fade-in">
            <SearchBarEnhanced onSearch={(q) => { onSearch(q); setShowMobileSearch(false); }} />
          </div>
        )}

        {/* Tier 3: Category Navigation Bar (Desktop) */}
        <nav className="hidden lg:block border-t border-gray-100">
          <div className="container mx-auto px-4">
            <div className="flex items-center h-11">
              {/* All Categories Button */}
              <div
                className="relative"
                onMouseEnter={() => setIsMegaMenuOpen(true)}
              >
                <button
                  onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
                  className={`flex items-center gap-2 text-sm font-semibold px-4 h-11 transition-colors ${
                    isMegaMenuOpen
                      ? 'text-[#c17d3c] bg-orange-50'
                      : 'text-gray-700 hover:text-[#c17d3c] hover:bg-orange-50'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  All Categories
                  <svg
                    className={`w-3 h-3 transition-transform duration-200 ${
                      isMegaMenuOpen ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              {/* Divider */}
              <div className="w-px h-5 bg-gray-200 mx-1" />

              {/* Quick Category Links */}
              {megaMenuData.slice(0, 6).map((cat) => (
                <Link
                  key={cat.path}
                  to={cat.path}
                  className="text-sm text-gray-600 hover:text-[#c17d3c] px-3 h-11 flex items-center transition-colors whitespace-nowrap font-medium hover:bg-orange-50"
                >
                  {cat.label}
                </Link>
              ))}

              {/* Spacer */}
              <div className="flex-1" />

              {/* Highlight Links */}
              <Link
                to="/custom-furniture"
                className="text-sm font-semibold text-[#c17d3c] hover:text-[#a86830] px-3 h-11 flex items-center gap-1 transition-colors"
              >
                <Sparkles className="w-4 h-4" /> Custom Furniture
              </Link>
              <Link
                to="/repair-polish"
                className="text-sm font-medium text-gray-600 hover:text-[#c17d3c] px-3 h-11 flex items-center gap-1 transition-colors"
              >
                <Wrench className="w-4 h-4" /> Repair & Polish
              </Link>
            </div>
          </div>

          {/* Mega Menu Dropdown */}
          {isMegaMenuOpen && <MegaMenu onClose={handleCloseMegaMenu} />}
        </nav>
      </div>

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
        isAuthenticated={isAuthenticated}
        userName={userName}
        cartItemCount={cartItemCount}
        wishlistItemCount={wishlistItemCount}
      />
    </header>
  );
};

export default Navigation;
