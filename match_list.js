const axios = require('axios');
const {apiKey} = require('./config.json');

const match_by_name_url = 'https://na1.api.riotgames.com/lol/match/v4/matchlists/by-account/';
const queue_type = '?queue=420';
const rank_season = '&season=13';
const match_current_index = 0;
const begin_index = `&beginIndex=${match_current_index}`;

axios.defaults.headers.common['X-Riot-Token'] = apiKey;

let match_obj = {};

async function match_list(accountId) {
    try{
        console.log(match_by_name_url + accountId + queue_type + rank_season + begin_index)
        let result = await axios.get(match_by_name_url + accountId, {
            params: {
                queue: 420,
                season: 13,
                beginIndex: match_current_index
            }
        });
        return result.data;
    } catch(e){
        console.log(e)
    }
}

module.exports = {match_list};