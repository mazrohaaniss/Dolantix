const db = require('../config/db');

const Ticket = {
  create: (ticketData, callback) => {
    const query = 'INSERT INTO tickets (event_id, event_category, category, price, stock) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [
      ticketData.event_id, ticketData.event_category, ticketData.category, ticketData.price, ticketData.stock
    ], callback);
  },

  getByEvent: (eventId, eventCategory, callback) => {
    const query = 'SELECT * FROM tickets WHERE event_id = ? AND event_category = ?';
    db.query(query, [eventId, eventCategory], callback);
  },
};

module.exports = Ticket;