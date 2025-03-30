const db = require('../config/db');

const Order = {
  // Menambahkan pesanan baru
  create: (orderData, callback) => {
    const query = `
      INSERT INTO orders (user_id, event_id, event_category, ticket_category, price) 
      VALUES (?, ?, ?, ?, ?)
    `;
    db.query(query, [
      orderData.user_id, orderData.event_id, orderData.event_category,
      orderData.ticket_category, orderData.price
    ], callback);
  },

  // Ambil pesanan user yang BELUM dihapus (deleted_at = NULL)
  getByUser: (userId, callback) => {
    const query = `
      SELECT * FROM orders 
      WHERE user_id = ? AND deleted_at IS NULL 
      ORDER BY created_at DESC
    `;
    db.query(query, [userId], callback);
  },

  // Ambil semua pesanan pending yang belum dihapus
  getAllPending: (callback) => {
    const query = `
      SELECT * FROM orders 
      WHERE status = "pending" AND deleted_at IS NULL 
      ORDER BY created_at ASC
    `;
    db.query(query, callback);
  },

  // Update status pesanan
  updateStatus: (orderId, status, callback) => {
    const query = `UPDATE orders SET status = ? WHERE id = ?`;
    db.query(query, [status, orderId], callback);
  },

  // **Soft Delete Pesanan** (hanya update deleted_at, tidak benar-benar dihapus)
  softDelete: (orderId, callback) => {
    const query = `UPDATE orders SET deleted_at = NOW() WHERE id = ?`;
    db.query(query, [orderId], callback);
  },

  // Ambil daftar pesanan yang sudah dihapus (riwayat hapus)
  getDeletedOrders: (callback) => {
    const query = `
      SELECT * FROM orders 
      WHERE deleted_at IS NOT NULL 
      ORDER BY deleted_at DESC
    `;
    db.query(query, callback);
  },
};

module.exports = Order;
