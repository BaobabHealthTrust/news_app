var express = require('express');
var router = express.Router();
var model = require('../models/newsFeed');
var knex = require('../config/bookshelf').knex;
var fs = require('fs');
var fse = require('fs-extra')
var uploadPath = './uploads/';

News = model.News;
Tracker = model.Tracker;

/* GET home page. */

router.get('/news_feed', function (req, res, next) {
    var news = {};
    unformattedIpString = req.connection.remoteAddress.split(":")
    // ipAddress = unformattedIpString[unformattedIpString.length - 1];
    ipAddress = req.query.ip_address;

    knex('news').where({category: 'sports_news'}).limit(10).orderBy('news_id', 'desc').then(function (sports_news) {
        news["sports_news"] = sports_news;
        knex('news').where({category: 'local_news'}).limit(10).orderBy('news_id', 'desc').then(function (local_news) {
            news["local_news"] = local_news;
            var data = {};
            knex('tracker').where({ip_address: ipAddress}).andWhere('news_id', '>', 0).then(function (trackers) {
                var logs = {}
                for (var category in news) {
                    for (var row in news[category]) {
                        newsId = news[category][row]["news_id"];
                        title = news[category][row]["title"];
                        body = news[category][row]["body"];
                        if (news[category][row]["category"] === 'sports_news')
                            news_category = 'sports';
                        if (news[category][row]["category"] === 'local_news')
                            news_category = 'news';

                        newsPathUploads = uploadPath + newsId;

                        if (!fs.existsSync(newsPathUploads)) {
                            fs.mkdirSync(newsPathUploads);
                        }
                        
                        file_names = fs.readdirSync(newsPathUploads);
                        files = [];
                        for (var i=0; i<=file_names.length - 1; i++){
                            filePath = newsPathUploads + '/' + file_names[i];
                            files.push(base64_encode(filePath));
                        }
                        
                        date_created = news[category][row]["created_at"];
                        datetime = (new Date(date_created)).getTime() //To be pulled from the db
                        data[newsId] = {id: newsId, title: title, body: body, category: news_category, datetime: datetime, files: files};
                    }
                }

                for (var row in trackers) {
                    news_id = trackers[row].news_id;
                    logs[news_id] = true;
                }

                data["ip_address"] = ipAddress;
                data["logs"] = logs;
                //res.status(200).json(data)
                res.send(data);
            });

        });

    });

});

router.get('/log', function (req, res, next) {
    console.log("Request Received");
    console.log(req.query)
    newsId = req.query.news_id;
    news_category = req.query.category;
    ip_address = req.query.ip_address;
    new Tracker({
        news_id: newsId,
        category: news_category,
        ip_address: ip_address
    }).save().then(function (tracker) {
        console.log('Record Successfully Saved');
        feedback = {data: 'done'}
        res.send(feedback);
    });
});

String.prototype.capitalize = function () {
    return this.toLowerCase().replace(/\b\w/g, function (m) {
        return m.toUpperCase();
    });
};

function base64_encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
}

module.exports = router;
