
"use strict";

/**
 * Module dependencies
 */

var Backbone = require('backbone');
var _ = require('underscore');
var category = require('category');
var Store = require('backbone.localStorage');


/**
 * Collection
 */

var Categories = module.exports = Backbone.Collection.extend({

  model: category,

  localStorage: new Store('categories'),

  comparator: function(category) {
    return category.get('usage');
  },

  getMostUsed: function() {
    return this.reduce(function(previousCategory, category) {
      return category.get('usage') > previousCategory.get('usage') ? category : previousCategory;
    });
  }

});

/**
 * Expose collection instance.
 */

module.exports = new Categories();
