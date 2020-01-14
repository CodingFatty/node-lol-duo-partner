const mongoose = require('mongoose');

let SummonerSchema = new mongoose.Schema({
    summonerId: {
        type: String,
        required: true,
        unique: true
    },
    matches: [{
        gameId: String,
        match: Object,
        detail: Object
    }],
    lastUpdated: {
        type: Number,
        required: true
    }
}, {
    collection: 'historySeed'
})

let Summoner = mongoose.model('Summoner', SummonerSchema);

module.exports = { Summoner };