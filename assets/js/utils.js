/*globals module */
(function () {
	'use strict';

	// This is using ECMAScript 5.1's Internationalization API. This will fail on <IE11
	var formatter = new Intl.DateTimeFormat("en-us", { month: "short" });

	module.exports.getMonth = function (date) {
		return formatter.format(date);
	};

})();