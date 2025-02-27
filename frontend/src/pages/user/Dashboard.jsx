import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [tickets, setTickets] = useState({});
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const username = localStorage.getItem('username');

  useEffect(() => {
    if (!token || role !== 'user') {
      navigate('/');
    } else {
      fetchEvents();
    }
  }, [navigate, token, role]);

  const fetchEvents = async () => {
    try {
      const res = await axios.get('/api/events');
      setEvents(res.data);
      res.data.forEach(event => fetchTickets(event.id));
    } catch (err) {
      console.error('Gagal mengambil acara:', err);
    }
  };

  const fetchTickets = async (eventId) => {
    try {
      const res = await axios.get(`/api/tickets/event/${eventId}`);
      setTickets(prev => ({ ...prev, [eventId]: res.data }));
    } catch (err) {
      console.error('Gagal mengambil tiket:', err);
    }
  };

  const handleBuyTicket = (ticketId) => {
    alert(`Berhasil membeli tiket dengan ID ${ticketId}! (Fitur pembayaran belum diimplementasi)`);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/', { replace: true });
  };

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      <h1>Dolantix - Selamat Datang {username}</h1>
      <button onClick={handleLogout} style={{ float: 'right' }}>Logout</button>

      <h2>Daftar Acara di Semarang</h2>
      <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
        {events.map(event => (
          <div key={event.id} style={{ border: '1px solid #ddd', padding: '10px', borderRadius: '5px' }}>
            <img src={event.poster || 'https://via.placeholder.com/150'} alt={event.name} style={{ width: '100%' }} />
            <h3>{event.name}</h3>
            <p>{event.description || 'Tanpa deskripsi'}</p>
            <p><strong>Tanggal:</strong> {new Date(event.date).toLocaleString()}</p>
            <p><strong>Lokasi:</strong> {event.location}</p>
            <h4>Tiket Tersedia:</h4>
            {(tickets[event.id] || []).map(ticket => (
              <div key={ticket.id}>
                <p>{ticket.category} - Rp {ticket.price} - Stok: {ticket.stock}</p>
                <button onClick={() => handleBuyTicket(ticket.id)} disabled={ticket.stock === 0}>
                  {ticket.stock > 0 ? 'Beli Tiket' : 'Stok Habis'}
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;