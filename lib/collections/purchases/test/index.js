var expect = require('chai').expect;

var $ = require('zepto-component');
var moment = require('moment');

describe('purchases-collection', function(){

  var purchases = require('purchases');

  describe('methods', function() {
    beforeEach(function() {
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
      expect(purchases).to.have.length(4);
    });

    it('should return sorted collection by date', function() {
      expect(purchases.first().get('amount')).to.equal(23);
      expect(purchases.last().get('amount')).to.equal(12.43);
    });

  });
});

