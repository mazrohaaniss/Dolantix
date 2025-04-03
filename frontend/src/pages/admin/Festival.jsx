import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {ChevronDown, ChevronUp, Edit, Info, MapPin, Plus, Trash2} from "lucide-react";
import Sidebar from '../../components/navbar';
import { format } from 'date-fns';

const Festival = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [activeTab, setActiveTab] = useState('add-event');
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState('');
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
      const res = await axios.get('/api/festival/admin', {
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
            <p className="mt-4 text-gray-600">Loading festival events data...</p>
          </div>
        </div>
    );
  }


  return (
      <div className="flex bg-gray-50 min-h-screen justify-center">
        <Sidebar />
        <div className="flex-1 p-25">
          <header className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
            <h1 className="text-3xl font-bold text-gray-800">Manajemen Acara Festival</h1>
          </header>

          <div className="mb-6 border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                  onClick={() => setActiveTab('add-event')}
                  className={`mr-6 py-4 px-1 ${
                      activeTab === 'add-event'
                          ? 'border-b-2 border-blue-500 text-blue-600 font-medium'
                          : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } transition-colors duration-200 cursor-pointer`}
              >
                List Acara
              </button>
              <button
                  onClick={() => setActiveTab('add-tickets')}
                  className={`mr-6 py-4 px-1 ${
                      activeTab === 'add-tickets'
                          ? 'border-b-2 border-blue-500 text-blue-600 font-medium'
                          : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } transition-colors duration-200 cursor-pointer`}
              >
                Tambah Acara
              </button>
            </nav>
          </div>

          <div className="bg-white rounded-lg shadow mb-8 overflow-hidden flex flex-col">
            {activeTab === 'add-event' && (
                <table className="w-full border-collapse">
                  <thead className="bg-white border-b border-gray-200">
                  <tr className="flex w-full px-2">
                    <th className="p-3 flex-1/24 text-center">No</th>
                    <th className="p-3 flex-6/12 text-left">Nama Event</th>
                    <th className="p-3 flex-1/12 text-left">Waktu</th>
                    <th className="p-3 flex-2/12 text-left">Tanggal</th>
                    <th className="p-3 flex-2/12 text-left">Status</th>
                    <th className="p-3 flex-1/8 text-left"></th>
                    <th className="p-3 flex-1/16 text-left"></th>
                  </tr>
                  </thead>
                  <tbody>
                  {events.map((event, index) => (
                      <>
                        <tr key={event.id} className="border-b border-gray-200 flex w-full px-2 items-center">
                          <td className="p-3 flex-1/24 text-center ">{index + 1}</td>
                          <td className="p-3 flex-6/12 truncate">{event.nama_event}</td>
                          <td className="p-3 flex-1/12 truncate">{format(new Date(event.date), 'HH:mm')}</td>
                          <td className="p-3 flex-2/12 truncate">{format(new Date(event.date), 'dd/MM/yyyy')}</td>
                          <td className="p-3 flex-2/12">
                            <select
                                className={`pr-2`}
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            >
                              <option className="bg-white" value="published">Published</option>
                              <option className="bg-white" value="draft">Draft</option>
                              <option className="bg-white" value="archived">Archived</option>
                            </select>
                          </td>
                          <td className="p-3 flex-1/8 text-left flex gap-2">
                            <button className="py-1 px-2 flex justify-center items-center bg-white border border-gray-200  rounded-lg text-sm cursor-pointer hover:bg-gray-100"><Edit className={"w-4 "} /></button>
                            <button className="py-1 px-2 flex justify-center items-center bg-red-100 border border-gray-200  rounded-lg text-sm cursor-pointer hover:bg-red-200"><Trash2 className={"w-4 text-black"} /></button>
                          </td>

                          <td className="p-3 flex-1/16 text-center">
                            <button className="cursor-pointer" onClick={() => setExpanded(expanded === event.id ? null : event.id)}>
                              {expanded === event.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </button>
                          </td>
                        </tr>
                        {expanded === event.id && (
                            <tr>
                              <td colSpan="7" className="bg-gray-50 pt-4 pb-8 px-14 ">
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
                                              <button className="w-full h-full flex justify-center items-center bg-white border border-gray-200  rounded-lg text-sm cursor-pointer hover:bg-gray-100"><Edit className={"w-4 "} /></button>
                                              <button className="w-full h-full flex justify-center items-center bg-red-100 border border-gray-200  rounded-lg text-sm cursor-pointer hover:bg-red-200"><Trash2 className={"w-4 text-black"} /></button>
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
                                          <button className="w-full h-full flex justify-center items-center bg-white cursor-pointer border border-gray-200 rounded-lg text-sm hover:bg-blue-100"><Plus className={"w-5"} /></button>
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
                                    <div className={"p-3 bg-white border border-gray-100 rounded-lg"}>
                                      <h3 className="font-semibold mb-2 flex gap-2">
                                        <MapPin className={"w-4"}/>
                                        Location
                                      </h3>
                                      <p className="text-gray-700 text-sm">{event.location}</p>
                                    </div>
                                    <div className={"p-3 bg-white border border-gray-100 rounded-lg"}>
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
            )}

            {activeTab === 'add-tickets' && (
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  asa
                </div>
            )}

          </div>
        </div>
      </div>
  );
};

export default Festival;