var assert = require("assert");
var utils = require('../utils.js');

describe('Utils', function(){
  describe('getMonth', function(){
    it('should return Oct', function(){
      assert.strictEqual('Oct', utils.getMonth(new Date('Thu Oct 16 2014')));
    });
  });
});

describe('Utils', function(){
  describe('getEventId', function(){
    it('should return the event ID', function(){
    	assert.strictEqual(false, utils.getEventId());
    	assert.strictEqual(false, utils.getEventId(''));
    	assert.strictEqual('736749926396099', utils.getEventId('736749926396099'));
    	assert.strictEqual('736749926396099', utils.getEventId('736749926396099/'));
    	assert.strictEqual('736749926396099', utils.getEventId('/736749926396099/'));
    	assert.strictEqual('736749926396099', utils.getEventId('/736749926396099'));
    	assert.strictEqual('736749926396099', utils.getEventId('/events/736749926396099'));
    	assert.strictEqual('736749926396099', utils.getEventId('/events/736749926396099/'));
    	assert.strictEqual('736749926396099', utils.getEventId('events/736749926396099/'));
    	assert.strictEqual('736749926396099', utils.getEventId('736749926396099/?sid_reminder=7661468456239235072'));
      	assert.strictEqual('736749926396099', utils.getEventId('https://www.facebook.com/events/736749926396099/?sid_reminder=7661468456239235072'));
    });
  });
});

describe('Utils', function(){
  describe('removeDiacritics', function(){
  	utils.prepareDiacritics();
    it('should return a normalized string', function(){
      assert.strictEqual('Romain', utils.removeDiacritics('Römáìñ'));
    });
  });
});