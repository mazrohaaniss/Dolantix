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
    const query = 'SELECT * FROM seminar WHERE created_by = ?';
    db.query(query, [adminId], callback);
  },

  getAllPublished: (callback) => {
    const query = 'SELECT * FROM seminar WHERE status = "published"';
    db.query(query, callback);
  },
};

module.exports = Seminar;