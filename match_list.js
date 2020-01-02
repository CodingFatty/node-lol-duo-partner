const axios = require('axios');
const { apiKey } = require('./config.json');
const _ = require('lodash')
const match_by_name_url = 'https://na1.api.riotgames.com/lol/match/v4/matchlists/by-account/';
const queue_type = '?queue=420';
const rank_season = '&season=13';
const match_current_index = 0;
const begin_index = `&beginIndex=${match_current_index}`;

axios.defaults.headers.common['X-Riot-Token'] = apiKey;

// let match_obj = {};

async function match_list(accountId, total_game, index) {
    try {
        // console.log(match_by_name_url + accountId + queue_type + rank_season + index)
        let result = await axios.get(match_by_name_url + accountId, {
            params: {
                queue: 420,
                season: 13,
                beginIndex: index
            }
        });
        if (!_.isEmpty(result.data.matches)) {
            let total_game_new = _.concat(total_game, result.data.matches)
            return await match_list(accountId, total_game_new, result.data.endIndex + 1);
        } else {
            // console.log(total_game)
            return total_game;
        }
        
    } catch (e) {
        console.log(e)
    }
}

module.exports = { match_list };