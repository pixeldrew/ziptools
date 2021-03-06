
/**
 * Node App for zip utilities
 */


var express = require('express'), 
  routes = require('./routes');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.enable("jsonp callback");
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.static(__dirname + '/public'));
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes
app.get('/geo2zip/test', routes.test);
app.get('/geo2zip/:loc', routes.geo2zip);
app.get('/zip/install', routes.installDb);
app.get('/zip/:zip', routes.getZip);

app.listen(process.env.PORT || '3000');
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
