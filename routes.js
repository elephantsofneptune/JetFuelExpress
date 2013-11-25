var urlContoller = require('./routes/url_routes');
var userController = require('./routes/user_routes');
var Url = require('./lib/url');
var User = require('./lib/user');

module.exports = function(app) {

  // API Routes

  app.get( '/api',                    urlContoller.root);
  app.get( '/api/urls',               urlContoller.index);
  app.post( '/api/urls',              urlContoller.create);
  app.get( '/api/urls/:shortened',    urlContoller.show);
  app.get( '/:shortened',             urlContoller.redirect);
  app.put( '/api/urls/:shortened',    urlContoller.update);
  app.delete( '/api/urls/:shortened', urlContoller.delete);

  // User Routes

  app.post( '/api/users/',            userController.create);

};