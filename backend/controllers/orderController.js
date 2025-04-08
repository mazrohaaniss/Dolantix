const Order = require('../models/orderModel');

const orderController = {
  createOrder: (req, res) => {
    const { ticket_id } = req.body;
    const user_id = req.user.id;

    const orderData = { user_id, ticket_id };

    console.log('Membuat pesanan:', orderData);

    Order.create(orderData, (err, result) => {
      if (err) {
        console.error('Error membuat pesanan:', err);
        return res.status(500).json({ message: 'Gagal membuat pesanan' });
      }
      res.status(201).json({ message: 'Pesanan berhasil dibuat', orderId: result.insertId });
    });
  },

  getUserOrders: (req, res) => {
    const userId = req.user.id;
    Order.getByUser(userId, (err, results) => {
      if (err) return res.status(500).json({ message: `Gagal mengambil pesanan`});
      res.json(results);
    })
  },

  getByAdmin: (req, res) => {
    const adminId = req.user.id;
    Order.getByAdmin(adminId,(err, results) => {
      if (err) return res.status(500).json({ message: 'Gagal mengambil pesanan' });
      res.json(results);
    });
  },

  getDeletedOrders: (req, res) => {
    const adminId = req.user.id;
    Order.getDeletedOrders(adminId, (err, orders) => {
      if (err) {
        console.error('Gagal mengambil order terhapus:', err);
        return res.status(500).json({ message: "Gagal mengambil riwayat hapus" });
      }
      res.json(orders);
    });
  },

  approveOrder: (req, res) => {
    const { orderId } = req.params;

    // Cek status order dulu
    Order.getById(orderId, (err, order) => {
      if (err || !order) {
        return res.status(404).json({ message: 'Pesanan tidak ditemukan' });
      }

      if (order.status !== 'pending') {
        return res.status(400).json({ message: 'Pesanan tidak bisa disetujui karena tidak berstatus pending' });
      }

      Order.approve(orderId, (err) => {
        if (err) return res.status(500).json({ message: 'Gagal menyetujui pesanan' });
        res.json({ message: 'Pesanan disetujui' });
      });
    });
  },

  rejectOrder: (req, res) => {
    const { orderId } = req.params;

    Order.getById(orderId, (err, order) => {
      if (err || !order) {
        return res.status(404).json({ message: 'Pesanan tidak ditemukan' });
      }

      if (order.status !== 'pending') {
        return res.status(400).json({ message: 'Pesanan tidak bisa ditolak karena tidak berstatus pending' });
      }

      Order.reject(orderId, (err) => {
        if (err) return res.status(500).json({ message: 'Gagal menolak pesanan' });
        res.json({ message: 'Pesanan ditolak' });
      });
    });
  },

  softDeleteOrder: (req, res) => {
    const { orderId } = req.params;

    Order.softDelete(orderId, (err, result) => {
      if (err) {
        console.error('Gagal soft delete order:', err);
        return res.status(500).json({ message: "Gagal menghapus pesanan", error: err });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Pesanan tidak ditemukan atau sudah dihapus" });
      }

      res.json({ message: "Pesanan berhasil dihapus (soft delete)" });
    });
  },


  restoreOrder: (req, res) => {
    const { orderId } = req.params;

    Order.restore(orderId, (err, result) => {
      if (err) {
        console.error('Gagal restore order:', err);
        return res.status(500).json({ message: "Gagal mengembalikan pesanan", error: err });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Pesanan tidak ditemukan atau belum dihapus" });
      }

      res.json({ message: "Pesanan berhasil dikembalikan" });
    });
  },

  hardDeleteOrder: (req, res) => {
    const { orderId } = req.params;

    Order.hardDelete(orderId, (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Gagal menghapus permanen pesanan", error: err });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Pesanan tidak ditemukan atau belum dihapus (soft delete)" });
      }

      res.json({ message: "Pesanan berhasil dihapus secara permanen" });
    });
  },
};



module.exports = orderController;