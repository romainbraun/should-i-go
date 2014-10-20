/*globals require, module */
(function () {
	'use strict';
	var FuzzySet		= require('./lib/fuzzyset.js'),
		Utils			= require('./utils.js'),
		$				= require('jquery');

	var femaleCounter	= 0,
		totalCounter	= 0,
		femaleNames		= {},
		maleCounter		= 0,
		femaleFuzzy		= null,
		peopleTable		= [],
		maleNames		= {},
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
	 * Looking for a match in the appropriate table (male or female)
	 * @param  {Int} i
	 * @param  {Table} correspondingTable
	 * @return {Boolean}
	 */
	function searchForCorrespondance(i, correspondingTable) {
		for (var j=0, length = correspondingTable.length; j < length; j++) {
			totalCounter++;
			if (peopleTable[i].first_name === Utils.removeDiacritics(correspondingTable[j].toUpperCase())) {
				return true;
			}
		}
		return false;
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
			
		peopleTable	= people;

		for (var i=0, peopleLength = peopleTable.length; i < peopleLength; i++) {
			//Just keeping the first part of the first name if it's made of more than one name
			if (peopleTable[i].first_name.indexOf(' ') > 0) {
				peopleTable[i].first_name = peopleTable[i].first_name.substring(0, peopleTable[i].first_name.indexOf(' '));
			}
			maleFound					= false;
			femaleFound					= false;
			peopleTable[i].first_name	= Utils.removeDiacritics(peopleTable[i].first_name.toUpperCase()); //Getting rid of weird characters.
			correspondingMaleTable		= maleNames[peopleTable[i].first_name.substring(0,1)];
			correspondingFemaleTable	= femaleNames[peopleTable[i].first_name.substring(0,1)];

			if (correspondingMaleTable) {
				maleFound = searchForCorrespondance(i, correspondingMaleTable, maleCounter, maleFound);
				if (maleFound) {
					maleCounter++;
				} else {
					femaleFound = searchForCorrespondance(i, correspondingFemaleTable, femaleCounter, femaleFound);
					if (femaleFound) {
						femaleCounter++;
					} else {
						maleFuzzy = new FuzzySet(correspondingMaleTable);
						femaleFuzzy = new FuzzySet(correspondingFemaleTable);
						femaleFuzzyResult = femaleFuzzy.get(peopleTable[i].first_name)[0][0];
						maleFuzzyResult = maleFuzzy.get(peopleTable[i].first_name)[0][0];
						if (maleFuzzyResult > femaleFuzzyResult && maleFuzzyResult > 1) {
							maleCounter++;
						} else if (femaleFuzzyResult > maleFuzzyResult && femaleFuzzyResult > 1) {
							femaleCounter++;
						}
					}
				}
			}
		}

		callback(
			Math.round(maleCounter / (femaleCounter + maleCounter) * 100), 
			Math.round(femaleCounter / (femaleCounter + maleCounter) * 100),
			maleCounter,
			femaleCounter
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