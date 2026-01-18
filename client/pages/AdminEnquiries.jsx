import React, { useEffect, useState } from "react";
import { Trash2, Phone, MapPin, Calendar, CheckSquare } from "lucide-react";

export default function AdminEnquiries() {
    const [enquiries, setEnquiries] = useState([]);

    useEffect(() => {
        fetchEnquiries();
    }, []);

    const fetchEnquiries = async () => {
        try {
            const res = await fetch("/api/enquiries");
            const data = await res.json();
            setEnquiries(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching enquiries:", error);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            const res = await fetch(`/api/enquiries/${id}/status`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });
            if (res.ok) {
                fetchEnquiries();
            }
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const handleDelete = async (id) => {
        if (confirm("Are you sure you want to delete this enquiry?")) {
            await fetch(`/api/enquiries/${id}`, { method: "DELETE" });
            fetchEnquiries();
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold text-charcoal-900 mb-6">Book Us Enquiries</h1>

            <div className="grid gap-6">
                {enquiries.length === 0 ? (
                    <p className="text-gray-500 text-center py-10">No enquiries found yet.</p>
                ) : (
                    enquiries.map((enquiry) => (
                        <div key={enquiry._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">
                                        {enquiry.groomName} & {enquiry.brideName}
                                    </h3>
                                    <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                                        <Phone size={14} /> <span>{enquiry.phoneNumber}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <select
                                        value={enquiry.status}
                                        onChange={(e) => updateStatus(enquiry._id, e.target.value)}
                                        className={`px-3 py-1 rounded-full text-xs font-semibold border-none outline-none cursor-pointer
                            ${enquiry.status === 'New' ? 'bg-blue-100 text-blue-700' : ''}
                            ${enquiry.status === 'Contacted' ? 'bg-yellow-100 text-yellow-700' : ''}
                            ${enquiry.status === 'Booked' ? 'bg-green-100 text-green-700' : ''}
                            ${enquiry.status === 'Closed' ? 'bg-gray-100 text-gray-700' : ''}
                        `}
                                    >
                                        <option value="New">New</option>
                                        <option value="Contacted">Contacted</option>
                                        <option value="Booked">Booked</option>
                                        <option value="Closed">Closed</option>
                                    </select>
                                    <button
                                        onClick={() => handleDelete(enquiry._id)}
                                        className="text-gray-400 hover:text-red-500 transition"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} className="text-gold-500" />
                                    <span>
                                        {new Date(enquiry.eventStartDate).toLocaleDateString()} - {new Date(enquiry.eventEndDate).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin size={16} className="text-gold-500" />
                                    <span>{enquiry.location}</span>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg mb-4">
                                <p className="text-sm text-gray-700 italic">"{enquiry.message || "No message provided."}"</p>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-2">
                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Events:</span>
                                {enquiry.events.map(e => (
                                    <span key={e} className="bg-white border border-gray-200 px-2 py-1 rounded text-xs text-gray-600">{e}</span>
                                ))}
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Services:</span>
                                {enquiry.services.map(s => (
                                    <span key={s} className="bg-gold-50 text-gold-700 px-2 py-1 rounded text-xs font-medium">{s}</span>
                                ))}
                            </div>

                            {enquiry.budget && (
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <span className="text-sm font-medium text-gray-900">Estimated Budget: ₹{enquiry.budget.toLocaleString()}</span>
                                </div>
                            )}

                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
