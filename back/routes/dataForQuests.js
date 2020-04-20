const express = require('express');
const router = express.Router();
const getDataForQuests = require('../controllers/dataForQuests');

router.get('/dataForQuests', getDataForQuests);

module.exports = router;