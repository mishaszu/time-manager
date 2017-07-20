app.factory('GoogleCalendarApi', ['$http', function($http){
  var CLIENT_ID = "",
      DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
      SCOPES = "https://www.googleapis.com/auth/calendar.readonly",
      gapiStatus = false,
      eventsArray = [],
      button = document.getElementById('login'),
      button2 = document.getElementById('logout');

  function setUpClient (client) {
    CLIENT_ID = client;
  }

  function handleClientLoad() {
    gapi.load('client:auth2', initClient);
  }

  function initClient() {
    gapi.client.init({
      discoveryDocs: DISCOVERY_DOCS,
      clientId: CLIENT_ID,
      scope: SCOPES
    }).then(function () {
      gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
      updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
      button.onclick = signIn;
      button2.onclick = logout;
    });
  }

  function updateSigninStatus(status) {
    var arr = [];
    if (status) {
      console.log("zalogowany");
      var res = getCalendarList();
      res.then(function(data){
        eventsArray = filterCalendarsIds(data);
        Promise.all(eventsArray).then(function(data){
          data.forEach(function(cal){
            if(cal.result.items.length) {
              cal.result.items.forEach(function(event){
                if (event.summary, event.start.dateTime, event.end.dateTime) {
                  var preparedDiv = prepareAndDisplay(event.summary, event.start.dateTime, event.end.dateTime);
                  if (preparedDiv) {
                    arr.push(preparedDiv);
                  }
                }
              });
            }
          });
          var sortedElements = sortElementArray(arr);
          marginateFromTop(sortedElements);
        })
      });
    }
    else {
      console.log("niezalogowany");
    }
  }

  function signIn () {
   	if (!gapi.auth2.getAuthInstance().isSignedIn.get()) {
      gapi.auth2.getAuthInstance().signIn()
    } else {
      console.log("logged");
    }
  }
  
  function logout () {
    gapi.auth2.getAuthInstance().signOut();
  }

  function getCalendarList () {
    var request = gapi.client.calendar.calendarList.list();
    var response = new Promise(function(resolve) {
      request.execute(function(resp) {
        resolve(resp.items);
      });
    });
    return response;;
  }

  function filterCalendarsIds (array) {
    var calendarsArr = array,
        eventsArr = [],
        date = (new Date()).toISOString();
    calendarsArr.forEach(function(calendar) {
      eventsArr.push(eventsRequest(calendar.id, date));
    });
    return eventsArr;
  }

  function eventsRequest (id, date) {
    return gapi.client.calendar.events.list({
      'calendarId': id,
      'timeMin': date,
      'showDeleted': false,
      'singleEvents': true,
      'maxResults': 10,
      'orderBy': 'startTime'
    });
  }

  function prepareAndDisplay (id, start, end) {
    var root = document.getElementById("displayer");
    var tStart = new Date(start),
        tEnd = new Date(end),
        startMargin = 0;
        diff = (tEnd.getTime() - tStart.getTime())/60000;

    var hour = tStart.getHours(),
        minutes = tStart.getMinutes();
    if (new Date().getDay() === tStart.getDay()) {
      var element = document.createElement("div");

      startMargin = (hour - 1) * 100;
      if (minutes > 0) {
        startMargin += minutes*100/60;
      }

      element.style.width = diff*100/60 + "px";
      element.style.height = "30px";
      element.style.position = "absolute";
      element.style.marginLeft = startMargin + "px";
      element.className = "event";
      var text = document.createTextNode(id);
      element.TM = {};
      element.TM.start = startMargin;
      element.TM.end = startMargin + diff*100/60;
      element.TM.wRatio = 0;
      element.appendChild(text);
      root.appendChild(element);
      return element;
    }

    function cWidth(minutes) {
      return minutes * 100 / 60;
    }
  }

  function sortElementArray (arr) {
    var map = [],
        id = 0;
    arr.sort(function(a, b) {
      return a.TM.start - b.TM.start;
    });
    arr.forEach(function(ev){
      ev.TM.id = id;
      ev.TM.r = -1;
      id++;
    })
    
    var item = arr[arr.length - 1];
    var startTime = item.start;
    var arr2 = [item];
    var x = arr.length - 2;
    for (; x >= 0; x--) {
      var item2 = arr[x];
      if (item2.TM.end > item.TM.start) {
        arr2.push(item2);
      } else {
        map.push(arr2);
        item = item2;
        arr2 = [item];
        x = item.TM.id;
      }
      if (x === 0) {
        map.push(arr2);
      }
    }
    return map;
  } 
  
  function marginateFromTop(arr) {
    arr.forEach(function(subArr){
      var length = subArr.length; 
      var marginArr = [];
      for (var x = 0, max = length; x < max; x++) {
        var number = x;
        marginArr.push(number*30);
      }
      subArr.forEach(function(ev){
        var index = marginArr.indexOf(ev.TM.r);
        if (index > -1) {
          var margin = marginArr.splice(index,1);
          ev.style.marginTop = ev.TM.r + "px";
        } else {
          ev.TM.r = marginArr[0];
          ev.style.marginTop = ev.TM.r + "px";
          marginArr.splice(0,1);
        }
      });
    })
  }


  return {
    setUpClient: setUpClient,
    handleClientLoad: handleClientLoad,
    eventsArray: eventsArray
  }
}]);
