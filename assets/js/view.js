/*globals module */
(function () {
	'use strict';

	var Utils	= require('./utils.js'),
		$		= require('jquery');

	module.exports.goTo = function (step) {
		$('.step' + (step - 1)).removeClass().addClass('step' + step);
	};

	module.exports.displayEventInfos = function (infos) {
		var date = new Date(infos.start_time);
		$('.event-date .month').html(Utils.getMonth(date));
		$('.event-date .day').html(date.getDate());
		$('.event-name').html(infos.name);
	};

})();