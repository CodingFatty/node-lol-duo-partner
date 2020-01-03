const mongoose = require('mongoose');

const mongoDB = 'mongodb://localhost/duo_analysis';

mongoose.set('useCreateIndex', true)
mongoose.connect(mongoDB, { useNewUrlParser: true });
console.log(`db connected: ${mongoDB}`)

module.exports = { mongoose }