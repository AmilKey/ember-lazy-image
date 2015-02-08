import Ember from 'ember';

var on             = Ember.on;
var run            = Ember.run;
var get            = Ember.get;
var set            = Ember.set;
var computed       = Ember.computed;
var Component      = Ember.Component;
var getWithDefault = Ember.getWithDefault;

export default Component.extend({
  errorThrown: false,
  lazyUrl:     null,

  classNames: ['lazy-image-container'],

  classNameBindings: ['lazyLoaded', 'errorThrown'],

  defaultErrorUrl: computed('errorUrl', function() {
    return getWithDefault(this, 'errorUrl', null);
  }),

  defaultErrorText: computed('errorText', function() {
    return getWithDefault(this, 'errorText', 'Image failed to load');
  }),

  lazyLoaded: computed('lazyUrl', function() {
    var lazyUrl = get(this, 'lazyUrl');

    return !!lazyUrl;
  }),

  _resolveImage: on('didInsertElement', function() {
    var component = this;
    var image     = component.$('img');
    var isCached  = image[0].complete;

    if (!isCached) {
      image.on('error', function(error) {
        component._imageError(error);
      });
    }
  }),

  _imageError: function() {
    var component = this;

    run(function() {
      set(component, 'errorThrown', true);
    });
  },

  willDestroy: function() {
    this.$('img').off('error');
  },

  click: function() {
    var url = get(this, 'url');

    set(this, 'lazyUrl', url);
  }
});
