/**
 * @description : Script to make requests to a server
*/

const http = require('http');
const https = require('https');
const url = require('url');
const Promise = require('bluebird');

function Request() {};

/**
 * @description : makes a request to protocol http
 * @param {Object} options : passes an object to http.request
 * @returns {Promise.<string, Error>} : resolves http request, or rejects an error
*/
Request.http = function(options) {
    return new Promise((resolve, reject) => {
            let data = "";
            let req = http.request(options, res => {
                res.setEncoding('utf8');

                res.on('data', chunk => {
                    data += chunk;
                });
                res.on('end', () => {
                    resolve(data);
                });
            });
            req.on('error', err => {
                reject(err.message);
            });
            req.end();
        })
}
/**
 * @description : makes a request to protocol https
 * @param {object} options : passes an object to https.request
 * @returns {Promise.<string, Error>} : resolves http request, or rejects an error
*/
Request.https = function(options) {
    return new Promise((resolve, reject) => {
            let data = "";
            let req = https.request(options, res => {
                res.setEncoding('utf8');

                res.on('data', chunk => {
                    data += chunk;
                });

                res.on('end', () => {
                    resolve(data);
                });
            });
            req.on('error', err => {
                reject(err.message);
            });

            req.end();
        })
}

/**
 * @description : gets a url as an argument and makes a POST request
 * @param {String} link : enter an URL
 * @param {Object} params: post request
 * @returns {Promise.<string, Error>} : resolves http request, or rejects an error
*/

Request.post = function(link, params) {
    return new Promise((resolve, reject) => {
            let options = url.parse(link);
            options.method = "POST";

            switch(options.protocol) {
                case 'http:':
                    this.http(options)
                        .then(resolve)
                        .catch(reject);
                    break;
                case 'https:':
                    this.https(options)
                        .then(resolve)
                        .catch(reject);
                    break;
                default:
                    reject(`${options.protocol} is not a valid protocol`);
                    break;
            }

        });
}
/**
 * @description : gets a url as an argument and returns a GET request
 * @param {String} link : enter an URL
 * @param {Object} headers : defaults to null, headers to send
 * @returns {Promise.<string, Error>} : resolves http request, or rejects an error
*/
Request.get = function(link, headers=null) {
    return new Promise((resolve, reject) => {
            // parse the link into a readable format for our other functions
            let options = url.parse(link);
            if(headers !== null) {
                options.headers = headers;
            }
            // check for our protocol
            switch(options.protocol) {
                case 'http:':
                    this.http(options)
                        .then(resolve)
                        .catch(reject);
                    break;
                case 'https:':
                    this.https(options)
                        .then(resolve)
                        .catch(reject);
                    break;
                default:
                    reject("Not a valid protocol");
                    break;
            }
        });
}

module.exports = Request;
