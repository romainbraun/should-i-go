/*globals FB, module, checkLoginState */
(function () {
	'use strict';
	function statusChangeCallback(response, callback) {
		// console.log('statusChangeCallback');
		// console.log(response);
		if (response.status === 'connected') {
			callback();
		} else if (response.status === 'not_authorized') {
			// console.log('yolo');
			FB.login(function(response) {
			   // console.log(response);
			   callback();
			 }, {scope: 'public_profile, user_events', });
		} else {
			// console.log('yolodouble');
			FB.login(function(response) {
			   // console.log(response);
			   callback();
			 }, {scope: 'public_profile, user_events'});
		}
	}

	function checkLoginState() {
		FB.getLoginStatus(function(response) {
			statusChangeCallback(response);
		});
	}

	module.exports.init = function (callback) {
		FB.getLoginStatus(function(response) {
			statusChangeCallback(response, callback);
		});
	};

	module.exports.getEventInfos = function (eventId, callback) {
		FB.api(
		    "/v2.1/" + eventId + "/attending/?fields=first_name,last_name,picture.height(200).width(200).type(large)",
		    function (response) {
		    	// console.log(response);
			    callback(response);
		    }
		);
	};
})();