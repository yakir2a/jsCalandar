
var dFontScale = 0.05165289256198347;
 
var eventUI = function () {

    var configMap = {
        inputSection:		
		"<div id = 'Event'>" +
			"<br>"+
			"<br>"+
			"<div class = 'input'>"+
				"<input type='text' id='title' class = 'title' placeholder='Title'>" +
				"<textarea type='text' id='description' class ='description' rows = '4' placeholder='Description'></textarea>" +
			"</div>"+

			"<br>" +

			"<div class='switch-field'>" +
			
				"<input type='radio' id='switch_daily' name='switch_3' checked/>" +
				"<label for='switch_daily'>Daily</label>" +
			
				"<input type='radio' id='switch_weekly' name='switch_3'/>" +
				"<label for='switch_weekly'>Weekly</label>" +

				"<input type='radio' id='switch_monthly' name='switch_3' />" +
				"<label for='switch_monthly'>Monthly</label>" +

			"</div>" +
			
			"<br>" +

			" <div id = 'repeat' class = 'eventType'>" +
			"</div>"+
		"</div>"+
		
		"<hr>"+
		
		"<div id = 'eventInTD'>" +
			"<div id = 'dayHeader'>"+
			"</div>"+

			"<br>" +

			"<table>" +
			"</table>"+
		"</div>"
    };

    var stateMap = { $container: null };
	
	
	
    var initModule = function ($container) {
        stateMap.$container = $container;
        stateMap.$container.html(configMap.inputSection);
        $("#switch_daily").click(eventType);
        $("#switch_weekly").click(eventType);
        $("#switch_monthly").click(eventType);
		
		$("#switch_daily").click();
		
		$("#Event").hide();
		$("#eventInTD").hide();
		
    };




    return { initModule: initModule };

}();

function addEvent(e){
	var temp = $("#"+e.target.id).parent().attr('id');
	var newEvent;
	switch (temp){
		case 'daily':
			if($("#title").val() == '' || $("#beginD").val() == '' || $("#endD").val() == ''){
				alert("please fill all the necessary fields");
				return;
			}
			if(!($("#beginD").val()).localeCompare($("#endD").val())){
				alert("End Date cant be befor Start Date");
				return;
			}
			newEvent = {type : 'daily',
						title : $("#title").val(),
						description : $("#description").val(),
						startDate : getDate($("#beginD").val()),
						endDate : getDate($("#endD").val()),
						startTime : getTime($("#beginD").val()),
						endTime : getTime($("#endD").val()),
						eventColor : $("#colorful").val()};
			localMemoryAPI.createObject('daily');
			var list = localMemoryAPI.getAll('daily');
			list[list.length] = newEvent;
			localMemoryAPI.save('daily',list);
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
			newEvent = {type : 'weekly',
						title : $("#title").val(),
						description : $("#description").val(),
						startDate : getDate($("#beginD").val()),
						duration :  $("#numrepeat").val(),
						weekDay : weekDay,
						endDate : dateLib.endDate(getDate($("#beginD").val()),{type : 'weeks' , amount : $("#numrepeat").val()}),
						startTime : getTime($("#beginD").val()),
						endTime : getTime($("#beginD").val()),
						eventColor : $("#colorful").val()};
			localMemoryAPI.createObject('weekly');
			var list = localMemoryAPI.getAll('weekly');
			list[list.length] = newEvent;
			localMemoryAPI.save('weekly',list);
		
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
			newEvent = {type : 'monthly',
						title : $("#title").val(),
						description : $("#description").val(),
						startDate : getDate($("#beginD").val()),
						duration :  $("#numrepeat").val(),
						weekDay : weekDay,
						endDate : dateLib.endDate(getDate($("#beginD").val()),{type : 'months' , amount : $("#numrepeat").val()}),
						startTime : getTime($("#beginD").val()),
						endTime : getTime($("#beginD").val()),
						eventColor : $("#colorful").val()};
			localMemoryAPI.createObject('monthly');
			var list = localMemoryAPI.getAll('monthly');
			list[list.length] = newEvent;
			localMemoryAPI.save('monthly',list);	
		break;
	}
	cancel(null);
	calendar.fillMonth(calendar.displayDate);
};

