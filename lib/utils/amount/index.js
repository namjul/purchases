
"use strict";

/**
 * Module dependencies.
 */

var _ = require('underscore');
var humanize = require('humanize-number');

/**
 * Expose `Amount`.
 */

module.exports = Amount;

/**
 * Initialize a new 'Amount.
 */

function Amount(startValue) {
  this.truncate = 2; 
  this.reset(startValue);
}

Amount.prototype.reset = function(startValue) {
  startValue = startValue || 0;
  this.index = 0;
  this.amount = ['.', '0'];
  this.isDecimal = false;

  startValue = parseFloat(startValue).toString();

  _.each(startValue.split(''), _.bind(function(value) {
    if(value === '.') {
      this.toDecimal();
    } else {
      this.append(value); 
    }
  }, this));
};

Amount.prototype.value = function() {
  return parseFloat(this.amount.join(''));
};

Amount.prototype.format = function(options) {
  options = options || {delimiter: '.', separator: ','}; 
  var format = humanize(this.value(), options);

  var arParts = format.split(options.separator);
  var afterDecimal = (arParts[1] || '').split('');

  if(afterDecimal.length > 2) {
    afterDecimal = afterDecimal.slice(0, 2);
  }

  while (afterDecimal.length < 2) {
    afterDecimal.push('0');
  }

  return arParts[0] + options.separator + afterDecimal.join('');
};

Amount.prototype.toDecimal = function() {
  if(this.index <= _.indexOf(this.amount, '.')) { // prevent double click on decimal
    this.index++;
  }
};

Amount.prototype.append = function(value) {
  if(this.index - _.indexOf(this.amount, '.') !== this.truncate+1) {
    this.amount.splice(this.index, 0, value.toString());
    this.index++;
  }
};

Amount.prototype.remove = function() {
  if(this.index === 0) return;
  this.index--;
  if(this.amount[this.index] !== '.') {
    this.amount.splice(this.index, 1);
  }
};
