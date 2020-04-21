const axios = require('axios');


exports.getSummonerData = (req, res) => {
    const summonerName = req.params.summonerName;
    console.log(encodeURI(req.app.locals.endpoints.summonerPoint.replace('summonerName', summonerName)));
    axios.get(encodeURI(req.app.locals.endpoints.summonerPoint.replace('summonerName', summonerName)))
        .then(({ data }) => {
            res.json(data);
        })
        .catch(err => {
            console.log(`${err}`);
        });
};

exports.getRankData = (req, res) => {
    const summonerId = req.params.summonerId;
    axios.get(req.app.locals.endpoints.rankPoint.replace('summonerId', summonerId))
        .then(({ data }) => {
            res.json(data);
        }).catch(err => {
            console.log(err.response.status);
        });
};

exports.getMasteryData = (req, res) => {
    const summonerId = req.params.summonerId;
    axios.get(req.app.locals.endpoints.championMasteryPoint.replace('summonerId', summonerId))
        .then(({ data }) => {
            res.json(data);
        }).catch(err => {
            console.log(err.response.status);
        });
};