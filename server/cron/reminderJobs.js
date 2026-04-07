const cron = require('node-cron');
const Plant = require('../models/Plant');
const PushSubscription = require('../models/PushSubscription');
const webPush = require('web-push');

const checkAndSendReminders = async () => {
    console.log('Running plant reminder check...');
    try {
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        // Find plants whose nextWaterDate is today or earlier
        const plantsToWater = await Plant.find({
            nextWaterDate: { $lte: todayEnd }
        });
    
        // Group notifications by userId
        const notificationsMap = {};

        plantsToWater.forEach(plant => {
            if (!plant.userId) return; 
            const id = plant.userId.toString();
            if (!notificationsMap[id]) {
                notificationsMap[id] = [];
            }
            notificationsMap[id].push(`💦 ${plant.plantName}`);
        });

        // Send notifications
        for (const [userId, messages] of Object.entries(notificationsMap)) {
            // Find subscriptions for this user
            const subscriptions = await PushSubscription.find({ userId });

            if (subscriptions.length > 0) {
                const payload = JSON.stringify({
                    title: 'Plant Care Reminder Reminder 🌿',
                    body: `It's time to water your plants:\n${messages.join('\n')}`,
                    icon: '/icon-192x192.png',
                    url: '/dashboard'
                });

                subscriptions.forEach(async (sub) => {
                    try {
                        await webPush.sendNotification(sub, payload);
                    } catch (error) {
                        if (error.statusCode === 410 || error.statusCode === 404) {
                            await PushSubscription.deleteOne({ _id: sub._id });
                        }
                    }
                });
            }
        }
        console.log(`Pushed reminders for ${Object.keys(notificationsMap).length} users.`);
    } catch (error) {
        console.error('Error in reminder cron:', error);
    }
};

const startReminderCron = () => {
    // Run every day at 8:00 AM
    cron.schedule('0 8 * * *', checkAndSendReminders);
    console.log('Reminder cron job scheduled for 08:00 AM daily.');
};

module.exports = { startReminderCron, checkAndSendReminders };
