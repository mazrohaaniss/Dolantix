import {ChevronDown, ChevronUp, Edit, Trash2} from "lucide-react";
import {useState} from "react";
import axios from "axios";
import AdminListTicket from "./AdminListTicket";
import toast from "react-hot-toast";

const AdminListEvent = ({ events, editEvent, token, fetchEvents, category}) => {
    const [expanded, setExpanded] = useState(null);


    const deleteEvent = async (id) => {
        const confirmDelete = window.confirm("Apakah Anda yakin ingin menghapus acara ini?");
        if (!confirmDelete) return;

        try {
            await axios.delete(`/api/${category}/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchEvents();
            toast.success('Event berhasil dihapus!');
        } catch (err) {
            console.error("Gagal menghapus acara:", err);
            toast.error('Event gagal dihapus!');
        }
    };


    return (
        <table className="w-full border-collapse">
            <thead className="bg-white border-b border-gray-200">
            <tr className="flex w-full px-2">
                <th className="p-3 flex-1/24 text-center">No</th>
                <th className="p-3 flex-6/12 text-left">Nama Event</th>
                <th className="p-3 flex-1/12 text-center">Waktu</th>
                <th className="p-3 flex-2/12 text-center">Tanggal</th>
                <th className="p-3 flex-2/12 text-center">Status</th>
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
                        <td className="p-3 flex-1/12 truncate text-center">{event.date.split('T')[1].split(':00.')[0]}</td>
                        <td className="p-3 flex-2/12 truncate text-center">{event.date.split('T')[0]}</td>
                        <td className="p-3 flex-2/12 text-center">{event.status}</td>
                        <td className="p-3 flex-1/8 text-left flex gap-2">
                            <button
                                className="py-1 px-2 bg-white border border-gray-200 rounded-lg text-sm cursor-pointer hover:bg-gray-100"
                                onClick={() => editEvent(event.id)}
                            >
                                <Edit className="w-4" />
                            </button>

                            <button
                                className="py-1 px-2 flex justify-center items-center bg-red-100 border border-gray-200 rounded-lg text-sm cursor-pointer hover:bg-red-200"
                                onClick={() => deleteEvent(event.id)}
                            >
                                <Trash2 className="w-4 text-black" />
                            </button>
                        </td>
                        <td className="p-3 flex-1/16 text-center">
                            <button className="cursor-pointer" onClick={() => setExpanded(expanded === event.id ? null : event.id)}>
                                {expanded === event.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </button>
                        </td>
                    </tr>
                    {expanded === event.id && (
                        <AdminListTicket event={event} category={category} token={token} />
                    )}
                </>
            ))}
            </tbody>
        </table>
    );
}



export default AdminListEvent;