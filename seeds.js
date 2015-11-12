var model = require('./models/newsFeed');
var knex = require('./config/bookshelf').knex;

var passport = require('passport');
var bcrypt = require('bcrypt-nodejs');

User = model.User;

		var password = 'test';
        var hash = bcrypt.hashSync(password);

        new User({
              fname: 'Administrator',
              lname: 'Administrator',
              username: 'admin', 
              password: hash
            }).save().then(function(){
            	console.log('Default user successfully set');
            	process.exit(code=0);
            });