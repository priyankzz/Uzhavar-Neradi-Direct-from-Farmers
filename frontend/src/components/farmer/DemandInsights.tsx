/**
 * Demand Insights Component
 * Copy to: frontend/src/components/farmer/DemandInsights.tsx
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLanguage } from '../../hooks/useLanguage';
import LoadingSpinner from '../common/LoadingSpinner';

interface DemandInsight {
  id: number;
  product_category: number;
  category_name: string;
  insight_date: string;
  predicted_demand: number;
  confidence_score: number;
  seasonal_factor: number;
  festival_factor: number;
  historical_trend: number;
  suggested_price: number;
  suggested_quantity: number;
  recommendation_text: string;
}

interface Prediction {
  product_id: number;
  product_name: string;
  current_price: number;
  suggested_price: number;
  next_week: {
    date: string;
    predicted_demand: number;
    confidence: number;
  }[];
  monthly_trend: string;
  risk_level: string;
}

interface Product {
  id: number;
  name_en: string;
  name_ta: string;
}

const DemandInsights: React.FC = () => {
  const [insights, setInsights] = useState<DemandInsight[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'insights' | 'predictions'>('insights');

  const { language, t } = useLanguage();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [insightsRes, predictionsRes, productsRes] = await Promise.all([
        axios.get('http://localhost:8000/api/analytics/demand-insights/', {
          headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` }
        }),
        axios.get('http://localhost:8000/api/analytics/predictions/', {
          headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` }
        }),
        axios.get('http://localhost:8000/api/products/', {
          params: { farmer: 'me' },
          headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` }
        })
      ]);

      setInsights(insightsRes.data.results || insightsRes.data);
      setPredictions(predictionsRes.data);
      setProducts(productsRes.data.results || productsRes.data);
    } catch (error) {
      console.error('Failed to fetch insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRiskColor = (risk: string) => {
    const colors: { [key: string]: string } = {
      'low': 'text-green-600',
      'medium': 'text-yellow-600',
      'high': 'text-red-600'
    };
    return colors[risk] || 'text-gray-600';
  };

  const getTrendIcon = (trend: string) => {
    const icons: { [key: string]: string } = {
      'increasing': '📈',
      'stable': '📊',
      'decreasing': '📉'
    };
    return icons[trend] || '📊';
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Demant & Analytics</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab('insights')}
          className={`px-4 py-2 rounded-lg transition ${
            activeTab === 'insights'
              ? 'bg-green-600 text-white'
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          Demand Insights
        </button>
        <button
          onClick={() => setActiveTab('predictions')}
          className={`px-4 py-2 rounded-lg transition ${
            activeTab === 'predictions'
              ? 'bg-green-600 text-white'
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          AI Predictions
        </button>
      </div>

      {activeTab === 'insights' ? (
        /* Demand Insights Tab */
        <div className="space-y-6">
          {insights.length > 0 ? (
            insights.map((insight) => (
              <div key={insight.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-semibold">{insight.category_name}</h2>
                    <p className="text-sm text-gray-500">
                      Analysis for {new Date(insight.insight_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`font-bold ${getConfidenceColor(insight.confidence_score)}`}>
                      {(insight.confidence_score * 100).toFixed(0)}% confidence
                    </span>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-600 mb-1">Predicted Demand</p>
                    <p className="text-2xl font-bold text-blue-800">
                      {insight.predicted_demand.toFixed(0)} kg
                    </p>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-green-600 mb-1">Suggested Price</p>
                    <p className="text-2xl font-bold text-green-800">
                      ₹{insight.suggested_price?.toFixed(2) || 'N/A'}
                    </p>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm text-purple-600 mb-1">Suggested Quantity</p>
                    <p className="text-2xl font-bold text-purple-800">
                      {insight.suggested_quantity?.toFixed(0) || 'N/A'} kg
                    </p>
                  </div>
                </div>

                {/* Factors */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-500">Seasonal Factor</p>
                    <div className="flex items-center">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full mr-2">
                        <div 
                          className="h-2 bg-blue-500 rounded-full"
                          style={{ width: `${insight.seasonal_factor * 100}%` }}
                        />
                      </div>
                      <span className="text-sm">{(insight.seasonal_factor * 100).toFixed(0)}%</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Festival Impact</p>
                    <div className="flex items-center">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full mr-2">
                        <div 
                          className="h-2 bg-orange-500 rounded-full"
                          style={{ width: `${insight.festival_factor * 100}%` }}
                        />
                      </div>
                      <span className="text-sm">{(insight.festival_factor * 100).toFixed(0)}%</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Historical Trend</p>
                    <p className="font-medium">{insight.historical_trend.toFixed(0)} kg/day</p>
                  </div>
                </div>

                {/* Recommendation */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="font-semibold text-green-800 mb-1">Recommendation</p>
                  <p className="text-green-700">{insight.recommendation_text}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
              <p className="text-4xl mb-4">📊</p>
              <p>No insights available yet. Start selling to get personalized recommendations!</p>
            </div>
          )}
        </div>
      ) : (
        /* AI Predictions Tab */
        <div className="space-y-6">
          {/* Product Selector */}
          <div className="bg-white rounded-lg shadow p-4">
            <select
              value={selectedProduct || ''}
              onChange={(e) => setSelectedProduct(e.target.value ? Number(e.target.value) : null)}
              className="input-field"
            >
              <option value="">All Products</option>
              {products.map(product => (
                <option key={product.id} value={product.id}>
                  {language === 'ta' ? product.name_ta : product.name_en}
                </option>
              ))}
            </select>
          </div>

          {/* Predictions */}
          {predictions
            .filter(p => !selectedProduct || p.product_id === selectedProduct)
            .map((prediction) => (
              <div key={prediction.product_id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-semibold">{prediction.product_name}</h2>
                    <p className="text-sm text-gray-500">
                      Current Price: ₹{prediction.current_price}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Suggested Price</p>
                    <p className="text-lg font-bold text-green-600">
                      ₹{prediction.suggested_price.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Trend and Risk */}
                <div className="flex gap-4 mb-6">
                  <div className="flex-1 bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Monthly Trend</p>
                    <p className="text-lg">
                      {getTrendIcon(prediction.monthly_trend)} {prediction.monthly_trend}
                    </p>
                  </div>
                  <div className="flex-1 bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Risk Level</p>
                    <p className={`text-lg font-medium ${getRiskColor(prediction.risk_level)}`}>
                      {prediction.risk_level.toUpperCase()}
                    </p>
                  </div>
                </div>

                {/* Weekly Predictions */}
                <h3 className="font-semibold mb-3">Next 7 Days Forecast</h3>
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {prediction.next_week.map((day, index) => (
                    <div key={index} className="text-center">
                      <p className="text-xs text-gray-500">
                        {new Date(day.date).toLocaleDateString('en-IN', { weekday: 'short' })}
                      </p>
                      <p className="font-bold text-sm mt-1">{day.predicted_demand.toFixed(0)}</p>
                      <p className={`text-xs ${getConfidenceColor(day.confidence)}`}>
                        {(day.confidence * 100).toFixed(0)}%
                      </p>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-4 pt-4 border-t">
                  <button className="btn-primary text-sm">
                    Apply Suggested Price
                  </button>
                  <button className="btn-secondary text-sm">
                    View Detailed Report
                  </button>
                </div>
              </div>
            ))}

          {predictions.length === 0 && (
            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
              <p className="text-4xl mb-4">🤖</p>
              <p>No predictions available. We're training our AI models to give you better insights!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DemandInsights;