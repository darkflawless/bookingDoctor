import React, { useState, useEffect } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { FaUserMd, FaUser, FaCalendarCheck, FaMoneyBillWave, FaStar } from 'react-icons/fa';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';


// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Statistics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { backendURL, aToken } = useContext(AdminContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(backendURL + '/api/admin/get-stat-data', { headers: { aToken } });
        if (response.data.success) {
          setStats(response.data);
        } else {
          setError('Failed to fetch statistics');
        }
      } catch {
        setError('Error fetching statistics');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="p-4 text-center">Loading statistics...</div>;
  if (error) return <div className="p-4 text-center text-red-600">{error}</div>;
  if (!stats) return null;

  // Prepare data for earnings by month chart
  const earningsLabels = stats.earningsByMonth.map(item => {
    const month = item._id.month.toString().padStart(2, '0');
    return `${month}/${item._id.year}`;
  });
  const earningsData = stats.earningsByMonth.map(item => item.totalEarning);

  const earningsChartData = {
    labels: earningsLabels,
    datasets: [
      {
        label: 'Earnings',
        data: earningsData,
        backgroundColor: 'rgba(34, 197, 94, 0.6)', // green
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1,
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const earningsChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Earnings by Month' },
    },
  };

  // Prepare data for rating doughnut chart
  const ratingChartData = {
    labels: ['Average Rating', 'Remaining'],
    datasets: [
      {
        label: 'Rating',
        data: [parseFloat(stats.ratingStats.averageRating), 5 - parseFloat(stats.ratingStats.averageRating)],
        backgroundColor: ['#facc15', '#e5e7eb'], // yellow and gray
        hoverOffset: 4,
      },
    ],
  };



  const ratingChartOptions = {
    responsive: true,
    cutout: '70%',
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Average Rating' },
    },
  };

  // Prepare data for appointment cancellation doughnut chart
  const cancellationChartData = {
    labels: ['Cancelled', 'Completed'],
    datasets: [
      {
        label: 'Appointments',
        data: [parseFloat(stats.avgDelete * 100), 100 - parseFloat(stats.avgDelete * 100)],
        backgroundColor: ['#ef4444', '#60a5fa'], // red for cancelled, blue for completed
        hoverOffset: 4,
      },
    ],
  };

  const cancellationChartOptions = {
    responsive: true,
    cutout: '70%',
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Appointment Cancellation Rate' },
    },
  };



  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Admin Statistics</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div onClick={()=> navigate('/user-list') } className="flex items-center bg-green-100 p-4 rounded-lg shadow">
          <FaUserMd className="text-green-600 text-3xl mr-4" />
          <div >
            <p className="text-lg font-semibold">Users</p>
            <p className="text-2xl font-bold">{stats.userCount}</p>
          </div>
        </div>
        <div onClick={()=> navigate('/all-appointments') } className="flex items-center bg-blue-100 p-4 rounded-lg shadow">
          <FaCalendarCheck className="text-blue-600 text-3xl mr-4" />
          <div>
            <p className="text-lg font-semibold">Appointments</p>
            <p className="text-2xl font-bold">{stats.totalAppointments}</p>
          </div>
        </div>
        <div className="flex items-center bg-yellow-100 p-4 rounded-lg shadow">
          <FaMoneyBillWave className="text-yellow-600 text-3xl mr-4" />
          <div>
            <p className="text-lg font-semibold">Total Earnings</p>
            <p className="text-2xl font-bold">${stats.totalEarnings}</p>
          </div>
        </div>
        <div className="flex items-center bg-purple-100 p-4 rounded-lg shadow">
          <FaStar className="text-purple-600 text-3xl mr-4" />
          <div>
            <p className="text-lg font-semibold">Average Rating</p>
            <p className="text-2xl font-bold">{stats.ratingStats.averageRating}</p>
            <p className="text-sm text-gray-600">{stats.ratingStats.ratingCount} ratings</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="max-w-xs mx-auto">
          <Doughnut data={ratingChartData} options={ratingChartOptions} />
        </div>
        <div className="max-w-xs mx-auto">
          <Doughnut data={cancellationChartData} options={cancellationChartOptions} />
        </div>
      </div>
      <div className="mb-8">
        <Bar data={earningsChartData} options={earningsChartOptions} />
      </div>


    </div>
  );
};

export default Statistics;
