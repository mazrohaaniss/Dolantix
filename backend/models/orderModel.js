const db = require('../config/db');

const Order = {
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

  getByUser: (userId, callback) => {
    const query = `
      SELECT * FROM orders 
      WHERE user_id = ? AND deleted_at IS NULL 
      ORDER BY created_at DESC
    `;
    db.query(query, [userId], callback);
  },

  getAllPending: (callback) => {
    const query = `
      SELECT * FROM orders 
      WHERE status = "pending" AND deleted_at IS NULL 
      ORDER BY created_at ASC
    `;
    db.query(query, callback);
  },

  updateStatus: (orderId, status, callback) => {
    const query = `UPDATE orders SET status = ? WHERE id = ?`;
    db.query(query, [status, orderId], callback);
  },

  softDelete: (orderId, callback) => {
    const query = `UPDATE orders SET deleted_at = NOW() WHERE id = ?`;
    db.query(query, [orderId], callback);
  },

  getDeletedOrders: (callback) => {
    const query = `
      SELECT * FROM orders 
      WHERE deleted_at IS NOT NULL 
      ORDER BY deleted_at DESC
    `;
    db.query(query, callback);
  },
restore: (orderId, callback) => {
  const query = `UPDATE orders SET deleted_at = NULL WHERE id = ?`;
  db.query(query, [orderId], callback);
},

hardDelete: (orderId, callback) => {
  const sql = "DELETE FROM orders WHERE id = ? AND deleted_at IS NOT NULL";
  db.query(sql, [orderId], callback);
},
};

module.exports = Order;
