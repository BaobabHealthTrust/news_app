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

var User = bookshelf.Model.extend({
   tableName: 'user',
   idAttribute: 'user_id',
});

models = {News: News, Tracker: Tracker, Category: Category, User: User};

module.exports = models;
