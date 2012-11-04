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
	callback(null);
      }, function(callback) {
	general.beforeEachContent(req);
	callback(null);
      },
      function(callback) {
	general.getEntry(req.params.id, req, function(entry) {
	  callback(null, entry.main_menu);
	});
      }
    ], function(err, menu_id) {
      console.log(JSON.stringify(req.session));
      app.async.parallel({
	entry_menus: function(callback) {
	  console.log('about to search for entry_menus with menu_id -> ' + menu_id);
	  app.models.entry_menu
	    .find({menu_id:menu_id}, null,
		  {sort: {ordr: 1}}, function(err, entry_menus) {
		    app.async.map(entry_menus, general.subMenus,
				  function(err, entry_menus) {
				    console.log(entry_menus);
				    callback(null, entry_menus);
				  });
		  });
	},
	entry: function(callback) {
	  app.models.entry
	    .findOne({_id:req.params.id}, function(err, entry) {
	      // console.log(entry);
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
	  admin_page: general.adminPage(req)
	  , text: md(results.entry.en.toString())
	  , entry: results.entry
	  , entry_menus: results.entry_menus
	  , title: results.entry.title
	  , breadcrumbs: results.breadcrumbs
	  , flash: req.flash()
	  , member: req.session.member
	});
      });
    });
  });
}

