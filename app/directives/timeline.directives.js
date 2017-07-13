app.directive('timeline', function(){
  return {
    restrict: 'E',
    scope: {
      data: "="
    },
    templateUrl: "directives/timeline.directives.html"
  }
});
