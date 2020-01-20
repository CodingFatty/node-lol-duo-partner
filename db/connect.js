const mongoose = require('mongoose');
const { db } = require('../config.json');

const dbUsername = process.env.DB_USERNAME || db.username;
const dbPassword = process.env.DB_PASSWORD || db.password;

const mongoDB = `mongodb://${dbUsername}:${dbPassword}@ds263068.mlab.com:63068/duo-analysis`;

mongoose.set('useCreateIndex', true)
mongoose.connect(mongoDB, { useNewUrlParser: true });
console.log(`db connected: ${mongoDB}`)

module.exports = { mongoose }