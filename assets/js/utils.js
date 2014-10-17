/*globals module */
(function () {
	'use strict';
	var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];


	// This is using ECMAScript 5.1's Internationalization API. This will fail on <IE11. And it fails on Node! Let's go with the old fashioned way
	// var formatter = new Intl.DateTimeFormat("en-us", { month: "short" });

	/**
	 * Return a short litteral version of the month from the date provided
	 * @param  {Date} date
	 * @return {String}
	 */
	module.exports.getMonth = function (date) {
		return monthNames[date.getMonth()];
		// return formatter.format(date);
	};

})();