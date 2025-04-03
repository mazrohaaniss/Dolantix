import React from 'react';
import {ChevronDown, ChevronUp, Edit, Info, MapPin, Plus, Trash2} from "lucide-react";

const ListAcara = ({events, onEdit, onExpand}) => {
    return (
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
                        <td className="p-3 flex-1/12 truncate">{event.date.split('T')[1].split(':00.')[0]}</td>
                        <td className="p-3 flex-2/12 truncate">{event.date.split('T')[0]}</td>
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
    );
}