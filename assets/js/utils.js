/*globals module */
(function () {
	'use strict';
	var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

	/**
	 * Return a short litteral version of the month from the date provided
	 * @param  {Date} date
	 * @return {String}
	 */
	module.exports.getMonth = function (date) {
		// I started using ECMAScript 5.1's Intl implementation, but it's not implemented in Node, 
		// making unit tests impossible for this part, unless you have a custom build of node. 
		// So I went the old fashioned way. Hopefully Node will implement this someday!
		return monthNames[date.getMonth()];
	};

	/**
	 * Get event ID from URL provided
	 * @param  {string} url 
	 * @return {string | false}
	 */
	module.exports.getEventId = function (url) {
		var re = /[\D]*([\d]*)/g;
		return re.exec(url)[1] || false;
	};

})();