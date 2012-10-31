var url = require('url');

exports.menu_options = [
  ['Home', '/content/3'],
  ['Thurk', '/content/4'],
  ['Lemur', '/content/5']
];

exports.getEntryId = function getEntryId(req, callback) {
  m = /\/content\/(\d+)/.exec(url.parse(req.url));
  if(m) {
    callback(m[1]);
  } else {
    app.models.menu.findOne({name:'home'},
			    function(err, data) {
			      callback(data._id);
			    });
  }
}

// The menu with name: 'home' must always exist. It is the menu root.
/*
app.async.parallel({
  app.models.menu.find(if(m = /\content
});
*/
