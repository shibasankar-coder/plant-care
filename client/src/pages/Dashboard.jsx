import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import PlantCard from '../components/PlantCard';
import { Plus, Bell, Sprout, X } from 'lucide-react';

import { initPushNotifications } from '../services/pushService';
import { AuthContext } from '../context/AuthContext';
import { calculateDaysUntil } from '../utils/dateUtils';


const Dashboard = () => {
    const [plants, setPlants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, needsWater: 0, needsFertilize: 0, needsRepot: 0 });
    const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'water', 'fertilize', 'repot'
    const plantListRef = React.useRef(null);

    const scrollToPlants = () => {
        setTimeout(() => {
            plantListRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    };

    const handleFilterClick = (filter) => {
        setActiveFilter(filter);
        scrollToPlants();
    };



    const { user } = React.useContext(AuthContext);

    const fetchPlants = async () => {
        try {
            const res = await api.get('/plants');
            setPlants(res.data);
            
            const needsWater = res.data.filter(p => calculateDaysUntil(p.nextWaterDate) <= 0).length;
            const needsFertilize = res.data.filter(p => p.fertilizeFrequency > 0 && calculateDaysUntil(p.nextFertilizeDate) <= 0).length;
            const needsRepot = res.data.filter(p => p.repotFrequency > 0 && calculateDaysUntil(p.nextRepotDate) <= 0).length;
            setStats({ total: res.data.length, needsWater, needsFertilize, needsRepot });


        } catch (error) {
            console.error('Error fetching plants', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlants();
    }, []);

    const handleWaterToday = async (id) => {
        try {
            const today = new Date().toISOString();
            await api.put(`/plants/${id}`, { lastWateredDate: today });
            fetchPlants(); // refresh
        } catch (error) {
            console.error('Error updating plant', error);
        }
    };

    const handleFertilizeToday = async (id) => {
        try {
            const today = new Date().toISOString();
            await api.put(`/plants/${id}`, { lastFertilizedDate: today });
            fetchPlants(); // refresh
        } catch (error) {
            console.error('Error updating plant', error);
        }
    };

    const handleRepotToday = async (id) => {
        try {
            const today = new Date().toISOString();
            await api.put(`/plants/${id}`, { lastRepottedDate: today });
            fetchPlants(); // refresh
        } catch (error) {
            console.error('Error updating plant', error);
        }
    };

    if (loading) return (
        <div className="flex h-64 items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header & Stats Container */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-emerald-600 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
                    <div className="absolute right-0 top-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
                        <Sprout className="w-64 h-64" />
                    </div>
                    <div className="relative z-10">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-3xl font-bold mb-2">My Indoor Jungle</h1>
                                <p className="text-emerald-100 text-lg mb-8 max-w-md">Keep track of your plant family and never forget to water them again.</p>
                            </div>
                            <div>
                                <button 
                                    onClick={() => initPushNotifications(user?._id, true)} 
                                    className="bg-white text-emerald-600 hover:bg-emerald-50 transition font-bold px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1 animate-pulse"
                                >
                                    <Bell className="w-5 h-5 fill-emerald-600" /> Enable Notifications
                                </button>
                            </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-4">
                            <div 
                                onClick={() => handleFilterClick('all')}
                                className={`bg-white/20 backdrop-blur-md rounded-2xl px-6 py-4 border cursor-pointer transition-all hover:scale-105 ${activeFilter === 'all' ? 'border-white bg-white/30 ring-2 ring-white/20' : 'border-white/20'}`}
                            >
                                <div className="text-sm font-medium text-emerald-100 uppercase tracking-wider mb-1">Total Plants</div>
                                <div className="text-3xl font-bold">{stats.total}</div>
                            </div>
                            <div 
                                onClick={() => handleFilterClick('water')}
                                className={`bg-white/20 backdrop-blur-md rounded-2xl px-6 py-4 border cursor-pointer transition-all hover:scale-105 ${activeFilter === 'water' ? 'border-orange-300 bg-white/30 ring-2 ring-orange-300/20' : 'border-white/20'}`}
                            >
                                <div className="text-sm font-medium text-orange-100 uppercase tracking-wider mb-1">Needs Water</div>
                                <div className="text-3xl font-bold text-orange-300">{stats.needsWater}</div>
                            </div>
                            <div 
                                onClick={() => handleFilterClick('fertilize')}
                                className={`bg-white/20 backdrop-blur-md rounded-2xl px-6 py-4 border cursor-pointer transition-all hover:scale-105 ${activeFilter === 'fertilize' ? 'border-lime-300 bg-white/30 ring-2 ring-lime-300/20' : 'border-white/20'}`}
                            >
                                <div className="text-sm font-medium text-lime-100 uppercase tracking-wider mb-1">Needs Fertilizer</div>
                                <div className="text-3xl font-bold text-lime-300">{stats.needsFertilize}</div>
                            </div>
                            <div 
                                onClick={() => handleFilterClick('repot')}
                                className={`bg-white/20 backdrop-blur-md rounded-2xl px-6 py-4 border cursor-pointer transition-all hover:scale-105 ${activeFilter === 'repot' ? 'border-amber-300 bg-white/30 ring-2 ring-amber-300/20' : 'border-white/20'}`}
                            >
                                <div className="text-sm font-medium text-amber-100 uppercase tracking-wider mb-1">Needs Repot</div>
                                <div className="text-3xl font-bold text-amber-300">{stats.needsRepot}</div>
                            </div>



                        </div>

                    </div>
                </div>

                {/* Add Plant Card */}
                <Link to="/add-plant" className="bg-white rounded-3xl p-8 border-2 border-dashed border-emerald-200 hover:border-emerald-500 hover:bg-emerald-50 transition-all flex flex-col items-center justify-center text-center group shadow-sm hover:shadow-md cursor-pointer">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Plus className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">Add New Plant</h3>
                    <p className="text-slate-500 mt-2">Bring a new friend into your home</p>
                </Link>
            </div>

            {/* Content Section */}
            <div ref={plantListRef} className="scroll-mt-24">


                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        {activeFilter === 'all' && <><Bell className="w-6 h-6 text-emerald-500" /> Reminders</>}
                        {activeFilter === 'water' && <><Bell className="w-6 h-6 text-orange-500" /> Needs Watering</>}
                        {activeFilter === 'fertilize' && <><Bell className="w-6 h-6 text-lime-500" /> Needs Fertilizer</>}
                        {activeFilter === 'repot' && <><Bell className="w-6 h-6 text-amber-500" /> Needs Repotting</>}
                    </h2>
                    {activeFilter !== 'all' && (
                        <button 
                            onClick={() => handleFilterClick('all')}
                            className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 px-3 py-1.5 rounded-full transition-all border border-emerald-200 shadow-sm"
                        >
                            <X className="w-3.5 h-3.5" /> Clear Filter
                        </button>
                    )}

                </div>
                
                {plants.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
                        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Sprout className="w-12 h-12 text-slate-400" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">No plants yet</h3>
                        <p className="text-slate-500 mb-6 max-w-sm mx-auto">You haven't added any plants to your collection. Add your first plant to get started!</p>
                        <Link to="/add-plant" className="inline-flex items-center bg-emerald-600 text-white font-medium px-6 py-3 rounded-xl hover:bg-emerald-700 transition-colors">
                            <Plus className="w-5 h-5 mr-2" /> Add a Plant
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {plants
                            .filter(plant => {
                                if (activeFilter === 'all') return true;
                                if (activeFilter === 'water') return calculateDaysUntil(plant.nextWaterDate) <= 0;
                                if (activeFilter === 'fertilize') return plant.fertilizeFrequency > 0 && calculateDaysUntil(plant.nextFertilizeDate) <= 0;
                                if (activeFilter === 'repot') return plant.repotFrequency > 0 && calculateDaysUntil(plant.nextRepotDate) <= 0;
                                return true;
                            })
                            .map(plant => (
                                <PlantCard 
                                    key={plant._id} 
                                    plant={plant} 
                                    onWaterToday={handleWaterToday} 
                                    onFertilizeToday={handleFertilizeToday}
                                    onRepotToday={handleRepotToday}
                                />
                            ))}
                    </div>
                )}

            </div>
        </div>
    );
};

export default Dashboard;
