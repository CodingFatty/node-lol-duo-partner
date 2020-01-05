const axios = require('axios');
const _ = require('lodash');
const { Summoner } = require('./models/player');
const check_match_by_id = 'https://na1.api.riotgames.com/lol/match/v4/matches/';

async function match_detail(matchId, player_name) {
    let result = await axios.get(check_match_by_id + matchId)
    let playerId = _.find(result.data.participantIdentities,
        {
            'player': {
                'summonerName': 'UltraDen'
            }
        })
    let detail = _.find(result.data.participants, {
        participantId: playerId.participantId
    })
    // console.log(detail)
    Summoner.findOne({
        summonerId: playerId.player.accountId
    }, (err, summoner) => {
        // if summoner doesnt exist in db
        if (!summoner) {
            Summoner.create({
                summonerId: playerId.player.accountId,
                matches: {
                    gameId: matchId,
                    match: detail
                },
                lastUpdated: Date.now()
            }, (err) => {
                if (err) return console.log(err);
            })
        } else {
            // if summoner exist in db & match detail is not yet saved)
            if (!_.find(summoner.matches, ['gameId', _.toString(matchId)])) {
                summoner.matches.push({
                    gameId: matchId,
                    match: detail
                })
                summoner.lastUpdated = Date.now()

                summoner.save((error) => {
                    if (error) {
                        console.log('error')
                    }
                    console.log(`${matchId} saved`);
                })
            }
            console.log(`${matchId} already exists`)
        }
    })
    return result.data;
}

module.exports = { match_detail }