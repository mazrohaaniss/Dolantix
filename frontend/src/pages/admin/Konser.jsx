import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../../components/navbar';

const Konser = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ name: '', description: '', date: '', location: '', poster: '' });
  const [selectedEventId, setSelectedEventId] = useState('');
  const [tickets, setTickets] = useState({});
  const [ticketCategories, setTicketCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ category: '', price: '', stock: '' });
  const [activeTab, setActiveTab] = useState('add-event');
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
      setActiveTab('list-events'); // Switch to list view after adding
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
      setActiveTab('list-events'); // Switch to list view after adding
    } catch (err) {
      console.error('Gagal menambah tiket:', err.response?.data || err.message);
      alert('Gagal menambah tiket: ' + (err.response?.data?.message || err.message));
    }
  };


  return (
    <div className="flex bg-gray-50 min-h-screen items-center justify-center">
      <Sidebar />
      <div className="flex-1 p-25">
        <header className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-800">Manajemen Acara Konser</h1>
        </header>

        <div className="mb-6 border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('add-event')}
              className={`mr-6 py-4 px-1 ${
                activeTab === 'add-event'
                  ? 'border-b-2 border-blue-500 text-blue-600 font-medium'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } transition-colors duration-200`}
            >
              Tambah Acara
            </button>
            <button
              onClick={() => setActiveTab('add-tickets')}
              className={`mr-6 py-4 px-1 ${
                activeTab === 'add-tickets'
                  ? 'border-b-2 border-blue-500 text-blue-600 font-medium'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } transition-colors duration-200`}
            >
              Tambah Tiket
            </button>
            <button
              onClick={() => setActiveTab('list-events')}
              className={`mr-6 py-4 px-1 ${
                activeTab === 'list-events'
                  ? 'border-b-2 border-blue-500 text-blue-600 font-medium'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } transition-colors duration-200`}
            >
              Daftar Acara & Tiket
            </button>
          </nav>
        </div>
              
        <div className="bg-white rounded-lg shadow p-6 mb-6 min-h-[500px] flex flex-col">
        {activeTab === 'add-event' && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="font-medium text-lg text-gray-700">Tambah Acara Konser</h2>
            </div>
            <div className="p-6">
              <form onSubmit={handleAddEvent}>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nama Acara</label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={newEvent.name}
                    onChange={handleEventInputChange}
                    placeholder="Masukkan nama acara"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                  <textarea
                    id="description"
                    name="description"
                    value={newEvent.description}
                    onChange={handleEventInputChange}
                    placeholder="Masukkan deskripsi acara"
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Tanggal & Waktu</label>
                    <input
                      id="date"
                      type="datetime-local"
                      name="date"
                      value={newEvent.date}
                      onChange={handleEventInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Lokasi</label>
                    <input
                      id="location"
                      type="text"
                      name="location"
                      value={newEvent.location}
                      onChange={handleEventInputChange}
                      placeholder="Masukkan lokasi"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label htmlFor="poster" className="block text-sm font-medium text-gray-700 mb-1">URL Poster</label>
                  <input
                    id="poster"
                    type="text"
                    name="poster"
                    value={newEvent.poster}
                    onChange={handleEventInputChange}
                    placeholder="Masukkan URL poster"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Tambah Acara
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'add-tickets' && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="font-medium text-lg text-gray-700">Tambah Tiket</h2>
            </div>
            <div className="p-6">
              <form onSubmit={handleSaveTickets}>
                <div className="mb-6">
                  <label htmlFor="event" className="block text-sm font-medium text-gray-700 mb-1">Pilih Acara</label>
                  <select
                    id="event"
                    value={selectedEventId}
                    onChange={(e) => setSelectedEventId(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">-- Pilih Acara --</option>
                    {events.map(event => (
                      <option key={event.id} value={event.id}>{event.name}</option>
                    ))}
                  </select>
                </div>
                
                {selectedEventId && (
                  <>
                    <div className="mb-6 pb-6 border-b border-gray-200">
                      <h3 className="text-lg font-medium text-gray-700 mb-4">Tambah Kategori Tiket</h3>
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        <div className="md:col-span-5">
                          <input
                            type="text"
                            name="category"
                            value={newCategory.category}
                            onChange={handleCategoryInputChange}
                            placeholder="Jenis Tiket (contoh: Reguler)"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div className="md:col-span-3">
                          <input
                            type="number"
                            name="price"
                            value={newCategory.price}
                            onChange={handleCategoryInputChange}
                            placeholder="Harga (Rp)"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <input
                            type="number"
                            name="stock"
                            value={newCategory.stock}
                            onChange={handleCategoryInputChange}
                            placeholder="Stok"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <button
                            type="button"
                            onClick={handleAddCategory}
                            className="w-full px-3 py-2 border border-transparent rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          >
                            Tambah
                          </button>
                        </div>
                      </div>
                    </div>

                    {ticketCategories.length > 0 && (
                      <div>
                        <h4 className="text-md font-medium text-gray-700 mb-4">Kategori Tiket yang Ditambahkan</h4>
                        <div className="overflow-x-auto -mx-6">
                          <div className="inline-block min-w-full px-6">
                            <div className="overflow-hidden border border-gray-200 rounded-lg">
                              <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                  <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Jenis Tiket
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Harga (Rp)
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Stok
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Aksi
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                  {ticketCategories.map((ticket, index) => (
                                    <tr key={index}>
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{ticket.category}</div>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                          {parseFloat(ticket.price).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                                        </div>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{ticket.stock}</div>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                        <button
                                          type="button"
                                          onClick={() => handleRemoveCategory(index)}
                                          className="text-red-600 hover:text-red-900 focus:outline-none"
                                        >
                                          Hapus
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                        <div className="mt-6">
                          <button
                            type="submit"
                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            Simpan Tiket
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </form>
            </div>
          </div>
        )}

        {activeTab === 'list-events' && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="font-medium text-lg text-gray-700">Daftar Acara dan Tiket</h2>
            </div>
            <div className="p-6">
              {events.length === 0 ? (
                <div className="text-center py-8 text-gray-500">Tidak ada acara konser saat ini.</div>
              ) : (
                <div className="space-y-6">
                  {events.map(event => (
                    <div key={event.id} className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                        <h3 className="font-medium text-lg text-gray-800 mb-2">{event.name}</h3>
                        <div className="flex flex-col md:flex-row md:gap-6 text-sm text-gray-500">
                          <div>
                            <span className="inline-block mr-2">🗓️</span>
                            <span>{new Date(event.date).toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="inline-block mr-2">📍</span>
                            <span>{event.location}</span>
                          </div>
                        </div>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Jenis Tiket
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Harga (Rp)
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Stok
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {(tickets[event.id] || []).length === 0 ? (
                              <tr>
                                <td colSpan="3" className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                                  Belum ada tiket untuk acara ini
                                </td>
                              </tr>
                            ) : (
                              (tickets[event.id] || []).map(ticket => (
                                <tr key={ticket.id}>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{ticket.category}</div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">
                                      {ticket.price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{ticket.stock}</div>
                                  </td>
                                </tr>
                              ))
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
        )}
      </div>
    </div>
    </div>
  );
};

export default Konser;