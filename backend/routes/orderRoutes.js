const express = require('express');
const jwt = require('jsonwebtoken');
const orderController = require('../controllers/orderController');
const router = express.Router();

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token diperlukan' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Token tidak valid' });
    req.user = decoded;
    next();
  });
};

// Tambahkan endpoint untuk soft delete
router.put('/orders/:orderId/soft-delete', authenticate, orderController.softDeleteOrder);

// Ambil daftar pesanan yang sudah dihapus
router.get('/orders/deleted', authenticate, orderController.getDeletedOrders);

// Endpoint lainnya
router.post('/orders', authenticate, orderController.createOrder);
router.get('/orders/user', authenticate, orderController.getUserOrders);
router.get('/orders/pending', authenticate, orderController.getPendingOrders);
router.put('/orders/approve/:orderId', authenticate, orderController.approveOrder);

module.exports = router;
