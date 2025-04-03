const express = require('express');
const jwt = require('jsonwebtoken');
const konserController = require('../controllers/konserController');
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

router.post('/konser', authenticate, konserController.createEvent);
router.get('/konser/admin', authenticate, konserController.getByAdmin);
router.get('/konser', konserController.getAllPublished);
router.put('/konser/:eventId', authenticate, konserController.updateEvent);
router.delete('/konser/:eventId', authenticate, konserController.deleteEvent);


module.exports = router;