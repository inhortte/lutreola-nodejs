var md = require('node-markdown').Markdown;
var general = require('./general');
var truncate_length = 200;

module.exports = function() {
  app.get('/news', function(req, res) {
    var page = req.body.page ? 1 : req.body.page;
    app.async.parallel({
      be: function(callback) {
	general.beforeEach(req);
	callback(null);
      },
      bc: function(callback) {
	general.getBreadcrumbs(req, function(bc) {
	  callback(null, bc);
	});
      },
      tweets: function(callback) {
	general.getTweets(function(tweets) {
	  callback(null, tweets);
	});
      },
      // get news items according to page
      news_items: function(callback) {
	app.models.news
	  .find({}, null, {sort: {_id: -1},
			   skip: (page * 10),
			   limit: 10},
		function(err, news_items) {
		  app.async.map(news_items, function(item, callback) {
		    var ni = {
		      id: item._id
		      , date: app.strftime(general.strftime, item.created_at)
		      , subject: item.subject
		      , body: general.truncate(item[req.session.lang].toString(), truncate_length)
		    };
		    callback(null, ni);
		  }, function(err, news_items) {
		    callback(null, news_items);
		  });
		});
      },
      pages: function(callback) {
	app.models.news.count({}, function(err, c) {
	  var ps = Math.floor(c / 10);
	  var c_arr = [];
	  for(i = 0;i <= ps;i++) {
	    c_arr.push(i + 1);
	  }
	  callback(null, c_arr);
	});
      },
      entry_menus: function(callback) {
	general.getHomeId(function(menu_id) {
	  general.getEntryMenus(menu_id, function(entry_menus) {
	    callback(null, entry_menus);
	  });
	});
      }
    }, function(err, results) {
      res.render('news', {
	admin_page: false
	, news_items: results.news_items
	, page: req.body.page ? req.body.page : 1
	, pages: results.pages
	, title: "Lutreola News"
	, breadcrumbs: results.bc
	, flash: req.flash()
	, tweets: results.tweets
	, entry_menus: results.entry_menus
	, member: req.session.member
      });
    });
  });

  app.get('/news/:id', function(req, res) {
    app.async.parallel({
      be: function(callback) {
	general.beforeEach(req);
	callback(null);
      },
      bc: function(callback) {
	general.getBreadcrumbs(req, function(bc) {
	  callback(null, bc);
	});
      },
      tweets: function(callback) {
	general.getTweets(function(tweets) {
	  callback(null, tweets);
	});
      },
      // get news item
      item: function(callback) {
	app.models.news
	  .findOne({_id:req.params.id}, function(err, item) {
	    if(err) {
	      console.log(err);
	      res.redirect('/news');
	    }
	    if(item == null) {
	      flash('error', 'That news item does not exist. Try again!');
	      res.redirect('/news');
	    }
	    var ni = {
	      id: item._id
	      , date: app.strftime(general.strftime, item.created_at)
	      , subject: item.subject
	      , body: item[req.session.lang].toString()
	    };
	    callback(null, ni);
	  });
      },
      entry_menus: function(callback) {
	general.getHomeId(function(menu_id) {
	  general.getEntryMenus(menu_id, function(entry_menus) {
	    callback(null, entry_menus);
	  });
	});
      }
    }, function(err, results) {
      res.render('news_item', {
	admin_page: false
	, item: results.item
	, title: ''
	, breadcrumbs: results.bc
	, flash: req.flash()
	, tweets: results.tweets
	, entry_menus: results.entry_menus
	, member: req.session.member
      });
    });
  });
}
