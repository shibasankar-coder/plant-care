const PushSubscription = require('../models/PushSubscription');
const webPush = require('web-push');

// Subscribe user/guest to push notifications
exports.subscribe = async (req, res) => {
    try {
        console.log('Incoming Subscription Request Body:', JSON.stringify(req.body, null, 2));
        const { subscription, anonymousId, userId, device } = req.body;

        if (!subscription || !subscription.endpoint) {
            console.error('Subscription Error: Missing endpoint in request body');
            return res.status(400).json({ error: 'Invalid subscription object' });
        }

        // Use findOneAndUpdate with upsert to atomically prevent duplicate key (E11000) errors
        const updateData = {
            keys: subscription.keys,
            device,
            isActive: true
        };
        
        console.log('Processed Update Data:', JSON.stringify(updateData, null, 2));

        if (userId) {
            console.log('Cleaning up old subscriptions for userId:', userId);
            await PushSubscription.deleteMany({ userId, endpoint: { $ne: subscription.endpoint } });
            updateData.userId = userId;
        }
        
        if (anonymousId) {
            console.log('Cleaning up old subscriptions for anonymousId:', anonymousId);
            await PushSubscription.deleteMany({ anonymousId, endpoint: { $ne: subscription.endpoint }, userId: null });
            updateData.anonymousId = anonymousId;
        }

        console.log('Attempting DB Upsert for endpoint:', subscription.endpoint);
        const sub = await PushSubscription.findOneAndUpdate(
            { endpoint: subscription.endpoint },
            { $set: updateData },
            { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true }
        );

        console.log('Subscription successfully saved/updated:', sub._id);
        res.status(200).json({ message: 'Subscription processed successfully', data: sub });
    } catch (error) {
        console.error('CRITICAL Subscription Error:', error);
        res.status(500).json({ error: 'Internal server error while subscribing', detail: error.message });
    }
};

const User = require('../models/User');
const Plant = require('../models/Plant');
const { sendEmail } = require('../services/emailService');
const { getCareReportTemplate } = require('../utils/emailTemplate');


// Send actual care report now
exports.sendTestPush = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) return res.status(400).json({ error: 'Provide userId' });

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        // Find plants needing attention today
        const userPlants = await Plant.find({
            userId,
            $or: [
                { nextWaterDate: { $lte: todayEnd } },
                { nextFertilizeDate: { $lte: todayEnd } },
                { nextRepotDate: { $lte: todayEnd } }
            ]
        });

        if (userPlants.length === 0) {
            return res.status(200).json({ message: 'No plants need care today! Your jungle is healthy.' });
        }

        const tasks = { water: [], fertilize: [], repot: [] };
        userPlants.forEach(plant => {
            if (plant.nextWaterDate <= todayEnd) tasks.water.push(plant.plantName);
            if (plant.nextFertilizeDate && plant.nextFertilizeDate <= todayEnd) tasks.fertilize.push(plant.plantName);
            if (plant.nextRepotDate && plant.nextRepotDate <= todayEnd) tasks.repot.push(plant.plantName);
        });

        const allTaskStrings = [
            ...tasks.water.map(p => `💦 Water: ${p}`),
            ...tasks.fertilize.map(p => `🧪 Fertilize: ${p}`),
            ...tasks.repot.map(p => `🪴 Repot: ${p}`)
        ];

        // 1. Send Push
        const subscriptions = await PushSubscription.find({ userId });
        const baseUrl = (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, '');
        const pushUrl = `${baseUrl}/dashboard`;
        console.log(`Sending Manual Report Push with Absolute URL: ${pushUrl}`);

        const payload = JSON.stringify({
            title: 'Plant Care Report 🌿',
            body: `You have ${allTaskStrings.length} tasks today:\n${allTaskStrings.slice(0, 3).join('\n')}`,
            icon: '/icon-192x192.png',
            url: pushUrl
        });


        
        subscriptions.forEach(async (sub) => {
            try {
                await webPush.sendNotification(sub, payload);
            } catch (err) {
                if (err.statusCode === 410 || err.statusCode === 404) {
                    await PushSubscription.deleteOne({ _id: sub._id });
                }
            }
        });

        // 2. Send Email
        let emailSent = false;
        if (process.env.EMAIL_USER && user.email) {
            const taskHtml = getCareReportTemplate(
                user.name, 
                tasks, 
                process.env.FRONTEND_URL || 'http://localhost:5173'
            );
            try {
                await sendEmail(user.email, `🌿 Plant Care Tasks for Today (${allTaskStrings.length})`, taskHtml);
                emailSent = true;
            } catch (emailErr) {
                console.error('Email report failed:', emailErr);
            }
        }

        
        res.status(200).json({ 
            message: `Report sent for ${allTaskStrings.length} tasks!`,
            emailSent
        });
    } catch (error) {
        console.error('Report send error:', error);
        res.status(500).json({ error: 'Failed to send care report' });
    }
};



// Unsubscribe
exports.unsubscribe = async (req, res) => {
    try {
        const { endpoint } = req.body;
        if (!endpoint) return res.status(400).json({ error: 'Missing endpoint' });

        await PushSubscription.deleteOne({ endpoint });
        res.status(200).json({ message: 'Successfully unsubscribed' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to unsubscribe' });
    }
};
