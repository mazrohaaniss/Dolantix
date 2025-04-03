const db = require('../config/db');

const Konser = {
  create: (eventData, callback) => {
    const query = 'INSERT INTO konser (name, description, date, location, poster, status, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [
      eventData.name, eventData.description, eventData.date, eventData.location,
      eventData.poster, eventData.status || 'published', eventData.created_by
    ], callback);
  },

  getByAdmin: (adminId, callback) => {
    const query = 'SELECT * FROM konser WHERE created_by = ?';
    db.query(query, [adminId], callback);
  },

  getByAdmin: (adminId, callback) => {
    const query = `
        SELECT 
            k.id,
            k.name,
            k.description,
            CONVERT_TZ(k.date, '+00:00', '+07:00') AS date,
            k.location,
            k.poster,
            k.status,
            k.created_by,
            t.event_id,
            t.category,
            t.price,
            t.stock
        FROM konser k
        LEFT JOIN tickets t ON t.event_category = "konser"
        WHERE k.created_by = ?;
    `;
    db.query(query, [adminId], callback);
  },

  getAllPublished: (callback) => {
    const query = 'SELECT * FROM konser WHERE status = "published"';
    db.query(query, callback);
  },

  update: (eventId, eventData, callback) => {
    const query = `
        UPDATE konser 
        SET name = ?, description = ?, date = ?, location = ?, poster = ?, status = ?
        WHERE id = ?
    `;
    db.query(query, [
      eventData.nama_event, eventData.description, eventData.date, eventData.location,
      eventData.poster, eventData.status, eventId
    ], callback);
  },

  delete: (eventId, callback) => {
    const query = `DELETE FROM konser WHERE id = ?`;
    db.query(query, [eventId], callback);
  },
};

module.exports = Konser;