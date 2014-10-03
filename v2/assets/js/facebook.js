function statusChangeCallback(response, callback) {
	console.log('statusChangeCallback');
	console.log(response);
	if (response.status === 'connected') {
		callback();
	} else if (response.status === 'not_authorized') {
		console.log('yolo');
		FB.login(function(response) {
		   console.log(response);
		 }, {scope: 'public_profile'});
	} else {
		console.log('yolodouble');
		FB.login(function(response) {
		   console.log(response);
		   callback();
		 }, {scope: 'public_profile'});
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
	    "/" + eventId + "/attending/?fields=first_name",
	    function (response) {
		    callback(response);
	    }
	);
};