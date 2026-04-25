const express = require('express');
const router = express.Router();
const { identifyPlant } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');


router.post('/identify', protect, identifyPlant);

module.exports = router;
