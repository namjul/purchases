"use strict";

/**
 * Module dependencies.
 */

var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('zepto-component');
var Amount = require('amount');
var categories = require('categories');
var CategoryListView = require('category-list-view');
var Purchase = require('purchase');
var purchases = require('purchases');
var moment = require('moment');

/**
 * Initialize a new backbone view.
 */

var PurchaseEditView = module.exports = Backbone.View.extend({

  el: '#purchase-edit-view',

  events: {
    'click #cancel-edit': 'close',
    'click .keypad-key': 'changeModelAmount',
    'click .purchase-btn': 'changePage',
    'click .save-purchase-btn': 'savePurchase',
    'click .remove-purchase-btn': 'removePurchase',
    'blur .purchase-btn.category input': 'blurInput'
  },

  initialize: function(){

    this.categoryListView = new CategoryListView({collection: categories});
    this.$('.view-body-inner').append(this.categoryListView.el);

    this.on('open', this.open, this);

    // show active state on touch
    this.$('.keypad-key').on('touchstart', function(e) {
      $(this).addClass('active');
    }).on('touchmove', function(e) {
      $(this).removeClass('active');
    }).on('touchend', function(e) {
      $(this).removeClass('active');
    });

  },

  blurInput: function(e) {
    $(e.target).attr('readonly', true);
  },

  changeModelAmount: function(event) {
    var targetElement = event.currentTarget;
    var value = $(targetElement).data('value');
    this.model.trigger('modifyAmount', value);
  },

  changePage: function(event) {
    var targetElement = event.currentTarget;
    var $targetElement = $(targetElement);
    if($targetElement.hasClass('active')) {
      return;
    }

    $('.purchase-btn.active').removeClass('active');
    $targetElement.addClass('active');   

    if($targetElement.hasClass('amount')) {
      this.categoryListView.trigger('close');
      this.$('.keypad').show();
      this.$('.purchase-input-wrapper').show();
    } else if($targetElement.hasClass('category')) {
      this.categoryListView.trigger('open');
      this.$('.keypad').hide();
      this.$('.purchase-input-wrapper').hide();
    } 
  },

  savePurchase: function() {
    //set category
    var category = this.model.get('category');
    if(category.isNew()) {
      category.set('name', this.$('.purchase-btn.category input').val());
      categories.create(category);
    }
    this.model.set('categoryId', category.id);
    //set note
    this.model.set('note', this.$('.purchase-btn.note input').val());
    //set usage of category
    this.categoryListView.setUsage();
    //set date
    var date = this.$('.purchase-date').val();
    if(date !== '' && moment(date).isValid()) {
      this.model.set('date', moment(date).valueOf()); 
    }
    //save
    this.model.unset('category',{silent: true});
    purchases.create(this.model);
    this.close();
  },

  removePurchase: function() {
    var check = confirm('Wollen Sie wirklich diese Ausgabe löschen?');
    if(check) {
      this.model.destroy();
      this.close();
    }
  },

  open: function(purchase) {
    //create purchase
    this.model = purchase ? purchase : new Purchase();

    this.listenTo(this.model, 'change:amount', this.changeAmount);
    this.listenTo(this.model, 'change:category', this.changeCategory);

    //change the purchase model in categoryListView
    this.categoryListView.changeModel(this.model);
    //set amount UI to model value
    this.changeAmount();
    //sate date to UI
    if(!this.model.isNew()) {
      this.$('.purchase-date').val(moment(this.model.get('date')).format('LL'));
    }
    
    //open panel
    this.$el.removeClass('view-bottom');
  }, 

  close: function() {
    //remove event handlers from old purchase
    this.stopListening(this.model);
    //reset to activate amount
    this.$('.purchase-btn.amount').trigger('click');
    //reset note
    this.$('.purchase-btn.note input').val('');
    //reset date
    this.$('.purchase-date').val('');
    //close panel
    this.$el.addClass('view-bottom');
  },

  changeAmount: function() {
    this.$('.purchase-btn.amount').text(this.model.amount.format());
  },

  changeCategory: function(model) {
    var category = model.get('category');
    var categoryInput = this.$('.purchase-btn.category input');
    if(category.isNew()) {
      categoryInput.removeAttr('readonly');
      categoryInput.val('');
      categoryInput.focus();
    } else {
      categoryInput.val(category.get('name'));
    }
  }

});

