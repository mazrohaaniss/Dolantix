import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [identifier, setIdentifier] = useState(''); // Username atau email
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log('Mencoba login:', { identifier, password });

    try {
      const res = await axios.post('/api/auth/login', { identifier, password });
      console.log('Respon dari server:', res.data);

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('username', res.data.username);
      console.log('LocalStorage diset:', {
        token: localStorage.getItem('token'),
        role: localStorage.getItem('role'),
        username: localStorage.getItem('username'),
      });

      navigate('/dashboard');
    } catch (err) {
      console.error('Gagal login:', err.response?.status, err.response?.data || err.message);
      alert('Gagal login: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Login Dolantix</h2>
      <form onSubmit={handleLogin}>
        <div>
          <input
            type="text"
            placeholder="Username atau Email"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
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
        <button type="submit" style={{ padding: '5px 10px' }}>Login</button>
      </form>
      <p>
        Belum punya akun? <Link to="/register">Daftar</Link>
      </p>
    </div>
  );
};

export default Login;