import React, { useEffect, useState } from "react";
import { Trash2, Phone, MapPin, Calendar, Zap, Eye, X, MessageCircle } from "lucide-react";
import PageHeader from "../components/PageHeader";

export default function AdminEnquiries() {
    const [enquiries, setEnquiries] = useState([]);
    const [viewDetails, setViewDetails] = useState(null);
    const [filter, setFilter] = useState("All");

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
                setEnquiries(prev => prev.map(e => e._id === id ? { ...e, status } : e));
                if (viewDetails?._id === id) {
                    setViewDetails({...viewDetails, status});
                }
            }
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const handleDelete = async (id) => {
        if (confirm("Are you sure you want to delete this enquiry?")) {
            await fetch(`/api/enquiries/${id}`, { method: "DELETE" });
            if (viewDetails?._id === id) setViewDetails(null);
            fetchEnquiries();
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'New': return 'bg-blue-50 text-blue-700 border border-blue-200';
            case 'Contacted': return 'bg-amber-50 text-amber-700 border border-amber-200';
            case 'Booked': return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
            case 'Closed': return 'bg-slate-100 text-slate-600 border border-slate-300';
            default: return 'bg-slate-50 text-slate-600 border border-slate-200';
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'New': return 'bg-blue-100 text-blue-800';
            case 'Contacted': return 'bg-amber-100 text-amber-800';
            case 'Booked': return 'bg-emerald-100 text-emerald-800';
            case 'Closed': return 'bg-slate-200 text-slate-800';
            default: return 'bg-slate-100 text-slate-800';
        }
    };

    const filteredEnquiries = filter === "All" 
        ? enquiries 
        : enquiries.filter(e => e.status === filter);

    const stats = {
        total: enquiries.length,
        new: enquiries.filter(e => e.status === 'New').length,
        contacted: enquiries.filter(e => e.status === 'Contacted').length,
        booked: enquiries.filter(e => e.status === 'Booked').length,
    };

    return (
        <div className="min-h-screen animate-in fade-in duration-500">
            <PageHeader
                title="Book Us Enquiries"
                description="Manage enquiry requests and track customer interest"
            />

            {/* Stats Cards - Simple */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                    { label: 'Total', value: stats.total, color: 'bg-slate-100' },
                    { label: 'New', value: stats.new, color: 'bg-blue-100' },
                    { label: 'Contacted', value: stats.contacted, color: 'bg-amber-100' },
                    { label: 'Booked', value: stats.booked, color: 'bg-emerald-100' },
                ].map((stat, idx) => (
                    <div key={idx} className={`${stat.color} rounded-lg p-4 text-center`}>
                        <p className="text-3xl font-bold text-charcoal-900">{stat.value}</p>
                        <p className="text-sm text-slate-600 mt-1">{stat.label}</p>
                    </div>
                ))}
            </div>


            {/* Filter Tabs */}
            <div className="flex gap-2 mb-6">
                {['All', 'New', 'Contacted', 'Booked', 'Closed'].map(status => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-4 py-2 rounded-lg font-medium transition ${
                            filter === status
                                ? 'bg-charcoal-900 text-white'
                                : 'bg-slate-200 text-charcoal-700 hover:bg-slate-300'
                        }`}
                    >
                        {status}
                    </button>
                ))}
            </div>

            {/* Enquiries Table/Grid */}
            {filteredEnquiries.length === 0 ? (
                <div className="text-center py-20 bg-slate-100 rounded-lg">
                    <MessageCircle className="mx-auto h-12 w-12 text-slate-400 mb-3" />
                    <p className="text-slate-600 font-medium">No enquiries found</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredEnquiries.map((enquiry) => (
                        <div
                            key={enquiry._id}
                            className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition"
                        >
                            <div className="flex items-center justify-between gap-4">
                                {/* Left Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-semibold text-charcoal-900 text-sm">
                                            {enquiry.groomName} & {enquiry.brideName}
                                        </h3>
                                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusBadge(enquiry.status)}`}>
                                            {enquiry.status}
                                        </span>
                                    </div>
                                    <div className="text-sm text-slate-600 space-y-1">
                                        <div className="flex items-center gap-4">
                                            <span className="flex items-center gap-1">
                                                <Phone size={14} /> {enquiry.phoneNumber}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Calendar size={14} /> {new Date(enquiry.eventStartDate).toLocaleDateString()}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <MapPin size={14} /> {enquiry.location}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Zap size={14} /> ₹{enquiry.budget ? (enquiry.budget / 100000).toFixed(1) : "N/A"}L
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <select
                                        value={enquiry.status}
                                        onChange={(e) => updateStatus(enquiry._id, e.target.value)}
                                        className={`text-xs py-1 px-2 rounded border-0 cursor-pointer font-medium focus:outline-none focus:ring-1 focus:ring-charcoal-600 ${getStatusColor(enquiry.status)}`}
                                    >
                                        <option value="New">New</option>
                                        <option value="Contacted">Contacted</option>
                                        <option value="Booked">Booked</option>
                                        <option value="Closed">Closed</option>
                                    </select>
                                    <button
                                        onClick={() => setViewDetails(enquiry)}
                                        className="p-1.5 text-slate-500 hover:text-charcoal-900 hover:bg-slate-100 rounded transition"
                                        title="View Details"
                                    >
                                        <Eye size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(enquiry._id)}
                                        className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded transition"
                                        title="Delete"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* View Details Modal */}
            {viewDetails && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setViewDetails(null)}>
                    <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl" onClick={(e) => e.stopPropagation()}>
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-charcoal-900 text-white px-6 py-4 flex justify-between items-start border-b">
                            <div>
                                <h2 className="text-xl font-bold">{viewDetails.groomName} & {viewDetails.brideName}</h2>
                                <p className="text-sm text-slate-300 mt-1">Enquiry Details</p>
                            </div>
                            <button
                                onClick={() => setViewDetails(null)}
                                className="text-slate-300 hover:text-white p-1"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Basic Info */}
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-slate-500 font-medium block mb-1">Status</span>
                                    <span className={`inline-block px-3 py-1 rounded font-medium ${getStatusBadge(viewDetails.status)}`}>
                                        {viewDetails.status}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-slate-500 font-medium block mb-1">Date</span>
                                    <p className="text-charcoal-900 font-medium">{new Date(viewDetails.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>

                            {/* Contact Details */}
                            <div className="bg-slate-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-charcoal-900 mb-3">Contact Information</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-slate-600">Phone:</span>
                                        <span className="font-medium">{viewDetails.phoneNumber}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-600">Budget:</span>
                                        <span className="font-medium">₹{viewDetails.budget ? (viewDetails.budget / 100000).toFixed(1) : "N/A"}L</span>
                                    </div>
                                </div>
                            </div>

                            {/* Event Details */}
                            <div className="bg-slate-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-charcoal-900 mb-3">Event Information</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-slate-600">Date Range:</span>
                                        <span className="font-medium">{new Date(viewDetails.eventStartDate).toLocaleDateString()} - {new Date(viewDetails.eventEndDate).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-600">Location:</span>
                                        <span className="font-medium">{viewDetails.location}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Events & Services */}
                            {(viewDetails.events?.length > 0 || viewDetails.services?.length > 0) && (
                                <div>
                                    {viewDetails.events?.length > 0 && (
                                        <div className="mb-4">
                                            <h3 className="font-semibold text-charcoal-900 mb-2">Events</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {viewDetails.events?.map(e => (
                                                    <span key={e} className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm font-medium">
                                                        {e}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {viewDetails.services?.length > 0 && (
                                        <div>
                                            <h3 className="font-semibold text-charcoal-900 mb-2">Services</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {viewDetails.services?.map(s => (
                                                    <span key={s} className="px-3 py-1 bg-amber-100 text-amber-800 rounded text-sm font-medium">
                                                        {s}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Message */}
                            {viewDetails.message && (
                                <div className="bg-slate-50 p-4 rounded-lg">
                                    <h3 className="font-semibold text-charcoal-900 mb-2">Message</h3>
                                    <p className="text-sm text-charcoal-700 leading-relaxed">{viewDetails.message}</p>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 border-t bg-slate-50 flex gap-3 justify-between">
                            <button
                                onClick={() => setViewDetails(null)}
                                className="px-4 py-2 bg-slate-200 text-charcoal-900 rounded font-medium hover:bg-slate-300 transition flex-1"
                            >
                                Close
                            </button>
                            <select
                                value={viewDetails.status}
                                onChange={(e) => {
                                    updateStatus(viewDetails._id, e.target.value);
                                    setViewDetails({...viewDetails, status: e.target.value});
                                }}
                                className={`flex-1 px-3 py-2 rounded font-medium border-0 cursor-pointer focus:outline-none focus:ring-1 focus:ring-charcoal-600 ${getStatusColor(viewDetails.status)}`}
                            >
                                <option value="New">New</option>
                                <option value="Contacted">Contacted</option>
                                <option value="Booked">Booked</option>
                                <option value="Closed">Closed</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
