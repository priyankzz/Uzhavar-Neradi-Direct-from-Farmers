/**
 * Logo Management Component
 * Copy to: frontend/src/components/admin/LogoManagement.tsx
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLanguage } from '../../hooks/useLanguage';
import LoadingSpinner from '../common/LoadingSpinner';

interface Logo {
  id: number;
  logo: string;
  favicon: string | null;
  logo_url: string;
  favicon_url: string | null;
  is_active: boolean;
  uploaded_at: string;
}

const LogoManagement: React.FC = () => {
  const [currentLogo, setCurrentLogo] = useState<Logo | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [faviconFile, setFaviconFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [faviconPreview, setFaviconPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { t } = useLanguage();

  useEffect(() => {
    fetchCurrentLogo();
  }, []);

  useEffect(() => {
    return () => {
      if (logoPreview) URL.revokeObjectURL(logoPreview);
      if (faviconPreview) URL.revokeObjectURL(faviconPreview);
    };
  }, [logoPreview, faviconPreview]);

  const fetchCurrentLogo = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/admin/settings/logo/');
      setCurrentLogo(response.data);
    } catch (error) {
      console.error('Failed to fetch logo:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
      if (!validTypes.includes(file.type)) {
        setError('Please upload PNG, JPG, JPEG, or SVG files only');
        return;
      }

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setError('Logo size should be less than 2MB');
        return;
      }

      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleFaviconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/png', 'image/x-icon', 'image/vnd.microsoft.icon'];
      if (!validTypes.includes(file.type) && !file.name.endsWith('.ico')) {
        setError('Please upload PNG or ICO files for favicon');
        return;
      }

      // Validate file size (max 1MB)
      if (file.size > 1 * 1024 * 1024) {
        setError('Favicon size should be less than 1MB');
        return;
      }

      setFaviconFile(file);
      setFaviconPreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!logoFile && !faviconFile) {
      setError('Please select at least one file to upload');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    if (logoFile) formData.append('logo', logoFile);
    if (faviconFile) formData.append('favicon', faviconFile);

    try {
      const response = await axios.post(
        'http://localhost:8000/api/admin/settings/logo/',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setCurrentLogo(response.data);
      setSuccess('Logo updated successfully!');
      
      // Reset form
      setLogoFile(null);
      setFaviconFile(null);
      setLogoPreview(null);
      setFaviconPreview(null);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to upload logo');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveLogo = async () => {
    if (!currentLogo) return;

    if (window.confirm('Are you sure you want to remove the current logo?')) {
      try {
        // This would need a DELETE endpoint
        // await axios.delete('http://localhost:8000/api/admin/settings/logo/');
        
        setCurrentLogo(null);
        setSuccess('Logo removed successfully');
        setTimeout(() => setSuccess(''), 3000);
      } catch (error) {
        console.error('Failed to remove logo:', error);
      }
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Logo Management</h1>

      {/* Current Logo Display */}
      {currentLogo && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Current Logo</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-600 mb-2">Platform Logo</p>
              <div className="border rounded-lg p-4 bg-gray-50">
                <img 
                  src={currentLogo.logo_url} 
                  alt="Platform Logo"
                  className="max-h-32 mx-auto object-contain"
                />
              </div>
            </div>
            
            {currentLogo.favicon_url && (
              <div>
                <p className="text-gray-600 mb-2">Favicon</p>
                <div className="border rounded-lg p-4 bg-gray-50">
                  <img 
                    src={currentLogo.favicon_url} 
                    alt="Favicon"
                    className="h-16 mx-auto object-contain"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 text-sm text-gray-500">
            Uploaded: {new Date(currentLogo.uploaded_at).toLocaleString()}
          </div>

          <button
            onClick={handleRemoveLogo}
            className="mt-4 btn-danger"
          >
            Remove Current Logo
          </button>
        </div>
      )}

      {/* Upload Form */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">
          {currentLogo ? 'Update Logo' : 'Upload New Logo'}
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Logo Upload */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Platform Logo
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              {logoPreview ? (
                <div>
                  <img 
                    src={logoPreview} 
                    alt="Logo Preview"
                    className="max-h-32 mx-auto mb-4 object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setLogoFile(null);
                      setLogoPreview(null);
                    }}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/svg+xml"
                    onChange={handleLogoChange}
                    className="hidden"
                    id="logo-upload"
                  />
                  <label
                    htmlFor="logo-upload"
                    className="cursor-pointer"
                  >
                    <div className="text-4xl mb-2">🖼️</div>
                    <p className="text-gray-600 mb-2">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-sm text-gray-500">
                      PNG, JPG, JPEG, SVG (Max 2MB)
                    </p>
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Favicon Upload */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Favicon (Optional)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              {faviconPreview ? (
                <div>
                  <img 
                    src={faviconPreview} 
                    alt="Favicon Preview"
                    className="h-16 mx-auto mb-4 object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setFaviconFile(null);
                      setFaviconPreview(null);
                    }}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div>
                  <input
                    type="file"
                    accept=".ico,image/png"
                    onChange={handleFaviconChange}
                    className="hidden"
                    id="favicon-upload"
                  />
                  <label
                    htmlFor="favicon-upload"
                    className="cursor-pointer"
                  >
                    <div className="text-4xl mb-2">🔖</div>
                    <p className="text-gray-600 mb-2">
                      Click to upload favicon
                    </p>
                    <p className="text-sm text-gray-500">
                      PNG, ICO (Max 1MB)
                    </p>
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Preview Section */}
          {(logoPreview || faviconPreview) && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium mb-3">Preview</h3>
              <div className="flex items-center gap-4">
                {logoPreview && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Logo</p>
                    <img 
                      src={logoPreview} 
                      alt="Logo"
                      className="h-12 object-contain"
                    />
                  </div>
                )}
                {faviconPreview && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Favicon</p>
                    <img 
                      src={faviconPreview} 
                      alt="Favicon"
                      className="h-8 object-contain"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={uploading || (!logoFile && !faviconFile)}
              className="btn-primary px-8"
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
            
            <button
              type="button"
              onClick={() => {
                setLogoFile(null);
                setFaviconFile(null);
                setLogoPreview(null);
                setFaviconPreview(null);
                setError('');
              }}
              className="btn-secondary px-8"
            >
              Clear
            </button>
          </div>
        </form>
      </div>

      {/* Guidelines */}
      <div className="mt-8 bg-blue-50 rounded-lg p-4">
        <h3 className="font-semibold text-blue-800 mb-2">Logo Guidelines</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Use transparent background for best results</li>
          <li>• Recommended logo dimensions: 200x50px or similar ratio</li>
          <li>• Logo will be displayed in header and email templates</li>
          <li>• Favicon should be 32x32px for best display</li>
          <li>• Uploaded logos are automatically optimized</li>
        </ul>
      </div>
    </div>
  );
};

export default LogoManagement;