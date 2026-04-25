import React from 'react';
import { Link } from 'react-router-dom';
import { Droplets, Calendar, ChevronRight, Leaf, Box } from 'lucide-react';
import { calculateDaysUntil, getActionStatus, formatDate } from '../utils/dateUtils';

const PlantCard = ({ plant, onWaterToday, onFertilizeToday, onRepotToday }) => {
    const waterDaysUntil = calculateDaysUntil(plant.nextWaterDate);
    const waterStatus = getActionStatus(waterDaysUntil, 'Water');

    const fertDaysUntil = plant.fertilizeFrequency > 0 ? calculateDaysUntil(plant.nextFertilizeDate) : null;
    const fertStatus = fertDaysUntil !== null ? getActionStatus(fertDaysUntil, 'Fertilize') : null;

    const repotDaysUntil = plant.repotFrequency > 0 ? calculateDaysUntil(plant.nextRepotDate) : null;
    const repotStatus = repotDaysUntil !== null ? getActionStatus(repotDaysUntil, 'Repot') : null;

    return (
        <div className={`relative bg-white rounded-2xl p-5 shadow-sm border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-emerald-300 flex flex-col ${waterStatus.border}`}>
            {/* Status Badges */}
            <div className="absolute -top-3 right-2 flex gap-1 flex-col items-end z-10">
                <div className={`px-3 py-1 rounded-full text-xs font-bold border ${waterStatus.bg} ${waterStatus.color} ${waterStatus.border} shadow-sm`}>
                    {waterStatus.label}
                </div>
                {fertStatus && (
                    <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${fertStatus.bg} ${fertStatus.color} ${fertStatus.border} shadow-sm`}>
                        {fertStatus.label}
                    </div>
                )}
                {repotStatus && (
                    <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${repotStatus.bg} ${repotStatus.color} ${repotStatus.border} shadow-sm`}>
                        {repotStatus.label}
                    </div>
                )}
            </div>

            <Link to={`/plant/${plant._id}`} className="flex items-start gap-4 mb-4 mt-2 group/header">
                <div className="w-16 h-16 rounded-xl bg-emerald-100 flex-shrink-0 flex items-center justify-center overflow-hidden z-0 group-hover/header:ring-2 group-hover/header:ring-emerald-400 transition-all">
                    {plant.image ? (
                        <img src={plant.image} alt={plant.plantName} className="object-cover w-full h-full" />
                    ) : (
                        <span className="text-3xl">🪴</span>
                    )}
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-800 line-clamp-1 pr-6 group-hover/header:text-emerald-600 transition-colors">{plant.plantName}</h3>
                    <p className="text-sm text-slate-500 font-medium">{plant.plantType}</p>
                </div>
            </Link>


            <div className="space-y-1.5 mb-5 flex-grow text-xs text-slate-600">
                <div className="flex items-center gap-2">
                    <Droplets className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                    <span className="truncate">Every {plant.wateringFrequency}d • Last: {formatDate(plant.lastWateredDate)}</span>
                </div>
                {plant.fertilizeFrequency > 0 && (
                    <div className="flex items-center gap-2">
                        <Leaf className="w-3.5 h-3.5 text-lime-500 flex-shrink-0" />
                        <span className="truncate">Every {plant.fertilizeFrequency}d • Last: {formatDate(plant.lastFertilizedDate)}</span>
                    </div>
                )}
                {plant.repotFrequency > 0 && (
                    <div className="flex items-center gap-2">
                        <Box className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                        <span className="truncate">Every {plant.repotFrequency}d • Last: {formatDate(plant.lastRepottedDate)}</span>
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-2 mt-auto">
                <div className="flex gap-2">
                    <button 
                        onClick={() => onWaterToday(plant._id)}
                        className="flex-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 py-1.5 rounded-lg font-medium transition-colors text-xs flex items-center justify-center"
                        title="Mark as watered today"
                    >
                        <Droplets className="w-3.5 h-3.5 mr-1" /> Water
                    </button>
                    {plant.fertilizeFrequency > 0 && (
                        <button 
                            onClick={() => onFertilizeToday(plant._id)}
                            className="flex-1 bg-lime-50 text-lime-700 hover:bg-lime-100 py-1.5 rounded-lg font-medium transition-colors text-xs flex items-center justify-center"
                            title="Mark as fertilized today"
                        >
                            <Leaf className="w-3.5 h-3.5 mr-1" /> Fertilize
                        </button>
                    )}
                </div>
                <div className="flex gap-2">
                    {plant.repotFrequency > 0 && (
                        <button 
                            onClick={() => onRepotToday(plant._id)}
                            className="flex-1 bg-amber-50 text-amber-700 hover:bg-amber-100 py-1.5 rounded-lg font-medium transition-colors text-xs flex items-center justify-center"
                            title="Mark as repotted today"
                        >
                            <Box className="w-3.5 h-3.5 mr-1" /> Repot
                        </button>
                    )}
                    <Link 
                        to={`/plant/${plant._id}`}
                        className="flex-1 border border-slate-200 text-slate-700 hover:bg-slate-50 py-1.5 rounded-lg font-medium transition-colors text-xs flex items-center justify-center"
                    >
                        Details <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PlantCard;
