const pg = require('pg');
const {DB_URL,DB_NAME} =require('./config'); 

const client = new pg.Client(DB_URL + DB_NAME);

module.exports = client;