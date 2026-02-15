import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

export interface MegaMenuCategory {
  label: string;
  path: string;
  icon?: string;
  subcategories?: { label: string; path: string }[];
  featured?: { label: string; path: string; imageUrl: string }[];
  highlight?: string;
}

const megaMenuData: MegaMenuCategory[] = [
  {
    label: 'Sofas & Seating',
    path: '/category/sofa-sets',
    icon: '🛋️',
    subcategories: [
      { label: 'L-Shape Sofas', path: '/category/sofa-sets?sub=l-shape' },
      { label: '3-Seater Sofas', path: '/category/sofa-sets?sub=3-seater' },
      { label: '2-Seater Sofas', path: '/category/sofa-sets?sub=2-seater' },
      { label: 'Sectional Sofas', path: '/category/sofa-sets?sub=sectional' },
      { label: 'Recliner Sofas', path: '/category/sofa-sets?sub=recliner' },
      { label: 'Sofa Cum Beds', path: '/category/sofa-sets?sub=sofa-cum-bed' },
    ],
    featured: [
      {
        label: 'Premium L-Shape',
        path: '/product/prod-1',
        imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&h=200&fit=crop',
      },
      {
        label: 'Luxury Recliner',
        path: '/product/prod-5',
        imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop',
      },
    ],
    highlight: 'Up to 20% OFF',
  },
  {
    label: 'Beds',
    path: '/category/beds-mattresses',
    icon: '🛏️',
    subcategories: [
      { label: 'King Size Beds', path: '/category/beds-mattresses?sub=king' },
      { label: 'Queen Size Beds', path: '/category/beds-mattresses?sub=queen' },
      { label: 'Single Beds', path: '/category/beds-mattresses?sub=single' },
      { label: 'Storage Beds', path: '/category/beds-mattresses?sub=storage' },
      { label: 'Bunk Beds', path: '/category/beds-mattresses?sub=bunk' },
      { label: 'Mattresses', path: '/category/beds-mattresses?sub=mattress' },
    ],
    featured: [
      {
        label: 'King Size Wooden Bed',
        path: '/product/prod-6',
        imageUrl: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=300&h=200&fit=crop',
      },
    ],
    highlight: 'Starting ₹15,999',
  },
  {
    label: 'Dining',
    path: '/category/dining-tables',
    icon: '🍽️',
    subcategories: [
      { label: '4-Seater Dining Sets', path: '/category/dining-tables?sub=4-seater' },
      { label: '6-Seater Dining Sets', path: '/category/dining-tables?sub=6-seater' },
      { label: '8-Seater Dining Sets', path: '/category/dining-tables?sub=8-seater' },
      { label: 'Dining Chairs', path: '/category/dining-tables?sub=chairs' },
      { label: 'Dining Benches', path: '/category/dining-tables?sub=benches' },
    ],
    featured: [
      {
        label: 'Sheesham Dining Table',
        path: '/product/prod-10',
        imageUrl: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=300&h=200&fit=crop',
      },
    ],
    highlight: 'New Arrivals',
  },
  {
    label: 'Storage',
    path: '/category/wardrobes-storage',
    icon: '🗄️',
    subcategories: [
      { label: 'Wardrobes', path: '/category/wardrobes-storage?sub=wardrobes' },
      { label: 'Chest of Drawers', path: '/category/wardrobes-storage?sub=drawers' },
      { label: 'Shoe Racks', path: '/category/wardrobes-storage?sub=shoe-racks' },
      { label: 'Book Shelves', path: '/category/wardrobes-storage?sub=bookshelves' },
      { label: 'TV Units', path: '/category/wardrobes-storage?sub=tv-units' },
    ],
    highlight: 'Flat 15% OFF',
  },
  {
    label: 'Office',
    path: '/category/office-furniture',
    icon: '💼',
    subcategories: [
      { label: 'Office Desks', path: '/category/office-furniture?sub=desks' },
      { label: 'Office Chairs', path: '/category/office-furniture?sub=chairs' },
      { label: 'Study Tables', path: '/category/office-furniture?sub=study' },
      { label: 'Filing Cabinets', path: '/category/office-furniture?sub=cabinets' },
    ],
    highlight: 'WFH Essentials',
  },
  {
    label: 'Custom Furniture',
    path: '/custom-furniture',
    icon: '✨',
    subcategories: [
      { label: 'Custom Sofas', path: '/custom-furniture?type=sofa' },
      { label: 'Custom Beds', path: '/custom-furniture?type=bed' },
      { label: 'Custom Dining', path: '/custom-furniture?type=dining' },
      { label: 'Custom Wardrobes', path: '/custom-furniture?type=wardrobe' },
      { label: 'Request Quote', path: '/custom-furniture#quote' },
    ],
    highlight: 'Made for You',
  },
  {
    label: 'Repair & Polish',
    path: '/repair-polish',
    icon: '🔧',
    subcategories: [
      { label: 'Sofa Repair', path: '/repair-polish?type=sofa-repair' },
      { label: 'Chair Repair', path: '/repair-polish?type=chair-repair' },
      { label: 'Wood Polish', path: '/repair-polish?type=polish' },
      { label: 'Upholstery', path: '/repair-polish?type=upholstery' },
    ],
    highlight: 'Starting ₹2,999',
  },
];

