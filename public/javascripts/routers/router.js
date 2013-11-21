var jetfuelexpress = jetfuelexpress || {};

jetfuelexpress.Router = Backbone.Router.extend({

  routes: {
    "": "home",
    "shorten": "urls"
  },

  home: function() {
    jetfuelexpress.appView.showShorten();
    jetfuelexpress.appView.showHome();
  },

  urls: function() {
    jetfuelexpress.appView.showUrls();
  }

});