import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../../components/navbar';
import AdminListOrder from '../../components/AdminListOrders.jsx';
import AdminListOrderSampah from '../../components/AdminListOrderSampah.jsx';
import AdminStats from '../../components/AdminStats.jsx';



const Dashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [ordersTrash, setOrdersTrash] = useState([]);
  const [activeTab, setActiveTab] = useState('list-order');
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  useEffect(() => {
    if (!token || role !== 'admin') {
      navigate('/');
    } else {
      fetchOrders();
      fetchOrdersTrash();
    }
  }, [navigate, token, role]);

  const fetchOrders = async () => {
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

  const fetchOrdersTrash = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`/api/orders/deleted`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrdersTrash(res.data);
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
        <AdminStats token={token} />
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
                onClick={() => setActiveTab('list-order')}
                className={`mr-6 py-4 px-1 ${
                    activeTab === 'list-order'
                        ? 'border-b-2 border-blue-500 text-blue-600 font-medium'
                        : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } transition-colors duration-200 cursor-pointer`}
            >
              List Order
            </button>
            <button
                onClick={() => setActiveTab('recycle-bin')}
                className={`mr-6 py-4 px-1 ${
                    activeTab === 'recycle-bin'
                        ? 'border-b-2 border-blue-500 text-blue-600 font-medium'
                        : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } transition-colors duration-200 cursor-pointer`}
            >
              Sampah
            </button>
          </nav>
        </div>
        <div className="bg-white rounded-lg shadow mb-8 overflow-hidden flex flex-col">
          {/* Form List Order */}
          {activeTab === 'list-order' && (
              <AdminListOrder orders={orders} fetchOrders={fetchOrders} token={token} />
          )}

          {/* Form List Sampah */}
          {activeTab === 'recycle-bin' && (
              <AdminListOrderSampah fetchOrdersTrash={fetchOrdersTrash} ordersTrash={ordersTrash} token={token} setOrdersTrash={setOrdersTrash} setIsLoading={setIsLoading} />
          )}

        </div>

      </div>
    </div>
  );
};

export default Dashboard;