/**
 * Product Management Component - COMPLETELY FIXED with all translations
 * Copy to: frontend/src/components/farmer/ProductManagement.tsx
 */

import React, { useState, useEffect } from 'react';
import api from '../../services/api';
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
  category: number;
  category_name: string;
  is_active: boolean;
  preorder_available: boolean;
  preorder_cutoff_hours: number;
  harvest_date: string | null;
  delivery_available: boolean;
  delivery_zones: string[];
  delivery_fee: number;
  free_delivery_min_amount: number | null;
  pickup_available: boolean;
  farm_pickup_address: string;
  estimated_delivery_days: number;
  delivery_partner_required: boolean;
  delivery_partner_commission?: number;
}

interface Category {
  id: number;
  name_en: string;
  name_ta: string;
}

const ProductManagement: React.FC = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const isTamil = language === 'ta';

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [connectionError, setConnectionError] = useState(false);
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
    harvest_date: null,
    delivery_available: true,
    delivery_zones: [],
    delivery_fee: 50,
    free_delivery_min_amount: null,
    pickup_available: true,
    farm_pickup_address: '',
    estimated_delivery_days: 2,
    delivery_partner_required: true,
    delivery_partner_commission: 30
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // ✅ COMPLETE TRANSLATIONS - All keys used in JSX
  const t = {
    // Page
    pageTitle: isTamil ? 'பொருட்கள் மேலாண்மை' : 'Product Management',
    addNew: isTamil ? 'புதிய பொருள் சேர்க்க' : 'Add New Product',
    cancel: isTamil ? 'ரத்து செய்' : 'Cancel',
    edit: isTamil ? 'திருத்து' : 'Edit',
    delete: isTamil ? 'நீக்கு' : 'Delete',
    save: isTamil ? 'சேமி' : 'Save',
    updating: isTamil ? 'புதுப்பிக்கிறது...' : 'Updating...',
    saving: isTamil ? 'சேமிக்கிறது...' : 'Saving...',
    addSuccess: isTamil ? 'பொருள் வெற்றிகரமாக சேர்க்கப்பட்டது!' : 'Product added successfully!',
    updateSuccess: isTamil ? 'பொருள் வெற்றிகரமாக புதுப்பிக்கப்பட்டது!' : 'Product updated successfully!',
    deleteConfirm: isTamil ? 'இந்த பொருளை நீக்க விரும்புகிறீர்களா?' : 'Are you sure you want to delete this product?',
    noProducts: isTamil ? 'இதுவரை பொருட்கள் இல்லை.' : 'No products yet.',
    connectionError: isTamil
      ? 'சேவையகத்துடன் இணைக்க முடியவில்லை. பின்வருவனவற்றை சரிபார்க்கவும்:\n• Django சேவையகம் இயங்குகிறதா?\n• சேவையகம் சரியான போர்ட்டில் உள்ளதா?'
      : 'Cannot connect to server. Please check:\n• Is Django server running?\n• Is it on the correct port?',
    retry: isTamil ? 'மீண்டும் முயற்சி செய்' : 'Retry Connection',

    // Form fields
    nameEn: isTamil ? 'பெயர் (ஆங்கிலம்)' : 'Name (English)',
    nameTa: isTamil ? 'பெயர் (தமிழ்)' : 'Name (Tamil)',
    category: isTamil ? 'வகை' : 'Category',
    price: isTamil ? 'விலை (₹)' : 'Price (₹)',
    unit: isTamil ? 'அலகு' : 'Unit',
    availableQty: isTamil ? 'கிடைக்கும் அளவு' : 'Available Quantity',
    minOrder: isTamil ? 'குறைந்தபட்ச ஆர்டர்' : 'Min Order Quantity',
    description: isTamil ? 'விளக்கம்' : 'Description',
    organic: isTamil ? 'இயற்கை பொருள்' : 'Organic',
    preorder: isTamil ? 'முன்-ஆர்டரை அனுமதி' : 'Allow Preorders',
    harvestDate: isTamil ? 'அறுவடை தேதி' : 'Harvest Date',
    images: isTamil ? 'படங்கள்' : 'Images',
    selectImages: isTamil ? 'படங்களை தேர்ந்தெடுக்கவும்' : 'Select Images',

    // Units
    kg: isTamil ? 'கிலோ' : 'Kg',
    gram: isTamil ? 'கிராம்' : 'Gram',
    dozen: isTamil ? 'டஜன்' : 'Dozen',
    piece: isTamil ? 'துண்டு' : 'Piece',
    bag: isTamil ? 'பை' : 'Bag',
    litre: isTamil ? 'லிட்டர்' : 'Litre',

    // Delivery settings
    deliverySettings: isTamil ? 'விநியோக அமைப்புகள்' : 'Delivery Settings',
    deliveryAvailable: isTamil ? 'விநியோகம் கிடைக்குமா?' : 'Delivery Available?',
    pickupAvailable: isTamil ? 'பண்ணையில் எடுத்துச் செல்லல் கிடைக்குமா?' : 'Pickup Available?',
    pickupAddress: isTamil ? 'பண்ணை முகவரி' : 'Farm Pickup Address',
    deliveryFee: isTamil ? 'விநியோக கட்டணம் (₹)' : 'Delivery Fee (₹)',
    freeDeliveryMin: isTamil ? 'இலவச விநியோகத்திற்கான குறைந்தபட்ச தொகை' : 'Free Delivery Min Amount',
    deliveryPartnerRequired: isTamil ? 'விநியோக கூட்டாளி தேவையா?' : 'Delivery Partner Required?',
    deliveryPartnerCommission: isTamil ? 'விநியோக கூட்டாளி கமிஷன் (%)' : 'Delivery Partner Commission (%)',
    estDeliveryDays: isTamil ? 'மதிப்பிடப்பட்ட விநியோக நாட்கள்' : 'Est. Delivery Days',
    deliveryZones: isTamil ? 'விநியோக மண்டலங்கள்' : 'Delivery Zones',
    zonePlaceholder: isTamil ? 'சென்னை, கோயம்புத்தூர்...' : 'Chennai, Coimbatore...',

    // Table headers
    product: isTamil ? 'பொருள்' : 'Product',
    categoryCol: isTamil ? 'வகை' : 'Category',
    priceCol: isTamil ? 'விலை' : 'Price',
    stock: isTamil ? 'இருப்பு' : 'Stock',
    status: isTamil ? 'நிலை' : 'Status',
    actions: isTamil ? 'செயல்கள்' : 'Actions',
    active: isTamil ? 'செயலில்' : 'Active',
    inactive: isTamil ? 'செயலற்று' : 'Inactive'
  };

  useEffect(() => {
    checkServerConnection();
  }, []);
  const PLACEHOLDER_IMAGE = 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'100\' height=\'100\' viewBox=\'0 0 100 100\'%3E%3Crect width=\'100\' height=\'100\' fill=\'%23f0f0f0\'/%3E%3Ctext x=\'50%%\' y=\'50%%\' text-anchor=\'middle\' dy=\'.3em\' fill=\'%23999\' font-size=\'50\'%3E📦%3C/text%3E%3C/svg%3E';
  const checkServerConnection = async () => {
    try {
      await api.get('/api/products/', { timeout: 5000 });
      setConnectionError(false);
      fetchProducts();
      fetchCategories();
    } catch (error) {
      console.error('Server connection failed:', error);
      setConnectionError(true);
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      console.log('📦 Fetching products...');

      const response = await api.get('/api/products/', {
        params: { farmer: 'me' }
      });

      console.log('✅ Products fetched:', response.data);

      const productsData = response.data.results || response.data;
      setProducts(Array.isArray(productsData) ? productsData : []);
      setError('');
    } catch (error: any) {
      console.error('❌ Error fetching products:', error);

      if (!error.response) {
        setConnectionError(true);
        setError(t.connectionError);
      } else {
        setError(isTamil ? 'பொருட்களை ஏற்ற முடியவில்லை' : 'Failed to fetch products');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/api/products/categories/');
      const categoriesData = response.data.results || response.data || [];
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
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
      const files = Array.from(e.target.files);
      setImageFiles(files);

      const previews = files.map(file => URL.createObjectURL(file));
      setImagePreviews(previews);
    }
  };

  const removeImage = (index: number) => {
    const newFiles = [...imageFiles];
    const newPreviews = [...imagePreviews];

    URL.revokeObjectURL(newPreviews[index]);

    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);

    setImageFiles(newFiles);
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const formDataToSend = new FormData();

      Object.keys(formData).forEach(key => {
        const value = formData[key as keyof typeof formData];
        if (value !== undefined && value !== null && value !== '') {
          if (key === 'delivery_zones') {
            if (typeof value === 'string') {
              const zonesArray = value.split(',').map(z => z.trim()).filter(z => z);
              formDataToSend.append(key, JSON.stringify(zonesArray));
            } else if (Array.isArray(value)) {
              formDataToSend.append(key, JSON.stringify(value));
            }
          } else {
            formDataToSend.append(key, String(value));
          }
        }
      });

      imageFiles.forEach(file => {
        formDataToSend.append('images', file);
      });

      let response;
      if (editingProduct) {
        console.log('📝 Updating product ID:', editingProduct.id);
        response = await api.put(
          `/api/products/${editingProduct.id}/`,
          formDataToSend,
          {
            headers: { 'Content-Type': 'multipart/form-data' }
          }
        );
      } else {
        console.log('➕ Creating new product');
        response = await api.post(
          '/api/products/create/',
          formDataToSend,
          {
            headers: { 'Content-Type': 'multipart/form-data' }
          }
        );
      }

      if (response.data) {
        await fetchProducts();
        setSuccess(editingProduct ? t.updateSuccess : t.addSuccess);
        resetForm();
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err: any) {
      console.error('❌ Submit error:', err);

      if (!err.response) {
        setConnectionError(true);
        setError(t.connectionError);
      } else {
        setError(err.response?.data?.message || (isTamil ? 'பொருளை சேமிக்க முடியவில்லை' : 'Failed to save product'));
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name_en: product.name_en,
      name_ta: product.name_ta,
      description_en: product.description_en,
      description_ta: product.description_ta,
      price_per_unit: product.price_per_unit,
      unit: product.unit,
      available_quantity: product.available_quantity,
      min_order_quantity: product.min_order_quantity,
      is_organic: product.is_organic,
      category: product.category,
      preorder_available: product.preorder_available,
      preorder_cutoff_hours: product.preorder_cutoff_hours,
      harvest_date: product.harvest_date,
      is_active: product.is_active,
      delivery_available: product.delivery_available,
      delivery_zones: product.delivery_zones || [],
      delivery_fee: product.delivery_fee,
      free_delivery_min_amount: product.free_delivery_min_amount,
      pickup_available: product.pickup_available,
      farm_pickup_address: product.farm_pickup_address || '',
      estimated_delivery_days: product.estimated_delivery_days,
      delivery_partner_required: product.delivery_partner_required,
      delivery_partner_commission: product.delivery_partner_commission
    });
    setImagePreviews(product.images || []);
    setImageFiles([]);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (productId: number) => {
    if (!window.confirm(t.deleteConfirm)) return;

    try {
      await api.delete(`/api/products/${productId}/`);
      await fetchProducts();
      setSuccess(isTamil ? 'பொருள் நீக்கப்பட்டது' : 'Product deleted');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Failed to delete product:', error);
      setError(isTamil ? 'பொருளை நீக்க முடியவில்லை' : 'Failed to delete product');
    }
  };

  const handleToggleActive = async (product: Product) => {
    try {
      await api.patch(
        `/api/products/${product.id}/`,
        { is_active: !product.is_active }
      );
      await fetchProducts();
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

    imagePreviews.forEach(url => URL.revokeObjectURL(url));

    setImageFiles([]);
    setImagePreviews([]);
    setEditingProduct(null);
    setShowForm(false);
    setError('');
  };

  const getProductName = (product: Product) => {
    return isTamil && product.name_ta ? product.name_ta : product.name_en;
  };

  const getUnitText = (unit: string) => {
    const units: { [key: string]: string } = {
      'KG': t.kg,
      'GRAM': t.gram,
      'DOZEN': t.dozen,
      'PIECE': t.piece,
      'BAG': t.bag,
      'LITRE': t.litre
    };
    return units[unit] || unit;
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (connectionError) {
    return (
      <div className="max-w-6xl mx-auto text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8">
          <div className="text-6xl mb-4">🔌</div>
          <h2 className="text-2xl font-semibold text-red-700 mb-4">
            {isTamil ? 'இணைப்பு பிழை' : 'Connection Error'}
          </h2>
          <p className="text-gray-600 mb-6 whitespace-pre-line">{t.connectionError}</p>
          <div className="space-y-4 text-left bg-white p-4 rounded-lg mb-6">
            <p className="font-semibold">Debug Steps:</p>
            <ol className="list-decimal list-inside space-y-2 text-gray-600">
              <li>Open Command Prompt and run: <code className="bg-gray-100 px-2 py-1 rounded">python manage.py runserver</code></li>
              <li>Look for: <code className="bg-green-100 text-green-800 px-2 py-1 rounded">Development server is running at http://127.0.0.1:8000/</code></li>
              <li>Open browser and go to: <a href="http://127.0.0.1:8000/api/products/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">http://127.0.0.1:8000/api/products/</a></li>
              <li>If you see JSON data, Django is working</li>
              <li>Temporarily disable Windows Firewall/Defender</li>
            </ol>
          </div>
          <button
            onClick={checkServerConnection}
            className="btn-primary px-8"
          >
            {t.retry}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t.pageTitle}</h1>
        <button
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
          className="btn-primary"
        >
          {showForm ? t.cancel : t.addNew}
        </button>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Product Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {editingProduct ? t.edit : t.addNew}
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* English Name */}
              <div>
                <label className="block text-gray-700 mb-2">{t.nameEn} *</label>
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
                <label className="block text-gray-700 mb-2">{t.nameTa} *</label>
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
                <label className="block text-gray-700 mb-2">{t.category} *</label>
                <select
                  name="category"
                  value={formData.category || ''}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                >
                  <option value="">{isTamil ? 'வகையை தேர்ந்தெடுக்கவும்' : 'Select Category'}</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {isTamil ? cat.name_ta : cat.name_en}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div>
                <label className="block text-gray-700 mb-2">{t.price} *</label>
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
                <label className="block text-gray-700 mb-2">{t.unit} *</label>
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                >
                  <option value="KG">{t.kg}</option>
                  <option value="GRAM">{t.gram}</option>
                  <option value="DOZEN">{t.dozen}</option>
                  <option value="PIECE">{t.piece}</option>
                  <option value="BAG">{t.bag}</option>
                  <option value="LITRE">{t.litre}</option>
                </select>
              </div>

              {/* Available Quantity */}
              <div>
                <label className="block text-gray-700 mb-2">{t.availableQty} *</label>
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
                <label className="block text-gray-700 mb-2">{t.minOrder} *</label>
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
                <label className="block text-gray-700 mb-2">{t.harvestDate}</label>
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
                <label className="block text-gray-700 mb-2">{t.description} (English)</label>
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
                <label className="block text-gray-700 mb-2">{t.description} (Tamil)</label>
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
                    {t.organic}
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="preorder_available"
                      checked={formData.preorder_available}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    {t.preorder}
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
                <label className="block text-gray-700 mb-2">{t.images}</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="input-field"
                />
                <p className="text-sm text-gray-500 mt-1">
                  {isTamil ? 'பல படங்களை தேர்ந்தெடுக்கலாம்' : 'You can select multiple images'}
                </p>

                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                  <div className="mt-4 grid grid-cols-4 gap-2">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Delivery Settings Section */}
            <div className="md:col-span-2 border-t pt-6 mt-4">
              <h3 className="text-lg font-semibold mb-4">{t.deliverySettings}</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Delivery Available */}
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="delivery_available"
                      checked={formData.delivery_available}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    {t.deliveryAvailable}
                  </label>
                </div>

                {/* Pickup Available */}
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="pickup_available"
                      checked={formData.pickup_available}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    {t.pickupAvailable}
                  </label>
                </div>

                {/* Pickup Address - Only show if pickup is available */}
                {formData.pickup_available && (
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 mb-2">{t.pickupAddress}</label>
                    <textarea
                      name="farm_pickup_address"
                      value={formData.farm_pickup_address || ''}
                      onChange={handleInputChange}
                      rows={2}
                      className="input-field"
                      placeholder={isTamil ? 'உங்கள் பண்ணை முகவரியை உள்ளிடவும்' : 'Enter your farm address'}
                    />
                  </div>
                )}

                {/* Delivery Settings - Only show if delivery is available */}
                {formData.delivery_available && (
                  <>
                    {/* Delivery Fee (paid by customer) */}
                    <div>
                      <label className="block text-gray-700 mb-2">{t.deliveryFee}</label>
                      <input
                        type="number"
                        name="delivery_fee"
                        value={formData.delivery_fee}
                        onChange={handleInputChange}
                        min="0"
                        className="input-field"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {isTamil ? 'வாடிக்கையாளர் செலுத்தும் தொகை' : 'Amount paid by customer'}
                      </p>
                    </div>

                    {/* Free Delivery Minimum */}
                    <div>
                      <label className="block text-gray-700 mb-2">{t.freeDeliveryMin}</label>
                      <input
                        type="number"
                        name="free_delivery_min_amount"
                        value={formData.free_delivery_min_amount || ''}
                        onChange={handleInputChange}
                        min="0"
                        className="input-field"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {isTamil ? 'இதற்கு மேல் இலவச விநியோகம்' : 'Free delivery above this amount'}
                      </p>
                    </div>

                    {/* Delivery Partner Required */}
                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="delivery_partner_required"
                          checked={formData.delivery_partner_required}
                          onChange={handleInputChange}
                          className="mr-2"
                        />
                        {t.deliveryPartnerRequired}
                      </label>
                      <p className="text-xs text-gray-500 mt-1 ml-6">
                        {isTamil ? 'விநியோக கூட்டாளிக்கு கட்டணம் செலுத்தப்படும்' : 'Delivery partner will be paid for this'}
                      </p>
                    </div>

                    {/* Delivery Partner Commission - Only show if delivery partner required */}
                    {formData.delivery_partner_required && (
                      <div>
                        <label className="block text-gray-700 mb-2">{t.deliveryPartnerCommission}</label>
                        <input
                          type="number"
                          name="delivery_partner_commission"
                          value={formData.delivery_partner_commission || 30}
                          onChange={handleInputChange}
                          min="0"
                          max="100"
                          className="input-field"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          {isTamil ? 'விநியோக கூட்டாளிக்கு செல்லும் சதவீதம்' : 'Percentage that goes to delivery partner'}
                        </p>
                      </div>
                    )}

                    {/* Estimated Delivery Days */}
                    <div>
                      <label className="block text-gray-700 mb-2">{t.estDeliveryDays}</label>
                      <input
                        type="number"
                        name="estimated_delivery_days"
                        value={formData.estimated_delivery_days}
                        onChange={handleInputChange}
                        min="1"
                        className="input-field"
                      />
                    </div>

                    {/* Delivery Zones */}
                    <div className="md:col-span-2">
                      <label className="block text-gray-700 mb-2">{t.deliveryZones}</label>
                      <input
                        type="text"
                        value={formData.delivery_zones?.join(', ') || ''}
                        onChange={(e) => {
                          const zones = e.target.value.split(',').map(z => z.trim()).filter(z => z);
                          setFormData({ ...formData, delivery_zones: zones });
                        }}
                        className="input-field"
                        placeholder={t.zonePlaceholder}
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        {isTamil ? 'கமாவால் பிரிக்கவும் (எ.கா: சென்னை, கோயம்புத்தூர்)' : 'Separate with commas (e.g., Chennai, Coimbatore)'}
                      </p>
                    </div>
                  </>
                )}

                {/* If neither delivery nor pickup is available, show warning */}
                {!formData.delivery_available && !formData.pickup_available && (
                  <div className="md:col-span-2 bg-yellow-50 p-4 rounded-lg">
                    <p className="text-yellow-800 text-sm">
                      ⚠️ {isTamil
                        ? 'எச்சரிக்கை: விநியோகமோ அல்லது பண்ணையில் எடுத்துச் செல்லலோ இல்லை. வாடிக்கையாளர்கள் இந்த பொருளை வாங்க முடியாது!'
                        : 'Warning: No delivery or pickup available. Customers cannot purchase this product!'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary px-8"
              >
                {submitting
                  ? (editingProduct ? t.updating : t.saving)
                  : (editingProduct ? t.edit : t.save)
                }
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="btn-secondary px-8"
              >
                {t.cancel}
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
              <th className="px-4 py-3 text-left">{t.product}</th>
              <th className="px-4 py-3 text-left">{t.categoryCol}</th>
              <th className="px-4 py-3 text-left">{t.priceCol}</th>
              <th className="px-4 py-3 text-left">{t.stock}</th>
              <th className="px-4 py-3 text-left">{t.status}</th>
              <th className="px-4 py-3 text-left">{t.actions}</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center">
                    <img
                      src={product.images && product.images[0] ? product.images[0] : PLACEHOLDER_IMAGE}
                      alt={getProductName(product)}
                      className="w-10 h-10 object-cover rounded mr-3"
                      onError={(e) => {
                        // If image fails to load, replace with placeholder
                        e.currentTarget.src = PLACEHOLDER_IMAGE;
                      }}
                    />
                    <div>
                      <p className="font-medium">{getProductName(product)}</p>
                      <p className="text-xs text-gray-500">{product.name_en}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">{product.category_name}</td>
                <td className="px-4 py-3">₹{product.price_per_unit}/{getUnitText(product.unit)}</td>
                <td className="px-4 py-3">
                  <span className={product.available_quantity > 10 ? 'text-green-600' : 'text-orange-600'}>
                    {product.available_quantity} {getUnitText(product.unit)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleToggleActive(product)}
                    className={`px-2 py-1 rounded-full text-xs ${product.is_active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                      }`}
                  >
                    {product.is_active ? t.active : t.inactive}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      {t.edit}
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      {t.delete}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  {t.noProducts}
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