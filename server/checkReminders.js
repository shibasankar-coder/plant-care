const mongoose = require('mongoose');
require('dotenv').config();
const Plant = require('./models/Plant');
const PushSubscription = require('./models/PushSubscription');
const User = require('./models/User');

const checkStatus = async () => {
    try {
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
            console.log(`- ${p.plantName} (Water: ${p.nextWaterDate}, Fertilize: ${p.nextFertilizeDate})`);
        });

        const subCount = await PushSubscription.countDocuments();
        console.log(`Total push subscriptions: ${subCount}`);

        const users = await User.find();
        console.log(`Total users: ${users.length}`);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkStatus();
