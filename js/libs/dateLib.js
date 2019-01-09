var dateLib = function(){
	
	//Date struck give current date and time.
	var today = new Date();
	
	//get the year and return an array of months (name and days)
	var	months = function(year = today.getFullYear){
		//check if input year is  a loop year
		var loopYear = (((year % 4 == 0) && (year % 100 == 0) && (year % 400 == 0)) || ((year % 4) == 0 && (year % 100 != 0))) ? true : false;
		return [
				{undefined},
				{name : "January" , days : 31},
				{name : "February" , days : (loopYear ? 29 : 28)},
				{name : "March"  , days : 31},
				{name : "April" , days : 30},
				{name : "May" , days : 31},
				{name : "June" , days : 30},
				{name : "July" , days : 31},
				{name : "August" , days : 31},
				{name : "September" , days : 30},
				{name : "October" , days : 31},
				{name : "November" , days : 30},
				{name : "December" , days : 31}
			];		
	};
	
	//return which day in the week the Date is (1 - Sunday ... 7 - Saturday)
	var dayOfWeek = function(year , month , day){
		var year = (month != 1 && month != 2) ? year : (year-1);
		var y = year % 100;
		var c = (year/100) | 0;
		var d = day;
		var m = (month+10) % 12;
		
		//if 0 then m need to be 12 else stay same
		m = (m == 0) ? 12 : m;
		
		//Gauss's algorithm for dayofthe week with module fix (n%m + m) % m to handle negitive numbers
		var w = ((d + Math.floor(2.6*m - 0.2) + y + Math.floor(y/4) + Math.floor(c/4) - 2*c) % 7 + 7) % 7 + 1;

		return w;
	}
	//days will be a struck with {type : 'weeks' or 'months', amount : ....}
	//date will be a struck with {year : .... , month : .... , day : ....}
	var endDate = function(date,days){
		endD = date;
		mList = months(date.year); 
		if(days.type == 'months'){
			for(var i = 0 ; i < days.amount ; i++){
				endD.month++
				if(endD.month == 13){
					endD.month = 1;
					endD.year++;
				}
			}
		}else{
			for(var i = 0 ; i < days.amount ; i++){
				endD.day += 7
				if(endD.day > mList[endD.month].days){
					endD.day -= mList[endD.month].days;
					endD.month++;
					if(endD.month == 13){
						endD.year++;
						mList = months[endD.year];
						endD.month = 1;
					}
				}
			}
		}
		return endD;
	}
	return {today : today,
			months : months,
			dayOfWeek : dayOfWeek,
			endDate : endDate};
}();