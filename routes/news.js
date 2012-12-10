var md = require('node-markdown').Markdown;
var general = require('./general');

module.exports = function() {
  app.get('/news', function(req, res) {
    var page = req.body.page ? 1 : req.body.page;
    app.async.waterfall([
      function(callback) {
	general.beforeEach(req);
	callback(null);
      },
      function(callback) {
	general.getBreadcrumbs(req, function(bc) {
	  callback(null, bc);
	});
      },
      function(bc, callback) {
	general.getTweets(function(tweets) {
	  callback(null, bc, tweets);
	});
      },
      // get news items according to page
      function(bc, tweets, callback) {
	app.models.news
	  .find({}, null, {sort: {_id: -1},
			   skip: (page * 10),
			   limit: 10},
		function(err, news_items) {
		  app.async.map(news_items, function(item, callback) {
		    var ni = {
		      date: app.strftime(general.strftime, item.created_at)
		      , subject: item.subject
		      , body: item[req.session.lang]
		    }
		    callback(null, ni);
		  }, function(err, news_items) {
		    callback(null, bc, tweets, news_items);
		  });
		});
      },
      function(bc, tweets, news_items, callback) {
	general.getHomeId(function(menu_id) {
	  general.getEntryMenus(menu_id, function(entry_menus) {
	    callback(null, bc, tweets, news_items, entry_menus);
	  });
	});
      }], function(err, bc, tweets, news_items, entry_menus) {
	res.render('news', {
	  admin_page: false
	  , news_items: news_items
	  , title: "Lutreola News"
	  , breadcrumbs: bc
	  , flash: req.flash()
	  , tweets: tweets
	  , entry_menus: entry_menus
	  , member: req.session.member
	});
      });
  });
}
