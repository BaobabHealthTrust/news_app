var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/sign_in', function (req, res, next) {
    res.render('sign_in');
});

router.get('/add_news_menu', function (req, res, next) {
    res.render('add_news_menu');
});

router.post('/save_news', function (req, res, next) {
    /* SAVE DATA HERE */
});

router.get('/edit_news_menu', function (req, res, next) {
    res.render('edit_news_menu');
});

router.post('/save_edited_news', function (req, res, next) {
    /* SAVE EDITED DATA HERE */
});

router.get('/void_news_menu', function (req, res, next) {
    res.render('void_news_menu');
});

router.post('/void_news', function (req, res, next) {
    /* SAVE EDITED DATA HERE */
});

router.get('/view_news_menu', function (req, res, next) {
    res.render('view_news_menu');
});

module.exports = router;
