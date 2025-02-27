const Event = require('../models/eventModel');
const db = require('../config/db'); // Tambah ini jika belum ada

const eventController = {
    createEvent: (req, res) => {
      const { name, description, date, location, category, poster } = req.body;
      const created_by = req.user.id;
      const eventData = { name, description, date, location, category, poster, created_by };
  
      console.log('Membuat acara:', eventData); // Debug
      Event.create(eventData, (err, result) => {
        if (err) {
          console.error('Error membuat acara:', err);
          return res.status(500).json({ message: 'Gagal membuat acara' });
        }
        res.status(201).json({ message: 'Acara berhasil dibuat', eventId: result.insertId });
      });
    },

  getAdminEvents: (req, res) => {
    const adminId = req.user.id;
    Event.getByAdmin(adminId, (err, results) => {
      if (err) return res.status(500).json({ message: 'Gagal mengambil data acara' });
      res.json(results);
    });
  },

  getAllEvents: (req, res) => {
    Event.getAll((err, results) => {
      if (err) return res.status(500).json({ message: 'Gagal mengambil data acara' });
      res.json(results);
    });
  },

  getEventsByCategory: (req, res) => {
    const category = req.params.category;
    const query = 'SELECT * FROM events WHERE category = ? AND status = "published"';
    db.query(query, [category], (err, results) => {
      if (err) return res.status(500).json({ message: 'Gagal mengambil data acara' });
      res.json(results);
    });
  },
};

module.exports = eventController;