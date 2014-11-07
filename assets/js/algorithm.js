/*globals require, module */
(function () {
	'use strict';
	var Utils			= require('./utils.js'),
		$				= require('jquery');

	var femaleTable		= [],
		maleTable		= [],
		femaleNames		= {},
		maleNames		= {},
		femaleCounter	= 0,
		maleCounter		= 0,
		femaleRatio		= 0,
		maleRatio		= 0;

	/**
	 * Fetching JSON files containing male and female names
	 * @param  {Function} callback
	 * @return {none}
	 */
	function getNames(callback) {
		$.getJSON("assets/js/resources/names.males.json", function (data) {
			maleNames = data.males;
			$.getJSON("assets/js/resources/names.females.json", function (data) {
				femaleNames = data.females;
				callback();
			});
		});
	}

	/**
	 * Browsing the list of people invited, normalize their names, and search for correspondance
	 * @param  {Table}   people
	 * @param  {Function} callback
	 * @return {none}
	 */
	function checkRatio(people, callback) {
		var correspondingMaleTable		= "",
			correspondingFemaleTable	= "",
			result						= {};

		for (var i=0, peopleLength = people.length; i < peopleLength; i++) { 
			var personName = Utils.keepFirstName(people[i].first_name);
			//Just keeping the first part of the first name if it's made of more than one name 
			personName					= Utils.removeDiacritics(personName.toUpperCase()); //Getting rid of weird characters. 
			correspondingMaleTable		= maleNames[personName.substring(0,1)];
			correspondingFemaleTable	= femaleNames[personName.substring(0,1)];

			if (Utils.searchForCorrespondance(personName, correspondingMaleTable)) { 
				maleTable.push(people[i]);
			} else if (Utils.searchForCorrespondance(personName, correspondingFemaleTable)) {
				femaleTable.push(people[i]); 
			}
		}

		result.boyCount		= maleTable.length;
		result.girlCount	= femaleTable.length; 
		result.boyPercent	= Math.round(result.boyCount / (result.girlCount + result.boyCount) * 100);
		result.girlPercent	= Math.round(result.girlCount / (result.girlCount + result.boyCount) * 100);
		result.boyCount		= Math.round(result.boyPercent / 100 * people.length);
		result.girlCount	= Math.round(result.girlPercent / 100 * people.length);
		result.boyTable		= maleTable;
		result.girlTable	= femaleTable;

		callback(result);
	}

	/**
	 * "public" function starting the engine
	 * @param  {Table}   people
	 * @param  {Function} callback
	 * @return {none}
	 */
	module.exports.compute = function (people, callback) {

		Utils.prepareDiacritics();

		getNames(function () {
			checkRatio(people, callback);
		});
	};
})();