
"use strict";

/**
 * Module dependencies.
 */

var Backbone = require('backbone');
var _ = require('underscore');
var reactive = require('reactive');
var settings = require('settings');

/**
 * Initialize a new backbone view for settings page.
 */

var SettingsView = module.exports = Backbone.View.extend({
  el: '#view-settings',

  events: {
    'click #settings-close': 'close'
  },

  initialize: function() {
    this.model = settings;
    this.on('open', _.bind(this.open, this));
    var view = reactive(this.el, this.model, this);

    //Custom reactive binding.
    view.bind('data-select', function(el, name) {
      el.value = this.obj.get(name);
      el.onchange = _.bind(function() {
        console.log(name, el.value);
        this.obj.set(name, el.value);
        this.obj.save();
      }, this);
    });
  }, 

  open: function() {
    this.$el.removeClass('view-bottom');
  },

  close: function() {
    this.$el.addClass('view-bottom');
  }

});



