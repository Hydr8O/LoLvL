/////////////////////////////////////
//Request for newest version of API
const axios = require('axios');
const initEndpoints = require('../endpoints');
const updateVersionInterval = 86400000; //24 hours 86400000

const getNewVersion = (app) => {
    const promise = new Promise((resolve, reject) => {
        axios.get("https://ddragon.leagueoflegends.com/api/versions.json")
        .then(({ data }) => {
            const newVersion = data[0];
            endpoints = initEndpoints(newVersion);
            app.locals.endpoints = { ...endpoints };
            resolve(newVersion);
        })
        .catch(err => {
            reject(err);
        });
    })
    return promise;
};

const versionDemon = (app) => {
    const promise = new Promise((resolve, reject) => {
        getNewVersion(app)
        .then(() => {
            const interval = setInterval(() => {
                getNewVersion(app);
            }, updateVersionInterval);
            resolve(interval);
        })
        .catch(err => {
            reject(err);
        });
    });

    return promise;
};

module.exports = versionDemon;

