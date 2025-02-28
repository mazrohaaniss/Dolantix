import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';

const Konser = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ name: '', description: '', date: '', location: '', poster: '' });
  const [selectedEventId, setSelectedEventId] = useState('');
  const [tickets, setTickets] = useState({});
  const [ticketCategories, setTicketCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ category: '', price: '', stock: '' });
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
      const res = await axios.get('/api/konser/admin', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Data acara konser dari server:', res.data);
      setEvents(res.data);
      res.data.forEach(event => fetchTickets(event.id));
    } catch (err) {
      console.error('Gagal mengambil acara:', err.response?.status, err.response?.data || err.message);
    }
  };

  const fetchTickets = async (eventId) => {
    try {
      const res = await axios.get(`/api/tickets/${eventId}/konser`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTickets(prev => ({ ...prev, [eventId]: res.data }));
    } catch (err) {
      console.error('Gagal mengambil tiket:', err.response?.data || err.message);
    }
  };

  const handleEventInputChange = (e) => {
    setNewEvent({ ...newEvent, [e.target.name]: e.target.value });
  };

  const handleCategoryInputChange = (e) => {
    setNewCategory({ ...newCategory, [e.target.name]: e.target.value });
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/konser', newEvent, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Respon:', res.data);
      alert('Acara konser berhasil ditambahkan!');
      fetchEvents();
      setNewEvent({ name: '', description: '', date: '', location: '', poster: '' });
    } catch (err) {
      console.error('Gagal menambah acara:', err.response?.status, err.response?.data || err.message);
      alert('Gagal menambah acara: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleAddCategory = () => {
    if (!newCategory.category || !newCategory.price || !newCategory.stock) {
      alert('Isi semua kolom untuk kategori tiket!');
      return;
    }
    setTicketCategories([...ticketCategories, { ...newCategory }]);
    setNewCategory({ category: '', price: '', stock: '' });
  };

  const handleRemoveCategory = (index) => {
    setTicketCategories(ticketCategories.filter((_, i) => i !== index));
  };

  const handleSaveTickets = async (e) => {
    e.preventDefault();
    if (!selectedEventId) {
      alert('Pilih acara terlebih dahulu!');
      return;
    }
    if (ticketCategories.length === 0) {
      alert('Tambah setidaknya satu kategori tiket!');
      return;
    }

    const ticketData = {
      event_id: selectedEventId,
      event_category: 'konser',
      tickets: ticketCategories.map(ticket => ({
        category: ticket.category,
        price: parseFloat(ticket.price),
        stock: parseInt(ticket.stock, 10)
      }))
    };

    console.log('Mengirim tiket:', ticketData);

    try {
      const res = await axios.post('/api/tickets/multiple', ticketData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Respon:', res.data);
      alert('Semua tiket berhasil ditambahkan!');
      fetchTickets(selectedEventId);
      setTicketCategories([]);
      setSelectedEventId('');
    } catch (err) {
      console.error('Gagal menambah tiket:', err.response?.data || err.message);
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
        <h1>Manajemen Acara Konser</h1>
        <button onClick={handleLogout} style={{ float: 'right' }}>Logout</button>

        <h2>Tambah Acara Konser</h2>
        <form onSubmit={handleAddEvent} style={{ marginBottom: '20px' }}>
          <input
            type="text"
            name="name"
            value={newEvent.name}
            onChange={handleEventInputChange}
            placeholder="Nama Acara"
            required
            style={{ display: 'block', margin: '5px 0', width: '300px' }}
          />
          <textarea
            name="description"
            value={newEvent.description}
            onChange={handleEventInputChange}
            placeholder="Deskripsi"
            style={{ display: 'block', margin: '5px 0', width: '300px' }}
          />
          <input
            type="datetime-local"
            name="date"
            value={newEvent.date}
            onChange={handleEventInputChange}
            required
            style={{ display: 'block', margin: '5px 0', width: '300px' }}
          />
          <input
            type="text"
            name="location"
            value={newEvent.location}
            onChange={handleEventInputChange}
            placeholder="Lokasi"
            required
            style={{ display: 'block', margin: '5px 0', width: '300px' }}
          />
          <input
            type="text"
            name="poster"
            value={newEvent.poster}
            onChange={handleEventInputChange}
            placeholder="URL Poster"
            style={{ display: 'block', margin: '5px 0', width: '300px' }}
          />
          <button type="submit">Tambah Acara</button>
        </form>

        <h2>Tambah Tiket</h2>
        <form onSubmit={handleSaveTickets} style={{ marginBottom: '20px' }}>
          <select
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            required
            style={{ display: 'block', margin: '5px 0', width: '300px' }}
          >
            <option value="">Pilih Acara</option>
            {events.map(event => (
              <option key={event.id} value={event.id}>{event.name}</option>
            ))}
          </select>
          {selectedEventId && (
            <>
              <h3>Tambah Kategori Tiket</h3>
              <div style={{ marginBottom: '10px' }}>
                <input
                  type="text"
                  name="category"
                  value={newCategory.category}
                  onChange={handleCategoryInputChange}
                  placeholder="Jenis Tiket (contoh: Reguler)"
                  style={{ display: 'inline-block', margin: '5px 10px 5px 0', width: '150px' }}
                />
                <input
                  type="number"
                  name="price"
                  value={newCategory.price}
                  onChange={handleCategoryInputChange}
                  placeholder="Harga (Rp)"
                  style={{ display: 'inline-block', margin: '5px 10px 5px 0', width: '100px' }}
                />
                <input
                  type="number"
                  name="stock"
                  value={newCategory.stock}
                  onChange={handleCategoryInputChange}
                  placeholder="Stok"
                  style={{ display: 'inline-block', margin: '5px 10px 5px 0', width: '80px' }}
                />
                <button type="button" onClick={handleAddCategory} style={{ padding: '5px 10px' }}>
                  Tambah Kategori
                </button>
              </div>

              {ticketCategories.length > 0 && (
                <>
                  <h4>Kategori Tiket yang Ditambahkan</h4>
                  <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '10px' }}>
                    <thead>
                      <tr>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Jenis Tiket</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Harga (Rp)</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Stok</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ticketCategories.map((ticket, index) => (
                        <tr key={index}>
                          <td style={{ border: '1px solid #ddd', padding: '8px' }}>{ticket.category}</td>
                          <td style={{ border: '1px solid #ddd', padding: '8px' }}>{parseFloat(ticket.price).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</td>
                          <td style={{ border: '1px solid #ddd', padding: '8px' }}>{ticket.stock}</td>
                          <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                            <button type="button" onClick={() => handleRemoveCategory(index)}>Hapus</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <button type="submit">OK - Simpan Tiket</button>
                </>
              )}
            </>
          )}
        </form>

        <h2>Daftar Acara dan Tiket</h2>
        {events.length === 0 ? (
          <p>Tidak ada acara konser saat ini.</p>
        ) : (
          events.map(event => (
            <div key={event.id} style={{ marginBottom: '20px' }}>
              <h3>{event.name} - {new Date(event.date).toLocaleString()} - {event.location}</h3>
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
          ))
        )}
      </div>
    </div>
  );
};

export default Konser;