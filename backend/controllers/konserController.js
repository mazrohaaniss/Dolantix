const Konser = require('../models/konserModel');

const konserController = {
  createEvent: (req, res) => {
    const { name, description, date, location, poster } = req.body;
    const created_by = req.user.id;
    const eventData = { name, description, date, location, poster, created_by };

    console.log('Membuat acara konser:', eventData);

    Konser.create(eventData, (err, result) => {
      if (err) {
        console.error('Error membuat acara:', err);
        return res.status(500).json({ message: 'Gagal membuat acara' });
      }
      res.status(201).json({ message: 'Acara konser berhasil dibuat', eventId: result.insertId });
    });
  },

  getByAdmin: (req, res) => {
    const adminId = req.user.id;
    Konser.getByAdmin(adminId, (err, results) => {
      if (err) return res.status(500).json({ message: 'Gagal mengambil data acara' });
      res.json(results);
    });
  },

  getAllPublished: (req, res) => {
    Konser.getAllPublished((err, results) => {
      if (err) return res.status(500).json({ message: 'Gagal mengambil data acara' });
      res.json(results);
    });
  },
};

module.exports = konserController;