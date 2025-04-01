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
        o.date,
        o.location,
        o.poster,
        o.status,
        o.created_by,
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

};

module.exports = Olahraga;