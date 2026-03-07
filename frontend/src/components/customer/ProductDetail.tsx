/**
 * Product Detail Component
 * Copy to: frontend/src/components/customer/ProductDetail.tsx
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../../hooks/useCart';
import { useLanguage } from '../../hooks/useLanguage';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../common/LoadingSpinner';

interface Product {
  id: number;
  name_en: string;
  name_ta: string;
  description_en: string;
  description_ta: string;
  price_per_unit: number;
  unit: string;
  available_quantity: number;
  min_order_quantity: number;
  is_organic: boolean;
  images: string[];
  farmer_name: string;
  farmer_farm: string;
  category_name: string;
  harvest_date: string;
  preorder_available: boolean;
  preorder_cutoff_hours: number;
  review_count: number;
  average_rating: number;
}

interface Review {
  id: number;
  customer_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

  const { addToCart } = useCart();
  const { language, t } = useLanguage();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProductDetails();
    fetchReviews();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/products/${id}/`);
      setProduct(response.data);
    } catch (error) {
      console.error('Failed to fetch product:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/products/${id}/reviews/`);
      setReviews(response.data.results || response.data);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    }
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/products/${id}` } });
      return;
    }
    
    if (product) {
      addToCart({
        ...product,
        quantity: quantity
      });
      // Show success message or animation
    }
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/products/${id}` } });
      return;
    }
    
    // Add to cart and go to checkout
    if (product) {
      addToCart({
        ...product,
        quantity: quantity
      });
      navigate('/checkout');
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewLoading(true);

    try {
      await axios.post(
        `http://localhost:8000/api/products/${id}/reviews/`,
        newReview,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      setShowReviewForm(false);
      setNewReview({ rating: 5, comment: '' });
      fetchReviews(); // Refresh reviews
    } catch (error) {
      console.error('Failed to submit review:', error);
    } finally {
      setReviewLoading(false);
    }
  };

  const getProductName = () => {
    return language === 'ta' ? product?.name_ta : product?.name_en;
  };

  const getProductDescription = () => {
    return language === 'ta' ? product?.description_ta : product?.description_en;
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-700">Product not found</h2>
        <button 
          onClick={() => navigate('/products')}
          className="btn-primary mt-4"
        >
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Product Main Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Image Gallery */}
        <div>
          <div className="bg-gray-100 rounded-lg overflow-hidden mb-4 h-96">
            <img
              src={product.images[selectedImage] || '/placeholder.jpg'}
              alt={getProductName()}
              className="w-full h-full object-contain"
            />
          </div>
          
          {product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-green-500' : 'border-transparent'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{getProductName()}</h1>
          
          {/* Farmer Info */}
          <div className="bg-green-50 p-4 rounded-lg mb-4">
            <p className="text-gray-600">Sold by:</p>
            <p className="font-semibold">{product.farmer_farm}</p>
            <p className="text-sm text-gray-500">Farmer: {product.farmer_name}</p>
          </div>

          {/* Price */}
          <div className="mb-4">
            <span className="text-3xl font-bold text-green-600">
              ₹{product.price_per_unit}
            </span>
            <span className="text-gray-500 ml-2">per {product.unit}</span>
          </div>

          {/* Availability */}
          <div className="mb-4">
            {product.available_quantity > 0 ? (
              <p className="text-green-600">
                ✓ In Stock ({product.available_quantity} {product.unit} available)
              </p>
            ) : (
              <p className="text-red-600">✗ Out of Stock</p>
            )}
            
            {product.is_organic && (
              <span className="inline-block bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full mt-2">
                Organic
              </span>
            )}
          </div>

          {/* Preorder Info */}
          {product.preorder_available && (
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <p className="font-semibold text-blue-800">Preorder Available</p>
              <p className="text-sm text-blue-600">
                Order now for delivery in {product.preorder_cutoff_hours} hours
              </p>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Quantity ({product.unit})</label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuantity(Math.max(product.min_order_quantity, quantity - 1))}
                className="w-10 h-10 bg-gray-200 rounded-lg hover:bg-gray-300"
                disabled={quantity <= product.min_order_quantity}
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(product.min_order_quantity, parseInt(e.target.value) || 1))}
                min={product.min_order_quantity}
                max={product.available_quantity}
                className="w-20 text-center input-field"
              />
              <button
                onClick={() => setQuantity(Math.min(product.available_quantity, quantity + 1))}
                className="w-10 h-10 bg-gray-200 rounded-lg hover:bg-gray-300"
                disabled={quantity >= product.available_quantity}
              >
                +
              </button>
              <span className="text-gray-500 ml-2">
                Min: {product.min_order_quantity} {product.unit}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleAddToCart}
              disabled={product.available_quantity === 0}
              className="flex-1 btn-secondary py-3"
            >
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              disabled={product.available_quantity === 0}
              className="flex-1 btn-primary py-3"
            >
              Buy Now
            </button>
          </div>

          {/* Product Details */}
          <div className="mt-8 border-t pt-6">
            <h2 className="text-xl font-semibold mb-4">Product Details</h2>
            <p className="text-gray-700 mb-4">{getProductDescription()}</p>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500">Category</p>
                <p className="font-medium">{product.category_name}</p>
              </div>
              {product.harvest_date && (
                <div>
                  <p className="text-gray-500">Harvest Date</p>
                  <p className="font-medium">
                    {new Date(product.harvest_date).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="border-t pt-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">
            Reviews ({product.review_count})
          </h2>
          
          {isAuthenticated && user?.role === 'CUSTOMER' && (
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="btn-primary"
            >
              Write a Review
            </button>
          )}
        </div>

        {/* Review Form */}
        {showReviewForm && (
          <form onSubmit={handleSubmitReview} className="bg-gray-50 p-6 rounded-lg mb-6">
            <h3 className="font-semibold mb-4">Write Your Review</h3>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewReview({ ...newReview, rating: star })}
                    className={`text-2xl ${
                      star <= newReview.rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Comment</label>
              <textarea
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                className="input-field"
                rows={4}
                required
              />
            </div>
            
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={reviewLoading}
                className="btn-primary"
              >
                {reviewLoading ? 'Submitting...' : 'Submit Review'}
              </button>
              <button
                type="button"
                onClick={() => setShowReviewForm(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Reviews List */}
        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold">{review.customer_name}</p>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <span key={i}>
                          {i < review.rating ? '★' : '☆'}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">
                    {new Date(review.created_at).toLocaleDateString()}
                  </p>
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">
            No reviews yet. Be the first to review this product!
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;