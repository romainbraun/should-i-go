/*globals require, module */
(function () {
	'use strict';
	var $ 				= require('jquery'),
		maleNames 		= {},
		femaleNames 	= {},
		diacriticsTable = require('./resources/diacritics.json'),
		diacriticsMap 	= {},
		maleCounter 	= 0,
		femaleCounter 	= 0,
		totalCounter 	= 0,
		maleFuzzy 		= null,
		femaleFuzzy 	= null,
		FuzzySet		= require('./fuzzyset.js');


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

	function checkRatio(people) {
		var correspondingMaleTable 		= "",
			correspondingFemaleTable 	= "",
			maleFound 					= false,
			femaleFound 				= false,
			maleFuzzyResult				= 0,
			femaleFuzzyResult			= 0;

		for (var i=0, peopleLength = people.length; i < peopleLength; i++) {
			//Just keeping the first part of the first name if it's made of more than one name
			if (people[i].first_name.indexOf(' ') > 0) {
				people[i].first_name = people[i].first_name.substring(0, people[i].first_name.indexOf(' '));
			}
			maleFound 					= false;
			femaleFound 				= false;
			people[i].first_name 		= removeDiacritics(people[i].first_name.toUpperCase()); //Getting rid of weird characters.
			correspondingMaleTable 		= maleNames[people[i].first_name.substring(0,1)];
			correspondingFemaleTable 	= femaleNames[people[i].first_name.substring(0,1)];

			if (correspondingMaleTable) {
				for (var j=0, malesLength = correspondingMaleTable.length; j < malesLength; j++) {
					if (people[i].first_name === removeDiacritics(correspondingMaleTable[j].toUpperCase())) {
						maleCounter++;
						maleFound = true;
						break;
					}
					totalCounter++;
				}
				if (!maleFound) {
					for (var k=0, femalesLength = correspondingFemaleTable.length; k < femalesLength; k++) {
						if (people[i].first_name === removeDiacritics(correspondingFemaleTable[k].toUpperCase())) {
							femaleCounter++;
							femaleFound = true;
							break;
						}
						totalCounter++;
					}
					if (!femaleFound) {
						maleFuzzy = new FuzzySet(correspondingMaleTable);
						femaleFuzzy = new FuzzySet(correspondingFemaleTable);
						femaleFuzzyResult = femaleFuzzy.get(people[i].first_name)[0][0];
						maleFuzzyResult = maleFuzzy.get(people[i].first_name)[0][0];
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