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
            k.date,
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
};

module.exports = Konser;