const express = require('express');
const app = express();
const axios = require('axios');
const async = require('async');
const _ = require('lodash');
const PORT = process.env.PORT || 8000;
const {apiKey} = require('./config.json');

app.use(express.json());

axios.defaults.headers.common['X-Riot-Token'] = apiKey;

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};

async function calling(player_data) {
    const check_match_by_id = 'https://na1.api.riotgames.com/lol/match/v4/matches/';
    let final_obj = [];

    for (let player in player_data) {
        let player_match = player_data[player].matches;
        for (let match in player_match) {
            let a = await axios.get(check_match_by_id + player_match[match].gameId)
            // console.log(a.data)
            final_obj = _.concat(final_obj, a.data);
        }
    }
    // console.log(final_obj)
    return final_obj;
}

app.post('/result', async (req, res) => {
    const check_summoner_history = 'https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/';
    const check_match_by_name = 'https://na1.api.riotgames.com/lol/match/v4/matchlists/by-account/';
    // const check_match_by_id = 'https://na1.api.riotgames.com/lol/match/v4/matches/';
    let queue_type = '?queue=420';
    let player1_name = req.body.player1_name;
    let player2_name = req.body.player2_name;
    try{
        let player1_result = await axios.get(check_summoner_history + player1_name);
        let player2_result = await axios.get(check_summoner_history + player2_name);
        let [p1_accId, p2_accId] = await Promise.all([player1_result, player2_result]);
        res.json(p1_accId.data);
    }catch(error){
        // res.send(error)
        next(error)
    }

    // async.waterfall([
    //     function(callback) {
    //         axios.get(check_summoner_history + player1_name).then((response) => {
    //             callback(null, response.data);
    //         });            
    //     },
    //     function(player1_data, callback) {
    //         axios.get(check_summoner_history + player2_name).then((response) => {
    //             callback(null, player1_data, response.data);
    //         });   
    //     },
    //     function(player1_data, player2_data, callback) {
    //         let player1_accountId = player1_data.accountId;

    //         axios.get(check_match_by_name + player1_accountId + queue_type+'&endIndex=2').then((response) => {
    //             callback(null, response.data, player2_data);
    //         })
    //     },
    //     function(player1_data, player2_data, callback) {
    //         let player2_accountId = player2_data.accountId;

    //         axios.get(check_match_by_name + player2_accountId + queue_type+'&endIndex=2').then((response) => {
    //             callback(null, {
    //                 player1_data,
    //                 player2_data: response.data
    //             })
    //         })
    //     },
    //     async function(player1_data, callback) {
    //         let match_info = {};
    //         // let final_obj = [];
    //         // let a;
    //         // for (let player in player1_data) {
    //         //     let player_match = player1_data[player].matches;
    //         //     let timeout_timer = 1;
    //         //     // let final_obj = {};
    //         //     let other;

    //         //     for (let match in player_match) {
    //         //         let a = async() => {return await axios.get(check_match_by_id + player_match[match].gameId)}
    //         //         // console.log(a.data);
    //         //         let b = await a()
    //         //         console.log(b.data)
    //         //         final_obj = _.concat(final_obj,b.data);
                    
    //         //     }
    //         //     // _.forEach(player_match, async (match) => {
    //         //     //     const eee = async() => {
    //         //     //         // await axios.get(check_match_by_id + match.gameId).then((response)=>{
    //         //     //         //     result = _.concat(result, response.data)
    //         //     //         // })
    //         //     //         return await axios.get(check_match_by_id + match.gameId);
    //         //     //         // console.log(result)
    //         //     //         // final_obj = _.concat(final_obj,result);
    //         //     //         // console.log(final_obj)
    //         //     //     }
    //         //     //     timeout(1000 * timeout_timer);
    //         //     //     const sss = await eee();
    //         //     //     other = _.merge(final_obj,sss.data);
    //         //     //     // console.log(other)
    //         //     //     // final_obj += sss;
    //         //     //     timeout_timer++;
    //         //     // });
    //         //     // match_info = _.concat(match_info, final_obj);
    //         // }
    //         // async () => {
    //             let result = await calling(player1_data);
    //             // console.log(result)
    //             return result;
    //         // }
            
    //         // console.log(a.data)
    //         // console.log(match_info)
    //         // await match_info;
    //         // console.log(final_obj)
    //         // callback(null, final_obj);
    //     }
    // ], function(err, result) {
    //     console.log(result)
    //     res.header("Access-Control-Allow-Origin", "*");
    //     res.send(result);
    // })
})

// app.get('/match', (req, res) => {
//     const url = 'https://na1.api.riotgames.com/lol/match/v4/matches/2948248611';
//     axios.get(url).then((response) => res.send(response.data))
// })
app.listen(PORT, () => {    
    console.log(`Server is running on port:${PORT}`)
});