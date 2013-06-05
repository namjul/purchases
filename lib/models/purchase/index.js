
"use strict";

/**
 * Module dependencies
 */

var Backbone = require('backbone');
var _ = require('underscore');
var Amount = require('amount');

/**
 * Model
 */

var Model = module.exports = Backbone.Model.extend({

  initialize: function() {
    if(!this.get('date')) {
      this.set('date', new Date().valueOf());
    }
    
    this.amount = new Amount(this.get('amount'));

    this.on('modifyAmount', function(value) {
      if(isNaN(value)) {
        if(value === 'del') {
          this.amount.remove();
        } else {
          this.amount.toDecimal();
        }
      } else {
        this.amount.append(value);
      }
      this.set('amount', this.amount.value());
    });

    this.on('change:categoryId', function() {
      this.trigger('change:categoryColor change:categoryName');
    }, this);

  },

  defaults: {
    'amount': 0,
    'categoryId': null,
    'note': '',
    'date': 0,
    'expense': false
  }

});
