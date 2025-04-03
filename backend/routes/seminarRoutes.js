const express = require('express');
const jwt = require('jsonwebtoken');
const seminarController = require('../controllers/seminarController');
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

router.post('/seminar', authenticate, seminarController.createEvent);
router.get('/seminar/admin', authenticate, seminarController.getByAdmin);
router.get('/seminar', seminarController.getAllPublished);
router.put('/seminar/:eventId', authenticate, seminarController.updateEvent);
router.delete('/seminar/:eventId', authenticate, seminarController.deleteEvent);


module.exports = router;