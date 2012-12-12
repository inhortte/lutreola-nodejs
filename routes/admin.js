var general = require('./general');
var im = require('imagemagick');

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
      },
      // get orphans
      function(bc, callback) {
	var orphans = [];
	app.models.entry
	  .find({}, function(err, entries) {
	    app.async.forEach(entries, function(entry, callback) {
	      app.models.entry_menu
		.findOne({entry_id:entry._id}, function(err, em) {
		  if(!em) {
		    orphans.push(entry);
		  }
		  callback(null);
		});
	    }, function(err) {
	      callback(null, bc, orphans);
	    });
	  });
      }
    ], function(err, bc, orphans) {
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
				, orphans: orphans
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
      // Get all menus select
      function(bc, entry, callback) {
	general.makeMenuSelect(null, function(all_menus_select) {
	  callback(null, bc, entry, all_menus_select);
	});
      },
      // Get menu select.
      function(bc, entry, all_menus_select, callback) {
	general.makeMenuSelectByEntry(entry, function(menu_select) {
	  // console.log(menu_select);
	  callback(null, bc, entry, all_menus_select, menu_select);
	});
      },
      // Get array of [menu, menu_select]...
      function(bc, entry, all_menus_select, menu_select, callback) {
	general.getMenuEMArraysByEntry(entry, function(menu_ems) {
	  callback(null, bc, entry, all_menus_select, menu_select, menu_ems);
	});
      }
    ], function(err, bc, entry, all_menus_select, menu_select, menu_ems) {
      res.render('admin/entry', {
	admin_page: true
	, title: "Update entry" 
	, breadcrumbs: bc
	, flash: req.flash()
	, id: entry._id
	, entry: entry
	, all_menus_select: all_menus_select
	, menu_select: menu_select
	, menu_ems: menu_ems
	, member: req.session.member
      });
    });
  });

  app.get('/admin/entry', function(req, res) {
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
      // Get all menus select
      function(bc, callback) {
	general.makeMenuSelect(null, function(all_menus_select) {
	  callback(null, bc, all_menus_select);
	});
      }
    ], function(err, bc, all_menus_select) {
      res.render('admin/entry', {
	admin_page: true
	, title: "New entry" 
	, breadcrumbs: bc
	, flash: req.flash()
	, all_menus_select: all_menus_select
	, menu_select: all_menus_select
	, member: req.session.member
      });
    });
  });

  app.post('/admin/entry', function(req, res) {
    app.async.waterfall([
      function(callback) {
	beforeEach(req, res);
	callback(null);
      },
      function(callback) {
	delete req.body.menus;
	app.async.reduce(Object.keys(req.body), {}, function(mts, key, callback) {
	  if(/^mt/.exec(key)) {
	    mts[key] = req.body[key];
	    delete req.body[key];
	  }
	  callback(null, mts);
	}, function(err, mts) {
	  callback(null, mts);
	});
      },
      function(mts, callback) {
	general.getMenuByName(req.body.main_menu, function(menu) {
	  callback(null, mts, menu);
	});
      }
    ], function(err, mts, menu) {
      if(menu) {
	req.body.main_menu = menu._id;
      } else {
	req.body.main_menu = null;
      }
      if(typeof req.body.id !== 'undefined') {
	// req.body._id = req.body.id;
	var id = req.body.id;
	delete req.body.id;
	// console.log("current req.body:");
	// console.log(JSON.stringify(req.body));
	app.models.entry.findOneAndUpdate({_id:id}, req.body, function(err, entry) {
	  if(err) {
	    // console.log(JSON.stringify(err));
	    req.flash('error', 'The entry could not be updated! Please go play with Neptun for a while.');
	  } else {
	    req.flash('notice', 'Entry updated. Have a splendid day.');
	  }
	  general.alignEntryMenus(entry, mts, function() {
	    res.redirect("/admin/entry/" + id);
	  });
	});
      } else {
	general.getLastEntryId(function(id) {
	  // console.log("Last id " + id);
	  req.body._id = id + 1;
	  var new_entry = app.models.entry(req.body)
	  new_entry.save(function(err) {
	    if(err) {
	      // console.log(JSON.stringify(err));
	      req.flash('error', 'The entry could not be created! Please go play with Neptun for a while.');
	      res.redirect("/admin/entry");
	    } else {
	      req.flash('notice', 'Entry created. Have a splendid day.');
	      general.alignEntryMenus(new_entry, mts, function() {
		res.redirect("/admin/entry/" + (id + 1));
	      });
	    }
	  });
	});
      }
    });
  });

  app.get('/admin/menu/:id', function(req, res) {
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
      // Get menu.
      function(bc, callback) {
	general.getMenu(req.params.id, function(menu) {
	  callback(null, bc, menu);
	});
      },
      // Get menu select by id
      function(bc, menu, callback) {
	general.makeMenuSelect(menu._id, function(menu_select_by_id) {
	  callback(null, bc, menu, menu_select_by_id);
	});
      },
      // Get page select
      function(bc, menu, menu_select_by_id, callback) {
	general.makePageSelect(menu, function(page_select) {
	  callback(null, bc, menu, menu_select_by_id, page_select);
	});
      },
      function(bc, menu, menu_select_by_id, page_select, callback) {
	app.models.entry_menu
	  .find({menu_id:menu._id}, null, {sort: {ordr: 1}},
		function(err, entry_menus) {
		  callback(null, bc, menu, menu_select_by_id,
			   page_select, entry_menus);
		});
      }
    ], function(err, bc, menu, menu_select_by_id, page_select, entry_menus) {
      res.render('admin/menu', {
	admin_page: true
	, title: "Update menu" 
	, breadcrumbs: bc
	, flash: req.flash()
	, id: menu._id
	, menu: menu
	, menu_select_by_id: menu_select_by_id
	, page_select: page_select
	, entry_menus: entry_menus
	, member: req.session.member
      });
    });
  });

  app.get('/admin/menu', function(req, res) {
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
      // Get menu select by id
      function(bc, callback) {
	general.makeMenuSelect(0, function(menu_select_by_id) {
	  callback(null, bc, menu_select_by_id);
	});
      },
      // Get page select
      function(bc, menu_select_by_id, callback) {
	general.makePageSelect(null, function(page_select) {
	  callback(null, bc, menu_select_by_id, page_select);
	});
      }
    ], function(err, bc, menu_select_by_id, page_select) {
      res.render('admin/menu', {
	admin_page: true
	, title: "New menu" 
	, breadcrumbs: bc
	, flash: req.flash()
	, menu_select_by_id: menu_select_by_id
	, page_select: page_select
	, member: req.session.member
      });
    });
  });

  app.post('/admin/menu', function(req, res) {
    app.async.waterfall([
      function(callback) {
	beforeEach(req, res);
	callback(null);
      },
    ], function(err) {
      if(typeof req.body.id !== 'undefined') {
	var id = req.body.id;
	var ordr = req.body.ordr;
	delete req.body.id;
	delete req.body.ordr;
	app.models.menu.findOneAndUpdate({_id:id}, req.body, function(err, menu) {
	  if(err) {
	    req.flash('error', 'The menu was not updated. Please fix me a bowl of soup.');
	  } else {
	    req.flash('notice', 'The menu was updated! But my foot still hurts.');
	  }
	  ordr.split(',').forEach(function(e,i,a) {
	    app.models.entry_menu
	      .findOneAndUpdate({_id:e}, {ordr:(i + 1)}, function(err, em) {
		if(err) {
		  console.log(err);
		}
		console.log(em);
	      });
	  });
	  res.redirect('/admin/menu/' + id);
	});
      } else {
	general.getLastMenuId(function(id) {
	  req.body._id = id + 1;
	  console.log("Trying to save...");
	  console.log(JSON.stringify(req.body));
	  var new_menu = app.models.menu(req.body);
	  new_menu.save(function(err) {
	    if(err) {
	      console.log(JSON.stringify(err));
	      req.flash('error', 'The menu could not be created. Sounds like a personal problem.');
	    } else {
	      req.flash('notice', 'The menu was created. Praise Jesus!');
	    }
	    res.redirect('/admin/menu/' + (id + 1));
	  });
	});
      }
    });
  });

  app.get('/admin/news/:id', function(req, res) {
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
      // Get News
      function(bc, callback) {
	general.getNews(req.params.id, function(news) {
	  callback(null, bc, news);
	});
      }
    ], function(err, bc, news) {
      res.render('admin/news', {
	admin_page: true
	, title: 'Update news item'
	, breadcrumbs: bc
	, flash: req.flash()
	, id: news._id
	, news: news
	, created_at: app.strftime('%Y-%m-%d %H:%M', news.created_at)
	, member: req.session.member
      });
    });
  });

  app.get('/admin/news/:id/delete', function(req, res) {
    app.models.news
      .findOne({_id:req.params.id}, function(err, news_item) {
	if(!err && news_item) {
	  news_item.remove(function(err, news_item) {
	    if(err) {
	      console.log(err);
	      req.flash('error', 'That item is sticking around, I am afraid.');
	    } else {
	      req.flash('notice', '*BOOM*');
	    }
	    res.redirect('/news');
	  });
	}
      });
  });

  app.get('/admin/news', function(req, res) {
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
    ], function(err, bc) {
      res.render('admin/news', {
	admin_page: true
	, title: "New News Item"
	, breadcrumbs: bc
	, flash: req.flash()
	, member: req.session.member
      });
    });
  });

  app.post('/admin/news', function(req, res) {
    if(req.files.image) {
      // console.log('req.files:' + JSON.stringify(req.files.image));
    }
    app.async.waterfall([
      function(callback) {
	beforeEach(req, res);
	callback(null);
      },
      // image
      function(callback) {
	if(req.files.image.name.length > 0) {
	  var img_file = general.rndFileName() + '.jpg';
	  im.resize({
	    srcPath: req.files.image.path
	    , dstPath: process.env.PWD + '/public/images/news/' + img_file
	    , width: 256
	  }, function(err, stdout, stderr) {
	    if(err) {
	      console.log(err);
	    }
	    callback(null, img_file);
	  });
	} else {
	  callback(null, null);
	}
      }
    ], function(err, img_file) {
      if(typeof req.body.id !== 'undefined') {
	var id = req.body.id;
	delete req.body.id;
	try {
	  req.body.created_at = new Date(Date.parse(req.body.created_at));
	} catch (err) {
	  req.body.created_at = new Date();
	}
	app.models.news
	  .findOne({_id:id}, function(err, news_item) {
	    if(img_file) {
	      req.body.image = img_file;
	    }
	    news_item.update(req.body, function(err) {
	      if(err) {
		req.flash('error', 'The news item was not updated. Please put another naarits in my backpack.');
	      } else {
		req.flash('notice', 'The news item was updated! But there are only two naaritsad in my backpack.');
	      }
	      res.redirect('/admin/news/' + id);
	    });
	  });
      } else {
	general.getLastNewsId(function(id) {
	  req.body._id = id + 1;
	  req.body.created_at = new Date();
	  req.body.image = img_file;
	  var new_news = app.models.news(req.body);
	  new_news.save(function(err) {
	    if(err) {
	      console.log(JSON.stringify(err));
	      req.flash('error', 'The news item could not be created. Sounds like a personal problem.');
	    } else {
	      req.flash('notice', 'The news item was created. Praise Allah!');
	    }
	    res.redirect('/admin/news/' + (id + 1));
	  });
	});
      }
    });
  });

}

