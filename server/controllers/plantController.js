const Plant = require('../models/Plant');

// Helper to add days to a date string/object
const computeNextDate = (lastDate, frequencyInDays) => {
    if (!lastDate || !frequencyInDays) return null;
    const nextDate = new Date(lastDate);
    nextDate.setDate(nextDate.getDate() + parseInt(frequencyInDays));
    return nextDate;
};

// @desc    Get all plants for logged in user
// @route   GET /api/plants
// @access  Private
const getPlants = async (req, res) => {
    try {
        const plants = await Plant.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(plants);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single plant
// @route   GET /api/plants/:id
// @access  Private
const getPlantById = async (req, res) => {
    try {
        const plant = await Plant.findById(req.params.id);
        if (!plant) {
            return res.status(404).json({ message: 'Plant not found' });
        }
        if (plant.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }
        res.json(plant);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add a new plant
// @route   POST /api/plants
// @access  Private
const addPlant = async (req, res) => {
    try {
        const { 
            plantName, plantType, wateringFrequency, lastWateredDate, 
            fertilizeFrequency, lastFertilizedDate,
            repotFrequency, lastRepottedDate,
            notes, image 
        } = req.body;

        if (!plantName || !plantType || !wateringFrequency || !lastWateredDate) {
            return res.status(400).json({ message: 'Please add all required fields' });
        }

        const nextWaterDate = computeNextDate(lastWateredDate, wateringFrequency);
        const nextFertilizeDate = computeNextDate(lastFertilizedDate, fertilizeFrequency);
        const nextRepotDate = computeNextDate(lastRepottedDate, repotFrequency);

        const plant = await Plant.create({
            plantName,
            plantType,
            wateringFrequency,
            lastWateredDate,
            nextWaterDate,
            fertilizeFrequency,
            lastFertilizedDate,
            nextFertilizeDate,
            repotFrequency,
            lastRepottedDate,
            nextRepotDate,
            notes,
            image,
            userId: req.user.id,
        });

        res.status(201).json(plant);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update plant
// @route   PUT /api/plants/:id
// @access  Private
const updatePlant = async (req, res) => {
    try {
        const plant = await Plant.findById(req.params.id);

        if (!plant) {
            return res.status(404).json({ message: 'Plant not found' });
        }

        if (plant.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        let updateData = { ...req.body };

        // if lastWateredDate or wateringFrequency updated, recalculate nextWaterDate
        if (updateData.lastWateredDate || updateData.wateringFrequency) {
            const passedLastWatered = updateData.lastWateredDate || plant.lastWateredDate;
            const passedFreq = updateData.wateringFrequency || plant.wateringFrequency;
            updateData.nextWaterDate = computeNextDate(passedLastWatered, passedFreq);
        }

        // if fertilization fields updated
        if (updateData.lastFertilizedDate || updateData.fertilizeFrequency !== undefined) {
            const passedLastFert = updateData.lastFertilizedDate || plant.lastFertilizedDate;
            const passedFertFreq = updateData.fertilizeFrequency !== undefined ? updateData.fertilizeFrequency : plant.fertilizeFrequency;
            updateData.nextFertilizeDate = computeNextDate(passedLastFert, passedFertFreq);
        }

        // if repot fields updated
        if (updateData.lastRepottedDate || updateData.repotFrequency !== undefined) {
            const passedLastRepot = updateData.lastRepottedDate || plant.lastRepottedDate;
            const passedRepotFreq = updateData.repotFrequency !== undefined ? updateData.repotFrequency : plant.repotFrequency;
            updateData.nextRepotDate = computeNextDate(passedLastRepot, passedRepotFreq);
        }

        const updatedPlant = await Plant.findByIdAndUpdate(req.params.id, updateData, { new: true });

        res.json(updatedPlant);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete plant
// @route   DELETE /api/plants/:id
// @access  Private
const deletePlant = async (req, res) => {
    try {
        const plant = await Plant.findById(req.params.id);

        if (!plant) {
            return res.status(404).json({ message: 'Plant not found' });
        }

        if (plant.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await plant.deleteOne();

        res.json({ id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getPlants,
    getPlantById,
    addPlant,
    updatePlant,
    deletePlant,
};
