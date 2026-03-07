/**
 * Product Browse Component - Complete Bilingual (FIXED)
 * Copy to: frontend/src/components/customer/ProductBrowse.tsx
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '../../hooks/useLanguage';
import { useCart } from '../../hooks/useCart';

interface Product {
  id: number;
  name_en: string;
  name_ta: string;
  price_per_unit: number;
  unit: string;
  available_quantity: number;
  is_organic: boolean;
  images: string[];
  farmer_name: string;
  farmer_farm: string;
  average_rating: number;
  review_count: number;
  category?: number;
  category_name?: string;
}

interface Category {
  id: number;
  name_en: string;
  name_ta: string;
}

const ProductBrowse: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [organic, setOrganic] = useState('');
  const [sort, setSort] = useState('-created_at');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  
  const { language, t } = useLanguage();
  const { addToCart } = useCart();
  const isTamil = language === 'ta';

  // Tamil translations for filter options
  const filterText = {
    allCategories: isTamil ? 'அனைத்து வகைகள்' : 'All Categories',
    allTypes: isTamil ? 'அனைத்து வகைகள்' : 'All Types',
    organic: isTamil ? 'இயற்கை' : 'Organic',
    conventional: isTamil ? 'சாதாரண' : 'Conventional',
    newest: isTamil ? 'புதியவை முதலில்' : 'Newest First',
    priceLowToHigh: isTamil ? 'விலை: குறைவு முதல் அதிகம்' : 'Price: Low to High',
    priceHighToLow: isTamil ? 'விலை: அதிகம் முதல் குறைவு' : 'Price: High to Low',
    topRated: isTamil ? 'அதிக மதிப்பீடு' : 'Top Rated',
    searchPlaceholder: isTamil ? 'பொருட்களை தேடுக...' : 'Search products...',
    filters: isTamil ? 'வடிப்பான்கள்' : 'Filters',
    clearFilters: isTamil ? 'வடிப்பான்களை அழி' : 'Clear Filters',
    applyFilters: isTamil ? 'வடிப்பான்களை பயன்படுத்து' : 'Apply Filters',
    priceRange: isTamil ? 'விலை வரம்பு' : 'Price Range',
    min: isTamil ? 'குறைந்தபட்சம்' : 'Min',
    max: isTamil ? 'அதிகபட்சம்' : 'Max',
    inStock: isTamil ? 'கையிருப்பில் உள்ளது' : 'In Stock',
    outOfStock: isTamil ? 'கையிருப்பில் இல்லை' : 'Out of Stock',
    available: isTamil ? 'கிடைக்கும்' : 'available',
    per: isTamil ? 'ஒன்றுக்கு' : 'per',
    noProducts: isTamil ? 'பொருட்கள் எதுவும் இல்லை' : 'No products found',
    tryAdjusting: isTamil ? 'உங்கள் வடிப்பான்களை மாற்றி முயற்சிக்கவும்' : 'Try adjusting your filters'
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [category, organic, sort, priceRange.min, priceRange.max]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/products/categories/');
      // Ensure we always set an array, even if response.data is not an array
      const categoriesData = response.data?.results || response.data || [];
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      setCategories([]); // Set empty array on error
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (category) params.category = category;
      if (organic) params.organic = organic;
      if (sort) params.ordering = sort;
      if (search) params.search = search;
      if (priceRange.min) params.min_price = priceRange.min;
      if (priceRange.max) params.max_price = priceRange.max;
      
      const response = await axios.get('http://localhost:8000/api/products/', { params });
      const productsData = response.data?.results || response.data || [];
      setProducts(Array.isArray(productsData) ? productsData : []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  const clearFilters = () => {
    setCategory('');
    setOrganic('');
    setSort('-created_at');
    setPriceRange({ min: '', max: '' });
    setSearch('');
    fetchProducts();
  };

  const getProductName = (product: Product) => {
    return isTamil && product.name_ta ? product.name_ta : product.name_en;
  };

  const getCategoryName = (cat: Category) => {
    return isTamil ? cat.name_ta : cat.name_en;
  };

  const getUnitText = (unit: string) => {
    const units: { [key: string]: { en: string, ta: string } } = {
      'KG': { en: 'kg', ta: 'கிலோ' },
      'GRAM': { en: 'g', ta: 'கிராம்' },
      'DOZEN': { en: 'dozen', ta: 'டஜன்' },
      'PIECE': { en: 'piece', ta: 'துண்டு' },
      'BAG': { en: 'bag', ta: 'பை' },
      'LITRE': { en: 'L', ta: 'லிட்டர்' }
    };
    return isTamil ? units[unit]?.ta || unit : units[unit]?.en || unit;
  };

  // Safe rendering of categories
  const renderCategoryOptions = () => {
    if (!categories || categories.length === 0) {
      return <option value="">{filterText.allCategories}</option>;
    }
    return (
      <>
        <option value="">{filterText.allCategories}</option>
        {categories.map(cat => (
          <option key={cat.id} value={cat.id}>
            {getCategoryName(cat)}
          </option>
        ))}
      </>
    );
  };

  return (
    <div>
      {/* Search and Filters Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">
          {isTamil ? 'எங்கள் பொருட்கள்' : 'Our Products'}
        </h1>
        
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={filterText.searchPlaceholder}
            className="flex-1 input-field"
          />
          <button type="submit" className="btn-primary">
            {isTamil ? 'தேடுக' : 'Search'}
          </button>
          {(category || organic || priceRange.min || priceRange.max || search) && (
            <button 
              type="button" 
              onClick={clearFilters}
              className="btn-secondary"
            >
              {filterText.clearFilters}
            </button>
          )}
        </form>

        {/* Filters Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Category Filter */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input-field"
          >
            {renderCategoryOptions()}
          </select>
          
          {/* Organic/Conventional Filter */}
          <select
            value={organic}
            onChange={(e) => setOrganic(e.target.value)}
            className="input-field"
          >
            <option value="">{filterText.allTypes}</option>
            <option value="true">{filterText.organic}</option>
            <option value="false">{filterText.conventional}</option>
          </select>
          
          {/* Sort Filter */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="input-field"
          >
            <option value="-created_at">{filterText.newest}</option>
            <option value="price_per_unit">{filterText.priceLowToHigh}</option>
            <option value="-price_per_unit">{filterText.priceHighToLow}</option>
            <option value="-average_rating">{filterText.topRated}</option>
          </select>

          {/* Price Range */}
          <div className="flex gap-2">
            <input
              type="number"
              placeholder={filterText.min}
              value={priceRange.min}
              onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
              className="input-field w-1/2"
              min="0"
            />
            <input
              type="number"
              placeholder={filterText.max}
              value={priceRange.max}
              onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
              className="input-field w-1/2"
              min="0"
            />
          </div>
        </div>

        {/* Active Filters Display */}
        {(category || organic || priceRange.min || priceRange.max) && (
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-sm text-gray-600">
              {isTamil ? 'செயலில் உள்ள வடிப்பான்கள்:' : 'Active filters:'}
            </span>
            {category && categories.find(c => c.id === Number(category)) && (
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                {isTamil ? 'வகை:' : 'Cat:'} {getCategoryName(categories.find(c => c.id === Number(category))!)}
                <button onClick={() => setCategory('')} className="ml-1 hover:text-green-900">×</button>
              </span>
            )}
            {organic && (
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                {organic === 'true' ? filterText.organic : filterText.conventional}
                <button onClick={() => setOrganic('')} className="ml-1 hover:text-green-900">×</button>
              </span>
            )}
            {(priceRange.min || priceRange.max) && (
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                ₹{priceRange.min || '0'} - ₹{priceRange.max || '∞'}
                <button onClick={() => setPriceRange({ min: '', max: '' })} className="ml-1 hover:text-green-900">×</button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="spinner"></div>
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="card hover:shadow-lg transition group">
              <Link to={`/products/${product.id}`}>
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  <img
                    src={product.images?.[0] || '/placeholder-product.jpg'}
                    alt={getProductName(product)}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder-product.jpg';
                    }}
                  />
                  {product.is_organic && (
                    <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      {filterText.organic}
                    </span>
                  )}
                </div>
              </Link>
              
              <div className="p-4">
                <Link to={`/products/${product.id}`}>
                  <h3 className="font-semibold text-lg mb-1 hover:text-green-600 transition">
                    {getProductName(product)}
                  </h3>
                </Link>
                
                <p className="text-gray-600 text-sm mb-2 line-clamp-1">
                  {product.farmer_farm} • {product.farmer_name}
                </p>
                
                {/* Rating */}
                <div className="flex items-center mb-2">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-sm">
                        {i < Math.floor(product.average_rating || 0) ? '★' : '☆'}
                      </span>
                    ))}
                  </div>
                  <span className="text-xs text-gray-500 ml-1">
                    ({product.review_count || 0})
                  </span>
                </div>
                
                {/* Price and Stock */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xl font-bold text-green-600">
                    ₹{product.price_per_unit}
                    <span className="text-sm font-normal text-gray-500 ml-1">
                      /{getUnitText(product.unit)}
                    </span>
                  </span>
                  <span className={`text-xs ${product.available_quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {product.available_quantity > 0 
                      ? `${product.available_quantity} ${getUnitText(product.unit)}`
                      : filterText.outOfStock}
                  </span>
                </div>
                
                {/* Add to Cart Button */}
                <button
                  onClick={() => addToCart(product)}
                  disabled={product.available_quantity === 0}
                  className={`w-full py-2 rounded-lg transition ${
                    product.available_quantity > 0
                      ? 'btn-primary'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {product.available_quantity > 0 
                    ? (isTamil ? 'வண்டியில் சேர்க்க' : 'Add to Cart')
                    : filterText.outOfStock}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <div className="text-6xl mb-4">😕</div>
          <h3 className="text-xl font-semibold mb-2">{filterText.noProducts}</h3>
          <p className="text-gray-600 mb-4">{filterText.tryAdjusting}</p>
          <button onClick={clearFilters} className="btn-primary">
            {filterText.clearFilters}
          </button>
        </div>
      )}

      {/* Results Count */}
      {!loading && products.length > 0 && (
        <div className="mt-8 text-sm text-gray-500 text-center">
          {isTamil 
            ? `${products.length} பொருட்கள் காட்டப்படுகின்றன` 
            : `Showing ${products.length} products`}
        </div>
      )}
    </div>
  );
};

export default ProductBrowse;