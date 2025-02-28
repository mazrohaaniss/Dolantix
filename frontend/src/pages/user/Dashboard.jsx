import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();
  const [olahragaEvents, setOlahragaEvents] = useState([]);
  const [tickets, setTickets] = useState({});
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const username = localStorage.getItem('username');

  useEffect(() => {
    if (!token || role !== 'user') {
      navigate('/');
    } else {
      fetchOlahragaEvents();
    }
  }, [navigate, token, role]);

  const fetchOlahragaEvents = async () => {
    try {
      const res = await axios.get('/api/olahraga');
      setOlahragaEvents(res.data);
      res.data.forEach(event => fetchTickets(event.id));
    } catch (err) {
      console.error('Gagal mengambil acara olahraga:', err);
    }
  };

  const fetchTickets = async (eventId) => {
    try {
      const res = await axios.get(`/api/tickets/${eventId}/olahraga`);
      setTickets(prev => ({ ...prev, [eventId]: res.data }));
    } catch (err) {
      console.error('Gagal mengambil tiket:', err);
    }
  };

  const handleBuyTicket = async (eventId, ticket) => {
    const orderData = {
      event_id: eventId,
      event_category: 'olahraga',
      ticket_category: ticket.category,
      price: ticket.price
    };

    try {
      const res = await axios.post('/api/orders', orderData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(`Pesanan untuk tiket ${ticket.category} berhasil dibuat! Status: Pending`);
    } catch (err) {
      alert('Gagal membuat pesanan: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/', { replace: true });
  };

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      <h1>Dolantix - Selamat Datang {username}</h1>
      <button onClick={handleLogout} style={{ float: 'right' }}>Logout</button>
      <button onClick={() => navigate('/orders')} style={{ marginRight: '10px' }}>Lihat Pesanan</button>

      <h2>Daftar Acara Olahraga</h2>
      <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
        {olahragaEvents.map(event => (
          <div key={event.id} style={{ border: '1px solid #ddd', padding: '10px', borderRadius: '5px' }}>
            <img src={event.poster || 'https://via.placeholder.com/150'} alt={event.name} style={{ width: '100%' }} />
            <h3>{event.name}</h3>
            <p>{event.description || 'Tanpa deskripsi'}</p>
            <p><strong>Tanggal:</strong> {new Date(event.date).toLocaleString()}</p>
            <p><strong>Lokasi:</strong> {event.location}</p>
            <h4>Tiket Tersedia:</h4>
            {(tickets[event.id] || []).map(ticket => (
              <div key={ticket.id}>
                <p>{ticket.category} - {ticket.price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })} - Stok: {ticket.stock}</p>
                <button
                  onClick={() => handleBuyTicket(event.id, ticket)}
                  disabled={ticket.stock === 0}
                >
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