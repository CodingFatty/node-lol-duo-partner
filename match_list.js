const axios = require('axios');
const _ = require('lodash')
const match_by_name_url = 'https://na1.api.riotgames.com/lol/match/v4/matchlists/by-account/';
const { Summoner } = require('./models/player');

async function match_list(accountId) {
    try {
        let index = 0;
        let gameList = [];
        let summoner = await Summoner.findOne({ summonerId: accountId });
        summoner ? index = summoner.lastIndex : undefined;
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
                return gameList;
            }
        }
    } catch (e) {
        console.log(e)
    }
}

module.exports = { match_list };