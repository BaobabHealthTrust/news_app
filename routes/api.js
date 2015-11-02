var express = require('express');
var router = express.Router();
var model = require('../models/newsFeed');
var knex = require('../config/bookshelf').knex;

News = model.News;
Tracker = model.Tracker;

/* GET home page. */

router.get('/news_feed', function (req, res, next) {
    var news = {};
    unformattedIpString = req.connection.remoteAddress.split(":")
    ipAddress = unformattedIpString[unformattedIpString.length - 1];

    knex('news').where({category: 'sports_news'}).limit(10).then(function (sports_news) {
        news["sports_news"] = sports_news;
        knex('news').where({category: 'local_news'}).limit(10).then(function (local_news) {
            news["local_news"] = local_news;
            var count = 1;
            var data = {};

            for (var category in news) {
                for (var row in news[category]) {
                    newsId = news[category][row]["news_id"];
                    title = news[category][row]["title"];
                    body = news[category][row]["body"];
                    if (news[category][row]["category"] === 'sports_news') news_category = 'sports';
                    if (news[category][row]["category"] === 'local_news') news_category = 'news';

                    datetime = "1443657600000" //To be pulled from the db
                    data[count] = {id: newsId, title: title, body: body, category: news_category};
                    count = count + 1;
                }
            }

            data["ip_address"] = ipAddress;

            res.send(data);
        });

    });

});

String.prototype.capitalize = function () {
    return this.toLowerCase().replace(/\b\w/g, function (m) {
        return m.toUpperCase();
    });
};


module.exports = router;