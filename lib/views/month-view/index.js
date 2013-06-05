
"use strict";

/**
 * Module dependencies.
 */

var Backbone = require('backbone');
var _ = require('underscore');
var reactive = require('reactive');
var settings = require('settings');
var moment = require('moment');
var PurchaseView = require('purchase-view');


/**
 * Month view.
 */

var MonthView = module.exports = Backbone.View.extend({

  className : 'month-view',

  events: {
    'click header': 'open'
  },

  template: _.template(require('./month')),

  initialize: function(options) {
    this.purchaseEditView = options.purchaseEditView;
    this.isFirst = options.isFirst;
    this.monthGroup = options.monthGroup;

    this._viewPointers = {};
    this.listenTo(this, 'add', this.addPurchase);
    this.listenTo(this, 'remove', this.removePurchase);
    this.listenTo(settings, 'change:currency', this.changeCurrency);
    this.listenTo(this.collection, 'change:month' + this.monthGroup, function() {
      this.trigger('change:monthAmount');
    });
  },

  addPurchase: function(purchase) {
    this._viewPointers[purchase.cid] = new PurchaseView({model: purchase, purchaseEditView: this.purchaseEditView});
    this.$('ul').prepend(this._viewPointers[purchase.cid].render().el);
    this.trigger('change:monthAmount');
  },

  removePurchase: function(purchase) {
    if(this._viewPointers[purchase.cid]) {
      this._viewPointers[purchase.cid].remove();
      delete this._viewPointers[purchase.cid];
      this.trigger('change:monthAmount');
    }
    if(!this.hasPurchases()) {
      this.trigger('removeMonthGroup', this.monthGroup);
    }
  },

  render: function() {
    this.$el.html(this.template());
    if(!this.isFirst) {
      this.$('ul').addClass('hide');
    }
    reactive(this.$el[0], this);
    return this;
  },

  open: function() {
    this.$('ul').toggleClass('hide');
  },

  changeCurrency: function() {
    this.trigger('change:currency');
  },

  monthDate: function() {
    return moment(this.monthGroup, 'YYYYMM').format('MMMM YYYY');
  },

  monthAmount: function() {
    return Math.floor(_.reduce(this._viewPointers, function(sum, purchaseView) {
      return purchaseView.model.get('amount') + sum;
    }, 0) * 100) /100;
  },

  currency: function() {
    return settings.get('currency');
  },

  hasPurchases: function() {
    return _.size(this._viewPointers);
  }

});

