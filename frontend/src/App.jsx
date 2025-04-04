import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/admin/Dashboard';
import Olahraga from './pages/admin/Olahraga';
import Konser from './pages/admin/Konser';
import Seminar from './pages/admin/Seminar';
import Festival from './pages/admin/Festival';
import UserDashboard from './pages/user/Dashboard';
import Orders from './pages/user/Order';
import RiwayatHapus from './pages/user/RiwayatHapus';
import LandingPage from './pages/LandingPage';

function App() {
  const [role, setRole] = useState(localStorage.getItem('role'));

  useEffect(() => {
    const checkRole = () => {
      const storedRole = localStorage.getItem('role');
      console.log('Role saat render App:', storedRole);
      setRole(storedRole);
    };

    window.addEventListener('storage', checkRole);
    checkRole();

    return () => {
      window.removeEventListener('storage', checkRole);
    };
  }, []);

  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={role === 'admin' ? <AdminDashboard /> : <UserDashboard />} />
        <Route path="/admin/olahraga" element={role === 'admin' ? <Olahraga /> : <Login />} />
        <Route path="/admin/konser" element={role === 'admin' ? <Konser /> : <Login />} />
        <Route path="/admin/seminar" element={role === 'admin' ? <Seminar /> : <Login />} />
        <Route path="/admin/festival" element={role === 'admin' ? <Festival /> : <Login />} />
        <Route path="/orders" element={role === 'user' ? <Orders /> : <Login />} /> 
        <Route path="/riwayat-hapus" element={role === 'user' ? <RiwayatHapus /> : <Login />} /> 
      </Routes>
    </Router>
  );
}

export default App;
