import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, Save, Trash2, Camera, X } from 'lucide-react';
import { compressImage } from '../utils/imageUtils';

const EditPlant = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        plantName: '',
        plantType: '',
        wateringFrequency: '',
        lastWateredDate: '',
        fertilizeFrequency: 0,
        lastFertilizedDate: '',
        repotFrequency: 0,
        lastRepottedDate: '',
        notes: '',
        image: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPlant = async () => {
            try {
                const res = await api.get(`/plants/${id}`);
                const p = res.data;
                setFormData({
                    plantName: p.plantName,
                    plantType: p.plantType,
                    wateringFrequency: p.wateringFrequency,
                    lastWateredDate: p.lastWateredDate ? p.lastWateredDate.split('T')[0] : '',
                    fertilizeFrequency: p.fertilizeFrequency || 0,
                    lastFertilizedDate: p.lastFertilizedDate ? p.lastFertilizedDate.split('T')[0] : '',
                    repotFrequency: p.repotFrequency || 0,
                    lastRepottedDate: p.lastRepottedDate ? p.lastRepottedDate.split('T')[0] : '',
                    notes: p.notes,
                    image: p.image
                });
            } catch (err) {
                setError('Failed to load plant details');
            } finally {
                setLoading(false);
            }
        };
        fetchPlant();
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageCapture = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const compressedBase64 = await compressImage(file);
            setFormData({ ...formData, image: compressedBase64 });
        }
    };

    const removeImage = () => {
        setFormData({ ...formData, image: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        
        try {
            const payload = { ...formData };
            if (!payload.lastFertilizedDate) delete payload.lastFertilizedDate;
            if (!payload.lastRepottedDate) delete payload.lastRepottedDate;

            await api.put(`/plants/${id}`, payload);
            navigate(`/plant/${id}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Error updating plant');
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this plant?')) return;
        setDeleting(true);
        try {
            await api.delete(`/plants/${id}`);
            navigate('/');
        } catch (err) {
            setError('Error deleting plant');
            setDeleting(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
    );

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-6 flex justify-between items-center">
                <Link to={`/plant/${id}`} className="inline-flex items-center text-slate-500 hover:text-emerald-600 transition-colors bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100 font-medium">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Details
                </Link>
                <button 
                    onClick={handleDelete}
                    disabled={deleting}
                    className="inline-flex items-center px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl font-medium transition-colors disabled:opacity-50"
                >
                    <Trash2 className="w-4 h-4 mr-2" /> {deleting ? 'Deleting...' : 'Delete'}
                </button>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-800">Edit {formData.plantName}</h1>
                    <p className="text-slate-500 mt-2">Update care instructions and details.</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm flex items-center">
                        <span className="font-medium">{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Plant Name *</label>
                            <input
                                type="text"
                                name="plantName"
                                required
                                value={formData.plantName}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-slate-50 focus:bg-white"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Plant Type *</label>
                            <input
                                type="text"
                                name="plantType"
                                required
                                value={formData.plantType}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-slate-50 focus:bg-white"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Watering Frequency (days) *</label>
                            <input
                                type="number"
                                name="wateringFrequency"
                                required
                                min="1"
                                value={formData.wateringFrequency}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-slate-50 focus:bg-white"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Last Watered Date *</label>
                            <input
                                type="date"
                                name="lastWateredDate"
                                required
                                value={formData.lastWateredDate}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-slate-50 focus:bg-white text-slate-700"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Fertilize Frequency (days, 0 to disable)</label>
                            <input
                                type="number"
                                name="fertilizeFrequency"
                                min="0"
                                value={formData.fertilizeFrequency}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-slate-50 focus:bg-white"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Last Fertilized Date</label>
                            <input
                                type="date"
                                name="lastFertilizedDate"
                                value={formData.lastFertilizedDate}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-slate-50 focus:bg-white text-slate-700"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Repot Frequency (days, 0 to disable)</label>
                            <input
                                type="number"
                                name="repotFrequency"
                                min="0"
                                value={formData.repotFrequency}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-slate-50 focus:bg-white"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Last Repotted Date</label>
                            <input
                                type="date"
                                name="lastRepottedDate"
                                value={formData.lastRepottedDate}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-slate-50 focus:bg-white text-slate-700"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Plant Photo</label>
                        <input id="file-upload" name="file-upload" type="file" accept="image/*" capture="environment" className="sr-only" onChange={handleImageCapture} />
                        
                        {!formData.image ? (
                            <label htmlFor="file-upload" className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer w-full group">
                                <div className="space-y-1 text-center">
                                    <Camera className="mx-auto h-12 w-12 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                                    <div className="flex text-sm text-slate-600 justify-center mt-2">
                                        <span className="font-medium text-emerald-600 group-hover:text-emerald-500">Take a photo</span>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">Capture using your device camera</p>
                                </div>
                            </label>
                        ) : (
                            <div className="relative mt-2 w-full max-w-xs mx-auto md:mx-0 group">
                                <label htmlFor="file-upload" className="cursor-pointer block relative">
                                    <img src={formData.image} alt="Preview" className="rounded-xl shadow-sm object-cover h-48 w-full group-hover:opacity-90 transition-opacity" />
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 rounded-xl transition-opacity">
                                        <Camera className="text-white w-10 h-10" />
                                    </div>
                                </label>
                                <button type="button" onClick={(e) => { e.preventDefault(); removeImage(); }} className="absolute -top-2 -right-2 bg-white rounded-full p-1.5 shadow-md border border-slate-200 text-slate-600 hover:text-red-500 flex items-center justify-center z-10 transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Notes</label>
                        <textarea
                            name="notes"
                            rows="3"
                            value={formData.notes}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-slate-50 focus:bg-white resize-none"
                        ></textarea>
                    </div>

                    <div className="pt-4 flex gap-4">
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-6 rounded-xl transition-colors shadow-sm focus:ring-4 focus:ring-emerald-200 disabled:opacity-70 flex items-center justify-center text-lg"
                        >
                            {saving ? 'Saving...' : <><Save className="w-5 h-5 mr-2" /> Save Changes</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditPlant;
