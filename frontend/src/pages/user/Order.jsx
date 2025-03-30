import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UserNavbar from "../../components/UserNavbar";

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [deletedOrders, setDeletedOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (!token || role !== "user") {
      navigate("/");
    } else {
      fetchOrders();
    }
  }, [navigate, token, role]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("/api/orders/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err) {
      console.error("Gagal mengambil pesanan:", err);
    }
  };

  const handleSoftDelete = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (selectedOrder) {
      try {
        await axios.put(`/api/orders/${selectedOrder.id}/soft-delete`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(orders.filter(order => order.id !== selectedOrder.id));
        setDeletedOrders([...deletedOrders, selectedOrder]);
      } catch (err) {
        console.error("Gagal menghapus pesanan:", err);
      }
    }
    setShowModal(false);
  };

  return (
    <>
      <UserNavbar />
      <div className="container mx-auto px-4 lg:px-25 py-6 pt-24 pb-20 max-w-full bg-gray-50">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Riwayat Pesanan</h1>

        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Kembali ke Dashboard
          </button>
          <button
            onClick={() => navigate("/riwayat-hapus", { state: { deletedOrders } })}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
          >
            Riwayat Hapus
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="bg-gray-50 p-8 rounded-lg text-center">
            <p className="text-gray-600">Belum ada pesanan.</p>
          </div>
        ) : (
          <div className="overflow-x-auto shadow-md rounded-lg">
            <table className="w-full bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">
                    Acara
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">
                    Kategori Tiket
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
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {order.event_id} ({order.event_category})
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {order.ticket_category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {order.price.toLocaleString("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs inline-block rounded-full ${
                          order.status === "paid"
                            ? "bg-green-100 text-green-800"
                            : order.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {new Date(order.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {order.status === "approved" && (
                        <button
                          onClick={() => handleSoftDelete(order)}
                          className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition"
                        >
                          Hapus
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40">
          <div className="bg-white p-6 rounded shadow-lg w-80 text-center">
            <h2 className="text-lg font-semibold mb-4">Konfirmasi Hapus</h2>
            <p className="text-gray-700 mb-4">Apakah kamu yakin ingin menghapus pesanan ini?</p>
            <div className="flex justify-center space-x-4">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400">Batal</button>
              <button onClick={confirmDelete} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Hapus</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Orders;