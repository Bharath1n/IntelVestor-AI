import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ShapExplanation = ({ shap, explanation }) => {
  const chartData = {
    labels: shap.map(s => s.feature),
    datasets: [
      {
        label: 'Feature Contribution',
        data: shap.map(s => s.value),
        backgroundColor: 'rgba(75,192,192,0.6)'
      }
    ]
  };
  return (
    <div className="bg-gray-800 p-4 rounded-lg mt-4">
      <h3 className="text-white text-lg font-semibold">Prediction Drivers</h3>
      <Bar data={chartData} options={{ responsive: true, plugins: { legend: { labels: { color: 'white' } } } }} />
      <p className="text-white mt-2">{explanation}</p>
    </div>
  );
};

export default ShapExplanation;