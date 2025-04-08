const db = require('../config/db');

const User = {
  create: (userData, callback) => {
    const query = 'INSERT INTO users (email, username, password, role) VALUES (?, ?, ?, ?)';
    db.query(query, [userData.email, userData.username, userData.password, userData.role || 'user'], callback);
  },

  findByUsernameOrEmail: (identifier, callback) => {
    const query = 'SELECT * FROM users WHERE username = ? OR email = ?';
    db.query(query, [identifier, identifier], callback);
  },

  getTotalUsers: (callback) => {
    const query = 'SELECT COUNT(*) AS total FROM users';
    db.query(query, callback);
  },
};

module.exports = User;