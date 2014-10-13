/*globals FB, require */
(function () {
	'use strict';
	var	facebookCredentials = require('./resources/facebookCredentials.json'),
		facebookAPI 		= require('./facebook.js'),
		Algorithm 			= require('./algorithm.js'),
		Overlays 			= require('./overlays.js'),
		View				= require('./view.js'),
		SVG 				= require('./svgHandler.js'),
		$ 					= require('jquery');


	function fbLoaded() {

		facebookAPI.init(fbCallback);
	}

	function fbCallback(connected) {
		if (connected) {
			FB.api('/me', function() {
				View.goTo(1);
				console.log("%cThank you for looking into my code, stranger! Feel free to fork me on %s!", 'background: #3c9afe; color: #fff', 'https://github.com/romainbraun/should-i-go');
				$('body').addClass('show');



				// for testing purposes
				// setTimeout(function () {
				// 	facebookAPI.getEventInfos(1533621923519547, function (response) {
				// 	console.log(response);
				// 	Overlays.populate(response.data);
				// 	$('.step1').removeClass().addClass('step2');
				// });      	
		  //     }, 1000);
		    });
		} else {
			$('body').addClass('show');
		}
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

	function bindLinks() {
		$('#fb-login').click(function () {
			facebookAPI.showDialog(fbCallback);
		});

		$('.compute').click(function () {
			var eventId = $('input').val();

			eventId = eventId.substring(eventId.indexOf('events/')+7);
			eventId = eventId.substring(eventId.indexOf('/'), 0);
			
			facebookAPI.getEventInfos(eventId, function (response) {
				View.displayEventInfos(response);
				View.goTo(2);
				// setTimeout(function () {
				// 	Algorithm.compute(response.data);
				// }, 300);
			});
		});
		
	}

	bindLinks();
	SVG.init();
})();