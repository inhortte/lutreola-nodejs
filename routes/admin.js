var general = require('./general');

module.exports = function() {
  app.get('/admin/login', function(req, res) {
    app.async.waterfall([
      function(callback) {
	general.beforeEach(req);
	callback(null);
      },
      function(callback) {
	general.getBreadcrumbs(req, function(bc) {
	  callback(null, bc);
	});
      }
    ], function(err, bc) {
      res.render('admin/login', {
	admin_page: true,
	title: "Admin login",
	breadcrumbs: bc
      });
    });
  });
}
