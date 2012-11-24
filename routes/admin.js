var general = require('./general');

function beforeEach(req, res) {
  if(!req.session.member) { // should check member.type, also.
    req.flash('error', 'Access denied!');
    if(req.session.current_entry) {
      res.redirect('/content/' + req.session.current_entry);
    } else {
      res.redirect('/admin/login');
    }
  }
}

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
	admin_page: true
	, title: "Admin login"
	, breadcrumbs: bc
	, flash: req.flash()
	, member: req.session.member
      });
    });
  });

  app.post('/admin/login', function(req, res) {
    app.models.member
      .authenticate(req.body.username, req.body.password, function(member) {
	if(!member) {
	  req.flash('error', 'Something went awry. Perhaps you should try again.');
	  if(req.session.member) delete req.session.member;
	  res.redirect('/admin/login');
	} else {
	  general.setMember(req, member, function() {
	    req.flash('notice', 'You have been logged in.');
	    res.redirect('/admin/map');
	  });
	}
      });
  });

  app.get('/admin/logout', function(req, res) {
    delete req.session.member;
    if(req.session.current_entry) {
      res.redirect('/content/' + req.session.current_entry);
    } else {
      res.redirect('/');
    }
  });

  app.get('/admin/map', function(req, res) {
    app.async.waterfall([
      function(callback) {
	general.beforeEach(req);
	beforeEach(req, res);
	callback(null);
      },
      function(callback) {
	general.getBreadcrumbs(req, function(bc) {
	  callback(null, bc);
	});
      }
    ], function(err, bc) {
      app.models.menu
	.find({}, null, {sort: {_id: 1}}, function(err, menus) {
	  var menus_with_entry_menus = [];
	  app.async.forEach(menus,
			    function(menu, callback) {
			      app.models.entry_menu
				.find({menu_id:menu._id},
				      null, {sort: {ordr: 1}},
				      function(err, entry_menus) {
					general.getTheDoc(menu, entry_menus,
							  'entry_menus',
							  function(new_menu) {
							    menus_with_entry_menus.push(new_menu);
							    callback(null);
							  });
				      });
			    },
			    function(err) {
			      // console.log(menus_with_entry_menus);
			      res.render('admin/map', {
				admin_page: true
				, title: "Menu map"
				, breadcrumbs: bc
				, flash: req.flash()
				, menus: menus_with_entry_menus
				, member: req.session.member
			      });
			    });
	});
    });
  });

  app.get('/admin/entry/:id', function(req, res) {
    app.async.waterfall([
      function(callback) {
	general.beforeEach(req);
	beforeEach(req, res);
	callback(null);
      },
      function(callback) {
	general.getBreadcrumbs(req, function(bc) {
	  callback(null, bc);
	});
      },
      // Get entry.
      function(bc, callback) {
	general.getEntry(req.params.id, req, function(entry) {
	  // console.log("Entry \"" + entry.title + "\" found.");
	  callback(null, bc, entry);
	});
      },
      // Get menu select.
      function(bc, entry, callback) {
	general.makeMenuSelectByEntry(entry, function(menu_select) {
	  // console.log(menu_select);
	  callback(null, bc, entry, menu_select);
	});
      },
      // Get array of [menu, menu_select]...
      function(bc, entry, menu_select, callback) {
	general.getMenuEMArraysByEntry(entry, function(menu_ems) {
	  callback(null, bc, entry, menu_select, menu_ems);
	});
      }
    ], function(err, bc, entry, menu_select, menu_ems) {
      res.render('admin/entry', {
	admin_page: true
	, title: "Update entry" 
	, breadcrumbs: bc
	, flash: req.flash()
	, id: entry._id
	, entry: entry
	, menu_select: menu_select
	, menu_ems: menu_ems
	, member: req.session.member
      });
    });
  });
}


