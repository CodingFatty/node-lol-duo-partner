const axios = require('axios');
const _ = require('lodash')
const match_by_name_url = 'https://na1.api.riotgames.com/lol/match/v4/matchlists/by-account/';
const { Summoner } = require('./models/player');

async function match_list(accountId) {
    try {
        let index = 0;
        let gameList = [];
        let summoner = await Summoner.findOne({ summonerId: accountId });
        // fetch from last match updated
        if (!_.isEmpty(summoner)) {
            // fetch from the newest match timestamp + 1
            let lastFetchTimestamp = summoner.lastFetchTimestamp + 1;
            while (true) {
                let result = await axios.get(match_by_name_url + accountId, {
                    params: {
                        queue: 420,
                        season: 13,
                        beginTime: lastFetchTimestamp,
                        beginIndex: index
                    }
                })
                if (!_.isEmpty(result.data.matches)) {
                    gameList = _.concat(gameList, result.data.matches)
                    index = result.data.endIndex + 1;
                } else {
                    break;
                }
            };
            summoner.matches = _.concat(summoner.matches, gameList);
        } else {
            while (true) {
                let result = await axios.get(match_by_name_url + accountId, {
                    params: {
                        queue: 420,
                        season: 13,
                        beginIndex: index
                    }
                });
                if (!_.isEmpty(result.data.matches)) {
                    gameList = _.concat(gameList, result.data.matches)
                    index = result.data.endIndex + 1;
                } else {
                    break;
                }
            }
            summoner = new Summoner;
            summoner.summonerId = accountId
            summoner.matches = gameList;
            summoner.lastFetchTimestamp = gameList[0].timestamp;
        }
        await summoner.save();
        console.log('saved')
    } catch (e) {
        // only throw error if code !== 404
        if (e.response.data.status.status_code !== 404){
            throw {
                code: e.response.data.status.status_code,
                message: e.response.data.status.message
            }
        }
    }
}

module.exports = { match_list };