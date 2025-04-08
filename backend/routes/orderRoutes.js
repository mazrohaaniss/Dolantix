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


router.post('/orders', authenticate, orderController.createOrder);

router.get('/orders/user', authenticate, orderController.getUserOrders);

router.get('/orders/admin', authenticate, orderController.getByAdmin);

router.get('/orders/deleted', authenticate, orderController.getDeletedOrders);


router.put('/orders/approve/:orderId', authenticate, orderController.approveOrder);
router.put('/orders/reject/:orderId', authenticate, orderController.rejectOrder);

router.put('/orders/:orderId/restore', authenticate, orderController.restoreOrder);

router.put('/orders/:orderId/soft-delete', authenticate, orderController.softDeleteOrder);

router.delete('/orders/:orderId/hard-delete', authenticate, orderController.hardDeleteOrder);

router.get('/orders/stats/completed-orders', authenticate, orderController.getCompletedOrdersCount);
router.get('/orders/stats/total-users', authenticate, orderController.getTotalUsers);
router.get('/orders/stats/total-events', authenticate, orderController.getTotalEvents);

module.exports = router;
