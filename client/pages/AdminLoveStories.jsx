import React, { useEffect, useState } from "react";
import { Edit, Trash2 } from "lucide-react";

export default function AdminLoveStories() {
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
        if (!form.thumbnail) {
            alert("Main Thumbnail is required");
            return;
        }

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
            } else {
                alert("Failed to save story");
            }
        } catch (error) {
            console.error("Error saving story:", error);
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
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-charcoal-900">Love Stories</h1>
                <button
                    onClick={() => {
                        setShowForm(true);
                        setForm({ title: "", location: "", description: "", thumbnail: "", gallery: [], status: "Active" });
                        setEditingId(null);
                    }}
                    className="bg-gold-500 text-white px-4 py-2 rounded-lg hover:bg-gold-600 transition"
                >
                    + Add New Story
                </button>
            </div>

            {showForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-xl font-bold">{editingId ? "Edit Story" : "Add New Story"}</h2>
                            <button
                                onClick={() => setShowForm(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                ✕
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Story Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={form.title}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-500 outline-none"
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
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-500 outline-none"
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
                                    rows="5"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-500 outline-none"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Main Thumbnail (Required)</label>
                                    <div className="flex items-center gap-4">
                                        {form.thumbnail && (
                                            <img
                                                src={form.thumbnail}
                                                alt="Thumbnail"
                                                className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                                            />
                                        )}
                                        <label className="cursor-pointer bg-gray-50 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-100 transition">
                                            <span>Upload Image</span>
                                            <input type="file" onChange={handleThumbnailChange} className="hidden" accept="image/*" />
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                    <select
                                        name="status"
                                        value={form.status}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-500 outline-none"
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Gallery Images</label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                    {form.gallery.map((img, index) => (
                                        <div key={index} className="relative group aspect-square">
                                            <img
                                                src={img}
                                                alt={`Gallery ${index}`}
                                                className="w-full h-full object-cover rounded-lg border border-gray-200"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeGalleryImage(index)}
                                                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                    <label className="cursor-pointer border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center p-4 hover:border-gold-500 hover:bg-gold-50 transition aspect-square">
                                        <span className="text-2xl text-gray-400 mb-1">+</span>
                                        <span className="text-xs text-gray-500">Add Images</span>
                                        <input
                                            type="file"
                                            multiple
                                            onChange={handleGalleryChange}
                                            className="hidden"
                                            accept="image/*"
                                        />
                                    </label>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="mr-3 px-6 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 rounded-lg bg-gold-500 text-white hover:bg-gold-600 font-medium shadow-sm"
                                >
                                    {editingId ? "Update Story" : "Create Story"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
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
                        {stories.map((story) => (
                            <tr key={story._id} className="hover:bg-gray-50 transition">
                                <td className="px-6 py-4">
                                    <img
                                        src={story.thumbnail}
                                        alt={story.title}
                                        className="w-16 h-16 object-cover rounded-lg shadow-sm"
                                    />
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
                        {stories.length === 0 && (
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
    );
}
