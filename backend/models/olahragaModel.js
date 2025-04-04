const db = require('../config/db');

const Olahraga = {
  create: (eventData, callback) => {
    const query = 'INSERT INTO olahraga (name, description, date, location, poster, status, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [
      eventData.name, eventData.description, eventData.date, eventData.location,
      eventData.poster, eventData.status || 'published', eventData.created_by
    ], callback);
  },

  getByAdmin: (adminId, callback) => {
    const query = `
      SELECT
        o.id,
        o.name,
        o.description,
        CONVERT_TZ(o.date, '+00:00', '+07:00') AS date,
        o.location,
        o.poster,
        o.status,
        o.created_by,
        t.id AS ticket_id,
        t.event_id,
        t.category,
        t.price,
        t.stock
      FROM olahraga o
      LEFT JOIN tickets t ON t.event_category = "olahraga"
      WHERE o.created_by = ?;
    `;
    db.query(query, [adminId], callback);
  },

  getAllPublished: (callback) => {
    const query = 'SELECT * FROM olahraga WHERE status = "published"';
    db.query(query, callback);
  },

  update: (eventId, eventData, callback) => {
    const query = `
        UPDATE olahraga 
        SET name = ?, description = ?, date = ?, location = ?, poster = ?, status = ?
        WHERE id = ?
    `;
    db.query(query, [
      eventData.nama_event, eventData.description, eventData.date, eventData.location,
      eventData.poster, eventData.status, eventId
    ], callback);
  },

  delete: (eventId, callback) => {
    const query = `DELETE FROM olahraga WHERE id = ?`;
    db.query(query, [eventId], callback);
  },

};

module.exports = Olahraga;