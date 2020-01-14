const _ = require('lodash');
const { Summoner } = require('./models/player');

function summoner_stat(summonerId) {
    return new Promise((resolve, reject) => {
        Summoner.findOne({ summonerId }, (err, summoner) => {
            let result = [];
            for (let i = 0; i < _.size(summoner.matches); i++) {
                if (_.findKey(summoner.matches[i], 'detail')) {
                    result.push(summoner.matches[i].detail)
                } else {
                    let role = summoner.matches[i].match.timeline.role
                    let lane = summoner.matches[i].match.timeline.lane
                    let championId = summoner.matches[i].match.championId
                    let victory = summoner.matches[i].match.stats.win
                    let csScore = summoner.matches[i].match.stats.totalMinionsKilled
                    result.push({
                        role,
                        lane,
                        championId,
                        victory,
                        csScore,
                        kills: summoner.matches[i].match.stats.kills,
                        assists: summoner.matches[i].match.stats.assists,
                        deaths: summoner.matches[i].match.stats.deaths
                    })
                }
            }

            summoner.save((error) => {
                if (error) {
                    console.log('error')
                }
            })
            resolve(result)
        })
    })
}

module.exports = { summoner_stat }