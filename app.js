
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , camps_api = require('./camps_api')
  , jade_loader = require('./jade_loader');

var app = module.exports = express.createServer();

// Configuration

app.configure(function() {
  app.use(express.logger());
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(require('stylus').middleware({ src: __dirname + '/public' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});


app.configure('development', function() {
  app.use(express.errorHandler({
    dumpExceptions : true,
    showStack : true
  }));
});



app.configure('production', function() {
  app.use(express.errorHandler());
});


// Routes

app.all('/api/camps/:id?', camps_api.api_all);

app.get('/', routes.index);

jade_loader.loadTemplates('templates');
app.get('/js/templates.js', jade_loader.serveTemplates);

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);


