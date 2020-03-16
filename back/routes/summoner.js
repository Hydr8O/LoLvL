const express = require('express')
const router = express.Router();
const axios = require('axios');

router.get('/summoner/summonerInfo/:summonerName', (req, res) => {
    const summonerName = req.params.summonerName;
    axios.get(endpoints.summonerPoint.replace('summonerName', summonerName))
        .then(({ data }) => {
            res.json(data);
        });
});

router.get('/summoner/rankInfo/:summonerId', (req, res) => {
    const summonerId = req.params.summonerId;
    axios.get(endpoints.rankPoint.replace('summonerId', summonerId))
        .then(({ data }) => {
            res.json(data);
        });
});

router.get('/summoner/masteryInfo/:summonerId', (req, res) => {
    const summonerId = req.params.summonerId;
    axios.get(endpoints.championMasteryPoint.replace('summonerId', summonerId))
        .then(({ data }) => {
            res.json(data);
        });
});

module.exports = router;