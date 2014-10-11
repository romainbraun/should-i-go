/*globals FB, require */
(function () {
	'use strict';
	var facebookAPI 		= require('./facebook.js'),
		facebookCredentials = require('./facebookCredentials.json'),
		SVG 				= require('./svgHandler.js'),
		Overlays 			= require('./overlays.js'),
		Algorithm 			= require('./algorithm.js'),
		$ 					= require('jquery');


	function fbLoaded() {
		facebookAPI.init(function () {
			FB.api('/me', function() {
				$('body').addClass('show');

				console.log("%cThank you for looking into my code, stranger! Unfortunately the javascript is minified. You can get a closer look at how the machine is working on %s. Feel free to fork me!", 'background: #3c9afe; color: #fff', 'https://github.com/romainbraun/should-i-go');



				// for testing purposes
				// setTimeout(function () {
				// 	facebookAPI.getEventInfos(1533621923519547, function (response) {
				// 	console.log(response);
				// 	Overlays.populate(response.data);
				// 	$('.step1').removeClass().addClass('step2');
				// });      	
		  //     }, 1000);
		    });
		});
	}

	window.fbAsyncInit = function() {
		FB.init({
			appId      : facebookCredentials.localAppId,
			cookie     : true,
			xfbml      : true,  
			version    : 'v2.1' 
		});

		fbLoaded();
	};

	$('.compute').click(function () {
		var eventId = $('input').val();

		eventId = eventId.substring(eventId.indexOf('events/')+7);
		eventId = eventId.substring(eventId.indexOf('/'), 0);
		
		facebookAPI.getEventInfos(eventId, function (response) {
			$('.step1').removeClass().addClass('step2');
			setTimeout(function () {
				Algorithm.compute(response.data);
			}, 300);
		});
	});

	SVG.init();
})();