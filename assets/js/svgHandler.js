/*globals require, module */
(function () {
	'use strict';
	var $ = require('jquery');

	function replaceAllSVGs() {
		$('img.svg').each(function(){
			var $img = $(this),
				imgID = $img.attr('id'),
				imgClass = $img.attr('class'),
				imgURL = $img.attr('src');

			$.get(imgURL, function(data) {
			// Get the SVG tag, ignore the rest
			var $svg = $(data).find('svg');

			// Add replaced image's ID to the new SVG
			if(typeof imgID !== 'undefined') {
			    $svg = $svg.attr('id', imgID);
			}
			// Add replaced image's classes to the new SVG
			if(typeof imgClass !== 'undefined') {
			    $svg = $svg.attr('class', imgClass+' replaced-svg');
			}

			// Remove any invalid XML tags as per http://validator.w3.org
			$svg = $svg.removeAttr('xmlns:a');

			// Replace image with new SVG
			$img.replaceWith($svg);

			}, 'xml');

		});
	}

	module.exports.init = function () {
		replaceAllSVGs();
	};
})();