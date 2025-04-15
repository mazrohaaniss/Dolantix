import axios from 'axios';
import { useState } from 'react';
import { format } from 'date-fns';
import toast from "react-hot-toast";
import {Check, Trash2, X} from 'lucide-react';

const AdminListOrderSampah = ({fetchOrdersTrash, ordersTrash, token }) => {
    const [loadingId, setLoadingId] = useState(null);


    const handleApprove = async (orderId) => {
        const url = `/api/orders/approve/${orderId}`;
        setLoadingId(url);
        try {
            await axios.put(url, null, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchOrdersTrash();
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
            fetchOrdersTrash();
            toast.success('Pesanan ditolak!');
        } catch (err) {
            console.error('Gagal menolak:', err);
            toast.error('Pesanan gagal ditolak!');
        } finally {
            setLoadingId(null);
        }
    };

    const handleRestore = async (orderId) => {
        const url = `/api/orders/${orderId}/restore`;
        setLoadingId(url);
        try {
            await axios.put(url, null, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchOrdersTrash();
            toast.success('Pesanan berhasil dipulihkan!');
            setTimeout(() => {
                window.location.reload();
            }, 600);
        } catch (err) {
            console.error('Gagal memulihkan:', err);
            toast.error('Pesanan gagal dipulihkan!');
        } finally {
            setLoadingId(null);
        }
    };

    const handleDelete = async (orderId) => {
        const url = `/api/orders/${orderId}/hard-delete`;
        setLoadingId(url);
        try {
            await axios.delete(url, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchOrdersTrash();
            toast.success('Pesanan berhasil dihapus(hard-delete)!');
            setTimeout(() => {
                window.location.reload();
            }, 600);
        } catch (err) {
            console.error('Gagal memulihkan:', err);
            toast.error('Pesanan gagal dihapus (hard-delete)!');
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
            {ordersTrash.map((order) => (
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
                            onClick={() => handleRestore(order.order_id)}
                            disabled={loadingId === `/api/orders/${order.order_id}/restore`}
                            className="px-3 py-1 cursor-pointer rounded-md hover:bg-white border border-gray-200 text-sm"
                        >
                            Restore
                        </button>
                    </td>
                    <td className="py-2 px-4">
                        <button
                            onClick={() => handleDelete(order.order_id)}
                            disabled={loadingId === `/api/orders/${order.order_id}/restore`}
                            className="py-1 px-2 flex justify-center items-center text-white bg-red-400 hover:bg-red-500 border rounded-lg text-sm cursor-pointer "
                        >
                            <Trash2 className="w-4" />
                        </button>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}

export default AdminListOrderSampah;