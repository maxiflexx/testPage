const parseString = require('xml2js').parseString;
const axios = require('axios');
const feedURL = require('../config/feedURL');

const feed = {
    getNews(req, res, next) {
        return new Promise((resolve, reject) => {
            axios.get(feedURL.news)
                .then((res) => {
                    resolve(res.data);
                }).catch((err) => {
                    reject(err);
                });
        }).then((result) => {
            parseString(result, (err, obj) => {
                let items = obj.rss.channel[0].item;
                res.status(200).json(items);
            })
        }).catch((err) => {
            err.message = 'Something Broke!';
            err.status = 500;
            next(err);
        });
    },
    getAnalysis(req, res) {
        return new Promise((resolve, reject) => {
            axios.get(feedURL.analysis)
                .then((res) => {
                    resolve(res.data);
                }).catch((err) => {
                    reject(err);
                });
        }).then((result) => {
            parseString(result, (err, obj) => {
                let items = obj.rss.channel[0].item;
                res.status(200).json(items);
            })
        }).catch((err) => {
            console.log(err);
        });
    }
};

module.exports = feed;