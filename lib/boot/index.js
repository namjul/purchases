
"use strict";

/**
 * Module dependencies.
 */

var $ = require('zepto-component');
var Backbone = require('backbone');
var reactive = require('reactive');
var purchases = require('purchases');
var categories = require('categories');
var SettingsView = require('settings-view');
var PurchaseEditView = require('purchase-edit-view');
var OverviewView = require('overview-view');
var PurchaseListView = require('purchase-list-view');

/**
 * Set zepto as DOM tool.
 */

Backbone.$ = $;

/**
 * Configure reactive for backbone models and collections.
 */

reactive.subscribe(function(obj, prop, fn){
  if (obj instanceof Backbone.Collection) {
    obj.on('add remove reset change:settings change:' + prop, function () { 
      fn(obj[prop]);
    });
  } else {
    obj.on('change:' + prop, function (m, v) { fn(v); });
  }
});

reactive.unsubscribe(function(obj, prop, fn){
  console.log('unsubscribe');
  if (obj instanceof Backbone.Collection) {
    obj.off('add remove reset change:settings change:' + prop, function () { 
      fn(obj[prop]);
    });
  } else {
    obj.off('change:' + prop, function (m, v) { fn(v); });
  }
});

/**
 * Starting pages.
 */

var overviewView = new OverviewView({collection: purchases});
var purchaseEditView = new PurchaseEditView();
var purchaselistView = new PurchaseListView({collection: purchases, purchaseEditView: purchaseEditView});
var settingsView = new SettingsView();

/**
 * Set click listener.
 */

$('.settings-btn').click(function() {
  settingsView.trigger('open');
});

$('.add-purchase-btn').click(function() {
  purchaseEditView.trigger('open');
});

/**
 * Fetching/Seeding collection 
 */

categories.fetch();
purchases.fetch({reset: true});

/**
 * Create default category.
 */

if(categories.isEmpty()) {
  categories.create({ name: 'Others', default: true}); // creates automatic default category
}

/**
 * Install button/process
 */

if(navigator.mozApps) {

  var request = navigator.mozApps.getSelf();
  request.onsuccess = function() {

    if(request.result) {
      console.log('already installed');
    } else {
      $('.install-btn').addClass('show-install');
      $('.install-btn').on('click', function() {
        installApp();
      });
    }
  };
  request.onerror = function() {
    alert('Error: ', request.error.name);
  };

} else {
  console.log('Open Wen Apps not supported');
}

function installApp() {
  var manifestURL = location.href.substring(0, location.href.lastIndexOf("/")) + "/manifest.webapp";
  var app = navigator.mozApps.install(manifestURL);
  app.onsuccess = function(data) {
    $('.install-btn').removeClass('show-install');
  };
  app.onerror = function() {
    alert("Install failed\n\n:" + app.error.name);
  };
}

function onUpdateReady() {
  var check = confirm('found new verion, should we update?');
  if(check) {
    location.reload(true);
  }
}
window.applicationCache.addEventListener('updateready', onUpdateReady);
