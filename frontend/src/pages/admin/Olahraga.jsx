import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ChevronDown, ChevronUp, Edit, Trash2, MapPin, Info, Plus } from 'lucide-react';
import Sidebar from '../../components/navbar';

const Olahraga = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
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
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(res.data);
    } catch (err) {
      console.error('Failed to fetch events:', err.response?.status, err.response?.data || err.message);
    } finally {
      setIsLoading(false);
    }
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
      <div className="flex bg-gray-50 min-h-screen  justify-center">
        <Sidebar />
        <div className="flex-1 p-25">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
            <h1 className="text-3xl font-bold text-gray-800">Sports Event Management</h1>
          </div>

          <div className="bg-white rounded-lg shadow mb-8 overflow-hidden">
            <table className="w-full border-collapse">
              <thead className="bg-white border-b border-gray-200">
              <tr className="flex w-full">
                <th className="p-3 flex-1/24 text-center">No</th>
                <th className="p-3 flex-6/12 text-left">Nama Event</th>
                <th className="p-3 flex-2/12 text-left">Waktu</th>
                <th className="p-3 flex-2/12 text-left">Tanggal</th>
                <th className="p-3 flex-2/12 text-left">Status</th>
                <th className="p-3 flex-1/12 text-center">Action</th>
              </tr>
              </thead>
              <tbody>
              {events.map((event, index) => (
                  <>
                    <tr key={event.id} className="border-b border-gray-200 flex w-full">
                      <td className="p-3 flex-1/24 text-center ">{index + 1}</td>
                      <td className="p-3 flex-6/12 truncate">{event.nama_event}</td>
                      <td className="p-3 flex-2/12 truncate">10.00 - 15.00</td>
                      <td className="p-3 flex-2/12 truncate">01/04/2025</td>
                      <td className="p-3 flex-2/12">
                        <span className="bg-green-200 text-gre-800 px-2 py-1 rounded-full">
                          {event.status}
                        </span>
                      </td>
                      <td className="p-3 flex-1/12 text-center">
                        <button className="cursor-pointer" onClick={() => setExpanded(expanded === event.id ? null : event.id)}>
                          {expanded === event.id ? <ChevronUp /> : <ChevronDown />}
                        </button>
                      </td>
                    </tr>
                    {expanded === event.id && (
                        <tr>
                          <td colSpan="7" className="bg-slate-50 pt-4 pb-8 px-14 ">
                            <div className="grid grid-cols-2 gap-10 text-gray-600 ">
                              <div>
                                <table className="w-full border-collapse ">
                                  <thead className={"border-b border-gray-200"}>
                                    <tr className="flex w-full">
                                      <th className="pt-1 pb-3 px-1 font-medium flex-3/5 text-left">Category</th>
                                      <th className="pt-1 pb-3 px-1 font-medium flex-2/5 text-left">Price</th>
                                      <th className="pt-1 pb-3 px-1 font-medium flex-1/5 text-left">Stock</th>
                                      <th className="pt-1 pb-3 px-1 font-medium flex-2/8 text-left"> </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td className="p-1 "></td>
                                    </tr>
                                    {event.tickets.map((ticket, i) => (
                                        <tr key={i} className="flex w-full">
                                          <td className="p-1  flex-3/5 text-left">
                                            <input type="text" value={ticket.category} className="w-full border border-gray-200 bg-white p-2 rounded" />
                                          </td>
                                          <td className="p-1 flex-2/5 text-left">
                                            <input type="text" value={ticket.price} className="w-full border border-gray-200 bg-white p-2 rounded" />
                                          </td>
                                          <td className="p-1 flex-1/5 text-left">
                                            <input type="text" value={ticket.stock} className="w-full border border-gray-200 bg-white p-2 rounded" />
                                          </td>
                                          <td className="p-1 flex-2/8 space-x-1 text-left flex">
                                            <button className="w-full h-full flex justify-center items-center bg-white border border-gray-200  rounded-lg text-sm cursor-pointer hover:bg-blue-200"><Edit className={"w-4"} /></button>
                                            <button className="w-full h-full flex justify-center items-center bg-white border border-gray-200  rounded-lg text-sm cursor-pointer hover:bg-red-200"><Trash2 className={"w-4"} /></button>
                                          </td>
                                        </tr>
                                      ))}

                                    <tr className="flex w-full">
                                      <td className="p-1  flex-3/5 text-left">
                                        <input type="text" placeholder="Masukkan category" className="w-full border border-gray-200 bg-white p-2 rounded" />
                                      </td>
                                      <td className="p-1 flex-2/5 text-left">
                                        <input type="text" placeholder="0" className="w-full border border-gray-200 bg-white p-2 rounded" />
                                      </td>
                                      <td className="p-1 flex-1/5 text-left">
                                        <input type="text" placeholder="0" className="w-full border border-gray-200 bg-white p-2 rounded" />
                                      </td>
                                      <td className="p-1 flex-2/8 space-x-1 text-left flex">
                                        <button className="w-full h-full flex justify-center items-center bg-white cursor-pointer border border-slate-200 rounded-lg text-sm hover:bg-green-200"><Plus className={"w-5"} /></button>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className={"p-3 "}>
                                        <p className=" italic text-gray-500 text-sm">Pastikan harga dan stok yang dimasukkan sudah benar dan sesuai. Klik tombol Edit untuk mengubah harga atau stok</p>
                                      </td>
                                    </tr>
                                  </tbody>

                                </table>

                              </div>
                              <div className={"space-y-4"}>
                                <div className={"p-3 bg-slate-100 rounded-md"}>
                                  <h3 className="font-semibold mb-2 flex gap-2">
                                    <MapPin className={"w-4"}/>
                                    Location
                                  </h3>
                                  <p className="text-gray-700 text-sm">{event.location}</p>
                                </div>
                                <div className={"p-3 bg-slate-100 rounded-md"}>
                                  <h3 className="font-semibold mb-2 flex gap-2">
                                    <Info className={"w-4"}/>
                                    Description
                                  </h3>
                                  <p className="text-gray-700 text-sm">{event.description}</p>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                    )}
                  </>
              ))}
              </tbody>
            </table>
          </div>
        </div>
        <button onClick={() => navigate('/create-event')} className="fixed bottom-6 right-6 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600">
          <Plus className={"w-6"} />
        </button>
      </div>
  );
};

export default Olahraga;