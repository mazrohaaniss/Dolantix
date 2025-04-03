import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../../components/navbar';
import AdminListEvent from '../../components/AdminListEvent';
import AdminCreateEvent from "../../components/AdminCreateEvent";
import AdminEditEvent from "../../components/AdminEditEvent";
import AdminHeaderEvent from "../../components/AdminHeaderEvent.jsx";

const Olahraga = () => {
  const category = "olahraga";
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [activeTab, setActiveTab] = useState('list-event');
  const [selectedEvent, setSelectedEvent] = useState(null);
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
      const res = await axios.get(`/api/${category}/admin`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(res.data);
    } catch (err) {
      console.error('Failed to fetch events:', err.response?.status, err.response?.data || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading){
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading sports events data...</p>
        </div>
      </div>
    );
  }

  const editEvent = (eventId) => {
    const event = events.find((e) => e.id === eventId);
    setSelectedEvent(event);
    setActiveTab('edit-event');
  };

  return (
      <div className="flex bg-gray-50 min-h-screen justify-center">
        <Sidebar />
        <div className="flex-1 p-25">
          <AdminHeaderEvent activeTab={activeTab} setActiveTab={setActiveTab} category={category} />

          <div className="bg-white rounded-lg shadow mb-8 overflow-hidden flex flex-col">
            {/* Form List Event */}
            {activeTab === 'list-event' && (
                <AdminListEvent events={events} editEvent={editEvent} token={token} fetchEvents={fetchEvents} category={category} />
            )}

            {/* Form Create Event */}
            {activeTab === 'add-event' && (
                <AdminCreateEvent token={token} category={category} />
            )}

            {/* Form Edit Event */}
            {activeTab === 'edit-event' && selectedEvent && (
                <AdminEditEvent selectedEvent={selectedEvent} setSelectedEvent={setSelectedEvent} token={token} category={category} setActiveTab={setActiveTab} fetchEvents={fetchEvents} />
            )}

          </div>
        </div>
      </div>
  );
};

export default Olahraga;