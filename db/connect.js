const mongoose = require('mongoose');

let dbUsername = process.env.DB_USERNAME;
let dbPassword = process.env.DB_PASSWORD;

let env = process.env.NODE_ENV || 'development';

if (env == 'development' || env === 'test') {
    const { db } = require('../config.json');
    dbUsername = db.username
    dbPassword = db.password

}
const mongoDB = `mongodb://${dbUsername}:${dbPassword}@ds263068.mlab.com:63068/duo-analysis`;

mongoose.set('useCreateIndex', true)
mongoose.connect(mongoDB, { useNewUrlParser: true });
console.log(`db connected: ${mongoDB}`)

module.exports = { mongoose }