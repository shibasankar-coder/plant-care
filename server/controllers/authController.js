const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../services/emailService');
const { getWelcomeTemplate } = require('../utils/emailTemplate');


// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'super_secret_jwt_key_here', {
        expiresIn: '30d',
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { name, email, password, image } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please add all fields' });
        }

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            image: image || ''
        });

        if (user) {
            // Send Welcome Email
            if (process.env.EMAIL_USER) {
                try {
                    const welcomeHtml = getWelcomeTemplate(user.name, process.env.FRONTEND_URL || 'http://localhost:5173');
                    await sendEmail(user.email, 'Welcome to your new Jungle! 🌿', welcomeHtml);
                    console.log(`Welcome email sent to ${user.email}`);
                } catch (emailErr) {
                    console.error('Welcome email failed to send:', emailErr.message);
                }
            }

            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                image: user.image,
                token: generateToken(user._id),
            });
        } else {

            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                image: user.image,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);


        if (user) {
            user.name = req.body.name || user.name;
            if (req.body.image !== undefined) {
                user.image = req.body.image;
            }
            
            if (req.body.password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(req.body.password, salt);
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                image: updatedUser.image,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete user account
// @route   DELETE /api/auth/profile
// @access  Private
const deleteUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (user) {
            await User.findByIdAndDelete(req.user.id);
            res.json({ message: 'User account deleted successfully' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    updateUserProfile,
    deleteUserProfile,
};


