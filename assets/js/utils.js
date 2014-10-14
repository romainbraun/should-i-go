/*globals module */
(function () {
	'use strict';

	// This is using ECMAScript 5.1's Internationalization API. This will fail on <IE11
	var formatter = new Intl.DateTimeFormat("en-us", { month: "short" });

	/**
	 * Return a short litteral version of the month from the date provided
	 * @param  {Date} date
	 * @return {String}
	 */
	module.exports.getMonth = function (date) {
		return formatter.format(date);
	};

})();