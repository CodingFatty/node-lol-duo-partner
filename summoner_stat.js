const _ = require('lodash');
const { Summoner } = require('./models/player');

function summoner_stat(summonerId) {
    return new Promise((resolve, reject) => {
        Summoner.findOne({ summonerId }, (err, summoner) => {
            let kda = 0;
            for (let i = 0; i < _.size(summoner.matches); i++) {
                if (_.findKey(summoner.matches[i], 'KDA')) {
                    kda += summoner.matches[i].KDA;
                } else {
                    let total = (summoner.matches[i].match.stats.kills + summoner.matches[i].match.stats.assists) / summoner.matches[i].match.stats.deaths
                    summoner.matches[i].KDA = total
                    kda += summoner.matches[i].KDA
                }
            }

            summoner.save((error) => {
                if (error) {
                    console.log('error')
                }
            })
            return resolve(kda)
        })
    })
}

module.exports = { summoner_stat }