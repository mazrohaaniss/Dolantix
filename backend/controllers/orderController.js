const Order = require('../models/orderModel');

const orderController = {
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

  getUserOrders: (req, res) => {
    const userId = req.user.id;
    Order.getByUser(userId, (err, results) => {
      if (err) return res.status(500).json({ message: 'Gagal mengambil pesanan' });
      res.json(results);
    });
  },

  getPendingOrders: (req, res) => {
    Order.getAllPending((err, results) => {
      if (err) return res.status(500).json({ message: 'Gagal mengambil pesanan' });
      res.json(results);
    });
  },

  approveOrder: (req, res) => {
    const { orderId } = req.params;
    Order.updateStatus(orderId, 'approved', (err) => {
      if (err) return res.status(500).json({ message: 'Gagal menyetujui pesanan' });
      res.json({ message: 'Pesanan disetujui' });
    });
  },
};

module.exports = orderController;