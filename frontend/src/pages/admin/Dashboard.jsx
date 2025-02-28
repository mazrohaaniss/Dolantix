import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';

const Dashboard = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [tickets, setTickets] = useState({});
  const [pendingOrders, setPendingOrders] = useState([]);
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  useEffect(() => {
    if (!token || role !== 'admin') {
      navigate('/');
    } else {
      fetchEvents();
      fetchPendingOrders();
    }
  }, [navigate, token, role]);

  const fetchEvents = async () => {
    try {
      const res = await axios.get('/api/olahraga/admin', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Data acara olahraga dari server:', res.data);
      setEvents(res.data);
      res.data.forEach(event => fetchTickets(event.id));
    } catch (err) {
      console.error('Gagal mengambil acara:', err.response?.status, err.response?.data || err.message);
    }
  };

  const fetchTickets = async (eventId) => {
    try {
      const res = await axios.get(`/api/tickets/${eventId}/olahraga`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTickets(prev => ({ ...prev, [eventId]: res.data }));
    } catch (err) {
      console.error('Gagal mengambil tiket:', err.response?.data || err.message);
    }
  };

  const fetchPendingOrders = async () => {
    try {
      const res = await axios.get('/api/orders/pending', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPendingOrders(res.data);
    } catch (err) {
      console.error('Gagal mengambil pesanan:', err);
    }
  };

  const handleApproveOrder = async (orderId) => {
    try {
      const res = await axios.put(`/api/orders/approve/${orderId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Pesanan disetujui!');
      fetchPendingOrders();
    } catch (err) {
      alert('Gagal menyetujui pesanan: ' + (err.response?.data?.message || err.message));
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

        <h2>Statistik Acara Olahraga</h2>
        <p>Total Acara: {events.length}</p>
        <p>Acara Terbaru: {events.length > 0 ? events[events.length - 1].name : 'Belum ada acara'}</p>

        <h2>Daftar Acara Olahraga dan Tiket</h2>
        {events.map(event => (
          <div key={event.id} style={{ marginBottom: '20px' }}>
            <h3>{event.name} - {new Date(event.date).toLocaleString()} - {event.location}</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>Nama</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>Tanggal</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>Lokasi</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{event.name}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{new Date(event.date).toLocaleString()}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{event.location}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{event.status}</td>
                </tr>
              </tbody>
            </table>
            <h4>Tiket</h4>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>Jenis Tiket</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>Harga (Rp)</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>Stok</th>
                </tr>
              </thead>
              <tbody>
                {(tickets[event.id] || []).map(ticket => (
                  <tr key={ticket.id}>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{ticket.category}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{ticket.price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</td>
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

        <h2>Pesanan User (Pending)</h2>
        {pendingOrders.length === 0 ? (
          <p>Tidak ada pesanan yang menunggu persetujuan.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>User ID</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Acara</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Kategori Tiket</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Harga (Rp)</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {pendingOrders.map(order => (
                <tr key={order.id}>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{order.user_id}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{order.event_id} ({order.event_category})</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{order.ticket_category}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{order.price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                    <button onClick={() => handleApproveOrder(order.id)}>Setujui</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Dashboard;