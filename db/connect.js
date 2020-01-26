const mongoose = require('mongoose');

const mongoDB = process.env.MONGOURI;

mongoose.set('useCreateIndex', true)
mongoose.connect(mongoDB, { useNewUrlParser: true,  useUnifiedTopology: true });
console.log(`db connected: ${mongoDB}`)

module.exports = { mongoose }