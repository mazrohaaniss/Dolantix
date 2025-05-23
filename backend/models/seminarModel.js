const db = require('../config/db');

const Seminar = {
  create: (eventData, callback) => {
    const query = 'INSERT INTO seminar (name, description, date, location, poster, status, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [
      eventData.name, eventData.description, eventData.date, eventData.location,
      eventData.poster, eventData.status || 'published', eventData.created_by
    ], callback);
  },

  getByAdmin: (adminId, callback) => {
    const query = `
      SELECT
        s.id,
        s.name,
        s.description,
        CONVERT_TZ(s.date, '+00:00', '+07:00') AS date,
        s.location,
        s.poster,
        s.status,
        s.created_by,
        t.id AS ticket_id,
        t.event_id,
        t.category,
        t.price,
        t.stock
      FROM seminar s
             LEFT JOIN tickets t ON t.event_category = "seminar"
      WHERE s.created_by = ?;
    `;
    db.query(query, [adminId], callback);
  },

  getAllPublished: (callback) => {
    const query = 'SELECT * FROM seminar WHERE status = "published"';
    db.query(query, callback);
  },

  update: (eventId, eventData, callback) => {
    const query = `
        UPDATE seminar 
        SET name = ?, description = ?, date = ?, location = ?, poster = ?, status = ?
        WHERE id = ?
    `;
    db.query(query, [
      eventData.nama_event, eventData.description, eventData.date, eventData.location,
      eventData.poster, eventData.status, eventId
    ], callback);
  },

  delete: (eventId, callback) => {
    const getTicketsQuery = `SELECT id FROM tickets WHERE event_id = ? AND event_category = 'seminar'`;
    db.query(getTicketsQuery, [eventId], (err, tickets) => {
      if (err) return callback(err);

      const ticketIds = tickets.map(ticket => ticket.id);

      if (ticketIds.length === 0) {
        const deleteSeminar = `DELETE FROM seminar WHERE id = ?`;
        return db.query(deleteSeminar, [eventId], callback);
      }

      const deleteOrders = `DELETE FROM orders WHERE ticket_id IN (?)`;
      db.query(deleteOrders, [ticketIds], (err) => {
        if (err) return callback(err);

        const deleteTickets = `DELETE FROM tickets WHERE id IN (?)`;
        db.query(deleteTickets, [ticketIds], (err) => {
          if (err) return callback(err);

          const deleteSeminar = `DELETE FROM seminar WHERE id = ?`;
          db.query(deleteSeminar, [eventId], callback);
        });
      });
    });
  }
};

module.exports = Seminar;