const express = require('express');
const app = express();
const axios = require('axios');
const async = require('async');
const PORT = process.env.PORT || 8000;
const {apiKey} = require('./config.json');

app.use(express.json());

axios.defaults.headers.common['X-Riot-Token'] = apiKey;

app.post('/result', (req, res) => {
    const check_summoner_history = 'https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/';
    const check_match_by_name = 'https://na1.api.riotgames.com/lol/match/v4/matchlists/by-account/';
    const check_match_by_id = 'https://na1.api.riotgames.com/lol/match/v4/matches/';
    let queue_type = '?queue=420';
    let player1_name = req.body.player1_name;
    let player2_name = req.body.player2_name;

    async.waterfall([
        function(callback) {
            axios.get(check_summoner_history + player1_name).then((response) => {
                callback(null, response.data)
            });            
        },
        function(player1_data, callback) {
            axios.get(check_summoner_history + player2_name).then((response) => {
                callback(null, player1_data, response.data)
            });   
        },
        function(player1_data, player2_data, callback) {
            let player1_accountId = player1_data.accountId;

            axios.get(check_match_by_name + player1_accountId + queue_type).then((response) => {
                callback(null, response.data, player2_data);
            })
        },
        function(player1_data, player2_data, callback) {
            let player2_accountId = player2_data.accountId;

            axios.get(check_match_by_name + player2_accountId + queue_type).then((response) => {
                callback(null, {
                    player1_data,
                    player2_data: response.data
                })
            })
        }
    ], function(err, result) {
        res.header("Access-Control-Allow-Origin", "*");
        res.send(result);
    })
})

// app.get('/match', (req, res) => {
//     const url = 'https://na1.api.riotgames.com/lol/match/v4/matches/2948248611';
//     axios.get(url).then((response) => res.send(response.data))
// })
app.listen(PORT, () => {    
    console.log(`Server is running on port:${PORT}`)
});