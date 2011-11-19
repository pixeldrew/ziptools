
/**
 * Node App for zip utilities
 */


var express = require('express'), 
  routes = require('./routes');

var app = module.exports = express.createServer();

var ZipProvider = require('./models/zipprovider-mongodb').ZipProvider;


// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
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
app.get('/geo2zip/:loc', routes.geo2zip);
app.get('/zip/:zip', routes.getZip);
app.get('/zip/install', routes.installDb);

app.listen(3002);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
