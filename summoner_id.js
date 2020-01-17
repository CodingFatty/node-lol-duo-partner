const axios = require('axios');

const summoner_history_url = 'https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/';

async function summoner_id(username) {
    return await axios.get(summoner_history_url + username).then(result => {
        return result.data
    })
}

module.exports = { summoner_id };