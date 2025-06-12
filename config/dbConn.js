const mongoose = require('mongoose');
// Using mongoose connect to mongodb.
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URI);
        console.log('Connected!');
    } catch (error) {
        console.log(error);
    }
}


module.exports = connectDB;