interface MegaMenuProps {
  onClose?: () => void;
}

const MegaMenu = ({ onClose }: MegaMenuProps) => {
  const [activeCategory, setActiveCategory] = useState<number>(0);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose?.();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const activeItem = megaMenuData[activeCategory];

  return (
    <div
      ref={menuRef}
      className="absolute top-full left-0 w-full bg-white shadow-2xl border-t border-gray-100 z-50 animate-fade-in"
      onMouseLeave={() => onClose?.()}
    >
      <div className="container mx-auto">
        <div className="flex min-h-[400px]">
          {/* Left: Category List */}
          <div className="w-64 bg-gray-50 border-r border-gray-100 py-3 flex-shrink-0">
            {megaMenuData.map((cat, index) => (
              <button
                key={cat.path}
                onMouseEnter={() => setActiveCategory(index)}
                onClick={() => setActiveCategory(index)}
                className={`w-full flex items-center gap-3 px-5 py-3 text-left text-sm transition-all duration-200 ${
                  activeCategory === index
                    ? 'bg-white text-[#c17d3c] font-semibold border-r-2 border-[#c17d3c] shadow-sm'
                    : 'text-gray-700 hover:bg-white hover:text-[#c17d3c]'
                }`}
              >
                <span className="text-lg">{cat.icon}</span>
                <span className="flex-1">{cat.label}</span>
                {cat.highlight && (
                  <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-semibold whitespace-nowrap">
                    {cat.highlight}
                  </span>
                )}
                <svg
                  className={`w-4 h-4 transition-colors ${
                    activeCategory === index ? 'text-[#c17d3c]' : 'text-gray-400'
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            ))}
          </div>

          {/* Middle: Subcategories */}
          <div className="flex-1 p-8">
            <div className="mb-6">
              <Link
                to={activeItem.path}
                onClick={onClose}
                className="text-lg font-semibold text-gray-900 hover:text-[#c17d3c] transition-colors"
              >
                All {activeItem.label} →
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-x-12 gap-y-3">
              {activeItem.subcategories?.map((sub) => (
                <Link
                  key={sub.path}
                  to={sub.path}
                  onClick={onClose}
                  className="text-sm text-gray-600 hover:text-[#c17d3c] hover:translate-x-1 transition-all duration-200 py-1.5 flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-gray-300 group-hover:bg-[#c17d3c] transition-colors" />
                  {sub.label}
                </Link>
              ))}
            </div>

            {/* Quick Links */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="flex gap-4">
                <Link
                  to={activeItem.path}
                  onClick={onClose}
                  className="text-xs font-semibold text-white bg-[#c17d3c] px-4 py-2 rounded hover:bg-[#a86830] transition-colors"
                >
                  Shop All {activeItem.label}
                </Link>
                <Link
                  to="/custom-furniture"
                  onClick={onClose}
                  className="text-xs font-semibold text-[#c17d3c] border border-[#c17d3c] px-4 py-2 rounded hover:bg-[#c17d3c] hover:text-white transition-colors"
                >
                  Customize
                </Link>
              </div>
            </div>
          </div>

          {/* Right: Featured Products */}
          {activeItem.featured && activeItem.featured.length > 0 && (
            <div className="w-72 bg-gray-50/50 p-6 border-l border-gray-100 flex-shrink-0">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                Featured
              </p>
              <div className="space-y-4">
                {activeItem.featured.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className="block group"
                  >
                    <div className="relative overflow-hidden rounded-lg aspect-[3/2]">
                      <img
                        src={item.imageUrl}
                        alt={item.label}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <p className="absolute bottom-2 left-3 text-white text-sm font-medium">
                        {item.label}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Offer Banner */}
              {activeItem.highlight && (
                <div className="mt-4 bg-gradient-to-r from-[#c17d3c] to-[#e09b5a] text-white p-4 rounded-lg text-center">
                  <p className="text-lg font-bold">{activeItem.highlight}</p>
                  <p className="text-xs opacity-80 mt-1">on {activeItem.label}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export { megaMenuData };
export default MegaMenu;
