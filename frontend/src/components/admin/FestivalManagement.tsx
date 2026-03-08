/**
 * Festival Management Component
 * Copy to: frontend/src/components/admin/FestivalManagement.tsx
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLanguage } from '../../hooks/useLanguage';
import LoadingSpinner from '../common/LoadingSpinner';

interface Festival {
    id: number;
    name: string;
    name_ta: string;
    date: string;
    end_date: string | null;
    region: string;
    impact_days_before: number;
    impact_days_after: number;
    demand_multiplier: number;
    affected_categories: number[];
    affected_categories_details?: Array<{ id: number, name: string }>;
}

interface Category {
    id: number;
    name_en: string;
    name_ta: string;
}

const FestivalManagement: React.FC = () => {
    const [festivals, setFestivals] = useState<Festival[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingFestival, setEditingFestival] = useState<Festival | null>(null);
    const [formData, setFormData] = useState<Partial<Festival>>({
        name: '',
        name_ta: '',
        date: '',
        end_date: '',
        region: '',
        impact_days_before: 7,
        impact_days_after: 3,
        demand_multiplier: 1.5,
        affected_categories: []
    });

    useEffect(() => {
        Promise.all([fetchFestivals(), fetchCategories()]).then(() => setLoading(false));
    }, []);

    const fetchFestivals = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/admin/festivals/', {
                headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` }
            });
            setFestivals(response.data);
        } catch (error) {
            console.error('Failed to fetch festivals:', error);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/products/categories/');
            setCategories(response.data.results || response.data);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'number' ? parseFloat(value) : value
        });
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selected = Array.from(e.target.selectedOptions, option => parseInt(option.value));
        setFormData({ ...formData, affected_categories: selected });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (editingFestival) {
                await axios.put(
                    `http://localhost:8000/api/admin/festivals/${editingFestival.id}/`,
                    formData,
                    {
                        headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` }
                    }
                );
            } else {
                await axios.post(
                    'http://localhost:8000/api/admin/festivals/',
                    formData,
                    {
                        headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` }
                    }
                );
            }

            fetchFestivals();
            resetForm();
        } catch (error) {
            console.error('Failed to save festival:', error);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this festival?')) return;

        try {
            await axios.delete(`http://localhost:8000/api/admin/festivals/${id}/`, {
                headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` }
            });
            fetchFestivals();
        } catch (error) {
            console.error('Failed to delete festival:', error);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            name_ta: '',
            date: '',
            end_date: '',
            region: '',
            impact_days_before: 7,
            impact_days_after: 3,
            demand_multiplier: 1.5,
            affected_categories: []
        });
        setEditingFestival(null);
        setShowForm(false);
    };

    if (loading) return <LoadingSpinner fullScreen />;

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Festival Management</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="btn-primary"
                >
                    {showForm ? 'Cancel' : '+ Add Festival'}
                </button>
            </div>

            {showForm && (
                <div className="bg-white rounded-lg shadow p-6 mb-8">
                    <h2 className="text-xl font-semibold mb-4">
                        {editingFestival ? 'Edit Festival' : 'Add New Festival'}
                    </h2>

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700 mb-2">Name (English) *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="input-field"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-2">Name (Tamil)</label>
                                <input
                                    type="text"
                                    name="name_ta"
                                    value={formData.name_ta}
                                    onChange={handleInputChange}
                                    className="input-field"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-2">Start Date *</label>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleInputChange}
                                    className="input-field"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-2">End Date</label>
                                <input
                                    type="date"
                                    name="end_date"
                                    value={formData.end_date || ''}
                                    onChange={handleInputChange}
                                    className="input-field"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-2">Region</label>
                                <input
                                    type="text"
                                    name="region"
                                    value={formData.region}
                                    onChange={handleInputChange}
                                    placeholder="Tamil Nadu (leave empty for all)"
                                    className="input-field"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-2">Demand Multiplier</label>
                                <input
                                    type="number"
                                    name="demand_multiplier"
                                    step="0.1"
                                    min="1"
                                    max="3"
                                    value={formData.demand_multiplier}
                                    onChange={handleInputChange}
                                    className="input-field"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-2">Impact Days Before</label>
                                <input
                                    type="number"
                                    name="impact_days_before"
                                    min="0"
                                    max="30"
                                    value={formData.impact_days_before}
                                    onChange={handleInputChange}
                                    className="input-field"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-2">Impact Days After</label>
                                <input
                                    type="number"
                                    name="impact_days_after"
                                    min="0"
                                    max="30"
                                    value={formData.impact_days_after}
                                    onChange={handleInputChange}
                                    className="input-field"
                                />
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="block text-gray-700 mb-2">Affected Categories</label>
                            <select
                                multiple
                                value={formData.affected_categories?.map(String)}
                                onChange={handleCategoryChange}
                                className="input-field h-32"
                            >
                                {Array.isArray(categories) && categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name_en} - {cat.name_ta}
                                    </option>
                                ))}
                            </select>
                            <p className="text-sm text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
                        </div>

                        <div className="flex gap-4 mt-6">
                            <button type="submit" className="btn-primary px-8">
                                {editingFestival ? 'Update' : 'Create'}
                            </button>
                            <button type="button" onClick={resetForm} className="btn-secondary px-8">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left">Festival</th>
                            <th className="px-4 py-3 text-left">Tamil Name</th>
                            <th className="px-4 py-3 text-left">Date</th>
                            <th className="px-4 py-3 text-left">Region</th>
                            <th className="px-4 py-3 text-left">Multiplier</th>
                            <th className="px-4 py-3 text-left">Impact</th>
                            <th className="px-4 py-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {festivals.map(festival => (
                            <tr key={festival.id} className="border-t hover:bg-gray-50">
                                <td className="px-4 py-3 font-medium">{festival.name}</td>
                                <td className="px-4 py-3">{festival.name_ta}</td>
                                <td className="px-4 py-3">
                                    {new Date(festival.date).toLocaleDateString()}
                                    {festival.end_date && ` - ${new Date(festival.end_date).toLocaleDateString()}`}
                                </td>
                                <td className="px-4 py-3">{festival.region || 'All'}</td>
                                <td className="px-4 py-3">{festival.demand_multiplier}x</td>
                                <td className="px-4 py-3">
                                    {festival.impact_days_before}d before, {festival.impact_days_after}d after
                                </td>
                                <td className="px-4 py-3">
                                    <button
                                        onClick={() => {
                                            setEditingFestival(festival);
                                            setFormData({
                                                ...festival,
                                                affected_categories: festival.affected_categories
                                            });
                                            setShowForm(true);
                                        }}
                                        className="text-blue-600 hover:text-blue-800 mr-3"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(festival.id)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FestivalManagement;