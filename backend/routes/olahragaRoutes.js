const express = require('express');
const jwt = require('jsonwebtoken');
const olahragaController = require('../controllers/olahragaController');
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

router.post('/olahraga', authenticate, olahragaController.createEvent);
router.get('/olahraga/admin', authenticate, olahragaController.getByAdmin);
router.get('/olahraga', olahragaController.getAllPublished);
router.put('/olahraga/:eventId', authenticate, olahragaController.updateEvent);
router.delete('/olahraga/:eventId', authenticate, olahragaController.deleteEvent);


module.exports = router;