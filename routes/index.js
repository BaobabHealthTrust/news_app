var express = require('express');
var router = express.Router();
var model = require('../models/newsFeed');
var knex = require('../config/bookshelf').knex;

var passport = require('passport');
var bcrypt = require('bcrypt-nodejs');

// vendor libraries

News = model.News;
Category = model.Category;
Tracker = model.Tracker;
User = model.User;

/* GET home page. */
router.get('/', function (req, res, next) {

  if(!req.isAuthenticated()) {
      res.redirect('/sign_in');
   } else {

      var user = req.user;

      if(user !== undefined) {
         user = user.toJSON();
      }
      res.render('index', {title: 'Home', user: user});
   }
    
});

/***********************************************************************************************/
// GET index
router.get('/index', function(req, res, next){
  var user = req.user;

      if(user !== undefined) {
         user = user.toJSON();

  knex('news').where({category: 'sports_news'}).then(function (sports) {
        sportsNews = sports;
        knex('news').where({category: 'local_news'}).then(function (local) {
            localNews = local;
            knex('news').where({category: 'sports_news'}).count("news_id as sports_count").then(function (sports_total) {
                sports_count = sports_total[0]["sports_count"];
                knex('news').where({category: 'local_news'}).count("news_id as local_count").then(function (local_total) {
                    local_count = local_total[0]["local_count"];
                    res.render('index', {sports_count: sports_count, local_count: local_count, sportsNews: sportsNews, localNews: localNews, user: user});
                });
            });
        })
    });}
 }); 

// sign in
// GET

router.get('/sign_in', function (req, res, next) {
    if(req.isAuthenticated()) res.redirect('/');
   res.render('sign_in', {title: 'Sign In'});
});

// sign in
// POST

router.post('/signin', function (req, res, next) {
    passport.authenticate('local', { successRedirect: '/',
                          failureRedirect: '/sign_in'}, function(err, user, info) {
      if(err) {
         return res.render('sign_in', {title: 'Sign In', errorMessage: err.message});
      } 

      if(!user) {
         return res.render('sign_in', {title: 'Sign In', errorMessage: info.message});
      }
      return req.logIn(user, function(err) {
         if(err) {
            return res.render('sign_in', {title: 'Sign In', errorMessage: err.message});
         } else {
            return res.redirect('/index');
         }
      });
   })(req, res, next);
});

// sign up
// GET

router.get('/add_user_menu', function (req, res, next) {
   var user = req.user;

      if(user !== undefined) {
         user = user.toJSON();

  knex('news').where({category: 'sports_news'}).then(function (sports) {
        sportsNews = sports;
        knex('news').where({category: 'local_news'}).then(function (local) {
            localNews = local;
            knex('news').where({category: 'sports_news'}).count("news_id as sports_count").then(function (sports_total) {
                sports_count = sports_total[0]["sports_count"];
                knex('news').where({category: 'local_news'}).count("news_id as local_count").then(function (local_total) {
                    local_count = local_total[0]["local_count"];
                    res.render('add_user_menu', {sports_count: sports_count, local_count: local_count, sportsNews: sportsNews, localNews: localNews, user: user, title: 'Add User'});
                });
            });
        })
    });}
});


// sign up
// POST
router.post('/add_user', function (req, res, next){
  var user = req.body;
   var usernamePromise = null;
   usernamePromise = new model.User({username: user.username}).fetch();

   return usernamePromise.then(function(model) {
      if(model) {
         res.render('add_user_menu', {title: 'Add User', errorMessage: 'username already exists'});
      } else {
         //****************************************************//
         // More Validation to be added
         //****************************************************//
         var password = user.password;
         var hash = bcrypt.hashSync(password);

         new User({
              fname: user.first_name,
              lname: user.last_name,
              username: user.username, 
              password: hash
            }).save().then(function(user) {
            // sign in the newly registered user
            return res.redirect('/view_user_menu');
         });  
      }
   }); (req, res, next);
});

// sign out
router.get('/sign_out', function (req, res, next){
  if(!req.isAuthenticated()) {
      notFound404(req, res, next);
   } else {
      req.logout();
      res.redirect('/sign_in');
   }
});

router.get('/view_user_menu', function (req, res, next) {
  var user = req.user;

      if(user !== undefined) {
         user = user.toJSON();

    knex('news').where({category: 'sports_news'}).count("news_id as sports_count").then(function (sports_total) {
        sports_count = sports_total[0]["sports_count"];
        knex('news').where({category: 'local_news'}).count("news_id as local_count").then(function (local_total) {
            local_count = local_total[0]["local_count"];
            knex('user').limit(10).then(function (user) {
                res.render('view_user_menu', {user: user, category: req.query.category, sports_count: sports_count, local_count: local_count, user: user});
            });
        });
    });}
});

