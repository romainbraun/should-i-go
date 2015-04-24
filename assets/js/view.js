/*globals module */
(function () {
	'use strict';

	require('./lib/marka.min.js');

	var Utils	= require('./utils.js'),
		raf		= require('raf'),
		$		= require('jquery');

	var percentAnimation	= null,
		percentIncrement	= 0,
		percentDuration		= 120, //Duration of the animation in frames
		boyPercent			= 0,
		girlPercent			= 0;

	/**
	 * rAF animation function. Increments the ratio of boys and girls
	 * @return {none}
	 */
	function animatePercent() {
		percentIncrement++;
		$('.boyPercent').html(Math.round(boyPercent * (percentIncrement / percentDuration)) + '%');
		$('.girlPercent').html(Math.round(girlPercent * (percentIncrement / percentDuration)) + '%');
		if (percentIncrement === percentDuration) {
			raf.cancel(animatePercent);
		} else {
			raf(animatePercent);
		}
	}

	/**
	 * View "controller". Switches from one step to the next one
	 * @param  {Int} step
	 * @return {none}
	 */
	module.exports.goTo = function (step) {
		$('.step' + (step - 1)).removeClass().addClass('step' + step);
	};

	/**
	 * Displays the event basic infos
	 * @param  {Object} infos
	 * @return {none}
	 */
	module.exports.displayEventInfos = function (infos) {
		var date = new Date(infos.start_time);
		$('.event-date .month').html(Utils.getMonth(date));
		$('.event-date .day').html(date.getDate());
		$('.event-name').html(infos.name);
	};

	/**
	 * Starts the ratio animation
	 * @param  {Int} boys
	 * @param  {Int} girls
	 * @return {none}
	 */
	module.exports.displayRatio = function (boys, girls) {
		boyPercent = boys;
		girlPercent = girls;
		// Animating the result with requestAnimationFrame
		percentAnimation = raf(animatePercent);
	};

	/**
	 * Insert boy/girl count in the appropriate UI buttons
	 * @param  {Int} boys
	 * @param  {Int} girls
	 * @return {none}
	 */
	module.exports.displayButtons = function (boys, girls) {
		$('.see-girls').html(girls + " chicks");
		$('.see-guys').html(boys + " guys");
	};

	module.exports.displayPeople = function (section) {
		$(section).addClass('show');

		// Enabling body scrolling
		$('body').css({overflow:'scroll'});

		// Enabling lazy loading
		$('.person img').unveil(500, function () {
			$(this).load(function () {
				$(this).addClass('show');
			});
		});
	};

	module.exports.hidePeople = function () {
		$('.overlay').removeClass('show');

		// Disabling body scrolling
		$('body').css({overflow:'hidden'});
	};

	/**
	 * Creates the footer button using Marka.js
	 * @return {none}
	 */
	module.exports.makeFooterButton = function () {	
		var m = new Marka('.footer i');
		m.set('chevron');
		m.rotate('up');
		m.color('#ffffff');
		$('.footer').hover(
		function () {
			m.rotate('down');
		},
		function () {
			m.rotate('up');
		});
	};

})();