app.controller('MainController', ['$scope', 'getJson', 'GoogleCalendarApi', function($scope, getJson, GoogleCalendarApi) {
	$scope.test = "Hello world";
	getJson.then(
	  function(data){
      GoogleCalendarApi.setUpClient(data.data.key);
      GoogleCalendarApi.handleClientLoad();
	  }
	);
}]);
