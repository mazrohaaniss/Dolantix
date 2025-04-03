const Konser = require('../models/konserModel');

const konserController = {
  createEvent: (req, res) => {
    const { name, description, date, location, poster, status } = req.body;
    const created_by = req.user.id;
    const eventData = { name, description, date, location, poster, status, created_by };

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
    Konser.getByAdmin(adminId,(err, results) => {
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
    Konser.getAllPublished((err, results) => {
      if (err) return res.status(500).json({ message: 'Gagal mengambil data acara' });
      res.json(results);
    });
  },

  updateEvent: (req, res) => {
    const { eventId } = req.params;
    const { name, description, date, location, poster, status } = req.body;

    const eventData = { name, description, date, location, poster, status };

    console.log('Memperbarui acara konser:', { eventId, ...eventData });

    Konser.update(eventId, eventData, (err, result) => {
      if (err) {
        console.error('Error memperbarui acara:', err);
        return res.status(500).json({ message: 'Gagal memperbarui acara' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Acara tidak ditemukan' });
      }
      res.json({ message: 'Acara konser berhasil diperbarui' });
    });
  },

  deleteEvent: (req, res) => {
    const { eventId } = req.params;

    console.log('Menghapus acara konser (hard delete):', eventId);

    Konser.delete(eventId, (err, result) => {
      if (err) {
        console.error('Error menghapus acara:', err);
        return res.status(500).json({ message: 'Gagal menghapus acara' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Acara tidak ditemukan' });
      }
      res.json({ message: 'Acara konser berhasil dihapus secara permanen' });
    });
  },
};

module.exports = konserController;