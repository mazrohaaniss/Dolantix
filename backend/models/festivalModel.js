const db = require('../config/db');

const Festival = {
  create: (eventData, callback) => {
    const query = 'INSERT INTO festival (name, description, date, location, poster, status, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [
      eventData.name, eventData.description, eventData.date, eventData.location,
      eventData.poster, eventData.status || 'published', eventData.created_by
    ], callback);
  },

  getByAdmin: (adminId, callback) => {
    const query = `
        SELECT 
            f.id,
            f.name,
            f.description,
            CONVERT_TZ(f.date, '+00:00', '+07:00') AS date,
            f.location,
            f.poster,
            f.status,
            f.created_by,
            t.id AS ticket_id,
            t.event_id,
            t.category,
            t.price,
            t.stock
        FROM festival f
        LEFT JOIN tickets t ON t.event_category = "festival"
        WHERE f.created_by = ?;
    `;
    db.query(query, [adminId], callback);
  },

  getAllPublished: (callback) => {
    const query = 'SELECT * FROM festival WHERE status = "published"';
    db.query(query, callback);
  },

  update: (eventId, eventData, callback) => {
    const query = `
        UPDATE festival 
        SET name = ?, description = ?, date = ?, location = ?, poster = ?, status = ?
        WHERE id = ?
    `;
    db.query(query, [
      eventData.nama_event, eventData.description, eventData.date, eventData.location,
      eventData.poster, eventData.status, eventId
    ], callback);
  },

  delete: (eventId, callback) => {
    const getTicketsQuery = `SELECT id FROM tickets WHERE event_id = ? AND event_category = 'festival'`;
    db.query(getTicketsQuery, [eventId], (err, tickets) => {
      if (err) return callback(err);

      const ticketIds = tickets.map(ticket => ticket.id);

      if (ticketIds.length === 0) {
        const deleteFestival = `DELETE FROM festival WHERE id = ?`;
        return db.query(deleteFestival, [eventId], callback);
      }

      const deleteOrders = `DELETE FROM orders WHERE ticket_id IN (?)`;
      db.query(deleteOrders, [ticketIds], (err) => {
        if (err) return callback(err);

        const deleteTickets = `DELETE FROM tickets WHERE id IN (?)`;
        db.query(deleteTickets, [ticketIds], (err) => {
          if (err) return callback(err);

          const deleteFestival = `DELETE FROM festival WHERE id = ?`;
          db.query(deleteFestival, [eventId], callback);
        });
      });
    });
  }
};

module.exports = Festival;