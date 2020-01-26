const mongoose = require('mongoose');

let SummonerSchema = new mongoose.Schema({
    summonerId: {
        type: String,
        required: true,
        unique: true
    },
    matches: [{
        platformId: String,
        gameId: Number,
        champion: Number,
        queue: Number,
        season: Number,
        timestamp: Number,
        role: String,
        lane: String,
        match: Object,
        detail: Object
    }],
    championWinRate: Object,
    overallWinRate: Object,
    lastUpdated: {
        type: Number
    },
    lastFetchTimestamp: Number
}, {
    collection: 'historySeed'
})

let Summoner = mongoose.model('Summoner', SummonerSchema);

module.exports = { Summoner };