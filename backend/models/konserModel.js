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

  getAllPublished: (callback) => {
    const query = 'SELECT * FROM konser WHERE status = "published"';
    db.query(query, callback);
  },
};

module.exports = Konser;