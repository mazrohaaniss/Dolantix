const express = require('express');
const jwt = require('jsonwebtoken');
const ticketController = require('../controllers/ticketController');
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

router.post('/tickets', authenticate, ticketController.createTicket);
router.get('/tickets/:eventId/:eventCategory', ticketController.getTicketsByEvent);
router.put('/tickets/:id', authenticate, ticketController.updateTicket);
router.delete('/tickets/:id', authenticate, ticketController.deleteTicket);

module.exports = router;