const express = require('express');
const router = express.Router();
const { getPlants, getPlantById, addPlant, updatePlant, deletePlant } = require('../controllers/plantController');
const { protect } = require('../middleware/authMiddleware');


router.route('/')
    .get(protect, getPlants)
    .post(protect, addPlant);

router.route('/:id')
    .get(protect, getPlantById)
    .put(protect, updatePlant)
    .delete(protect, deletePlant);

module.exports = router;
