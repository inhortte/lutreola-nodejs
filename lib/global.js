var db = require('db');
var url = require('url');

exports.admin_page = function(req, res, next) {
  var re = /\/admin/;
  return re.exec(url.parse(req.url));
}
