const Order = require('../models/orderModel');

const orderController = {
  // Buat pesanan baru
  createOrder: (req, res) => {
    const { event_id, event_category, ticket_category, price } = req.body;
    const user_id = req.user.id;
    const orderData = { user_id, event_id, event_category, ticket_category, price };

    console.log('Membuat pesanan:', orderData);

    Order.create(orderData, (err, result) => {
      if (err) {
        console.error('Error membuat pesanan:', err);
        return res.status(500).json({ message: 'Gagal membuat pesanan' });
      }
      res.status(201).json({ message: 'Pesanan berhasil dibuat', orderId: result.insertId });
    });
  },

  // Ambil semua pesanan aktif pengguna (yang belum dihapus)
  getUserOrders: (req, res) => {
    const userId = req.user.id;
    Order.getByUser(userId, (err, results) => {
      if (err) return res.status(500).json({ message: 'Gagal mengambil pesanan' });
      res.json(results);
    });
  },

  // Ambil semua pesanan yang pending
  getPendingOrders: (req, res) => {
    Order.getAllPending((err, results) => {
      if (err) return res.status(500).json({ message: 'Gagal mengambil pesanan' });
      res.json(results);
    });
  },

  // Setujui pesanan
  approveOrder: (req, res) => {
    const { orderId } = req.params;
    Order.updateStatus(orderId, 'approved', (err) => {
      if (err) return res.status(500).json({ message: 'Gagal menyetujui pesanan' });
      res.json({ message: 'Pesanan disetujui' });
    });
  },

  // **Soft Delete Pesanan** (Update deleted_at, bukan hapus permanen)
  softDeleteOrder: (req, res) => {
    const { orderId } = req.params;

    Order.softDelete(orderId, (err, result) => {
      if (err) return res.status(500).json({ message: "Gagal menghapus pesanan", error: err });
      res.json({ message: "Pesanan berhasil dihapus (soft delete)" });
    });
  },

  // **Ambil daftar pesanan yang sudah dihapus**
  getDeletedOrders: (req, res) => {
    Order.getDeletedOrders((err, orders) => {
      if (err) return res.status(500).json({ message: "Gagal mengambil riwayat hapus", error: err });
      res.json(orders);
    });
  }
};

module.exports = orderController;
