const Ticket = require('../models/ticketModel');

const ticketController = {
  createTicket: (req, res) => {
    const { event_id, event_category, category, price, stock } = req.body;

    if (!event_id || !event_category || !category || price == null || stock == null) {
      return res.status(400).json({ message: 'Semua field harus diisi' });
    }

    if (!['festival', 'konser', 'olahraga', 'seminar'].includes(event_category)) {
      return res.status(400).json({ message: 'Kategori event tidak valid' });
    }

    if (price < 0 || stock < 0) {
      return res.status(400).json({ message: 'Harga dan stok tidak boleh negatif' });
    }

    const ticketData = { event_id, event_category, category, price, stock };

    Ticket.create(ticketData, (err, result) => {
      if (err) {
        console.error('Error membuat tiket:', err);
        return res.status(500).json({ message: 'Gagal membuat tiket' });
      }
      res.status(201).json({ message: 'Tiket berhasil dibuat', ticket_id: result.insertId });
    });
  },

  getTicketsByEvent: (req, res) => {
    const { eventId, eventCategory } = req.params;
    Ticket.getByEvent(eventId, eventCategory, (err, results) => {
      if (err) return res.status(500).json({ message: 'Gagal mengambil tiket' });
      res.json(results);
    });
  },

  updateTicket: (req, res) => {
    const { id } = req.params;
    const { category, price, stock } = req.body;

    if (!category || price == null || stock == null) {
      return res.status(400).json({ message: 'Semua field harus diisi' });
    }

    const ticketData = { category, price, stock };

    Ticket.update(id, ticketData, (err, result) => {
      if (err) return res.status(500).json({ message: 'Gagal memperbarui tiket' });
      res.json({ message: 'Tiket berhasil diperbarui' });
    });
  },

  deleteTicket: (req, res) => {
    const { id } = req.params;

    Ticket.delete(id, (err, result) => {
      if (err) return res.status(500).json({ message: 'Gagal menghapus tiket' });
      res.json({ message: 'Tiket berhasil dihapus' });
    });
  }

};

module.exports = ticketController;