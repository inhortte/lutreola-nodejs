var express = require('express')
  , http = require('http')
  , stylus = require('stylus')
  , nib = require('nib')
  , mongoose = require('mongoose')
  , async = require('async')
  , markdown = require('node-markdown')
  , flash = require("connect-flash")
  , strftime = require("strftime")
  , twitter = require("ntwitter")
  , util = require('util');

app = module.exports = express();
server = http.createServer(app); // for socket.io
io = require("socket.io").listen(server);
app.mongoose = mongoose;
app.stylus = stylus;
app.nib = nib;
app.async = async;
app.markdown = markdown;
app.flash = flash;
app.strftime = strftime;
app.util = util;

var config = require('./config.js')(app, express, mongoose, stylus, nib);
app.models = {}
app.models.thurk = require('./models/thurk')(mongoose).model
app.models.member = require('./models/member')(mongoose).model
app.models.entry_menu = require('./models/entry_menu.js')(mongoose).model
app.models.menu = require('./models/menu.js')(mongoose).model
app.models.entry = require('./models/entry.js')(mongoose).model

// routes

require('./routes')();

// twitter

app.twit = new twitter({
  consumer_key: 'tquSIHqPE7mfAn1YeA43bg',
  consumer_secret: 'V7wbE8xccMmdQPK7AkuZdp9leDXjLFCGb8jKM4',
  access_token_key: '215388619-jWGNXZHLhhsrEthUKwssFbhEinw2yf9ajIDFTp3C',
  access_token_secret: 'Dqf8sGdR9flO7UaXqzWfZGK9ZGTUEbJwgAqKCcV9e8'
});

// app.get('/', routes.index);
// app.get('/content/:id', routes.content);

app.listen(app.get('port'));

io.on('connection', function(socket) {
  app.twit.stream('user', {track:'inhortte'},
    function(stream) {
      stream.on('data',function(data) {
	console.log(data);
        //socket.emit('twitter',data);
      });
    });
});

