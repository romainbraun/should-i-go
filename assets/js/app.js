/*globals FB, require */
(function () {
	'use strict';
	var	facebookCredentials	= require('./resources/facebookCredentials.json'),
		facebookAPI			= require('./facebook.js'),
		Algorithm			= require('./algorithm.js'),
		Overlays			= require('./overlays.js'),
		Utils				= require('./utils.js'),
		View				= require('./view.js'),
		SVG					= require('./svgHandler.js'),
		$					= require('jquery');

	/**
	 * Called on facebook init
	 * @return {none}
	 */
	function fbLoaded() {
		// First let's see if our user is logged into our app
		facebookAPI.init(fbCallback);
	}

	/**
	 * Callback from fbLoginStatus
	 * @param  {Boolean} connected
	 * @return {none}
	 */
	function fbCallback(connected) {
		if (connected) {
			// If the user is logged in let's switch to step 1
			FB.api('/me', function() {
				View.goTo(1);
				console.log("%cFeel free to fork me on %s!", 'background: #3c9afe; color: #fff', 'https://github.com/romainbraun/should-i-go');
				$('body').addClass('show');
				$('#url-input').focus();
			});
		} else {
			// Otherwise let's show him the login button
			$('body').addClass('show');
		}
	}

	/**
	 * Facebook init
	 * @return {none}
	 */
	window.fbAsyncInit = function() {
		FB.init({
			appId      : facebookCredentials.localAppId,
			cookie     : true,
			xfbml      : true,  
			version    : 'v2.1' 
		});

		fbLoaded();
	};

	/**
	 * Interface binding
	 * @return {none}
	 */
	function bindLinks() {
		// Facebook login
		$('#fb-login').click(function () {
			facebookAPI.showDialog(fbCallback);
		});

		// Compute button
		$('.compute').click(function () {
			var eventId = Utils.getEventId($('input').val());

			if (!eventId) {
				console.log('Please make sure whatever you provided contains the event URL.');
				return;
			}
			
			// Fetching the basic infos from the event (date, name)
			facebookAPI.getEventInfos(eventId, function (response) {
				if(response.error) {
					alert('Please provide a valid Event URL');
					return;
				}
				// Displaying the basic infos and switching to step 2
				View.displayEventInfos(response);
				View.goTo(2);

				// Fetching the people invited to the event 
				facebookAPI.getEventPeople(eventId, function (response) {
					// Computing ratio
					Algorithm.compute(response.data, function (results) {
						//Faking computing time to display the loader
						setTimeout(function () {
							// Displaying the results
							View.goTo(3);
							View.displayRatio(results.boyPercent, results.girlPercent);
							View.displayButtons(results.boyCount, results.girlCount);
							Overlays.populate(results.boyTable, results.girlTable);
						}, 2000);
					});
				});
			});
		});

		$('.see').click(function () {
			View.displayPeople($(this).data('section'));
		});

		$('.overlay .close').click(function() {
			View.hidePeople();
		});

		View.makeFooterButton();
	}

	bindLinks();
	SVG.init();
})();