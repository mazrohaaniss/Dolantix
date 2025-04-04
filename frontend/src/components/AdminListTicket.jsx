import {Edit, Info, MapPin, Plus, Trash2} from "lucide-react";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";


const AdminListTicket = ({event, category, token}) => {
    const [tickets, setTickets] = useState(event.tickets);

    const [ticketData, setTicketData] = useState({
        category: "",
        stock: "",
        price: ""
    });

    const handleChange = (e) => {
        setTicketData({ ...ticketData, [e.target.name]: e.target.value });
    };

    const handleTicketChange = (index, field, value) => {
        const updatedTickets = [...tickets];
        updatedTickets[index][field] = value;
        setTickets(updatedTickets);
    };

    const handleCreateTicket  = async (e) => {
        e.preventDefault();

        const formData = {
            event_id: event.id,
            event_category: category,
            category: ticketData.category,
            price: parseInt(ticketData.price),
            stock: parseInt(ticketData.stock),
        };

        try {
            await axios.post("/api/tickets", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            toast.success('Ticket berhasil ditambahkan!');
            setTimeout(() => {
                window.location.reload();
            }, 600);
        } catch (err) {
            toast.error('Ticket gagal ditambahkan!');
            console.error("Error saat menambahkan tiket:", err);
        }
    };

    const handleEditTicket = async (id, index) => {
        try {
            const ticket = tickets[index];
            console.log(id);
            await axios.put(`/api/tickets/${id}`, {
                category: ticket.category,
                price: parseInt(ticket.price),
                stock: parseInt(ticket.stock)
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success('Ticket berhasil diedit!');

        } catch (err) {
            toast.error('Ticket gagal diedit!');
            console.error("Error update:", err);
        }
    };

    const handleDeleteTicket = async (id) => {
        if (!window.confirm("Yakin ingin menghapus tiket ini?")) return;

        try {
            await axios.delete(`/api/tickets/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setTickets(tickets.filter(ticket => ticket.id !== id));
            toast.success('Ticket berhasil dihapus!');

        } catch (err) {
            toast.error('Ticket gagal dihapus!');

            console.error("Error delete:", err);
        }
    };



    return (
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

                            {/*List Tickets*/}
                            {tickets.map((ticket, i) => (
                                <tr key={ticket.id} className="flex w-full">
                                    <td className="p-1 flex-3/5 text-left">
                                        <input
                                            type="text"
                                            value={ticket.category}
                                            onChange={(e) => handleTicketChange(i, "category", e.target.value)}
                                            className="w-full border border-gray-200 bg-white p-2 rounded"
                                        />
                                    </td>
                                    <td className="p-1 flex-2/5 text-left">
                                        <input
                                            type="number"
                                            value={ticket.price}
                                            onChange={(e) => handleTicketChange(i, "price", e.target.value)}
                                            className="w-full border border-gray-200 bg-white p-2 rounded"
                                        />
                                    </td>
                                    <td className="p-1 flex-1/5 text-left">
                                        <input
                                            type="number"
                                            value={ticket.stock}
                                            onChange={(e) => handleTicketChange(i, "stock", e.target.value)}
                                            className="w-full border border-gray-200 bg-white p-2 rounded"
                                        />
                                    </td>
                                    <td className="p-1 flex-2/8 space-x-1 text-left flex">
                                        <button
                                            onClick={() => handleEditTicket(ticket.id, i)}
                                            className="w-full h-full flex justify-center items-center bg-white border border-gray-200 rounded-lg text-sm cursor-pointer hover:bg-gray-100"
                                        >
                                            <Edit className={"w-4"} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteTicket(ticket.id)}
                                            className="w-full h-full flex justify-center items-center bg-red-100 border border-gray-200 rounded-lg text-sm cursor-pointer hover:bg-red-200"
                                        >
                                            <Trash2 className={"w-4 text-black"} />
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {/*Create Ticket*/}
                            <tr className="flex w-full">
                                <td className="p-1 flex-3/5 text-left">
                                    <input
                                        type="text"
                                        name="category"
                                        value={ticketData.category}
                                        onChange={handleChange}
                                        placeholder="Masukkan category"
                                        className="w-full border border-gray-200 bg-white p-2 rounded"
                                    />
                                </td>
                                <td className="p-1 flex-2/5 text-left">
                                    <input
                                        type="number"
                                        name="price"
                                        value={ticketData.price}
                                        onChange={handleChange}
                                        placeholder="0"
                                        className="w-full border border-gray-200 bg-white p-2 rounded"
                                    />
                                </td>
                                <td className="p-1 flex-1/5 text-left">
                                    <input
                                        type="number"
                                        name="stock"
                                        value={ticketData.stock}
                                        onChange={handleChange}
                                        placeholder="0"
                                        className="w-full border border-gray-200 bg-white p-2 rounded"
                                    />
                                </td>
                                <td className="p-1 flex-2/8 space-x-1 text-left flex">
                                    <button
                                        onClick={handleCreateTicket}
                                        className="w-full h-full flex justify-center items-center bg-white cursor-pointer border border-gray-200 rounded-lg text-sm hover:bg-blue-100"
                                    >
                                        <Plus className="w-5" />
                                    </button>
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
    );
}

export default AdminListTicket;