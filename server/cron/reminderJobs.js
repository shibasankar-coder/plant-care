const cron = require('node-cron');
const Plant = require('../models/Plant');
const User = require('../models/User');
const PushSubscription = require('../models/PushSubscription');
const webPush = require('web-push');
const { sendEmail } = require('../services/emailService');
const { getCareReportTemplate } = require('../utils/emailTemplate');


const checkAndSendReminders = async () => {
    console.log('Running complex plant reminder check (Push + Email)...');
    try {
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        // Find all plants needing attention today
        const plantsToCare = await Plant.find({
            $or: [
                { nextWaterDate: { $lte: todayEnd } },
                { nextFertilizeDate: { $lte: todayEnd } },
                { nextRepotDate: { $lte: todayEnd } }
            ]
        }).populate('userId');
    
        // Group tasks by user
        const userReminders = {};

        plantsToCare.forEach(plant => {
            if (!plant.userId) return; 
            const userId = plant.userId._id.toString();
            if (!userReminders[userId]) {
                userReminders[userId] = {
                    user: plant.userId,
                    tasks: { water: [], fertilize: [], repot: [] }
                };
            }

            if (plant.nextWaterDate <= todayEnd) userReminders[userId].tasks.water.push(plant.plantName);
            if (plant.nextFertilizeDate && plant.nextFertilizeDate <= todayEnd) userReminders[userId].tasks.fertilize.push(plant.plantName);
            if (plant.nextRepotDate && plant.nextRepotDate <= todayEnd) userReminders[userId].tasks.repot.push(plant.plantName);
        });

        // Send notifications
        for (const [userId, data] of Object.entries(userReminders)) {
            const { user, tasks } = data;
            
            // 1. Prepare messages
            const allTasks = [
                ...tasks.water.map(p => `💦 Water: ${p}`),
                ...tasks.fertilize.map(p => `🧪 Fertilize: ${p}`),
                ...tasks.repot.map(p => `🪴 Repot: ${p}`)
            ];

            if (allTasks.length === 0) continue;

            // 2. Send Push Notifications
            const subscriptions = await PushSubscription.find({ userId });
            if (subscriptions.length > 0) {
                const baseUrl = (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, '');
                const pushUrl = `${baseUrl}/dashboard`;
                console.log(`Sending Push Notification with Absolute URL: ${pushUrl}`);

                const payload = JSON.stringify({
                    title: 'Plant Care Reminder 🌿',
                    body: `You have ${allTasks.length} tasks today:\n${allTasks.slice(0, 3).join('\n')}${allTasks.length > 3 ? '\n...and more' : ''}`,
                    icon: '/icon-192x192.png',
                    url: pushUrl
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

            if (process.env.EMAIL_USER && user.email) {
                const taskHtml = getCareReportTemplate(
                    user.name, 
                    tasks, 
                    process.env.FRONTEND_URL || 'http://localhost:5173'
                );


                try {
                    await sendEmail(user.email, `🌿 Plant Care Tasks for Today (${allTasks.length})`, taskHtml);
                } catch (emailErr) {
                    console.error(`Failed to send email to ${user.email}:`, emailErr);
                }
            }
        }
        console.log(`Reminders processed for ${Object.keys(userReminders).length} users.`);
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

