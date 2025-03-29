import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../../components/navbar';

const Olahraga = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ name: '', description: '', date: '', location: '', poster: '' });
  const [selectedEventId, setSelectedEventId] = useState('');
  const [tickets, setTickets] = useState({});
  const [ticketCategories, setTicketCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ category: '', price: '', stock: '' });
  const [activeTab, setActiveTab] = useState('addEvent'); // For tab navigation
  const [isLoading, setIsLoading] = useState(true);
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
    setIsLoading(true);
    try {
      const res = await axios.get('/api/olahraga/admin', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEvents(res.data);
      
      // Fetch tickets for all events in parallel
      await Promise.all(res.data.map(event => fetchTickets(event.id)));
    } catch (err) {
      console.error('Failed to fetch events:', err.response?.status, err.response?.data || err.message);
    } finally {
      setIsLoading(false);
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

  const handleEventInputChange = (e) => {
    setNewEvent({ ...newEvent, [e.target.name]: e.target.value });
  };

  const handleCategoryInputChange = (e) => {
    setNewCategory({ ...newCategory, [e.target.name]: e.target.value });
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/olahraga', newEvent, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Sport event added successfully!');
      fetchEvents();
      setNewEvent({ name: '', description: '', date: '', location: '', poster: '' });
      setActiveTab('addTicket'); // Switch to ticket tab after adding event
    } catch (err) {
      alert('Failed to add event: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleAddCategory = () => {
    if (!newCategory.category || !newCategory.price || !newCategory.stock) {
      alert('Please fill all ticket category fields!');
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
      alert('Please select an event first!');
      return;
    }
    if (ticketCategories.length === 0) {
      alert('Please add at least one ticket category!');
      return;
    }

    const ticketData = {
      event_id: selectedEventId,
      event_category: 'olahraga',
      tickets: ticketCategories.map(ticket => ({
        category: ticket.category,
        price: parseFloat(ticket.price),
        stock: parseInt(ticket.stock, 10)
      }))
    };

    try {
      await axios.post('/api/tickets/multiple', ticketData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('All tickets added successfully!');
      fetchTickets(selectedEventId);
      setTicketCategories([]);
      setSelectedEventId('');
      setActiveTab('eventList'); // Switch to list view after adding tickets
    } catch (err) {
      alert('Failed to add tickets: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/', { replace: true });
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading sports events data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-gray-50 min-h-screen items-center justify-center">
      <Sidebar />
      <div className="flex-1 p-25">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
    
          <h1 className="text-3xl font-bold text-gray-800">Sports Events Management</h1>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`py-3 px-6 ${activeTab === 'addEvent' 
              ? 'border-b-2 border-blue-500 text-blue-600 font-medium' 
              : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('addEvent')}
          >
            Add New Event
          </button>
          <button
            className={`py-3 px-6 ${activeTab === 'addTicket' 
              ? 'border-b-2 border-blue-500 text-blue-600 font-medium' 
              : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('addTicket')}
          >
            Manage Tickets
          </button>
          <button
            className={`py-3 px-6 ${activeTab === 'eventList' 
              ? 'border-b-2 border-blue-500 text-blue-600 font-medium' 
              : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('eventList')}
          >
            Events & Tickets List
          </button>
        </div>

        {/* Add Event Form */}
        <div className="bg-white rounded-lg shadow p-6 mb-6 min-h-[500px] flex flex-col">
  {activeTab === 'addEvent' && (
    <div className="flex-1">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Sports Event</h2>
      <form onSubmit={handleAddEvent} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Name</label>
                <input
                  type="text"
                  name="name"
                  value={newEvent.name}
                  onChange={handleEventInputChange}
                  placeholder="Enter event name"
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={newEvent.description}
                  onChange={handleEventInputChange}
                  placeholder="Enter event description"
                  rows="3"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
                  <input
                    type="datetime-local"
                    name="date"
                    value={newEvent.date}
                    onChange={handleEventInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={newEvent.location}
                    onChange={handleEventInputChange}
                    placeholder="Enter venue/location"
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Poster URL</label>
                <input
                  type="text"
                  name="poster"
                  value={newEvent.poster}
                  onChange={handleEventInputChange}
                  placeholder="Enter poster image URL"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="flex justify-end">
                <button 
                  type="submit" 
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors duration-200"
                >
                  Add Event
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Add Tickets Form */}
        {activeTab === 'addTicket' && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Manage Event Tickets</h2>
            <form onSubmit={handleSaveTickets} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Event</label>
                <select
                  value={selectedEventId}
                  onChange={(e) => setSelectedEventId(e.target.value)}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">-- Select an event --</option>
                  {events.map(event => (
                    <option key={event.id} value={event.id}>
                      {event.name} - {new Date(event.date).toLocaleDateString()}
                    </option>
                  ))}
                </select>
              </div>
              
              {selectedEventId && (
                <>
                  <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                    <h3 className="text-md font-medium text-gray-700 mb-3">Add Ticket Category</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-sm text-gray-500 mb-1">Ticket Type</label>
                        <input
                          type="text"
                          name="category"
                          value={newCategory.category}
                          onChange={handleCategoryInputChange}
                          placeholder="e.g. VIP, Regular"
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm text-gray-500 mb-1">Price (Rp)</label>
                        <input
                          type="number"
                          name="price"
                          value={newCategory.price}
                          onChange={handleCategoryInputChange}
                          placeholder="Price in IDR"
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm text-gray-500 mb-1">Available Stock</label>
                        <input
                          type="number"
                          name="stock"
                          value={newCategory.stock}
                          onChange={handleCategoryInputChange}
                          placeholder="Quantity"
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <button 
                        type="button" 
                        onClick={handleAddCategory}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 rounded text-sm transition-colors duration-200"
                      >
                        Add Category
                      </button>
                    </div>
                  </div>
                  
                  {ticketCategories.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-700 mb-2">Added Ticket Categories</h4>
                      <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket Type</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {ticketCategories.map((ticket, index) => (
                              <tr key={index}>
                                <td className="px-4 py-3 whitespace-nowrap">{ticket.category}</td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  {parseFloat(ticket.price).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">{ticket.stock}</td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <button 
                                    type="button" 
                                    onClick={() => handleRemoveCategory(index)}
                                    className="text-red-500 hover:text-red-700 transition-colors duration-200"
                                  >
                                    Remove
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      
                      <div className="mt-4 flex justify-end">
                        <button 
                          type="submit"
                          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors duration-200"
                        >
                          Save All Tickets
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </form>
          </div>
        )}

        {/* Events and Tickets List */}
        {activeTab === 'eventList' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Events & Tickets List</h2>
            </div>
            
            {events.length === 0 ? (
              <div className="p-6 text-center text-gray-500">No sports events available.</div>
            ) : (
              <div className="divide-y divide-gray-200">
                {events.map(event => (
                  <div key={event.id} className="p-6">
                    <div className="flex flex-wrap justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">{event.name}</h3>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {new Date(event.date).toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
                      <div>
                        <span className="block text-gray-500">Description</span>
                        <span className="font-medium">{event.description || "No description"}</span>
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
                      <h4 className="font-medium text-gray-700 mb-2">Available Tickets</h4>
                      <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket Type</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Available Stock</th>
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
                                <td colSpan="3" className="px-4 py-6 text-center text-gray-500">
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
        )}
      </div>
    </div>
    </div>
  );
};

export default Olahraga;