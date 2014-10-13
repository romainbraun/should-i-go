/*globals FB, module */
(function () {
	'use strict';
	function statusChangeCallback(response, callback) {
		if (response.status === 'connected') {
			callback(true);
		} else if (response.status === 'not_authorized') {
			callback(false);
		} else {
			callback(false);
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

	module.exports.getEventPeople = function (eventId, callback) {
		FB.api(
		    "/v2.1/" + eventId + "/attending/?fields=first_name,last_name,picture.height(200).width(200).type(large)",
		    function (response) {
			    callback(response);
		    }
		);
	};

	module.exports.getEventInfos = function (eventId, callback) {
		FB.api(
		    "/v2.1/" + eventId + "?fields=name,start_time",
		    function (response) {
			    callback(response);
		    }
		);
	};

	module.exports.showDialog = function (callback) {
		FB.login(function(response) {
			console.log(response);
			statusChangeCallback(response, callback);
		}, {scope: 'public_profile, user_events', });
	};
})();