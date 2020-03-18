/////////////////////////////////////
//Request for newest version of API
const axios = require('axios');
const initEndpoints = require('../endpoints');
const updateVersionInterval = 86400; //24 hours 86400

const versionDemon = (app) => {
    setInterval(() => {
        axios.get("https://ddragon.leagueoflegends.com/api/versions.json")
            .then(({ data }) => {
                const newVersion = data[0];
                endpoints = initEndpoints(newVersion);
                app.locals.endpoints = endpoints;
                console.log(newVersion);
            })
            .catch(err => {
                console.log(err);
            });
    }, updateVersionInterval);
};

module.exports = versionDemon;

