import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';

const Seminar = () => {
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
      const res = await axios.get('/api/seminar/admin', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Data acara seminar dari server:', res.data);
      setEvents(res.data);
      res.data.forEach(event => fetchTickets(event.id));
    } catch (err) {
      console.error('Gagal mengambil acara:', err.response?.status, err.response?.data || err.message);
    }
  };

  const fetchTickets = async (eventId) => {
    try {
      const res = await axios.get(`/api/tickets/${eventId}/seminar`, {
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
      const res = await axios.post('/api/seminar', newEvent, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Respon:', res.data);
      alert('Acara seminar berhasil ditambahkan!');
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
      event_category: 'seminar',
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
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-56 p-6 flex-1">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Manajemen Acara Seminar</h1>
          <button 
            onClick={handleLogout} 
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Add Seminar Form */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Tambah Acara Seminar</h2>
          <form onSubmit={handleAddEvent}>
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  name="name"
                  value={newEvent.name}
                  onChange={handleEventInputChange}
                  placeholder="Nama Acara"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <textarea
                  name="description"
                  value={newEvent.description}
                  onChange={handleEventInputChange}
                  placeholder="Deskripsi"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="datetime-local"
                    name="date"
                    value={newEvent.date}
                    onChange={handleEventInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="location"
                    value={newEvent.location}
                    onChange={handleEventInputChange}
                    placeholder="Lokasi"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <input
                  type="text"
                  name="poster"
                  value={newEvent.poster}
                  onChange={handleEventInputChange}
                  placeholder="URL Poster"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  Tambah Acara
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Add Tickets Form */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Tambah Tiket</h2>
          <form onSubmit={handleSaveTickets}>
            <div className="space-y-4">
              <div>
                <select
                  value={selectedEventId}
                  onChange={(e) => setSelectedEventId(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Pilih Acara</option>
                  {events.map(event => (
                    <option key={event.id} value={event.id}>{event.name}</option>
                  ))}
                </select>
              </div>
              
              {selectedEventId && (
                <>
                  <h3 className="text-lg font-medium text-gray-700 mt-4">Tambah Kategori Tiket</h3>
                  <div className="flex flex-wrap items-end gap-3">
                    <div>
                      <input
                        type="text"
                        name="category"
                        value={newCategory.category}
                        onChange={handleCategoryInputChange}
                        placeholder="Jenis Tiket (contoh: Reguler)"
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        name="price"
                        value={newCategory.price}
                        onChange={handleCategoryInputChange}
                        placeholder="Harga (Rp)"
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        name="stock"
                        value={newCategory.stock}
                        onChange={handleCategoryInputChange}
                        placeholder="Stok"
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <button 
                      type="button" 
                      onClick={handleAddCategory}
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                    >
                      Tambah Kategori
                    </button>
                  </div>

                  {ticketCategories.length > 0 && (
                    <>
                      <h4 className="text-md font-medium text-gray-700 mt-4">Kategori Tiket yang Ditambahkan</h4>
                      <div className="overflow-x-auto rounded-lg border border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Jenis Tiket
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Harga (Rp)
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Stok
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Aksi
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {ticketCategories.map((ticket, index) => (
                              <tr key={index}>
                                <td className="px-6 py-4 whitespace-nowrap">{ticket.category}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  {parseFloat(ticket.price).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">{ticket.stock}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <button 
                                    type="button" 
                                    onClick={() => handleRemoveCategory(index)}
                                    className="text-red-600 hover:text-red-900"
                                  >
                                    Hapus
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="mt-4">
                        <button 
                          type="submit"
                          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                        >
                          OK - Simpan Tiket
                        </button>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </form>
        </div>

        {/* Event List */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Daftar Acara dan Tiket</h2>
          {events.length === 0 ? (
            <p className="text-gray-500">Tidak ada acara seminar saat ini.</p>
          ) : (
            <div className="space-y-6">
              {events.map(event => (
                <div key={event.id} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-700 mb-3">
                    {event.name} - {new Date(event.date).toLocaleString()} - {event.location}
                  </h3>
                  <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Jenis Tiket
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Harga (Rp)
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Stok
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {(tickets[event.id] || []).length > 0 ? (
                          (tickets[event.id] || []).map(ticket => (
                            <tr key={ticket.id}>
                              <td className="px-6 py-4 whitespace-nowrap">{ticket.category}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {ticket.price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">{ticket.stock}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                              Belum ada tiket untuk acara ini
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Seminar;