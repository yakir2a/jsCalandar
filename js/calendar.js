var calendar = function(){
	
	//the initial html input
	var confingMap = {
		inputSection : "<header>" +
						"<button id = 'nextMonth' class = 'button nextMonth'>Next Month&#10095;</button>" +
						"<button id = 'prevMonth' class = 'button prevMonth'>&#10094;Previous Month</button>" +
						"<div id = 'displayMonth' class = 'displayMonth'>"+ (dateLib.months()[dateLib.today.getMonth()+1].name) +"<br>"+ dateLib.today.getFullYear() +"</div>" +
						"</header>" +
						"<main>" +
						"<div class = 'week'>"+
							"<div class = 'weekDay'>Sun</div><div class = 'weekDay'>Mon</div><div class = 'weekDay'>Tue</div><div class = 'weekDay'>Wed</div>"+
							"<div class = 'weekDay'>Thu</div><div class = 'weekDay'>Fri</div><div class = 'weekDay'>Sat</div>"+
						"</div>"+
						"<div id = 'month'></div>" +
						"</main>"	
	};
	
	var stateMap = {$container : null};
	//hold the displayed month event list
	var eventList;
	//hold the current displayed Month on the calendar
	var	displayDate = {day : dateLib.today.getDate(),
						month : dateLib.today.getMonth()+1,
						year : dateLib.today.getFullYear()};
	var initModule = function($container){
		stateMap.$container = $container;
		$("#calendar").html(confingMap.inputSection);
		
		//initial for the weekDay div's
		$(".weekDay").css({"width" : (100/7)+"%"});
		$("#eventHandler").hide();
		$("#calendar").css({"left" : "10%"});
		eventUI.initModule($("#eventHandler"));

		$("main").css({"height" : ($("body").height()-60)+"px"});
		$("#month").css({"height" : ($("main").height()-20)+"px"});
		localMemoryAPI.init();

		
		fillMonth(displayDate);
		$(window).resize(function(){reSize();}).trigger('resize');
		//nextMonth on click func
		$("#nextMonth").click(function(){
						if(displayDate.month == 12){
							displayDate.year++;
							displayDate.month = 1;
						}else
							displayDate.month++;
						$("#displayMonth").html(dateLib.months(displayDate.year)[displayDate.month].name+"<br>"+ displayDate.year);
						fillMonth(displayDate);
						$("#dayHeader").empty();
						$("#eventInTD table").empty();
						monthTdResize();
						tooltip.refresh();
		});
		
		//prevMonth on click func
		$("#prevMonth").click(function(e){
						if(displayDate.month == 1){
							displayDate.year--
							displayDate.month = 12;
						}else
							displayDate.month--;
						$("#displayMonth").html(dateLib.months(displayDate.year)[displayDate.month].name+"<br>"+ displayDate.year);
						fillMonth(displayDate);
						$("#dayHeader").empty();
						$("#eventInTD table").empty();
						monthTdResize();
						tooltip.refresh();
		});

	};
		
	//fill the month table
	var fillMonth = function(date, events = undefined)
	{
		//clear month div
		$("#month").empty();
		var table = monthView(date);
		var size = (table.length) == 35 ? 5 : 6;
		var month = "";
		var j = 0;
		for(var i = 0 ; i < table.length ;)
		{
			month += "<div class = 'monthWeek'>"
			for(var k = 0 ; k < 7 ; k++ , i++){	
				month += "<div class = "+table[i].type+">"+ 
					((table[i].day == 1) ? "<div class = 'dNum'>"+( table[i].month + " " + table[i].day)+
					"</div>" : "<div class = 'dNum'>"+table[i].day + "</div>")+ "<table class = 'eventField'></table>" + 
				"</div>";
			}		
			
			month+= "</div>"
		}
		 
		//add calender table to the html
		$("#month").append(month);
		
		//calculate and hold display Month start Date and end Date
		var startY = (table[0].type == 'PMday') ? (((displayDate.month-1) == 0) ? (displayDate.year-1) : displayDate.year) : displayDate.year;
		var endY = (table[table.length-1].type == 'NMday') ? (((displayDate.month+1) == 13) ? (displayDate.year+1) : displayDate.year) : displayDate.year;
	
		var startM = (table[0].type == 'PMday') ? (((displayDate.month-1) == 0) ? 12 : (displayDate.month-1)) : displayDate.month;
		var endM = (table[table.length-1].type == 'NMday') ? (((displayDate.month+1) == 13) ? 1 : (displayDate.month+1)) : displayDate.month;
	
		var startD = table[0].day;
		var endD = table[table.length-1].day;
	
		var mStartDate = ""+startY+(startM < 10 ? "0"+startM : startM)+(startD < 10 ? "0"+startD : startD);
		var mEndDate = ""+endY+(endM < 10 ? "0"+endM : endM) + (endD < 10 ? "0"+endD : endD);
		
		
		
		//change dNum class of the current Day to "current_D_Num"
		if(date.month == (dateLib.today.getMonth()+1)){
			$(".CMday .dNum").filter(function(){
			return ($(this).text().replace ( /[^\d.]/g, '' ) == date.day);}).attr('id','current_Day_Num');
			$("#current_Day_Num").parent().attr('id','current_Day');
			$("#current_Day_Num").css({"background-color" : "#1abc9c"});
		}
		$(".CMday,.PMday,.NMday,.current_Day").css({"width" : (100/7) + "%" ,
						"height" : "100%"});
		$(".monthWeek").css({"height" : (100/size) + "%"});
						
		//load all event from memory				
		var allEvent = {"daily" :  localMemoryAPI.getAll("daily") , "weekly" : localMemoryAPI.getAll("weekly") , "monthly" : localMemoryAPI.getAll("monthly")};
		
		//list of events that need to be display
		eventList = eventInDisplayMonth(allEvent['daily'],allEvent['weekly'],allEvent['monthly'],mStartDate,mEndDate);
		
		fillDayEvent(table);
		
		//function temp here
		$(".PMday,.CMday,.NMday").click(function(e){
						$("#calendar").animate({left : "0"}, 500 ,function(){
																$("#calendar").css({"left" : "0"});
																});
						var clickedDay;
						var clickedMonth = displayDate.month;
						var clickedYear = displayDate.year;
						var pressed = e.target;
						
						if($(e.target).attr("class") !== "CMday" && $(e.target).attr("class") !== "PMday"	&& $(e.target).attr("class") !== "NMday"){
							if($(e.target).attr("class") == "dNum"){
								if($(e.target).parents(".PMday,.CMday,.NMday").attr("class") == "PMday"){
									clickedYear = (clickedMonth == 1) ? (clickedYear-1) : clickedYear;
									clickedMonth = (clickedMonth == 1) ? 12 : (clickedMonth-1);
								}else
								if($(e.target).parents(".PMday,.CMday,.NMday").attr("class") == "NMday"){
									clickedYear = (clickedMonth == 12) ? (clickedYear+1) : clickedYear;
									clickedMonth = (clickedMonth == 12) ? 1 : (clickedMonth+1);
								}
								clickedDay = $(e.target).text().replace ( /[^\d.]/g, '' );
							}else{
								if($(e.target).parents(".PMday,.CMday,.NMday").attr("class") == "PMday"){
									clickedYear = (clickedMonth == 1) ? (clickedYear-1) : clickedYear;
									clickedMonth = (clickedMonth == 1) ? 12 : (clickedMonth-1);
								}else
								if($(e.target).parents(".PMday,.CMday,.NMday").attr("class") == "NMday"){
									clickedYear = (clickedMonth == 12) ? (clickedYear+1) : clickedYear;
									clickedMonth = (clickedMonth == 12) ? 1 : (clickedMonth+1);
								}
								if($(e.target).attr('class') == "eventField")
									clickedDay = $(e.target).siblings(".dNum").text().replace ( /[^\d.]/g, '' );
								else									
									clickedDay = $(e.target).parents(".eventField").siblings(".dNum").text().replace ( /[^\d.]/g, '' );								
							}
						}else{
								if($(e.target).attr("class") == "PMday"){
									clickedYear = (clickedMonth == 1) ? (clickedYear-1) : clickedYear;
									clickedMonth = (clickedMonth == 1) ? 12 : (clickedMonth-1);
								}
								if($(e.target).attr("class") == "NMday"){
									clickedYear = (clickedMonth == 12) ? (clickedYear+1) : clickedYear;									
									clickedMonth = (clickedMonth == 12) ? 1 : (clickedMonth+1);
								}
								clickedDay = ($(e.target.getElementsByClassName("dNum")).text()).replace ( /[^\d.]/g, '' );	
						}
						if($(pressed).parents(".eventField").length == 0){
							if($(pressed).siblings(".eventField").length == 0){
								pressed = $(pressed).find("td");
							}else{
								pressed = $(pressed).siblings(".eventField").find("td");
							}
						}else{
							pressed = $(pressed).parents(".eventField").find("td");							
						}
						$("#dayHeader").empty();
						$("#eventInTD table").empty();
						$("#dayHeader").append(clickedDay +"/"+ clickedMonth +"/"+ clickedYear);
						var temp;
						for(var i = 0 ; i < pressed.length ; i++){
							temp = $("<tr><td id = '"+$(pressed[i]).attr("id")+"'><div>"+$(pressed[i]).text()+"</td></tr><tr><td id = '"+$(pressed[i]).attr("id")+"' class = 'event-description'></div></td></tr>");
							$("#eventInTD").children("table").append(temp);
							temp.css({"backgroundColor" : $(pressed[i]).css("backgroundColor")})
							//click function to open event full description
							temp.click(function(e){
								var target = $(e.target).parents("tr").next().find(".event-description");
								if(!(target.is(':empty'))){
									target.animate({"height" : 0}, 300);
									target.empty();
									return;
								}
								var hitEvent = eventList[$(target).attr("id").replace ( /[^\d.]/g, '' )];
								target.append("<div><div id = 'date'><div id = 'from'>From: "+hitEvent.startDate.day+"/"+hitEvent.startDate.month+"/"+hitEvent.startDate.year+"<br> Start: "+hitEvent.startTime+"</div><div id = 'to'> To: "+
								+hitEvent.endDate.day+"/"+hitEvent.endDate.month+"/"+hitEvent.endDate.year+"<br> End: "+hitEvent.endTime+"</div></div><br><br>"+hitEvent.description+"<br><br><div><button id = 'edit'>Edit</button><button id = 'remove'>Remove</button></div></div>");
								target.find("#from").css({"font-size" : (target.children().width()*dFontScale)+"px"});
								target.find("#to").css({"font-size" : (target.children().width()*dFontScale)+"px"});
								var boxHeight = target.height();
								target.children().hide();
								target.animate({"height" : boxHeight+"px"}, 300 , function(){
									target.children().css({"opacity" : "0"});
									target.children().show();
									target.children().animate({"opacity" : "1"} , 200);
									
								});
								
								//click function to remove event from calendar
								target.find("#remove").click(function(e){
									if(confirm("Ar you sure you want to remove this event?")){
										var type = hitEvent.type;
										hitEvent.title = null;
										localMemoryAPI.save(type,allEvent[type]);
										fillMonth(displayDate)
										cancel(null);
									}
								});
								//click function to edit event
								target.find("#edit").click(function(){
									//while edit event cant change its type (daily,weekly,monthly)
									$("#switch_weekly,#switch_monthly,#switch_daily").attr('disabled' , true);
									
									//switch to see which event form to fill
									switch (hitEvent.type){
										case 'daily' :
											$("#switch_daily").prop('checked' , true);
											eventType({target : $("#switch_daily")[0]});
											$("#title").val(hitEvent.title);
											$("#description").val(hitEvent.description);
											$("#beginD").val(hitEvent.startDate.year +"-"+((hitEvent.startDate.month < 10) ? "0"+hitEvent.startDate.month : hitEvent.startDate.month) +"-"+ (hitEvent.startDate.day < 10 ? "0"+hitEvent.startDate.day : hitEvent.startDate.day) +"T"+hitEvent.startTime);
											$("#endD").val(hitEvent.endDate.year +"-"+((hitEvent.endDate.month < 10) ? "0"+hitEvent.endDate.month : hitEvent.endDate.month) +"-"+ (hitEvent.endDate.day < 10 ? "0"+hitEvent.endDate.day : hitEvent.endDate.day) +"T"+hitEvent.endTime);
											$("#colorful").val(hitEvent.eventColor);
										break;
										default:
											if(hitEvent.type == 'weekly'){
												$("#switch_weekly").prop('checked' , true);
												eventType({target : $("#switch_weekly")[0]});
											}else{
												$("#switch_monthly").prop('checked' , true);
												eventType({target : $("#switch_monthly")[0]});
											}
											$("#title").val(hitEvent.title);
											$("#description").val(hitEvent.description);
											$("#beginD").val(hitEvent.startDate.year +"-"+((hitEvent.startDate.month < 10) ? "0"+hitEvent.startDate.month : hitEvent.startDate.month) +"-"+ (hitEvent.startDate.day < 10 ? "0"+hitEvent.startDate.day : hitEvent.startDate.day) +"T"+hitEvent.startTime);
											$("#colorful").val(hitEvent.eventColor);
											$("#numrepeat").val(hitEvent.duration);
											$("input:checkbox").each(function(){
												cBox = hitEvent.weekDay.shift()
												hitEvent.weekDay.push(cBox);
												$(this).prop('checked' , cBox);
											});	
										break;
									}
									
									//removing click function from ok and reusing it to "edit" form
									$("#ok").text("confirm");
									$("#ok").unbind("click");
									
									//confirm click function
									$("#ok").click(function(){
										
										//switch to see which event form to save
										switch (hitEvent.type){
												case 'daily':
													if($("#title").val() == '' || $("#beginD").val() == '' || $("#endD").val() == ''){
														alert("please fill all the necessary fields");
														return;
													}
													if(!($("#beginD").val()).localeCompare($("#endD").val())){
														alert("End Date cant be befor Start Date");
														return;
													}
													hitEvent.title =  $("#title").val();
													hitEvent.description =  $("#description").val();
													hitEvent.startDate = getDate($("#beginD").val());
													hitEvent.endDate = getDate($("#endD").val());
													hitEvent.startTime = getTime($("#beginD").val());
													hitEvent.endTime = getTime($("#endD").val());
													hitEvent.eventColor = $("#colorful").val();
												break;
												case 'weekly':
													if($("#title").val() == '' || $("#beginD").val() == ''){
														alert("please fill all the necessary fields");
														return;
													}
													if( $("#numrepeat").val() < 1){
														alert("please fill number of weeks");
														return;
													}
													var weekDay=[];
													$("input:checkbox").each(function(){weekDay.push($(this).is(":checked"));});
													
													hitEvent.description =  $("#description").val();
													hitEvent.startDate = getDate($("#beginD").val());
													hitEvent.duration = $("#numrepeat").val();
													hitEvent.weekDay = weekDay;
													hitEvent.endDate = dateLib.endDate(getDate($("#beginD").val()),{type : 'weeks' , amount : $("#numrepeat").val()});
													hitEvent.startTime = getTime($("#beginD").val());
													hitEvent.endTime = getTime($("#beginD").val());
													hitEvent.eventColor = $("#colorful").val();
												break;
												case 'monthly':
													if($("#title").val() == '' || $("#beginD").val() == ''){
														alert("please fill all the necessary fields");
														return;
													}
													if( $("#numrepeat").val() < 1){
														alert("please fill number of weeks");
														return;
													}
													var weekDay=[];
													$("input:checkbox").each(function(){weekDay.push($(this).is(":checked"));});
													hitEvent.description =  $("#description").val();
													hitEvent.startDate = getDate($("#beginD").val());
													hitEvent.duration = $("#numrepeat").val();
													hitEvent.weekDay = weekDay;
													hitEvent.endDate = dateLib.endDate(getDate($("#beginD").val()),{type : 'months' , amount : $("#numrepeat").val()});
													hitEvent.startTime = getTime($("#beginD").val());
													hitEvent.endTime = getTime($("#beginD").val());
													hitEvent.eventColor = $("#colorful").val();
												break;
											}
											//release switch's after edit is done
											$("#switch_weekly,#switch_monthly,#switch_daily").prop('disabled' , false);
											$("#switch_weekly,#switch_monthly,#switch_daily").prop('checked' , false);
											//close side bar
											cancel(null);
											
											//returning 'ok' button to normal
											$("#ok").text("Ok");
											$("#ok").unbind("click");
											$("#ok").click(addEvent);
											
											//save update event to memory
											localMemoryAPI.save(hitEvent.type,allEvent[hitEvent.type]);
											
											//refill calendar
											calendar.fillMonth(calendar.displayDate);
									});
									//changing cancel to work for edit
									$("#cancel").unbind("click");
									$("#cancel").click(function(){
										$("#switch_weekly,#switch_monthly,#switch_daily").prop('disabled' , false);
										$("#switch_weekly,#switch_monthly,#switch_daily").prop('checked' , 'unchecked');
										$("#cancel").unbind("click");
										$("#ok").text("Ok");
										$("#ok").unbind("click");
										$("#ok").click(addEvent);
										$("#cancel").click(cancel).trigger('click');
									});
									
									
								});
								opta = (target.parent().css("backgroundColor"));
								opta = opta.split(",");
								opta = opta[0]+","+opta[1]+","+opta[2]+", 0.5)";
								target.parent().css({"backgroundColor" : opta});
							});
						}
						if($("#ok").text() == "Ok"){
							$("#switch_daily").trigger('click');
							$("#beginD").val(clickedYear +"-"+((clickedMonth < 10) ? "0"+clickedMonth : clickedMonth) +"-"+ (clickedDay < 10 ? "0"+clickedDay : clickedDay) +"T06:00");
							$("#endD").val(clickedYear +"-"+((clickedMonth < 10) ? "0"+clickedMonth : clickedMonth) +"-"+ (clickedDay < 10 ? "0"+clickedDay : clickedDay) +"T07:00");
						}
						$("#eventHandler").show();
						$("#eventHandler").animate({width : "20%"} , 500 , function(){
																		$("#eventHandler").show();
																		$("#Event").show();
																		$("#eventInTD").show();
																		sideBarResize();
																		tooltip.refresh();
																		});
		});	
		monthTdResize();
		tooltip.refresh();
			
	};
	
	
	//Build the month day array of the giving date.
	var monthView = function(date){	
		//Hold the months array from the dateLib
		var months = dateLib.months(date.year);
		//hold the day of the week the month start
		var dayInWeek = dateLib.dayOfWeek(date.year,date.month,1);				
		//how many weeks to display
		var weeks = (months[date.month].days + (dayInWeek-1)) > 35 ? 6 : 5;		
		//array of all days
		var table = new Array(weeks*7)
		//calculate the prev month day in this month table
		var day = (date.month-1 == 0) ? (months[12].days - (dayInWeek-2)) : (months[date.month-1].days - (dayInWeek-2));
		
		//fill prev month days in the array
		for(var i = 0 ; i < (dayInWeek-1) ; i++){
			table[i] = {day : day,
						type : "PMday",
						eventToday : []};
			day++;
		}
		
		//fill current month days in the array
		day = 1;
		for(; day <= months[date.month].days ; i++, day++){
			table[i] = {day : day,
						type : "CMday",
						eventToday : []};
			if(day == 1)
				//first day of the month add name attribute
				table[i]["month"] = months[date.month].name;
		}
		//fill next month days in the array
		day = 1;
		for(; i < weeks*7 ; i++, day++){
			table[i] = {day : day,
						type : "NMday",
						eventToday : []};
			if(day == 1)
				//first day of the month add name attribute
				table[i]["month"] = (date.month == 12) ? months[1].name : months[date.month+1].name;
		}
			return table;
	}
	
	//Fill event list of the day
	function fillDayEvent(table){
		var day;
		var temp;
		var opta;
		for(var j = 0 ;  j < table.length ; j++){
			if(table[j].type == 'PMday'){
				day = ""+((displayDate.month == 1) ? (displayDate.year-1) + "12" : displayDate.year + ((displayDate.month-1) < 10 ? "0"+(displayDate.month-1) : (displayDate.month-1))) + (table[j].day < 10 ? "0"+table[j].day : table[j].day); 
			}else{
				if(table[j].type == 'NMday'){
					day = ""+((displayDate.month == 12) ? (displayDate.year+1) + "01" : displayDate.year + ((displayDate.month+1) < 10 ? "0"+(displayDate.month+1) : (displayDate.month+1))) + (table[j].day < 10 ? "0"+table[j].day : table[j].day); 
				}else{
					day = ""+ displayDate.year + (displayDate.month < 10 ? "0"+displayDate.month : displayDate.month) + (table[j].day < 10 ? "0"+table[j].day : table[j].day); 
				}
			}
			for(var i = 0 ; i < eventList.length ; i++){
				switch(eventList[i].type){
						case 'daily':
							if(inDay(day,day,eventList[i].startDate,eventList[i].endDate)){
								temp = ($($(".eventField")[j]).append("<tr><td id = 'eventN"+i+"'><div class = 'tdSizeMonth' data-tooltip = \"{'color' : '"+eventList[i].eventColor+"'}\" title = '"+eventList[i].title+"' >"+eventList[i].title+"</div></td></tr>")).find("#eventN"+i).css({"backgroundColor" : eventList[i].eventColor});
								opta = (temp.css("backgroundColor"));
								opta = opta.slice(0,(opta.length-1)) + " , 0.7)";
								opta = "rgba"+opta.slice(3,(opta.length-1));
								temp.css({"backgroundColor" : opta});							
							}								
						break;
						case 'weekly':
							if(inDay(day,day,eventList[i].startDate,eventList[i].endDate))
								if(eventList[i].weekDay[dateLib.dayOfWeek(parseInt(day.slice(0,4)),parseInt(day.slice(4,6)),parseInt(day.slice(6,8)))-1]){
									temp = ($($(".eventField")[j]).append("<tr><td id = 'eventN"+i+"'><div class = 'tdSizeMonth' data-tooltip = \"{'color' : '"+eventList[i].eventColor+"'}\" title = '"+eventList[i].title+"' >"+eventList[i].title+"</div></td></tr>")).find("#eventN"+i).css({"backgroundColor" : eventList[i].eventColor});									
									opta = (temp.css("backgroundColor"));
									opta = opta.slice(0,(opta.length-1)) + " , 0.7)";
									opta = "rgba"+opta.slice(3,(opta.length-1));
									temp.css({"backgroundColor" : opta});
								}
						break;
						case 'monthly':
							if(inDay(day,day,eventList[i].startDate,eventList[i].endDate))
								if(eventList[i].weekDay[dateLib.dayOfWeek(parseInt(day.slice(0,4)),parseInt(day.slice(4,6)),parseInt(day.slice(6,8)))-1]){
									temp = ($($(".eventField")[j]).append("<tr><td id = 'eventN"+i+"'><div class = 'tdSizeMonth' data-tooltip = \"{'color' : '"+eventList[i].eventColor+"'}\"  title = '"+eventList[i].title+"' >"+eventList[i].title+"</div></td></tr>")).find("#eventN"+i).css({"backgroundColor" : eventList[i].eventColor});									
									opta = (temp.css("backgroundColor"));
									opta = opta.slice(0,(opta.length-1)) + " , 0.7)";
									opta = "rgba"+opta.slice(3,(opta.length-1));
									temp.css({"backgroundColor" : opta});
								}
						break;
				}
			}
		}
	}
	return {initModule : initModule , fillMonth : fillMonth , displayDate : displayDate};
}();
	
