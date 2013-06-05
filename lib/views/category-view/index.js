
"use strict";

/**
 * Module dependencies.
 */

var Backbone = require('backbone');
var _ = require('underscore');
var reactive = require('reactive');
var purchases = require('purchases');
var gesture = require('gesture');

/**
 * Initialize a new backbone view.
 */

var CategoryView = module.exports = Backbone.View.extend({

  tagName: 'li',

  className: 'category-view',

  template: _.template(require('./template')),

  events: {
    'click a': 'selected'
  },

  initialize: function(options){
    this.parentView = options.parentView;
    this.listenTo(this.model, 'destroy', this.remove);

    var categoryView = gesture(this.$el[0]);
    //this.$el.on('dragend', _.bind(function(e){
    categoryView.on('hold', _.bind(function(e) {
      this.destroy();
    }, this));
  },

  destroy: function() {
    if(this.collection.length > 1 && !this.model.get('default')) {
      var check = confirm("Wollen Sie die Kategorie " + this.model.get('name')  + " wirklich löschen?");
      if(check) {
        this.model.destroy();      
      }
    }
  },

  render: function() {
    this.$el.html(this.template());
    reactive(this.$el[0], this.model, this);
    return this;
  },

  selected: function(e) {
    this.parentView.trigger('change:selection', this.model);
    e.preventDefault();
  },

  name: function() {
    return this.model.get('name');
  },

  color: function() {
    return this.model.get('color');
  }

});


