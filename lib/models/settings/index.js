
"use strict";

/**
 * Module dependencies.
 */

var Backbone = require('backbone');
var _ = require('underscore');
var Store = require('backbone.localStorage');

/**
 * Model for settings.
 */

var Settings =  Backbone.Model.extend( {

  localStorage: new Store('Settings'),

  defaults: {
    'group': 'month',
    'currency': '€'
  }
});

/**
 * Fetch settings from store.
 */

var settings = new Settings({id: 1});
settings.fetch();

/**
 * Expose 'settings' singleton instance.
 */

module.exports = settings;
