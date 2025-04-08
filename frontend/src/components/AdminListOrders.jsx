import axios from 'axios';
import { useState } from 'react';
import { format } from 'date-fns';
import toast from "react-hot-toast";
import { Check, X } from 'lucide-react';

const AdminListOrders = ({ orders, fetchEvents, token }) => {
    const [loadingId, setLoadingId] = useState(null);

    const handleApprove = async (orderId) => {
        const url = `/api/orders/approve/${orderId}`;
        setLoadingId(url);
        try {
            await axios.put(url, null, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchEvents();
            toast.success('Pesanan disetujui!');
        } catch (err) {
            console.error('Gagal menyetujui:', err);
            toast.error('Pesanan gagal disetujui!');
        } finally {
            setLoadingId(null);
        }
    };

    const handleReject = async (orderId) => {
        const url = `/api/orders/reject/${orderId}`;
        setLoadingId(url);
        try {
            await axios.put(url, null, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchEvents();
            toast.success('Pesanan ditolak!');
        } catch (err) {
            console.error('Gagal menolak:', err);
            toast.error('Pesanan gagal ditolak!');
        } finally {
            setLoadingId(null);
        }
    };

    const handleSoftDelete = async (orderId) => {
        const url = `/api/orders/${orderId}/soft-delete`;
        setLoadingId(url);
        try {
            await axios.put(url, null, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchEvents();
            toast.success('Pesanan dipindahkan ke sampah!');
        } catch (err) {
            console.error('Gagal menghapus:', err);
            toast.error('Pesanan gagal dipindahkan!');
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="h-12 bg-white text-gray-600 text-sm font-semibold">
            <tr>
                <th className="py-2 px-4 text-left">Nama Event</th>
                <th className="py-2 px-4 text-left">Category</th>
                <th className="py-2 px-4 text-left">Harga</th>
                <th className="py-2 px-4 text-left">User</th>
                <th className="py-2 px-4 text-left">Tanggal</th>
                <th className="py-2 px-4 text-left">Status</th>
                <th className="py-2 px-4 text-left">Action</th>
            </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm">
            {orders.map((order) => (
                <tr key={order.order_id} className="hover:bg-gray-50">
                    <td className="py-2 px-4">{order.event_name}</td>
                    <td className="py-2 px-4 capitalize">{order.event_category}</td>
                    <td className="py-2 px-4">
                        {order.ticket_category.toUpperCase()} <span className="text-gray-500">({Number(order.ticket_price).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })})</span>
                    </td>
                    <td className="py-2 px-4">{order.user_email}</td>
                    <td className="py-2 px-4">{format(new Date(order.order_date), 'dd/MM/yyyy')}</td>
                    <td className="py-2 px-4">
                        {order.status === 'pending' ? (
                            <div className="flex gap-1">
                                <button
                                    onClick={() => handleApprove(order.order_id)}
                                    disabled={loadingId === `/api/orders/approve/${order.order_id}`}
                                    className="bg-green-400 cursor-pointer p-1 rounded-lg text-white hover:text-white"
                                >
                                    <Check size={18} />
                                </button>
                                <button
                                    onClick={() => handleReject(order.order_id)}
                                    disabled={loadingId === `/api/orders/reject/${order.order_id}`}
                                    className="bg-red-400 cursor-pointer p-1 rounded-lg text-white hover:text-white"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        ) : (
                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${order.status === 'approved' ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                        )}
                    </td>
                    <td className="py-2 px-4">
                        <button
                            onClick={() => handleSoftDelete(order.order_id)}
                            disabled={loadingId === `/api/orders/${order.order_id}/soft-delete`}
                            className="px-3 py-1 cursor-pointer rounded-md   hover:bg-white border border-gray-200 text-sm"
                        >
                            Move to Trash
                        </button>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
};

export default AdminListOrders;
