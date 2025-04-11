import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserNavbar from "../../components/UserNavbar";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [allEvents, setAllEvents] = useState([]);
  const [tickets, setTickets] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const username = localStorage.getItem('username');

  useEffect(() => {
    if (!token || role !== 'user') {
      navigate('/');
    } else {
      fetchAllEvents();
    }
  }, [navigate, token, role]);

  const fetchAllEvents = async () => {
    try {
      const [seminar, olahraga, konser, festival, ticketsRes] = await Promise.all([
        axios.get('/api/seminar'),
        axios.get('/api/olahraga'),
        axios.get('/api/konser'),
        axios.get('/api/festival'),
        axios.get('/api/tickets', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
  
      const eventsWithCategory = [
        ...seminar.data.map(e => ({ ...e, category: 'seminar' })),
        ...olahraga.data.map(e => ({ ...e, category: 'olahraga' })),
        ...konser.data.map(e => ({ ...e, category: 'konser' })),
        ...festival.data.map(e => ({ ...e, category: 'festival' }))
      ];
  
      setAllEvents(eventsWithCategory);
      console.log("✅ Fetched Events:", eventsWithCategory);
  
      const allTickets = ticketsRes.data;
      console.log("🎟️ All Tickets:", allTickets);
  
      // Group by event_id
      const ticketMap = {};
      allTickets.forEach(ticket => {
        if (!ticketMap[ticket.event_id]) {
          ticketMap[ticket.event_id] = [];
        }
        ticketMap[ticket.event_id].push(ticket);
      });
  
      setTickets(ticketMap);
      console.log("✅ Grouped Tickets by Event ID:", ticketMap);
    } catch (err) {
      console.error('❌ Gagal mengambil acara atau tiket:', err);
    }
  };
  
  

  const handleBuyTicket = async (eventId, ticket, category) => {
    const orderData = {
      event_id: eventId,
      ticket_id: ticket.id,
      event_category: category,
      ticket_category: ticket.category,
      price: ticket.price
    };

    try {
      await axios.post('/api/orders', orderData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(`Pesanan untuk tiket ${ticket.category} berhasil dibuat! Status: Pending`);
    } catch (err) {
      alert('Gagal membuat pesanan: ' + (err.response?.data?.message || err.message));
    }
  };

  const filteredEvents = allEvents.filter(event => {
    const searchLower = searchQuery.toLowerCase();
    return (
      event.name.toLowerCase().includes(searchLower) ||
      event.description?.toLowerCase().includes(searchLower) ||
      event.location.toLowerCase().includes(searchLower) ||
      event.category.toLowerCase().includes(searchLower)
    );
  });

  const groupEventsByCategory = filteredEvents.reduce((acc, event) => {
    if (!acc[event.category]) {
      acc[event.category] = [];
    }
    acc[event.category].push(event);
    return acc;
  }, {});

  return (
    <div className="container mx-auto px-4 lg:px-25 py-6 pt-24 max-w-full bg-gray-50">
      <UserNavbar username={username} />

      <div className="mb-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 pb-4 border-b border-gray-200 gap-4">
          <h2 className="text-2xl font-bold text-gray-800">Daftar Acara</h2>
          <input
            type="text"
            placeholder="Cari acara..."
            className="w-full md:w-[25%] px-4 py-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {Object.entries(groupEventsByCategory).map(([category, events]) => (
          <div key={category} className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 capitalize">
              {category}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {events.map((event) => (
                <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <img
                    src={event.poster || "https://via.placeholder.com/400x200"}
                    alt={event.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{event.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{event.description || "Tanpa deskripsi"}</p>

                    <div className="flex flex-col space-y-2 mb-4">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        <span className="text-gray-700 text-sm">{new Date(event.date).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                        <span className="text-gray-700 text-sm">{event.location}</span>
                      </div>
                    </div>

                    <div className="border-t pt-3">
                      <h4 className="font-semibold text-sm text-gray-700 mb-2">Tiket Tersedia:</h4>
                      <div className="space-y-3">
                        {(tickets[event.id] || []).map((ticket) => (
                          <div key={ticket.id} className="bg-gray-50 p-2 rounded">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-medium text-gray-800">{ticket.category}</span>
                              <span className="text-blue-600 font-bold">
                                {ticket.price.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-500">Stok: {ticket.stock}</span>
                              <button
                                onClick={() => handleBuyTicket(event.id, ticket, event.category)}
                                disabled={ticket.stock === 0}
                                className={`px-3 py-1 text-xs rounded font-medium ${
                                  ticket.stock > 0
                                    ? "bg-green-500 text-white hover:bg-green-600"
                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                } transition-colors`}
                              >
                                {ticket.stock > 0 ? "Beli Tiket" : "Stok Habis"}
                              </button>
                            </div>
                          </div>
                        ))}
                        {!tickets[event.id] && (
                          <div className="text-center py-2 text-gray-500 text-sm">Memuat tiket...</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {filteredEvents.length === 0 && (
          <div className="text-center py-8 text-gray-500">Tidak ditemukan acara yang sesuai</div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;