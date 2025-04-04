import {ArrowLeft} from "lucide-react";
import axios from "axios";

const AdminEditEvent = ({selectedEvent, setSelectedEvent, token, category, setActiveTab, fetchEvents}) => {

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            console.log(selectedEvent);
            await axios.put(`/api/${category}/${selectedEvent.id}`, selectedEvent, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert('Event berhasil diperbarui');
            setActiveTab('list-event');
            fetchEvents();
        } catch (err) {
            console.error('Gagal memperbarui event:', err);
            alert('Gagal memperbarui event');
        }
    };

    return (
        <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
            <button onClick={() => setActiveTab('list-event')} className="flex items-center mb-6 cursor-pointer">
                <ArrowLeft className="w-4 h-4 mr-1" />
                <h2 className="text-2xl font-semibold ml-2  text-gray-800 leading-none">Edit Acara {category.charAt(0).toUpperCase() + category.slice(1)}</h2>
            </button>


            <form onSubmit={handleUpdate} className="space-y-3">
                <div className="flex gap-2">
                    <div className="flex-1">
                        <label className="text-sm text-gray-700">Nama Acara</label>
                        <input
                            type="text"
                            name="name"
                            value={selectedEvent.nama_event}
                            onChange={(e) => setSelectedEvent({ ...selectedEvent, nama_event: e.target.value })}
                            className="w-full p-2 border border-gray-200 rounded focus:ring focus:ring-blue-200"
                            placeholder="Masukkan Nama Acara"
                            required
                        />
                    </div>
                    <div className="flex-1">
                        <label className="text-sm text-gray-700">Lokasi</label>
                        <input
                            type="text"
                            name="location"
                            value={selectedEvent.location}
                            onChange={(e) => setSelectedEvent({ ...selectedEvent, location: e.target.value })}
                            className="w-full p-2 border border-gray-200 rounded focus:ring focus:ring-blue-200"
                            placeholder="Masukkan Lokasi Acara"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="text-sm text-gray-700">Deskripsi</label>
                    <textarea
                        name="description"
                        value={selectedEvent.description}
                        onChange={(e) => setSelectedEvent({ ...selectedEvent, description: e.target.value })}
                        className="w-full p-2 h-[120px]  border border-gray-200 rounded focus:ring focus:ring-blue-200"
                        placeholder="Masukkan Deskripsi Acara"
                        required
                    ></textarea>
                </div>

                <div className="flex gap-3">
                    <div className="flex-1">
                        <label className="text-sm text-gray-700">Tanggal</label>
                        <input
                            type="date"
                            name="date"
                            value={selectedEvent.date ? selectedEvent.date.split('T')[0] : ''}
                            onChange={(e) => setSelectedEvent({ ...selectedEvent, date: `${e.target.value}T${selectedEvent.time || '00:00'}` })}
                            className="w-full p-2 border border-gray-200 rounded focus:ring focus:ring-blue-200"
                            required
                        />
                    </div>

                    <div className="flex-1">
                        <label className="text-sm text-gray-700">Jam</label>
                        <input
                            type="time"
                            name="time"
                            value={selectedEvent.date ? selectedEvent.date.split('T')[1].slice(0, 5) : ''}
                            onChange={(e) => setSelectedEvent({ ...selectedEvent, date: `${selectedEvent.date.split('T')[0]}T${e.target.value}` })}
                            className="w-full p-2 border border-gray-200 rounded focus:ring focus:ring-blue-200"
                            required
                        />
                    </div>
                    <div className="flex-1">
                        <label className="text-sm text-gray-700">Status</label>
                        <select
                            className={`w-full p-2 border border-gray-200 rounded focus:ring focus:ring-blue-200`}
                            name="status"
                            value={selectedEvent.status}
                            onChange={(e) => setSelectedEvent({ ...selectedEvent, status: e.target.value })}
                        >
                            <option className="bg-white" value="published">Published</option>
                            <option className="bg-white" value="draft">Draft</option>
                            <option className="bg-white" value="archived">Archived</option>
                        </select>
                    </div>
                </div>

                <div className="flex-1">
                    <label className="text-sm text-gray-700">Poster (URL)</label>
                    <input
                        type="text"
                        name="poster"
                        value={selectedEvent.poster}
                        onChange={(e) => setSelectedEvent({ ...selectedEvent, poster: e.target.value })}
                        className="w-full flex-1 p-2 border border-gray-200 rounded focus:ring focus:ring-blue-200"
                        placeholder="Masukkan Link Poster"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                >
                    Simpan Perubahan
                </button>
            </form>
        </div>

    );
}

export default AdminEditEvent;