
"use strict";

/**
 * Model dependencies.
 */

var Backbone = require('backbone');

/**
 * Model
 */

var Model = module.exports = Backbone.Model.extend( {

  initialize: function() {
    if(!this.get('color')) {
      // color functions invalid!!! change!
      this.set('color', get_random_color());
    }
    this.on('usage:increase', this.increaseUsage);
    this.on('usage:decrease', this.decreaseUsage);
  },
  
  defaults: {
    'name': '',
    'color': null,
    'usage': 0,
    'default': false
  },
  
  increaseUsage: function() {
    this.set('usage', this.get('usage') + 1);
    this.save();
  },

  decreaseUsage: function() {
    this.set('usage', this.get('usage') - 1);
    this.save();
  }
});

function get_random_color() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.round(Math.random() * 15)];
    }
    return color;
}

function getRandColor(brightness){
  //6 levels of brightness from 0 to 5, 0 being the darkest
  var rgb = [Math.random() * 256, Math.random() * 256, Math.random() * 256];
  var mix = [brightness*51, brightness*51, brightness*51]; //51 => 255/5
  var mixedrgb = [rgb[0] + mix[0], rgb[1] + mix[1], rgb[2] + mix[2]].map(function(x){ return Math.round(x/2.0);});
  return "rgb(" + mixedrgb.join(",") + ")";
}

/**
 * This function generates vibrant, "evenly spaced" colours (i.e. no clustering). This is ideal for creating easily distiguishable vibrant markers in Google Maps and other apps.
 * Adam Cole, 2011-Sept-14
 * HSV to RBG adapted from: http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
 */

function rainbow(numOfSteps, step) {
    var r, g, b;
    var h = step / numOfSteps;
    var i = ~~(h * 6);
    var f = h * 6 - i;
    var q = 1 - f;
    switch(i % 6){
        case 0: r = 1, g = f, b = 0; break;
        case 1: r = q, g = 1, b = 0; break;
        case 2: r = 0, g = 1, b = f; break;
        case 3: r = 0, g = q, b = 1; break;
        case 4: r = f, g = 0, b = 1; break;
        case 5: r = 1, g = 0, b = q; break;
    }
    var c = "#" + ("00" + (~ ~(r * 255)).toString(16)).slice(-2) + ("00" + (~ ~(g * 255)).toString(16)).slice(-2) + ("00" + (~ ~(b * 255)).toString(16)).slice(-2);
    return (c);
}
