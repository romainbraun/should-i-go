/*globals require, module, Marka */
(function () {
	'use strict';

	require('./lib/jquery.unveil.js');
	require('./lib/marka.min.js');
	
	var $ = require('jquery');

	/**
	 * Placing the different blocks on the grid depending on the screen size
	 * @param  {Int} peopleLength
	 * @return {none}
	 */
	function computePositions(peopleLength) {
		var windowWidth = $(window).width(),
			columns		= Math.ceil(windowWidth / 200),
			rest 		= windowWidth % 200,
			itemWidth 	= 0;

		if (rest) {
			itemWidth = Math.floor(windowWidth / columns);
		} else {
			itemWidth = 200;
		}

		$('.person').each(function (index) {
			console.log(index % columns === columns - 1);
			$(this).css({width: itemWidth, height: itemWidth, left: (index % columns) * itemWidth, top: Math.floor(index / columns) * itemWidth});
			$(this).removeClass('top-transition left-transition right-transition');
			if (Math.floor(index / columns) === 0) {
				$(this).addClass('top-transition');
			} 
			if (index % columns === 0) {
				$(this).addClass('left-transition');
			} else if (index % columns === columns - 1){
				$(this).addClass('right-transition');
			}
		});

		$('.guys-overlay').css({height:Math.floor(peopleLength / columns) * itemWidth});

		$('body').css({overflow:'scroll'});

		$('.person img').unveil(500);
	}

	/**
	 * Creates the back buttons using Marka.js
	 * @return {none}
	 */
	function createButtons() {
		var m = new Marka('.guys-overlay i');
		m.set('times');
		m.rotate('right');
		m.color('#ffffff');
		$('.close').hover(
		function () {
			m.set('chevron');
		},
		function () {
			m.set('times');
		});
	}

	/**
	 * "public" function populating the grids with boys and girls
	 * @param  {Object} people
	 * @return {none}
	 */
	module.exports.populate = function (people) {
		// @TODO: Tweak this so it makes the difference between dudes and girls!
		var overlay = document.getElementById('guys-overlay'),
			content = "";
		for (var i = 0, peopleLength = people.length; i < peopleLength; i++) {
			content += '<div class="person"><a href="http://www.facebook.com/' + people[i].id + '" target="_blank"><img src="assets/img/bg.png" data-src="' + people[i].picture.data.url + '"> <div class="person-overlay"><span>' + people[i].first_name + '</span><span>' + people[i].last_name + '</span><hr></div></a></div>';
		}
		overlay.insertAdjacentHTML('beforeend', content);

		computePositions(peopleLength);

		createButtons();

		$(window).resize($.debounce(function () {computePositions(peopleLength);}, 500));
	};
})();