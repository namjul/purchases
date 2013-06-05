
"use strict";

/**
 * Module dependencies.
 */

var Backbone = require('backbone');
var _ = require('underscore');
var CategoryView = require('category-view');
var Category = require('category');
var purchases = require('purchases');

/**
 * Initialize a new backbone view.
 */

var CategoryListView = module.exports = Backbone.View.extend({

  tagName: 'ul',

  className: 'category-list-view hide',

  template: _.template(require('./template')),

  attributes: {
    'data-type': 'list'
  },

  events: {
    'click li.new-category': 'newCategory'
  },

  initialize: function(){
    this.listenTo(this, 'open', this.open);
    this.listenTo(this, 'close', this.close);
    this.listenTo(this.collection, 'reset', this.renderList);
    this.listenTo(this.collection, 'add', this.renderCategory);
    this.listenTo(this, 'change:selection', this.select);
    this.listenTo(this.collection, 'remove', this.categoryRemoved);
    this.render();
  },

  changeModel: function(model) {
    this.model = model;
    
    if(this.model.isNew()) {
      this.select(this.collection.getMostUsed());
    } else {
      this.select(this.collection.get(this.model.get('categoryId')), true);
    }
  },

  render: function() {
    this.$el.html(this.template());
    return this;
  },

  renderList: function() {
    this.collection.each(this.renderCategory, this);
  },

  renderCategory: function(model) {
    this.$el.prepend((new CategoryView({ collection: this.collection, model: model, parentView: this })).render().el);
  },

  select: function(category, hasCategory) {
    if(hasCategory) {
      this.originalCategory = category;
    }
    this.model.set('category', category);
  },

  newCategory: function(e) {
    this.model.set('category', new Category());
    e.preventDefault();
  },

  categoryRemoved: function(category) {
    if(_.isEqual(this.originalCategory, category)) {
      this.originalCategory = null;
    }

    purchases.each(_.bind(function(purchase) {
      if(purchase.get('categoryId') === category.id) {
        var newCategory = this.collection.findWhere({default: true});
        purchase.set('categoryId', newCategory.id);
        if(_.isEqual(purchase, this.model)) {
          this.originalCategory = newCategory;
          var tempCat = this.model.get('category');
          purchase.unset('category', {silent: true});
          purchase.save();
          this.model.set('category', tempCat);
        } else {
          purchase.save();
        }
        newCategory.trigger('usage:increase');
      } 
    }, this));

    if(_.isEqual(this.model.get('category'), category)) {
      this.model.set('category', this.collection.findWhere({default: true}));
    }
  },

  setUsage: function() {
    if(this.originalCategory) {
      if(!_.isEqual(this.model.get('category'), this.originalCategory)) {
        this.originalCategory.trigger('usage:decrease');
        this.model.get('category').trigger('usage:increase');
      }
    } else {
      this.model.get('category').trigger('usage:increase');
    }
  },
   
  open: function() {
    this.$el.removeClass('hide');
  },

  close: function() {
    this.$el.addClass('hide');
  }

});

