import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { calculateDaysUntil, getActionStatus, formatDate } from '../utils/dateUtils';
import { Leaf, ArrowLeft, Edit3, Droplets, CalendarDays, History, Info, Box } from 'lucide-react';

const PlantDetails = () => {
    const { id } = useParams();
    const [plant, setPlant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchPlant = async () => {
        try {
            const res = await api.get(`/plants/${id}`);
            setPlant(res.data);
        } catch (err) {
            setError('Failed to fetch plant details');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlant();
    }, [id]);

    const handleWaterToday = async () => {
        try {
            const today = new Date().toISOString();
            await api.put(`/plants/${id}`, { lastWateredDate: today });
            fetchPlant(); // refresh
        } catch (error) {
            console.error('Error updating plant', error);
        }
    };

    const handleFertilizeToday = async () => {
        try {
            const today = new Date().toISOString();
            await api.put(`/plants/${id}`, { lastFertilizedDate: today });
            fetchPlant(); // refresh
        } catch (error) {
            console.error('Error updating plant', error);
        }
    };

    const handleRepotToday = async () => {
        try {
            const today = new Date().toISOString();
            await api.put(`/plants/${id}`, { lastRepottedDate: today });
            fetchPlant(); // refresh
        } catch (error) {
            console.error('Error updating plant', error);
        }
    };

    if (loading) return (
        <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
    );

    if (error) return <div className="text-center text-red-500 py-10 font-medium">{error}</div>;
    if (!plant) return <div className="text-center text-slate-500 py-10 font-medium">Plant not found</div>;

    const waterDaysUntil = calculateDaysUntil(plant.nextWaterDate);
    const waterStatus = getActionStatus(waterDaysUntil, 'Water');

    const fertDaysUntil = plant.fertilizeFrequency > 0 ? calculateDaysUntil(plant.nextFertilizeDate) : null;
    const fertStatus = fertDaysUntil !== null ? getActionStatus(fertDaysUntil, 'Fertilize') : null;

    const repotDaysUntil = plant.repotFrequency > 0 ? calculateDaysUntil(plant.nextRepotDate) : null;
    const repotStatus = repotDaysUntil !== null ? getActionStatus(repotDaysUntil, 'Repot') : null;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Nav */}
            <div className="flex justify-between items-center mb-6">
                <Link to="/" className="inline-flex items-center text-slate-500 hover:text-emerald-600 transition-colors bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100 font-medium">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
                </Link>
                <Link to={`/edit-plant/${plant._id}`} className="inline-flex items-center text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl transition-colors font-medium shadow-sm">
                    <Edit3 className="w-4 h-4 mr-2" /> Edit Plant
                </Link>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Image Section */}
                <div className="md:col-span-1">
                    <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 h-full flex flex-col">
                        <div className="flex-grow w-full h-64 md:h-auto rounded-2xl bg-emerald-50 flex items-center justify-center overflow-hidden">
                            {plant.image ? (
                                <img src={plant.image} alt={plant.plantName} className="object-cover w-full h-full" />
                            ) : (
                                <Leaf className="w-32 h-32 text-emerald-200" />
                            )}
                        </div>
                    </div>
                </div>

                {/* Details Section */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                        <div className="mb-6 flex justify-between items-start">
                            <div>
                                <h1 className="text-4xl font-bold text-slate-800 mb-2">{plant.plantName}</h1>
                                <p className="text-xl text-emerald-600 font-medium">{plant.plantType}</p>
                            </div>
                            <div className="flex gap-2 flex-col items-end">
                                <div className={`px-4 py-2 rounded-full font-bold border ${waterStatus.bg} ${waterStatus.color} ${waterStatus.border} shadow-sm inline-block`}>
                                    {waterStatus.label}
                                </div>
                                {fertStatus && (
                                    <div className={`px-3 py-1.5 rounded-full text-xs font-bold border ${fertStatus.bg} ${fertStatus.color} ${fertStatus.border} shadow-sm inline-block`}>
                                        {fertStatus.label}
                                    </div>
                                )}
                                {repotStatus && (
                                    <div className={`px-3 py-1.5 rounded-full text-xs font-bold border ${repotStatus.bg} ${repotStatus.color} ${repotStatus.border} shadow-sm inline-block`}>
                                        {repotStatus.label}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Status Cards */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col items-center justify-center text-center">
                                <Droplets className="w-6 h-6 text-blue-500 mb-2" />
                                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Frequency</span>
                                <span className="font-bold text-slate-700">{plant.wateringFrequency} Days</span>
                            </div>
                            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col items-center justify-center text-center">
                                <History className="w-6 h-6 text-indigo-500 mb-2" />
                                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Last Watered</span>
                                <span className="font-bold text-slate-700">{formatDate(plant.lastWateredDate)}</span>
                            </div>
                            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100 flex flex-col items-center justify-center text-center col-span-2 lg:col-span-2">
                                <CalendarDays className="w-6 h-6 text-amber-500 mb-2" />
                                <span className="text-xs text-amber-700 font-semibold uppercase tracking-wider mb-1">Next Watering</span>
                                <span className="font-bold text-amber-800">{formatDate(plant.nextWaterDate)}</span>
                            </div>
                        </div>

                        {/* Action Area */}
                        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                            <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div>
                                    <h3 className="font-bold text-emerald-800 flex items-center"><Droplets className="w-5 h-5 mr-2" /> Did you water it today?</h3>
                                </div>
                                <button 
                                    onClick={handleWaterToday}
                                    className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-md"
                                >
                                    Water Now
                                </button>
                            </div>

                            {plant.fertilizeFrequency > 0 && (
                                <div className="bg-lime-50 rounded-2xl p-6 border border-lime-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <div>
                                        <h3 className="font-bold text-lime-800 flex items-center"><Leaf className="w-5 h-5 mr-2" /> Did you fertilize it today?</h3>
                                    </div>
                                    <button 
                                        onClick={handleFertilizeToday}
                                        className="w-full sm:w-auto bg-lime-600 hover:bg-lime-700 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-md"
                                    >
                                        Fertilize Now
                                    </button>
                                </div>
                            )}

                            {plant.repotFrequency > 0 && (
                                <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <div>
                                        <h3 className="font-bold text-amber-800 flex items-center"><Box className="w-5 h-5 mr-2" /> Did you repot it today?</h3>
                                    </div>
                                    <button 
                                        onClick={handleRepotToday}
                                        className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-md"
                                    >
                                        Repot Now
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Notes Section */}
                    {plant.notes && (
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                            <h3 className="text-xl font-bold text-slate-800 flex items-center mb-4">
                                <Info className="w-5 h-5 mr-2 text-emerald-500" /> Care Notes
                            </h3>
                            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 text-slate-600 whitespace-pre-line leading-relaxed">
                                {plant.notes}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PlantDetails;
