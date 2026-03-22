import React, { useEffect, useState } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import api from '../services/api';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const PredictionsChart = () => {
  const [barData, setBarData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    api.get('/predictions/charts/').then(res => {
      setBarData(res.data.bar_chart.labels.map((label, i) => ({
        name: label,
        value: res.data.bar_chart.values[i]
      })));
      setPieData(res.data.pie_chart.labels.map((label, i) => ({
        name: label,
        value: res.data.pie_chart.values[i]
      })));
      setRecommendations(res.data.recommendations);
    });
  }, []);

  return (
    <div>
      <h2>AI Predictions</h2>
      <div style={{ display: 'flex' }}>
        <BarChart width={400} height={300} data={barData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
        <PieChart width={400} height={300}>
          <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value" label>
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>
      <div>
        <h3>Recommendations</h3>
        <ul>
          {recommendations.map((rec, idx) => <li key={idx}>{rec}</li>)}
        </ul>
      </div>
    </div>
  );
};

export default PredictionsChart;