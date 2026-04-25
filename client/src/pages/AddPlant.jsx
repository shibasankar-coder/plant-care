import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, Save, Camera, X, Leaf } from 'lucide-react';

import { compressImage } from '../utils/imageUtils';

const AddPlant = () => {
    const [formData, setFormData] = useState({
        plantName: '',
        plantType: '',
        wateringFrequency: 7,
        lastWateredDate: new Date().toISOString().split('T')[0],
        fertilizeFrequency: 0,
        lastFertilizedDate: '',
        repotFrequency: 0,
        lastRepottedDate: '',
        careTips: '',
        notes: '',
        image: ''
    });

    const [loading, setLoading] = useState(false);
    const [aiLoading, setAiLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleIdentify = async () => {
        if (!formData.image) {
            setError('Please upload or take a photo first to use AI identification');
            return;
        }

        setAiLoading(true);
        setError('');

        try {
            const res = await api.post('/ai/identify', { image: formData.image });
            const { plantName, plantType, wateringFrequency, fertilizeFrequency, repotFrequency, careTips, probability } = res.data;

            setFormData(prev => ({
                ...prev,
                plantName: plantName || prev.plantName,
                plantType: plantType || prev.plantType,
                wateringFrequency: wateringFrequency,
                fertilizeFrequency: fertilizeFrequency,
                repotFrequency: repotFrequency,
                careTips: careTips || prev.careTips,
            }));





            
            // Success indicator?
            console.log(`Identified with ${probability} probability`);
        } catch (err) {
            setError(err.response?.data?.message || 'AI Identification failed. Please fill details manually.');
        } finally {
            setAiLoading(false);
        }
    };


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
        setLoading(true);
        setError('');
        
        try {
            const payload = { ...formData };
            if (!payload.lastFertilizedDate) delete payload.lastFertilizedDate;
            if (!payload.lastRepottedDate) delete payload.lastRepottedDate;
            
            await api.post('/plants', payload);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Error adding plant');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-6">
                <Link 
                    to="/" 
                    className="inline-flex items-center text-emerald-700 hover:text-white bg-white hover:bg-emerald-600 px-5 py-2.5 rounded-xl shadow-sm border border-emerald-100 font-bold transition-all transform hover:-translate-x-1"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" /> Back to Dashboard
                </Link>
            </div>


            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-800">Add New Plant</h1>
                    <p className="text-slate-500 mt-2">Enter the details for your new green friend.</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm flex items-center">
                        <span className="font-medium">{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
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

                        {formData.image && (
                            <div className="mt-4">
                                <button
                                    type="button"
                                    onClick={handleIdentify}
                                    disabled={aiLoading}
                                    className="w-full bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 py-3 px-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
                                >
                                    {aiLoading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-700"></div>
                                            Analyzing Plant...
                                        </>
                                    ) : (
                                        <>
                                            <Leaf className="w-5 h-5" /> Smart Identify & Auto-fill
                                        </>
                                    )}
                                </button>
                                <p className="text-[10px] text-slate-400 text-center mt-2 italic">Uses AI to detect species and suggest watering frequency</p>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Plant Name *</label>
                            <input
                                type="text"
                                name="plantName"
                                required
                                value={formData.plantName}
                                onChange={handleChange}
                                placeholder="e.g. Monstera Deliciosa, Fred"
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
                                placeholder="e.g. Tropical, Succulent"
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

                    {formData.careTips && (
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-emerald-700 flex items-center gap-2">
                                <Leaf className="w-4 h-4" /> Expert Care Tips
                            </label>
                            <textarea
                                name="careTips"
                                rows="5"
                                value={formData.careTips}
                                onChange={handleChange}
                                placeholder="AI generated care tips..."
                                className="w-full px-4 py-3 border border-emerald-100 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-emerald-50/30 transition-all resize-none italic text-slate-600"
                            ></textarea>
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">My Notes</label>

                        <textarea
                            name="notes"
                            rows="3"
                            value={formData.notes}
                            onChange={handleChange}
                            placeholder="Add your own personal notes here..."
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-slate-50 focus:bg-white resize-none"
                        ></textarea>
                    </div>


                    <div className="pt-4 flex gap-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-6 rounded-xl transition-colors shadow-sm focus:ring-4 focus:ring-emerald-200 disabled:opacity-70 flex items-center justify-center text-lg"
                        >
                            {loading ? 'Adding...' : <><Save className="w-5 h-5 mr-2" /> Save Plant</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddPlant;
