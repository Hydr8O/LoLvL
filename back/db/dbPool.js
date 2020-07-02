const { Pool } = require('pg');
const dbConfig = require('../secrets/dbConfig');

const pool = new Pool(dbConfig);
module.exports = pool;
