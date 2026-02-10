import type { Product } from '../models/types';
import LazyImage from './LazyImage';

interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: string) => void;
  onAddToWishlist: (productId: string) => void;
  onProductClick: (productId: string) => void;
}

const ProductCard = ({
  product,
  onAddToCart,
  onAddToWishlist,
  onProductClick,
}: ProductCardProps) => {
  const handleCardClick = () => {
    onProductClick(product.id);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product.id);
  };

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToWishlist(product.id);
  };

  const displayPrice = product.discountPrice ?? product.price;
  const hasDiscount = product.discountPrice !== undefined && product.discountPrice < product.price;

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group"
    >
      {/* Product Image */}
      <div className="relative overflow-hidden aspect-square">
        <LazyImage
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {hasDiscount && product.discountPercentage && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-semibold">
            {product.discountPercentage}% OFF
          </div>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white text-lg font-semibold">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center mb-2">
          {product.ratingCount > 0 ? (
            <>
              <div className="flex items-center">
                {[...Array(5)].map((_, index) => (
                  <svg
                    key={index}
                    className={`w-4 h-4 ${
                      index < Math.floor(product.rating)
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-600">
                ({product.ratingCount})
              </span>
            </>
          ) : (
            <span className="text-sm text-gray-500 italic">No ratings yet</span>
          )}
        </div>

        {/* Price */}
        <div className="mb-3">
          {hasDiscount ? (
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-gray-800">
                ₹{displayPrice.toLocaleString()}
              </span>
              <span className="text-sm text-gray-500 line-through">
                ₹{product.price.toLocaleString()}
              </span>
            </div>
          ) : (
            <span className="text-xl font-bold text-gray-800">
              ₹{displayPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors ${
              product.inStock
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Add to Cart
          </button>
          <button
            onClick={handleAddToWishlist}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Add to wishlist"
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
