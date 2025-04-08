import { useEffect, useState } from 'react';
import axios from 'axios';

const AdminStats = ({token}) => {
    const [stats, setStats] = useState({
        completedOrders: 0,
        totalUsers: 0,
        totalEvents: 0,
    });

    const fetchStats = async () => {
        try {

            const [ordersRes, usersRes, eventsRes] = await Promise.all([
                axios.get('/api/orders/stats/completed-orders', {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get('/api/orders/stats/total-users', {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get('/api/orders/stats/total-events', {
                    headers: { Authorization: `Bearer ${token}` }
                }),
            ]);


            setStats({
                completedOrders: ordersRes.data.totalCompletedOrders || 0,
                totalUsers: usersRes.data.totalUsers || 0,
                totalEvents: eventsRes.data.totalEvents || 0,
            });
        } catch (error) {
            console.error('Gagal mengambil data statistik:', error);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-gray-500 text-sm font-medium mb-2">Total Order Approved</h3>
                <p className="text-3xl font-bold text-green-600">{stats.completedOrders}</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-gray-500 text-sm font-medium mb-2">Total Users</h3>
                <p className="text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-gray-500 text-sm font-medium mb-2">Total Events</h3>
                <p className="text-3xl font-bold text-orange-500">{stats.totalEvents}</p>
            </div>
        </div>
    );
};

export default AdminStats;
