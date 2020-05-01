const axios = require('axios');


exports.getSummonerData = (req, res) => {
    const summonerName = req.params.summonerName;
    const server = req.query.server;
    console.log(server);

    console.log(encodeURI(req.app.locals.endpoints.summonerPoint.replace('summonerName', summonerName).replace('server', server)));
    axios.get(encodeURI(req.app.locals.endpoints.summonerPoint.replace('summonerName', summonerName).replace('server', server)))
        .then(({ data }) => {
            res.json(data);
        })
        .catch(err => {
            console.log(`${err}`);
        });
};

exports.getRankData = (req, res) => {
    const summonerId = req.params.summonerId;
    const server = req.query.server;
    axios.get(req.app.locals.endpoints.rankPoint.replace('summonerId', summonerId).replace('server', server))
        .then(({ data }) => {
            res.json(data);
        }).catch(err => {
            console.log(err.response.status);
        });
};

exports.getMasteryData = (req, res) => {
    const summonerId = req.params.summonerId;
    const server = req.query.server;
    axios.get(req.app.locals.endpoints.championMasteryPoint.replace('summonerId', summonerId).replace('server', server))
        .then(({ data }) => {
            res.json(data);
        }).catch(err => {
            console.log(err.response.status);
        });
};