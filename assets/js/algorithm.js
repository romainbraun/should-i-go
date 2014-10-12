/*globals require, module */
(function () {
	'use strict';
	var $				= require('jquery'),
		maleNames		= {},
		femaleNames		= {},
		diacriticsTable	= require('./resources/diacritics.json'),
		diacriticsMap	= {},
		maleCounter		= 0,
		femaleCounter	= 0,
		totalCounter	= 0,
		maleFuzzy		= null,
		femaleFuzzy		= null,
		FuzzySet		= require('./fuzzyset.js'),
		peopleTable		= [];


	function prepareDiacritics() {
		for (var i=0; i < diacriticsTable.length; i++){
			var letters = diacriticsTable[i].letters.split("");
			for (var j=0; j < letters.length ; j++){
				diacriticsMap[letters[j]] = diacriticsTable[i].base;
			}
		}
	}

	// "what?" version ... http://jsperf.com/diacritics/12
	// Might be a slightly faster version with a newer revision. We're talking milliseconds though.
	function removeDiacritics (str) {
		return str.replace(/[^\u0000-\u007E]/g, function(a){
			return diacriticsMap[a] || a;
		});
	}

	function getNames(callback) {
		$.getJSON("assets/js/resources/names.males.json", function (data) {
			maleNames = data.males;
			$.getJSON("assets/js/resources/names.females.json", function (data) {
				femaleNames = data.females;
				callback();
			});
		});
	}

	function searchForCorrespondance(i, correspondingTable) {
		for (var j=0, length = correspondingTable.length; j < length; j++) {
			totalCounter++;
			if (peopleTable[i].first_name === removeDiacritics(correspondingTable[j].toUpperCase())) {
				return true;
			}
		}
		return false;
	}

	function checkRatio(people) {
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
			peopleTable[i].first_name	= removeDiacritics(peopleTable[i].first_name.toUpperCase()); //Getting rid of weird characters.
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
		console.log(maleCounter, "males", femaleCounter, "females");
		console.log("total iterations :",totalCounter);
		console.log('success :',femaleCounter+maleCounter,'people identified out of',people.length,":",(femaleCounter+maleCounter)*100/peopleLength,"% success,",peopleLength-(femaleCounter+maleCounter),"unidentified weirdos");
		// console.log("weird guys", weirdGuys);
		// displayResults();
	}

	module.exports.compute = function (people) {

		prepareDiacritics();

		getNames(function () {
			checkRatio(people);
		});
	};
})();