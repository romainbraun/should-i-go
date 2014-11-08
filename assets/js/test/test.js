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

describe('Utils', function(){
  describe('searchForCorrespondance', function(){
    it('should find a correspondance', function(){
      assert.strictEqual(true, utils.searchForCorrespondance('ROMAIN', ['Römaiń', 'Cyril']));
      assert.strictEqual(false, utils.searchForCorrespondance('ROMAINN', ['Römaiń', 'Cyril']));
      assert.strictEqual(false, utils.searchForCorrespondance('ROMINE'));
    });
  });
});

describe('Utils', function(){
  describe('fuzzySearch', function(){
    it('should find a correspondance', function(){
      assert.strictEqual("male", utils.fuzzySearch('ROMAIN', ['ROMAIN', 'Cyril'], ['ROMAINE', 'Cyrille']));
      assert.strictEqual(false, utils.fuzzySearch('ROMAINN', ['ROMAIN', 'Cyril'], ['ROMAINE', 'Cyrille']));
      assert.strictEqual("female", utils.fuzzySearch('ROMINE', ['ROMAIN', 'Cyril'], ['ROMAINE', 'Cyrille']));
    });
  });
});

describe('Utils', function(){
  describe('keepFirstName', function(){
    it('should keep the first part of the name', function(){
      assert.strictEqual("Jean", utils.keepFirstName('Jean'));
      assert.strictEqual("Jean", utils.keepFirstName('Jean Christophe'));
      assert.strictEqual("Jean", utils.keepFirstName('Jean Christophe machin'));
    });
  });
});

describe('Utils', function(){
  describe('computeRatio', function(){
    it('should return an adequate ratio', function(){
      assert.deepEqual({boyCount:1, girlCount:1, boyPercent: 50, girlPercent: 50, boyTable: ['Dude1'], girlTable:['girl1']}, utils.computeRatio(['Dude1'], ['girl1'],2));
    });
  });
});