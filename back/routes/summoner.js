const express = require('express')
const router = express.Router();
const summonerController = require('../controllers/summoner');

router.get('/summonerInfo/:summonerName', summonerController.getSummonerData);

router.get('/rankInfo/:summonerId', summonerController.getRankData);


router.get('/masteryInfo/:summonerId', summonerController.getMasteryData);

router.post('/summonerInfo/:summonerName', summonerController.insertSummonerData);

router.post('/gameStats/:summonerName', summonerController.insertGameStats);

router.get('/check/:summonerId', summonerController.isInDb);

module.exports = router;