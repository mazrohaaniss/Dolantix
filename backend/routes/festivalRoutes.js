const express = require('express');
const jwt = require('jsonwebtoken');
const festivalController = require('../controllers/festivalController');
const olahragaController = require("../controllers/olahragaController");
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

router.post('/festival', authenticate, festivalController.createEvent);
router.get('/festival/admin', authenticate, festivalController.getByAdmin);
router.get('/festival', festivalController.getAllPublished);
router.put('/festival/:eventId', authenticate, festivalController.updateEvent);
router.delete('/festival/:eventId', authenticate, festivalController.deleteEvent);


module.exports = router;