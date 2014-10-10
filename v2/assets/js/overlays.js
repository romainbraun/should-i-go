var $ = require('jquery');
require('./jquery.unveil.js');

function computePositions() {
	var windowWidth = $(window).width(),
		columns	= Math.ceil(windowWidth / 320),
		rest = windowWidth % 320,
		itemWidth = 0;

	if (rest) {
		itemWidth = Math.floor(windowWidth / columns);
	} else {
		itemWidth = 320;
	}

	console.log('windowWidth', windowWidth, 'columns', columns, 'rest', rest, 'itemWidth', itemWidth);

	$('.person').each(function (index) {
		$(this).css({width: itemWidth, height: itemWidth, left: (index % columns) * itemWidth, top: Math.floor(index / columns) * itemWidth});
	});

	$('.person img').unveil();
}

module.exports.populate = function (people) {
	// @TODO: Tweak this so it makes the difference between dudes and girls!
	var overlay = document.getElementById('guys-overlay'),
		content = "";
	for (var i = 0, peopleLength = people.length; i < peopleLength; i++) {
		content += '<div class="person"><img src="assets/img/bg.png" data-src="' + people[i].picture.data.url + '"> </div>';
	}
	overlay.insertAdjacentHTML('beforeend', content);

	computePositions();
};