const PushSubscription = require('../models/PushSubscription');
const webPush = require('web-push');

// Subscribe user/guest to push notifications
exports.subscribe = async (req, res) => {
    try {
        const { subscription, anonymousId, userId, device } = req.body;

        if (!subscription || !subscription.endpoint) {
            return res.status(400).json({ error: 'Invalid subscription object' });
        }

        // Use findOneAndUpdate with upsert to atomically prevent duplicate key (E11000) errors
        // during simultaneous requests (e.g. React Strict Mode double hooks).
        const updateData = {
            keys: subscription.keys,
            device,
            isActive: true
        };
        
        if (userId) {
            // Development Cleanup: Delete all old subscriptions for this user across different test browsers
            // ensuring this user only ever has 1 active row strictly tied to their latest session.
            await PushSubscription.deleteMany({ userId, endpoint: { $ne: subscription.endpoint } });
            updateData.userId = userId;
        }
        
        if (anonymousId) {
            // Also clean up guest test sessions
            await PushSubscription.deleteMany({ anonymousId, endpoint: { $ne: subscription.endpoint }, userId: null });
            updateData.anonymousId = anonymousId;
        }

        const sub = await PushSubscription.findOneAndUpdate(
            { endpoint: subscription.endpoint },
            { $set: updateData },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        res.status(200).json({ message: 'Subscription processed successfully', data: sub });
    } catch (error) {
        console.error('Subscription Error:', error);
        res.status(500).json({ error: 'Internal server error while subscribing' });
    }
};

// Send test notification
exports.sendTestPush = async (req, res) => {
    try {
        const { anonymousId, userId } = req.body;
        
        // Find subscriptions for user
        let query = {};
        if (userId) query.userId = userId;
        else if (anonymousId) query.anonymousId = anonymousId;
        else return res.status(400).json({ error: 'Provide userId or anonymousId' });

        const subscriptions = await PushSubscription.find(query);

        if (subscriptions.length === 0) {
            return res.status(404).json({ error: 'No active subscriptions found for user' });
        }

        const payload = JSON.stringify({
            title: 'Test Notification 🌿',
            body: 'Web Push Notifications are working!',
            icon: '/icon-192x192.png',
            url: '/dashboard'
        });

        const sendPromises = subscriptions.map(async (sub) => {
            try {
                await webPush.sendNotification(sub, payload);
            } catch (err) {
                if (err.statusCode === 410 || err.statusCode === 404) {
                    console.log('Subscription expired/unregistered, deleting...', sub.endpoint);
                    await PushSubscription.deleteOne({ _id: sub._id });
                } else {
                    console.error('Failed to send push: ', err);
                }
            }
        });

        await Promise.all(sendPromises);
        res.status(200).json({ message: 'Push sent to devices' });
    } catch (error) {
        console.error('Push test error:', error);
        res.status(500).json({ error: 'Failed to send test push' });
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