router.get('/edit_this_user/', function (req, res, next) {
  var user = req.user;

      if(user !== undefined) {
         user = user.toJSON();
    
    knex('news').where({category: 'sports_news'}).count("news_id as sports_count").then(function (sports_total) {
        sports_count = sports_total[0]["sports_count"];
        knex('news').where({category: 'local_news'}).count("news_id as local_count").then(function (local_total) {
            local_count = local_total[0]["local_count"];
            knex('user').where({user_id: req.query.user_id}).limit(1).then(function (this_user) {
                res.render('edit_this_user', {this_user: this_user[0], sports_count: sports_count, local_count: local_count, user: user});
            });
        });
    });}
});

router.post('/save_edited_user', function (req, res, next) {
    user_id = req.body.user_id;
    fname = req.body.first_name;
    lname = req.body.last_name;
    username = req.body.username;

    new User({user_id: user_id}).save({fname: fname, lname: lname, username: username})
            .then(function (user) {
                res.redirect("/view_user_menu");
            });
});

router.get('/reset_password_view/', function (req, res, next) {
  var user = req.user;

      if(user !== undefined) {
         user = user.toJSON();
    
    knex('news').where({category: 'sports_news'}).count("news_id as sports_count").then(function (sports_total) {
        sports_count = sports_total[0]["sports_count"];
        knex('news').where({category: 'local_news'}).count("news_id as local_count").then(function (local_total) {
            local_count = local_total[0]["local_count"];
            knex('user').where({user_id: req.query.user_id}).limit(1).then(function (this_user) {
                res.render('reset_password_view', {this_user: this_user[0], sports_count: sports_count, local_count: local_count, title: 'Reset Password', user: user});
            });
        });
    });}
});

// reset_password
// POST
router.post('/reset_password', function (req, res, next){
      var user = req.body;
      var password = user.password;
      new User({user_id: user.user_id}).fetch().then(function(data) {
      var users = data;
       
        if(!bcrypt.compareSync(password, users.password)) {
         res.render('reset_password_view', {title: users.password, errorMessage: 'The current password doesnt match', this_user: users});
      } else {
         //****************************************************//
         // more Validation to be added
         //****************************************************//

         if(user.new_password !== user.confirm_password){
         res.render('reset_password_view', {title: 'Reset Password', errorMessage: 'Password mismatch. Make sure the New password and confirm password are the same!', this_user: users});
         } else{

         var hash = bcrypt.hashSync(user.new_password);
         user_id = req.body.user_id;

         new User({user_id: user_id}).save({password: hash})
            .then(function (user) {
            return res.redirect("/view_user_menu");
            });
         };  
      
};
   }); (req, res, next);
});


// 404 not found
router.get('/notFound404', function (req, res, next){
  res.status(404);
   res.render('404', {title: '404 Not Found'});
});

/***********************************************************************************************/

router.get('/add_news_menu', function (req, res, next) {
  var user = req.user;

      if(user !== undefined) {
         user = user.toJSON();
    newsCategory = (req.query.category.replace("_", ' ')).capitalize();
    knex('news').where({category: 'sports_news'}).count("news_id as sports_count").then(function (sports_total) {
        sports_count = sports_total[0]["sports_count"];
        knex('news').where({category: 'local_news'}).count("news_id as local_count").then(function (local_total) {
            local_count = local_total[0]["local_count"];
            console.log("Sports = " + sports_count + " Local = " + local_count)
            res.render('add_news_menu', {newsCategory: newsCategory, category: req.query.category, sports_count: sports_count, local_count: local_count, user: user});
        });
    });
  }
});

router.get('/add_category_menu', function (req, res, next) {
    newsCategory = (req.query.category.replace("_", ' ')).capitalize();
    res.render('add_category_menu', {newsCategory: newsCategory, category: req.query.category});
});

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

router.post('/retrieve_news', function (req, res, next) {
    news_id = req.body.news_id;
    knex('news').where({news_id: news_id}).then(function (news) {
        res.send(news[0]);
    });
})
router.post('/save_category', function (req, res, next) {

    name = req.body.name;
    description = req.body.description;
    date = new Date();

    new Category({
        name: name,
        description: description,
        date: date

    }).save()
            .then(function (category) {
                console.log('Record Successfully Saved');
                res.redirect("/add_category_menu?category=" + category);
            })
            .catch(function (err) {
                console.log(err.message);
            })
});

