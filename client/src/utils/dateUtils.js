export const calculateDaysUntil = (nextDateString) => {
    if (!nextDateString) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const nextDate = new Date(nextDateString);
    nextDate.setHours(0, 0, 0, 0);
    
    const diffTime = nextDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
};

// Keep for backward compatibility or rename everywhere
export const calculateDaysUntilWatering = calculateDaysUntil;

export const getActionStatus = (daysUntil, actionName = 'Water') => {
    if (daysUntil === null || daysUntil === undefined) return null;
    if (daysUntil < 0) return { label: `${actionName} Overdue`, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' };
    if (daysUntil === 0) return { label: `${actionName} Today`, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' };
    if (daysUntil === 1) return { label: `${actionName} Tomorrow`, color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' };
    return { label: `${actionName} in ${daysUntil}d`, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' };
};

export const getWateringStatus = (daysUntil) => getActionStatus(daysUntil, 'Water');

export const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};
