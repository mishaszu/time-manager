app.factory('getJson', ['$http', function($http){

  return $http.get('../priv_settings/google.json')
    .success(function(data){return data})
    .error(function(error){return error});
}]);
