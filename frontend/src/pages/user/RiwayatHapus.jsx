import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import UserNavbar from "../../components/UserNavbar";
import axios from "axios";

const RiwayatHapus = () => {
  const navigate = useNavigate();
  const [deletedOrders, setDeletedOrders] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchDeletedOrders();
  }, []);

  const fetchDeletedOrders = async () => {
    try {
      const res = await axios.get("/api/orders/deleted", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeletedOrders(res.data);
    } catch (error) {
      console.error("Gagal mengambil riwayat hapus:", error);
    }
  };

  const handleUndo = async (order) => {
    if (!order || !order.id) {
      console.error("Error: Order tidak valid.");
      return;
    }
  
    try {
      await axios.put(`/api/orders/${order.id}/restore`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchDeletedOrders();
    } catch (error) {
      console.error("Gagal mengembalikan pesanan:", error);
    }
  };
  
  const handlePermanentDelete = async (order) => {
    if (!order || !order.id) {
      console.error("Error: Order tidak valid.");
      return;
    }
  
    try {
      await axios.delete(`/api/orders/${order.id}/hard-delete`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchDeletedOrders();
    } catch (error) {
      console.error("Gagal menghapus permanen pesanan:", error);
    }
  };
  
  const confirmActionHandler = (action, order) => {
    setShowConfirm(true);
    setConfirmAction(() => async () => {
      await action(order);
      setShowConfirm(false);
    });
  };
  
  return (
    <>
      <UserNavbar />
      <div className="container mx-auto px-4 lg:px-25 py-6 pt-24 pb-20 max-w-full bg-gray-50">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Riwayat Hapus</h1>
        <button
          onClick={() => navigate(-1)}
          className="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Kembali ke Halaman Sebelumnya
        </button>

        {deletedOrders.length === 0 ? (
          <p className="text-gray-600 text-center">Belum ada pesanan yang dihapus.</p>
        ) : (
          <table className="w-full bg-white shadow-md rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-gray-700">Acara</th>
                <th className="px-6 py-3 text-left text-gray-700">Kategori Tiket</th>
                <th className="px-6 py-3 text-left text-gray-700">Harga (Rp)</th>
                <th className="px-6 py-3 text-left text-gray-700">Tanggal Pesan</th>
                <th className="px-6 py-3 text-left text-gray-700">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {deletedOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-700">{order.event_name || `Event ID: ${order.event_id}`}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{order.ticket_category}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {order.price.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{new Date(order.created_at).toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-700 space-x-2">
                    <button
                      onClick={() => confirmActionHandler(handleUndo, order)}
                      className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition"
                    >
                      Undo
                    </button>
                    <button
                      onClick={() => confirmActionHandler(handlePermanentDelete, order)}
                      className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition"
                    >
                      Hapus Permanen
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40">
          <div className="bg-white p-6 rounded shadow-lg w-80 text-center">
            <h2 className="text-lg font-semibold mb-4">Konfirmasi</h2>
            <p className="text-gray-700 mb-4">Apakah kamu yakin ingin melanjutkan tindakan ini?</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Batal
              </button>
              <button
                onClick={confirmAction}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Konfirmasi
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RiwayatHapus;