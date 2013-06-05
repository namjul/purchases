
"use strict";

/**
 * Module dependencies.
 */

var Backbone = require('backbone');
var _ = require('underscore');
var reactive = require('reactive');
var settings = require('settings');
var moment = require('moment');
var categories = require('categories');

/**
 * Month view.
 */

var PurchaseView = module.exports = Backbone.View.extend({

  tagName: 'li',

  className : 'purchase-view',

  template: _.template(require('./template')),

  events: {
    'click a': 'editPurchase'
  },

  initialize: function(options) {
    this.purchaseEditView = options.purchaseEditView;
    this.listenTo(settings, 'change:currency', this.changeCurrency);
    this.listenTo(this.model, 'destroy', this.remove, this); 
  },

  render: function() {
    this.$el.html(this.template());
    reactive(this.$el[0], this.model, this);
    return this;
  },

  editPurchase: function(e) {
    this.purchaseEditView.open(this.model);
    e.preventDefault();
  },

  changeCurrency: function() {
    this.model.trigger('change:currency');
  },

  date: function() {
    return moment(this.model.get('date')).format('MM.DD');
  },

  categoryColor: function() {
    return categories.get(this.model.get('categoryId')).get('color');
  },

  amount: function() {
    return this.model.get('amount');
  },

  currency: function() {
    return settings.get('currency');
  },

  categoryName: function() {
    return categories.get(this.model.get('categoryId')).get('name');
  },

  note: function() {
    return this.model.get('note');
  }
});


