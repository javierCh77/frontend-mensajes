import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const WebsiteViewsChart = () => {
  const data = {
    labels: ['L', 'M', 'X', 'J', 'V', 'S', 'D'],
    datasets: [
      {
        label: 'Vistas',
        data: [15, 28, 35, 20, 45, 50, 30],
        backgroundColor: 'rgba(54, 162, 235, 0.8)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default WebsiteViewsChart;