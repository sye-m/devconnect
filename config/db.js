const mongoose = require('mongoose');
const config = require('config');
const mongoDB = config.get('mongoURI');

const db = async() => {
    try {
        await mongoose.connect(mongoDB, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
        console.log('Mongo connected');
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}

module.exports = db;