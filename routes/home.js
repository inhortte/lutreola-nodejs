var general = require('./general');

module.exports = function() {
  app.get('/', function(req, res) {
    console.log(JSON.stringify(req.session));
    if(app.requireAuth === true && req.loggedIn === false)
      res.redirect('/auth/twitter');

    app.async.waterfall([
      function(callback) {
	general.beforeEach(req);
	callback(null);
      },
      function(callback) {
	general.getEntry(null, req, function(entry) {
	  callback(null, entry.main_menu);
	});
      },
      // Grab all the top level and second level entries according to the
      // current menu_id from mongoDB.
      function(menu_id, callback) {
	console.log('about to search for entry_menus with menu_id -> ' + menu_id);
	app.models.entry_menu
	  .find({menu_id:menu_id}, null,
		{sort: {ordr: 1}}, function(err, entry_menus) {
		  app.async.map(entry_menus, general.subMenus,
				function(err, entry_menus) {
				  // console.log("########### modified entry_menus:\n " + entry_menus);
				  callback(null, entry_menus);
				});
		});
      },
      function(entry_menus, callback) {
	app.models.thurk.find({}, function(err, thurks) {
	  callback(null, entry_menus, thurks);
	})
      },
      // last, but not least, get the breadcrumbs.
      function(entry_menus, thurks, callback) {
	general.getBreadcrumbs(req, function(bc) {
	  callback(null, entry_menus, thurks, bc);
	});
      }
    ], function(err, entry_menus, thurks, bc) {
      res.render('index', {
	admin_page: general.adminPage(req)
	, title: 'Leper'
	, thurk: thurks
	, entry_menus: entry_menus
	, breadcrumbs: bc
	, flash: req.flash()
	, member: req.session.member
      });
    });
  });
}

