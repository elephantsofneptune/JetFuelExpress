
/**
 * Module dependencies.
 */

var express = require('express');
var mongoose = require ( 'mongoose' );
var http = require('http');
var path = require('path');
var generator = require('./lib/generator');

var application_root = __dirname;

// Create server
var app = express();



// Configure server
app.configure( function() {

  // all environments
  app.set('port', process.env.PORT || 3000);
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'jade');
  app.set('title', 'JetFuelExpress')

  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded());
  app.use(express.cookieParser('Once upon a midnight dream'));
  app.use(express.session());
  app.use(require('less-middleware')({ src: path.join(__dirname, 'public') }));

  // Parse request body and populate request.body
  app.use( express.bodyParser() );

  // Check request.body for HTTP method overrides
  app.use( express.methodOverride() );

  // Perform route lookup based on URL and HTTP method
  app.use(app.router);

  // Where to serve static content
  app.use( express.static( path.join( application_root, 'public') ) );

  app.use( "/", ( path.join( application_root, 'public') ) );
});

// Schema

var UrlSchema = new mongoose.Schema({
  title: String,
  shortenedUrl: String,
  originalUrl: String,
  description: String,
  createdDate: String
});

// Models

var UrlModel = mongoose.model( 'Urls', UrlSchema);


// Development only
if ('development' == app.get('env')) {
  // Show all errors in development
  app.use( express.errorHandler({ dumpExceptions: true, showStack: true}));
  mongoose.connect('mongodb://localhost/jetfuelexpress');
}

// Test only
if ('test' == app.get('env')) {
  // Show all errors in development
  app.use( express.errorHandler({ dumpExceptions: true, showStack: true}));
  mongoose.connect('mongodb://localhost/jetfuelexpress');
}




//Routes



//ROOT

app.get('/api', function(request, response) {
  response.send( 'JetFuelExpress API is running!')
});

// INDEX

app.get( '/api/urls', function( request, response ) {
  return UrlModel.find( function( err, url ) {
    if ( err ) {
      response.json( err );
    } else {
      response.send( url );
    }
  });
});

// CREATE

app.post( '/api/urls', function( request, response ) {
  var url = new UrlModel({
    title: request.body.title,
    shortenedUrl: generator.generate_link(),
    originalUrl: request.body.originalUrl,
    description: request.body.description,
    createdDate: Date.now(),
  });


  url.save( function( err, url ) {
    if( err ) response.json( err );
    response.send( url );
  });
});

// SHOW

app.get( '/api/urls/:shortened', function( request, response ) {
  var found = UrlModel.findOne({ 'shortenedUrl': request.params.shortened }, function( err, doc ) {
    if ( err ) {
      response.json( err );
    } else {
      return response.send( doc );
    }
    return found._id;
  });
});

// UPDATE

app.put( '/api/urls/:shortened', function( request, response ) {
  return UrlModel.findOne({ 'shortenedUrl': request.params.shortened }, function( err, doc ) {
    doc.title = request.body.title;
    doc.shortenedUrl = request.body.shortenedUrl;
    doc.originalUrl = request.body.originalUrl;
    doc.description = request.body.description;

    return doc.save( function( err, url ) {
      if( err ) response.json( err );
      response.send( url );
    });
  });
});

// DELETE

app.delete( '/api/urls/:shortened', function( request, response ) {
  return UrlModel.findById( request.params.id, function( err, doc ) {

    return doc.remove( function( err, url ) {
      if( err ) response.json( err );
      response.send( "Success!" );
    });
  });
});



// Start Server
app.listen(app.get('port'), function(){
  console.log('Express server listening on port %d in %s mode', app.get('port'), app.settings.env );
});

module.exports = app;
