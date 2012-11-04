var express = require('express')
  , stylus = require('stylus')
  , nib = require('nib')
//  , everyauth = require('everyauth')
  , mongoose = require('mongoose')
  , async = require('async')
  , markdown = require('node-markdown')
  , flash = require("connect-flash");
//  , mongooseAuth = require('mongoose-auth-latest');

app = module.exports = express();
app.mongoose = mongoose;
// app.mongooseAuth = mongooseAuth;
app.stylus = stylus;
app.nib = nib;
app.async = async;
app.markdown = markdown;
app.flash = flash;
// app.everyauth = everyauth;
// Apprarently, this is depreciated.
// everyauth.helpExpress(app); 

var config = require('./config.js')(app, express, mongoose, stylus, nib);
app.models = {}
app.models.thurk = require('./models/thurk')(mongoose).model
// app.models.user = require('./models/user')(mongoose, mongooseAuth).model
app.models.member = require('./models/member')(mongoose).model
app.models.entry_menu = require('./models/entry_menu.js')(mongoose).model
app.models.menu = require('./models/menu.js')(mongoose).model
app.models.entry = require('./models/entry.js')(mongoose).model

// routes

require('./routes')();

// app.get('/', routes.index);
// app.get('/content/:id', routes.content);

app.listen(app.get('port'));
