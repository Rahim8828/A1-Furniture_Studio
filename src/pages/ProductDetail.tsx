import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LazyImage from '../components/LazyImage';
import { productService } from '../services/ProductService';
import { cartService } from '../services/CartService';
import { wishlistService } from '../services/WishlistService';
import type { ProductDetail as ProductDetailType } from '../models/types';

export default function ProductDetail() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      if (!productId) {
        setLoading(false);
        return;
      }

      try {
        const productData = await productService.getProductById(productId);
        setProduct(productData);
        
        if (productData) {
          setIsInWishlist(wishlistService.isInWishlist(productData.id));
        }
      } catch (error) {
        console.error('Error loading product:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  const handleAddToCart = () => {
    if (product) {
      cartService.addItem(product.id, 1);
      alert('Product added to cart!');
    }
  };

  const handleBuyNow = () => {
    if (product) {
      // Navigate directly to checkout with this product without modifying cart
      navigate('/checkout', { 
        state: { 
          buyNowProduct: {
            productId: product.id,
            product: product,
            quantity: 1,
            priceAtAdd: product.discountPrice || product.price,
            itemTotal: product.discountPrice || product.price
          }
        } 
      });
    }
  };

  const handleToggleWishlist = () => {
    if (product) {
      if (isInWishlist) {
        wishlistService.removeItem(product.id);
        setIsInWishlist(false);
      } else {
        wishlistService.addItem(product.id);
        setIsInWishlist(true);
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Return to Homepage
          </button>
        </div>
      </div>
    );
  }

  const displayPrice = product.discountPrice || product.price;
  const hasDiscount = !!product.discountPrice;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image Gallery Section */}
        <div>
          {/* Main Image */}
          <div className="mb-4">
            <LazyImage
              src={product.images[selectedImageIndex]?.url || product.imageUrl}
              alt={product.images[selectedImageIndex]?.alt || product.name}
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>

          {/* Thumbnail Images */}
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                className={`border-2 rounded overflow-hidden ${
                  selectedImageIndex === index ? 'border-blue-600' : 'border-gray-300'
                }`}
              >
                <LazyImage
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-20 object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Information Section */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          
          {/* Category */}
          <p className="text-gray-600 mb-4">{product.category}</p>

          {/* Rating */}
          <div className="flex items-center mb-4">
            {product.ratingCount > 0 ? (
              <>
                <div className="flex items-center">
                  <span className="text-yellow-500 text-xl">★</span>
                  <span className="ml-1 font-semibold">{product.rating.toFixed(1)}</span>
                </div>
                <span className="ml-2 text-gray-600">({product.ratingCount} ratings)</span>
              </>
            ) : (
              <span className="text-gray-500 italic">No ratings yet</span>
            )}
          </div>

          {/* Price */}
          <div className="mb-6">
            {hasDiscount ? (
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-green-600">
                    ₹{displayPrice.toLocaleString()}
                  </span>
                  <span className="text-xl text-gray-500 line-through">
                    ₹{product.price.toLocaleString()}
                  </span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-semibold">
                    {product.discountPercentage}% OFF
                  </span>
                </div>
              </div>
            ) : (
              <span className="text-3xl font-bold">₹{displayPrice.toLocaleString()}</span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              className="flex-1 bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition"
            >
              Buy Now
            </button>
            <button
              onClick={handleToggleWishlist}
              className={`px-6 py-3 rounded-lg border-2 transition ${
                isInWishlist
                  ? 'bg-red-50 border-red-500 text-red-500'
                  : 'border-gray-300 text-gray-600 hover:border-red-500 hover:text-red-500'
              }`}
              aria-label="Add to wishlist"
            >
              {isInWishlist ? '❤️' : '🤍'}
            </button>
          </div>

          {/* Stock Status */}
          <div className="mb-6">
            {product.inStock ? (
              <span className="text-green-600 font-semibold">✓ In Stock</span>
            ) : (
              <span className="text-red-600 font-semibold">✗ Out of Stock</span>
            )}
          </div>

          {/* Description */}
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-2">Description</h2>
            <p className="text-gray-700">{product.description}</p>
          </div>

          {/* Materials */}
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-2">Materials</h2>
            <div className="space-y-1">
              {product.materials.woodType && (
                <p className="text-gray-700">
                  <span className="font-semibold">Wood Type:</span> {product.materials.woodType}
                </p>
              )}
              {product.materials.fabric && (
                <p className="text-gray-700">
                  <span className="font-semibold">Fabric:</span> {product.materials.fabric}
                </p>
              )}
              {product.materials.polish && (
                <p className="text-gray-700">
                  <span className="font-semibold">Polish:</span> {product.materials.polish}
                </p>
              )}
            </div>
          </div>

          {/* Dimensions */}
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-2">Dimensions</h2>
            <p className="text-gray-700">
              {product.dimensions.length} × {product.dimensions.width} × {product.dimensions.height}{' '}
              {product.dimensions.unit}
            </p>
          </div>

          {/* Specifications */}
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-2">Specifications</h2>
            <div className="space-y-1">
              {Object.entries(product.specifications).map(([key, value]) => (
                <p key={key} className="text-gray-700">
                  <span className="font-semibold">{key}:</span> {value}
                </p>
              ))}
            </div>
          </div>

          {/* Delivery Information */}
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-2">Delivery Information</h2>
            <p className="text-gray-700">{product.deliveryInfo}</p>
          </div>

          {/* Warranty Information */}
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-2">Warranty</h2>
            <p className="text-gray-700">{product.warrantyInfo}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
