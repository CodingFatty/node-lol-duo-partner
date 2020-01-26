require('./config.js');
const express = require('express');
const app = express();
const axios = require('axios');
const cors = require('cors');
const _ = require('lodash');
const mongoose = require('./db/connect');
const PORT = process.env.PORT || 8000;
const apiKey = process.env.RGKEY;
const { summoner_id } = require('./summoner_id');
const { match_list } = require('./match_list');
const { match_detail } = require('./match_detail');
const { summoner_stat } = require('./summoner_stat');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

axios.defaults.headers.common['X-Riot-Token'] = apiKey;
axios.defaults.headers.common['Accept-Charset'] = "application/x-www-form-urlencoded";

app.post('/result', async (req, res) => {
    try {
        let { player1_name, player2_name } = req.body;

        // getting summoner ID
        let [player1_info, player2_info] = await Promise.all([summoner_id(player1_name), summoner_id(player2_name)])

        // get match history
        // let [player1_history, player2_history] = 
        await Promise.all([match_list(player1_info.accountId), match_list(player2_info.accountId)])

        // fetch match detail
        // let match_detail_promise = [];
        // if (!_.isEmpty(player1_history)) {
        // let player1_matchId = player1_history.map(history => history.gameId)

        // match_detail_promise.push(match_detail(player1_info.name, player1_info.accountId, 20))

        // }
        // if (!_.isEmpty(player2_history)) {
        // let player2_matchId = player2_history.map(history => history.gameId)
        // match_detail_promise.push(match_detail(player2_info.name, player2_info.accountId, 20))
        // }

        await Promise.all([
            match_detail(player1_info.name, player1_info.accountId, 20),
            match_detail(player2_info.name, player2_info.accountId, 20)
        ])

        // // extract summoner stat
        let p1_result = await summoner_stat(player1_info.accountId)
        let p2_result = await summoner_stat(player2_info.accountId)

        res.status(200).json({
            'Player1': p1_result,
            'Player2': p2_result
        })
        // console.log(player1_info)
        // res.status(200).json(p1_result)
    } catch (e) {
        console.log(e)
        res.status(e.code).json({ message: e.message })
    }
})

app.listen(PORT, () => {
    console.log(`Server is running on port:${PORT}`)
});