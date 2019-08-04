const axios = require('axios');
const {apiKey} = require('./config.json');

const summoner_history_url = 'https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/';

axios.defaults.headers.common['X-Riot-Token'] = apiKey;


async function summoner_id(username) {
    let output=await axios.get(summoner_history_url + username).then(result => {
        return result.data
    })
    return output
    // return output
    // try{
    //     const result = await axios.get(summoner_history_url + username);
    //     console.log(result.data)
    //     return result.data;
    // } catch(e){
    //     console.log(e)
    //     return e
    // }
}

module.exports = {summoner_id};