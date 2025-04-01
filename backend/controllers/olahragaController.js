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

  getAllPublished: (req, res) => {
    Olahraga.getAllPublished((err, results) => {
      if (err) return res.status(500).json({ message: 'Gagal mengambil data acara' });
      res.json(results);
    });
  },

  getByAdmin: (req, res) => {
    const adminId = req.user.id;
    Olahraga.getByAdmin(adminId,(err, results) => {
      if (err) return res.status(500).json({ message: 'Gagal mengambil data acara', error: err });

      let eventMap = {};

      results.forEach(row => {
        if (!eventMap[row.id]) {
          eventMap[row.id] = {
            nama_event: row.name,
            description: row.description,
            waktu: row.waktu,
            tanggal: row.tanggal,
            location: row.location,
            status: row.status,
            tickets: []
          };
        }
        if (row.category && row.id == row.event_id) {
          eventMap[row.id].tickets.push({
            category: row.category,
            price: row.price,
            stock: row.stock
          });
        }
      });

      res.json(Object.values(eventMap));
    });
  },

};

module.exports = olahragaController;