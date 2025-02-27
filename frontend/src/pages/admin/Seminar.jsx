import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';

const Seminar = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ name: '', description: '', date: '', location: '', poster: '' });
  const [tickets, setTickets] = useState({});
  const [newTicket, setNewTicket] = useState({ event_id: '', category: 'reguler', price: '', stock: '' });
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
      const res = await axios.get('/api/events/category/seminar', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEvents(res.data);
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

  const handleEventInputChange = (e) => {
    setNewEvent({ ...newEvent, [e.target.name]: e.target.value });
  };

  const handleTicketInputChange = (e) => {
    setNewTicket({ ...newTicket, [e.target.name]: e.target.value });
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/events', { ...newEvent, category: 'seminar' }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Acara seminar berhasil ditambahkan!');
      fetchEvents();
      setNewEvent({ name: '', description: '', date: '', location: '', poster: '' });
    } catch (err) {
      alert('Gagal menambah acara: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleAddTicket = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/tickets', newTicket, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Tiket berhasil ditambahkan!');
      fetchTickets(newTicket.event_id);
      setNewTicket({ event_id: '', category: 'reguler', price: '', stock: '' });
    } catch (err) {
      alert('Gagal menambah tiket: ' + (err.response?.data?.message || err.message));
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
        <h1>Manajemen Acara Seminar</h1>
        <button onClick={handleLogout} style={{ float: 'right' }}>Logout</button>

        <h2>Tambah Acara Seminar</h2>
        <form onSubmit={handleAddEvent} style={{ marginBottom: '20px' }}>
          <input type="text" name="name" value={newEvent.name} onChange={handleEventInputChange} placeholder="Nama Acara" required />
          <textarea name="description" value={newEvent.description} onChange={handleEventInputChange} placeholder="Deskripsi" />
          <input type="datetime-local" name="date" value={newEvent.date} onChange={handleEventInputChange} required />
          <input type="text" name="location" value={newEvent.location} onChange={handleEventInputChange} placeholder="Lokasi" required />
          <input type="text" name="poster" value={newEvent.poster} onChange={handleEventInputChange} placeholder="URL Poster" />
          <button type="submit">Tambah Acara</button>
        </form>

        <h2>Tambah Tiket</h2>
        <form onSubmit={handleAddTicket} style={{ marginBottom: '20px' }}>
          <select name="event_id" value={newTicket.event_id} onChange={handleTicketInputChange} required>
            <option value="">Pilih Acara</option>
            {events.map(event => (
              <option key={event.id} value={event.id}>{event.name}</option>
            ))}
          </select>
          <select name="category" value={newTicket.category} onChange={handleTicketInputChange} required>
            <option value="reguler">Reguler</option>
            <option value="vip">VIP</option>
            <option value="vvip">VVIP</option>
          </select>
          <input type="number" name="price" value={newTicket.price} onChange={handleTicketInputChange} placeholder="Harga" required />
          <input type="number" name="stock" value={newTicket.stock} onChange={handleTicketInputChange} placeholder="Stok" required />
          <button type="submit">Tambah Tiket</button>
        </form>

        <h2>Daftar Acara Seminar dan Tiket</h2>
        {events.map(event => (
          <div key={event.id} style={{ marginBottom: '20px' }}>
            <h3>{event.name} - {new Date(event.date).toLocaleString()} - {event.location}</h3>
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

export default Seminar;