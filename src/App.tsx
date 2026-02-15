import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { useState, useEffect, lazy, Suspense } from 'react';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import BackToTop from './components/BackToTop';
import ErrorBoundary from './components/ErrorBoundary';
import ScrollToTop from './components/ScrollToTop';
import LoadingSpinner from './components/LoadingSpinner';
import { cartService } from './services/CartService';
import { wishlistService } from './services/WishlistService';
import { authService } from './services/AuthService';
import './App.css';

// Lazy load page components for code splitting
const Homepage = lazy(() => import('./pages/Homepage'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const SearchResults = lazy(() => import('./pages/SearchResults'));
const CartPage = lazy(() => import('./pages/CartPage'));
const WishlistPage = lazy(() => import('./pages/WishlistPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegistrationPage = lazy(() => import('./pages/RegistrationPage'));
const CustomFurniturePage = lazy(() => import('./pages/CustomFurniturePage'));
const RepairPolishPage = lazy(() => import('./pages/RepairPolishPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const ShippingPolicyPage = lazy(() => import('./pages/ShippingPolicyPage'));
const ReturnPolicyPage = lazy(() => import('./pages/ReturnPolicyPage'));
const WarrantyPage = lazy(() => import('./pages/WarrantyPage'));
const FAQPage = lazy(() => import('./pages/FAQPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function AppContent() {
  const navigate = useNavigate();
  const [cartItemCount, setCartItemCount] = useState(0);
  const [wishlistItemCount, setWishlistItemCount] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState<string | undefined>(undefined);

  useEffect(() => {
    // Initialize counts on mount
    const initializeCounts = () => {
      setCartItemCount(cartService.getItemCount());
      setWishlistItemCount(wishlistService.getItemCount());
      setIsAuthenticated(authService.isAuthenticated());
    };
    initializeCounts();
    
    const user = authService.getCurrentUser();
    if (user) {
      // Use queueMicrotask to avoid setState in effect warning
      queueMicrotask(() => setUserName(user.name));
    }

    // Set up interval to update counts (simple approach for now)
    const interval = setInterval(() => {
      setCartItemCount(cartService.getItemCount());
      setWishlistItemCount(wishlistService.getItemCount());
      setIsAuthenticated(authService.isAuthenticated());
      
      const currentUser = authService.getCurrentUser();
      setUserName(currentUser?.name);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleSearch = (query: string) => {
    // Navigate to search results page using React Router
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <Navigation
        cartItemCount={cartItemCount}
        wishlistItemCount={wishlistItemCount}
        isAuthenticated={isAuthenticated}
        userName={userName}
        onSearch={handleSearch}
      />
      <main className="flex-grow">
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-[60vh]">
            <LoadingSpinner size="lg" />
          </div>
        }>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/product/:productId" element={<ProductDetail />} />
            <Route path="/category/:categorySlug" element={<CategoryPage />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegistrationPage />} />
            <Route path="/custom-furniture" element={<CustomFurniturePage />} />
            <Route path="/repair-polish" element={<RepairPolishPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/shipping-policy" element={<ShippingPolicyPage />} />
            <Route path="/return-policy" element={<ReturnPolicyPage />} />
            <Route path="/warranty" element={<WarrantyPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <WhatsAppButton />
      <BackToTop />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AppContent />
      </Router>
    </ErrorBoundary>
  );
}

export default App;
