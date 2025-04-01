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
        s.date,
        s.location,
        s.poster,
        s.status,
        s.created_by,
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
};

module.exports = Seminar;