const Ticket = require('../models/ticketModel');

const ticketController = {
  createTicket: (req, res) => {
    const { event_id, category, price, stock } = req.body;
    const ticketData = { event_id, category, price, stock };

    console.log('Membuat tiket:', ticketData);
    Ticket.create(ticketData, (err, result) => {
      if (err) {
        console.error('Error membuat tiket:', err);
        return res.status(500).json({ message: 'Gagal membuat tiket' });
      }
      res.status(201).json({ message: 'Tiket berhasil dibuat', ticketId: result.insertId });
    });
  },

  getTicketsByEvent: (req, res) => {
    const eventId = req.params.eventId;
    Ticket.getByEvent(eventId, (err, results) => {
      if (err) return res.status(500).json({ message: 'Gagal mengambil tiket' });
      res.json(results);
    });
  },

  updateTicket: (req, res) => {
    const id = req.params.id;
    const { category, price, stock } = req.body;
    const ticketData = { category, price, stock };

    Ticket.update(id, ticketData, (err) => {
      if (err) return res.status(500).json({ message: 'Gagal mengupdate tiket' });
      res.json({ message: 'Tiket berhasil diupdate' });
    });
  },

  deleteTicket: (req, res) => {
    const id = req.params.id;
    Ticket.delete(id, (err) => {
      if (err) return res.status(500).json({ message: 'Gagal menghapus tiket' });
      res.json({ message: 'Tiket berhasil dihapus' });
    });
  },
};

module.exports = ticketController;