//dailyEvent will be a struck with {startDate : .... , endDate : .....}	
//weeklyEvent will be a struck with {startDate : .... , weeks : .....}
//monthlyEvent will be a struck with {startDate : .... , months : ....}
//startMdate and endMdate will be yyyymmdd format yyyy = year mm = month dd = day string
function eventInDisplayMonth(dailyEvent,weeklyEvent,monthlyEvent,startMdate,endMdate){
	
	var list = [];
	
	if(dailyEvent)
		dailyEvent.forEach(function(eventDate){
			if(inDay(startMdate,endMdate,eventDate.startDate,eventDate.endDate))
				list.push(eventDate);
		});
		
	if(weeklyEvent)
		weeklyEvent.forEach(function(eventDate){
			if(inDay(startMdate,endMdate,eventDate.startDate,eventDate.endDate))
				list.push(eventDate);
		});
	
	if(monthlyEvent)
		monthlyEvent.forEach(function(eventDate){
			if(inDay(startMdate,endMdate,eventDate.startDate,eventDate.endDate))
				list.push(eventDate);
		});		
	list.sort(function(a,b){
		var c1 = a.startDate.year + (a.startDate.month < 10 ? "0"+a.startDate.month : a.startDate.month)  + (a.startDate.day < 10 ? "0"+a.startDate.day: a.startDate.day) + a.startTime;
		var c2 = b.startDate.year + (b.startDate.month < 10 ? "0"+b.startDate.month : b.startDate.month) + (b.startDate.day < 10 ? "0"+b.startDate.day : b.startDate.day) + b.startTime;
		return c1.localeCompare(c2);
	});
	return list;
};

