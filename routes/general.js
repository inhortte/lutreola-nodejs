var url = require('url');

exports.adminPage = function(req) {
  var re = /\/admin/;
  return re.exec(req.url);
}

exports.adminLoginPage = function(req) {
  var re = /\/admin\/login/;
  return re.exec(req.url);
}

exports.galleryPage = function(req) {
  var re = /\/gallery/;
  return re.exec(req.url);
}

function backOrHome(req) {
  var thurk = "";
  if(req.session.current_entry) {
    thurk += "(<a href=\"/content/" + req.session.current_entry + "\">back</a>)";
  }
  thurk += "&nbsp;(<a href=\"/\">home</a>)";
  return(thurk);
}

function getHomeId(callback) {
  app.models.menu.findOne({name:'home'}, function(err, data) {
    callback(data._id);
  });
}
exports.getHomeId = getHomeId;

function getEntryId(req, callback) {
  console.log("unparsed url => " + req.url);
  console.log("parsed url -> " + url.parse(req.url));
  m = /\/content\/(\d+)/.exec(req.url);
  if(m) {
    callback(m[1]);
  } else {
    app.models.entry.findOne({title:'home'},
			     function(err, data) {
			       callback(data._id);
			     });
  }
}
exports.getEntryId = getEntryId;

function getEntry(id, req, callback) {
  app.async.waterfall([
    function(callback) {
      if(id) {
	callback(null, id);
      } else {
	m = /\/content\/(\d+)/.exec(req.url);  
	if(m)
	  callback(null, m[1]);
	else
	  callback(null, 0);
      }
    }
  ], function(err, entry_id) {
    app.models.entry.findOne((entry_id == 0 ? {title:'home'} : {_id:entry_id}),
			     function(err, entry) {
			       callback(entry);
			     });
  });
}
exports.getEntry = getEntry;

function getMenu(menu_id, callback) {
  if(menu_id) {
    app.models.menu.findOne((menu_id ? {_id:menu_id} : {name:'home'}),
			    function(err, menu) {
			      callback(menu);
			    });
  } else {
    callback(null);
  }
}
exports.getMenu = getMenu;

// A mongoose model has the relavent params in model._doc
// sub_obj can be a new object which is inserted into the newold. :) Or null.
function getTheDoc(obj, sub_obj, sub_obj_key, callback) {
  var new_obj = {};
  app.async.forEach(Object.keys(obj._doc),
		    function(item, callback) {
		      new_obj[item] = obj._doc[item];
		      callback(null);
		    },
		    function(err) {
		      if(sub_obj) new_obj[sub_obj_key] = sub_obj;
		      callback(new_obj);
		    });
}
exports.getTheDoc = getTheDoc;

exports.subMenus = function(entry_menu, callback) {
  app.async.waterfall([
    // Get the indicated entry.
    function(callback) {
      app.models.entry
	.findOne({_id:entry_menu.entry_id}, function(err, entry) {
	  callback(null, entry);
	});
    },
    function(entry, callback) {
      // console.log('checking this entry out:\n' + entry);
      if(entry.main_menu != entry_menu.menu_id) {
//	 entry.type == 'Page') { For some reason, this does not work...
	app.models.entry_menu
	  .find({menu_id:entry.main_menu}, null,
		{sort: {ordr: 1}}, function(err, entry_menus) {
		  // console.log("Submenus:\n" + entry_menus);
		  callback(null, entry_menus);
		});
      } else {
	callback(null, []);
      }
    }
  ], function(err, entry_menus) {
    // These are actually the entry_SUB_menus.
    getTheDoc(entry_menu, entry_menus, 'submenus',
	      function(entry_menu_with_submenus) {
		callback(null, entry_menu_with_submenus);
	      });
  });
}

function setMember(req, member, callback) {
  var memberish = {};
  memberish.username = member.username;
  memberish.email = member.email;
  memberish.type = member.type;
  req.session.member = memberish;
  callback();
}
exports.setMember = setMember;

function getMember(username, callback) {
  app.models.member
    .findOne({username:username}, function(err, member) {
      // I hope member is null if he/she is not found.
      if(member) {
	var memberish = {};
	memberish.username = member.username;
	memberish.email = member.email;
	memberish.type = member.type;
	req.session.member = memberish;
      } else {
	if(req.session.member) {
	  delete req.session.member;
	}
      }
    });
}
exports.getMember = getMember;

exports.beforeEach = function(req) {
  // breadcrumbs
  if(!req.session.breadcrumbs) {
    this.getHomeId(function(id) {
      var a = new Array();
      a.push(id);
      req.session.breadcrumbs = JSON.stringify(a);
    });
  } else {
    // req.session.breadcrumbs = JSON.stringify([4]);
  }
}

exports.beforeEachContent = function(req) {
  this.getEntryId(req, function(id) {
    req.session.current_entry = id;
  });
}

exports.getBreadcrumbs = function(req, callback) {
  if(this.adminLoginPage(req)) {
    callback("<strong>You may soon be an administrator, sir.</strong>" + backOrHome(req));
  } else if(this.adminPage(req)) {
    callback("<strong>You are an administrator, sir.</strong>" + backOrHome(req));
  } else if(this.galleryPage(req)) {
    callback("You are in the gallery, sir.");
  } else {
    getEntry(req.session.current_entry, req, function(entry) {
      m = getMenu(entry.main_menu, function(menu) {
	var links = [];
	var m = menu;
	app.async.whilst(
	  function() { return(m) },
	  function(callback) {
	    var entry_id = m.default_page_id;
	    links.unshift("<a href=\"/content/" + entry_id + "\">" + m.name + "</a>");
	    m = getMenu(m.parent_id, function(menu) {
	      m = menu;
	      callback();
	    });
	  },
	  function(err) {
	    callback(links.join(" -&gt; "));
	  }
	);
      });
    });
  }
}

