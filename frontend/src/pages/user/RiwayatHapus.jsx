import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import UserNavbar from "../../components/UserNavbar";
import axios from "axios";

const RiwayatHapus = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Ambil dari localStorage jika ada, jika tidak gunakan dari location.state
  const [deletedOrders, setDeletedOrders] = useState(() => {
    const savedOrders = localStorage.getItem("deletedOrders");
    return savedOrders ? JSON.parse(savedOrders) : location.state?.deletedOrders || [];
  });

  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Simpan deletedOrders ke localStorage setiap kali berubah
  useEffect(() => {
    localStorage.setItem("deletedOrders", JSON.stringify(deletedOrders));
  }, [deletedOrders]);

  const handleUndo = async () => {
    try {
      await axios.put(`/api/orders/${selectedOrder.id}/restore`);
      const updatedOrders = deletedOrders.filter((o) => o.id !== selectedOrder.id);
      setDeletedOrders(updatedOrders);
      localStorage.setItem("deletedOrders", JSON.stringify(updatedOrders)); // Update localStorage
    } catch (error) {
      console.error("Gagal mengembalikan pesanan:", error);
    }
    setShowConfirm(false);
  };

  const handlePermanentDelete = async () => {
    try {
      await axios.delete(`/api/orders/${selectedOrder.id}/permanently-delete`);
      const updatedOrders = deletedOrders.filter((o) => o.id !== selectedOrder.id);
      setDeletedOrders(updatedOrders);
      localStorage.setItem("deletedOrders", JSON.stringify(updatedOrders)); // Update localStorage
    } catch (error) {
      console.error("Gagal menghapus permanen pesanan:", error);
    }
    setShowConfirm(false);
  };

  const confirmActionHandler = (action, order) => {
    setSelectedOrder(order);
    setConfirmAction(() => async () => {
      await action();
      setShowConfirm(false); // Pastikan modal tertutup setelah aksi selesai
    });
    setShowConfirm(true);
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
