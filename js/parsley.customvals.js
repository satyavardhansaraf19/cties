window.ParsleyConfig = {
	validators: {
		notallowedcombo: {
			fn: function (value, requirements) {
				// passed if value submitted not part of validation
				// i.e. data-parsley-notallowedcombo='["annual_trip", "neq", "[name=\"_DTA_DESTINATION_\"]:checked", "aeae6488-662f-4a5c-9c2d-a2e4003f7a86"]'
				if (value !== requirements[0]) return true;
				switch( requirements[1] ) {
					case "eq":
						// If values match then fail validation
						if ($(requirements[2]).val() === requirements[3]) return false;						
						break;
					case "neq":
						// If values dont match then fail validation
						if ($(requirements[2]).val() !== requirements[3]) return false;						
						break;
				}
				return true;
			},
			priority: 32
		},		
		leasttwowords: {
			fn: function (value, unused) {
				// Split valid and check if two workds or more
				if ($.trim(value).split(/\s/).length < 2) {
					return false;
				}
				return true;
			},
			priority: 32
		},
		creditcard: {
			fn: function (value, cctype) {
				// No card set then exit
				if (!cctype) return false;

				// Globally defined list of card for validation				
			    creditCardList = [
			        //type      prefix   length
					["amex",    "3",    15],
					["diners",  "3",    14],
					["diners",  "3",    15],
					["diners",  "3",    16],
					["diners",  "3",    17],
					["diners",  "3",    18],
					["diners",  "3",    19],
					["master",  "5",    16],
					["visa",    "4",    16],
					["jcb",     "3",    16],
					["discover", "6",   16],
					["discover", "6",   17],
					["discover", "6",   18],
					["discover", "6",   19],
					["maestro", "5",    12],
					["maestro", "5",    13],
					["maestro", "5",    14],
					["maestro", "5",    15],
					["maestro", "5",    16],
					["maestro", "5",    17],
					["maestro", "5",    18],
					["maestro", "5",    19],
					["maestro", "6",    12],
					["maestro", "6",    13],
					["maestro", "6",    14],
					["maestro", "6",    15],
					["maestro", "6",    16],
					["maestro", "6",    17],
					["maestro", "6",    18],
					["maestro", "6",    19]
			    ];				
			
				// Validation
				var cc = value.replace(/[^\d]/g, '');
				for (var i in creditCardList) {
					if (creditCardList [i][0] == (cctype.toLowerCase())) {
						if (cc.indexOf(creditCardList [i][1]) == 0) {
							if (creditCardList [i][2] == cc.length) {
								return true;
							}
						}
					}
				}
				
				// If we get here then validation has failed
				return false;
			},
			priority: 32
		},
		creditcardtoken: {
			fn: function (value, cctype) {
				// No card set then exit
				if (!cctype) return false;

				// Globally defined list of card for validation				
			    creditCardList = [
			        //type      prefix   length
					["amex",    "3",    15],
					["diners",  "3",    14],
					["diners",  "3",    15],
					["diners",  "3",    16],
					["diners",  "3",    17],
					["diners",  "3",    18],
					["diners",  "3",    19],
					["master",  "5",    16],
					["visa",    "4",    16],
					["jcb",     "3",    16],
					["discover", "6",   16],
					["discover", "6",   17],
					["discover", "6",   18],
					["discover", "6",   19],
					["maestro", "5",    12],
					["maestro", "5",    13],
					["maestro", "5",    14],
					["maestro", "5",    15],
					["maestro", "5",    16],
					["maestro", "5",    17],
					["maestro", "5",    18],
					["maestro", "5",    19],
					["maestro", "6",    12],
					["maestro", "6",    13],
					["maestro", "6",    14],
					["maestro", "6",    15],
					["maestro", "6",    16],
					["maestro", "6",    17],
					["maestro", "6",    18],
					["maestro", "6",    19]
			    ];				
			
				// Validation
				var cc = value.replace(/[^\a-zA-Z0-9]/g, '');
				for (var i in creditCardList) {
					if (creditCardList [i][0] == (cctype.toLowerCase())) {
						if (cc.indexOf(creditCardList [i][1]) == 0) {
							if (creditCardList [i][2] == cc.length) {
								return true;
							}
						}
					}
				}
				
				// If we get here then validation has failed
				return false;
			},
			priority: 32
		},
		cvv: {
			fn: function (value, cctype) {	
				if ('amex' === cctype.toLowerCase()) {
					// Amex = 4
					regex = /^[0-9]{4}$/;
					if (regex.test(value)) {
						return true;
					} else {
						return false;	
					}		
				} else {
					// All other cards = 3 
					regex = /^[0-9]{3}$/;
					if (regex.test(value)) {
						return true;
					} else {
						return false;	
					}							
				}
			},
			priority: 32
		},
		cardexpiry: {
			fn: function (value, yearfield) {		
				var month = value;
				var year = $('#'+yearfield).val();
				var now = new Date();
				var nowyear = now.getFullYear();
				var nowmonth = now.getMonth();
				nowmonth++;
			    nowyear = nowyear.toString().substr(2,2);
				if ((year === nowyear) && (month < nowmonth)) {
					return false;
				}					
				return true;
			},
			priority: 32
		},
		cardexpirydate: {
			fn: function (value, unused) {		
				var month = $('[name=_DTA_EXPIRY_MONTH_]').val();
				var year = $('[name=_DTA_EXPIRY_YEAR_]').val();
				var now = new Date();
				var nowyear = now.getFullYear();
				var nowmonth = now.getMonth();
				nowmonth++;
			    nowyear = nowyear.toString().substr(2,2);
				if (year < nowyear) {
					return false;
				}	
				else if ((year === nowyear) && (month < nowmonth)) {
					return false;
				}					
				return true;
			},
			priority: 32
		},
		// Verify 2 input fields to enforce only one to be mandatory.
		requiredone: {
			fn: function (value, requirements) {
				if ($(requirements[0]).val() == "" && $(requirements[1]).val() == "")
				{
					return false;
				}
				return true;
			},
			priority: 32
		},
		// Verify 2 input fields to enforce only one to be mandatory and ensure 1 input only. 
		requiredoneonly: {
			fn: function (value, requirements) {
				if (($(requirements[0]).val() == "" && $(requirements[1]).val() == "") || ($(requirements[0]).val() != "" && $(requirements[1]).val() != ""))
				{
					return false;
				}
				return true;
			},
			priority: 32
		},
		// Verify Hong Kong ID 
		hkid: {
			fn: function (value, required) {
				
				// skip validation if empty. ( Added by Candice 30 July 2016)
				if (required==false && value == '') {
					return true;
				}

				var firstD = 0, secondD = 0, sum = 0;
				var HKIDArray = {A:10,B:11,C:12,D:13,E:14,F:15,G:16,H:17,I:18,J:19,K:20,L:21,M:22,N:23,O:24,P:25,Q:26,R:27,S:28,T:29,U:30,V:31,W:32,X:33,Y:34,Z:35};
				var re = /^[A-Za-z]+$/;
		        //STEP 1: FIND THE VALUE FOR THE FIRST 2 CHARACTERS OF THE HKID
		        if (value.length == 8) {
		        	if(!re.test(value.substr(0, 1))) return false;
		        	if(!parseInt(value.substr(1, 6))) return false;
		            firstD 	= typeof HKIDArray[value.substr(0, 1).toUpperCase()] != 'undefined' ? HKIDArray[value.substr(0, 1).toUpperCase()] : 0;
		            secondD = value.substr(1, 1);
		            sum = (36 * 9) + (firstD * 8) + (secondD * 7); // FIRST 2 DIGITS
		        } else if (value.length == 9) {
		        	if(!re.test(value.substr(0, 2))) return false;
		        	if(!parseInt(value.substr(2, 6))) return false;
		            firstD 	= typeof HKIDArray[value.substr(0, 1).toUpperCase()] != 'undefined' ? HKIDArray[value.substr(0, 1).toUpperCase()] : 0;
		            secondD = typeof HKIDArray[value.substr(1, 1).toUpperCase()] != 'undefined' ? HKIDArray[value.substr(1, 1).toUpperCase()] : 0;
		            sum = (firstD * 9) + (secondD * 8); // FIRST 2 DIGITS
		        } else {
		            return false;
		        };

		        if (firstD === 0) {
		            return false;
		        };

		        //STEP 2: MULTIPLY THE NEXT 7 DIGITS BY  7 or 6, 5, 4, 3, 2 RESPECTIVELY.
		        // NEXT 6 or 7 DIGITS. STARTING FROM THE RIGHT.
		        for (var j = 2; j < value.length-1; j++) {
		            sum += (value.substring(j, j+1) * (value.length-j));
		        }

		        // STEP 3: FIND THE REMAINDER WHEN DIVIDED BY 11.
		        var remainder = (11 - (sum % 11)) % 11;

		        // IF REMAINDER EQUAL TO 10 THEN CHECK DIGIT is 'A'
		        remainder = (remainder === 10) ? 'A' : remainder;

		        // STEP 4: AS LONG AS THE REMAINDER IS SAME AS LAST DIGIT, IT PASSES THE VALIDATION.
		        return (remainder.toString() === value.substring(value.length-1,value.length))
			},
			priority: 32
		},

	    insuredinputduplicate: {
	    	fn: function (value, fieldN) {
		        var ctrID = 0, error_message = '';
		        var aFieldValue =[];

		        //if Applicant is NOT Same as the First Insured, include Applicant's ID/passport to validation list
		        if (!$('#pol_is_firstinsured').is(':checked')) {
	                aFieldValue[ctrID] = $('input[name*='+fieldN.toUpperCase()+']').val();
	                ctrID++;
		        };

		        for (var i = 0; i < $("input[name*="+fieldN+"]").length; i++) {
	                aFieldValue[ctrID] = $("input[name='person\\[" + i+"\\]\\[\\'"+ fieldN+ "\\'\\]']").val();
	                ctrID++;
		        }

		        //validate duplicate field
		        if (typeof aFieldValue !== 'undefined' && aFieldValue.length > 0) {
		        	var found = 0;
			        for (var i = 0; i < aFieldValue.length; ++i) {
			            //var value = aFieldValue[i];
			            if ((aFieldValue[i] == value) && value !=='') {
			            	found ++;
			            	if (found > 1) {
			                	return false;
			            	}
			            }
			        }
		        };
		    },
			priority: 32
	    },
	    equaladuarray: {
			fn: function (value, array) {
                var insuredFieldN;
		        var currentAge;
   	        	var numOccurencesArray1;
    	        var numOccurencesArray2;
                var array1 = [];
                var array2 = $.trim(array).split(/\,/).map(Number).sort(function(a, b){return a-b});

		        if ($('#pol_is_firstinsured').is(':checked')) {
	               insuredFieldN = $("input[name*=full_dob][id*='Adult']").not(':eq(0)').add($("input[name=_DTA_DOB_FULL_]"));
		        }
		        else
		        {
		           insuredFieldN = $("input[name*=full_dob][id*='Adult']");
		        }

                for(var j=0; j<insuredFieldN.length; j++)
                {   
                    if(typeof ($(insuredFieldN[j]).val()) !== 'undefined' && ($(insuredFieldN[j]).val()).length > 0)
                    {
                        dob = moment($(insuredFieldN[j]).val(),"DD-MMM-YYYY");
                        age = moment(coverFrom,"DD-MMM-YYYY").format("YYYY") - moment($(insuredFieldN[j]).val(),"DD-MMM-YYYY").format("YYYY"); 
                        m = (moment(coverFrom,"DD-MMM-YYYY").format("M")-1) - (moment($(insuredFieldN[j]).val(),"DD-MMM-YYYY").format("M")-1) ; 
                        if (m < 0 || (m === 0 && parseInt(moment(coverFrom,"DD-MMM-YYYY").format("D")) < parseInt(moment(dob).format("D")))) { 
                            age--; 
                        }
                        array1.push(age)

                        if($(insuredFieldN[j]).val() === value)
                        {
                        	currentAge = age;
                        }
                    }
                }
				array1.sort(function(a, b){return a-b});

				if(array1.length>0 && array2.length>0 && typeof (currentAge) !== 'undefined')
				{
				    if($.inArray(currentAge, array2)!==-1)
				    {
						numOccurencesArray1 = $.grep(array1, function (elem) {
						    return elem === currentAge;
						}).length;

						numOccurencesArray2 = $.grep(array2, function (elem) {
						    return elem === currentAge;
						}).length;

						if(numOccurencesArray1<=numOccurencesArray2)
						{
							return true;
						}
						else
						{
							return false;
						}
				    }
				    else
				    {
				    	return false;
				    }
				}
				else
				{
					return true;
				}

		    },
			priority: 32
	    },
	    equaldeparray: {
			fn: function (value, array) {
                var insuredFieldN;
	            insuredFieldN = $("input[name*=full_dob][id*='Dependant']");
   	        	var currentAge;
   	        	var numOccurencesArray1;
    	        var numOccurencesArray2;
                var array1 = [];
                var array2 = $.trim(array).split(/\,/).map(Number).sort(function(a, b){return a-b});

                for(var j=0; j<insuredFieldN.length; j++)
                {   
                    if(typeof ($(insuredFieldN[j]).val()) !== 'undefined' && ($(insuredFieldN[j]).val()).length > 0)
                    {
                        dob = moment($(insuredFieldN[j]).val(),"DD-MMM-YYYY");
                        age = moment(coverFrom,"DD-MMM-YYYY").format("YYYY") - moment($(insuredFieldN[j]).val(),"DD-MMM-YYYY").format("YYYY"); 
                        m = (moment(coverFrom,"DD-MMM-YYYY").format("M")-1) - (moment($(insuredFieldN[j]).val(),"DD-MMM-YYYY").format("M")-1) ; 
                        if (m < 0 || (m === 0 && parseInt(moment(coverFrom,"DD-MMM-YYYY").format("D")) < parseInt(moment(dob).format("D")))) { 
                            age--; 
                        }
                        array1.push(age)

                        if($(insuredFieldN[j]).val() === value)
                        {
                        	currentAge = age;
                        }
                    }
                }
				array1.sort(function(a, b){return a-b});
			    
				if(array1.length>0 && array2.length>0 && typeof (currentAge) !== 'undefined')
				{
				    if($.inArray(currentAge, array2)!==-1)
				    {
						numOccurencesArray1 = $.grep(array1, function (elem) {
						    return elem === currentAge;
						}).length;

						numOccurencesArray2 = $.grep(array2, function (elem) {
						    return elem === currentAge;
						}).length;

						if(numOccurencesArray1<=numOccurencesArray2)
						{
							return true;
						}
						else
						{
							return false;
						}
				    }
				    else
				    {
				    	return false;
				    }
				}
				else
				{
					return true;
				}
		    },
			priority: 32
	    },
	    mintraveller: {
			fn: function (value, ntraveller) {
				if($.trim(value).split(/\,/).filter(function(v){return v!==''}).length<ntraveller)
				{
					return false;
				}
				return true;
		    },
			priority: 32
	    },	  
	    maxadulttravellers: {
	    	fn: function (value, maxadulttravellers) {

	    		if(maxadulttravellers==false)
	    		{
	    			return true;
	    		}
	    		else
	    		{
					var temp = $.trim(value).split(/\,/);
					var nAdultAllow = parseInt(maxadulttravellers.split(/\,/)[0]);
					var adultMinAge = parseInt(maxadulttravellers.split(/\,/)[1]);
					var nAdult = 0;

					for(var i=0;i<temp.length;i++){
						if(temp[i]!=="")
						{
							if(temp[i]>=adultMinAge){
								nAdult++;
							}
						}
					}

					if(nAdult<=nAdultAllow)
					{
						return true;
					}
				}

				return false;
		    },
			priority: 32
	    },	  
	    maxdependanttravellers: {
	    	fn: function (value, maxdependantstravellers) {

	    		if(maxdependantstravellers==false)
	    		{
	    			return true;
	    		}
	    		else
	    		{
					var temp = $.trim(value).split(/\,/);
					var nDependantsAllow = parseInt(maxdependantstravellers.split(/\,/)[0]);
					var dependantsMinAge = parseInt(maxdependantstravellers.split(/\,/)[1]);
					var nDependants = 0;

					for(var i=0;i<temp.length;i++){
						if(temp[i]!=="")
						{
							if(temp[i]<=dependantsMinAge){
								nDependants++;
							}
						}
					}

					if(nDependants<=nDependantsAllow)
					{
						return true;
					}
				}

				return false;
		    },
			priority: 32
	    },	
	 	maxadulttraveller: {
			fn: function (value, requirements) {
				requirements = requirements.split(/\,/);
				var adultsAge = value.split(/\,/).map(Number).filter(function(v){return v!==''&&v>=parseInt(requirements[1])});
				var adultsAgeWOOverlap = adultsAge.filter(function(v){return v>requirements[2]});
				var ageOverlap = adultsAge.filter(function(v){return v<=requirements[2]});
				var numberOfAdults = 0;
	
				if(requirements[3] !== undefined && adultsAgeWOOverlap.length>0)
				{
					if(adultsAgeWOOverlap.length>parseInt(requirements[0]))
					{
						return false;
					}
					else if(ageOverlap.length>0)
					{
						numberOfAdults = adultsAgeWOOverlap.length;
						
						for(var j=0; j<ageOverlap.length; j++)
						{
							if(Math.abs(Math.max.apply(Math,(adultsAgeWOOverlap))-ageOverlap[j])<parseInt(requirements[3]))
							{	
								numberOfAdults++
							}
						}

						if(numberOfAdults>parseInt(requirements[0]))
						{
							return false
						}			
					}

				}
				else if(adultsAge.length>parseInt(requirements[0]))
				{
					return false;
				}
				
				return true;

		    },
			priority: 32
	    },
	 	maxdependanttraveller: {
			fn: function (value, requirements) {
				requirements = requirements.split(/\,/);
				var adultsAge = value.split(/\,/).map(Number).filter(function(v){return v!==''&&v>=parseInt(requirements[1])});
				var adultsAgeWOOverlap = adultsAge.filter(function(v){return v>requirements[2]});
				var ageOverlap = adultsAge.filter(function(v){return v<=requirements[2]});
				var dependantsAgeWOOverlap = value.split(/\,/).map(Number).filter(function(v){return v!==''&&v<parseInt(requirements[1])});
				var numberOfDependants = 0;
	
				if(requirements[3] !== undefined && adultsAgeWOOverlap.length>0)
				{
					if(dependantsAgeWOOverlap.length>parseInt(requirements[0]))
					{
						return false;
					}	
					else if(ageOverlap.length>0)
					{
						numberOfDependants = dependantsAgeWOOverlap.length;

						for(var j=0; j<ageOverlap.length; j++)
						{
							if(Math.abs(Math.max.apply(Math,(adultsAgeWOOverlap))-ageOverlap[j])>=parseInt(requirements[3]))
							{	
								numberOfDependants++
							}
						}
						if(numberOfDependants>parseInt(requirements[0]))
						{
							return false
						}			
					}
				}
				else if(dependantsAgeWOOverlap.length>parseInt(requirements[0]))
				{
					return false;
				}
				return true;

		    },
			priority: 32
	    },
	    policyholderminage: {
			fn: function (value, minage) {
				var temp = $.trim(value).split(/\,/)[0];
				if(temp<minage){
					return false;
				}
				return true;
		    },
			priority: 32
	    },
	    adultminage: {
			fn: function (value, minage) {
				var temp = $.trim(value).split(/\,/);
				for(var i=0;i<temp.length;i++){
					if(temp[i]<minage){
						return false;
					}
				}
				return true;
		    },
			priority: 32
	    },
	    adultmaxage: {
	    	fn: function (value, maxage) {
				var temp = $.trim(value).split(/\,/);
				for(var i=0;i<temp.length;i++){
					if(temp[i]>maxage){
						return false;
					}
				}
				return true;
		    },
			priority: 32
	    },
	    dependantminage: {
			fn: function (value, minage) {
				var temp = $.trim(value).split(/\,/);
				for(var i=0;i<temp.length;i++){
					if(temp[i]<minage){
						return false;
					}
				}
				return true;
		    },
			priority: 32
	    },
	    dependantmaxage: {
	    	fn: function (value, maxage) {
				var temp = $.trim(value).split(/\,/);
				for(var i=0;i<temp.length;i++){
					if(temp[i]>maxage){
						return false;
					}
				}
				return true;
		    },
			priority: 32
	    },
	    minoneadult: {
	    	fn: function (value, adultage) {
				var temp = $.trim(value).split(/\,/);
				for(var i=0;i<temp.length;i++){
					if(temp[i]>=adultage){
						//console.log(temp[i],adultage)
						return true;
					}
				}
				return false;
		    },
			priority: 32
	    },
	    minonedependant: {
	    	fn: function (value, dependantage) {
	    		if(dependantage==false)
	    		{
	    			return true;
	    		}
	    		else
	    		{
					var temp = $.trim(value).split(/\,/);
					for(var i=0;i<temp.length;i++){
						if(temp[i]<=dependantage){
							//console.log(temp[i],adultage)
							return true;
						}
					}
				}
				return false;
		    },
			priority: 32
	    },
	    infantlessthanadult: {
	    	fn: function (value, infantmaxageadultminage) {

	    		if(infantmaxageadultminage==false)
	    		{
	    			return true;
	    		}
	    		else
	    		{
					var temp = $.trim(value).split(/\,/);
					var infantMaxAge = parseInt(infantmaxageadultminage.split(/\,/)[0]);
					var adultMinAge = parseInt(infantmaxageadultminage.split(/\,/)[1]);
					var nInfant = 0;
					var nAdult = 0;

					for(var i=0;i<temp.length;i++){
						if(temp[i]!=="")
						{
							if(temp[i]<=infantMaxAge){
								nInfant++;
							}
							else if(temp[i]>=adultMinAge)
							{
								nAdult++;
							}
						}
					}

					if(nInfant<=nAdult)
					{
						return true;
					}
				}
				return false;
		    },
			priority: 32
	    },
	    selectnovalue: {
	    	fn: function (removedValues, selectedValue) {
	    		selectedValue = selectedValue.split(",");
	    		if($.inArray(removedValues,selectedValue)<0){
	    			return true;
	    		}
	    		return false;
		    },
			priority: 32	
	    },
	    maxtripcost: {
	    	fn: function (value, requirements) {

                if(parseFloat(value.replace(/[^0-9\.-]+/g,"")).toFixed(2) > Number(requirements))
                {
                     return false;
                }
	            
	            return true;
		    },
			priority: 32	
	    },
	    highesttripcost: {
	    	fn: function (value, requirements) {
			// i.e. data-parsley-tripcpst='["min", "max", "Trip cost for traveler 1 (Primary Insured) must not be lesser than other traveler's trip cost"]'
				var tripCost = $("[name*=_DTA_TRIPCOST]");
				var tripCostArray = [];
			   	for(var i=0; i < tripCost.length; i++) {
					if ($(tripCost[i]).val() !== "") {
						tripCostArray.push(parseFloat($(tripCost[i]).val().replace(/[^0-9\.-]+/g,"")).toFixed(2));
					}
				}
	            var maxTripCost = Math.max.apply(Math, tripCostArray);
            	if(maxTripCost > parseFloat(value.replace(/[^0-9\.-]+/g,"")).toFixed(2))
                {
                    return false;
                }
	            return true;
		    },
			priority: 32	
	    },
	    dob: {
			// i.e. data-parsley-dob='["dob", "min", "max"]'
	    	fn: function (value, requirements) {
				requirements = requirements.split(/\,/);
				var dob = new Date(requirements[0]),
				minAge = new Date(requirements[1]),
				maxAge = new Date(requirements[2]);

            	if(!(dob>=minAge && dob<=maxAge))
                {
                    return false;
                }
	            return true;
		    },
			priority: 32	
	    },
	    idlookup: {
	    	fn: function (value, requirements) {
                
                var found;
                var minLength = Math.min.apply(Math,requirements).toString().length;
                var maxLength = Math.max.apply(Math,requirements).toString().length;
                var number = [];

                for (var i = minLength; i <= maxLength; i++) {

                	var newNumber = parseInt(value.replace(/ /g,'').substring(0,i));
                	
                	if(newNumber>=(requirements.filter(function(e) {return e >=newNumber})[0]))
                	{
                    	number.push(newNumber);
                	}
                }

				var array = requirements.filter(function(e) {return e >=number[0]});

                for (var x = 0; x < array.length; x++) {
                    
                    for(var y = 0; y < number.length; y++)
                    {
	                    if(array[x] == parseInt(number[y])) 
	                    {
	    		            found = true;
	    		            break;
	                    }
	                }
                }

            	if(!found)
                {
                    return false;
                }

	            return true;
		    },
			priority: 32	
	    },
	    maxenddate: {
	    	fn: function (value, requirements) {
				requirements = requirements.split(/\,/);
				var endDate = new Date(requirements[0]).setHours(0,0,0,0),
				maxEndDate = new Date(requirements[1]).setHours(0,0,0,0)

            	if(endDate>maxEndDate&&value!="")
                {
                    return false;
                }
	            return true;
		    },
			priority: 32	
	    }	    
	}
};