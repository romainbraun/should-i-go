var facebookAPI = require('./facebook.js');
var facebookCredentials = require('./facebookCredentials.json');
var $ = require('jquery');


function fbLoaded() {
	facebookAPI.init(function () {
		FB.api('/me', function(response) {
	      console.log('Successful login for: ' + response.name);
	      $('body').addClass('show');
	    });
	});
}

window.fbAsyncInit = function() {
	FB.init({
		appId      : facebookCredentials.testAppId,
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
		console.log(response);
		$('.step1').removeClass().addClass('step2');
	});
});

