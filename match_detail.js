const axios = require('axios');
const _ = require('lodash');
const { Summoner } = require('./models/player');
const check_match_by_id = 'https://na1.api.riotgames.com/lol/match/v4/matches/';

async function match_api(player_name, matchId) {
    let result = await axios.get(check_match_by_id + matchId)
    let playerId = _.find(result.data.participantIdentities,
        {
            'player': {
                'summonerName': player_name
            }
        })
    let detail = _.find(result.data.participants, {
        participantId: playerId.participantId
    })
    return detail
}

async function match_detail(matchId, player_name, accountId) {
    const summoner = await Summoner.findOne({
        summonerId: accountId
    })

    // if summoner doesnt exist in db
    if (!summoner) {
        let detail = await match_api(player_name, matchId)
        await Summoner.create({
            summonerId: accountId,
            matches: {
                gameId: matchId,
                match: detail
            },
            lastUpdated: Math.floor(Date.now() / 1000)
        })
    } else {
        // if summoner exist in db & match detail is not yet saved
        if (!_.find(summoner.matches, ['gameId', _.toString(matchId)])) {
            let detail = await match_api(player_name, matchId)
            // console.log(result)
            summoner.matches.push({
                gameId: matchId,
                match: detail
            })
            summoner.lastUpdated = Math.floor(Date.now() / 1000)

            summoner.save((error) => {
                if (error) {
                    console.log('error')
                }
                console.log(`${matchId} saved`);
            })
        } else {
            console.log(`${matchId} already exists`)
        }
    }
    // })
    return result
}

module.exports = { match_detail }