const _ = require('lodash');
const { Summoner } = require('./models/player');

function summoner_stat(summonerId) {
    return new Promise((resolve, reject) => {
        Summoner.findOne({ summonerId }, async (err, summoner) => {
            // let result = [];
            // if (_.isEmpty(summoner.championId)) {
            summoner.championWinRate = {};
            summoner.overallWinRate = {
                solo: {
                    totalWin: 0,
                    totalLose: 0
                },
                duo: {
                    totalWin: 0,
                    totalLose: 0
                }
            };

            let matchList = _.filter(summoner.matches, obj => !_.isEmpty(obj.match));
            // _.forEach(matchList, obj => {
            for (let i = 0; i < _.size(matchList); i++) {
                if (!_.has(summoner.championWinRate, matchList[i].match.championId)) {
                    let champObj = {
                        kills: matchList[i].match.stats.kills,
                        assists: matchList[i].match.stats.assists,
                        deaths: matchList[i].match.stats.deaths,
                        totalGame: 1
                    };
                    matchList[i].match.stats.win
                        ? ((champObj.win = 1), (champObj.lose = 0))
                        : ((champObj.win = 0), (champObj.lose = 1));
                    summoner.championWinRate[matchList[i].match.championId] = champObj;
                } else {
                    summoner.championWinRate[matchList[i].match.championId].kills += matchList[i].match.stats.kills;
                    summoner.championWinRate[matchList[i].match.championId].assists += matchList[i].match.stats.assists;
                    summoner.championWinRate[matchList[i].match.championId].deaths += matchList[i].match.stats.deaths;
                    summoner.championWinRate[matchList[i].match.championId].totalGame += 1;
                    matchList[i].match.stats.win
                        ? summoner.championWinRate[matchList[i].match.championId].win++
                        : summoner.championWinRate[matchList[i].match.championId].lose++;
                }

                let role = "";
                let victory = "";
                let total = "";
                matchList[i].role === "SOLO" ? (role = "solo") : (role = "duo");
                matchList[i].match.stats.win === true
                    ? ((victory = "win"), (total = "totalWin"))
                    : ((victory = "lose"), (total = "totalLose"));

                summoner.overallWinRate[role][matchList[i].lane]
                    ? summoner.overallWinRate[role][matchList[i].lane][victory]
                        ? (summoner.overallWinRate[role][matchList[i].lane][victory]++ ,
                            summoner.overallWinRate[role][total]++)
                        : ((summoner.overallWinRate[role][matchList[i].lane][victory] = 1),
                            summoner.overallWinRate[role][total]++)
                    : (summoner.overallWinRate[role][matchList[i].lane] = {});
            }
            // }

            // for (let i = 0; i < _.size(matchList); i++) {
            // if (_.findKey(summoner.matches[i], 'detail')) {
            //     result.push(summoner.matches[i].detail)
            // } else {
            //     // let role = summoner.matches[i].match.timeline.role
            //     // let lane = summoner.matches[i].match.timeline.lane
            //     // let championId = summoner.matches[i].match.championId
            //     // let victory = summoner.matches[i].match.stats.win
            //     // let csScore = summoner.matches[i].match.stats.totalMinionsKilled
            //     // summoner.matches[i].detail = {
            //     //     role,
            //     //     lane,
            //     //     championId,
            //     //     victory,
            //     //     csScore,
            //     //     kills: summoner.matches[i].match.stats.kills,
            //     //     assists: summoner.matches[i].match.stats.assists,
            //     //     deaths: summoner.matches[i].match.stats.deaths
            //     // }
            //     result.push(summoner.matches[i].detail)
            // }
            // }
            // console.log(summoner.overallWinRate)
            
            await summoner.save();
            resolve({
                "championWinRate": summoner.championWinRate,
                "OverallWinRate": summoner.overallWinRate
            })
        })
    })
}

module.exports = { summoner_stat }