//this function will a fix all elements when window size change
function reSize(){
	var npMFontScale = 0.5833333333333334;
	var dmFontScale = 0.4166666666666667;
	var headerScale = 0.07220216606498195;
	var bodyScale = 0.927797833935018;
	var weekScale = 0.024067388688327317;
	var weekDScale = 0.8888888888888888;
		
	$("header").css({"height" : ($("#calendar").height()*headerScale)+"px"});
	$("main").css({"height" : ($("#calendar").height()*bodyScale)+"px"});
	$(".week").css({"height" : ($("#calendar").height()*weekScale)+"px"});
	$("#month").css({"height" : ($("main").height()-$(".week").height())+"px"});
	

	$("#nextMonth").css({"font-size" : ($("header").height()*npMFontScale)+"px"});
	$("#prevMonth").css({"font-size" : ($("header").height()*npMFontScale)+"px"});
	$("#displayMonth").css({"font-size" : ($("header").height()*dmFontScale)+"px"});
	$(".weekDay").css({"font-size" : ($(".week").height()*weekDScale)+"px"});
	
	monthTdResize();
	
	if($("#Event").is(":visible"))
		sideBarResize();
}

function monthTdResize(){
	var tdMonthScale = 0.9631894138262689;
	
	$(".tdSizeMonth").css({"width" : ($(".CMday").width()*tdMonthScale)+"px"});
}

function sideBarResize(){
	var tdEventScale = 0.915057915057915;
	var dFontScale = 0.05165289256198347;
	
	$("#from").each(function(){$(this).css({"font-size" : $("#eventInTD table").width()*dFontScale+"px"})});
	$("#to").each(function(){$(this).css({"font-size" : $("#eventInTD table").width()*dFontScale+"px"})});
	$(".tdSizeEvent").css({"width" : ($("#eventInTD").width()*tdEventScale)+"px"});
}

//thios function will check if event is in the month dates range and if event is in the day
function inDay(startMdate,endMdate,startE,endE){
	
	var startEdate = ""+startE.year+(startE.month < 10 ? "0"+startE.month : startE.month) +(startE.day < 10 ? "0"+startE.day : startE.day);
	var endEdate = ""+endE.year+(endE.month < 10 ? "0"+endE.month : endE.month) + (endE.day < 10 ? "0"+endE.day : endE.day);
	
	if(startEdate.localeCompare(endMdate) != 1 && endEdate.localeCompare(startMdate) != -1)
			return true;
	false;
}


	
	$(document).ready(function() {calendar.initModule($("#calendar")); });