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
    if (status) {
      console.log("zalogowany");
      var res = getCalendarList();
      res.then(function(data){
        eventsArray = filterCalendarsIds(data);
        Promise.all(eventsArray).then(function(data){
          console.log(data);
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

  return {
    setUpClient: setUpClient,
    handleClientLoad: handleClientLoad,
    eventsArray: eventsArray
  }
}]);
