const mongoose = require('mongoose');
const dns = require('dns');
require('dotenv').config();
const Plant = require('./models/Plant');
const PushSubscription = require('./models/PushSubscription');
const User = require('./models/User');

const checkStatus = async () => {
    try {
        dns.setServers(['8.8.8.8', '1.1.1.1']);
        const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/plant_care_app';
        await mongoose.connect(uri);
        console.log('Connected to MongoDB at', uri);

        const plantCount = await Plant.countDocuments();
        console.log(`Total plants: ${plantCount}`);

        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        const plantsToCare = await Plant.find({
            $or: [
                { nextWaterDate: { $lte: todayEnd } },
                { nextFertilizeDate: { $lte: todayEnd } },
                { nextRepotDate: { $lte: todayEnd } }
            ]
        });
        console.log(`Plants needing care today: ${plantsToCare.length}`);
        
        plantsToCare.forEach(p => {
            console.log(`- ${p.plantName} (User: ${p.userId}, Water: ${p.nextWaterDate})`);
        });

        const subscriptions = await PushSubscription.find();
        console.log(`Total push subscriptions: ${subscriptions.length}`);
        subscriptions.forEach(s => console.log(`- Sub for User: ${s.userId}`));

        const users = await User.find();
        console.log(`Total users: ${users.length}`);
        users.forEach(u => console.log(`- User: ${u.name} (${u._id})`));

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkStatus();
