var assert = require("assert");
var app = require('../utils.js');

describe('Test', function(){
  describe('getMonth', function(){
    it('should return Oct', function(){
      assert.equal('Oct', app.getMonth(new Date('Thu Oct 16 2014')));
    });
  });
});