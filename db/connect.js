const mongoose = require('mongoose');
const { db } = require('../config.js');

const mongoDB = `mongodb://${db.username}>:${db.password}>@ds263068.mlab.com:63068/duo-analysis`;

mongoose.set('useCreateIndex', true)
mongoose.connect(mongoDB, { useNewUrlParser: true });
console.log(`db connected: ${mongoDB}`)

module.exports = { mongoose }