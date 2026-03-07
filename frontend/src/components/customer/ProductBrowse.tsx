/**
 * Product Browse Component
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
}

const ProductBrowse: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [organic, setOrganic] = useState('');
  const [sort, setSort] = useState('-created_at');
  
  const { language, t } = useLanguage();
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts();
  }, [category, organic, sort]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (category) params.category = category;
      if (organic) params.organic = organic;
      if (sort) params.ordering = sort;
      if (search) params.search = search;
      
      const response = await axios.get('http://localhost:8000/api/products/', { params });
      setProducts(response.data.results || response.data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  const getProductName = (product: Product) => {
    return language === 'ta' ? product.name_ta : product.name_en;
  };

  return (
    <div>
      {/* Search and Filters */}
      <div className="mb-8">
        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('search')}
            className="flex-1 input-field"
          />
          <button type="submit" className="btn-primary">
            {t('search')}
          </button>
        </form>
        
        <div className="flex gap-4">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input-field w-48"
          >
            <option value="">All Categories</option>
            <option value="1">Vegetables</option>
            <option value="2">Fruits</option>
            <option value="3">Grains</option>
          </select>
          
          <select
            value={organic}
            onChange={(e) => setOrganic(e.target.value)}
            className="input-field w-48"
          >
            <option value="">All Types</option>
            <option value="true">Organic</option>
            <option value="false">Conventional</option>
          </select>
          
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="input-field w-48"
          >
            <option value="-created_at">Newest First</option>
            <option value="price_per_unit">Price: Low to High</option>
            <option value="-price_per_unit">Price: High to Low</option>
            <option value="-average_rating">Top Rated</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="flex justify-center">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="card hover:shadow-lg transition">
              <Link to={`/products/${product.id}`}>
                <img
                  src={product.images[0] || '/placeholder.jpg'}
                  alt={getProductName(product)}
                  className="w-full h-48 object-cover"
                />
              </Link>
              
              <div className="p-4">
                <Link to={`/products/${product.id}`}>
                  <h3 className="font-semibold text-lg mb-1">
                    {getProductName(product)}
                  </h3>
                </Link>
                
                <p className="text-gray-600 text-sm mb-2">
                  {product.farmer_farm} • {product.farmer_name}
                </p>
                
                <div className="flex items-center mb-2">
                  {product.is_organic && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                      Organic
                    </span>
                  )}
                  <span className="text-sm text-gray-500 ml-2">
                    {product.available_quantity} {product.unit} available
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-green-600">
                    ₹{product.price_per_unit}/{product.unit}
                  </span>
                  
                  <button
                    onClick={() => addToCart(product)}
                    className="btn-primary text-sm"
                    disabled={product.available_quantity === 0}
                  >
                    {t('addToCart')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductBrowse;