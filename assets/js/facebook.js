/*globals FB, module */
(function () {
	'use strict';

	/**
	 * Callback on facebook status change
	 * @param  {Object}   response
	 * @param  {Function} callback
	 * @return {none}
	 */
	function statusChangeCallback(response, callback) {
		if (response.status === 'connected') {
			callback(true);
		} else if (response.status === 'not_authorized') {
			callback(false);
		} else {
			callback(false);
		}
	}

	/**
	 * Checking user facebook status
	 * @param  {Function} callback
	 * @return {none}
	 */
	module.exports.init = function (callback) {
		FB.getLoginStatus(function(response) {
			statusChangeCallback(response, callback);
		});
	};

	/**
	 * Fetching people invited to the event
	 * @param  {Int}   eventId
	 * @param  {Function} callback
	 * @return {none}
	 */
	module.exports.getEventPeople = function (eventId, callback) {
		FB.api(
			"/v2.1/" + eventId + "/attending/?fields=first_name,last_name,picture.height(200).width(200).type(large)",
			function (response) {
				callback(response);
			}
		);
	};

	/**
	 * Fetching basic event infos
	 * @param  {Int}   eventId
	 * @param  {Function} callback
	 * @return {none}
	 */
	module.exports.getEventInfos = function (eventId, callback) {
		FB.api(
			"/v2.1/" + eventId + "?fields=name,start_time",
			function (response) {
				callback(response);
			}
		);
	};

	/**
	 * Displaying the facebook login dialog
	 * @param  {Function} callback
	 * @return {none}
	 */
	module.exports.showDialog = function (callback) {
		FB.login(function(response) {
			console.log(response);
			statusChangeCallback(response, callback);
		}, {scope: 'public_profile, user_events', });
	};
})();