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

function fetch_detail(summoner, matchId, player_name, index) {
    return new Promise(async (resolve, reject) => {
        if (!_.find(summoner.matches, ['gameId', _.toString(matchId[index])])) {
            let detail = await match_api(player_name, matchId[index])
            summoner.matches.push({
                gameId: matchId[index],
                match: detail
            })
            summoner.lastUpdated = Math.floor(Date.now() / 1000);
            console.log(`${matchId[index]} saved`)
            resolve(summoner);
        } else {
            console.log(`${matchId[index]} already exists`)
            reject();
        }
    })
}

function limitCall(summoner, matchId, player_name, rateLimit, index ,concurrentCallLimit, timeInterval) {
    return new Promise(async (resolve, reject) => {
        let promises = [];
        let currentLimit = 1;
        while (currentLimit <= rateLimit) {
            let promise = fetch_detail(summoner, matchId, player_name, index);
            promises.push(promise)
            if (currentLimit % concurrentCallLimit === 0 || currentLimit === rateLimit) {
                await Promise.all(promises)
                    .then(() => {
                        if (currentLimit === rateLimit){
                            return;
                        }
                        console.log(`${timeInterval}ms`)
                        return new Promise(resolve => setTimeout(resolve, timeInterval));
                    })
                    .catch(() => currentLimit--)
                promises = [];
            }
            currentLimit++;
            index++;
        }
        summoner.lastIndex = index;
        resolve(summoner);
    })
}

async function match_detail(matchId, player_name, accountId, rateLimit) {
    let summoner = await Summoner.findOne({
        summonerId: accountId
    })
    // if summoner doesnt exist in db
    if (!summoner) {
        let detail = await match_api(player_name, matchId[0])
        summoner = await Summoner.create({
            summonerId: accountId,
            matches: {
                gameId: matchId[0],
                match: detail
            },
            lastUpdated: Math.floor(Date.now() / 1000),
            lastIndex: 1
        })
        console.log(`${matchId[0]} created`);
        rateLimit -= 1;
    }

    // if summoner exist in db & match detail is not yet saved
    summoner = await limitCall(summoner, matchId, player_name, rateLimit, summoner.lastIndex, 5, 1000)
    await summoner.save()
    console.log(`all saved`);
}

module.exports = { match_detail }