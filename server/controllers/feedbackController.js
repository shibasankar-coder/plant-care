const Feedback = require('../models/Feedback');

// @desc    Submit user feedback
// @route   POST /api/feedback
// @access  Private
exports.submitFeedback = async (req, res) => {
    try {
        const { rating, message } = req.body;

        if (!rating || !message) {
            return res.status(400).json({ message: 'Please provide both rating and message' });
        }

        const feedback = await Feedback.create({
            userId: req.user.id,
            rating,
            message
        });

        res.status(201).json(feedback);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all feedback (for admin usage)
// @route   GET /api/feedback
// @access  Private
exports.getFeedbacks = async (req, res) => {
    try {
        const feedbacks = await Feedback.find().populate('userId', 'name email').sort({ createdAt: -1 });
        res.json(feedbacks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
