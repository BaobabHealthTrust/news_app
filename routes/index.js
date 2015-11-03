var express = require('express');
var router = express.Router();
var model = require('../models/newsFeed');
var knex = require('../config/bookshelf').knex;

News = model.News;
Tracker = model.Tracker;

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.get('/sign_in', function (req, res, next) {
    res.render('sign_in');
});

router.get('/add_news_menu', function (req, res, next) {
    newsCategory = (req.query.category.replace("_", ' ')).capitalize();
    knex('news').where({category: 'sports_news'}).count("news_id as sports_count").then(function (sports_total) {
        sports_count = sports_total[0]["sports_count"];
        knex('news').where({category: 'local_news'}).count("news_id as local_count").then(function (local_total) {
            local_count = local_total[0]["local_count"];
            console.log("Sports = " + sports_count + " Local = " + local_count)
            res.render('add_news_menu', {newsCategory: newsCategory, category: req.query.category, sports_count: sports_count, local_count: local_count});
        });
    });

});

/*
 router.post('/save_news', function (req, res, next) {
 
 
 
 });
 */


router.post('/save_news', function (req, res, next) {
    console.log(req.body)
    title = req.body.title;
    body = req.body.body;
    category = req.body.category;
    date = new Date();
    console.log("title = " + title + "\n body = " + body)
    new News({
        title: title,
        body: body,
        category: category,
        date: date
    }).save().then(function (news) {
        console.log('Record Successfully Saved');
        res.redirect("/add_news_menu?category=" + category);
    })
});

/*
 router.get('/edit_news_menu', function(req, res, next){
 
 new News({news_id: '1'})
 .fetch()
 .then(function(news) {
 res.render('edit_news_menu', {
 users : [news.get('title'), news.get('body')] });
 // console.log(news.get('title'), news.get('body'));
 
 });
 });
 
 */

router.get('/add_category', function (req, res, next) {
    res.render('add_category', {title: 'Express'});
});

router.post('/save_category', function (req, res, next) {
    console.log(req.body)
    category_name = req.body.category_name;
    description = req.body.description;
    day = new Date();
    console.log("category_name = " + category_name + "\n description = " + description)
    new Category({
        category_name: category_name,
        description: description,
        date: date
    }).save().then(function (category) {
        console.log('Record Successfully Saved');
        res.redirect("/add_category?category=" + category);
    })
});

router.get('/edit_news_menu', function (req, res, next) {
    newsCategory = (req.query.category.replace("_", ' ')).capitalize();

    knex('news').where({category: 'sports_news'}).count("news_id as sports_count").then(function (sports_total) {
        sports_count = sports_total[0]["sports_count"];
        knex('news').where({category: 'local_news'}).count("news_id as local_count").then(function (local_total) {
            local_count = local_total[0]["local_count"];
            knex('news').where({category: req.query.category}).limit(10).then(function (news) {
                res.render('edit_news_menu', {newsCategory: newsCategory, category: req.query.category, news: news, sports_count: sports_count, local_count: local_count});
            });
            //res.render('add_news_menu', {newsCategory: newsCategory, category: req.query.category, sports_count: sports_count, local_count: local_count});
        });
    });



});

router.get('/edit_my_news/', function (req, res, next) {

    newsCategory = (req.query.category.replace("_", ' ')).capitalize();
    knex('news').where({news_id: req.query.news_id}).limit(1).then(function (my_news) {
        res.render('edit_my_news', {newsCategory: newsCategory, category: req.query.category, my_news: my_news[0]});
    });
});

router.post('/save_edited_news', function (req, res, next) {
    news_id = req.body.news_id;
    title = req.body.title;
    body = req.body.body;
    category = req.body.category;

    new News({news_id: news_id}).save({title: title, body: body})
            .then(function (news) {
                res.redirect("/edit_news_menu?category=" + category);
            });
});

router.get('/void_news_menu', function (req, res, next) {
    newsCategory = (req.query.category.replace("_", ' ')).capitalize();
    knex('news').where({category: req.query.category}).limit(10).then(function (news) {
        res.render('void_news_menu', {newsCategory: newsCategory, category: req.query.category, news: news});
    });
});

router.post('/void_news', function (req, res, next) {
    news_ids = req.body.news_ids.split(",");
    knex('news').where('news_id', 'in', news_ids).del().then(function (news) {
        res.send('okay');
    });
});

router.get('/view_news_menu', function (req, res, next) {
    newsCategory = (req.query.category.replace("_", ' ')).capitalize();
    knex('news').where({category: req.query.category}).limit(10).then(function (news) {
        res.render('view_news_menu', {newsCategory: newsCategory, category: req.query.category, news: news});
    });
});

String.prototype.capitalize = function () {
    return this.toLowerCase().replace(/\b\w/g, function (m) {
        return m.toUpperCase();
    });
};


module.exports = router;
