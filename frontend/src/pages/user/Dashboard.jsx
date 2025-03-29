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
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold text-blue-600">Dolantix</h1>
        <div className="flex items-center space-x-2">
          <span className="text-gray-700">Selamat Datang, <span className="font-semibold">{username}</span></span>
          <button 
            onClick={() => navigate('/orders')} 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Lihat Pesanan
          </button>
          <button 
            onClick={handleLogout} 
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Events Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Daftar Acara Olahraga</h2>
        
        {olahragaEvents.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Memuat acara olahraga...
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {olahragaEvents.map(event => (
            <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <img 
                src={event.poster || 'https://via.placeholder.com/400x200'} 
                alt={event.name} 
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{event.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{event.description || 'Tanpa deskripsi'}</p>
                
                <div className="flex flex-col space-y-2 mb-4">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <span className="text-gray-700 text-sm">{new Date(event.date).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    <span className="text-gray-700 text-sm">{event.location}</span>
                  </div>
                </div>

                <div className="border-t pt-3">
                  <h4 className="font-semibold text-sm text-gray-700 mb-2">Tiket Tersedia:</h4>
                  <div className="space-y-3">
                    {(tickets[event.id] || []).map(ticket => (
                      <div key={ticket.id} className="bg-gray-50 p-2 rounded">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium text-gray-800">{ticket.category}</span>
                          <span className="text-blue-600 font-bold">
                            {ticket.price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">Stok: {ticket.stock}</span>
                          <button
                            onClick={() => handleBuyTicket(event.id, ticket)}
                            disabled={ticket.stock === 0}
                            className={`px-3 py-1 text-xs rounded font-medium ${
                              ticket.stock > 0 
                                ? 'bg-green-500 text-white hover:bg-green-600' 
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            } transition-colors`}
                          >
                            {ticket.stock > 0 ? 'Beli Tiket' : 'Stok Habis'}
                          </button>
                        </div>
                      </div>
                    ))}
                    {!tickets[event.id] && (
                      <div className="text-center py-2 text-gray-500 text-sm">
                        Memuat tiket...
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;