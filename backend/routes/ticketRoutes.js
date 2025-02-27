const express = require('express');
const ticketController = require('../controllers/ticketController');
const router = express.Router();

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token diperlukan' });

  require('jsonwebtoken').verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Token tidak valid' });
    req.user = decoded;
    next();
  });
};

router.post('/tickets', authenticate, ticketController.createTicket); // Tambah tiket (Admin)
router.get('/tickets/event/:eventId', ticketController.getTicketsByEvent); // Ambil tiket per event (Admin/User)
router.put('/tickets/:id', authenticate, ticketController.updateTicket); // Update tiket (Admin)
router.delete('/tickets/:id', authenticate, ticketController.deleteTicket); // Hapus tiket (Admin)

module.exports = router;