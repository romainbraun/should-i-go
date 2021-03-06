/*globals require, module */
(function () {
	'use strict';
	var Utils	= require('./utils.js'),
		$		= require('jquery');

	var femaleTable					= [],
		maleTable					= [],
		femaleNames					= {},
		maleNames					= {},
		correspondingMaleTable		= [],
		correspondingFemaleTable	= [],
		result						= {};

	/**
	 * Fetching JSON files containing male and female names
	 * @param  {Function} callback
	 * @return {none}
	 */
	function getNames(callback) {
		if($.isEmptyObject(maleNames)) {
			$.getJSON("assets/js/resources/names.males.json", function (data) {
				maleNames = data.males;
				$.getJSON("assets/js/resources/names.females.json", function (data) {
					femaleNames = data.females;
					callback();
				});
			});
		} else {
			callback();
		}
	}

	/**
	 * Browsing the list of people invited, normalize their names, and search for correspondance
	 * @param  {Table}   people
	 * @param  {Function} callback
	 * @return {none}
	 */
	function checkRatio(people, callback) {
		for (var i=0, peopleLength = people.length; i < peopleLength; i++) { 
			var personName = Utils.keepFirstName(people[i].first_name), //Just keeping the first part of the first name if it's made of more than one name 
				isMale,
				isFemale;
			
			personName	= Utils.removeDiacritics(personName.toUpperCase()); //Getting rid of weird characters. 
			correspondingMaleTable	= maleNames[personName.substring(0,1)];
			correspondingFemaleTable = femaleNames[personName.substring(0,1)];
			

			isMale = Utils.searchForCorrespondance(personName, correspondingMaleTable);
			isFemale = Utils.searchForCorrespondance(personName, correspondingFemaleTable);
			if (isMale && !isFemale) {
				maleTable.push(people[i]);
			} else if (isFemale && !isMale) {
				femaleTable.push(people[i]);
			}
			// if (Utils.searchForCorrespondance(personName, correspondingMaleTable)) { 
			// 	maleTable.push(people[i]);
			// } else if (Utils.searchForCorrespondance(personName, correspondingFemaleTable)) {
			// 	femaleTable.push(people[i]); 
			// }
		}

		result = Utils.computeRatio(maleTable, femaleTable, peopleLength);

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