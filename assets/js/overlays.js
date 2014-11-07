/*globals require, module, Marka */
(function () {
	'use strict';

	require('./lib/jquery.unveil.js');
	require('./lib/marka.min.js');
	
	var $ = require('jquery');

	/**
	 * Placing the different blocks on the grid depending on the screen size
	 * @return {none}
	 */
	function computePositions(section) {
		var windowWidth	= $(window).width(),
			columns		= Math.ceil(windowWidth / 200),
			rest		= windowWidth % 200,
			itemWidth	= 0,
			itemCount	= 0;

		// Adapting the size of the blocks if the screen size isn't a perfect multiple of 200
		if (rest) {
			itemWidth = Math.floor(windowWidth / columns);
		} else {
			itemWidth = 200;
		}

		$(section + ' .person').each(function (index) {
			itemCount++;
			// Placing blocks
			$(this).css({width: itemWidth, height: itemWidth, left: (index % columns) * itemWidth, top: Math.floor(index / columns) * itemWidth});

			// Adding specific classes if the blocks are on the sides / top / bottom / corners of the grid
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

		// Adding the total height to the container so we can use the body scrolling
		$(section).css({height:Math.ceil(itemCount / columns) * itemWidth});
		
	}

	/**
	 * Creates the back buttons using Marka.js
	 * @return {none}
	 */
	function createButtons() {
		var m = new Marka('.overlay i');
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
	 * Populates the appropriate section with the people
	 * @param  {String} section Identifier for the section
	 * @param  {Array} array   People
	 * @return {none}         
	 */
	function populateSection(section, array) {
		var overlay = document.getElementById(section),
			content = "";

		for (var i = 0, peopleLength = array.length; i < peopleLength; i++) {
			content += '<div class="person"><a href="http://www.facebook.com/' + array[i].id + '" target="_blank"><img src="assets/img/bg.png" data-src="' + array[i].picture.data.url + '"> <div class="person-overlay"><span>' + array[i].first_name + '</span><span>' + array[i].last_name + '</span><hr></div></a></div>';
		}
		overlay.insertAdjacentHTML('beforeend', content);
	}

	/**
	 * "public" function populating the grids with boys and girls
	 * @param  {Object} people
	 * @return {none}
	 */
	module.exports.populate = function (males, females) {
		populateSection('guys-overlay', males);
		populateSection('girls-overlay', females);

		computePositions('#guys-overlay');
		computePositions('#girls-overlay');

		createButtons();

		$(window).resize($.debounce(function resize() {
			computePositions('#guys-overlay');
			computePositions('#girls-overlay');
		}, 500));
	};
})();