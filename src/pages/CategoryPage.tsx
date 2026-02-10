import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { productService } from '../services/ProductService';
import { cartService } from '../services/CartService';
import { wishlistService } from '../services/WishlistService';
import type { Product, Category } from '../models/types';

const CategoryPage = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategoryData = async () => {
      if (!categorySlug) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Get all categories to find the current one
        const categories = await productService.getAllCategories();
        const currentCategory = categories.find(cat => cat.slug === categorySlug);
        setCategory(currentCategory || null);

        // Get products for this category
        const categoryProducts = await productService.getProductsByCategory(categorySlug);
        setProducts(categoryProducts);
      } catch (error) {
        console.error('Error loading category data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCategoryData();
  }, [categorySlug]);

  const handleAddToCart = (productId: string) => {
    cartService.addItem(productId, 1);
  };

  const handleAddToWishlist = (productId: string) => {
    wishlistService.addItem(productId);
  };

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Category Not Found</h1>
          <p className="text-gray-600 mb-8">
            The category you're looking for doesn't exist.
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Category Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            {category.name}
          </h1>
          <p className="text-gray-600">
            {products.length} {products.length === 1 ? 'product' : 'products'} available
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-8">
        {products.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-lg shadow-md p-12 max-w-md mx-auto">
              <svg
                className="w-24 h-24 text-gray-300 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                No Products Available
              </h2>
              <p className="text-gray-600 mb-6">
                This category is currently empty. Check back soon for new products!
              </p>
              <button
                onClick={() => navigate('/')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Browse Other Categories
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleAddToWishlist}
                onProductClick={handleProductClick}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
