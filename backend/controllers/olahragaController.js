const Olahraga = require('../models/olahragaModel');

const olahragaController = {
  createEvent: (req, res) => {
    const { name, description, date, location, poster } = req.body;
    const created_by = req.user.id;
    const eventData = { name, description, date, location, poster, created_by };

    console.log('Membuat acara olahraga:', eventData);

    Olahraga.create(eventData, (err, result) => {
      if (err) {
        console.error('Error membuat acara:', err);
        return res.status(500).json({ message: 'Gagal membuat acara' });
      }
      res.status(201).json({ message: 'Acara olahraga berhasil dibuat', eventId: result.insertId });
    });
  },

  getByAdmin: (req, res) => {
    const adminId = req.user.id;
    Olahraga.getByAdmin(adminId, (err, results) => {
      if (err) return res.status(500).json({ message: 'Gagal mengambil data acara' });
      res.json(results);
    });
  },

  getAllPublished: (req, res) => {
    Olahraga.getAllPublished((err, results) => {
      if (err) return res.status(500).json({ message: 'Gagal mengambil data acara' });
      res.json(results);
    });
  },
};

module.exports = olahragaController;