import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';
import type { FormEvent } from 'react';
import { productService } from '../services/ProductService';
import type { Product } from '../models/types';

interface SearchBarEnhancedProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

const trendingSearches = [
  'L-Shape Sofa',
  'King Size Bed',
  'Dining Table',
  'Wardrobe',
  'Office Chair',
  'Recliner',
];

const SearchBarEnhanced = ({
  onSearch,
  placeholder = 'Search for furniture, decor and more...',
}: SearchBarEnhancedProps) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchSuggestions = async (searchQuery: string) => {
    if (searchQuery.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    setIsLoading(true);
    try {
      const results = await productService.searchProducts(searchQuery);
      setSuggestions(results.slice(0, 6));
    } catch {
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (value: string) => {
    setQuery(value);
    setHighlightIndex(-1);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (value.trim().length >= 2) {
      setShowDropdown(true);
      debounceRef.current = setTimeout(() => {
        fetchSuggestions(value);
      }, 300);
    } else {
      setShowDropdown(value.trim().length === 0);
      setSuggestions([]);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setShowDropdown(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim()) {
      if (highlightIndex >= 0 && highlightIndex < suggestions.length) {
        e.preventDefault();
        setShowDropdown(false);
        setQuery(suggestions[highlightIndex].name);
      } else {
        onSearch(query.trim());
        setShowDropdown(false);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIndex((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1
      );
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
    }
  };

  const handleFocus = () => {
    setShowDropdown(true);
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    inputRef.current?.focus();
  };

  const handleTrendingClick = (term: string) => {
    setQuery(term);
    onSearch(term);
    setShowDropdown(false);
  };

  const handleSuggestionClick = (product: Product) => {
    setQuery(product.name);
    setShowDropdown(false);
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <form onSubmit={handleSubmit} className="relative w-full">
        {/* Search Icon */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          placeholder={placeholder}
          className="w-full pl-10 pr-20 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C6A75E]/40 focus:border-[#C6A75E] focus:bg-white transition-all placeholder:text-gray-400"
          autoComplete="off"
        />

        {/* Clear / Search Button */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 p-1 transition-colors"
              aria-label="Clear search"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          <button
            type="submit"
            className="bg-[#C6A75E] hover:bg-[#B0914A] text-white px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
            aria-label="Search"
          >
            Search
          </button>
        </div>
      </form>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-100 z-50 overflow-hidden max-h-[420px] overflow-y-auto animate-fade-in">
          {/* Loading */}
          {isLoading && query.trim().length >= 2 && (
            <div className="px-4 py-3 text-sm text-gray-500 flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-gray-300 border-t-[#C6A75E] rounded-full animate-spin" />
              Searching...
            </div>
          )}

          {/* Product Suggestions */}
          {!isLoading && suggestions.length > 0 && (
            <div>
              <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider bg-gray-50">
                Products
              </div>
              {suggestions.map((product, index) => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  onClick={() => handleSuggestionClick(product)}
                  className={`flex items-center gap-3 px-4 py-2.5 hover:bg-[#F5EFE6] transition-colors ${
                    highlightIndex === index ? 'bg-[#F5EFE6]' : ''
                  }`}
                >
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-10 h-10 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {product.name}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-[#C6A75E]">
                        ₹{(product.discountPrice ?? product.price).toLocaleString()}
                      </span>
                      {product.discountPrice && (
                        <span className="text-xs text-gray-400 line-through">
                          ₹{product.price.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">{product.category}</span>
                </Link>
              ))}
              {suggestions.length > 0 && query.trim() && (
                <button
                  onClick={() => {
                    onSearch(query.trim());
                    setShowDropdown(false);
                  }}
                  className="w-full px-4 py-2.5 text-sm text-[#C6A75E] font-medium hover:bg-[#F5EFE6] transition-colors border-t text-center"
                >
                  View all results for "{query.trim()}"
                </button>
              )}
            </div>
          )}

          {/* No Results */}
          {!isLoading && query.trim().length >= 2 && suggestions.length === 0 && (
            <div className="px-4 py-6 text-center">
              <p className="text-sm text-gray-500">No products found for "{query}"</p>
              <p className="text-xs text-gray-400 mt-1">Try different keywords</p>
            </div>
          )}

          {/* Trending Searches (shown when input is empty/focused) */}
          {query.trim().length < 2 && (
            <div>
              <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider bg-gray-50 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5" /> Trending Searches
              </div>
              {trendingSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => handleTrendingClick(term)}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-[#F5EFE6] transition-colors text-left"
                >
                  <svg
                    className="w-4 h-4 text-gray-400 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                  {term}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBarEnhanced;
