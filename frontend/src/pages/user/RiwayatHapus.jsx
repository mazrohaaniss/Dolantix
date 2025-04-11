import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import UserNavbar from "../../components/UserNavbar";

const RiwayatHapus = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const [deletedOrders, setDeletedOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [actionType, setActionType] = useState(""); // "undo" or "delete"
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!token || role !== "user") {
      navigate("/");
    } else {
      fetchDeletedOrders();
    }
  }, [navigate, token, role]);

  const fetchDeletedOrders = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get("/api/orders/deleted", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeletedOrders(res.data);
    } catch (error) {
      console.error("Gagal mengambil riwayat hapus:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async () => {
    if (!selectedOrder) return;

    setIsLoading(true);
    try {
      if (actionType === "undo") {
        await axios.put(
          `/api/orders/${selectedOrder.order_id}/restore`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.delete(
          `/api/orders/${selectedOrder.order_id}/hard-delete`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      // Refresh the list after successful action
      await fetchDeletedOrders();
    } catch (error) {
      console.error(`Gagal ${actionType === "undo" ? "mengembalikan" : "menghapus"} pesanan:`, error);
      alert(`Gagal ${actionType === "undo" ? "mengembalikan" : "menghapus"} pesanan. Silakan coba lagi.`);
    } finally {
      setIsLoading(false);
      setShowModal(false);
    }
  };

  const getTicketInfo = (order) => {
    return `${order.event_name} - ${order.ticket_category}`;
  };

  const getTicketPrice = (order) => {
    return parseFloat(order.ticket_price) || 0;
  };

  const confirmAction = (order, type) => {
    setSelectedOrder(order);
    setActionType(type);
    setShowModal(true);
  };

  return (
    <>
      <UserNavbar />
      <div className="container mx-auto px-4 lg:px-25 py-6 pt-24 pb-20 max-w-full bg-gray-50">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Riwayat Hapus</h1>

        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Kembali
          </button>
        </div>

        {isLoading && deletedOrders.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-gray-600">Memuat data...</p>
          </div>
        ) : deletedOrders.length === 0 ? (
          <div className="bg-gray-50 p-8 rounded-lg text-center">
            <p className="text-gray-600">Belum ada pesanan yang dihapus.</p>
          </div>
        ) : (
          <div className="overflow-x-auto shadow-md rounded-lg">
            <table className="w-full bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">
                    Tiket
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">
                    Harga (Rp)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">
                    Tanggal Pesan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {deletedOrders.map((order) => (
                  <tr key={order.order_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {getTicketInfo(order)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {getTicketPrice(order).toLocaleString("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs inline-block rounded-full bg-gray-100 text-gray-800">
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {new Date(order.created_at).toLocaleString("id-ID")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap space-x-2">
                      <button
                        onClick={() => confirmAction(order, "undo")}
                        className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition"
                        disabled={isLoading}
                      >
                        Undo
                      </button>
                      <button
                        onClick={() => confirmAction(order, "delete")}
                        className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition"
                        disabled={isLoading}
                      >
                        Hapus Permanen
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-80 text-center">
            <h2 className="text-lg font-semibold mb-4">Konfirmasi</h2>
            <p className="text-gray-700 mb-4">
              {actionType === "undo"
                ? "Apakah kamu yakin ingin mengembalikan pesanan ini?"
                : "Apakah kamu yakin ingin menghapus permanen pesanan ini?"}
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                disabled={isLoading}
              >
                Batal
              </button>
              <button
                onClick={handleAction}
                className={`px-4 py-2 ${
                  actionType === "undo" ? "bg-green-500" : "bg-red-500"
                } text-white rounded hover:${
                  actionType === "undo" ? "bg-green-600" : "bg-red-600"
                }`}
                disabled={isLoading}
              >
                {isLoading ? "Memproses..." : actionType === "undo" ? "Undo" : "Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RiwayatHapus;