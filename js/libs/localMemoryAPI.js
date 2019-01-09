var localMemoryAPI = function() {
    var eventType;
    
    var init = function() {
        if(window.localStorage) {
            eventType = {};
            for(var i = 0; i < localStorage.length; i++)
                eventType[localStorage.key(i)] = true;
        }
        else{
            console.log("No Storage API available");
        }
    };
    
    var createObject = function(type) {
        if(!localStorage.getItem(type))
            localStorage.setItem(type, JSON.stringify({}));
        eventType[type] = true;
    };
    
	//3 type's Daily , Weekly , Monthly
	//Obj is all Event of the Type
    var save = function(type, obj) {
        if(!eventType[type])
            console.log("No such object " + type);
        else {
			var dateObject = [];
			for( var i = 0 ; i < obj.length ; i++)
				if(obj[i].title !== null)
					dateObject.push(obj[i]);
            localStorage.setItem(type, JSON.stringify(dateObject));
        }
    };
    
	//Get all Event of in that Type
    var getAll = function(type) {
        if(!eventType[type])
            console.log("No such object " + type);
        else {
            var res = [];
            var dataString = localStorage.getItem(type);
            var dataObject = JSON.parse(dataString);
			for(var item in dataObject)
				res.push(dataObject[item]);
            return res;
        }
    };
   
    return {
        init : init,
        createObject : createObject,
        save : save,
        getAll : getAll,
    };
    
}();


/*key = Type
Type Daily - array ID 0,1,2.. {0 : {event}....
Type Weely - array ID 0,1,2.. {0 : {event}....	

*/	