//will take datetime-local format and will return a struct {year , month , day}
function getDate(dateTform){
	res = dateTform.substr(0,10);
	res = res.split("-");
	return {year : parseInt(res[0]),
			month : parseInt(res[1]),
			day : parseInt(res[2])};
}
//will take datetime-local format and will return a "HH:HH" time
function getTime(dateTform){
	res = dateTform.slice(11);
	return res;
}
function eventType(e){
		var oldStats = { title : $("#title").val(),
						description : $("#description").val(),
						beginD : $("#beginD").val(),
						eventColor : $("#colorful").val()};
	$("#repeat").empty();
    switch (e.target.id) {
        case 'switch_weekly':
            $("#repeat").append(
                "<div id = 'weekly' class = 'pickday'>" +

				"<input type = 'datetime-local' id = 'beginD' class = 'date' required >" +
				"<br>"+
				"<br>"+
					"<div class = 'weekBoxs'>" +
						"<label for = 'sun'>S</label>" + "<br>" +
						"<input type='checkbox' class = 'check' id = 'sun'>" +
					"</div>"+
					"<div class = 'weekBoxs'>" +
						"<label for = 'mon'>M</label>" + "<br>" +
						"<input type='checkbox' class = 'check' id = 'mon'>" +
					"</div>"+
					"<div class = 'weekBoxs'>" +
						"<label for = 'tue'>T</label>" + "<br>" +
						"<input type='checkbox' class = 'check' id = 'tue'>" +
					"</div>"+
					"<div class = 'weekBoxs'>" +
						"<label for = 'wen'>W</label>" + "<br>" +
						"<input type='checkbox' class = 'check' id = 'wen'>" +
					"</div>"+
					"<div class = 'weekBoxs'>" +
						"<label for = 'thu'>T</label>" + "<br>" +
						"<input type='checkbox' class = 'check' id = 'thu'>" +
					"</div>"+
					"<div class = 'weekBoxs'>" +
						"<label for = 'fri'>F</label>" + "<br>" +
						"<input type='checkbox' class = 'check' id = 'fri'>" +
					"</div>"+
					"<div class = 'weekBoxs'>" +
						"<label for = 'sat'>S</label>" + "<br>" +
						"<input type='checkbox' class = 'check' id = 'sat'>" +
					"</div>"+	
					"<br>"+
					"<br>"+
					"<div class = 'addion'>"+
						"<label for = 'quantity'></lable>"+
						"<input id = 'numrepeat' class = 'numrepeat' type='number' placeholder='Repeat' name='quantity'>" +
						"<input id = 'colorful' type='color' value = '#ff0000' name='favcolor'>" +
					"</div>"+

						"<button  id = 'ok' class='action ok'>Ok</button>"+
						"<button  id = 'cancel' class='action cancel'>Cancel</button>"+
				"</div>"
            );		
            break;

        case "switch_monthly":
            $("#repeat").append(
                "<div id = 'monthly' class = 'pickday'>" +

				"<input type = 'datetime-local' id = 'beginD' class = 'date' required >" +
				"<br>"+
				"<br>"+
					"<div class = 'weekBoxs'>" +
						"<label for = 'sun'>S</label>" + "<br>" +
						"<input type='checkbox' class = 'check' id = 'sun'>" +
					"</div>"+
					"<div class = 'weekBoxs'>" +
						"<label for = 'mon'>M</label>" + "<br>" +
						"<input type='checkbox' class = 'check' id = 'mon'>" +
					"</div>"+
					"<div class = 'weekBoxs'>" +
						"<label for = 'tue'>T</label>" + "<br>" +
						"<input type='checkbox' class = 'check' id = 'tue'>" +
					"</div>"+
					"<div class = 'weekBoxs'>" +
						"<label for = 'wen'>W</label>" + "<br>" +
						"<input type='checkbox' class = 'check' id = 'wen'>" +
					"</div>"+
					"<div class = 'weekBoxs'>" +
						"<label for = 'thu'>T</label>" + "<br>" +
						"<input type='checkbox' class = 'check' id = 'thu'>" +
					"</div>"+
					"<div class = 'weekBoxs'>" +
						"<label for = 'fri'>F</label>" + "<br>" +
						"<input type='checkbox' class = 'check' id = 'fri'>" +
					"</div>"+
					"<div class = 'weekBoxs'>" +
						"<label for = 'sat'>S</label>" + "<br>" +
						"<input type='checkbox' class = 'check' id = 'sat'>" +
					"</div>"+	
					"<br>"+
					"<br>"+
					"<div class = 'addion'>"+
						"<label for = 'quantity'></lable>"+
						"<input id = 'numrepeat' class = 'numrepeat' type='number' placeholder='Repeat' name='quantity'>" +
						"<input id = 'colorful' type='color' value = '#ff0000' name='favcolor'>" +
					"</div>"+

						"<button  id = 'ok' class='action ok'>Ok</button>"+
						"<button  id = 'cancel' class='action cancel'>Cancel</button>"+
				"</div>"
            );

            break;
        default:
            $("#repeat").append(
                " <div id = 'daily' class = 'pickday'>" +
					"<input type = 'datetime-local' id = 'beginD' class = 'date' required >" +
					"<input type = 'datetime-local' id = 'endD' class = 'date' required >" +
					"<input id = 'colorful' type='color' value = '#ff0000' class = 'color' name='favcolor'>" +
					
					"<br>"+
					"<br>"+
					"<br>"+
					"<br>"+
					"<button  id = 'ok' class='action ok'>Ok</button>"+
					"<button  id = 'cancel' class='action cancel'>Cancel</button>"+
                "</div>"		
            );
            break;  
    }
	$("#title").val(oldStats.title);
	$("#description").val(oldStats.description);
	$("#beginD").val(oldStats.beginD);
	$("#colorful").val(oldStats.eventColor);	
	$("#cancel").click(cancel);
	$("#ok").click(addEvent);
};


function cancel(e){
	$("#calendar").animate({left : "10%"}, 500 ,function(){
												$("#calendar").css({"left" : "10%"});
												});
	$("#eventInTD").hide();
	$("#Event").hide();
	$("#title").val("");
	$("#description").val("");
	$("#beginD").val("");
	$("#eventHandler").animate({width : "0"} , 500 , function(){
													$("#eventHandler").hide();
													});
};