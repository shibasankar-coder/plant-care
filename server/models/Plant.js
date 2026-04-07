const mongoose = require('mongoose');

const plantSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    plantName: {
        type: String,
        required: true,
    },
    plantType: {
        type: String,
        required: true,
    },
    wateringFrequency: {
        type: Number,
        required: true, // in days
    },
    lastWateredDate: {
        type: Date,
        required: true,
    },
    nextWaterDate: {
        type: Date,
        required: true,
    },
    fertilizeFrequency: {
        type: Number,
        default: 0, // 0 means no fertilization tracking
    },
    lastFertilizedDate: {
        type: Date,
    },
    nextFertilizeDate: {
        type: Date,
    },
    repotFrequency: {
        type: Number,
        default: 0, // in days, e.g., 365
    },
    lastRepottedDate: {
        type: Date,
    },
    nextRepotDate: {
        type: Date,
    },
    notes: {
        type: String,
        default: '',
    },
    image: {
        type: String,
        default: '',
    },
}, { timestamps: true });

module.exports = mongoose.model('Plant', plantSchema);
