const mongoose = require('mongoose');

let SummonerSchema = new mongoose.Schema({
    history: {
        type:
    }
})

let Summoner = mongoose.model('Summoner', SummonerSchema);

module.exports = { Summoner };