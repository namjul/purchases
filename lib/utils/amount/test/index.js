var expect = require('chai').expect;

describe('amount', function(){

  var Amount = require('amount');

  describe('methods', function() {

    it('should return 0', function(){
      var amount = new Amount();
      expect(amount.value()).to.equal(0);
    });

    it('should return 123.58', function() {
      var amount = new Amount();
      amount.append('1');
      amount.append(2);
      amount.append('3');
      amount.toDecimal();
      amount.append('5');
      amount.append(8);
      expect(amount.value()).to.equal(123.58);
    });

    it('should return first 83.23 then 8', function() {
      var amount = new Amount();
      amount.append(8);
      amount.append(3);
      amount.append(2);
      amount.append(3);
      amount.remove();
      amount.remove();
      amount.remove();
      expect(amount.value()).to.equal(8);
    });

    it('should return 0.234', function() {
      var amount = new Amount();
      amount.toDecimal();
      amount.append(2);
      amount.append(3);
      amount.append(4);
      expect(amount.value()).to.equal(0.23);
      amount.remove();
      amount.remove();
      amount.remove();
      expect(amount.value()).to.equal(0);
    });

    it('should return first 22.245 then 0', function() {
      var amount = new Amount();
      amount.append(2);
      amount.append(2);
      amount.toDecimal();
      amount.append(2);
      amount.append(4);
      amount.append(5);
      expect(amount.value()).to.equal(22.24);
      amount.remove();
      amount.remove();
      amount.remove();
      amount.remove();
      amount.remove();
      amount.remove();
      amount.remove();
      amount.remove();
      amount.remove();
      expect(amount.value()).to.equal(0);
    });

    it('should return 1,12', function() {
      var amount = new Amount();
      amount.append(1);
      amount.toDecimal();
      amount.toDecimal();
      amount.append(1);
      amount.append(2);
      amount.append(0);
      amount.append(1);
      expect(amount.format()).to.equal('1,12');
      expect(amount.value()).to.equal(1.12);
    });

    it('should return 0,00', function() {
      var amount = new Amount();
      expect(amount.format()).to.equal('0,00');
    });
  });
});
