const Festival = require('../models/festivalModel');

const festivalController = {
  createEvent: (req, res) => {
    const { name, description, date, location, poster, status } = req.body;
    const created_by = req.user.id;
    const eventData = { name, description, date, location, poster, status, created_by };

    console.log('Membuat acara festival:', eventData);

    Festival.create(eventData, (err, result) => {
      if (err) {
        console.error('Error membuat acara:', err);
        return res.status(500).json({ message: 'Gagal membuat acara' });
      }
      res.status(201).json({ message: 'Acara festival berhasil dibuat', eventId: result.insertId });
    });
  },

  getByAdmin: (req, res) => {
    const adminId = req.user.id;
    Festival.getByAdmin(adminId,(err, results) => {
      if (err) return res.status(500).json({ message: 'Gagal mengambil data acara', error: err });

      let eventMap = {};

      results.forEach(row => {
        if (!eventMap[row.id]) {
          eventMap[row.id] = {
            id: row.id,
            nama_event: row.name,
            description: row.description,
            date: row.date,
            location: row.location,
            status: row.status,
            poster: row.poster,
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

  getAllPublished: (req, res) => {
    Festival.getAllPublished((err, results) => {
      if (err) return res.status(500).json({ message: 'Gagal mengambil data acara' });
      res.json(results);
    });
  },

  updateEvent: (req, res) => {
    const { eventId } = req.params;
    const { nama_event, description, date, location, poster, status } = req.body;

    const eventData = { nama_event, description, date, location, poster, status };

    console.log('Memperbarui acara festival:', { eventId, ...eventData });

    Festival.update(eventId, eventData, (err, result) => {
      if (err) {
        console.error('Error memperbarui acara:', err);
        return res.status(500).json({ message: 'Gagal memperbarui acara' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Acara tidak ditemukan' });
      }
      res.json({ message: 'Acara festival berhasil diperbarui' });
    });
  },

  deleteEvent: (req, res) => {
    const { eventId } = req.params;

    console.log('Menghapus acara festival (hard delete):', eventId);

    Festival.delete(eventId, (err, result) => {
      if (err) {
        console.error('Error menghapus acara:', err);
        return res.status(500).json({ message: 'Gagal menghapus acara' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Acara tidak ditemukan' });
      }
      res.json({ message: 'Acara festival berhasil dihapus secara permanen' });
    });
  },
};

module.exports = festivalController;