const express = require('express');
const app = express();
const axios = require('axios');
const cors = require('cors');
const _ = require('lodash');
const mongoose = require('./db/connect');
const PORT = process.env.PORT || 8000;
// const { apiKey } = require('./config.json');
const apiKey = process.env.RGKEY;
const { summoner_id } = require('./summoner_id');
const { match_list } = require('./match_list');
const { match_detail } = require('./match_detail');
const { summoner_stat } = require('./summoner_stat');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

if (!apiKey) {
    apiKey = require('./config.json');
}

axios.defaults.headers.common['X-Riot-Token'] = apiKey;
axios.defaults.headers.common['Accept-Charset'] = "application/x-www-form-urlencoded";

app.post('/result', async (req, res) => {
    try {
        let { player1_name, player2_name } = req.body;

        // getting summoner ID
        const player1_info = await summoner_id(player1_name)
        const player2_info = await summoner_id(player2_name)
        await Promise.all([player1_info, player2_info])

        // get match history
        let player1_history = await match_list(player1_info.accountId);
        let player2_history = await match_list(player2_info.accountId);
        await Promise.all([player1_history, player2_history])

        // fetch match detail
        let player1_matchId = player1_history.map(history => history.gameId)
        let player2_matchId = player2_history.map(history => history.gameId)
        await Promise.all([
            match_detail(player1_matchId, player1_info.name, player1_info.accountId, 20),
            match_detail(player2_matchId, player2_info.name, player2_info.accountId, 20)])


        // extract summoner stat
        let p1_result = await summoner_stat(player1_info.accountId)
        let p2_result = await summoner_stat(player2_info.accountId)

        res.status(200).json({
            'Player1': p1_result,
            'Player2': p2_result
        })
    } catch (e) {
        res.status(400).send(e)
    }
})

app.listen(PORT, () => {
    console.log(`Server is running on port:${PORT}`)
});