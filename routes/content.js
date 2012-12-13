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
	general.beforeEachContent(req);
	general.getEntry(req.params.id, req, function(entry) {
	  callback(null, entry.main_menu);
	});
      }
    ], function(err, menu_id) {
      // console.log(JSON.stringify(req.session));
      app.async.parallel({
	ag: function(callback) {
	  general.agTasks(req, menu_id, function(err, ag) {
	    if(err) throw err;
	    callback(null, ag);
	  });
	},
	entry: function(callback) {
	  app.models.entry
	    .findOne({_id:req.params.id}, function(err, entry) {
	      callback(null, entry);
	    });
	},
      }, function(err, results) {
	res.render('content', {
	  admin_page: false
	  , text: results.entry.en.toString()
	  , entry: results.entry
	  , entry_menus: results.ag.entry_menus
	  , title: results.entry.title
	  , breadcrumbs: results.ag.bc
	  , flash: req.flash()
	  , tweets: results.ag.tweets
	  , news_images: results.ag.news_images
	  , member: req.session.member
	});
      });
    });
  });
}

