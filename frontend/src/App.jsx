import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/admin/Dashboard';
import Olahraga from './pages/admin/Olahraga';
import Konser from './pages/admin/Konser';
import Seminar from './pages/admin/Seminar';
import Festival from './pages/admin/Festival';
import UserDashboard from './pages/user/Dashboard';

function App() {
  const role = localStorage.getItem('role');
  console.log('Role saat render App:', role);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={role === 'admin' ? <AdminDashboard /> : <UserDashboard />} />
        <Route path="/admin/olahraga" element={role === 'admin' ? <Olahraga /> : <Login />} />
        <Route path="/admin/konser" element={role === 'admin' ? <Konser /> : <Login />} />
        <Route path="/admin/seminar" element={role === 'admin' ? <Seminar /> : <Login />} />
        <Route path="/admin/festival" element={role === 'admin' ? <Festival /> : <Login />} />
      </Routes>
    </Router>
  );
}

export default App;