const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const authController = {
  register: (req, res) => {
    const { email, username, password } = req.body;
    console.log('Register attempt:', { email, username, password });

    if (!email || !username || !password) {
      return res.status(400).json({ message: 'Semua field wajib diisi' });
    }

    User.findByUsernameOrEmail(username, (err, results) => {
      if (err) return res.status(500).json({ message: 'Database error' });
      if (results.length > 0) {
        const existing = results[0];
        if (existing.username === username) return res.status(400).json({ message: 'Username sudah digunakan' });
        if (existing.email === email) return res.status(400).json({ message: 'Email sudah digunakan' });
      }

      User.create({ email, username, password }, (err) => {
        if (err) return res.status(500).json({ message: 'Gagal mendaftar' });
        res.status(201).json({ message: 'Registrasi berhasil, silakan login' });
      });
    });
  },

  login: (req, res) => {
    const { identifier, password } = req.body; // identifier bisa username atau email
    console.log('Login attempt:', { identifier, password });

    if (!identifier || !password) {
      return res.status(400).json({ message: 'Username/Email dan password wajib diisi' });
    }

    User.findByUsernameOrEmail(identifier, (err, results) => {
      if (err) return res.status(500).json({ message: 'Database error' });
      if (results.length === 0) return res.status(400).json({ message: 'User tidak ditemukan' });

      const user = results[0];
      if (password !== user.password) {
        console.log('Password salah');
        return res.status(400).json({ message: 'Password salah' });
      }

      const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token, role: user.role, username: user.username });
    });
  },
};

module.exports = authController;