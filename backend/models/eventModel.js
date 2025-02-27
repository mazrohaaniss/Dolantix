const db = require('../config/db');

const Event = {
  create: (eventData, callback) => {
    const query = 'INSERT INTO events (name, description, date, location, category, poster, status, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [
      eventData.name, eventData.description, eventData.date, eventData.location,
      eventData.category, eventData.poster, eventData.status || 'draft', eventData.created_by
    ], callback);
  },

  getAll: (callback) => {
    const query = 'SELECT * FROM events WHERE status = "published"';
    db.query(query, callback);
  },

  getByAdmin: (adminId, callback) => {
    const query = 'SELECT * FROM events WHERE created_by = ?';
    db.query(query, [adminId], callback);
  },

  update: (id, eventData, callback) => {
    const query = 'UPDATE events SET name = ?, description = ?, date = ?, location = ?, category = ?, poster = ?, status = ? WHERE id = ?';
    db.query(query, [
      eventData.name, eventData.description, eventData.date, eventData.location,
      eventData.category, eventData.poster, eventData.status, id
    ], callback);
  },

  delete: (id, callback) => {
    const query = 'DELETE FROM events WHERE id = ?';
    db.query(query, [id], callback);
  },
};

module.exports = Event;