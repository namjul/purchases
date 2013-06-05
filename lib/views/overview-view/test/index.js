var assert = require('chai').assert;

var $ = require('zepto-component');
var moment = require('moment');

describe('overview-view', function(){

  var OverviewView = require('overview-view');
  var purchases = require('purchases');

  describe('methods', function() {
    beforeEach(function() {
      this.view = new OverviewView({collection: purchases, el: document.querySelector('div')});
      purchases.reset([
        {
          'amount': 43,
          'categoryId': 0,
          'note': 'note1',
          'date': moment('2013-03-20'),
          'color': '#f4f4f4'
        },
        {
          'amount': 12.43,
          'categoryId': 0,
          'note': 'note2',
          'date': moment('2012-11-01'),
          'color': '#f4f4f4'
        },
        {
          'amount': 93,
          'categoryId': 0,
          'note': 'note3',
          'date': moment('2013-03-11'),
          'color': '#f4f4f4'
        },
        {
          'amount': 23,
          'categoryId': 0,
          'note': 'note4',
          'date': moment('2013-05-11'),
          'color': '#f4f4f4'
        }
      ]);
    });

    it('should return 4 ', function(){
      assert.equal(4, this.view.haspurchases());
    });

    it('should calculate amount by month', function() {
      assert.equal(136, this.view.calculateAmount('month', moment('2013-03-15')));
    });

    it('should calculate amount by year', function() {
      assert.equal(12.43, this.view.calculateAmount('year', moment('2012-03-15')));
    });

    it('should calculate amount by week', function() {
      assert.equal(93, this.view.calculateAmount('week', moment('2013-03-16')));
    });

  });
});
