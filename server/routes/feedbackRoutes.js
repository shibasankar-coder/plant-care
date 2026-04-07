const express = require('express');
const router = express.Router();
const { submitFeedback, getFeedbacks } = require('../controllers/feedbackController');
const protect = require('../middleware/authMiddleware');

router.route('/').post(protect, submitFeedback).get(protect, getFeedbacks);

module.exports = router;
