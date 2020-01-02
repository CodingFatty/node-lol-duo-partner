const express = require('express');
const app = express();
const mongoose = require('./db/connect');
const axios = require('axios');
const _ = require('lodash');
const PORT = process.env.PORT || 8000;
const {apiKey} = require('./config.json');
const {summoner_id} = require('./summoner_id');
const {match_list} = require('./match_list');

app.use(express.json());

axios.defaults.headers.common['X-Riot-Token'] = apiKey;
axios.defaults.headers.common['Accept-Charset'] = "application/x-www-form-urlencoded";

// function timeout(ms) {
//     return new Promise(resolve => setTimeout(resolve, ms));
// };

// async function calling(player_data) {
//     const check_match_by_id = 'https://na1.api.riotgames.com/lol/match/v4/matches/';
//     let final_obj = [];

//     for (let player in player_data) {
//         let player_match = player_data[player].matches;
//         for (let match in player_match) {
//             let a = await axios.get(check_match_by_id + player_match[match].gameId)
//             final_obj = _.concat(final_obj, a.data);
//         }
//     }
//     return final_obj;
// }

app.post('/result', async (req, res) => {
    let {player1_name, player2_name} = req.body;
    
    // getting summoner ID

    const player1_getId =  await summoner_id(player1_name)
    const player2_getId =  await summoner_id(player2_name)
    let [player1_info, player2_info] = await Promise.all([player1_getId, player2_getId])

    // get match history
    let player1_match_api = await match_list(player1_info.accountId,[],0);
    let player2_match_api = await match_list(player2_info.accountId,[],0);
    let [player1_history, player2_history] = await Promise.all([player1_match_api, player2_match_api]);
    // console.log(player1_history, player2_history);

    res.json(_.size(player1_history) + 'and' + _.size(player2_history))

    // res.json(player1_match_history)
})

app.listen(PORT, () => {    
    console.log(`Server is running on port:${PORT}`)
});