router.get('/edit_news_menu', function (req, res, next) {
  var user = req.user;

      if(user !== undefined) {
         user = user.toJSON();
    newsCategory = (req.query.category.replace("_", ' ')).capitalize();

    knex('news').where({category: 'sports_news'}).count("news_id as sports_count").then(function (sports_total) {
        sports_count = sports_total[0]["sports_count"];
        knex('news').where({category: 'local_news'}).count("news_id as local_count").then(function (local_total) {
            local_count = local_total[0]["local_count"];
            knex('news').where({category: req.query.category}).limit(10).then(function (news) {
                res.render('edit_news_menu', {newsCategory: newsCategory, category: req.query.category, news: news, sports_count: sports_count, local_count: local_count, user: user});
            });

        });
    });

  }

});

router.get('/edit_my_news/', function (req, res, next) {
  var user = req.user;

      if(user !== undefined) {
         user = user.toJSON();
    newsCategory = (req.query.category.replace("_", ' ')).capitalize();
    knex('news').where({category: 'sports_news'}).count("news_id as sports_count").then(function (sports_total) {
        sports_count = sports_total[0]["sports_count"];
        knex('news').where({category: 'local_news'}).count("news_id as local_count").then(function (local_total) {
            local_count = local_total[0]["local_count"];
            knex('news').where({news_id: req.query.news_id}).limit(1).then(function (my_news) {
                res.render('edit_my_news', {newsCategory: newsCategory, category: req.query.category, my_news: my_news[0], sports_count: sports_count, local_count: local_count, user: user});
            });
        });
    });}
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
  var user = req.user;

      if(user !== undefined) {
         user = user.toJSON();
    newsCategory = (req.query.category.replace("_", ' ')).capitalize();
    knex('news').where({category: 'sports_news'}).count("news_id as sports_count").then(function (sports_total) {
        sports_count = sports_total[0]["sports_count"];
        knex('news').where({category: 'local_news'}).count("news_id as local_count").then(function (local_total) {
            local_count = local_total[0]["local_count"];
            knex('news').where({category: req.query.category}).limit(10).then(function (news) {
                res.render('void_news_menu', {newsCategory: newsCategory, category: req.query.category, news: news, sports_count: sports_count, local_count: local_count, user: user});
            });
        });
    });}
});

router.post('/void_news', function (req, res, next) {
    news_ids = req.body.news_ids.split(",");
    knex('news').where('news_id', 'in', news_ids).del().then(function (news) {
        res.send('okay');
    });
});

router.get('/view_news_menu', function (req, res, next) {
  var user = req.user;

      if(user !== undefined) {
         user = user.toJSON();
    newsCategory = (req.query.category.replace("_", ' ')).capitalize();
    knex('news').where({category: 'sports_news'}).count("news_id as sports_count").then(function (sports_total) {
        sports_count = sports_total[0]["sports_count"];
        knex('news').where({category: 'local_news'}).count("news_id as local_count").then(function (local_total) {
            local_count = local_total[0]["local_count"];
            knex('news').where({category: req.query.category}).limit(10).then(function (news) {
                res.render('view_news_menu', {newsCategory: newsCategory, category: req.query.category, news: news, sports_count: sports_count, local_count: local_count, user: user});
            });
        });
    });}
});

router.get('/edit_category_menu', function (req, res, next) {
    newsCategory = (req.query.category.replace("_", ' ')).capitalize();
    knex('category').limit(10).then(function (category) {
        res.render('edit_category_menu', {newsCategory: newsCategory, category: req.query.category, category: category});
    });
});

router.get('/edit_my_category/', function (req, res, next) {

    newsCategory = (req.query.category.replace("_", ' ')).capitalize();
    knex('category').where({id: req.query.id}).limit(1).then(function (my_category) {
        res.render('edit_my_category', {newsCategory: newsCategory, category: req.query.category, my_category: my_category[0]});
    });
});

router.post('/save_edited_category', function (req, res, next) {
    id = req.body.id;
    name = req.body.name;
    description = req.body.description;

    new Category({id: id}).save({name: name, description: description})
            .then(function (category) {
                res.redirect("/edit_category_menu?category=" + category);
            });
});

router.get('/view_category_menu', function (req, res, next) {
    newsCategory = (req.query.category.replace("_", ' ')).capitalize();
    knex('category').then(function (category) {
        res.render('view_category_menu', {newsCategory: newsCategory, category: req.query.category, category: category});
    });
});

router.get('/void_category_menu', function (req, res, next) {
    newsCategory = (req.query.category.replace("_", ' ')).capitalize();
    knex('category').limit(10).then(function (category) {
        res.render('void_category_menu', {newsCategory: newsCategory, category: req.query.category, category: category});
    });
});

router.post('/void_category', function (req, res, next) {
    news_ids = req.body.news_ids.split(",");
    knex('category').where('id', 'in', news_ids).del().then(function (category) {
        res.send('okay');
    });
});


String.prototype.capitalize = function () {
    return this.toLowerCase().replace(/\b\w/g, function (m) {
        return m.toUpperCase();
    });
};

// export functions
/**************************************/

module.exports = router;