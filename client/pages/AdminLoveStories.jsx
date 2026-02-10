import React, { useEffect, useState } from "react";
import { Edit, Trash2, Plus } from "lucide-react";
import Skeleton from "../components/Skeleton";
import PageHeader from "../components/PageHeader";

export default function AdminLoveStories() {
    const [loading, setLoading] = useState(true);
    const [stories, setStories] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({
        title: "",
        location: "",
        description: "",
        thumbnail: "",
        gallery: [],
        status: "Active",
    });
    const [editingId, setEditingId] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        fetchStories();
    }, []);

    const fetchStories = async () => {
        try {
            const res = await fetch("/api/love-stories");
            const data = await res.json();
            setStories(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching stories:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleThumbnailChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const base64 = await convertToBase64(file);
            setForm({ ...form, thumbnail: base64 });
        }
    };

    const handleGalleryChange = async (e) => {
        const files = Array.from(e.target.files);
        const base64Files = await Promise.all(files.map((file) => convertToBase64(file)));
        setForm({ ...form, gallery: [...form.gallery, ...base64Files] });
    };

    const removeGalleryImage = (index) => {
        setForm({
            ...form,
            gallery: form.gallery.filter((_, i) => i !== index),
        });
    };

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSaving) return;

        if (!form.thumbnail) {
            alert("Main Thumbnail is required");
            return;
        }

        setIsSaving(true);
        const url = editingId ? `/api/love-stories/${editingId}` : "/api/love-stories";
        const method = editingId ? "PUT" : "POST";

        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (res.ok) {
                setShowForm(false);
                setForm({ title: "", location: "", description: "", thumbnail: "", gallery: [], status: "Active" });
                setEditingId(null);
                fetchStories();
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 3000);
            } else {
                alert("Failed to save story");
            }
        } catch (error) {
            console.error("Error saving story:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleEdit = (story) => {
        setForm(story);
        setEditingId(story._id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (confirm("Are you sure you want to delete this story?")) {
            await fetch(`/api/love-stories/${id}`, { method: "DELETE" });
            fetchStories();
        }
    };

    return (
        <div className="mt-0 container mx-auto px-0 pt-0 pb-6 animate-in fade-in duration-500">
            <PageHeader
                title="Love Stories"
                description="Manage and showcase beautiful love stories"
                action={
                    <button
                        onClick={() => {
                            setShowForm(true);
                            setForm({ title: "", location: "", description: "", thumbnail: "", gallery: [], status: "Active" });
                            setEditingId(null);
                        }}
                        className="flex items-center gap-2 bg-gray-900 text-white px-6 py-2.5 rounded-lg hover:bg-gray-800 transition-all shadow-lg"
                    >
                        <Plus size={18} /> Add New Story
                    </button>
                }
            />

            {showForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowForm(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar" onClick={(e) => e.stopPropagation()}>
                        {/* Header */}
                        <div className="flex items-center justify-between p-5 border-b">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gold-100 text-gold-700 rounded-lg flex items-center justify-center font-bold">S</div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">{editingId ? "Edit Story" : "Add New Story"}</h3>
                                    <p className="text-sm text-gray-500">Create a beautiful story entry to showcase on the website.</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md">Close</button>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Left: Inputs */}
                            <div className="lg:col-span-2 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Story Title</label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={form.title}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-gold-500 outline-none"
                                            placeholder="e.g. A Monsoon Wedding"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                                        <input
                                            type="text"
                                            name="location"
                                            value={form.location}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-gold-500 outline-none"
                                            placeholder="City, Country"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Description</label>
                                    <textarea
                                        name="description"
                                        value={form.description}
                                        onChange={handleChange}
                                        rows="6"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-gold-500 outline-none"
                                        placeholder="Write a compelling story that highlights the moment..."
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                        <select
                                            name="status"
                                            value={form.status}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-gold-500 outline-none bg-white"
                                        >
                                            <option value="Active">Active</option>
                                            <option value="Inactive">Inactive</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Order (display priority)</label>
                                        <select
                                            name="order"
                                            value={form.order || 1}
                                            onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-gold-500 outline-none bg-white"
                                        >
                                            {[...Array(20)].map((_, i) => (
                                                <option key={i} value={i + 1}>{i + 1}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Gallery Images</label>
                                    <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                                        {form.gallery.map((img, index) => (
                                            <div key={index} className="relative group rounded-md overflow-hidden border">
                                                <img src={img} alt={`Gallery ${index}`} className="w-full h-24 object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => removeGalleryImage(index)}
                                                    className="absolute top-2 right-2 bg-white/90 text-red-600 p-1 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition"
                                                    aria-label="Remove image"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        ))}
                                        <label className="flex items-center justify-center cursor-pointer rounded-md border-2 border-dashed border-gray-200 p-3 text-gray-500 hover:border-gold-500 hover:bg-gold-50 transition">
                                            <div className="text-center">
                                                <div className="text-2xl">+</div>
                                                <div className="text-xs">Add Images</div>
                                            </div>
                                            <input type="file" multiple onChange={handleGalleryChange} accept="image/*" className="hidden" />
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Preview & Thumbnail */}
                            <aside className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Main Thumbnail (Required)</label>
                                    <div className="relative rounded-md overflow-hidden border border-gray-200 bg-gray-50 h-48 flex items-center justify-center">
                                        {form.thumbnail ? (
                                            <>
                                                <img src={form.thumbnail} alt="Thumbnail" className="w-full h-full object-cover" />
                                                <div className="absolute top-3 right-3 flex gap-2">
                                                    <label className="bg-white/90 p-2 rounded-md cursor-pointer shadow-sm text-sm">
                                                        Change
                                                        <input type="file" accept="image/*" onChange={handleThumbnailChange} className="hidden" />
                                                    </label>
                                                    <button type="button" onClick={() => setForm({ ...form, thumbnail: "" })} className="bg-white/90 p-2 rounded-md shadow-sm text-red-600">Remove</button>
                                                </div>
                                            </>
                                        ) : (
                                            <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer text-gray-400">
                                                <div className="text-3xl mb-2">📷</div>
                                                <div className="text-sm">Upload Thumbnail</div>
                                                <input type="file" accept="image/*" onChange={handleThumbnailChange} className="hidden" />
                                            </label>
                                        )}
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-md p-3 border border-gray-100">
                                    <h4 className="text-sm font-semibold text-gray-800 mb-2">Tips</h4>
                                    <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                                        <li>Use high quality images (recommended 1200x800)</li>
                                        <li>Write a descriptive title and location</li>
                                        <li>Order defines display priority (1 is highest)</li>
                                    </ul>
                                </div>

                                <div className="mt-auto flex flex-col gap-2">
                                    <button type="button" onClick={() => setShowForm(false)} className="w-full px-4 py-2 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50">Cancel</button>
                                    <button type="submit" disabled={isSaving} className="w-full px-4 py-2 rounded-md bg-gold-600 text-white font-semibold hover:bg-gold-700">
                                        {isSaving ? (
                                            <span className="inline-flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</span>
                                        ) : (
                                            editingId ? "Update Story" : "Create Story"
                                        )}
                                    </button>
                                </div>
                            </aside>
                        </form>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Mobile Card View */}
                <div className="block md:hidden">
                    {loading ? (
                        <div className="divide-y divide-gray-100">
                            {[1, 2, 3].map((_, index) => (
                                <div key={index} className="p-4 space-y-3">
                                    <div className="rounded-lg overflow-hidden bg-gray-100 border border-gray-200 shadow-sm">
                                        <Skeleton width="100%" height="160px" />
                                    </div>
                                    <div>
                                        <Skeleton width="70%" height="20px" style={{ marginBottom: "5px" }} />
                                        <Skeleton width="50%" height="16px" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : stories.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">No love stories found. Add your first one!</div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {stories.map((story) => (
                                <div key={story._id} className="p-4 space-y-3">
                                    <div className="relative h-40 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 shadow-sm group">
                                        {story.thumbnail ? (
                                            <img
                                                src={story.thumbnail}
                                                alt={story.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-50">
                                                <span className="text-gray-400">No Image</span>
                                            </div>
                                        )}
                                        <span className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-medium shadow-sm ${story.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                                            {story.status}
                                        </span>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-gray-900 text-lg leading-tight">{story.title}</h3>
                                        <p className="text-sm text-gray-500 mt-0.5">{story.location}</p>
                                    </div>

                                    <div className="flex justify-end gap-2 pt-1">
                                        <button
                                            onClick={() => handleEdit(story)}
                                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-gray-200"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(story._id)}
                                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-gray-200"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase font-medium">
                            <tr>
                                <th className="px-6 py-4">Thumbnail</th>
                                <th className="px-6 py-4">Title</th>
                                <th className="px-6 py-4">Location</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                [1, 2, 3, 4, 5].map((_, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4">
                                            <Skeleton width="64px" height="64px" borderRadius="8px" />
                                        </td>
                                        <td className="px-6 py-4"><Skeleton width="180px" height="20px" /></td>
                                        <td className="px-6 py-4"><Skeleton width="120px" height="20px" /></td>
                                        <td className="px-6 py-4"><Skeleton width="60px" height="24px" borderRadius="16px" /></td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Skeleton width="34px" height="34px" borderRadius="8px" />
                                                <Skeleton width="34px" height="34px" borderRadius="8px" />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : stories.map((story) => (
                                <tr key={story._id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4">
                                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                                            <img
                                                src={story.thumbnail}
                                                alt={story.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{story.title}</td>
                                    <td className="px-6 py-4 text-gray-500">{story.location}</td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${story.status === "Active"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-gray-100 text-gray-700"
                                                }`}
                                        >
                                            {story.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => handleEdit(story)}
                                                className="p-2 text-gray-500 hover:text-gold-500 hover:bg-gold-50 rounded-lg transition"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(story._id)}
                                                className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {!loading && stories.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                                        No love stories found. Add your first one!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* Success Popup */}
            {showSuccess && (
                <div className="fixed bottom-10 right-10 z-[100] animate-bounce">
                    <div className="flex items-center gap-3 rounded-xl bg-emerald-500 px-6 py-4 shadow-2xl text-white">
                        <span className="text-2xl">👉</span>
                        <div className="font-bold">Story saved successfully</div>
                    </div>
                </div>
            )}
        </div>
    );
}
