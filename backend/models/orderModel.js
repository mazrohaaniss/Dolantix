const db = require('../config/db');

const Order = {
  create: (orderData, callback) => {
    const query = `
      INSERT INTO orders (user_id, ticket_id, status, created_at)
      VALUES (?, ?, 'pending', NOW())
    `;
    db.query(query, [orderData.user_id, orderData.ticket_id], callback);
  },

  getByUser: (userId, callback) => {
    const query = `
      SELECT
        o.id AS order_id,
        CASE
          WHEN t.event_category = 'festival' THEN f.name
          WHEN t.event_category = 'konser' THEN k.name
          WHEN t.event_category = 'olahraga' THEN ol.name
          WHEN t.event_category = 'seminar' THEN s.name
          ELSE 'Unknown'
          END AS event_name,
        t.event_category AS event_category,
        t.category AS ticket_category,
        t.price AS ticket_price,
        o.status,
        o.created_at AS order_date
      FROM orders o
             JOIN tickets t ON o.ticket_id = t.id
             LEFT JOIN festival f ON t.event_id = f.id AND t.event_category = 'festival'
             LEFT JOIN konser k ON t.event_id = k.id AND t.event_category = 'konser'
             LEFT JOIN olahraga ol ON t.event_id = ol.id AND t.event_category = 'olahraga'
             LEFT JOIN seminar s ON t.event_id = s.id AND t.event_category = 'seminar'
      WHERE o.user_id = ?
      ORDER BY
        CASE
          WHEN o.status = 'pending' THEN 1
          WHEN o.status = 'approved' THEN 2
          WHEN o.status = 'rejected' THEN 3
          ELSE 4
          END ASC,
        o.created_at DESC;
    `;
    db.query(query, [userId], callback);
  },

  getByAdmin: (adminId,callback) => {
    const query = `
      SELECT
        o.id AS order_id,
        -- ambil nama event berdasarkan event_category
        CASE
          WHEN t.event_category = 'festival' THEN f.name
          WHEN t.event_category = 'konser' THEN k.name
          WHEN t.event_category = 'olahraga' THEN ol.name
          WHEN t.event_category = 'seminar' THEN s.name
          ELSE 'Unknown'
          END AS event_name,
        t.event_category AS event_category,
        t.category AS ticket_category,
        t.price AS ticket_price,
        u.email AS user_email,
        o.created_at AS order_date,
        o.status
      FROM orders o
             JOIN tickets t ON o.ticket_id = t.id
             LEFT JOIN festival f ON t.event_id = f.id AND t.event_category = 'festival'
             LEFT JOIN konser k ON t.event_id = k.id AND t.event_category = 'konser'
             LEFT JOIN olahraga ol ON t.event_id = ol.id AND t.event_category = 'olahraga'
             LEFT JOIN seminar s ON t.event_id = s.id AND t.event_category = 'seminar'
             JOIN users u ON o.user_id = u.id
      ORDER BY
        CASE
          WHEN o.status = 'pending' THEN 1
          WHEN o.status = 'approved' THEN 2
          WHEN o.status = 'rejected' THEN 3
          ELSE 4
          END ASC,
        o.created_at DESC;
    `;
    db.query(query,[adminId], callback);
  },

  getDeletedOrders: (adminId,callback) => {
    const query = `
      SELECT
        o.id AS order_id,
        CASE
          WHEN t.event_category = 'festival' THEN f.name
          WHEN t.event_category = 'konser' THEN k.name
          WHEN t.event_category = 'olahraga' THEN ol.name
          WHEN t.event_category = 'seminar' THEN s.name
          ELSE 'Unknown'
          END AS event_name,
        t.event_category AS event_category,
        t.category AS ticket_category,
        t.price AS ticket_price,
        u.email AS user_email,
        o.status,
        o.created_at AS order_date,
        o.deleted_at
      FROM orders o
             JOIN tickets t ON o.ticket_id = t.id
             LEFT JOIN festival f ON t.event_id = f.id AND t.event_category = 'festival'
             LEFT JOIN konser k ON t.event_id = k.id AND t.event_category = 'konser'
             LEFT JOIN olahraga ol ON t.event_id = ol.id AND t.event_category = 'olahraga'
             LEFT JOIN seminar s ON t.event_id = s.id AND t.event_category = 'seminar'
             JOIN users u ON o.user_id = u.id
      WHERE o.deleted_at IS NOT NULL
      ORDER BY o.deleted_at DESC
    `;
    db.query(query,[adminId], callback);
  },

  getById: (orderId, callback) => {
    const query = `SELECT * FROM orders WHERE id = ?`;
    db.query(query, [orderId], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
  },

  approve: (orderId, callback) => {
    const query = `UPDATE orders SET status = 'approved' WHERE id = ?`;
    db.query(query, [orderId], callback);
  },

  reject: (orderId, callback) => {
    const query = `UPDATE orders SET status = 'rejected' WHERE id = ?`;
    db.query(query, [orderId], callback);
  },

  softDelete: (orderId, callback) => {
    const query = `
      UPDATE orders
      SET deleted_at = NOW()
      WHERE id = ? AND deleted_at IS NULL
    `;
    db.query(query, [orderId], callback);
  },

  restore: (orderId, callback) => {
    const query = `
      UPDATE orders
      SET deleted_at = NULL
      WHERE id = ? AND deleted_at IS NOT NULL
    `;
    db.query(query, [orderId], callback);
  },

  hardDelete: (orderId, callback) => {
    const sql = "DELETE FROM orders WHERE id = ? AND deleted_at IS NOT NULL";
    db.query(sql, [orderId], callback);
  },
};

module.exports = Order;
