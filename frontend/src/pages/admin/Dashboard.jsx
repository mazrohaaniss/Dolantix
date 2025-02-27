import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';

const Dashboard = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [tickets, setTickets] = useState({});
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  useEffect(() => {
    if (!token || role !== 'admin') {
      navigate('/');
    } else {
      fetchEvents();
    }
  }, [navigate, token, role]);

  const fetchEvents = async () => {
    try {
      const res = await axios.get('/api/events/admin', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEvents(res.data);
      // Ambil tiket untuk setiap acara
      res.data.forEach(event => fetchTickets(event.id));
    } catch (err) {
      console.error('Gagal mengambil acara:', err.response?.data || err.message);
    }
  };

  const fetchTickets = async (eventId) => {
    try {
      const res = await axios.get(`/api/tickets/event/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTickets(prev => ({ ...prev, [eventId]: res.data }));
    } catch (err) {
      console.error(`Gagal mengambil tiket untuk event ${eventId}:`, err.response?.data || err.message);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/', { replace: true });
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ marginLeft: '220px', padding: '20px', width: '100%' }}>
        <h1>Dashboard Admin Dolantix</h1>
        <button onClick={handleLogout} style={{ float: 'right' }}>Logout</button>

        <h2>Statistik Acara</h2>
        <p>Total Acara: {events.length}</p>
        <p>Acara Terbaru: {events.length > 0 ? events[events.length - 1].name : 'Belum ada acara'}</p>

        <h2>Daftar Semua Acara dan Tiket</h2>
        {events.map(event => (
          <div key={event.id} style={{ marginBottom: '20px' }}>
            <h3>{event.name} - {new Date(event.date).toLocaleString()} - {event.location}</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '10px' }}>
              <thead>
                <tr>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>Nama Acara</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>Tanggal</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>Lokasi</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>Kategori</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{event.name}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{new Date(event.date).toLocaleString()}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{event.location}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{event.category}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{event.status}</td>
                </tr>
              </tbody>
            </table>

            <h4>Tiket untuk {event.name}</h4>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>Kategori</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>Harga</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>Stok</th>
                </tr>
              </thead>
              <tbody>
                {(tickets[event.id] || []).map(ticket => (
                  <tr key={ticket.id}>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{ticket.category}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>Rp {ticket.price.toLocaleString()}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{ticket.stock}</td>
                  </tr>
                ))}
                {(tickets[event.id] || []).length === 0 && (
                  <tr>
                    <td colSpan="3" style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                      Belum ada tiket untuk acara ini
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;