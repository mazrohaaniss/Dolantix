import axios from "axios";
import {useState} from "react";


const AdminCreateEvent = ({token, category}) => {

    const [eventData, setEventData] = useState({
        name: "",
        description: "",
        date: "",
        time: "",
        location: "",
        poster: "",
    });

    const handleChange = (e) => {
        setEventData({ ...eventData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const fullDateTime = `${eventData.date} ${eventData.time}:00`;

        const formData = {
            name: eventData.name,
            description: eventData.description,
            date: fullDateTime,
            location: eventData.location,
            poster: eventData.poster,
        };

        try {
            await axios.post(`/api/${category}/${token}`, formData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (window.confirm("Acara berhasil dibuat! Klik OK untuk memuat ulang.")) {
                window.location.reload();
            }
        } catch (err) {
            alert("Gagal membuat acara! Periksa kembali input Anda.");
            console.error("Error:", err);
        }
    };

    return (
        <div className="bg-white shadow-sm rounded-lg p-4 border border-gray-200">
            <h2 className="text-lg font-semibold mb-3 text-gray-800">Tambah Acara Olahraga</h2>

            <form onSubmit={handleSubmit} className="space-y-3">
                <div className="flex gap-2">
                    <div className="flex-1">
                        <label className="text-sm text-gray-700">Nama Acara</label>
                        <input
                            type="text"
                            name="name"
                            value={eventData.name}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-200 rounded focus:ring focus:ring-blue-200"
                            required
                        />
                    </div>
                    <div className="flex-1">
                        <label className="text-sm text-gray-700">Lokasi</label>
                        <input
                            type="text"
                            name="location"
                            value={eventData.location}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-200 rounded focus:ring focus:ring-blue-200"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="text-sm text-gray-700">Deskripsi</label>
                    <textarea
                        name="description"
                        value={eventData.description}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-200 rounded focus:ring focus:ring-blue-200"
                        required
                    ></textarea>
                </div>

                <div className="flex gap-3">
                    <div className="flex-1">
                        <label className="text-sm text-gray-700">Tanggal</label>
                        <input
                            type="date"
                            name="date"
                            value={eventData.date}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-200 rounded focus:ring focus:ring-blue-200"
                            required
                        />
                    </div>

                    <div className="flex-1">
                        <label className="text-sm text-gray-700">Jam</label>
                        <input
                            type="time"
                            name="time"
                            value={eventData.time}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-200 rounded focus:ring focus:ring-blue-200"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="text-sm text-gray-700">Poster (URL)</label>
                    <input
                        type="text"
                        name="poster"
                        value={eventData.poster}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-200 rounded focus:ring focus:ring-blue-200"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                >
                    Tambah Acara
                </button>
            </form>
        </div>

    );
}

export default AdminCreateEvent;