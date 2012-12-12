var md = require('node-markdown').Markdown;
var general = require('./general');

module.exports = function() {
  app.get('/content/home', function(req, res) {
    res.redirect('/');
  });

  app.get('/content/:id', function(req, res) {
    if(app.requireAuth === true && req.loggedIn === false)
      res.redirect('/auth/twitter');

    app.async.waterfall([
      function(callback) {
	general.beforeEach(req);
	general.getNewsImages(function(news_images) {
	  callback(null, news_images);
	});	
      },
      function(news_images, callback) {
	general.beforeEachContent(req);
	general.getTweets(function(tweets) {
	  callback(null, news_images, tweets);
	});
      },
      function(news_images, tweets, callback) {
	general.getEntry(req.params.id, req, function(entry) {
	  callback(null, news_images, tweets, entry.main_menu);
	});
      }
    ], function(err, news_images, tweets, menu_id) {
      // console.log(JSON.stringify(req.session));
      app.async.parallel({
	entry_menus: function(callback) {
	  general.getEntryMenus(menu_id, function(entry_menus) {
	    callback(null, entry_menus);
	  });
	},
	entry: function(callback) {
	  app.models.entry
	    .findOne({_id:req.params.id}, function(err, entry) {
	      callback(null, entry);
	    });
	},
	breadcrumbs: function(callback) {
	  general.getBreadcrumbs(req, function(bc) {
	    callback(null, bc);
	  });
	}
      }, function(err, results) {
	res.render('content', {
	  admin_page: false
	  , text: results.entry.en.toString()
	  , entry: results.entry
	  , entry_menus: results.entry_menus
	  , title: results.entry.title
	  , breadcrumbs: results.breadcrumbs
	  , flash: req.flash()
	  , tweets: tweets
	  , news_images: news_images
	  , member: req.session.member
	});
      });
    });
  });
}

