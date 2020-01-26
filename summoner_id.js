const axios = require('axios');
const createError = require('http-errors');
const summoner_history_url = 'https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/';

async function summoner_id(username) {
    return await axios.get(summoner_history_url + username).then(result => {
        return result.data
    }).catch(err => {
        throw {
            code: err.response.data.status.status_code,
            message: err.response.data.status.message
        }
    })
}

module.exports = { summoner_id };