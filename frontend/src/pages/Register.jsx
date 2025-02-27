import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    console.log('Register attempt:', { email, username, password });

    if (password !== confirmPassword) {
      alert('Password dan konfirmasi password tidak cocok');
      return;
    }

    try {
      const res = await axios.post('/api/auth/register', { email, username, password });
      console.log('Respon register:', res.data);
      alert('Registrasi berhasil! Silakan login.');
      navigate('/');
    } catch (err) {
      console.error('Gagal register:', err.response?.data || err.message);
      alert('Gagal register: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Register Dolantix</h2>
      <form onSubmit={handleRegister}>
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ display: 'block', margin: '10px auto', padding: '5px' }}
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ display: 'block', margin: '10px auto', padding: '5px' }}
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ display: 'block', margin: '10px auto', padding: '5px' }}
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Konfirmasi Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={{ display: 'block', margin: '10px auto', padding: '5px' }}
          />
        </div>
        <button type="submit" style={{ padding: '5px 10px' }}>Daftar</button>
      </form>
      <p>
        Sudah punya akun? <Link to="/">Login</Link>
      </p>
    </div>
  );
};

export default Register;