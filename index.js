const express = require('express');
const app = express();
const axios = require('axios');
const async = require('async');
const {apiKey} = require('./config.json');

app.use(express.json());

axios.defaults.headers.common['X-Riot-Token'] = apiKey;

app.post('/result', (req, res) => {
    const url = 'https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/';
    const check_match = 'https://na1.api.riotgames.com/lol/match/v4/matchlists/by-account/';
    let player1_name = req.body.player1_name;
    let player2_name = req.body.player2_name;

    async.waterfall([
        function(callback) {
            axios.get(url+player1_name).then((response) => {
                callback(null, response.data)
            });            
        },
        function(player1_data, callback) {
            axios.get(url+player2_name).then((response) => {
                callback(null, player1_data, response.data)
            });   
        },
        function(player1_data, player2_data, callback) {
            let player1_accountId = player1_data.accountId;

            axios.get(check_match + player1_accountId).then((response) => {
                callback(null, response.data, player2_data);
            })
        },
        function(player1_data, player2_data, callback) {
            let player2_accountId = player2_data.accountId;

            axios.get(check_match + player2_accountId).then((response) => {
                callback(null, {
                    result: {
                        player1_data,
                        player2_data: response.data
                    }
                })
            })
        }
    ], function(err, result) {
        res.header("Access-Control-Allow-Origin", "*");
        res.send(result);
    })
})

app.listen(8000, () => {    
    console.log('Server is running')
});