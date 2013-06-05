
"use strict";

/**
 * Module dependencies.
 */

var Backbone = require('backbone');
var _ = require('underscore');
var reactive = require('reactive');
var settings = require('settings');
var moment = require('moment');

/**
 * Overview view.
 */

var OverviewView = module.exports = Backbone.View.extend({

  el: '#overview-view',

  initialize: function() {
    this.listenTo(settings, 'change:currency', this.changeCurrency);
    this.listenTo(settings, 'change:group', this.change);
    reactive(this.el, this.collection, this);
  },

  haspurchases: function() {
    return this.collection.length;
  },

  group: function() {
    switch(settings.get('group')) {
      case 'month':
        return moment().format('MMM');
      case 'week':
        return 'Kalenderwoche ' + moment().week();
      case 'year':
        return moment().format('YYYY');
    }
  },

  amount: function() {
    return this.calculateAmount(settings.get('group'), moment());
  },

  currency: function() {
    return settings.get('currency');
  },

  changeCurrency: function() {
    this.collection.trigger('change:settings');
  },

  calculateAmount: function(group, currentDate) {
    var amount = null;
    if(group === 'month') {
      amount = this.collection.reduce(function(sum, purchase) {
        if(currentDate.month() === moment(purchase.get('date')).month()) {
          return purchase.get('amount') + sum;
        } else {
          return sum;
        }
      }, 0);
    } else if(group === 'year') {
      amount = this.collection.reduce(function(sum, purchase) {
        if(currentDate.year() === moment(purchase.get('date')).year()) {
          return purchase.get('amount') + sum;
        } else {
          return sum;
        }
      }, 0);
    } else if(group === 'week') {
      amount = this.collection.reduce(function(sum, purchase) {
        if(currentDate.week() === moment(purchase.get('date')).week()) {
          return purchase.get('amount') + sum;
        } else {
          return sum;
        }
      }, 0);
    } 
    return Math.floor(amount * 100) / 100;
  }

});

