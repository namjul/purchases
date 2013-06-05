
"use strict";

/**
 * Module dependencies
 */

var Backbone = require('backbone');
var _ = require('underscore');
var purchase = require('purchase');
var Store = require('backbone.localStorage');
var moment = require('moment');

/**
 * Collection
 */

var Purchases = module.exports = Backbone.Collection.extend({

  model: purchase,

  localStorage: new Store('purchases'),

  initialize: function() {
    this.on('change', _.bind(function(model) {
      var monthGroup = moment(model.get('date')).format('YYYY') + moment(model.get('date')).format('MM');
      this.trigger('change:month' + monthGroup); 
    }, this));
  },

  comparator: function(purchase) {
    return -purchase.get('date');
  }

});

/**
 * Expose collection instance.
 */

module.exports = new Purchases();
