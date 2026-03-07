/**
 * Product Management Component
 * Copy to: frontend/src/components/farmer/ProductManagement.tsx
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLanguage } from '../../hooks/useLanguage';
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
  category: number;
  category_name: string;
  is_active: boolean;
  preorder_available: boolean;
  preorder_cutoff_hours: number;
  harvest_date: string | null;
}

interface Category {
  id: number;
  name_en: string;
  name_ta: string;
}

const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({
    name_en: '',
    name_ta: '',
    description_en: '',
    description_ta: '',
    price_per_unit: 0,
    unit: 'KG',
    available_quantity: 0,
    min_order_quantity: 1,
    is_organic: false,
    category: undefined,
    preorder_available: false,
    preorder_cutoff_hours: 24,
    harvest_date: null
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const { language, t } = useLanguage();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/products/', {
        params: { farmer: 'me' },
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      setProducts(response.data.results || response.data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/products/categories/');
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      
      // Append form fields
      Object.keys(formData).forEach(key => {
        const value = formData[key as keyof typeof formData];
        if (value !== undefined && value !== null) {
          formDataToSend.append(key, String(value));
        }
      });

      // Append images
      imageFiles.forEach(file => {
        formDataToSend.append('images', file);
      });

      let response;
      if (editingProduct) {
        response = await axios.put(
          `http://localhost:8000/api/products/${editingProduct.id}/update/`,
          formDataToSend,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
      } else {
        response = await axios.post(
          'http://localhost:8000/api/products/create/',
          formDataToSend,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
      }

      if (response.data) {
        fetchProducts();
        resetForm();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save product');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData(product);
    setShowForm(true);
  };

  const handleDelete = async (productId: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`http://localhost:8000/api/products/${productId}/delete/`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        fetchProducts();
      } catch (error) {
        console.error('Failed to delete product:', error);
      }
    }
  };

  const handleToggleActive = async (product: Product) => {
    try {
      await axios.patch(
        `http://localhost:8000/api/products/${product.id}/update/`,
        { is_active: !product.is_active },
        {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }
      );
      fetchProducts();
    } catch (error) {
      console.error('Failed to toggle product status:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name_en: '',
      name_ta: '',
      description_en: '',
      description_ta: '',
      price_per_unit: 0,
      unit: 'KG',
      available_quantity: 0,
      min_order_quantity: 1,
      is_organic: false,
      category: undefined,
      preorder_available: false,
      preorder_cutoff_hours: 24,
      harvest_date: null
    });
    setImageFiles([]);
    setEditingProduct(null);
    setShowForm(false);
    setError('');
  };

  const getProductName = (product: Product) => {
    return language === 'ta' ? product.name_ta : product.name_en;
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Product Management</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary"
        >
          {showForm ? 'Cancel' : 'Add New Product'}
        </button>
      </div>

      {/* Product Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </h2>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* English Name */}
              <div>
                <label className="block text-gray-700 mb-2">Product Name (English)</label>
                <input
                  type="text"
                  name="name_en"
                  value={formData.name_en}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>

              {/* Tamil Name */}
              <div>
                <label className="block text-gray-700 mb-2">Product Name (Tamil)</label>
                <input
                  type="text"
                  name="name_ta"
                  value={formData.name_ta}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-gray-700 mb-2">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {language === 'ta' ? cat.name_ta : cat.name_en}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div>
                <label className="block text-gray-700 mb-2">Price (₹)</label>
                <input
                  type="number"
                  name="price_per_unit"
                  value={formData.price_per_unit}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  className="input-field"
                  required
                />
              </div>

              {/* Unit */}
              <div>
                <label className="block text-gray-700 mb-2">Unit</label>
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                >
                  <option value="KG">Kilogram (KG)</option>
                  <option value="GRAM">Gram</option>
                  <option value="DOZEN">Dozen</option>
                  <option value="PIECE">Piece</option>
                  <option value="BAG">Bag</option>
                  <option value="LITRE">Litre</option>
                </select>
              </div>

              {/* Available Quantity */}
              <div>
                <label className="block text-gray-700 mb-2">Available Quantity</label>
                <input
                  type="number"
                  name="available_quantity"
                  value={formData.available_quantity}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  className="input-field"
                  required
                />
              </div>

              {/* Min Order Quantity */}
              <div>
                <label className="block text-gray-700 mb-2">Minimum Order Quantity</label>
                <input
                  type="number"
                  name="min_order_quantity"
                  value={formData.min_order_quantity}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0.01"
                  className="input-field"
                  required
                />
              </div>

              {/* Harvest Date */}
              <div>
                <label className="block text-gray-700 mb-2">Harvest Date (Optional)</label>
                <input
                  type="date"
                  name="harvest_date"
                  value={formData.harvest_date || ''}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>

              {/* English Description */}
              <div className="md:col-span-2">
                <label className="block text-gray-700 mb-2">Description (English)</label>
                <textarea
                  name="description_en"
                  value={formData.description_en}
                  onChange={handleInputChange}
                  rows={3}
                  className="input-field"
                />
              </div>

              {/* Tamil Description */}
              <div className="md:col-span-2">
                <label className="block text-gray-700 mb-2">Description (Tamil)</label>
                <textarea
                  name="description_ta"
                  value={formData.description_ta}
                  onChange={handleInputChange}
                  rows={3}
                  className="input-field"
                />
              </div>

              {/* Checkboxes */}
              <div className="md:col-span-2">
                <div className="flex gap-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="is_organic"
                      checked={formData.is_organic}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    Organic Product
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="preorder_available"
                      checked={formData.preorder_available}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    Allow Preorders
                  </label>
                </div>
              </div>

              {/* Preorder Cutoff */}
              {formData.preorder_available && (
                <div>
                  <label className="block text-gray-700 mb-2">Preorder Cutoff (Hours)</label>
                  <input
                    type="number"
                    name="preorder_cutoff_hours"
                    value={formData.preorder_cutoff_hours}
                    onChange={handleInputChange}
                    min="1"
                    className="input-field"
                  />
                </div>
              )}

              {/* Images */}
              <div className="md:col-span-2">
                <label className="block text-gray-700 mb-2">Product Images</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="input-field"
                />
                <p className="text-sm text-gray-500 mt-1">
                  You can select multiple images
                </p>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary px-8"
              >
                {submitting ? 'Saving...' : (editingProduct ? 'Update Product' : 'Add Product')}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="btn-secondary px-8"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">Product</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-left">Price</th>
              <th className="px-4 py-3 text-left">Stock</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center">
                    {product.images && product.images[0] && (
                      <img 
                        src={product.images[0]} 
                        alt={getProductName(product)}
                        className="w-10 h-10 object-cover rounded mr-3"
                      />
                    )}
                    <div>
                      <p className="font-medium">{getProductName(product)}</p>
                      <p className="text-xs text-gray-500">{product.name_en}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">{product.category_name}</td>
                <td className="px-4 py-3">₹{product.price_per_unit}/{product.unit}</td>
                <td className="px-4 py-3">
                  <span className={product.available_quantity > 10 ? 'text-green-600' : 'text-orange-600'}>
                    {product.available_quantity} {product.unit}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleToggleActive(product)}
                    className={`px-2 py-1 rounded-full text-xs ${
                      product.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {product.is_active ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  No products yet. Click "Add New Product" to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductManagement;