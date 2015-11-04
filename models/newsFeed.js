var bookshelf = require('../config/bookshelf').bookshelf;

var News = bookshelf.Model.extend({
    tableName: 'news',
    idAttribute: 'news_id'
});

var Tracker = bookshelf.Model.extend({
    tableName: 'tracker',
    idAttribute: 'tracker_id'
});

var Category = bookshelf.Model.extend({
    tableName: 'category',
    idAttribute: 'id'
});

models = {News: News, Tracker: Tracker, Category: Category};

module.exports = models;
