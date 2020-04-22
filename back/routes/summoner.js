const express = require('express')
const router = express.Router();
const summonerController = require('../controllers/summoner/summonerData');
const questsController = require('../controllers/summoner/quests');
const dbController = require('../controllers/summoner/workWithDb');

router.get('/summonerInfo/:summonerName', summonerController.getSummonerData);

router.get('/rankInfo/:summonerId', summonerController.getRankData);

router.get('/masteryInfo/:summonerId', summonerController.getMasteryData);

router.post('/summonerInfo/:summonerName', dbController.insertSummonerData);

router.post('/gameStats/:summonerName', dbController.insertGameStats);

router.get('/check/:summonerId', dbController.isInDb);

router.get('/:summonerId/quests/:tier/:rank', questsController.loadQuests);

module.exports = router;