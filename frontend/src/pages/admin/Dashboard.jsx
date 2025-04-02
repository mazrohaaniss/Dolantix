import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../../components/navbar';

const Dashboard = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [tickets, setTickets] = useState({});
  const [pendingOrders, setPendingOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  useEffect(() => {
    if (!token || role !== 'admin') {
      navigate('/');
    } else {
      fetchData();
    }
  }, [navigate, token, role]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        fetchEvents(),
        fetchPendingOrders()
      ]);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      const res = await axios.get('/api/olahraga/admin', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEvents(res.data);
      
      // Fetch tickets for each event
      const ticketPromises = res.data.map(event => fetchTickets(event.id));
      await Promise.all(ticketPromises);
    } catch (err) {
      console.error('Failed to fetch events:', err.response?.status, err.response?.data || err.message);
    }
  };

  const fetchTickets = async (eventId) => {
    try {
      const res = await axios.get(`/api/tickets/${eventId}/olahraga`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTickets(prev => ({ ...prev, [eventId]: res.data }));
    } catch (err) {
      console.error('Failed to fetch tickets:', err.response?.data || err.message);
    }
  };

  const fetchPendingOrders = async () => {
    try {
      const res = await axios.get('/api/orders/pending', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPendingOrders(res.data);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    }
  };

  const handleApproveOrder = async (orderId) => {
    try {
      await axios.put(`/api/orders/approve/${orderId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Order approved successfully!');
      fetchPendingOrders();
    } catch (err) {
      alert('Failed to approve order: ' + (err.response?.data?.message || err.message));
    }
  };


  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-gray-50 min-h-screen items-center justify-center">
      <Sidebar />
      <div className="flex-1 p-25">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
              <h1 className="text-3xl font-bold text-gray-800">Dolantix Admin Dashboard</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-gray-500 text-sm font-medium mb-2">Total Events</h3>
              <p className="text-3xl font-bold text-blue-600">{events.length}</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-gray-500 text-sm font-medium mb-2">Latest Event</h3>
              <p className="text-lg font-semibold">
                {events.length > 0 ? events[events.length - 1].name : 'No events yet'}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-gray-500 text-sm font-medium mb-2">Pending Orders</h3>
              <p className="text-3xl font-bold text-orange-500">{pendingOrders.length}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Sports Events & Tickets</h2>
            </div>

            {events.length === 0 ? (
              <div className="p-6 text-center text-gray-500">No events found</div>
            ) : (
              <div className="divide-y divide-gray-200">
                {events.map(event => (
                  <div key={event.id} className="p-6">
                    <div className="flex flex-wrap items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">{event.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        event.status === 'active' ? 'bg-green-100 text-green-800' : 
                        event.status === 'upcoming' ? 'bg-blue-100 text-blue-800' : 
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {event.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
                      <div>
                        <span className="block text-gray-500">Date & Time</span>
                        <span className="font-medium">{new Date(event.date).toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="block text-gray-500">Location</span>
                        <span className="font-medium">{event.location}</span>
                      </div>
                      <div>
                        <span className="block text-gray-500">Event ID</span>
                        <span className="font-medium">{event.id}</span>
                      </div>
                    </div>

                    <div className="mt-4">
                      <h4 className="font-medium text-gray-700 mb-2">Tickets</h4>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead>
                            <tr>
                              <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket Type</th>
                              <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                              <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Available Stock</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {(tickets[event.id] || []).map(ticket => (
                              <tr key={ticket.id}>
                                <td className="px-4 py-3 whitespace-nowrap">{ticket.category}</td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  {ticket.price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    ticket.stock > 10 ? 'bg-green-100 text-green-800' : 
                                    ticket.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 
                                    'bg-red-100 text-red-800'
                                  }`}>
                                    {ticket.stock}
                                  </span>
                                </td>
                              </tr>
                            ))}
                            {(tickets[event.id] || []).length === 0 && (
                              <tr>
                                <td colSpan="3" className="px-4 py-8 text-center text-gray-500">
                                  No tickets available for this event yet
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Pending Orders</h2>
            </div>

            {pendingOrders.length === 0 ? (
              <div className="p-6 text-center text-gray-500">No pending orders</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                      <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                      <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket Type</th>
                      <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {pendingOrders.map(order => (
                      <tr key={order.id}>
                        <td className="px-4 py-3 whitespace-nowrap">{order.user_id}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {order.event_id}
                          <span className="ml-1 text-xs text-gray-500">({order.event_category})</span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">{order.ticket_category}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {order.price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <button
                            onClick={() => handleApproveOrder(order.id)}
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition-colors duration-200 text-sm"
                          >
                            Approve
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
    </div>
  );
};

export default Dashboard;