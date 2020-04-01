/////////////////////////////////////
//Request for newest version of API
const axios = require('axios');
const initEndpoints = require('../endpoints');
const updateVersionInterval = 86400000; //24 hours 86400000
/////////////////////////////////////
//Gets newest version and adds it to local starage app.locals.endpoints
const getNewVersion = (app) => {
    const promise = new Promise((resolve, reject) => {
        axios.get("https://ddragon.leagueoflegends.com/api/versions.json")
        .then(({ data }) => {
            const newVersion = data[0];
            app.locals.endpoints = initEndpoints(newVersion);
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
        .then((newVersion) => {
            console.log(`The newest version is ${newVersion}`);
            const interval = setInterval(() => {
                getNewVersion(app)
                .then(newVersion => {
                    console.log(`Version was updated to ${newVersion}`);
                });
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

