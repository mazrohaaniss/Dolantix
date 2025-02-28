const Ticket = require('../models/ticketModel');

const ticketController = {
  createTickets: (req, res) => {
    const { event_id, event_category, tickets } = req.body;

    if (!tickets || !Array.isArray(tickets) || tickets.length === 0) {
      return res.status(400).json({ message: 'Tickets harus berupa array dan tidak boleh kosong' });
    }

    console.log('Membuat tiket:', { event_id, event_category, tickets });

    const ticketPromises = tickets.map(ticket => {
      return new Promise((resolve, reject) => {
        const ticketData = {
          event_id,
          event_category,
          category: ticket.category,
          price: ticket.price,
          stock: ticket.stock
        };
        Ticket.create(ticketData, (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
      });
    });

    Promise.all(ticketPromises)
      .then(() => res.status(201).json({ message: 'Semua tiket berhasil dibuat' }))
      .catch(err => {
        console.error('Error membuat tiket:', err);
        res.status(500).json({ message: 'Gagal membuat tiket' });
      });
  },

  getTicketsByEvent: (req, res) => {
    const { eventId, eventCategory } = req.params;
    Ticket.getByEvent(eventId, eventCategory, (err, results) => {
      if (err) return res.status(500).json({ message: 'Gagal mengambil tiket' });
      res.json(results);
    });
  },
};

module.exports = ticketController;