const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/plant_care_app').then(async () => {
    const db = mongoose.connection.db;
    const PushSubscription = mongoose.model('PushSubscription', new mongoose.Schema({
        endpoint: String,
        userId: mongoose.Schema.Types.ObjectId,
        anonymousId: String,
        device: String
    }));
    
    const subs = await PushSubscription.find({});
    console.log(JSON.stringify(subs, null, 2));
    process.exit(0);
});
