/*globals require, module */
(function () {
	'use strict';
	var FuzzySet		= require('./lib/fuzzyset.js'),
		Utils			= require('./utils.js'),
		$				= require('jquery');

	var femaleTable		= [],
		maleTable		= [],
		femaleNames		= {},
		maleNames		= {},
		femaleCounter 	= 0,
		maleCounter		= 0,
		femaleFuzzy		= null,
		maleFuzzy		= null;

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
			maleFound					= false,
			femaleFound					= false,
			maleFuzzyResult				= 0,
			femaleFuzzyResult			= 0;

		for (var i=0, peopleLength = people.length; i < peopleLength; i++) {
			var personName = people[i].first_name;
			//Just keeping the first part of the first name if it's made of more than one name
			if (personName.indexOf(' ') > 0) {
				personName = personName.substring(0, personName.indexOf(' '));
			}

			personName					= Utils.removeDiacritics(personName.toUpperCase()); //Getting rid of weird characters.
			maleFound					= false;
			femaleFound					= false;
			correspondingMaleTable		= maleNames[personName.substring(0,1)];
			correspondingFemaleTable	= femaleNames[personName.substring(0,1)];

			if (correspondingMaleTable) {
				maleFound = Utils.searchForCorrespondance(personName, correspondingMaleTable);
				if (maleFound) {
					maleTable.push(people[i]);
				} else {
					femaleFound = Utils.searchForCorrespondance(personName, correspondingFemaleTable);
					if (femaleFound) {
						femaleTable.push(people[i]);
					} else {
						maleFuzzy = new FuzzySet(correspondingMaleTable);
						femaleFuzzy = new FuzzySet(correspondingFemaleTable);
						femaleFuzzyResult = femaleFuzzy.get(personName)[0][0];
						maleFuzzyResult = maleFuzzy.get(personName)[0][0];
						if (maleFuzzyResult > femaleFuzzyResult && maleFuzzyResult > 1) {
							maleTable.push(people[i]);
						} else if (femaleFuzzyResult > maleFuzzyResult && femaleFuzzyResult > 1) {
							femaleTable.push(people[i]);
						}
					}
				}
			}
		}

		maleCounter = maleTable.length;
		femaleCounter = femaleTable.length;

		callback(
			Math.round(maleCounter / (femaleCounter + maleCounter) * 100), 
			Math.round(femaleCounter / (femaleCounter + maleCounter) * 100),
			maleCounter,
			femaleCounter,
			maleTable,
			femaleTable
		);
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