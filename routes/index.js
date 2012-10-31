/* Get main page */

var url = require('url');
var general = require('./general');

function adminPage(req) {
  var re = /\/admin/;
  return re.exec(url.parse(req.url));
}

exports.index = function(req, res) {
  if(app.requireAuth === true && req.loggedIn === false)
    res.redirect('/auth/twitter');

  app.async.waterfall([
    function(callback) {
      general.getEntryId(req, function(id) {
	console.log(id);
	callback(null, id);
      });
    },
    function(id, callback) {
      app.models.entry_menu.find({menu_id:id}, null,
				 {sort: {ordr: 1}}, function(err, entries) {
				   console.log(entries);
				   callback(null, entries);
				 });
    },
    function(entries, callback) {
      app.models.thurk.find({}, function(err, thurks) {
	callback(null, entries, thurks);
      })
    }
  ], function(err, entries, thurks) {
    res.render('index', {
      admin_page: adminPage(req),
      title: 'Leper',
      thurk: thurks,
      entries: entries,
      menu_options: general.menu_options
    });
  });
}

