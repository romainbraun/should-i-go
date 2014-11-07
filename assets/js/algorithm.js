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
			var personName = people[i].first_name;
			//Just keeping the first part of the first name if it's made of more than one name
			if (personName.indexOf(' ') > 0) {
				personName = personName.substring(0, personName.indexOf(' '));
			}

			personName					= Utils.removeDiacritics(personName.toUpperCase()); //Getting rid of weird characters.
			correspondingMaleTable		= maleNames[personName.substring(0,1)];
			correspondingFemaleTable	= femaleNames[personName.substring(0,1)];

			if (correspondingMaleTable) {
				if (Utils.searchForCorrespondance(personName, correspondingMaleTable)) {
					maleTable.push(people[i]);
				} else if (Utils.searchForCorrespondance(personName, correspondingFemaleTable)) {
					femaleTable.push(people[i]);
				}
			}
		}

		result.maleCounter		= maleTable.length;
		result.femaleCounter	= femaleTable.length;
		result.maleRatio		= Math.round(maleCounter / (femaleCounter + maleCounter) * 100);
		result.femaleRatio		= Math.round(femaleCounter / (femaleCounter + maleCounter) * 100);
		result.maleCounter		= Math.round(maleRatio / 100 * people.length);
		result.femaleCounter	= Math.round(femaleRatio / 100 * people.length);

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