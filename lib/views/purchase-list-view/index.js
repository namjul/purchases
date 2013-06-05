
"use strict";

/**
 * Module dependencies.
 */

var Backbone = require('backbone');
var _ = require('underscore');
var reactive = require('reactive');
var settings = require('settings');
var moment = require('moment');
var MonthView = require('month-view');

/**
 * List view.
 */

var ListView = module.exports = Backbone.View.extend({

  el: '#purchase-list-view',

  initialize: function(options) {
    this.purchaseEditView = options.purchaseEditView;
    this._viewPointers = {};
    this.listenTo(settings, 'change', this.change);
    this.listenTo(this.collection, 'reset', this.renderList, this);
    this.listenTo(this.collection, 'add', this.addPurchase, this);
    this.listenTo(this.collection, 'remove', this.removePurchase, this);
    this.listenTo(this.collection, 'change:date', this.purchaseDateChange, this);
    var view = reactive(this.el, this.collection, this);
  },

  purchaseDateChange: function(purchase) {
    var oldMonthGroup = moment(purchase.previous('date')).format('YYYY') + moment(purchase.previous('date')).format('MM');
    if(this._viewPointers[oldMonthGroup]) {
      this._viewPointers[oldMonthGroup].trigger('remove', purchase);
    }
    this.addPurchase(purchase);
  },

  haspurchases: function() {
    return this.collection.length;
  },

  change: function() {
    this.collection.trigger('change:settings');
  },

  renderList: function() {
    this.collection.each(this.addPurchase, this);
    return this;
  },

  addPurchase: function(purchase) {
    var monthGroup = moment(purchase.get('date')).format('YYYY') + moment(purchase.get('date')).format('MM');
    if(!this._viewPointers[monthGroup]) {
      this._viewPointers[monthGroup] = new MonthView({ collection: this.collection, monthGroup: monthGroup, isFirst: (_.size(this._viewPointers) === 0), purchaseEditView: this.purchaseEditView});
      this._viewPointers[monthGroup].on('removeMonthGroup', this.removeMonthGroup, this);
      this.$('div[data-type="list"]').append(this._viewPointers[monthGroup].render().el);
    }
    this._viewPointers[monthGroup].trigger('add', purchase);
    console.log('monthgroupt:before', monthGroup);
  },

  removePurchase: function(purchase) {
    var monthGroup = moment(purchase.get('date')).format('YYYY') + moment(purchase.get('date')).format('MM');
    this._viewPointers[monthGroup].trigger('remove', purchase);
  },

  removeMonthGroup: function(monthGroup) {
    this._viewPointers[monthGroup].off('removeMonthGroup');
    this._viewPointers[monthGroup].remove();
    delete this._viewPointers[monthGroup];
  }

});
