module.exports = function(app, express) {

  var config = this;

  app.requireAuth = false;

  //configure everyauth
  /*
  app.everyauth.debug = true;
  app.everyauth.twitter
     .consumerKey('tquSIHqPE7mfAn1YeA43bg')
     .consumerSecret('V7wbE8xccMmdQPK7AkuZdp9leDXjLFCGb8jKM4')
     .findOrCreateUser(function(session, accessToken, accessTokenSecret, twitUser) {
       // promise = @.Promise().fulfill user
       return twitUser.id;
  }).redirectPath('/');
  */

  app.configure(function() {
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.cookieParser());
    app.use(express.session({ secret: 'flavigula',
			      store: new express.session.MemoryStore({ reapInterval:  60000 * 10 })}));
    app.use(app.flash());
    /*
    app.use(function(req, res) {
      res.locals({
	member: req.session.member,
	flash: req.flash()
      });
    });
    */
    app.use(app.stylus.middleware(
      { src: __dirname + '/public'
	, compile: function(str, path) {
	  return app.stylus(str).set('filename', path).use(app.nib());
	}
      }
    ));
    app.use(express.static(__dirname + '/public'));
    app.use(express.favicon());
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    //app.use(app.mongooseAuth.middleware());
    // app.use(app.everyauth.middleware(app));
    app.use(app.router);
  });

  /*
  app.locals.use(function(req, res) {
    res.locals.member = req.session.member;
    res.locals.flash = req.flash();
  });
  */

  //env specific config
  app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    // app.mongoose.connect('mongodb://lutreola:mustelid@ds039427.mongolab.com:39427/naaritsad');
    app.mongoose.connect('mongodb://localhost/naaritsad');
  });

  app.configure('production', function(){
    app.use(express.errorHandler());
    app.mongoose.connect('mongodb://lutreola:mustelid@ds039427.mongolab.com:39427/naaritsad');
    // app.mongoose.connect('mongodb://localhost/naaritsad');
  });

  return config;
};
