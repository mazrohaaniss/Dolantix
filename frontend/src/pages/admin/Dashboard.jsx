import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../../components/navbar';
import AdminListOrder from '../../components/AdminListOrders.jsx';
import AdminStats from '../../components/AdminStats.jsx';

const Dashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  useEffect(() => {
    if (!token || role !== 'admin') {
      navigate('/');
    } else {
      fetchEvents();
    }
  }, [navigate, token, role]);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`/api/orders/admin`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err) {
      console.error('Failed to fetch orders:', err.response?.status, err.response?.data || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-gray-50  items-center justify-center">
      <Sidebar />
      <div className="flex-1 p-25">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-800">Dolantix Admin Dashboard</h1>
        </div>
        <AdminStats />

        <div className="bg-white rounded-lg shadow mb-8 overflow-hidden flex flex-col">
          <AdminListOrder orders={orders} fetchEvents={fetchEvents} token={token} />
          
        </div>

      </div>
    </div>
  );
};

export default Dashboard;