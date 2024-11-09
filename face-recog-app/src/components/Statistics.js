// src/components/Statistics.js

import React, { useEffect, useState } from 'react';
import { Bar, Pie, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
} from 'chart.js';
import { MoonIcon, SunIcon } from '@heroicons/react/outline';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

const Statistics = () => {
  const [statistics, setStatistics] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [timeRange, setTimeRange] = useState('monthly');

  useEffect(() => {
    const fetchStatistics = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:8001/get_statistics?range=${timeRange}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch statistics');
        }

        const data = await response.json();
        setStatistics(data.statistics);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [timeRange]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const userFaceData = {
    labels: ['Total Users', 'Total Faces'],
    datasets: [
      {
        label: 'Count',
        data: [statistics?.total_users || 0, statistics?.total_faces || 0],
        backgroundColor: darkMode
          ? ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)']
          : ['rgba(75, 192, 192, 0.6)', 'rgba(153, 102, 255, 0.6)'],
        borderColor: darkMode
          ? ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)']
          : ['rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)'],
        borderWidth: 1,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const genderData = {
    labels: ['Male', 'Female'],
    datasets: [
      {
        label: 'Gender Distribution',
        data: [statistics?.gender_distribution?.male || 0, statistics?.gender_distribution?.female || 0],
        backgroundColor: ['#36A2EB', '#FF6384'],
      },
    ],
  };

  const statusData = {
    labels: Object.keys(statistics?.status_counts || {}),
    datasets: [
      {
        label: 'Status Summary',
        data: Object.values(statistics?.status_counts || {}),
        backgroundColor: ['#FFCE56', '#FF6384', '#36A2EB', '#4BC0C0'],
      },
    ],
  };

  const nationalityData = {
    labels: Object.keys(statistics?.nationality_counts || {}),
    datasets: [
      {
        label: 'Nationality Distribution',
        data: Object.values(statistics?.nationality_counts || {}),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
        ],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Statistics Overview - ${timeRange.toUpperCase()}`,
      },
    },
  };

  return (
    <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-r from-indigo-50 to-white'} container mx-auto p-8 md:p-12 lg:p-16 min-h-screen overflow-hidden rounded-xl shadow-xl transition-all duration-300`}>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-center">Statistics Dashboard</h1>
        <div className="flex space-x-4 items-center">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-lg px-4 py-2 shadow-md hover:shadow-lg transition duration-200"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
          <button
            onClick={toggleDarkMode}
            className="flex items-center justify-center w-10 h-10 p-2 rounded-full transition bg-indigo-200 dark:bg-gray-800 shadow-md hover:scale-105"
          >
            {darkMode ? <SunIcon className="w-6 h-6 text-yellow-500" /> : <MoonIcon className="w-6 h-6 text-indigo-700" />}
          </button>
        </div>
      </div>
      {loading ? (
        <div className="flex flex-col justify-center items-center h-full">
          <div className="w-16 h-16 border-4 border-indigo-500 border-dashed rounded-full animate-spin mb-4"></div>
          <p className="text-indigo-500">Loading data, please wait...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 text-red-800 p-4 rounded-lg shadow-md text-center">
          <p className="font-semibold mb-2">Error: {error}</p>
          <button
            onClick={() => setTimeRange(timeRange)}
            className="bg-indigo-500 text-white rounded-lg px-4 py-2 shadow hover:bg-indigo-600 transition"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="relative flex items-center justify-center bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105 hover:shadow-2xl">
            <div className="w-full h-[300px] md:h-[400px]">
              <Bar data={userFaceData} options={chartOptions} />
            </div>
          </div>
          <div className="relative flex items-center justify-center bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105 hover:shadow-2xl">
            <div className="w-full h-[300px] md:h-[400px]">
              <Pie data={genderData} options={chartOptions} />
            </div>
          </div>
          <div className="relative flex items-center justify-center bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105 hover:shadow-2xl">
            <div className="w-full h-[300px] md:h-[400px]">
              <Doughnut data={statusData} options={chartOptions} />
            </div>
          </div>
          <div className="relative flex items-center justify-center bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105 hover:shadow-2xl">
            <div className="w-full h-[300px] md:h-[400px]">
              <Pie data={nationalityData} options={chartOptions} />
            </div>
          </div>

          <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-indigo-100 dark:bg-gray-700 rounded-lg p-6 shadow-lg flex flex-col items-center transition-transform transform hover:scale-105 hover:shadow-2xl">
            <h2 className="text-xl md:text-2xl font-bold text-indigo-800 dark:text-indigo-200 mb-4">Summary</h2>
            <ul className="w-full max-w-md mx-auto space-y-4 text-indigo-900 dark:text-indigo-200 text-lg">
              <li className="flex justify-between">
                <span className="font-medium">Total Users:</span> {statistics.total_users}
              </li>
              <li className="flex justify-between">
                <span className="font-medium">Total Faces:</span> {statistics.total_faces}
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Statistics;
