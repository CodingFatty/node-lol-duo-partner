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

function fetch_detail(gameList, player_name, index) {
    return new Promise(async (resolve, reject) => {
        let detail = await match_api(player_name, gameList[index].gameId).catch(err => reject(err));

        gameList[index].match = detail;
        console.log(`${gameList[index].gameId} saved`)
        resolve();
    })
}

function limitCall(gameList, player_name, rateLimit, concurrentCallLimit, timeInterval) {
    return new Promise(async (resolve, reject) => {
        let index = 0;
        let promises = [];
        let currentLimit = 1;
        while (currentLimit <= rateLimit) {
            if (_.size(gameList) > index) {
                let promise = fetch_detail(gameList, player_name, index)
                promises.push(promise);
                console.log(currentLimit, promise)
                if (currentLimit % concurrentCallLimit === 0 || currentLimit === rateLimit || _.size(gameList) === index + 1) {
                    console.log('-----------')
                    // promise all? race ? reject?
                    await Promise.all(promises)
                        .then(() => {
                            if (currentLimit === rateLimit) {
                                return;
                            }
                            console.log(`${currentLimit}, ${concurrentCallLimit}, ${timeInterval}ms`)

                            // .catch(() => currentLimit--)
                            // _.forEach(values, value => {
                            //     console.log(value.message)
                            //     value.message === 'Match Not Empty' ? currentLimit-- : undefined;
                            // })
                            return new Promise(resolve => setTimeout(resolve, timeInterval));
                        })

                    promises = [];
                }
                currentLimit++;
                index++;
            } else {
                break;
            }
        }
        resolve();
    })
}

async function match_detail(player_name, accountId, rateLimit) {
    try {
        let summoner = await Summoner.findOne({
            summonerId: accountId
        })

        // get a list of matches with no match detail
        let filteredList = _.filter(summoner.matches, obj => _.isEmpty(obj.match));

        if (!_.isEmpty(filteredList)) {
            await limitCall(filteredList, player_name, rateLimit, 4, 1000);
        }

        summoner.lastUpdated = Math.floor(Date.now() / 1000);
        await summoner.save()
        console.log(`all saved`);
    } catch (e) {
        throw {
            code: err.response.data.status.status_code,
            message: err.response.data.status.message
        }
    }
}

module.exports = { match_detail }